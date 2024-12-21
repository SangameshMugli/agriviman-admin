import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import close from "../images/close.png";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Header from "./Header";
import Sidebar from "./Sidebar";

function UpdatePart() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { part_id } = useParams();

  const [formData, setFormData] = useState({
    part_name: "",
    quantity: "",
    date_of_manufacture: "",
    Price: "",
  });

  // Fetch existing data when the component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/fetchpart/${part_id}`)
      .then((response) => {
        setFormData({
          part_name: response.data.part_name,
          quantity: response.data.quantity,
          Price: response.data.Price,
          date_of_manufacture: response.data.date_of_manufacture,
        });
      })
      .catch((error) => {
        toast.error("Failed to fetch part details");
        console.log("Error fetching part details", error);
      });
  }, [part_id]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.part_name.length > 200) {
      newErrors.part_name = "Part name exceeded character limit";
    }

    if (formData.quantity && !/^\d+$/.test(formData.quantity)) {
      newErrors.quantity = "Quantity must be a positive integer";
    }

    if (formData.Price && !/^\d+$/.test(formData.Price)) {
      newErrors.Price = "Price must be a positive integer";
    }

    if (
      formData.date_of_manufacture &&
      !/^\d{4}-\d{2}-\d{2}$/.test(formData.date_of_manufacture)
    ) {
      newErrors.date_of_manufacture =
        "Date of manufacture must be in the format YYYY-MM-DD";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios
        .put(`http://localhost:5001/api/updatepart/${part_id}`, formData)
        .then((response) => {
          toast.success("Part updated successfully");
          navigate("/drone");
        })
        .catch((error) => {
          console.log("Error updating part", error);
          toast.error("Failed to update the part");
        });
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

        <div className="mx-auto my-12">
          <div className="relative bg-white border border-gray-200 p-8 rounded-lg shadow-xl  w-[450px] ">
            <div className="w-full flex justify-between text-center my-2">
              <h2 className="text-black text-2xl font-medium ">Update Part</h2>
              <button
                type="button"
                className="text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                onClick={handleCancel}
                id={`update${formData.part_id}`}
              >
                <ReactTooltip
                  anchorId={`update${formData.part_id}`}
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
                  className="border-black border-2 p-2 w-full"
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
                  className="border-black border-2 p-2 w-full"
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
                  type="text"
                  name="date_of_manufacture"
                  placeholder="YYYY-MM-DD"
                  className="border-black border-2 p-2 w-full"
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
                  Update
                </button>
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default UpdatePart;
