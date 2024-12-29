import React from "react";
import { FaEdit, FaCheckCircle, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Time from "@/components/Time";

import styled from "styled-components";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <StyledWrapper>
      <div
        id="container"
        className="bg-gray-50 min-h-screen py-8 px-4 flex justify-center items-center"
      >
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-6 space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className="rounded-full"
              />
            </Avatar>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 text-gray-600">
              <FaEnvelope className="text-lg text-blue-500" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <FaPhoneAlt className="text-lg text-green-500" />
              <span className="text-sm">{user.phoneNumber}</span>
            </div>
          </div>

          {/* Onboarding Status */}
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border">
            {user.onboardingCompleted ? (
              <FaCheckCircle className="text-green-500 text-2xl" />
            ) : (
              <FaEdit className="text-yellow-500 text-2xl" />
            )}
            <p className="text-lg text-gray-700 font-medium">
              {user.onboardingCompleted
                ? "Onboarding Completed"
                : "Onboarding Pending"}
            </p>
          </div>

          {/* Real-Time Display */}
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <Time />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  #container {
    width: 100%;
    height: 100%;
    /* Add your background pattern here */
    background-color: #e5e5f7;
    background-image: radial-gradient(#444cf7 10%, transparent 10%),
      radial-gradient(#444cf7 10%, transparent 10%);
    background-size: 100px 100px;
    background-position: 0 0, 50px 50px;
  }
`;

export default Profile;
