import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ServiceDetails from "./pages/ServiceDetails";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import VendorDash from "./pages/VendorDash";
import Payment from "./pages/Payment";
import VendorListings from "./pages/VendorListings";
import CreateListing from "./pages/CreateListing";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth/signup",
        element: <Signup />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/users/home",
        element: <Home />,
      },
      {
        path: "/users/service-details/:vendorId",
        element: <ServiceDetails />,
      },
      {
        path: "/users/booking",
        element: <Booking />,
      },
      {
        path: "/users/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/vendors/dashboard",
        element: <VendorDash />,
      },
      {
        path: "/users/payment/:bookingId",
        element: <Payment />,
      },
      {
        path: "/vendors/listings",
        element: <VendorListings />,
      },
      {
        path: "/vendors/create-listing",
        element: <CreateListing />,
      },
      {
        path: "/vendors/onboarding",
        element: <Onboarding />,
      },
      {
        path: "/users/profile",
        element: <Profile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <main>
      <RouterProvider router={router} />
    </main>
  </Provider>
);
