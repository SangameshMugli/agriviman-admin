import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import logout from "../images/exit.png";
import user from "../images/user.png";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true }); 
  };

  return (
    <div className="w-full h-[80px] bg-white ">
      <div className="flex items-center justify-between h-full px-2">
        <div className="flex items-center">
          <Link to="/" className="flex items-center no-underline">
            <button className="flex items-center justify-center ">
              <img src={user} className="w-auto h-[60px] text-black" />
              {/* <h2 className="">Admin</h2> */}
            </button>
            <span className="ml-2 text-[40px] font-semibold  text-black">
              Agrivimaann
            </span>
          </Link>
        </div>
        <div>
          <h2 className="font-para">WELCOME ADMIN</h2>
        </div>
        {/* Right-aligned buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className=" text-white py-2 px-4 rounded-lg hover:scale-110 duration-300 "
            id="logout"
          >
            <img
              src={logout}
              alt=""
              className="w-[45px] h-[40px]  text-black"
            />
            <ReactTooltip anchorId="logout" place="bottom" content="Logout" variant="info"/>
          </button>
        </div>
      </div>
    </div>
  );
}
