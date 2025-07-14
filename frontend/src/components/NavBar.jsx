import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom"; // ✅ Import Link

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Members", to: "/members" },
    { label: "Stats", to: "/stats" },
    { label: "Certificates", to: "/generate-certificate" },
    { label: "Logout", to: "/logout", danger: true },
  ];

  return (
    <nav className="bg-black text-white px-6 sm:px-10 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Logo */}
        <div className="text-xl sm:text-2xl font-bold tracking-wide text-yellow-400">
          AB FITNESS GYM
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          {navLinks.map(({ label, to, danger }) => (
            <li key={label}>
              <Link
                to={to}
                className={`cursor-pointer hover:text-yellow-400 transition ${
                  danger ? "hover:text-red-400 text-red-300" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Icon */}
        <div
          className="md:hidden cursor-pointer text-yellow-400 text-xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <ul className="md:hidden flex flex-col gap-4 mt-4 px-4 text-sm font-medium bg-zinc-900 py-4 rounded-lg shadow-lg">
          {navLinks.map(({ label, to, danger }) => (
            <li key={label}>
              <Link
                to={to}
                onClick={() => setOpen(false)} // Close menu on click
                className={`block cursor-pointer hover:text-yellow-400 transition ${
                  danger ? "hover:text-red-400 text-red-300" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
