import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { env } from "./utils/env";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import morgan from "morgan";

const port = env.port;

const app = express();

// logger
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// check health
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

// define routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// run server
(async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`app is running on port ${port}`);
  });
})();
