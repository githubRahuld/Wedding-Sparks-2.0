import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// https://wedding-spark.vercel.app/
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import vendorRouter from "./routes/vendor.routes.js";

//router declaratioon
app.use("/users", userRouter);
app.use("/vendors", vendorRouter);

export { app };
