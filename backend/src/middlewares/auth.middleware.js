import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Auth } from "../models/auth.models.js";
import { ApiError } from "../utils/apiError.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.headers["authorization"];

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Auth.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(411)
      .json({ message: error?.message || "Invalid Access Token" });
  }
});

const vendorVerifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.headers["authorization"];

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Auth.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    if (user.role !== "vendor") {
      throw new ApiError(401, "Not authorized to access this route");
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(411)
      .json({ message: error?.message || "Invalid Access Token" });
  }
});

const adminVerifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Auth.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (user.role !== "admin") {
      throw new ApiError(401, "Not authorized to access this route");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access Token");
  }
});

export { verifyJWT, vendorVerifyJWT, adminVerifyJWT };
