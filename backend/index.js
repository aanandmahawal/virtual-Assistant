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

// Simple health check — open /health in a browser to see the DB state.
app.get("/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({ ok: true, db: states[app.get("mongoose_state") ?? 0] });
});

// Connect to the database FIRST, then start serving. A server that starts
// before its database is a server that answers every request with timeouts.
connectDb().then(() => {
  const mongoose = import("mongoose").then((m) =>
    app.set("mongoose_state", m.default.connection.readyState)
  );
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
