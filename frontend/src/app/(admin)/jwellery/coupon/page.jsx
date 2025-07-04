import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { BiSolidCoupon } from "react-icons/bi";
const page = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="relative flex items-center justify-between bg-green-600 p-4 shadow-md">
        {/* Left Arrow Button */}
        <button className="text-white text-2xl hover:scale-105 transition-transform absolute left-4">
          <FaArrowLeft /> {/* Left Arrow Icon from React Icons */}
        </button>

        {/* Coupon Title */}
        <p className="text-white text-lg font-bold mx-auto">Coupon</p>
      </nav>

      {/* "Issue Coupon" Button Below Navbar */}
      <div className="p-4">
        <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none">
          Issue Coupon
        </button>
      </div>
      {/* coupon summary header */}
      <div className="p-6">
      {/* Main Container with Horizontal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Coupon Issued Card */}
        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
          <div className="flex justify-center mb-3">
          <BiSolidCoupon />          </div>
          <div className="font-semibold text-gray-700">Coupon Issued</div>
          <div className="text-xl text-gray-800">0</div>
        </div>

        {/* Coupon Used Card */}
        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
          <div className="flex justify-center mb-3">
          <BiSolidCoupon />          </div>
          <div className="font-semibold text-gray-700">Coupon Used</div>
          <div className="text-xl text-gray-800">0</div>
        </div>

        {/* Coupon Value Card */}
        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
          <div className="flex justify-center mb-3">
          <BiSolidCoupon />          </div>
          <div className="font-semibold text-gray-700">Coupon Value</div>
          <div className="text-xl text-gray-800">0</div>
        </div>

        {/* Sale Value Card */}
        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
          <div className="flex justify-center mb-3">
          <BiSolidCoupon />          </div>
          <div className="font-semibold text-gray-700">Sale Value</div>
          <div className="text-xl text-gray-800">0</div>
        </div>
      </div>
    </div>
  
    </div>
  );
};

export default page;
