import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert } from "@/components/ui/alert";
import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarTimes,
  FaClock,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa"; // React icons
import Cookies from "js-cookie";
import LoveLoading from "@/components/Loading/LoveLoading";
import PaymentButton from "@/components/Button/PaymentButton";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch all bookings by customer
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/bookings`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });
        console.log(response.data.data);

        setBookings(response.data.data); // Assuming response structure is { data: bookings }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const isNewBooking = (createdAt) => {
    const now = new Date();
    const bookingTime = new Date(createdAt);
    const diffInMinutes = (now - bookingTime) / (1000 * 60);
    return diffInMinutes <= 60; // Less than or equal to 1 hour
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 font-aguDisplay flex items-center justify-center">
        <FaCalendarAlt className="text-blue-600 mr-3" />
        Your Bookings
        <FaClipboardList className="text-green-600 ml-3" />
      </h1>

      {loading ? (
        <LoveLoading />
      ) : bookings.length === 0 ? (
        <Alert variant="info" className="mb-4">
          No bookings found for this customer.
        </Alert>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <Table className="w-full table-auto border-collapse bg-gray-100">
            <TableHeader className="bg-slate-800">
              <TableRow>
                <TableHead className="px-4 py-3 text-left font-semibold text-white">
                  Vendor Name
                </TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold text-white">
                  Listing Name
                </TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold text-white">
                  Location
                </TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold text-white">
                  Booking Dates
                </TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold text-white">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold text-white">
                  Payment Status
                </TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold text-white">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id} className="hover:bg-gray-50">
                  <TableCell className="px-4 py-4 flex items-center">
                    {booking.vendorId.name}
                    {isNewBooking(booking.createdAt) && (
                      <span className="ml-2 text-sm text-white bg-red-500 px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {booking.listingId.name}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {`${booking.location.city}, ${booking.location.state}, ${booking.location.country}`}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {new Date(booking.fromDate).toLocaleDateString("en-US", {
                      weekday: "long", // "Monday"
                      year: "numeric", // "2024"
                      month: "long", // "December"
                      day: "numeric", // "23"
                    })}{" "}
                    to{" "}
                    {new Date(booking.toDate).toLocaleDateString("en-US", {
                      weekday: "long", // "Monday"
                      year: "numeric", // "2024"
                      month: "long", // "December"
                      day: "numeric", // "23"
                    })}
                  </TableCell>

                  {/* Status with icon */}
                  <TableCell className="px-4 py-4">
                    {booking.status === "Approved" ? (
                      <span className="text-green-500 flex items-center">
                        <FaCheckCircle className="mr-2" /> Approved
                      </span>
                    ) : booking.status === "Pending" ? (
                      <span className="text-yellow-500 flex items-center">
                        <FaCalendarTimes className="mr-2" /> Pending
                      </span>
                    ) : booking.status === "Rejected" ? (
                      <span className="text-red-500 flex items-center">
                        <FaTimesCircle className="mr-2" /> Rejected
                      </span>
                    ) : null}
                  </TableCell>

                  {/* Payment Status with icon */}
                  <TableCell className="px-4 py-4">
                    {booking.isPaymentDone ? (
                      <span className="text-green-500 flex items-center">
                        <FaCheckCircle className="mr-2" /> Paid
                      </span>
                    ) : (
                      <span className="text-yellow-500 flex items-center">
                        <FaClock className="mr-2" /> Pending
                      </span>
                    )}
                  </TableCell>

                  {/* Action Button */}
                  <TableCell className="px-4 py-4 text-center">
                    {booking.status === "Approved" ? (
                      booking.isPaymentDone ? (
                        <PaymentButton text={"Done"} />
                      ) : (
                        <button
                          className="pay-now-btn text-black font-semibold py-3 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-blue-400"
                          onClick={() => {
                            navigate(`/users/payment/${booking._id}`);
                          }}
                        >
                          Pay Now
                        </button>
                      )
                    ) : (
                      <PaymentButton text={"Waiting"} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
