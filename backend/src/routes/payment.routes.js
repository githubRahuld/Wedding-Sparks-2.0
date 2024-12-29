import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPaymentOrder,
  getPaymentDetails,
  refundPayment,
  sendPaymentSuccessEmail,
  verifyPayment,
} from "../controllers/payment.controllers.js";

const router = Router();

router.route("/create-order").post(verifyJWT, createPaymentOrder);
router.route("/verify").post(verifyJWT, verifyPayment);
router.route("/").post(verifyJWT, getPaymentDetails);
router.route("/refund").post(verifyJWT, refundPayment);
router.route("/send-email").post(verifyJWT, sendPaymentSuccessEmail);

export default router;
