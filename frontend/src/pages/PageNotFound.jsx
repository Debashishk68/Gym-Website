import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-center">
        <div className="flex justify-center text-yellow-500 mb-4 text-6xl">
          <FaExclamationTriangle />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page Not Found</p>
        <p className="text-md text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
