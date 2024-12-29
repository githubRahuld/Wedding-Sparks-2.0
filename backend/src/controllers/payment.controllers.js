import { Booking } from "../models/booking.models.js";
import { Payment } from "../models/payment.model.js";
import Razorpay from "razorpay";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";
import { sendEmail } from "./notificationService.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createPaymentAndLinkBooking = async (bookingId, paymentDetails) => {
  const payment = await Payment.create({ ...paymentDetails, bookingId });

  if (payment) {
    await Booking.findByIdAndUpdate(bookingId, { paymentId: payment._id });
  }
};

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { bookingId, customerId, amount } = req.body;
  console.log(req.body);

  if (!bookingId || !customerId || !amount || amount <= 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid payment request"));
  }

  try {
    // Create Razorpay order
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(201).json(new ApiResponse(201, order, "Order created"));
  } catch (error) {
    console.error("Error creating payment order: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to create payment order"));
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    customerId,
    bookingId,
    amount,
  } = req.body;

  console.log("Payment verification request:", req.body);

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid payment verification request"));
  }

  try {
    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpaySignature) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid payment signature"));
    }

    // Save payment details to DB
    const payment = await Payment.create({
      razorpayOrderId,
      customerId,
      bookingId,
      amount,
      razorpayPaymentId,
      razorpaySignature,
      status: "Paid",
    });

    console.log("Payment verified:", payment);

    if (!payment) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Payment record not found"));
    }

    //change payment status to true in Booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { isPaymentDone: true },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Booking record not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, payment, "Payment verified successfully"));
  } catch (error) {
    console.error("Error verifying payment: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to verify payment"));
  }
});

const getPaymentDetails = asyncHandler(async (req, res) => {
  const { bookingId, customerId } = req.query;

  if (!bookingId && !customerId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Provide bookingId or customerId"));
  }

  try {
    const query = {};
    if (bookingId) query.bookingId = bookingId;
    if (customerId) query.customerId = customerId;

    const payments = await Payment.find(query);

    if (!payments.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No payment records found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, payments, "Payment records retrieved"));
  } catch (error) {
    console.error("Error fetching payment details: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch payment details"));
  }
});

const refundPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Payment ID is required"));
  }

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment || payment.status !== "Paid") {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid or unpaid payment record"));
    }

    // Initiate refund with Razorpay
    const refund = await razorpayInstance.payments.refund(
      payment.razorpayPaymentId
    );

    // Update payment status to "Refunded"
    payment.status = "Refunded";
    await payment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, refund, "Payment refunded successfully"));
  } catch (error) {
    console.error("Error processing refund: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to process refund"));
  }
});

const sendPaymentSuccessEmail = asyncHandler(async (req, res) => {
  const { customerEmail, bookingDetails } = req.body;
  try {
    // Create a dynamic HTML email template
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Payment Successful!</h2>
        <p>Dear ${bookingDetails.customerName},</p>
        <p>Thank you for your payment for the booking <strong>${bookingDetails.listingName}</strong>.</p>
        <p>Here are your booking details:</p>
        <ul>
          <li><strong>Vendor:</strong> ${bookingDetails.vendorName}</li>
          <li><strong>Location:</strong> ${bookingDetails.location}</li>
          <li><strong>Booking Dates:</strong> ${new Date(
            bookingDetails.fromDate
          ).toLocaleDateString()} to ${new Date(
            bookingDetails.toDate
          ).toLocaleDateString()}</li>
          <li><strong>Total Price:</strong> ₹${bookingDetails.totalPrice}</li>
        </ul>
        <p>If you have any questions, feel free to contact us.</p>
        <p style="color: #888;">Regards,<br/>Wedding Sparks Team</p>
      </div>
    `;

    // Call sendEmail utility
    await sendEmail(
      customerEmail,
      emailTemplate,
      "Payment Successful - Wedding Sparks"
    );

    console.log("Payment success email sent successfully!");
  } catch (error) {
    console.error("Error sending payment success email:", error);
    throw new Error("Failed to send payment success email.");
  }
});

export {
  createPaymentAndLinkBooking,
  createPaymentOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
  sendPaymentSuccessEmail,
};
