import { Vendor } from "../models/vendor.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Auth } from "../models/auth.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Listing } from "../models/listing.models.js";

const addVendorDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { businessDetails, policies } = req.body;

  try {
    // Check if the vendor already exists
    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Vendor details already exist for this user."
          )
        );
    }

    // Create a new vendor entry
    const newVendor = new Vendor({
      userId,
      businessDetails,
      policies,
    });

    // Save the vendor details
    const savedVendor = await newVendor.save();

    //change the onboarding Status in auth model after adding vendor details
    const auth = await Auth.findOne({ _id: userId });
    auth.onboardingCompleted = true;
    await auth.save();

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { data: savedVendor },
          "Vendor details added successfully."
        )
      );
  } catch (error) {
    console.error("Error adding vendor details:", error);

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "An error occurred while adding vendor details."
        )
      );
  }
});

const addReview = async (req, res) => {
  const { vendorId, listingId } = req.params;
  const { rating, comment } = req.body;

  try {
    const customerId = req.user._id;

    //check for vendor listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Listing not found."));
    }

    // Find the vendor
    const vendor = await Vendor.findOne({ userId: vendorId });

    if (!vendor) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Vendor not found."));
    }

    // Check if images are provided
    const uploadedImagesUrls = [];
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images)
        ? req.files.images // Multiple images
        : [req.files.images]; // Single image

      for (const image of images) {
        const uploadedImage = await uploadOnCloudinary(
          image.data,
          "weddingspark/reviews"
        );

        if (!uploadedImage) {
          return res
            .status(500)
            .json(
              new ApiResponse(
                500,
                null,
                "Failed to upload image. Please retry."
              )
            );
        }

        uploadedImagesUrls.push(uploadedImage.url);
      }
    }

    const newReview = {
      customerId,
      listingId,
      rating,
      comment,
      images: uploadedImagesUrls,
    };

    // Add the new review
    vendor.reviews.push(newReview);

    // Recalculate the average rating
    vendor.averageRating =
      vendor.reviews.reduce((sum, review) => sum + review.rating, 0) /
      vendor.reviews.length;

    await vendor.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, { data: vendor }, "Review added successfully")
      );
  } catch (error) {
    console.error("Error adding review:", error);

    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "An error occurred while adding the review")
      );
  }
};

const getVendorDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findOne({ userId: vendorId })
      .populate("userId", "name email phoneNumber")
      .populate("reviews.customerId", "name email"); // Include customer details in reviews

    if (!vendor) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Vendor not found."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: vendor },
          "Vendor details fetched successfully."
        )
      );
  } catch (error) {
    console.error("Error fetching vendor details:", error);

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "An error occurred while fetching vendor details"
        )
      );
  }
};

const getListingReviews = async (req, res) => {
  const { vendorId, listingId } = req.params;

  try {
    const vendor = await Vendor.findOne({
      userId: vendorId,
    }).populate({
      path: "reviews.customerId",
      select: "name email avatar", // Include customer details if needed
    });

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor or listing not found." });
    }

    // Filter reviews specific to the listingId
    const listingReviews = vendor.reviews.filter(
      (review) => review.listingId.toString() === listingId
    );

    if (listingReviews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No reviews found for this listing.",
        reviews: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully.",
      reviews: listingReviews,
    });
  } catch (error) {
    console.error("Error fetching listing reviews:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the reviews.",
    });
  }
};

export { addVendorDetails, addReview, getVendorDetails, getListingReviews };
