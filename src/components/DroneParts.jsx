import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

import edit from "../images/edit.png";
import deleteImg from "../images/bin.png"; // Renamed from 'delte' to 'delete'
import cart from "../images/addtocart.png";

// Importing the images for the drone parts
import battery from "../images/battery.png";
import motor from "../images/motor.avif";
import sprayBoomNozzles from "../images/Spray_Boom_Nozzles.avif";
import sprayer from "../images/sprayer.webp";
import telemetrySystem from "../images/Telemetry_System.jpg";
import defaultImage from "../images/battery.png";
import LiquidTank from "../images/liquidTank.png";

function DroneParts() {
  const navigate = useNavigate();
  const [droneParts, setDroneParts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mapping part names to corresponding images
  const partImages = {
    Battery: battery,
    "Heavy duty motor": motor,
    "Liquid tank": LiquidTank,
    "Spray boom nozzles": sprayBoomNozzles,
    Sprayer: sprayer,
    "Telemetry system": telemetrySystem,
  };

  useEffect(() => {
    const fetchDroneParts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/fetchparts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        if (Array.isArray(data)) {
          setDroneParts(data);
        } else {
          setDroneParts([data]);
        }
      } catch (error) {
        console.error("There was an error fetching the drone parts!!!", error);
        toast.error("Failed to fetch drone parts.");
      }
    };

    fetchDroneParts();
  }, []);

  const handleDelete = async (part_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/deletepart/${part_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
      navigate("/drone");
      toast.success("Drone Part Deleted successfully");
      
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDroneParts = droneParts.filter((part) =>
    part.part_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  return (
    <div className="bg-dashboard overflow-y-hidden font-para">
      <div className="w-full">
        <Header />
      </div>
      <div className="flex">
        <div className="h-screen">
          <Sidebar />
        </div>
        <div className="w-full">
          <div className="p-10">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by part name..."
                className="border p-2 rounded-lg w-1/2"
              />
              <Link to="/addDronePart">
                <button className="bg-light-green p-2 rounded-xl font-button text-white text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer">
                  Add Drone Part +
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredDroneParts.length > 0 ? (
                filteredDroneParts.map((data) => {
                  console.log("Part Name:", data.part_name);
                  console.log("Image Source:", partImages[data.part_name]);

                  return (
                    <div
                      key={data.part_id}
                      className="bg-white p-6 shadow-lg rounded glass3"
                    >
                      <img
                        src={partImages[data.part_name] || defaultImage}
                        alt={data.part_name}
                        className="h-48 w-full object-fill border-gray-400 border-2 rounded-lg mb-4"
                      />
                      <h2 className="text-xl mb-2">
                        <strong>Part ID: </strong>
                        {data.part_id}
                      </h2>
                      <p className="text-lg mb-2">
                        <strong>Part Name:</strong> {data.part_name}
                      </p>
                      <p className="text-lg mb-2">
                        <strong>Quantity:</strong> {data.quantity}
                      </p>
                      <p className="text-lg mb-2">
                        <strong>Price:</strong> ₹{data.Price}
                      </p>
                      <p className="text-lg mb-4">
                        <strong>Date of Manufacture:</strong>{" "}
                        {formatDate(data.date_of_manufacture)}
                      </p>
                      <div className="flex justify-between items-center">
                        <Link to={`/drone/updatepart/${data.part_id}`}>
                          <button
                            className="transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                            id={`edit_${data.part_id}`}
                          >
                            <img src={edit} alt="Edit" className="h-8 w-8" />
                            <ReactTooltip
                              anchorId={`edit_${data.part_id}`}
                              place="bottom"
                              effect="solid"
                              content="Edit"
                              variant="info"
                            />
                          </button>
                        </Link>
                        <button
                          className="transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                          onClick={() => handleDelete(data.part_id)}
                          id={`delete_${data.part_id}`}
                        >
                          <img src={deleteImg} alt="Delete" className="h-8 w-8" />
                          <ReactTooltip
                            anchorId={`delete_${data.part_id}`}
                            place="bottom"
                            effect="solid"
                            content="Delete"
                            variant="error"
                          />
                        </button>
                        <Link to={`/addorder/${data.part_id}`}>
                          <button
                            className="transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                            id={`cart_${data.part_id}`}
                          >
                            <img
                              src={cart}
                              alt="Add to Cart"
                              className="h-8 w-8"
                            />
                            <ReactTooltip
                              anchorId={`cart_${data.part_id}`}
                              place="bottom"
                              effect="solid"
                              content="Add to Cart"
                              variant="info"
                            />
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-3xl font-heading col-span-full">
                  No drone parts found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default DroneParts;
