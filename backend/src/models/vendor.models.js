import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const VendorDetailsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  businessDetails: {
    businessName: String,
    yearsOfExperience: Number,
    areasOfOperation: [String],
    certifications: [String],
  },
  services: [
    {
      category: String,
      description: String,
      price: Number,
      images: [String],
    },
  ],
  policies: {
    cancellation: String,
    refund: String,
    paymentTerms: String,
  },
  reviews: [ReviewSchema],
  averageRating: {
    type: Number,
    default: 0,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Vendor = mongoose.model("Vendor", VendorDetailsSchema);
