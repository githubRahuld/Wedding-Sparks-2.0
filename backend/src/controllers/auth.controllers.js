import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Auth } from "../models/auth.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await Auth.findById(userId);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    await user.save({ validateBeforeSave: false });
    //validateBeforeSave:false = jisse validation check na ho kyouki we didnt give all fields here

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, phoneNumber, role } =
    req.body;

  try {
    if (
      [name, email, password, phoneNumber, role].some((field) => !field?.trim())
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All fields are required"));
    }

    const allowedRoles = ["customer", "vendor", "admin"];
    if (!allowedRoles.includes(role)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Invalid role. Allowed roles: customer, vendor, admin"
          )
        );
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Pasword and confirm password must match")
        );
    }
    // Check if user already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "User with this email is already registered"
          )
        );
    }

    // Check if avatar is provided
    if (!req.files || !req.files.avatar) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Avatar is required"));
    }

    const avatarFile = req.files.avatar;
    const avatarPath = avatarFile.data;

    // Upload avatar to Cloudinary
    const uploadedAvatar = await uploadOnCloudinary(
      avatarPath,
      "weddingSparks/avatars"
    );
    if (!uploadedAvatar) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Error uploading avatar"));
    }

    // Create user
    const newUser = await Auth.create({
      name,
      email,
      password,
      phoneNumber,
      avatar: uploadedAvatar.url,
      role,
    });

    const responseUser = await Auth.findById(newUser._id).select(
      "-password -refreshToken"
    );

    res
      .status(201)
      .json(new ApiResponse(201, responseUser, "User registered successfully"));
  } catch (error) {
    console.error("Error during user registration:", error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error occurred"));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((field) => !field?.trim())) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email and password are required"));
    }

    const user = await Auth.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email not registered"));
    }

    // Validate the password
    const passwordCheck = await user.isPasswordCorrect(password);

    if (!passwordCheck) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid password"));
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Send secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    const loginUser = await Auth.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: loginUser, accessToken, refreshToken, isLogin: true },
          "User login successful"
        )
      );
  } catch (err) {
    console.error("Error at user login: ", err.message);

    res
      .status(500)
      .json(new ApiResponse(500, null, "An unexpected error occurred"));
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  // In verifyJWT method we add user in req
  await Auth.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true, // so that we get updated values
    }
  );

  // now remove from cache

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await Auth.findById(req?.user?._id);
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const userData = await Auth.findById({ _id: user._id }).select(
      "-password -cPassword -refreshToken"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, userData, "User details found successfully"));
  } catch (error) {
    throw new ApiError(500, "something went wrong with user");
  }
});

const checkOnboarding = asyncHandler(async (req, res) => {
  try {
    const user = await Auth.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let completed = false;

    // Only check onboarding status for vendors
    if (user.role === "vendor") {
      if (user.onboardingCompleted) {
        completed = true;
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, completed, "Vendor onboarding status"));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!decodedToken) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  const user = await Auth.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new ApiError(401, "Refresh Token was expired please login");
  }

  const { accessToken, newRefreshToken } = generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        201,
        { accessToken, refreshToken: newRefreshToken },
        "Access Token refreshed"
      )
    );
});
export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  checkOnboarding,
  refreshAccessToken,
};
