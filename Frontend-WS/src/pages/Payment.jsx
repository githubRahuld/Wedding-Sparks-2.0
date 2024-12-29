import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { FaMoneyBillWave } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { FaRupeeSign } from "react-icons/fa";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { toast, Toaster } from "react-hot-toast";
import CircleLoading from "@/components/Loading/CircleLoading";

const Payment = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const VITE_RAZORPAY_KEY_ID = import.meta.env.RAZORPAY_KEY_ID;

  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/v1/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        console.log("Booking details: ", data.data);

        const { fromDate, toDate, listingId } = data.data;
        const price = listingId.price || 0;
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        const daysDifference = (endDate - startDate) / (1000 * 3600 * 24);
        const calculatedAmount = price * daysDifference;

        // Update the state with the booking details and calculated amount
        setBookingDetails(data.data);
        setTotalAmount(calculatedAmount);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Failed to fetch booking details.");
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Handle payment
  const handlePayment = async () => {
    setLoading(true);

    try {
      const { data: orderResponse } = await axios.post(
        `${baseUrl}/api/v1/payments/create-order`,
        {
          bookingId,
          customerId: bookingDetails?.customerId._id,
          amount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const orderId = orderResponse.data.id;

      const options = {
        key: VITE_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Wedding Sparks",
        description: "Booking Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
              `${baseUrl}/api/v1/payments/verify`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                customerId: bookingDetails?.customerId._id,
                bookingId,
                amount: totalAmount,
              },
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
              }
            );

            if (verificationResponse.data.success) {
              await axios.post(
                `${baseUrl}/api/v1/payments/send-email`,
                {
                  customerEmail: bookingDetails.customerId.email,
                  bookingDetails: {
                    customerName: bookingDetails.customerId.name,
                    vendorName: bookingDetails.listingId.name,
                    location: `${bookingDetails.location.city}, ${bookingDetails.location.state}`,
                    fromDate: bookingDetails.fromDate,
                    toDate: bookingDetails.toDate,
                    totalPrice: totalAmount,
                    listingName: bookingDetails.listingId.name,
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                  },
                }
              );

              console.log("Payment success email sent successfully!");
              navigate("/users/dashboard");
            } else {
              toast.error("Payment Verification Failed.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Failed to verify payment.");
          }
        },
        prefill: {
          name: bookingDetails?.customerId.name || "Your Name",
          email: bookingDetails?.customerId.email || "your-email@example.com",
          contact: "1234567890",
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="payment-page container mt-10 mb-10 mx-auto px-4 py-6 bg-gray-100 rounded-xl shadow-xl">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-4xl font-semibold text-center text-gray-700 font-poopins mb-6">
        Complete Your Payment{" "}
        <FaMoneyBillWave className="inline-block text-4xl ml-2" />
      </h1>
      {bookingDetails ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Details */}
          <Card className="shadow-lg hover:shadow-2xl transition duration-300 ease-in-out rounded-lg p-4">
            <CardHeader className="border-b-2 pb-2 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Booking Details
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Name */}
                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-700 font-medium">
                    <strong>Name:</strong>
                  </p>
                  <p className="text-xl  text-gray-800">
                    {bookingDetails.name}
                  </p>
                </div>

                {/* Vendor */}
                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-700 font-medium">
                    <strong>Vendor:</strong>
                  </p>
                  <p className="text-xl  text-gray-800">
                    {bookingDetails.listingId.name}
                  </p>
                </div>

                {/* Location */}
                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-700 font-medium">
                    <strong>Location:</strong>
                  </p>
                  <p className="text-xl  text-gray-800">
                    {bookingDetails.listingId.location.city},{" "}
                    {bookingDetails.listingId.location.state}
                  </p>
                </div>

                {/* Booking Dates */}
                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-700 font-medium">
                    <strong>Booking Dates:</strong>
                  </p>
                  <p className="text-xl font-semibold text-gray-800">
                    <span className="text-blue-600">
                      {new Date(bookingDetails.fromDate).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                    <span className="text-gray-600 mx-2">to</span>
                    <span className="text-blue-600">
                      {new Date(bookingDetails.toDate).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card className="shadow-lg hover:shadow-2xl transition duration-300 ease-in-out rounded-lg p-4">
            <CardHeader className="border-b-2 pb-2 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Price Details
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Price per Day */}
                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-700">
                    <strong>Price per Day:</strong>
                  </p>
                  <p className="text-xl font-semibold text-green-600">
                    <FaRupeeSign className="inline text-sm" />
                    {formatCurrency(bookingDetails.listingId.price)}
                  </p>
                </div>

                {/* Total Booking Days */}
                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-700">
                    <strong>Total Booking Days:</strong>
                  </p>
                  <p className="text-xl font-semibold text-gray-800">
                    {Math.floor(
                      (new Date(bookingDetails.toDate) -
                        new Date(bookingDetails.fromDate)) /
                        (1000 * 3600 * 24)
                    )}{" "}
                    Days
                  </p>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-700">
                    <strong>Total Price:</strong>
                  </p>
                  <p className="text-xl font-semibold text-red-600">
                    <FaRupeeSign className="inline text-sm" />
                    {formatCurrency(totalAmount)} {"/-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full md:w-1/2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {loading ? (
                <CircleLoading className="text-white" />
              ) : (
                <>
                  <GiPayMoney className="mr-2 text-xl" /> Pay Now
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-6">
          <CircleLoading />
        </div>
      )}
    </div>
  );
};

export default Payment;
