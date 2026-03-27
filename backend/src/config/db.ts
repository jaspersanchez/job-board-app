import mongoose from "mongoose";
import { env } from "../utils/env";

const connectDB = async () => {
  const mongoURI = env.mongoUri;
  try {
    await mongoose.connect(mongoURI);

    console.log("connected to DB");
  } catch (error) {
    if (error instanceof Error) {
      console.error("mongoDB connection error: ", error.message);
    } else {
      console.error("unknown error: ", error);
    }
  }
};

export default connectDB;
