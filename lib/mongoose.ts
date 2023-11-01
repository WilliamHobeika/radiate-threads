import mongoose from "mongoose";

let isConnected = false; //variable to check the connection status

//connecting to the mongodb database
export const connectToDB = async () => {
  mongoose.set("strictQuery", true); //this is to prevent unknown field queries

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found"); //if there isn't a MongoDB URL (in the .env) to connect to
  if (isConnected) return console.log("Already connected to MongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("1" + error);
  }
};
