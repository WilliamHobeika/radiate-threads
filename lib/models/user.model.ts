import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ], //a user can post several threads (because it's an array of object ids) and the reference of the object ids is the Thread table
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ], //a user can belong to many communities (because it's an array of object ids) and the reference of the object ids is the Community table
});

const User = mongoose.models.User || mongoose.model("User", userSchema); // first time we call it, it will use the second function since there's no "User" model in the db. later one it will use the first function

export default User;
