import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginVendor } from "../store/authSlice";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { baseUrl } from "../../urls";

function VenderLogin() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const toggleEye = () => {
    setIsShow(!isShow);
  };

  const handleSubmit = (e) => {
    setError("");
    e.preventDefault();

    axios
      .post(`${baseUrl}/vendors/login`, {
        email,
        password,
      })
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data;

        // Set cookies using js-cookie library
        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refreshToken", refreshToken, {
          secure: true,
          sameSite: "strict",
        });

        console.log("accessToken: ", accessToken);
        console.log("refreshToken: ", refreshToken);

        // console.log("Login details : ", res.data.data.accessToken);

        const vendorData = res.data.data;

        console.log("Vendor data: ", vendorData);
        dispatch(loginVendor({ vendorData }));

        navigate("/vendors/home");
      })
      .catch((err) => {
        setError("Invalid email or password");
        console.log(err);
      });
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <img
              src="/img/login.svg"
              alt="Login image"
              style={{ width: "500px", height: "500px" }}
            />
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleSubmit} className="card-body">
              <h1 className="text-3xl font-sm">Vendor Login</h1>
              {error && <p className="text-red-600">{error}</p>}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={isShow ? "text" : "password"}
                    placeholder="password"
                    className="input input-bordered pr-10 pl-8"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={toggleEye}
                  >
                    {isShow ? <Eye /> : <EyeOff />}
                  </div>
                </div>
                <label className="label">
                  <Link to="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <Link
                  to="/vendors/register"
                  className="py-3 hover:text-slate-300 hover:underline"
                >
                  Create new acoount.
                </Link>
                <Link
                  to="/users/login"
                  className="py-3 hover:text-slate-300 hover:underline"
                >
                  Login as User
                </Link>
              </div>

              <div className="bg-base-300 text-yellow rounded-md">
                <p>email: arjun.gupta@gmail.com</p>
                <p>password: demo123</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default VenderLogin;
