import { DATABASE_URL } from "@/configs/env.js";
import mongoose from "mongoose";

mongoose.connection.on("error", (error) =>
  console.error("MongoDB runtime error:", error)
);
mongoose.connection.on("disconnected", () =>
  console.warn("MongoDB disconnected. Reconnecting...")
);

connectDB();
export async function connectDB() {
  const dbName = "trexind";
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DATABASE_URL, { dbName });
    console.log(`MongoDB connected: ${dbName}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
