import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, //a thread has an author with a objectId refering to the user table
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  }, //a thread could belong to a community since required is not specified
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: { type: String }, //in case the thread is a comment, it needs to point to its parent
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ], //a thread can have several comments (because it's an array of object ids) and the reference of the object ids is the Thread table itself (recursion) since each thread comment can also have a thread comment within it
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema); // first time we call it, it will use the second function since there's no "User" model in the db. later one it will use the first function

export default Thread;
