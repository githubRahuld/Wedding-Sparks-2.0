import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaMoon, FaSun } from "react-icons/fa";

const Time = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isPM = hours >= 12;
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const period = isPM ? "PM" : "AM";

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const formatDate = (date) => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const isNightTime = time.getHours() >= 18 || time.getHours() < 6;

  return (
    <StyledWrapper>
      <div className="card">
        <p className="time-text">
          <span>{formatTime(time).split(" ")[0]}</span>
          <span className="time-sub-text">
            {formatTime(time).split(" ")[1]}
          </span>
        </p>
        <p className="day-text">{formatDate(time)}</p>
        {isNightTime ? (
          <FaMoon className="icon" title="Night Time" />
        ) : (
          <FaSun className="icon" title="Day Time" />
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 280px;
    height: 150px;
    background: linear-gradient(to right, rgb(20, 30, 48), rgb(36, 59, 85));
    border-radius: 15px;

    display: flex;
    color: white;
    justify-content: center;
    position: relative;
    flex-direction: column;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    padding: 20px;
  }

  .card:hover {
    box-shadow: rgb(0, 0, 0) 5px 10px 50px, rgb(0, 0, 0) -2px 0px 250px;
  }

  .time-text {
    font-size: 50px;
    margin: 0;
    font-weight: 600;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;
  }

  .time-sub-text {
    font-size: 15px;
    margin-left: 5px;
  }

  .day-text {
    font-size: 18px;
    margin: 10px 0 0 0;
    font-weight: 500;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;
  }

  .icon {
    font-size: 25px;
    position: absolute;
    right: 15px;
    top: 15px;
    transition: all 0.3s ease-in-out;
  }

  .card:hover > .icon {
    font-size: 28px;
  }
`;

export default Time;
