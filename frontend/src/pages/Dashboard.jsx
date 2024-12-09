import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { DashCard } from "../components";

function Dashboard() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const user = useSelector((state) => state.auth.user);
  const userEmail = user.user.email;
  // console.log(userEmail);

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/users/get-booking`, {
        params: { userEmail: userEmail },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data.data);
      })
      .catch((err) => {
        console.log("error while fetching booking data: ", err);
      });
  }, []);

  return (
    <>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="mx-auto p-3 bg-white rounded-lg shadow-lg text-gray-800">
          <h1 className="text-3xl font-poppins font-bold mb-4 text-center text-gray-800">
            Booking Information
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
              <thead className="text-lg text-white uppercase bg-blue-600 dark:text-white">
                <tr>
                  <th scope="col" className="px-7 py-3 text-left">
                    Vendor Name
                  </th>
                  <th scope="col" className="px-7 py-3 text-left">
                    Vendor Email
                  </th>
                  <th scope="col" className="px-7 py-3 text-left">
                    From
                  </th>
                  <th scope="col" className="px-7 py-3 text-left">
                    To
                  </th>
                  <th scope="col" className="px-7 py-3 text-left">
                    Location
                  </th>
                  <th scope="col" className="px-7 py-3 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 &&
                  data.map((list) => <DashCard key={list._id} list={list} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
