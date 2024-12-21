import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

import edit from "../images/edit.png";
import deleteImg from "../images/bin.png"; 

function Pilot() {
  const navigate = useNavigate();
  const [pilot, setPilot] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPilots = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("No token found. Please log in.");
          navigate('/login');
          return;
        }

        // Make the API call with Authorization header
        const response = await axios.get("http://localhost:5001/api/fetchpilot", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = response.data;
        if (Array.isArray(data)) {
          setPilot(data);
        } else {
          setPilot([data]);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem('token');
          navigate('/login'); // Redirect to login page
        } else {
          console.error("There was an error fetching the pilots!!!", error);
          toast.error("Failed to fetch pilots");
        }
      }
    };

    fetchPilots();
  }, [navigate]);

  const handleDelete = async (pilot_id) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No token found. Please log in.");
        navigate('/login');
        return;
      }
  
      await axios.delete(`http://localhost:5001/api/deletepilot/${pilot_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Refresh the page after successful delete
      window.location.reload();
  
      toast.success("Pilot deleted successfully");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem('token');
        navigate('/login'); // Redirect to login page
      } else {
        console.log(err);
        toast.error("Something went wrong");
      }
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterPilotName = pilot.filter((name) => {
    return name.pilot_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-dashboard font-para">
      <div className="w-full">
        <div className="p-10">
          <div className="flex justify-between">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Pilot name..."
              className="border p-2 rounded-lg w-1/2"
            />

            <Link to="/addPilot">
              <button className="bg-light-green p-2 rounded-xl font-button text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer">
                Add Pilot +
              </button>
            </Link>
          </div>

          <div className="py-4">
            {Array.isArray(pilot) && filterPilotName.length > 0 ? (
              <table className="min-w-full text-left glass3">
                <thead className="font-heading text-xl text-white bg-slate-900">
                  <tr>
                    <th className="py-2 px-4 border-b">Id</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Phone Number</th>
                    <th className="py-2 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody className="font-para1 text-lg">
                  {filterPilotName.map((data) => (
                    <tr key={data.pilot_id}>
                      <td className="py-4 px-4 border-b">{data.pilot_id}</td>
                      <td className="py-4 px-4 border-b">{data.pilot_name}</td>
                      <td className="py-4 px-4 border-b">{data.email}</td>
                      <td className="py-4 px-4 border-b">{data.phone_number}</td>
                      <td>
                        <Link to={`/pilot/update/${data.pilot_id}`}>
                          <button
                            className="mx-4 transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                            id={`edit${data.pilot_id}`}
                          >
                            <img src={edit} alt="Edit" className="h-8 w-8" />
                            <ReactTooltip anchorId={`edit${data.pilot_id}`} place="bottom" content="Edit" variant="info" />
                          </button>
                        </Link>

                        <button
                          className="mx-2 transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                          onClick={() => handleDelete(data.pilot_id)}
                          id={`delete_${data.pilot_id}`}
                        >
                          <img src={deleteImg} alt="Delete" className="h-8 w-8" />
                          <ReactTooltip
                            anchorId={`delete_${data.pilot_id}`}
                            place="bottom"
                            effect="solid"
                            content="Delete"
                            variant="error"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-3xl font-heading">No pilots found.</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Pilot;
