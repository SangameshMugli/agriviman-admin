import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";

function AdminPage() {
  return (
    <div className="h-screen overflow-y-hidden bg-dashboard font-para ">
      <div>
        <Header />
      </div>

      <div className="flex">
        <div className="">
          <Sidebar />
        </div>

        <div>
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
