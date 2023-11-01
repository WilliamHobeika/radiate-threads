"use server"; //means we're using server actions because we can't connect to the db if we don't use it

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

//props
export interface CreateThreadProps {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export interface addCommentToThreadProps {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

//db actions
export async function createThread({
  text,
  author,
  communityId,
  path,
}: CreateThreadProps) {
  try {
    connectToDB();

    const createdThread = await Thread.create({ text, author, community: null });

    //update user model: update the user document which posted this thread and push this thread id to its threads attribtue
    //its not enough to just create the thread, we have to push it to that specific user who created it
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path); //updating the cached data to make sure updates happen immediately on the nextjs app
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  connectToDB();

  //calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  //fetch the posts that have no parents (top-level threads...)
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  //fetch the number of threads (main ones not comments)
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  //executing the query of fetching the posts
  const posts = await postsQuery.exec();

  //checking if there's a next page
  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchThreadById(id: string) {
  try {
    connectToDB();

    //populate community
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread ${error.message}`);
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: addCommentToThreadProps) {
  try {
    connectToDB();

    //find the original thread by its id
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found");
    }

    //create a new thread with the comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    //save the new commentThread
    const savedCommentThread = await commentThread.save();

    //update the original thread to include the new comment
    originalThread.children.push(savedCommentThread._id);

    //save the original thread
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to thread ${error.message}`);
  }
}
