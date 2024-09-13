import React from "react";
import Group from "../assets/Group.png";

const Navbar = () => {
  return (
    <nav className="sticky text-custom-ylw font-oswald p-4 z-100">
      <div className=" flex sm:mx-16 mx-auto items-center justify-center gap-x-4">
        <img src={Group} className="h-12 w-16"></img>
        <h1 className="text-2xl sm:text-4xl font-bold">AIT SMART LABS</h1>
      </div>
    </nav>
  );
};

export default Navbar;
