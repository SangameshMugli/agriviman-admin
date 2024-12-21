import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import close from "../images/close.png";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Header from "./Header";
import Sidebar from "./Sidebar";

function AddPart() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    part_name: "",
    quantity: "",
    date_of_manufacture: "",
    Price: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.part_name) {
      newErrors.part_name = "Part name is required";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (!/^\d+$/.test(formData.quantity) || formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be a positive integer";
    }

    if (!formData.Price) {
      newErrors.Price = "Price is required";
    } else if (!/^\d+$/.test(formData.Price) || formData.Price <= 0) {
      newErrors.Price = "Price must be a positive integer";
    }

    if (!formData.date_of_manufacture) {
      newErrors.date_of_manufacture = "Date of manufacture is required";
    } else if (isNaN(Date.parse(formData.date_of_manufacture))) {
      newErrors.date_of_manufacture = "Please enter a valid date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login"); // Redirect to login page
    } else {
      toast.error(error.response?.data?.message || "Failed to submit the form");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await axios.post("http://localhost:5001/api/addpart", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        toast.success("Drone part added successfully");
        navigate("/drone");
      } catch (error) {
        handleApiError(error);
      }
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const handleCancel = () => {
    navigate("/drone");
  };

  return (
    <div className="h-screen overflow-y-hidden   bg-dashboard ">
      <Header />

      <div className="flex  ">
        <div>
          <Sidebar />
        </div>

        <div className="mx-auto my-12" >
          <div className="relative bg-white border border-gray-200 p-8 rounded-lg shadow-xl  w-[450px] ">
            <div className=" flex justify-between text-center my-2">
              <h2 className="text-2xl font-medium ">Add Drone Part</h2>
              <button
                type="button"
                className="text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                onClick={handleCancel}
                id="close"
              >
                <ReactTooltip
                  anchorId="close"
                  place="bottom"
                  content="Close"
                  variant="info"
                />
                <img src={close} alt="" className="h-8 w-8" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-2">
                <label className="py-2 font-para2 text-lg">Part Name</label>
                <select
                  name="part_name"
                  placeholder="Part name"
                  className="border-2 p-2 w-full bg-transparent placeholder-gray-300"
                  value={formData.part_name}
                  onChange={handleChange}
                >
                  <option value="">Select Part Name</option>
                  <option value="Battery">Battery</option>
                  <option value="Heavy duty motor">Heavy duty motor</option>
                  <option value="Liquid tank">Liquid tank</option>
                  <option value="Sprayer">Sprayer</option>
                  <option value="Spray boom nozzles">Spray boom nozzles</option>
                  <option value="Telemetry system">Telemetry system</option>
                </select>
                {errors.part_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.part_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col mb-2">
                <label className="py-2 font-para2 text-lg">Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  placeholder="Quantity"
                  className="border-2 p-2 w-full bg-transparent placeholder-gray-300"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>
              <div className="flex flex-col mb-2">
                <label className="py-2 font-para2 text-lg">Price</label>
                <input
                  type="text"
                  name="Price"
                  placeholder="Price"
                  className="border-2 p-2 w-full bg-transparent placeholder-gray-300"
                  value={formData.Price}
                  onChange={handleChange}
                />
                {errors.Price && (
                  <p className="text-red-500 text-sm mt-1">{errors.Price}</p>
                )}
              </div>
              <div className="flex flex-col mb-4">
                <label className="py-2 font-para2 text-lg">
                  Date of Manufacture
                </label>
                <input
                  type="date"
                  name="date_of_manufacture"
                  className="border-2 p-2 w-full bg-transparent placeholder-gray-300"
                  value={formData.date_of_manufacture}
                  onChange={handleChange}
                />
                {errors.date_of_manufacture && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date_of_manufacture}
                  </p>
                )}
              </div>
              <div className="flex justify-evenly ">
                <button
                  type="submit"
                  className="bg-green p-2 my-2 rounded-xl font-button text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                >
                  Add Part
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

export default AddPart;
