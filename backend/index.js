import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: "https://virtual-assistant-0dz3.onrender.com",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/health", (req, res) => res.json({ ok: true }));

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Render's free tier spins the instance down after ~15 idle minutes,
  // making the next request wait ~50s for a cold boot. Pinging our own
  // public URL every 10 minutes counts as traffic and keeps it awake.
  // RENDER_EXTERNAL_URL is set automatically by Render.
  const external = process.env.RENDER_EXTERNAL_URL;
  if (external) {
    setInterval(() => {
      fetch(`${external}/health`).catch(() => {});
    }, 10 * 60 * 1000);
    console.log("Keep-alive ping enabled");
  }
});
