import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import ShadCN Card components
import { FaBusinessTime, FaAward, FaMapMarkedAlt } from "react-icons/fa"; // Importing icons for visual appeal

const BusinessDetails = ({ businessDetails }) => {
  return (
    <div className="mt-8 max-w-full sm:max-w-3xl md:max-w-4xl mx-auto p-4">
      {/* Main Card */}
      <Card className="shadow-xl rounded-lg bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Business Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Business Name */}
          <div className="mb-4 sm:mb-6 flex items-center">
            <FaBusinessTime className="text-indigo-600 mr-3 text-xl sm:text-2xl" />
            <CardDescription className="text-sm sm:text-lg font-medium text-gray-700">
              <strong>Business Name:</strong> {businessDetails?.businessName}
            </CardDescription>
          </div>

          {/* Years of Experience */}
          <div className="mb-4 sm:mb-6 flex items-center">
            <FaAward className="text-yellow-500 mr-3 text-xl sm:text-2xl" />
            <CardDescription className="text-sm sm:text-lg font-medium text-gray-700">
              <strong>Years of Experience:</strong>{" "}
              {businessDetails?.yearsOfExperience}
            </CardDescription>
          </div>

          {/* Areas of Operation */}
          <div className="mb-4 sm:mb-6 flex items-center">
            <FaMapMarkedAlt className="text-green-600 mr-3 text-xl sm:text-2xl" />
            <CardDescription className="text-sm sm:text-lg font-medium text-gray-700">
              <strong>Areas of Operation:</strong>
              {businessDetails?.areasOfOperation?.join(", ")}
            </CardDescription>
          </div>

          {/* Certifications */}
          <div className="mb-4 sm:mb-6 flex items-center">
            <FaAward className="text-orange-500 mr-3 text-xl sm:text-2xl" />
            <CardDescription className="text-sm sm:text-lg font-medium text-gray-700">
              <strong>Certifications:</strong>
              {businessDetails?.certifications?.join(", ")}
            </CardDescription>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-500">
              Updated Recently
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BusinessDetails;
