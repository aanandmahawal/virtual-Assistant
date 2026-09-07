import mongoose from "mongoose";

const connectDb = async () => {
  try {
    // Fail fast: if Atlas is unreachable (wrong URL, blocked IP), error out
    // in 10s at CONNECT time with a clear reason — instead of every request
    // buffering for 10s and dying with a confusing timeout.
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("db connected");
  } catch (error) {
    console.error("MongoDB connection FAILED:", error.message);
    console.error(
      "Most common cause on Render: Atlas Network Access does not allow " +
      "this server's IP. Fix: Atlas -> Network Access -> Allow 0.0.0.0/0."
    );
    // A server without a database serves nothing but errors — exit so the
    // platform shows a failed deploy instead of a broken-but-green one.
    process.exit(1);
  }
};

export default connectDb;
