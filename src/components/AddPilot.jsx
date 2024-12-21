import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import close from "../images/close.png";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Header from "./Header";
import Sidebar from "./Sidebar";

function AddPilot() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    pilot_name: "",
    email: "",
    phone_number: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pilot_name) {
      newErrors.pilot_name = "Pilot name is required";
    } else if (formData.pilot_name.length > 200) {
      newErrors.pilot_name = "Name exceeded characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      formData.email.length > 200
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (
      formData.phone_number.length > 10 ||
      !/^\d+$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Phone number must be a maximum of 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "pilot_name") {
      // Capitalize the first letter and make the rest lowercase for pilot name
      formattedValue =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    } else if (name === "email") {
      // Ensure email is always lowercase
      formattedValue = value.toLowerCase();
    }
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired!!.. Please log in again ");
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      toast.error(error.response?.data?.message || "Failed to submit the form");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post("http://localhost:5001/api/addpilot", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        toast.success("Pilot Added successfully");
        navigate("/pilotpage");
      } catch (error) {
        handleApiError(error);
      }
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const handleCancel = () => {
    navigate("/pilotpage");
  };

  return (
    <div className="h-screen overflow-y-hidden   bg-dashboard ">
      <Header />

      <div className="flex  ">
        <div>
          <Sidebar />
        </div>

        <div className="mx-auto my-20  ">
          <div className=" bg-white bg-opacity-20   backdrop-filter backdrop-blur-lg w-[400px] p-4 mx-10 rounded-lg shadow-lg">
            <div className="w-full flex text-center justify-between mb-4">
              <h2 className=" text-2xl font-medium font-heading">
                Pilot Details
              </h2>
              <button
                type="button"
                className="  rounded-xl font-button text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                onClick={handleCancel}
                id="close"
              >
                <ReactTooltip
                  anchorId="close"
                  content="Close"
                  variant="info"
                  place="bottom"
                />
                <img src={close} alt="" className="h-8 w-8" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-4">
                <label className="py-2 font-para2  text-lg">Pilot Name</label>
                <input
                  type="text"
                  name="pilot_name"
                  placeholder="Pilot name"
                  className="border-black border-2 p-2 w-full bg-white bg-opacity-50 text-black"
                  value={formData.pilot_name}
                  onChange={handleChange}
                />
                {errors.pilot_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pilot_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col mb-4">
                <label className="py-2 font-para2  text-lg">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border-black border-2 p-2 w-full bg-white bg-opacity-50 text-black"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col mb-4">
                <label className="py-2 font-para2  text-lg">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Phone number"
                  className="border-black border-2 p-2 w-full bg-white bg-opacity-50 text-black"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone_number}
                  </p>
                )}
              </div>
              <div className="flex justify-evenly py-2">
                <button
                  type="submit"
                  className="bg-green p-2 my-2 rounded-xl font-button text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                >
                  Add Pilot
                </button>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPilot;
