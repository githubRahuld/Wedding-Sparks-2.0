import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { VListing } from "../components";
import { baseUrl } from "../../urls";

function VendorAllListing() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const user = useSelector((state) => state.auth.user);
  const email = user.user.email;

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/vendors/all-listing/${email}`)
      .then((res) => {
        setData(res.data.data);
        console.log("all listing:", res.data);
      })
      .catch((err) => {
        console.log("error while fetching booking data: ", err);
      });
  }, []);

  console.log("data: ", data.data);

  return (
    <>
      {data ? (
        <div className="bg-gray-100 min-h-screen py-8">
          <div className="mx-auto p-3 bg-white rounded-lg shadow-lg text-gray-800">
            <h1 className="text-3xl font-poppins font-bold mb-4 text-center text-gray-800">
              My Listing
            </h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
                <thead className="text-lg text-white uppercase bg-blue-600 dark:text-white">
                  <tr>
                    <th scope="col" className="px-7 py-3 text-left">
                      Name
                    </th>
                    <th scope="col" className="px-7 py-3 text-left">
                      Category
                    </th>
                    <th scope="col" className="px-7 py-3 text-left">
                      Location
                    </th>
                    <th scope="col" className="px-7 py-3 text-left">
                      Price/Day
                    </th>
                    <th scope="col" className="px-7 py-3 text-left">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((list) => <VListing key={list._id} list={list} />)
                  ) : (
                    <h1 className="text-black flex justify-end mb-10">
                      No Listing Yet
                    </h1>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <h2 className="text-black text-xl justify-center">No Listing Yet</h2>
      )}
    </>
  );
}

export default VendorAllListing;
