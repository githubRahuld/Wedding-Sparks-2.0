import { Auth } from "../models/auth.models.js";
import { Booking } from "../models/booking.models.js";
import { Listing } from "../models/listing.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const bookingVendor = asyncHandler(async (req, res) => {
  const { name, location, fromDate, toDate, vendorId, listingId } = req.body;

  try {
    // Validate required fields
    if (
      [name, location, fromDate, toDate, vendorId, listingId].some(
        (field) =>
          field === undefined ||
          field === null ||
          (typeof field === "string" && !field.trim())
      )
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All fields are required."));
    }

    // Validate dates
    if (new Date(fromDate) >= new Date(toDate)) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "'From Date' must be before 'To Date'.")
        );
    }

    //find overloping Booking Dates
    // Find overlapping bookings
    const overlappingBooking = await Booking.findOne({
      vendorId,
      $or: [
        {
          fromDate: { $lte: new Date(toDate) },
          toDate: { $gte: new Date(fromDate) },
        },
      ],
    });

    if (overlappingBooking) {
      return res
        .status(409) // Conflict
        .json(
          new ApiResponse(
            409,
            null,
            "Overlapping Booking Dates. Please book for other dates."
          )
        );
    }

    // Check if the vendor exists
    const vendor = await Auth.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Vendor not found."));
    }

    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing || listing.vendorId.toString() !== vendorId) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Listing not found for the vendor."));
    }

    // Create the booking document
    const booking = await Booking.create({
      name,
      location,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      vendorId,
      customerId: req.user._id,
      listingId,
      status: "Pending",
    });

    // Return success response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          booking,
          "You have successfully booked the vendor."
        )
      );
  } catch (error) {
    console.error("Error while booking vendor: ", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "An error occurred while booking the vendor."
        )
      );
  }
});

const getAllBookingsByCustomer = asyncHandler(async (req, res) => {
  try {
    const customerId = req.user._id;

    const bookings = await Booking.find({ customerId })
      .populate("listingId", "name location price") // Populate listing details
      .populate("vendorId", "name email") // Populate vendor details
      .sort({ createdAt: -1 }); // Sort by most recent bookings

    if (bookings.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No bookings found for this customer."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, bookings, "Fetched all bookings successfully.")
      );
  } catch (error) {
    console.error("Error fetching bookings: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch bookings."));
  }
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ["Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid status value"));
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Booking not found"));
    }

    // Check if the vendor is authorized to update this booking
    if (booking.vendorId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            null,
            "You are not authorized to update this booking"
          )
        );
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          booking,
          `Booking ${status.toLowerCase()} successfully`
        )
      );
  } catch (error) {
    console.error("Error updating booking status: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to update booking status"));
  }
});

const getBookingsByVendorId = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    // Only owner can see bookings
    const user = await Auth.findById(req.user._id);

    if (vendorId !== user._id.toString()) {
      return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }

    // Fetch all bookings for the given vendorId
    const bookings = await Booking.find({ vendorId })
      .populate("customerId", "name email") // Populate customer details (adjust as needed)
      .populate("listingId", "name location") // Populate listing details (adjust as needed)
      .populate("paymentId", "status amount") // Populate payment details (if available)
      .sort({ fromDate: -1 }); // Sort by 'fromDate' descending

    console.log("bookings: ", bookings);

    if (!bookings || bookings.length == 0) {
      return res
        .status(201)
        .json(new ApiResponse(201, {}, "No bookings found for this vendor"));
    }

    const countListing = await Booking.find({ vendorId }).countDocuments();

    return res.status(200).json({
      bookings,
      total: countListing,
      message: "All Bookings fetched",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching bookings by vendor ID:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// Controller to fetch booking details by bookingId
const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  // check for authorization
  const user = await Booking.findOne({ customerId: req.user._id });

  if (!user) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }

  if (!bookingId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Booking ID is required"));
  }

  try {
    const booking = await Booking.findById(bookingId)
      .populate("customerId", "name email phone") // Customer details
      .populate("listingId", "name location price") // Listing details
      .populate("paymentId", "amount status transactionDate"); // Payment details

    if (!booking) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Booking not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, booking, "Booking details fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch booking details"));
  }
});

export {
  bookingVendor,
  getAllBookingsByCustomer,
  updateBookingStatus,
  getBookingsByVendorId,
  getBookingById,
};
