import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Members", to: "/members" },
    { label: "Stats", to: "/stats" },
    { label: "Certificates", to: "/generate-certificate" },
    { label: "Logout", to: "/logout", danger: true },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-black/80 backdrop-blur-md text-white px-6 sm:px-10 py-4 shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2 text-yellow-400 font-bold text-xl sm:text-2xl">
          <img src={Logo} alt="AB Supplement Hub Logo" className="w-10 h-10" />
          <span className="hidden sm:block">AB Supplement Hub</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          {navLinks.map(({ label, to, danger }) => (
            <li key={label}>
              <Link
                to={to}
                className={`relative px-2 py-1 rounded transition-all duration-200 ${
                  isActive(to)
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : "hover:text-yellow-400"
                } ${danger ? "text-red-400 hover:text-red-300" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle Menu"
          onClick={() => setOpen(!open)}
          className="md:hidden text-yellow-400 text-2xl focus:outline-none"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? "max-h-[300px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-4 bg-zinc-900 px-6 py-4 rounded-lg shadow-lg">
          {navLinks.map(({ label, to, danger }) => (
            <li key={label}>
              <Link
                to={to}
                onClick={() => setOpen(false)}
                className={`block transition-all duration-200 ${
                  isActive(to)
                    ? "text-yellow-400 font-semibold"
                    : "hover:text-yellow-400"
                } ${danger ? "text-red-400 hover:text-red-300" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
