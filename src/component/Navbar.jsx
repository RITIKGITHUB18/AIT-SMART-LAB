import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { labLogo } from "../assets";

const Navbar = () => {
  return (
    <nav className="flex items-center text-[#EE764D] font-oswald p-4 z-100">
      <div className="flex sm:mx-16 mx-auto items-center justify-between">
        <div className="flex items-center justify-center gap-x-4">
          <img src={labLogo} className="h-12 w-16" alt="AIT Logo" />
          <h1 className="text-2xl sm:text-4xl font-bold">AIT SMART LABS</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
