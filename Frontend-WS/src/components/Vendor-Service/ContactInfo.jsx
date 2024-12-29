import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ContactButton } from "..";

const ContactInfo = ({ vendor }) => {
  return (
    // <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
    //   <h2 className="text-2xl font-semibold text-gray-800 mb-6">
    //     Contact Vendor
    //   </h2>
    //   {/* Phone Number Button */}
    //   <div className="mb-4">
    //     <Button
    //       variant="outline"
    //       className="w-full flex items-center justify-center bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors duration-300"
    //     >
    //       <FaPhoneAlt className="mr-2 text-lg" />
    //       {vendor?.phoneNumber}
    //     </Button>
    //   </div>
    //   {/* Email Button */}
    //   <div>
    //     <Button
    //       variant="outline"
    //       className="w-full flex items-center justify-center bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors duration-300"
    //     >
    //       <FaEnvelope className="mr-2 text-lg" />
    //       {vendor?.email}
    //     </Button>
    //   </div>
    // </div>

    <div className=" grid justify-center p-6 rounded-lg  hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <ContactButton vendor={vendor} />
    </div>
  );
};

export default ContactInfo;
