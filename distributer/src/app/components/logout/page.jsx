 'use client';
import React from "react";
import { useCookies } from "react-cookie";

const logout = () => {
  const cookies = document.cookie.split("; ").find(row => row.startsWith("access_token="));
  const token = cookies ? cookies.split("=")[1] : null;

  if (token) {
    console.log("Logging out. Token found:", token);
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Token removed. Redirecting to login...");
    window.location.href = "/login"; // Redirect to login page
  } else {
    console.log("No token found. Already logged out.");
    window.location.href = "/login"; // Redirect to login page
  }
};

const LogoutModel = ({ onClose }) => {
  const onLogOut = () => {
    logout(); // Call the logout function directly
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-80">
        <p className="text-gray-800 text-lg font-medium mb-6 text-center">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onLogOut}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModel;
