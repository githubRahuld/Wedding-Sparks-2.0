import { Router } from "express";
import {
  bookingVendor,
  getAllBookingsByCustomer,
  getBookingById,
  getBookingsByVendorId,
  updateBookingStatus,
} from "../controllers/booking.controllers.js";
import { vendorVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, bookingVendor);
router.route("/").get(verifyJWT, getAllBookingsByCustomer);
router.route("/vendor/:vendorId").get(vendorVerifyJWT, getBookingsByVendorId);
router.route("/:bookingId").put(vendorVerifyJWT, updateBookingStatus);
router.route("/:bookingId").get(verifyJWT, getBookingById);

export default router;
