import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Footer } from "./components";
import { useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";

function App() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.user);

  // Check if the user has completed the onboarding process
  const checkOnboarding = async () => {
    await axios
      .get(`${baseUrl}/api/v1/auth/check-onbaording`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .then((res) => {
        if (!res.data.data) {
          navigate("/vendors/onboarding");
        }
      })
      .catch((err) => {
        console.log("Error while checking onboarding", err);
      });
  };

  useEffect(() => {
    checkOnboarding();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 ">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
