import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, Toaster } from "react-hot-toast";
import { MdCurrencyRupee } from "react-icons/md";
import { TbClipboardList } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const VendorListings = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/listing`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });
        console.log(response.data);
        setListings(response?.data?.data?.vendorListings || []);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch listings. Please try again.");
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={() => navigate("/vendors/create-listing")}
          >
            <AiOutlinePlus /> Add Listing
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : listings?.length === 0 ? (
          <p className="text-gray-600 text-center flex flex-col items-center mt-20 ">
            <TbClipboardList className="text-5xl mb-2 " />
            No listings found. Click "Add Listing" to create one.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col"
              >
                <img
                  src={listing.images[0]}
                  alt={listing.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {listing.name}
                </h2>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{listing.category}</span>
                  <span>
                    {listing.location.city}, {listing.location.state}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-700 mb-4">
                  <MdCurrencyRupee />
                  <span>{listing.price}</span>
                </div>
                <div className="mt-auto flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                    <AiOutlineEdit /> Edit
                  </button>
                  <button className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    <AiOutlineDelete /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorListings;
