import mongoose, { Schema } from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";

const bookingSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Booking name is required"],
    },
    location: {
      country: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
    },
    fromDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    toDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return this.fromDate <= value;
        },
        message: "End date must be after start date",
      },
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: [true, "Vendor ID is required"],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: [true, "Customer ID is required"],
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    isPaymentDone: {
      type: Boolean,
      default: "false",
    },
  },
  { timestamps: true }
);

// Add indexes for faster query performance
bookingSchema.index({ vendorId: 1 });
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ fromDate: 1, toDate: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
