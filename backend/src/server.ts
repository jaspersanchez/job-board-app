import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "./utils/env";
import connectDB from "./config/db";

const port = env.port;

const app = express();

app.use(express.json());
app.use(cors);

// logger
// define routes

// run server
(async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`app is running on port ${port}`);
  });
})();
