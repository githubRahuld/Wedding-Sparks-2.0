import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
const app = express();

dotenv.config({ path: "./.env" });

// cors configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true, 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Ensure preflight (OPTIONS) requests also use the same CORS settings
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static("public"));

app.use(cookieParser());
app.use(fileUpload());

// routes import
import authRouter from "./routes/auth.routes.js";
import listingRouter from "./routes/listing.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import vendorRouter from "./routes/vendor.routes.js";
import paymentRouter from "./routes/payment.routes.js";

//router declaratioon

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/listing", listingRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/vendors", vendorRouter);
app.use("/api/v1/payments", paymentRouter);

export { app };
