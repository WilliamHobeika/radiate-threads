"use server"; //means we're using server actions because we can't connect to the db if we don't use it

import { revalidatePath } from "next/cache";

import User from "../models/user.model";
import Thread from "../models/thread.model";

import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";

//interfaces
export interface UpdateUserProps {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export interface fetchUsersProps {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

//db actions
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UpdateUserProps): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true } //it's a database operation that will update an existing row if a specific value already exists in the table; or insert a new row if the specified value doesn't exist
    );

    if (path === "/profile/edit") {
      //aka if the user is editing his profile
      revalidatePath(path); //updating the cached data to make sure updates happen immediately on the nextjs app
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path: 'communities',
    //   model: Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserThreads(userId: string) {
  try {
    connectToDB();

    //find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name id image",
        },
      },
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Error fetching user threads ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: fetchUsersProps) {
  try {
    connectToDB();

    //skiping:
    //calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    //create a case insensitive regular expression for when we searching the users
    const regex = new RegExp(searchString, "i"); // "i" means case insensitive

    //fetching:
    //this is a query that, when executed, retrieves all users except the one having userId aka the currentUser only if there isn't a searchString
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    //searching:
    //if there is a searchString, retrieve the users which in addition to not being our current user, have this name or username (case insensitive)
    if (searchString.trim() !== "") {
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
    }

    //sorting:
    const sortOptions = { createdAt: sortBy };

    //combining the queries
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    //getting the total user count
    const totalUsersCount = await User.countDocuments(query);

    //final db action
    const users = await usersQuery.exec();

    //checking if there's a next page
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Error to fetch users ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    //find all thread created by the user
    const userThreads = await Thread.find({ author: userId });

    //collect all the child thread ids (replies) from the "children"
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    //after finding all the children of all the threads this user created, we will get the replies excluding the ones this user made
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch activity ${error.message}`);
  }
}
