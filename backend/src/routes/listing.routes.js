import { Router } from "express";
import {
  allListing,
  createListing,
  getAllListings,
  getAvailableCategories,
  getListingById,
} from "../controllers/listing.controllers.js";
import { vendorVerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(vendorVerifyJWT, createListing);
router.route("/").get(vendorVerifyJWT, allListing);
router.route("/all").get(getAllListings);
router.route("/categories").get(getAvailableCategories);
router.route("/:listingId").get(getListingById);

export default router;
