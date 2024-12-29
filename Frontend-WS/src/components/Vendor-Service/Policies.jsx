import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import ShadCN Card components
import {
  FaRegHandshake,
  FaMoneyBillWave,
  FaCalendarCheck,
} from "react-icons/fa"; // Importing icons for each policy

const Policies = ({ policies }) => {
  return (
    <div className="mt-8 max-w-full sm:max-w-3xl md:max-w-4xl mx-auto p-4">
      {/* Main Card without background color */}
      <Card className="shadow-lg rounded-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Cancellation Policy */}
          <div className="mb-4 sm:mb-6 flex items-center">
            <FaCalendarCheck className="text-red-500 mr-3 text-xl sm:text-2xl" />
            <CardDescription className="text-sm sm:text-lg font-medium text-gray-700">
              <strong>Cancellation:</strong> {policies?.cancellation}
            </CardDescription>
          </div>

          {/* Refund Policy */}
          <div className="mb-4 sm:mb-6 flex items-center">
            <FaRegHandshake className="text-blue-500 mr-3 text-xl sm:text-2xl" />
            <CardDescription className="text-sm sm:text-lg font-medium text-gray-700">
              <strong>Refund:</strong> {policies?.refund}
            </CardDescription>
          </div>

          {/* Payment Terms */}
          <div className="mb-4 sm:mb-6 flex items-center">
            <FaMoneyBillWave className="text-green-500 mr-3 text-xl sm:text-2xl" />
            <CardDescription className="text-sm sm:text-lg font-medium text-gray-700">
              <strong>Payment Terms:</strong> {policies?.paymentTerms}
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

export default Policies;
