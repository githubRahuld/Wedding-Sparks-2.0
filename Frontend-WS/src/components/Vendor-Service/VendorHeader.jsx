import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";

const VendorHeader = ({ serviceDetails }) => {
  const avatarUrl = serviceDetails?.vendorId?.avatar;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <Avatar className="w-24 h-24 md:w-36 md:h-36">
        <AvatarImage
          src={avatarUrl}
          alt={serviceDetails?.vendorId?.name}
          className="border-2 md:border-4 border-gray-500 w-full h-full object-cover"
        />
      </Avatar>

      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl text-gray-800 hover:text-blue-600 transition-colors duration-300 font-poppins font-extralight">
          {serviceDetails?.name}
        </h1>
        <p className="text-md md:text-lg text-gray-600">
          {serviceDetails?.category}
        </p>

        <div className="flex justify-center md:justify-start items-center space-x-2 text-gray-500">
          <FaMapMarkerAlt className="text-lg md:text-xl text-gray-800" />
          <span className="text-sm md:text-base">
            {serviceDetails?.location?.city}, {serviceDetails?.location?.state},{" "}
            {serviceDetails?.location?.country}
          </span>
        </div>

        <div className="mt-2">
          <Badge
            variant="outline"
            color="blue"
            className="text-xs md:text-sm font-medium bg-slate-200 px-3 py-1"
          >
            Verified Vendor
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;
