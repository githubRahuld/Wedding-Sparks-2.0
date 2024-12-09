import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Get location object to access state data
  const userId = useLocation();
  const _id = userId.state?.data;

  const email = useSelector((state) => state.auth.user.user.email);
  // console.log(email);

  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [location, setLocation] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    //doesnot need formdata for text form
    const requestData = {
      name,
      email,
      fromDate,
      toDate,
      location,
      vendorName,
      vendorEmail,
    };

    axios
      .post(`${baseUrl}/users/booking`, requestData)
      .then((res) => {
        setLoading(false);

        console.log("Booking successful:", res.data);
        navigate("/users/uDashboard");
      })
      .catch((err) => console.error("Booking failed:", err));
  };

  useEffect(() => {
    axios
      .post(`${baseUrl}/users/search`, { _id })
      .then((res) => {
        setVendorName(res.data.data[0].name);
        setVendorEmail(res.data.data[0].email);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {loading ? (
        <span className="loading loading-spinner loading-lg text-black"></span>
      ) : (
        <div className="flex items-center justify-center  bg-base-200  lg:bg-[url('/img/bg/booking-bg.jpg')] bg-cover bg-center bg-no-repeat md:bg-none">
          <div className="bg-white p-8 rounded-lg shadow-lg m-4 w-full max-w-md font-poppins uppercase">
            <h2 className="font-poppins text-2xl font-bold mb-4 text-cyan-500 underline">
              Book Your Vendor Now
            </h2>
            <form className="space-y-4 text-justify ">
              <div>
                <label
                  htmlFor="name"
                  className="block font-semibold text-black"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full h-12 text-center"
                  required // Add required attribute
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block font-semibold text-black"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  className="input w-full h-12 text-center text-green-600"
                  readOnly
                  required // Add required attribute
                />
              </div>
              <div>
                <label
                  htmlFor="from"
                  className="block font-semibold text-black"
                >
                  From:
                </label>
                <input
                  type="date"
                  id="from"
                  onChange={(e) => setFromDate(e.target.value)}
                  className="input w-full h-12 text-center"
                  required // Add required attribute
                />
              </div>
              <div>
                <label htmlFor="to" className="block font-semibold text-black">
                  To:
                </label>
                <input
                  type="date"
                  id="to"
                  onChange={(e) => setToDate(e.target.value)}
                  className="input w-full h-12 text-center"
                  required // Add required attribute
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block font-semibold text-black"
                >
                  Location:
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Event Location"
                  onChange={(e) => setLocation(e.target.value)}
                  className="input w-full h-12 text-center"
                  required // Add required attribute
                />
              </div>
              <div>
                <label
                  htmlFor="vendorName"
                  className="block font-semibold text-black"
                >
                  Vendor Name:
                </label>
                <input
                  type="text"
                  id="vendorName"
                  value={vendorName}
                  className="input w-full h-12 text-center text-green-600"
                  readOnly
                  required // Add required attribute
                />
              </div>
              <div>
                <label
                  htmlFor="vendorEmail"
                  className="block font-semibold text-black"
                >
                  Vendor Email:
                </label>
                <input
                  type="email"
                  id="vendorEmail"
                  value={vendorEmail}
                  className="input w-full h-12 text-center"
                  readOnly
                  required // Add required attribute
                />
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn hover:btn-primary bg-slate-500 text-black font-bold border-none  w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Booking;
