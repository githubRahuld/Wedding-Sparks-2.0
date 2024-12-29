import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const handleTokenRefresh = async () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  try {
    const response = await axios.post(
      `${baseUrl}/api/v1/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );

    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  } catch (error) {
    if (error.response?.status === 401) {
      // Token refresh failed, logout the user
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      navigate("/auth/login");
    } else {
      console.error(error.message);
    }
  }
};
