import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./utils/dbConnect.js";
import userRoute from "./routes/user.routes.js"
import taskRoute from "./routes/tasks.routes.js"
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CORS,
  })
);

app.use("/api/v1/user",userRoute)
app.use("/api/v1/task",taskRoute)

export default app;