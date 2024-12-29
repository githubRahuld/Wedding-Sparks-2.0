import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogin, AiOutlineCloseCircle } from "react-icons/ai";
import { ImFinder } from "react-icons/im";
import { useSelector } from "react-redux";

const PriceSection = ({ price, vendor, listing }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Format the price in Indian number format
  const formattedPrice = new Intl.NumberFormat("en-IN").format(price);

  const navigate = useNavigate();
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
    <>
      {/* Price Section */}
      <div className="flex flex-col bg-gray-50 rounded-3xl">
        <div className="px-6 py-8 sm:p-10 sm:pb-6">
          <div className="grid items-center justify-center w-full grid-cols-1 text-left">
            <div>
              <h2 className="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl">
                Book Now
              </h2>
              <p className="mt-2 text-sm text-gray-500">Price</p>
            </div>
            <div className="mt-6">
              <p>
                <span className="text-5xl font-light tracking-tight text-black">
                  ₹{formattedPrice}{" "}
                </span>
                <span className="text-base font-medium text-gray-500">
                  {" "}
                  /per day{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex px-6 pb-8 sm:px-8">
          <button
            onClick={handleBookingClick}
            className="flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black text-sm"
          >
            Book Now
          </button>
        </div>
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
              <button
                onClick={handleLogin}
                className="flex items-center px-6 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 text-sm font-medium transition duration-300"
              >
                <AiOutlineLogin className="mr-2" size={20} />
                Login
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-6 py-2.5 border border-gray-300 rounded-full hover:bg-gray-200 text-sm font-medium transition duration-300"
              >
                <ImFinder size={20} className="mr-2" />
                Explore More
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PriceSection;
