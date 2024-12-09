import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice.js";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { baseUrl } from "../../urls.js";

function Login() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const [isShow, setIsShow] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const toggleEye = () => {
    setIsShow(!isShow);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    axios
      .post(`${baseUrl}/users/login`, {
        email,
        password,
      })
      .then((res) => {
        // console.log("user data:", res.data.data);

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

        const userData = res.data.data;

        dispatch(loginUser({ userData }));

        navigate("/users/home");
      })
      .catch((err) => {
        setError("Invalid email or password");
        // setError(err.message);
        console.log("Error is : ", err);
      });
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200 m-0 p-0">
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
              <h1 className="text-3xl front-small">Login Now</h1>
              {error && <p className="text-red-500">{error}</p>}

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
                  <a href="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <Link to="/users/register" className="hover:underline">
                  Don't have account | Sign Up Here
                </Link>
                <Link
                  to="/vendors/login"
                  className="hover:text-slate-300 hover:underline"
                >
                  Login as Vendor
                </Link>
              </div>
              <div className="bg-base-300 text-yellow rounded-md">
                <p>email: demo@mail.com</p>
                <p>password: demo123</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
