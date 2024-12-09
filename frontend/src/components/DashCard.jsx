import { Circle } from "lucide-react";

function DashCard({ list }) {
  const fromDate = new Date(list.fromDate);
  const toDate = new Date(list.toDate);

  // Define online icon based on confirmation status
  let onlineIcon = null;
  if (list.status === "Confirmed") {
    onlineIcon = (
      <Circle className="h-4 w-4 bg-green-500 rounded-xl  text-green-500 mr-1" />
    );
  } else if (list.status === "Pending") {
    onlineIcon = (
      <Circle className="h-4 w-4 bg-blue-500 rounded-xl text-blue-500 mr-1" />
    );
  } else {
    onlineIcon = (
      <Circle className="h-4 w-4 bg-red-500 rounded-xl text-red-500 mr-1" />
    );
  }

  //change the color of row on the basis of accept or reject
  let bgColor = "dark:bg-gray-800";
  if (list.status === "Confirmed") {
    bgColor = "bg-green-700";
  } else if (list.status === "Rejected") {
    bgColor = "bg-red-500";
  }

  return (
    <tr
      className={`bg-blue-50 border-b border-blue-200 ${bgColor} dark:border-gray-700 font-poppins hover:bg-slate-600 hover:cursor-pointer `}
    >
      <th className="px-7 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-300 uppercase">
        {list.vendorName}
      </th>
      <td className={`px-7 py-2 whitespace-nowrap text-sm`}>
        {list.vendorEmail}
      </td>
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

      <td className={`px-7 py-2 whitespace-nowrap text-lg flex items-center `}>
        {onlineIcon}
        {list.status}
      </td>
    </tr>
  );
}

export default DashCard;
