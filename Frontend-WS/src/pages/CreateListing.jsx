import React, { useState } from "react";
import { categories } from "../Categories/categories.js";
import { toast, Toaster } from "react-hot-toast";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import Cookies from "js-cookie";
import {
  AiOutlineEdit,
  AiOutlineGlobal,
  AiOutlinePlus,
  AiOutlineHome,
  AiOutlineEnvironment,
} from "react-icons/ai";
import { MdCurrencyRupee } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiKey = import.meta.env.VITE_LOCATION_API;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    country: "",
    state: "",
    city: "",
    price: "",
    description: "",
    images: [],
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle all text and number input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      images: Array.from(e.target.files),
    }));
  };

  // Fetch location suggestions (country, state, city)
  const fetchLocationSuggestions = async (value, field) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${value}&key=${apiKey}`
      );
      const newSuggestions = response.data.results.map(
        (result) => result.formatted
      );
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error(`Error fetching ${field} suggestions:`, error);
    }
  };

  // Handle location input changes (country, state, city)
  const handleLocationChange = (e, { newValue }, field) => {
    setFormData((prevData) => ({ ...prevData, [field]: newValue }));
  };

  // Clear suggestions when user stops typing
  const handleSuggestionsClear = () => setSuggestions([]);

  // Handle form submission with image uploads
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);

    for (let i = 0; i < formData.images.length; i++) {
      formDataToSend.append(`images`, formData.images[i]);
    }

    console.log("Form data:", formDataToSend);

    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/listing/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      setLoading(false);

      toast.success("Listing created successfully!");
      navigate("/vendors/listings");
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        // Backend error response
        const errorMessage = error.response.data.message || "An error occurred";
        toast.error(errorMessage);
      } else {
        // Other errors (like network issues)
        toast.error("Error creating listing. Please try again.");
      }
      console.error("Error creating listing:", error);
    }
  };

  // Render Autosuggest component for location inputs
  const renderLocationInput = (label, name, field, icon) => (
    <div className="flex flex-col mb-6">
      <label
        className="text-lg font-semibold text-gray-700 mb-2 grid justify-start"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="flex items-center border rounded px-3 py-2">
        {icon && <div className="text-gray-500 mr-2">{icon}</div>}
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={({ value }) =>
            fetchLocationSuggestions(value, field)
          }
          onSuggestionsClearRequested={handleSuggestionsClear}
          getSuggestionValue={(suggestion) => suggestion}
          renderSuggestion={(suggestion) => (
            <div className="py-2 px-4 hover:bg-blue-100 cursor-pointer">
              {suggestion}
            </div>
          )}
          inputProps={{
            id: name,
            name,
            value: formData[name],
            onChange: (e, { newValue }) =>
              handleLocationChange(e, { newValue }, field),
            className: "w-full outline-none bg-transparent",
            placeholder: `Enter ${label.toLowerCase()}`,
          }}
          theme={{
            container: "relative",
            suggestionsContainer:
              "absolute z-10 mt-1 w-full bg-white shadow rounded",
            suggestionsList: "list-none p-0 m-0",
            suggestion: "text-gray-800",
            suggestionHighlighted: "bg-blue-100 text-blue-900",
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Create Listing
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row: Service Name and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Name */}
            <div className="flex flex-col">
              <label
                className="text-lg font-semibold text-gray-700 mb-2 grid justify-start"
                htmlFor="name"
              >
                Service Name
              </label>
              <div className="flex items-center border rounded px-3 py-2">
                <AiOutlineEdit className="text-gray-500 mr-2" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter the service name"
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label
                className="text-lg font-semibold text-gray-700 mb-2 grid justify-start"
                htmlFor="category"
              >
                Category
              </label>
              <div className="flex items-center border rounded px-3 py-2">
                <AiOutlinePlus className="text-gray-500 mr-2" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Second Row: Location Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderLocationInput(
              "Country",
              "country",
              "country",
              <AiOutlineGlobal />
            )}
            {renderLocationInput("State", "state", "state", <AiOutlineHome />)}
            {renderLocationInput(
              "City",
              "city",
              "city",
              <AiOutlineEnvironment />
            )}
          </div>

          {/* Third Row: Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div className="flex flex-col">
              <label
                className="text-lg font-semibold text-gray-700 mb-2 grid justify-start"
                htmlFor="price"
              >
                Price
              </label>
              <div className="flex items-center border rounded px-3 py-2">
                <MdCurrencyRupee className="text-gray-500 mr-2" />
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price/Day"
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label
              className="text-lg font-semibold text-gray-700 mb-2 grid justify-start"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description"
              className="w-full border rounded px-3 py-2 outline-none"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Images */}
          <div className="flex flex-col">
            <label
              className="text-lg font-semibold text-gray-700 mb-2 grid justify-start"
              htmlFor="images"
            >
              Images
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <AiOutlineEdit className="text-gray-500 mr-2" />
              <input
                id="images"
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-3 rounded font-semibold hover:bg-blue-600"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
