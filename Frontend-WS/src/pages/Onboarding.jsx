import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AiOutlineShop, AiOutlineFileDone } from "react-icons/ai";
import { FaCity, FaCertificate } from "react-icons/fa";
import { MdPolicy, MdPayment } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";

const Onboarding = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    businessDetails: {
      businessName: "",
      yearsOfExperience: "",
      areasOfOperation: "",
      certifications: "",
    },
    policies: {
      cancellation: "",
      refund: "",
      paymentTerms: "",
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.section === "businessDetails") {
      setFormData((prevData) => ({
        ...prevData,
        businessDetails: {
          ...prevData.businessDetails,
          [name]: value,
        },
      }));
    } else if (dataset.section === "policies") {
      setFormData((prevData) => ({
        ...prevData,
        policies: {
          ...prevData.policies,
          [name]: value,
        },
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/v1/vendors/add`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      if (res.status === 201) {
        toast.success("Onboarding completed successfully!");
      }
      setLoading(false);

      toast.success("Onboarding completed successfully!");
      navigate("/users/home");
    } catch (error) {
      toast.error("Error completing onboarding. Please try again.");
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg shadow-indigo-600/50">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Complete Your Onboarding
        </h1>
        <p className="text-gray-500 font-semibold text-xl text-center mb-6">
          To move further
        </p>

        <form onSubmit={handleSubmit}>
          {/* Business Details */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="flex flex-col relative">
              <Label
                htmlFor="businessName"
                className="text-lg font-semibold text-gray-700 justify-start"
              >
                Business Name
              </Label>
              <div className="relative">
                <AiOutlineShop className="absolute top-3 left-3 text-gray-400" />
                <Input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessDetails.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className="p-3 pl-10 mt-2 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-400"
                  required
                  data-section="businessDetails"
                />
              </div>
            </div>

            <div className="flex flex-col relative">
              <Label
                htmlFor="yearsOfExperience"
                className="text-lg font-semibold text-gray-700"
              >
                Years of Experience
              </Label>
              <div className="relative">
                <AiOutlineFileDone className="absolute top-3 left-3 text-gray-400" />
                <Input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  placeholder="ex: 5 Years"
                  value={formData.businessDetails.yearsOfExperience}
                  onChange={handleChange}
                  className="p-3 pl-10 mt-2 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-400"
                  required
                  data-section="businessDetails"
                />
              </div>
            </div>
          </div>

          {/* Areas of Operation */}
          <div className="mb-6 relative">
            <Label
              htmlFor="areasOfOperation"
              className="text-lg font-semibold text-gray-700"
            >
              Areas of Operation
            </Label>
            <div className="relative">
              <FaCity className="absolute top-3 left-3 text-gray-400" />
              <Input
                type="text"
                id="areasOfOperation"
                name="areasOfOperation"
                value={formData.businessDetails.areasOfOperation}
                onChange={handleChange}
                className="p-3 pl-10 mt-2 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-400"
                placeholder="ex: Mumbai, Pune, Delhi"
                required
                data-section="businessDetails"
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-6 relative">
            <Label
              htmlFor="certifications"
              className="text-lg font-semibold text-gray-700"
            >
              Certifications
            </Label>
            <div className="relative">
              <FaCertificate className="absolute top-3 left-3 text-gray-400" />
              <Input
                type="text"
                id="certifications"
                name="certifications"
                value={formData.businessDetails.certifications}
                onChange={handleChange}
                placeholder="ex: ISO 9001, ISO 14001"
                className="p-3 pl-10 mt-2 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-400"
                required
                data-section="businessDetails"
              />
            </div>
          </div>

          {/* Policies Section */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Policies
          </h2>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="flex flex-col relative">
              <Label
                htmlFor="cancellation"
                className="text-lg font-semibold text-gray-700 text-left"
              >
                Cancellation Policy
              </Label>
              <div className="relative">
                <MdPolicy className="absolute top-3 left-3 text-gray-400" />
                <Textarea
                  id="cancellation"
                  name="cancellation"
                  value={formData.policies.cancellation}
                  onChange={handleChange}
                  placeholder="Cancellation Policy"
                  className="p-3 pl-10 mt-2 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-400 "
                  required
                  data-section="policies"
                />
              </div>
            </div>

            <div className="flex flex-col relative">
              <Label
                htmlFor="refund"
                className="text-lg font-semibold text-gray-700 text-left"
              >
                Refund Policy
              </Label>
              <div className="relative">
                <RiRefund2Fill className="absolute top-3 left-3 text-gray-400" />
                <Textarea
                  id="refund"
                  name="refund"
                  value={formData.policies.refund}
                  onChange={handleChange}
                  placeholder="Refund Policy"
                  className="p-3 pl-10 mt-2 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-400"
                  required
                  data-section="policies"
                />
              </div>
            </div>
          </div>

          <div className="mb-6 relative">
            <Label
              htmlFor="paymentTerms"
              className="text-lg font-semibold text-gray-700 text-left"
            >
              Payment Terms
            </Label>
            <div className="relative">
              <MdPayment className="absolute top-3 left-3 text-gray-400" />
              <Textarea
                id="paymentTerms"
                name="paymentTerms"
                value={formData.policies.paymentTerms}
                onChange={handleChange}
                placeholder="Payment Terms"
                className="p-3 pl-10 mt-2 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-400"
                required
                data-section="policies"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Onboarding"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
