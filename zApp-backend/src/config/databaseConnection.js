import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MongoDB = process.env.MONGO_URI;

mongoose.Promise = global.Promise;

//___ DATABASE CONNECTION ___
const connectDB = async () => {
  try {
    await mongoose.connect(MongoDB);
    console.log("MongoDB Connected to:", mongoose.connection.name);

    process.on("exit", async () => {
      if (mongoose.connection.readyState === 1) {
        await closeDB();
        console.log("MongoDB Connection Closed");
      }
    });
  } catch (err) {
    console.error("Connection Error:", err.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
};

export {connectDB, closeDB}