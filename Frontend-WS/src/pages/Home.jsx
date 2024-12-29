import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousels } from "@/components";
import { useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import CircleLoading from "@/components/Loading/CircleLoading";
import LoveLoading from "@/components/Loading/LoveLoading";
import VendorCard from "@/components/VendorCard";
import SignupButton from "@/components/Button/SignupButton";

const Home = () => {
  const userType = useSelector((state) => state.auth.userType);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch vendors
  const fetchVendors = async (category = "") => {
    setLoading(true);
    try {
      if (category == "all") {
        category = "";
      }
      const response = await axios.get(
        `${baseUrl}/api/v1/listing/all?category=${category}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      setVendors(response.data?.data?.listings || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/v1/listing/categories`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      setLoading(false);

      setCategories(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchVendors(selectedCategory);
    fetchCategories();
    fetchListing();
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    fetchVendors(selected);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchListing(query);
  };
  const fetchListing = async (searchQuery = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/v1/listing/all`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      const listings = response.data?.data?.listings || [];

      if (searchQuery) {
        // Filter listings based on the search query
        const filteredListings = listings.filter(
          (listing) =>
            listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            listing.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            listing.location.city
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
        setListing(filteredListings);
      } else {
        setListing(listings); // Set full list
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListing([]); // In case of an error, clear the listings
    } finally {
      setLoading(false);
    }
  };

  // To move top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <header
        className="py-8 px-4 bg-gradient-to-r from-rose-500 to-blue-600 text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/img/header-bg.jpg")', // Replace with your image path
        }}
      >
        <h1 className="text-4xl font-bold text-center font-cinzelDecorative text-yellow-400">
          Welcome to Wedding Sparks
        </h1>
        <p className="text-center text-lg mt-2">
          Find the best wedding vendors or become one!
        </p>

        {/* Search bar */}
        <div className="mt-6 max-w-4xl mx-auto flex items-center bg-white p-2 rounded-lg shadow-md">
          <Input
            type="text"
            placeholder="Search vendors"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border-none focus:ring-0 flex-1 text-gray-700"
          />
          <Button className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            <FiSearch className="text-lg" />
          </Button>
        </div>
      </header>

      {/* Search Section Result */}
      {searchQuery && (
        <>
          {listing.length === 0 ? (
            <h2 className="text-center text-gray-600 mt-20 mb-20 text-xl">
              No result found for{" "}
              <span className="text-rose-500">"{searchQuery}"</span>
            </h2>
          ) : (
            <div className="mt-8">
              <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6 font-cinzelDecorative shadow-slate-300">
                Search Results
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {listing.map((vendor) => (
                  <VendorCard key={vendor._id} vendor={vendor} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Carousel Section */}
      <section className="py-8">
        <h2 className="text-3xl font-semibold text-center">Featured Vendors</h2>
        <Carousels />
      </section>

      {/* Category Filter */}
      {loading ? (
        <CircleLoading />
      ) : (
        <div className="bg-green-50 py-6 mr-10 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4 font-cinzelDecorative shadow-slate-300">
            Search By Category
          </h2>
          <div className="mt-3 flex justify-center space-x-3 ">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Vendor Cards */}
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <LoveLoading />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-3 bg-green-50">
          {vendors.length > 0 ? (
            vendors.map((vendor, index) => (
              <VendorCard key={index} vendor={vendor} />
            ))
          ) : (
            <div className="text-center col-span-full">
              No vendors found for this category.
            </div>
          )}
        </div>
      )}

      {/* Call to Action */}
      <section className="bg-indigo-200  text-gray-700 py-8">
        <div className="text-center">
          {userType === "customer" ? (
            <>
              <h2 className="text-2xl font-bold">Ready to Book a Vendor?</h2>
              <p className="mt-2">Find your ideal wedding vendor today!</p>
              <Button
                onClick={() => {
                  scrollToTop();
                }}
                className="mt-4 py-3 px-8 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out hover:bg-blue-700"
              >
                <span className="flex items-center space-x-2">
                  <FiSearch className="text-xl" />
                  <span>Start Searching</span>
                </span>
              </Button>
            </>
          ) : (
            !isLoggedIn && (
              <>
                <h2 className="text-3xl md:text-4xl font-semibold text-center text-blue-800">
                  Join Our Vendor Network
                </h2>
                <p className="mt-4 text-lg md:text-xl text-center text-gray-600">
                  Are you a wedding vendor? Register with us to showcase your
                  services and grow your business!
                </p>
                <div className="flex justify-center mt-6">
                  <SignupButton />
                </div>
              </>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
