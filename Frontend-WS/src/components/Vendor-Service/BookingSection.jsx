import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineLogin, AiOutlineCloseCircle } from "react-icons/ai";
import { ImFinder } from "react-icons/im";
import { MdBookmarkAdded } from "react-icons/md";

const BookingSection = ({ vendor, listing }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleBookingClick = () => {
    if (isLoggedIn) {
      navigate("/users/booking", { state: { vendor, listing } });
    } else {
      setMenuOpen(true);
    }
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleCancel = () => {
    setMenuOpen(false);
  };

  return (
    <div className={`relative ${isMenuOpen ? "overflow-hidden" : ""}`}>
      {/* Book Now Button */}
      <div className={`mt-6 text-center ${isMenuOpen ? "filter blur-md" : ""}`}>
        <Button
          onClick={handleBookingClick}
          variant="solid"
          className="px-8 py-3 bg-blue-600 text-white rounded-full text-xl hover:bg-blue-700 transition duration-300"
        >
          <MdBookmarkAdded />
          Book Now
        </Button>
      </div>

      {/* Conditional Centered Menu */}
      {isMenuOpen && !isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6">
            {/* Close Icon */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              <AiOutlineCloseCircle size={24} />
            </button>

            {/* Modal Header */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Login Required
            </h3>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Please log in to proceed with the booking.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleLogin}
                variant="solid"
                className="bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-700 transition duration-300"
              >
                <AiOutlineLogin size={20} />
                Login
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border border-gray-300 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-200 transition duration-300"
              >
                <ImFinder size={20} />
                Explore More
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSection;
