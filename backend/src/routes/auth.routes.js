import { Router } from "express";
import {
  checkOnboarding,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controllers.js";
import { vendorVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").get(verifyJWT, refreshAccessToken);
router.route("/check-onbaording").get(vendorVerifyJWT, checkOnboarding);

export default router;
