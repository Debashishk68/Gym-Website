import React from "react";

const AppHeader = ({ title = "AB Fitness Gym" }) => {
  return (
    <header className="flex items-center justify-between border-b border-[#e7f0f4] px-10 py-3 shadow-sm">
      <div className="flex items-center gap-4 text-[#0d181c]">
        <div className="w-5 h-5 text-[#0d181c] transition-transform duration-300 hover:scale-110">
          <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      </div>
    </header>
  );
};

export default AppHeader;
