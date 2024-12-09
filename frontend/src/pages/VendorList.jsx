import React from "react";
import { City, Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { Selector } from "../components";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import { Button, Label } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const categories = [
  "Venue",
  "Attire Retailer",
  "Caterer",
  "Entertainment",
  "Florist/Decorator",
  "Wedding Planner/Coordinator",
  "Baker",
  "Transportation",
  "Jeweler",
  "Designer",
];

function VenderList() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const userEmail = useSelector((state) => state.auth.user.user.email);

  let countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState();
  const [cityData, setCityData] = useState();

  const [country, setCountry] = useState(countryData[100]);
  const [state, setState] = useState();
  const [city, setCity] = useState();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setcontact] = useState("");
  const [images, setImages] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // wheneven the country and state change then state and city data will set
  useEffect(() => {
    setStateData(State.getStatesOfCountry(country?.isoCode));
  }, [country]);

  useEffect(() => {
    setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
  }, [state]);

  //to intialise state
  useEffect(() => {
    stateData && setState(stateData[0]);
  }, [stateData]);

  //to initailse city
  useEffect(() => {
    cityData && setCity(cityData[0]);
  }, [cityData]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    const selectedImages = Array.from(files).slice(0, 3); // Limit to first 3 selected images

    setImages(selectedImages);
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    // Gather form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", userEmail);
    formData.append("category", category);
    formData.append("country", country.name);
    formData.append("state", state.name);
    formData.append("city", city.name);
    formData.append("price", price);
    formData.append("contact", contact);
    formData.append("description", description);

    // Append each selected image
    images.forEach((image) => {
      formData.append(`images`, image);
    });

    axios
      .post(`${baseUrl}/vendors/listing`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type
        },
      })
      .then((res) => {
        setLoading(false);

        console.log("res: ", res);
        // Log the values from the form data
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        // console.log(formData.getAll()); // formdata will be empty

        navigate("/vendors/allListing");
      })
      .catch((err) => console.log("error while listing: ", err.message));
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center p-4 bg-cover bg-center bg-[url('/img/bg/list-bg.jpg')]">
        {loading ? (
          <span className="loading loading-spinner loading-lg text-black"></span>
        ) : (
          <form
            className="max-w-md md:w-full lg:w-1/2 flex flex-col gap-4 p-6 shadow-md rounded-md text-white bg-slate-700 bg-opacity-20 font-poppins"
            encType="multipart/form-data"
          >
            {/* email */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70 text-black"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="w-full py-2 pl-3 text-sm border-b border-gray-300 focus:outline-none bg-gray-100 rounded-lg text-black font-bold"
                value={userEmail}
                readOnly
              />
            </div>

            {/* Vendor name */}
            <div className="flex items-center gap-2">
              <p className="font-semibold text-black">Name</p>
              <input
                type="text"
                className="w-full py-2 pl-3 text-sm border-b border-gray-300 focus:outline-none bg-gray-100 rounded-lg text-black"
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-black">category</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 pl-3 text-sm border-b border-gray-300 focus:outline-none bg-gray-100 rounded-xl text-black"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-4 relative ">
              <Selector
                data={countryData}
                selected={country}
                setSelected={setCountry}
                className={"bg-gray-100"}
              />
              {state && (
                <Selector
                  data={stateData}
                  selected={state}
                  setSelected={setState}
                  className={"bg-gray-100"}
                />
              )}
              {city && (
                <Selector
                  data={cityData}
                  selected={city}
                  setSelected={setCity}
                  className={"bg-gray-100"}
                />
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <p className="font-semibold text-black">Price</p>
              <input
                type="number"
                className="w-full py-2 pl-3 text-sm border-b border-gray-300 focus:outline-none bg-gray-100 rounded-lg text-black"
                placeholder=" ₹/Day"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* Phone number */}
            <Label
              htmlFor="number"
              value="Phone Number"
              className="text-black"
            />
            <PhoneInput
              placeholder="Enter phone number"
              value={contact}
              onChange={setcontact}
              className="w-full py-2 pl-3 text-sm border-b  border-gray-300 focus:outline-none"
            />

            {/* Upload image */}
            <Label
              htmlFor="image"
              value="Upload Photos (Max 3)"
              className="text-black"
            />
            <input
              type="file"
              name="images"
              className="w-full py-2 pl-3 text-sm border-b border-gray-300 focus:outline-none bg-gray-100 rounded-xl text-black"
              onChange={handleImageChange}
              multiple
              accept="image/*"
            />

            {/* Description */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M17 6.1H3" />
                <path d="M21 12.1H3" />
                <path d="M15.1 18H3" />
              </svg>
              <input
                type="text"
                className="w-full py-2 pl-3 text-sm border-b border-gray-300 focus:outline-none bg-gray-100 rounded-lg text-black"
                placeholder="Description..."
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default VenderList;
