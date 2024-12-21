import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Header from "./Header";
import Sidebar from "./Sidebar";
import close from "../images/close.png"

function AddTask() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    acres: "",
    field_type: "",
    assigned_to_pilot_id: "",
    assigned_date: "",
    status: "",
    contact_request_id: "",
  });

  const [pilots, setPilots] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);

  useEffect(() => {
    const fetchPilotsAndRequests = async () => {
      try {
        // Fetching the available pilots id
        const pilotsResponse = await axios.get("http://localhost:5001/api/fetchpilot", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPilots(pilotsResponse.data);
  
        // Fetching the available contact request id
        const contactRequestsResponse = await axios.get("http://localhost:5001/api/request", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setContactRequests(contactRequestsResponse.data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem('token');
          navigate('/login'); // Redirect to login if unauthorized
        } else {
          toast.error("Failed to fetch data. Please try again.");
        }
      }
    };
  
    fetchPilotsAndRequests();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.acres) {
      newErrors.acres = "Acres are required";
    }

    if (!formData.field_type) {
      newErrors.field_type = "Field type is required";
    }

    if (!formData.assigned_to_pilot_id) {
      newErrors.assigned_to_pilot_id = "Assigned pilot is required";
    }

    if (!formData.assigned_date) {
      newErrors.assigned_date = "Assigned date is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.contact_request_id) {
      newErrors.contact_request_id = "Contact request ID is required";
    }

    if (!formData.service) {
      newErrors.service = "Service must be selected";
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
  };

  const handleApiError=(error)=>{
    if(error.response?.status===401){
      toast.error("Session expired!!.. Please log in again...")
      localStorage.removeItem('token')
      navigate('/login')
    }else{
      toast.error(error.response?.data?.message || "Failed to submit the form")
    }

  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data:", formData);
      try{
        await axios
        .post("http://localhost:5001/api/addtask", formData,{
          headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
        })
        toast.success("Task added successfully");
          navigate("/task");
      }
        catch(error) {
          handleApiError(error)
        }
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const handleCancel = () => {
    navigate("/task");
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full  bg-dashboard flex flex-col">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex flex-grow items-center justify-center">
          <div className="w-full bg-white p-4 mx-10 rounded-lg shadow-lg">
            <div className="w-full flex justify-between my-4">
              <h2 className="text-black text-2xl font-medium font-heading">
                Task Details
              </h2>
              <button
                  type="button"
                  className="  transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                  onClick={handleCancel} id="close"
                >
                  <ReactTooltip anchorId="close" place="bottom" content="Close" variant="info"/>
                  <img src={close} alt="" className="h-8 w-8"/>
                </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex m-10">
                <label className="py-2 w-1/4 text-lg">Acres: </label>
                <input
                  type="number"
                  name="acres"
                  placeholder="Acres"
                  className="border-black border-2 p-2  w-full"
                  value={formData.acres}
                  onChange={handleChange}
                />
                {errors.acres && (
                  <p className="text-red-500 text-sm mt-1">{errors.acres}</p>
                )}
              </div>
             
              <div className="flex m-10">
                <label className="py-2 w-1/4 text-lg">Field Type</label>
                <select
                  name="field_type"
                  className="border-black border-2 p-2 w-full"
                  value={formData.field_type}
                  onChange={handleChange}
                >
                  <option value="">Select Field Type</option>
                  <option value="Crop Fields">Crop Fields</option>
                  <option value="Pastures">Pastures</option>
                  <option value="Orchards">Orchards</option>
                  <option value="Vineyards">Vineyards</option>
                  <option value="Greenhouses">Greenhouses</option>
                  <option value="Farmyards">Farmyards</option>
                  <option value="Vegetable Farms">Vegetable Farms</option>
                  <option value="Nurseries">Nurseries</option>
                  <option value="Rice Paddies">Rice Paddies</option>
                </select>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1">{errors.field_type}</p>
                )}
              </div>
              <div className="flex m-10">
                <label className="py-2 w-1/4 text-lg">Service</label>
                <select
                  name="service"
                  className="border-black border-2 p-2 w-full"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="">Select Service</option>
                  <option value="Pesticide Spraying">Pesticide Spraying</option>
                  <option value="Fertilizer Application">Fertilizer Application</option>
                  <option value="Herbicide Application">Herbicide Application</option>
                  <option value="Seed Planting">Seed Planting</option>
                  <option value="Disease Monitoring">Disease Monitoring</option>
                  <option value="Nutrient Monitoring">Nutrient Monitoring</option>
                  <option value="Field Mapping">Field Mapping</option>
                  <option value="Crop Health Analysis">Crop Health Analysis</option>
                </select>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1">{errors.service}</p>
                )}
              </div>
              <div className="flex  m-10">
                <label className="py-2 w-1/4 text-lg">Assigned Pilot</label>
                <select
                  name="assigned_to_pilot_id"
                  className="border-black border-2 p-2 w-full"
                  value={formData.assigned_to_pilot_id}
                  onChange={handleChange}
                >
                  <option value="">Select a pilot</option>
                  {pilots.map((pilot) => (
                    <option key={pilot.pilot_id} value={pilot.pilot_id}>
                      {pilot.pilot_id}-{pilot.pilot_name}
                    </option>
                  ))}
                </select>
                {errors.assigned_to_pilot_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.assigned_to_pilot_id}</p>
                )}
              </div>
              <div className="flex m-10">
                <label className="py-2 w-1/4 text-lg">Assigned Date</label>
                <input
                  type="date"
                  name="assigned_date"
                  className="border-black border-2 p-2 w-full"
                  value={formData.assigned_date}
                  min={getTodayDate()}
                  onChange={handleChange}
                />
                {errors.assigned_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.assigned_date}</p>
                )}
              </div>
              <div className="flex  m-10">
                <label className="py-2 w-1/4 text-lg">Status</label>
                <select
                  name="status"
                  className="border-black border-2 p-2 w-full"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  <option value="Completed ">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>
              <div className="flex m-10">
                <label className="py-2 w-1/4 text-lg">Contact Request ID</label>
                <select
                  name="contact_request_id"
                  className="border-black border-2 p-2 w-full"
                  value={formData.contact_request_id}
                  onChange={handleChange}
                >
                  <option value="">Select a contact request</option>
                  {contactRequests.map((request) => (
                    <option key={request.request_id} value={request.request_id}>
                      {request.request_id}-{request.name}
                    </option>
                  ))}
                </select>
                {errors.contact_request_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact_request_id}</p>
                )}
              </div>
              <div className="flex justify-evenly py-2">
                
                <button
                  type="submit"
                  className="bg-green p-2 my-2 rounded-xl font-button text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                >
                  Add Task
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

export default AddTask;