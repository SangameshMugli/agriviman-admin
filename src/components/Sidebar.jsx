import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import dashboard from "../images/dashboard.png";
import contact from "../images/telephone.png";
import pilot from "../images/pilot.png";
import drone from "../images/drone.png";
import task from "../images/task.png";
import order from "../images/checkout.png";

function Sidebar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    switch (location.pathname) {
      case "/page":
        setActiveTab(1);
        break;
      case "/requestpage":
        setActiveTab(2);
        break;
      case "/pilotpage":
        setActiveTab(3);
        break;
      case "/drone":
        setActiveTab(4);
        break;
      case "/task":
        setActiveTab(5);
        break;
      case "/orders":
        setActiveTab(6);
        break;
      default:
        setActiveTab(0);
    }
  }, [location.pathname]);

  return (
    <div className="w-80 bg-white h-[900px]  inset-0  font-para">
      <div className="space-y-4">
        <div className="pt-4">
          <Link to="/page" className="no-underline">
            <button
              className={`w-full flex items-center justify-start space-x-4 px-4 py-2 hover:bg-icons ${
                activeTab === 1 ? "bg-custom-button" : ""
              }`}
            >
              <img src={dashboard} className="h-10 w-10" alt="Dashboard" />
              <span className="text-black text-xl font-semibold">Dashboard</span>
            </button>
          </Link>
        </div>
        <div className="pt-4">
          <Link to="/requestpage" className="no-underline">
            <button
              className={`w-full flex items-center justify-start space-x-4 px-4 py-2 hover:bg-icons ${
                activeTab === 2 ? "bg-custom-button" : ""
              }`}
            >
              <img src={contact} className="h-10 w-10" alt="Requests" />
              <span className="text-black text-xl font-semibold">Requests</span>
            </button>
          </Link>
        </div>
        <div className="pt-4">
          <Link to="/pilotpage" className="no-underline">
            <button
              className={`w-full flex items-center justify-start space-x-4 px-4 py-2 hover:bg-icons ${
                activeTab === 3 ? "bg-custom-button" : ""
              }`}
            >
              <img src={pilot} className="h-10 w-10" alt="Pilots" />
              <span className="text-black text-xl font-semibold">Pilots</span>
            </button>
          </Link>
        </div>
        <div className="pt-4">
          <Link to="/drone" className="no-underline">
            <button
              className={`w-full flex items-center justify-start space-x-4 px-4 py-2 hover:bg-icons ${
                activeTab === 4 ? "bg-custom-button" : ""
              }`}
            >
              <img src={drone} className="h-10 w-10" alt="Drone Parts" />
              <span className="text-black text-xl font-semibold">Drone Parts</span>
            </button>
          </Link>
        </div>
        <div className="pt-4">
          <Link to="/task" className="no-underline">
            <button
              className={`w-full flex items-center justify-start space-x-4 px-4 py-2 hover:bg-icons ${
                activeTab === 5 ? "bg-custom-button" : ""
              }`}
            >
              <img src={task} className="h-10 w-10" alt="Tasks" />
              <span className="text-black text-xl font-semibold">Tasks</span>
            </button>
          </Link>
        </div>
        <div className="pt-4">
          <Link to="/orders" className="no-underline">
            <button
              className={`w-full flex items-center justify-start space-x-4 px-4 py-2 hover:bg-icons ${
                activeTab === 6 ? "bg-custom-button" : ""
              }`}
            >
              <img src={order} className="h-10 w-10" alt="Orders" />
              <span className="text-black text-xl font-semibold">Orders</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
