import React from "react";
import Logo from "../assets/Logo.png"

const AppHeader = ({ title = "AB Fitness Gym" }) => {
  return (
    <header className="flex items-center justify-between border-b border-[#e7f0f4] px-10 py-3 shadow-sm">
      <div className="flex items-center gap-4 text-[#0d181c]">
        <div className="w-8 h-8 text-[#0d181c] transition-transform duration-300 hover:scale-110">
        <img src={Logo} alt="Ab Fitness Gym" />
        </div>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      </div>
    </header>
  );
};

export default AppHeader;
