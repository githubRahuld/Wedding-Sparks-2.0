import React, { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { baseUrl } from "../../../urls.js";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userType = useSelector((state) => state.auth.userType);
  const data = useSelector((state) => state.auth.user);
  console.log("User type: ", userType);
  console.log("allData: ", data);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    let endpoint = "";

    if (userType === "user") {
      endpoint = `${baseUrl}/users/get-user/${data.user._id}`;
    } else if (userType === "vendor") {
      endpoint = `${baseUrl}/vendors/get-user/${data.user._id}`;
    }

    setTimeout(() => {
      axios
        .get(endpoint)
        .then((res) => {
          console.log("res at navbar:", res?.data?.data);
          setName(res.data.data.name);
          setAvatar(res.data.data.avatar);
        })
        .catch((err) => console.error(err));
    }, 2000);
  });

  console.log(name);
  console.log(avatar);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        userType === "user"
          ? `${baseUrl}/users/logout`
<<<<<<< HEAD
          : `${baseUrl}/vendors/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
=======
          : `${baseUrl}/vendors/logout`
>>>>>>> 00f58456e34592a3a709e20aad7503d7f1a36b33
      );

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      dispatch(logout()); // Let the action handle potential data clearing
      console.log(response.data.message);

      if (userType === "user") {
        navigate("/users/login"); // Or "/vendors/login" depending on user type
      } else {
        navigate("/vendors/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/users/login");
    }
  };

  return (
    <>
      <div className="navbar bg-base-100">
        <div className={`navbar-start font-poppins text-xl`}>
          {isLoggedIn && (
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    className="text-white hover:bg-yellow-300 hover:text-black"
                    to={userType === "user" ? "/users/home" : "/vendors/home"}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white hover:bg-yellow-300 hover:text-black"
                    to={userType === "user" ? "/users/about" : "/vendors/about"}
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-white hover:bg-yellow-300 hover:text-black"
                    to={
                      userType === "user" ? "/users/booking" : "/vendors/about"
                    }
                  >
                    {userType === "user" ? "Book" : "About"}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white hover:bg-yellow-300 hover:text-black"
                    to={
                      userType === "user"
                        ? "/users/uDashboard"
                        : "/vendors/vDashboard"
                    }
                  >
                    Dashboard
                  </Link>
                </li>
                {userType === "vendor" && (
                  <li>
                    <Link
                      className="text-white hover:bg-yellow-300 hover:text-black"
                      to={"/vendors/allListing"}
                    >
                      My Listing
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          {userType === "user" ? (
            <Link
              to="/users/home"
              className="btn btn-ghost text-4xl font-caveat text-yellow-400 hover:bg-none hover:text-yellow-500 hover:bg-base-100"
            >
              Wedding Spark
              <HeartHandshake color="#ff0000" />
            </Link>
          ) : (
            <Link
              to="/vendors/home"
              className="btn btn-ghost text-4xl font-caveat text-sky-400 hover:bg-none hover:text-sky-300 hover:bg-base-100"
            >
              Wedding Spark
            </Link>
          )}
        </div>
        {isLoggedIn && (
          <div className="navbar-center hidden lg:flex text-xl text-white font-poppins">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link
                  className="text-white hover:bg-yellow-300 hover:text-black"
                  to={userType === "user" ? "/users/home" : "/vendors/home"}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-white hover:bg-yellow-300 hover:text-black"
                  to={userType === "user" ? "/users/about" : "/vendors/about"}
                >
                  About
                </Link>
              </li>
              {userType === "user" && (
                <li>
                  <Link
                    className="text-white hover:bg-yellow-300 hover:text-black"
                    to={"/users/search"}
                  >
                    Book
                  </Link>
                </li>
              )}
              <li>
                <Link
                  className="text-white hover:bg-yellow-300 hover:text-black"
                  to={
                    userType === "user"
                      ? "/users/uDashboard"
                      : "/vendors/vDashboard"
                  }
                >
                  Dashboard
                </Link>
              </li>
              {userType === "vendor" && (
                <li>
                  <Link
                    className="text-white hover:bg-yellow-300 hover:text-black"
                    to={"/vendors/allListing"}
                  >
                    My Listing
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
        {isLoggedIn && (
          <div className="navbar-end">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={avatar}
                    className="w-10 h-10"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="justify-between font-poppins text-yellow-400 hover:text-yellow-400 hover:bg-base-200">
                    {name}
                  </a>
                </li>

                <li>
                  <button
                    className="text-white hover:bg-yellow-300 hover:text-black border-none"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
