import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { loginUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import LoveLoading from "@/components/Loading/LoveLoading";

const Login = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false); // Toggle for demo credentials tooltip

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoClick = () => {
    setEmail("demo@mail.com");
    setPassword("demo123");
    setShowDemo(true);
    setTimeout(() => setShowDemo(false), 3000); // Hide tooltip after 3 seconds
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${baseUrl}/api/v1/auth/login`, { email, password })
      .then((res) => {
        setError("");
        setLoading(false);

        const accessToken = res.data.data.accessToken;
        const refreshToken = res.data.data.refreshToken;

        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refreshToken", refreshToken, {
          secure: true,
          sameSite: "strict",
        });

        const userData = res.data.data.user;
        dispatch(loginUser({ userData }));

        navigate("/users/home");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 pt-10 py-10">
      {loading ? (
        <LoveLoading />
      ) : (
        <>
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 sm:p-6 md:p-8 relative">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Login
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Welcome back! Please enter your details.
            </p>

            {error && (
              <p className="text-sm text-red-500 text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-4">
                <Label
                  htmlFor="email"
                  className="text-gray-700 text-sm mb-1 grid justify-start"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <Label
                  htmlFor="password"
                  className="text-gray-700 text-sm mb-1 grid justify-start"
                >
                  Password
                </Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-3 top-2/4 transform -translate-y-2/4 cursor-pointer text-gray-400"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition"
              >
                Login
              </Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to={"/auth/signup"}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Credentials Icon */}
            <div
              className="absolute top-3 right-3 flex items-center space-x-2 cursor-pointer"
              onClick={handleDemoClick}
            >
              <FiInfo className="text-gray-500 hover:text-blue-500 text-xl" />
              <span className="text-sm text-gray-500 hover:text-blue-500">
                Demo
              </span>
            </div>

            {/* Tooltip */}
            {showDemo && (
              <div className="absolute top-10 right-3 bg-blue-100 text-blue-600 text-xs rounded-lg p-2 shadow-lg">
                <p>Email: demo@mail.com</p>
                <p>Password: demo123</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
