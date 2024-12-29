import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import LoveLoading from "@/components/Loading/LoveLoading";

import { Button } from "@/components/ui/button";
import { MdAddComment } from "react-icons/md";

// Sub-Components
import VendorHeader from "@/components/Vendor-Service/VendorHeader";
import ServiceImages from "@/components/Vendor-Service/ServiceImages";
import ContactInfo from "@/components/Vendor-Service/ContactInfo";
import BusinessDetails from "@/components/Vendor-Service/BusinessDetails";
import Policies from "@/components/Vendor-Service/Policies";
import Reviews from "@/components/Vendor-Service/Reviews";
import PriceSection from "@/components/Vendor-Service/PriceSection";
import BookingSection from "@/components/Vendor-Service/BookingSection";
import { AddReview } from "@/components";
import { toast, Toaster } from "react-hot-toast";

const ServiceDetails = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { vendorId: listingId } = useParams();
  const [serviceDetails, setServiceDetails] = useState({});
  const [vendorDetails, setVendorDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [vendorID, setVendorID] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Vendor and Service Details
  const fetchServiceDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/listing/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      setServiceDetails(response.data.data.listing);
      setVendorID(response.data.data.listing.vendorId?._id); // update vendorID state
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchVendorDetails = async () => {
    if (!vendorID) {
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/vendors/${vendorID}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      setVendorDetails(response.data.data.data);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/v1/vendors/${vendorID}/listing/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      setReviews(response.data.reviews);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleSubmitReview = async (reviewData) => {
    const vendorId = vendorID;

    await axios
      .post(
        `${baseUrl}/api/v1/vendors/add-review/${vendorId}/listing/${listingId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        toast.success("Review submitted successfully.");
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchServiceDetails();
    };
    fetchData();
  }, [listingId]);

  // Fetch vendor details once vendorID is available
  useEffect(() => {
    if (vendorID) {
      fetchVendorDetails();
      fetchReviews();
    }
  }, [vendorID]);

  if (loading) {
    return <LoveLoading />;
  }

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {error && <p className="text-red-500">{error}</p>}
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto">
        {/* Vendor Header */}
        <VendorHeader serviceDetails={serviceDetails} />

        {/* Service Images */}
        <ServiceImages images={serviceDetails.images} />

        {/* Price and Contact Info */}
        <div className="grid justify-center grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <PriceSection
            price={serviceDetails.price}
            vendor={vendorID}
            listing={listingId}
          />
          <ContactInfo vendor={serviceDetails.vendorId} />
        </div>

        {/* Business Details */}
        <BusinessDetails businessDetails={vendorDetails.businessDetails} />

        {/* Policies */}
        <Policies policies={vendorDetails.policies} />

        {/* Reviews */}
        <Reviews reviews={reviews} />

        {/* Call to Action */}
        <div className="flex items-center  justify-center space-x-4">
          <BookingSection vendor={vendorID} listing={listingId} />

          <Button
            onClick={handleModalToggle}
            className="px-8 py-3 bg-green-600 text-white rounded-full text-xl hover:bg-green-700 transition duration-300 mt-6"
          >
            <MdAddComment />
            Add Review
          </Button>
          {isModalOpen && (
            <AddReview
              isOpen={isModalOpen}
              onClose={handleModalToggle}
              onSubmit={handleSubmitReview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
