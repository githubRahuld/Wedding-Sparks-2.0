import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Catering",
        "Photography",
        "Videography",
        "Decoration",
        "Music/DJ",
        "Makeup Artists",
        "Bridal Wear",
        "Groom Wear",
        "Event Planning",
        "Transportation",
        "Florists",
        "Lighting & Effects",
        "Wedding Cakes",
        "Invitations & Stationery",
        "Entertainment",
        "Security Services",
        "Officiants",
        "Wedding Venues",
        "Destination Wedding Planners",
        "Wedding Rentals",
        "Bar Services",
        "Wedding Photobooks/Albums",
        "Henna Artists",
        "Pre-Wedding Shoots",
        "Honeymoon Planners",
        "Gift Registry Services",
        "Hair Stylists",
        "Sound & Audio",
      ],
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Custom validation to ensure at least one image is provided
listingSchema.path("images").validate((images) => {
  return images.length > 0;
}, "At least one image is required.");

export const Listing = mongoose.model("Listing", listingSchema);
