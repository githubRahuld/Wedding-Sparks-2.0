import { Router } from "express";
import { vendorVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addReview,
  addVendorDetails,
  getListingReviews,
  getVendorDetails,
} from "../controllers/vendor.controllers.js";

const router = Router();

router.route("/add").post(vendorVerifyJWT, addVendorDetails);
router
  .route("/add-review/:vendorId/listing/:listingId")
  .post(verifyJWT, addReview);
router.route("/:vendorId").get(getVendorDetails);
router.route("/:vendorId/listing/:listingId").get(getListingReviews);

export default router;
