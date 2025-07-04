import React from "react";
import {
  FaHome,
  FaTimes,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaPrint,
} from "react-icons/fa";

const MyComponent = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center p-4 bg-green-800 text-white">
        {/* Home Icon */}
        <div className="flex items-center">
          <FaHome size={24} />
        </div>

        {/* Token Paragraph in the center */}
        <div className="flex-grow text-center">
          <p className="font-semibold text-lg">Token</p>
        </div>

        {/* Cross Button on the right */}
        <div>
          <button className="text-2xl">
            <FaTimes />
          </button>
        </div>
      </nav>

      {/* Header Section */}

      {/* Header: Search Bar with Icons */}
      <div className="flex items-center p-4 bg-gray-100 shadow-md">
        {/* Search Input (smaller width) */}
        <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1 w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-2 py-1 focus:outline-none"
          />
        </div>

        {/* Up and Down Arrows */}
        <div className="flex space-x-2 ml-4">
          <button className="text-xl text-gray-500">
            <FaArrowUp />
          </button>
          <button className="text-xl text-gray-500">
            <FaArrowDown />
          </button>
        </div>

        {/* Download and Print Icons */}
        <div className="flex space-x-4 ml-4">
          <button className="text-xl text-gray-500">
            <FaDownload />
          </button>
          <button className="text-xl text-gray-500">
            <FaPrint />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-full">
        {/* Left Section: Input Fields */}
        <div className="flex-1 p-4 space-y-4">
          {/* Row 1: Date, Time, Check-in No, Check-in Time */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Time</label>
              <input
                type="time"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Check-in No</label>
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Check-in Time</label>
              <input
                type="time"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Phone, Guest Name, Child Name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Guest Name</label>
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Child Name</label>
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Select Field and 3 Text Inputs */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col col-span-1">
              <label className="text-sm font-medium">Select Option</label>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none">
                <option value="">Option 1</option>
                <option value="">Option 2</option>
                <option value="">Option 3</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Text Input 1</label>
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Text Input 2</label>
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Text Input 3</label>
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Section: Payment Fields */}
        <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg">
          {/* Bill Amount */}
          <div className="mb-6 bg-orange-100 p-4 rounded-lg shadow-md">
            <p className="text-xl font-semibold text-orange-600">
              Bill Amount <span className="ml-5 text-lg text-gray-600">0</span>
            </p>
            <input
              type="number"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <p className="font-semibold text-lg mb-2">Payment Methods</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium">Cash</label>
                <input
                  type="number"
                  className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium">Card</label>
                <input
                  type="number"
                  className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium">UPI</label>
                <input
                  type="number"
                  className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium">Wallet</label>
                <input
                  type="number"
                  className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          
          {/* Coupon Section */}
          <div className="mb-6 flex ">
            <p className="font-semibold text-lg mb-2">Coupon</p>
            <input
              type="text"
              placeholder="Coupon No."
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Coupon Amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Checkout Button */}
          <div className="flex justify-center items-center mt-6">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none transition-all duration-300">
              Checkout & Print
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyComponent;
