import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { FaIndianRupeeSign } from "react-icons/fa6";

function VendorCard({ vendor, index }) {
  const navigate = useNavigate();
  return (
    <div
      key={index}
      className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition ml-2 mr-2"
    >
      <img
        src={vendor.images[0] || "/placeholder.jpg"}
        alt={vendor.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h3 className="text-lg sm:text-xl font-semibold mt-4">{vendor.name}</h3>

      {/* Display City and Price per Day */}
      <div className="flex justify-between text-sm text-gray-600">
        <span className="font-semibold">Price per Day</span>
        <span className="flex items-center">
          <FaIndianRupeeSign className="mr-1" />
          {vendor.price.toLocaleString()}
        </span>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span className="font-semibold">Category</span>
        <span>{vendor.category}</span>
      </div>

      {/* View Details Button */}
      <Button
        onClick={() => navigate(`/users/service-details/${vendor._id}`)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        View Details
      </Button>
    </div>
  );
}

export default VendorCard;
