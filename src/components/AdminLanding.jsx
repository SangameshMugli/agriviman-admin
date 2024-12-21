import React from "react";
import { Link } from "react-router-dom";
import green from "../images/white.png";


function AdminLanding() {
  return (
    <div className="bg-gradient-to-r from-light-blue to-green min-h-screen flex flex-col ">
      <div className="flex items-center justify-between bg-gradient-to-r from-green to-blue h-[80px] px-4 md:px-8">
        
        <div>
          <h2 className="font-para text-2xl md:text-3xl text-white">WELCOME ADMIN</h2>
        </div>
        <div>
          <Link to="/login">
            <button className="bg-light-green mx-2 md:mx-4 p-2 rounded-xl font-button text-white text-sm md:text-lg transform transition-transform duration-200 hover:scale-105 hover:cursor-pointer">
              ADMIN LOGIN
            </button>
          </Link>
        </div>
      </div>

      
      <div className="flex flex-col md:flex-row items-center  justify-center  flex-grow p-4 md:p-8">
        <div className="w-full md:w-1/2 bg-white/30 backdrop-blur-lg rounded-xl p-6 md:m-4">
          <h1 className="text-2xl md:text-3xl text-gray-900 font-para pb-2">
            Agrivimaan | Aerial Solutions
          </h1>
          <h2 className="text-xl md:text-2xl font-para font-semibold text-white">
            Empowering Agriculture with Precision Drone Technology
          </h2>
          <p className="text-lg md:text-xl font-serif font-thin text-gray-900">
            As an administrator, you are at the forefront of transforming traditional farming methods into a data-driven, precision-focused operation. With Agrivimaan's cutting-edge drone technology, you can oversee vast expanses of farmland with unparalleled accuracy. From real-time monitoring of crop health to optimizing irrigation and resource allocation, our platform equips you with the tools to make informed decisions that maximize yield and sustainability. Welcome to the future of agriculture, where innovation meets efficiency, all at your fingertips.
          </p>
        </div>
        <div className="w-full md:w-auto mt-6 md:mt-0 md:ml-4 flex justify-center">
          <img src={green} className="h-64 md:h-96 w-auto" alt="Agrivimaan Logo" />
        </div>
      </div>
    </div>
  );
}

export default AdminLanding;
