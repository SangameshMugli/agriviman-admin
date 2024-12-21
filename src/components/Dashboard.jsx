import React, { useEffect, useState } from "react";
import task from "../images/task.png";
import drone from "../images/drone.png";
import contact from "../images/telephone.png";
import pilot from "../images/pilot.png";
import order from "../images/checkout.png";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalPilots, setTotalPilots] = useState(0);
  const [totalParts, setTotalParts] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalOrders,setTotalOrders]=useState(0)

  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        // Making the API call to fetch the total number of requests
        const response = await axios.get(
          "http://localhost:5001/api/totalrequest"
        );

        // Assuming the response contains an array with a single object
        setTotalRequests(response.data[0].total); // Update totalRequests state
      } catch (error) {
        console.error("Error fetching request count:", error);
      }
    };

    fetchRequestCount();
  }, []);

  useEffect(() => {
    const fetchPilotCount = async () => {
      try {
        // Making the API call to fetch the total number of requests
        const response = await axios.get(
          "http://localhost:5001/api/totalpilots"
        );
        console.log(response);

        // Assuming the response contains an array with a single object
        setTotalPilots(response.data[0].total);
      } catch (error) {
        console.error("Error fetching request count:", error);
      }
    };

    fetchPilotCount();
  }, []);

  useEffect(() => {
    const fetchPartsCount = async () => {
      try {
        // Making the API call to fetch the total number of parts
        const response = await axios.get(
          "http://localhost:5001/api/totalparts"
        );
        console.log("API response:", response);

        // Assuming the response contains an array with a single object
        if (Array.isArray(response.data) && response.data.length > 0) {
          setTotalParts(response.data[0].total); // Update totalParts state
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching request count:", error);
      }
    };

    fetchPartsCount();
  }, []);

  useEffect(() => {
    const fetchTasksCount = async () => {
      try {
        // Making the API call to fetch the total number of tasks
        const response = await axios.get("http://localhost:5001/api/totaltasks");
        console.log("API response:", response);

        // Check if response.data is an array and has at least one element
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Extract the first object from the array
          const data = response.data[0];
          // Extract the value of the first key in the object
          const countValue = Object.values(data)[0];

          if (typeof countValue === 'number') {
            setTotalTasks(countValue); // Update totalTasks state
          } else {
            console.error("Unexpected data format, count value is not a number:", data);
          }
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching task count:", error);
      }
    };

    fetchTasksCount();
  }, []);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        // Making the API call to fetch the total number of tasks
        const response = await axios.get("http://localhost:5001/api/totalorders");
        console.log("API response:", response);

        // Check if response.data is an array and has at least one element
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Extract the first object from the array
          const data = response.data[0];
          // Extract the value of the first key in the object
          const countValue = Object.values(data)[0];

          if (typeof countValue === 'number') {
            setTotalOrders(countValue); // Update totalTasks state
          } else {
            console.error("Unexpected data format, count value is not a number:", data);
          }
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching task count:", error);
      }
    };

    fetchOrdersCount();
  }, []);

  return (
    <div className="">
      <div className="m-4 grid grid-cols-3 gap-4  font-para">
        <div className=" h-[250px] w-[370px] p-4 bg-gradient-to-r from-light-green to-green rounded-2xl">
          <div className="flex   justify-between ">
            <h2 className=" text-white">Requests</h2>
            <Link to="/requestpage">
              <img src={contact} alt="" className=" h-[60px] w-[60px] " />
            </Link>
          </div>
          <div>
            <p className="text-6xl text-black font-semibold my-10">
              {totalRequests}
            </p>
          </div>
        </div>

        <div className="  h-[250px] w-[370px] p-4 bg-gradient-to-r from-light-pink to-pink rounded-2xl">
          <div className="flex justify-between">
            <h2 className=" text-white">Pilots</h2>
            <Link to="/pilotpage">
              <img src={pilot} alt="" className=" h-[60px] w-[60px]  " />
            </Link>
          </div>
          <div>
            <p className="text-6xl text-black font-semibold my-10">
              {totalPilots}
            </p>
          </div>
        </div>

        <div className=" p-4 w-[370px] row-span-2 bg-gradient-to-r from-custom-blue to-custom-button rounded-2xl">
        <div className="flex justify-between">
            <h2 className=" text-white">Orders</h2>
            <Link to="/drone">
              <img src={order} alt="" className=" h-[60px] w-[60px]    " />
            </Link>
          </div>
          <div>
            <div>
            <p className="text-6xl text-white font-semibold my-10">
            {totalOrders !== null ? totalOrders : 'Loading...'}
          </p>
            </div>
          </div>
        </div>

        <div className=" h-[250px] w-[370px] p-4 bg-gradient-to-r from-light-blue to-blue rounded-2xl">
          <div className="flex justify-between">
            <h2 className=" text-white">Drone Parts</h2>
            <Link to="/drone">
              <img src={drone} alt="" className=" h-[60px] w-[60px]    " />
            </Link>
          </div>
          <div>
            <div>
              <p className="text-6xl text-black font-semibold my-10">
                {totalParts}
              </p>
            </div>
          </div>
        </div>

        <div className=" h-[250px] w-[370px] p-4 bg-gradient-to-r from-light-yellow to-yellow rounded-2xl">
          <div className="flex justify-between">
            <h2 className=" text-white">Tasks</h2>
            <Link to="/drone">
              <img src={task} alt="" className=" h-[60px] w-[60px]    " />
            </Link>
          </div>
          <div>
            <div>
            <p className="text-6xl text-black font-semibold my-10">
            {totalTasks !== null ? totalTasks : 'Loading...'}
          </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default Dashboard;
