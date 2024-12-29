import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import Cookies from "js-cookie";
import Autosuggest from "react-autosuggest";
import { DatePickerDemo } from "@/components/DatePickerDemo";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

const Booking = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiKey = import.meta.env.VITE_LOCATION_API;

  const location = useLocation();
  const [vendor, setVendor] = useState(null);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
    fromDate: new Date(),
    toDate: new Date(),
    vendorId: null,
    listingId: null,
  });

  const [error, setError] = useState("");
  const [locations, setLocations] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Update vendor and listing when location.state changes
  useEffect(() => {
    if (location.state) {
      setVendor(location.state.vendor);
      setListing(location.state.listing);
    } else {
      console.error("State is missing or undefined.");
    }
  }, [location]);

  // Update formData once vendor and listing are set
  useEffect(() => {
    if (vendor && listing) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        vendorId: vendor,
        listingId: listing,
      }));
    }
  }, [vendor, listing]);

  const handleChangeLocation = (event, { newValue }) => {
    setLocations(newValue); // Update the input value state

    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        city: newValue, // Update city as the user types
      },
    }));
  };

  const handleSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${value}&key=${apiKey}&countrycode=in`
      );

      const newSuggestions = response.data.results.map(
        (result) => result.formatted
      );

      // Extract city, state, and country from the geocoding response
      const { components } = response.data.results[0];
      const city =
        components.city || components.town || components.village || "";
      const state = components.state || "";
      const country = components.country || "";

      setSuggestions(newSuggestions);

      setFormData((prevData) => ({
        ...prevData,
        location: {
          city,
          state,
          country,
        },
      }));
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: "Type a location...",
    value: locations,
    onChange: handleChangeLocation,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, location, fromDate, toDate, vendorId, listingId } = formData;

    if (
      !name ||
      !location.city ||
      !location.state ||
      !location.country ||
      !vendorId ||
      !listingId
    ) {
      setError("All fields are required.");
      return;
    }

    if (new Date(fromDate) >= new Date(toDate)) {
      setError("'From Date' must be before 'To Date'.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/bookings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      setError("");
      navigate("/users/dashboard");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Handle overlapping booking error
        setError(
          "The selected dates are already booked. Please choose different dates."
        );
      } else {
        setError(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        Book Vendor for Your Wedding
      </h1>

      <Card className="p-6 bg-white shadow-xl rounded-xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Label
              htmlFor="name"
              className="text-lg font-medium text-gray-700 grid justify-start"
            >
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <Label
              htmlFor="location"
              className="text-lg font-medium text-gray-700"
            >
              Location
            </Label>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
              onSuggestionsClearRequested={handleSuggestionsClearRequested}
              getSuggestionValue={(suggestion) => suggestion}
              renderSuggestion={(suggestion) => (
                <div className="p-2 text-gray-700 bg-blue-50 rounded-xl">
                  {suggestion}
                </div>
              )}
              inputProps={inputProps}
              className="w-full mt-2 p-3 border-2 border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6 flex items-center space-x-4">
            <div className="w-1/2">
              <Label
                htmlFor="fromDate"
                className="text-lg font-medium text-gray-700"
              >
                From Date
              </Label>
              <div className="relative">
                <DatePickerDemo
                  selectedDate={formData.fromDate}
                  onDateChange={(date) => handleDateChange(date, "fromDate")}
                />
                <FaCalendarAlt className="absolute right-4 top-3 text-gray-500" />
              </div>
            </div>

            <div className="w-1/2">
              <Label
                htmlFor="toDate"
                className="text-lg font-medium text-gray-700"
              >
                To Date
              </Label>
              <div className="relative">
                <DatePickerDemo
                  selectedDate={formData.toDate}
                  onDateChange={(date) => handleDateChange(date, "toDate")}
                />
                <FaCalendarAlt className="absolute right-4 top-3 text-gray-500" />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Book Now
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Booking;
