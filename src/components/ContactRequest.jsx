import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import read from "../images/readmore.png";
import { Tooltip as ReactTooltip } from 'react-tooltip';

function ContactRequest() {
  const [requests, setRequests] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem('token');
      navigate('/login'); // Redirecting to the  login page
    } else {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // fetching the  token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("No token found. Please log in.");
          navigate('/login');
          return;
        }

        // Making the API call with Authorization header
        const response = await axios.get("http://localhost:5001/api/request", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log(response.data);
        setRequests(response.data);
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleReadMore = (request) => {
    setSelectedTask(request);
  };

  const closePopup = () => {
    setSelectedTask(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="bg-dashboard font-para">
      <div className="w-full p-8">
        {requests.length > 0 ? (
          <table className="min-w-full text-left glass3">
            <thead className="font-heading text-lg text-white bg-slate-900">
              <tr>
                <th className="py-2 px-4 border-b">Id</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Message</th>
                <th className="py-2 px-4 border-b">Action</th>
               
              </tr>
            </thead>
            <tbody className="font-para1 text-md">
              {requests.map((request) => (
                <tr key={request.request_id}>
                  <td className="py-2 px-4 border-b">{request.request_id}</td>
                  <td className="py-2 px-4 border-b">{request.name}</td>
                  <td className="py-2 px-4 border-b">{request.email}</td>
                  <td className="py-2 px-4 border-b">{request.phone_number}</td>
                  <td className="py-4 px-4 border-b">{request.message}</td>
                  <td>
                  <button
                            className="p- mx-2 transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                            onClick={() => handleReadMore(request)}
                            id={`read_${request.request_id}`}
                          >
                            <img src={read} alt="" className="h-10 w-10" />
                            <ReactTooltip anchorId={`read_${request.request_id}`} place="bottom"  content="Read more" variant="info"/>
                          </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-3xl font-heading">
            No contact requests found.
          </p>
        )}
      </div>
      {selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center glass3">
          <div className="bg-white p-6 rounded-xl border-4 border-slate-500 shadow-lg w-1/4 flex">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-center mb-4">Request Details</h2>
              <p><strong className="text-left text-[18px]">Request Id:</strong> {selectedTask.request_id}</p>
              <p><strong className="text-left">Customer Name:</strong> {selectedTask.name}</p>
              <p><strong className="text-left">Email:</strong> {selectedTask.email}</p>
              <p><strong className="text-left">Phone Number:</strong> {selectedTask.phone_number}</p>
              <p><strong className="text-left">Message:</strong> {selectedTask.message}</p>
              <p><strong className="text-left">Drone Type:</strong> {selectedTask.drone_type}</p>
              <p><strong className="text-left"> Date of Request:</strong> {formatDate(selectedTask.date_of_request)}</p>
              <button
                className="mt-4 bg-red-600 p-2 rounded-xl mx-32 text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
            
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default ContactRequest;
