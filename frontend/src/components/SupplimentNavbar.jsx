import { useLocation, Link } from "react-router-dom";
import { FaArrowLeft, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import Logo from "../assets/supplimentLogo.png";

const SupplementsNavbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSupplementsPage = ["/stock", "/add-supplement", "/sell-supplement", "/sell-invoice"].some(
    (prefix) => location.pathname.startsWith(prefix)
  );

  if (!isSupplementsPage) return null;

  const supplementLinks = [
    { label: "All Supplements", to: "/stock" },
    { label: "Add New", to: "/add-supplement" },
    { label: "Sell Supplement", to: "/sell-supplement" },
    { label: "Supplements Invoice", to: "/sell-invoice" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-black/80 backdrop-blur-md text-white px-6 sm:px-10 py-3 shadow sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        
        {/* Logo + Back Button */}
        <div className="flex items-center gap-4">
              <Link
            to="/dashboard"
            className="text-yellow-400 mr-5 hover:text-yellow-300 flex items-center gap-1 text-sm sm:text-base"
          >
            <FaArrowLeft />
            {/* <span>Back to Dashboard</span> */}
          </Link>
          <Link to="/" className="flex items-center gap-2 text-yellow-400 font-bold text-xl sm:text-2xl">
            <img src={Logo} alt="Supplement Logo" className="w-10 h-10" />
            <span className="hidden sm:block">AB Suppliment Hub</span>
          </Link>
      
        </div>

        {/* Desktop Links */}
        <ul className="hidden sm:flex gap-6 text-sm sm:text-base font-medium">
          {supplementLinks.map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className={`px-2 py-1 transition-all duration-200 rounded ${
                  isActive(to)
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : "hover:text-yellow-400"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger Icon */}
        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-yellow-400 text-xl focus:outline-none">
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mt-3">
          <ul className="flex flex-col gap-3 text-sm font-medium bg-zinc-900 px-4 py-4 rounded-lg shadow">
            {supplementLinks.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  onClick={closeMenu}
                  className={`block px-2 py-2 rounded transition-all duration-200 ${
                    isActive(to)
                      ? "text-yellow-400 font-semibold"
                      : "hover:text-yellow-400"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default SupplementsNavbar;
