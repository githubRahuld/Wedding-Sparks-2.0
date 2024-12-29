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
import { Button } from "@/components/ui/button";
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
import { useSelector } from "react-redux";

const VendorDash = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const vendorId = useSelector((state) => state.auth.user._id);
  console.log(vendorId);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all bookings by customer
  const fetchBookings = async () => {
    setLoading(true);
    await axios
      .get(`${baseUrl}/api/v1/bookings/vendor/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .then((response) => {
        setLoading(false);

        setBookings(response.data.bookings || []);
      })
      .catch((err) => {
        setError("Failed to fetch bookings.", err);
        setLoading(false);
      });
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    console.log(newStatus);

    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/bookings/${bookingId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      // Update booking status in local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      console.log(response.data.bookings);
    } catch (err) {
      setError("Failed to change booking status.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        {error}
      </Alert>
    );
  }

  return (
    <>
      {loading ? (
        <LoveLoading />
      ) : bookings?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <FaClipboardList className="text-gray-400 text-6xl mb-4" />
          <p className="text-lg font-semibold text-gray-700">
            No bookings found at the moment.
          </p>
          <p className="text-sm text-gray-500">
            Once you start receiving bookings, they will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg ">
          <Table className="w-full table-auto border-collapse bg-gray-100">
            <TableHeader className="bg-slate-800">
              <TableRow>
                <TableHead className="px-4 py-3 text-left font-semibold text-white">
                  Customer Name
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
              {bookings?.map((booking) => (
                <TableRow
                  key={booking._id}
                  className={`hover:bg-gray-50 ${
                    booking.status === "Rejected" ? "bg-red-100" : ""
                  }`}
                >
                  <TableCell className="px-4 py-4">
                    {booking.customerId.name}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {booking.listingId.name}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {`${booking.listingId.location.city}, ${booking.listingId.location.state}, ${booking.listingId.location.country}`}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {new Date(booking.fromDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    to{" "}
                    {new Date(booking.toDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
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
                  <TableCell className="px-4 py-4">
                    {booking.isPaymentDone === "true" ? (
                      <span className="text-green-500 flex items-center">
                        <FaCheckCircle className="mr-2" /> Paid
                      </span>
                    ) : (
                      <span className="text-yellow-500 flex items-center">
                        <FaClock className="mr-2" /> Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    {booking.status === "Approved" ? (
                      <Button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        disabled
                      >
                        Approved
                      </Button>
                    ) : booking.status === "Pending" ? (
                      <>
                        <Button
                          className="bg-blue-700 w-full text-white px-4 py-2 mb-2 rounded hover:bg-green-800"
                          onClick={() =>
                            handleStatusChange(booking._id, "Approved")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          className="bg-red-700 w-full text-white px-4 py-2 rounded hover:bg-red-800"
                          onClick={() =>
                            handleStatusChange(booking._id, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      </>
                    ) : booking.status === "Rejected" ? (
                      <Button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        disabled
                      >
                        Rejected
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default VendorDash;
