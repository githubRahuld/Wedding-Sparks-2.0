import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Reviews = ({ reviews }) => {
  return (
    <>
      {reviews?.length > 0 && (
        <div className="mt-8 max-w-full px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg rounded-lg border border-gray-200 bg-white">
            <CardHeader className="text-center bg-gray-100 p-6 rounded-t-lg">
              <CardTitle className="text-3xl font-semibold text-gray-800">
                Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Grid Layout for Reviews */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {reviews?.map((review) => (
                  <div
                    key={review._id}
                    className="border-t py-6  flex flex-col items-start"
                  >
                    {/* Customer Avatar, Name, and Rating in One Line */}
                    <div className="flex flex-col items-center mb-4 space-y-2">
                      {/* Avatar and Name */}
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={review.customerId.avatar}
                            alt={review.customerId.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </Avatar>
                        <p className="font-semibold text-gray-800 text-center">
                          {review?.customerId?.name || "Anonymous"}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center text-yellow-500 mb-4">
                        {[...Array(5)].map((_, index) => {
                          if (index < Math.floor(review.rating)) {
                            return <FaStar key={index} />;
                          }
                          if (
                            index === Math.floor(review.rating) &&
                            review.rating % 1 >= 0.5
                          ) {
                            return <FaStarHalfAlt key={index} />;
                          }
                          return <FaRegStar key={index} />;
                        })}
                      </div>
                    </div>

                    {/* Review Comment */}
                    <CardDescription className="text-gray-600 text-sm sm:text-base mb-4 text-justify">
                      {review.comment || "No comments provided."}
                    </CardDescription>

                    {/* Optional Review Images */}
                    {review.images?.length > 0 && (
                      <div className="flex space-x-2 mb-4">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt="Review Image"
                            className="w-16 h-16 object-cover rounded-lg shadow-md transition-all transform hover:scale-110"
                          />
                        ))}
                      </div>
                    )}

                    {/* Vendor Badge */}
                    <div className="mt-4">
                      <Badge
                        variant="outline"
                        color="green"
                        className="text-xs font-medium"
                      >
                        Verified Review
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Reviews;
