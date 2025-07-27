import React from "react";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const NotLoggedIn = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <FaLock className="text-5xl text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You must be logged in to view this page.
        </p>
        <Link to="/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotLoggedIn;
