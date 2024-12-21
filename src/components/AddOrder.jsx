import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip as ReactTooltip } from "react-tooltip";


import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import close from "../images/close.png";

function AddOrder() {
  const navigate = useNavigate();
  const { part_id } = useParams();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    part_id: part_id || "",
    quantity: "",
    ordered_date: "",
    status: "In Transit",
    request_id: "",
    total_price: "",
  });
  const [contactRequests, setContactRequests] = useState([]);

  useEffect(() => {
    if (part_id) {
      setFormData((prevData) => ({
        ...prevData,
        part_id: part_id,
      }));
      // Fetch the part details to calculate the total price
      fetchPartDetails(part_id);
    }
  }, [part_id]);

  useEffect(() => {
    const fetchContactRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/request", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setContactRequests(response.data);
      } catch (error) {
        console.error("Error fetching contact requests:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem('token');
          navigate('/login'); // Redirect to login page if unauthorized
        } else {
          toast.error("Failed to fetch contact requests.");
        }
      }
    };
  
    fetchContactRequests();
  }, [navigate]);

  const fetchPartDetails = (partId) => {
    axios
      .get(`http://localhost:5001/api/fetchpart/${partId}`)
      .then((response) => {
        const part = response.data;
        setFormData((prevData) => ({
          ...prevData,
          total_price: part.Price * prevData.quantity,
        }));
      })
      .catch((error) => console.error("Error fetching part details:", error));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.part_id) {
      newErrors.part_id = "Part ID is required";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (!/^\d+$/.test(formData.quantity) || formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be a positive integer";
    }

    if (!formData.ordered_date) {
      newErrors.ordered_date = "Ordered date is required";
    } else if (isNaN(Date.parse(formData.ordered_date))) {
      newErrors.ordered_date = "Please enter a valid date";
    }

    if (!formData.request_id) {
      newErrors.request_id = "Request ID is required";
    } else if (!/^\d+$/.test(formData.request_id) || formData.request_id <= 0) {
      newErrors.request_id = "Request ID must be a positive integer";
    }

    if (!formData.total_price) {
      newErrors.total_price = "Total price is required";
    } else if (formData.total_price <= 0) {
      newErrors.total_price = "Total price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "quantity" && formData.part_id) {
      // Update total price based on quantity
      fetchPartDetails(formData.part_id);
    }
  };


  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      // Retrieve the JWT token from local storage
      const token = localStorage.getItem("token");
  
      axios
        .post(
          "http://localhost:5001/api/addorder",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the Authorization header
            },
          }
        )
        .then((response) => {
          toast.success("Order added successfully");
          navigate("/orders");
        })
        .catch((error) => {
          toast.error("Failed to submit the form");
          console.error(
            "Error submitting form:",
            error.response?.data || error.message
          );
        });
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const handleCancel = () => {
    navigate("/drone");
  };

  return (
    <div className="w-full  bg-dashboard flex flex-col">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex flex-grow items-center justify-center">
          <div className="w-full bg-white p-6 mx-10 rounded-lg shadow-lg">
            <div className="w-full flex justify-between  my-2">
              <h2 className="text-black text-2xl font-medium font-heading">
                Order details
              </h2>
              <button
                type="button"
                className="  transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                onClick={handleCancel} id="close"
              >
                <ReactTooltip anchorId="close" place="bottom" content="Close" variant="info"/>
                <img src={close} alt="" className="h-8 w-8" />
                
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-2">
                <label className="py-2 font-para2 text-lg">Part ID</label>
                <input
                  type="text"
                  name="part_id"
                  placeholder="Part ID"
                  className="border-black border-2 p-2 w-full"
                  value={formData.part_id}
                  onChange={handleChange}
                  readOnly
                />
                {errors.part_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.part_id}</p>
                )}
              </div>
              <div className="flex flex-col mb-4">
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
              <div className="flex flex-col mb-4">
                <label className="py-2 font-para2 text-lg">Ordered Date</label>
                <input
                  type="date"
                  name="ordered_date"
                  className="border-black border-2 p-2 w-full"
                  value={formData.ordered_date}
                  onChange={handleChange}
                />
                {errors.ordered_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ordered_date}
                  </p>
                )}
              </div>
              <div className="flex flex-col mb-4">
                <label className="py-2 font-para2 text-lg">Status</label>
                <select
                  name="status"
                  className="border-black border-2 p-2 w-full"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">In Transit</option>
                  <option value="Received">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>
              <div className="flex flex-col mb-4">
                <label className="py-2 font-para2 text-lg">
                  Contact Request ID
                </label>
                <select
                  name="request_id"
                  className="border-black border-2 p-2 w-full"
                  value={formData.request_id}
                  onChange={handleChange}
                >
                  <option value="">Select a contact request</option>
                  {contactRequests.map((request) => (
                    <option key={request.request_id} value={request.request_id}>
                      {request.request_id}-{request.name}
                    </option>
                  ))}
                </select>
                {errors.request_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.request_id}
                  </p>
                )}
              </div>
              <div className="flex flex-col mb-4">
                <label className="py-2 font-para2 text-lg">Total Price</label>
                <input
                  type="text"
                  name="total_price"
                  placeholder="Total Price"
                  className="border-black border-2 p-2 w-full"
                  value={formData.total_price}
                  readOnly
                />
                {errors.total_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.total_price}
                  </p>
                )}
              </div>
              <div className="flex justify-evenly py-2">
                <button
                  type="submit"
                  className="bg-green p-2 my-2 rounded-xl font-button text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddOrder;
