import React, { useState } from "react";
import {
  FaHome,
  FaUserAlt,
  FaBars,
  FaClipboardList,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutUser } from "@/store/authSlice";
import Cookies from "js-cookie";
import Logo from "../Button/Logo";
import { BiSolidDashboard } from "react-icons/bi";
import { IoCreate } from "react-icons/io5";

function Navbar() {
  const userType = useSelector((state) => state.auth.userType);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${baseUrl}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      dispatch(logoutUser());
      navigate("/auth/login");
    } catch (err) {
      console.log(err);
      dispatch(logoutUser());
      navigate("/auth/login");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-primary text-white shadow-md  ">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Brand Name */}
        <Link to="/users/home">
          <Logo />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/users/home"
            className="flex items-center hover:text-gray-300"
          >
            <FaHome className="mr-2" /> Home
          </Link>

          {userType === "customer" && isLoggedIn && (
            <Link
              to="/users/dashboard"
              className="flex items-center hover:text-gray-300"
            >
              <FaClipboardList className="mr-2" /> My Bookings
            </Link>
          )}

          {userType === "vendor" && isLoggedIn && (
            <>
              <Link
                to="/vendors/dashboard"
                className="flex items-center hover:text-gray-300"
              >
                <BiSolidDashboard className="mr-2" /> Dashboard
              </Link>
              <Link
                to="/vendors/listings"
                className="flex items-center hover:text-gray-300"
              >
                <FaClipboardList className="mr-2" /> Manage Listings
              </Link>
              <Link
                to="/vendors/create-listing"
                className="flex items-center hover:text-gray-300"
              >
                <IoCreate className="mr-2" /> Create Listings
              </Link>
            </>
          )}

          {/* Account Menu */}
          <div className="relative">
            {isLoggedIn ? (
              <button
                onClick={toggleDropdown}
                className="flex items-center hover:text-gray-300 px-2"
              >
                <FaUserAlt className="mr-2" /> Account
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center hover:text-gray-300 px-2"
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
            )}

            {isDropdownOpen && isLoggedIn && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-xl shadow-lg z-10">
                <Link
                  to="/users/profile"
                  className="flex items-center px-4 py-2 w-full hover:bg-gray-200 rounded-xl"
                >
                  <FaUserAlt className="mr-2 text-gray-700" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full text-white rounded-xl bg-red-500 px-4 py-2 hover:bg-red-600"
                >
                  <FaSignOutAlt className="mr-2 text-white" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMobileMenu} className="md:hidden text-white">
          <FaBars className="text-2xl mr-2" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary text-white px-4 py-4 space-y-4">
          <Link
            to="/users/home"
            className="block hover:text-gray-300"
            onClick={toggleMobileMenu}
          >
            <FaHome className="inline mr-2 " /> Home
          </Link>

          {userType === "customer" && isLoggedIn && (
            <Link
              to="/users/dashboard"
              className="block hover:text-gray-300"
              onClick={toggleMobileMenu}
            >
              <BiSolidDashboard className="inline mr-2" /> My Bookings
            </Link>
          )}

          {userType === "vendor" && isLoggedIn && (
            <>
              <Link
                to="/vendors/dashboard"
                className="block hover:text-gray-300"
                onClick={toggleMobileMenu}
              >
                <BiSolidDashboard className="inline mr-2" /> Dashboard
              </Link>
              <Link
                to="/vendors/listings"
                className="block hover:text-gray-300"
                onClick={toggleMobileMenu}
              >
                <FaClipboardList className="inline mr-2" /> Manage Listings
              </Link>
              <Link
                to="/vendors/create-listing"
                className="block hover:text-gray-300"
                onClick={toggleMobileMenu}
              >
                <FaClipboardList className="inline mr-2" /> Create Listings
              </Link>
            </>
          )}

          {/* Account Menu */}
          <div>
            {isLoggedIn ? (
              <>
                <Link
                  to="/users/profile"
                  className="block hover:text-gray-300"
                  onClick={toggleMobileMenu}
                >
                  <FaUserAlt className="inline mr-2" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-white rounded-xl bg-red-500 px-4 py-2 hover:bg-red-600"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="block w-full text-left text-white rounded-xl bg-blue-500 px-4 py-2 hover:bg-blue-600"
                onClick={toggleMobileMenu}
              >
                <FaSignInAlt className="inline mr-2" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
