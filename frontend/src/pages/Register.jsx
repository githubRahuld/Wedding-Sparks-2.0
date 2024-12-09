import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cPassword, setCPassword] = useState();
  const [avatar, setAvatar] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("cPassword", cPassword);
    formData.append("avatar", avatar);

    axios
      .post(`${baseUrl}/users/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type
        },
      })
      .then((res) => {
        setLoading(false);
        console.log(res);
        navigate("/users/login");
      })
      .catch((err) => {
        console.log(err);
        setError("All Fields are required");
      });
  };

  return (
    <>
      {loading ? (
        <span className="loading loading-spinner loading-lg text-black"></span>
      ) : (
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <img
                src="/img/register.svg"
                alt="Register img"
                style={{ width: "500px", height: "500px" }}
              />
            </div>
            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <form
                onSubmit={handleSubmit}
                className="card-body"
                encType="multipart/form-data"
              >
                <h1 className="text-3xl font-small">Sign Up Now</h1>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    type="name"
                    name="name"
                    placeholder="name"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    placeholder="email"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    placeholder="password"
                    className="input input-bordered"
                    required
                  />
                  <label className="label">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <input
                    onChange={(e) => setCPassword(e.target.value)}
                    type="password"
                    name="password"
                    placeholder="confirm password"
                    className="input input-bordered"
                    required
                  />
                  {/* Upload image */}
                  <label className="label">
                    <span className="label-text">Upload Avatar</span>
                  </label>
                  <input
                    type="file"
                    className="input input-bordered text-white"
                    placeholder="Upload avatar"
                    onChange={(e) => setAvatar(e.target.files[0])}
                  />
                </div>
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                  <Link to="/users/login" className="hover:underline">
                    Already have account | Login here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;
