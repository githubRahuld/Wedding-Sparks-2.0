import { asyncHandler } from "../utils/asyncHandler.js";
import { Auth } from "../models/auth.models.js";
import { Listing } from "../models/listing.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { Vendor as VendorDetails } from "../models/vendor.models.js";

const createListing = asyncHandler(async (req, res) => {
  const { name, category, country, state, city, price, description } = req.body;

  const user = await Auth.findById(req.user._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  // Find the vendor by userId
  const vendor = await VendorDetails.findOne({ userId: user._id });
  console.log("Vendor: ", vendor);
  if (!vendor) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          401,
          null,
          "Please fill onboarding form first to List your service."
        )
      );
  }

  // Check if all required fields are present
  if (
    [name, category, country, state, city, price, description].some(
      (field) => !field?.trim()
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }

  // Check if images are provided
  if (!req.files || !req.files.images) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Images are required"));
  }

  const images = req.files.images;
  const uploadedImagesUrls = [];

  // Upload each image to Cloudinary
  for (const image of images) {
    const uploadedImage = await uploadOnCloudinary(
      image.data,
      "weddingspark/listings"
    );

    if (!uploadedImage) {
      // Handle error during image upload
      return res
        .status(500)
        .json(
          new ApiResponse(500, null, "Failed to upload image ,Please re-try")
        );
    }

    uploadedImagesUrls.push(uploadedImage.url);
  }

  // Ensure services array exists
  if (!vendor.services) {
    vendor.services = [];
  }

  // Create a new service listing
  const newListing = {
    category,
    description,
    price: Number(price),
    images: uploadedImagesUrls,
  };

  // Push the new listing into the services array
  vendor.services.push(newListing);

  // Save the updated vendor details
  const updatedVendor = await vendor.save();

  try {
    // Create the listing in the database
    const result = await Listing.create({
      name,
      vendorId: user._id,
      category,
      location: { country, state, city },
      price,
      description,
      images: uploadedImagesUrls,
    });

    if (!result) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Internal server error"));
    }

    // Successfully created the listing
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Vendor listed successfully"));
  } catch (error) {
    // Catch unexpected errors and send a general error response
    console.error("Error creating listing: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
});

// all listings for a vendor
const allListing = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res
      .status(201)
      .json(new ApiResponse(201, null, "Invalid vendor ID"));
  }

  try {
    // Fetch listings associated with the vendor ID
    const vendorListings = await Listing.find({ vendorId: vendorId });

    if (!vendorListings || vendorListings.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No listings found for this vendor"));
    }
    const countListing = await Listing.find({ vendorId }).countDocuments();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { vendorListings, "Total count": countListing },
          "Fetched all listings successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching listings:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
});

// Get all listings(Total listings)
const getAllListings = asyncHandler(async (req, res) => {
  try {
    const { category, location, vendorId, page = 1, limit = 10 } = req.query;

    // Build the query object
    const query = {};
    if (category) {
      query.category = new RegExp(`^${category}$`, "i"); // not case sensitive
    }
    if (location) {
      query["location.city"] = new RegExp(`^${location}$`, "i");
    }
    if (vendorId) {
      query.vendorId = vendorId;
    }

    if (vendorId && !mongoose.Types.ObjectId.isValid(vendorId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid vendor ID"));
    }

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const totalListings = await Listing.countDocuments(query);

    // Fetch listings from the database
    const listings = await Listing.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    if (listings.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No listings found"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          listings,
          pagination: {
            total: totalListings,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(totalListings / limitNumber),
          },
        },
        "Fetched all listings successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching listings: ", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "An error occurred while fetching listings")
      );
  }
});

const getAvailableCategories = asyncHandler(async (req, res) => {
  try {
    // Fetch distinct categories from the database
    const categories = await Listing.distinct("category");

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No categories found with available vendors",
      });
    }

    return res.status(200).json({
      success: true,
      data: categories.map((category) => ({
        name: category,
        slug: category.toLowerCase().replace(/ /g, "-"), // Generate a URL-friendly slug
      })),
      message: "Fetched available categories successfully",
    });
  } catch (error) {
    console.error("Error fetching available categories: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching categories",
    });
  }
});

const getListingById = asyncHandler(async (req, res) => {
  try {
    const { listingId } = req.params;

    // Validate listingId
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid listing ID"));
    }

    const listing = await Listing.findById(listingId).populate(
      "vendorId",
      "-password -__v"
    );

    if (!listing) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Listing not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { listing },
          "Fetched listing with vendor details successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "An error occurred while fetching the listing"
        )
      );
  }
});

export {
  createListing,
  allListing,
  getAllListings,
  getAvailableCategories,
  getListingById,
};
