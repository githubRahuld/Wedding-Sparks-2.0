import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoveLoading from "@/components/Loading/LoveLoading";

function Signup() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    confirmPassword: "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      avatar: e.target.files[0], // Store the selected file in state
    }));
  };
  const handleRoleChange = (value) => {
    console.log(value);

    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("confirmPassword", formData.confirmPassword);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("avatar", formData.avatar);

    console.log(formData);

    await axios
      .post(`${baseUrl}/api/v1/auth/register`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setLoading(false);
        navigate("/auth/login");
      })
      .catch((err) => {
        setLoading(false);
        const message = err.response?.data?.message || "Something went wrong!";
        setError(message);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50  mt-10">
      {loading && <LoveLoading />}
      <Tabs
        defaultValue="customer"
        onValueChange={handleRoleChange}
        className="w-[400px] "
      >
        <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-xl ">
          <TabsTrigger value="customer" className="rounded-xl">
            Customer
          </TabsTrigger>
          <TabsTrigger value="vendor" className="rounded-xl">
            Vendor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            {/* Typography - Use Tailwind for text styling */}
            <h3 className="text-3xl font-semibold text-primary text-center mb-8">
              Create an Account
            </h3>
            {error && <h2 className="text-red-500">{error}</h2>}

            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="mb-4">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Full Name
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FaUserAlt className="text-gray-400 ml-3" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Ganesh"
                    value={formData.name}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md text-start"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Email Address
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FaEnvelope className="text-gray-400 ml-3" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="ganesh@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="mb-4">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Phone Number
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FiPhoneCall className="text-gray-400 ml-3" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    placeholder="+91 98234..."
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FaLock className="text-gray-400 ml-3" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-4">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Confirm Password
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FaLock className="text-gray-400 ml-3" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                    required
                  />
                </div>

                {/* Avatar Input */}
                <div className="mb-4 mt-4">
                  <Label
                    htmlFor="avatar"
                    className="text-sm font-medium grid justify-start"
                  >
                    Avatar
                  </Label>
                  <div className="flex items-center border border-gray-300 rounded-md mt-2">
                    <FaUserAlt className="text-gray-400 ml-3" />
                    <input
                      id="avatar"
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                      required
                    />
                  </div>
                </div>
                {/*role*/}
                <div className="hidden ">
                  <Input
                    id="role"
                    type="role"
                    name="role"
                    value="customer"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                className="w-full py-2 text-lg font-medium mt-4 hover:border border-gray-700 rounded-xl"
              >
                Sign Up
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-4 text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/auth/login" className="text-primary font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="vendor">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            {/* Typography - Use Tailwind for text styling */}
            <h3 className="text-3xl font-semibold text-primary text-center mb-8">
              Create an Account
            </h3>

            {error && <h2 className="text-red-500">{error}</h2>}

            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="mb-4">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Vendor's Name
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FaUserAlt className="text-gray-400 ml-3" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Ganesh"
                    value={formData.name}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md text-start"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Email Address
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FaEnvelope className="text-gray-400 ml-3" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="ganesh@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="mb-4">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Phone Number
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FiPhoneCall className="text-gray-400 ml-3" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    placeholder="+91 98234..."
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FaLock className="text-gray-400 ml-3" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-4">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium flex items-center justify-start"
                >
                  Confirm Password
                  <span className="text-red-500 ml-1">*</span>
                </Label>

                <div className="flex items-center border border-gray-300 rounded-md mt-2">
                  <FaLock className="text-gray-400 ml-3" />

                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                    required
                  />
                </div>

                {/* Avatar Input */}
                <div className="mb-4 mt-4">
                  <Label
                    htmlFor="avatar"
                    className="text-sm font-medium grid justify-start"
                  >
                    Avatar
                  </Label>
                  <div className="flex items-center border border-gray-300 rounded-md mt-2">
                    <FaUserAlt className="text-gray-400 ml-3" />
                    <input
                      id="avatar"
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="ml-2 w-full px-3 py-2 border-none focus:ring-2 focus:ring-primary rounded-md"
                      required
                    />
                  </div>
                </div>
                {/*role*/}
                <div className="hidden ">
                  <Input
                    id="role"
                    type="role"
                    name="role"
                    value="vendor"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                className="w-full py-2 text-lg font-medium mt-4 hover:border border-gray-700 rounded-xl"
              >
                Sign Up
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-4 text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="text-primary font-medium">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Signup;
