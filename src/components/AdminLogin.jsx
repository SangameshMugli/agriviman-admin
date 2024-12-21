import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import green from "../images/white.png";

export default function AdminLogin() {
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function onChange(value) {
    setVerified(true);
  }

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const validateAdmin = () => {
    let valid = true;
    const newErrors = {};

    if (!login.email) {
      newErrors.email = "Username is required";
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login.email) ||
      login.email.length > 200
    ) {
      newErrors.email = "Please enter a valid username";
      valid = false;
    }

    if (!login.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (login.password.length < 8) {
      newErrors.password = "Enter the correct Password";
      valid = false;
    }

    if (!verified) {
      toast.error("Please select the CAPTCHA");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateAdmin()) {
      axios
        .post("http://localhost:5001/api/login", {
          email: login.email,
          password: login.password,
        })
        .then((response) => {
          console.log("Full response data:", response.data);

          // Adjusting the condition to handle a successful login message
          if (response.data.message.includes("Login successful")) {
            toast.success("Login successful!");

            // Store the token in localStorage
            localStorage.setItem("token", response.data.user_token);

            navigate("/page"); // Navigate to admin dashboard on successful login
          } else {
            console.log("Login failed:", response.data.message);
            toast.error(response.data.message || "Login failed");
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
          toast.error("An error occurred during login");
        });
    }
  };

  return (
    <div className="w-full h-screen font-para flex flex-col">
      <div className="text-center p-4 bg-gradient-to-r from-light-blue to-light-green">
        <h2 className="text-4xl text-white">Admin Login Page</h2>
      </div>

      <div className="flex flex-row items-center justify-evenly bg-gradient-to-r from-light-green to-light-blue flex-grow">
        <div className="glass bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-full text-center mb-4">
            <h2 className="text-black text-3xl font-semibold">Welcome Admin</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <div className="flex border-b border-gray-400 py-2">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-transparent outline-none placeholder-gray-500 text-lg font-light"
                  value={login.email}
                  onChange={(e) =>
                    setLogin({ ...login, email: e.target.value })
                  }
                />
                <div className="flex items-center justify-center ">
                  <i className="fa-solid fa-user text-xl"></i>
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex border-b border-gray-400 py-2">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent outline-none placeholder-gray-500 text-lg font-light"
                  value={login.password}
                  onChange={(e) =>
                    setLogin({ ...login, password: e.target.value })
                  }
                />
                <div className="flex items-center justify-center ">
                  <i className="fa-solid fa-lock text-2xl"></i>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LfcpiMqAAAAACjYR8NyjsWJOCmlc486vO3gr-vW"
                onChange={onChange}
                className="g-recaptcha"
                style={{ transform: "scale(0.90)", transformOrigin: "0 0" }}
              />
            </div>

            <div className="mt-4">
              <button
                className={`bg-gradient-to-r from-green-400 to-blue-500 w-full py-3 rounded-lg text-white font-medium text-xl hover:scale-105 transform transition-transform duration-300 ${
                  verified ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                disabled={!verified}
              >
                Login
              </button>
            </div>
          </form>
        </div>

        <div className="ml-8">
          <img src={green} alt="Admin" className="h-80 w-auto" />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
