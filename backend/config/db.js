import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(uri);
    isConnected = true;
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    isConnected = false;
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

export default connectDB;
