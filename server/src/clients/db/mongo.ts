import { DATABASE_CONFIG } from "@/configs/env.js";
import mongoose from "mongoose";

mongoose.connection.on("error", (error) =>
  console.error("MongoDB runtime error:", error)
);
mongoose.connection.on("disconnected", () =>
  console.warn("MongoDB disconnected. Reconnecting...")
);

connectDB();
export async function connectDB() {
  const dbName = DATABASE_CONFIG.NAME;
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DATABASE_CONFIG.URL, { dbName });
    console.log(`MongoDB connected: ${dbName}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
