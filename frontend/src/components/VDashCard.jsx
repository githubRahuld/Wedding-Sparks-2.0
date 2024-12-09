import axios from "axios";
import { Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { baseUrl } from "../../urls";

function VDashCard({ list }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [status, setStatus] = useState("Pending");

  const bookingId = list._id;
  console.log("Booking id: ", bookingId);

  // check status for booking
  useEffect(() => {
    axios
      .get(`${baseUrl}/users/bookingStatus/${bookingId}`)
      .then((res) => {
        console.log("Booking id: ", bookingId, " status: ", res.data.data);
        setStatus(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onAccept = () => {
    axios
      .patch(`${baseUrl}/users/accept/${bookingId}`)
      .then((res) => {
        setStatus("Confirmed");
        console.log("Status changed to confirmed: ", res);
      })
      .catch((err) => console.log(err));
  };
  const onReject = () => {
    axios
      .patch(`${baseUrl}/users/reject/${bookingId}`)
      .then((res) => {
        setStatus("Rejected");

        console.log("Status changed to rejected: ", res);
      })
      .catch((err) => console.log(err));
  };

  const fromDate = new Date(list.fromDate);
  const toDate = new Date(list.toDate);

  // Define online icon based on confirmation status
  let onlineIcon = null;
  if (list.status === "Confirmed") {
    onlineIcon = <Circle className="h-5 w-5 text-green-500 mr-1" />;
  } else if (list.status === "Pending") {
    onlineIcon = (
      <Circle className="h-4 w-4 bg-blue-500 rounded-xl text-blue-500 mr-1" />
    );
  } else {
    onlineIcon = (
      <Circle className="h-4 w-4 bg-red-500 rounded-xl text-red-500 mr-1" />
    );
  }

  let bgColor = "dark:bg-gray-800";
  if (list.status === "Confirmed") {
    bgColor = "bg-green-700";
  } else if (list.status === "Rejected") {
    bgColor = "bg-red-500";
  }

  return (
    <tr
      className={`bg-blue-50 border-b border-blue-200 ${bgColor} dark:border-gray-700 font-poppins hover:bg-slate-600 hover:cursor-pointer`}
    >
      <th className="px-7 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-300 uppercase">
        {list.name}
      </th>
      <td className={`px-7 py-2 whitespace-nowrap text-sm`}>{list.email}</td>
      <td className={`px-7 py-2 whitespace-nowrap text-sm  `}>
        {fromDate.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </td>
      <td className={`px-7 py-2 whitespace-nowrap text-sm `}>
        {toDate.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </td>
      <td className={`px-7 py-2 whitespace-nowrap text-sm } uppercase`}>
        {list.location}
      </td>

      <td
        className={`px-7 py-2 whitespace-nowrap text-sm flex items-center gap-2 `}
      >
        <div>
          {status === "Pending" && (
            <div>
              <button
                onClick={onAccept}
                className="bg-green-600 hover:bg-green-700 mr-2"
              >
                Accept
              </button>
              <button
                onClick={onReject}
                className="bg-red-600 hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
          {status === "Confirmed" && (
            <div>
              <p className="font-jost text-xl"> Accepted</p>
              {/* Additional content for accepted status */}
            </div>
          )}
          {status === "Rejected" && (
            <div>
              <p className="font-jost text-xl">Rejected</p>
              {/* Additional content for rejected status */}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default VDashCard;
