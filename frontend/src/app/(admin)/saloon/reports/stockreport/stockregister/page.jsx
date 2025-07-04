import React from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";

const Stockregister = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <div>
          <p className="font-bold text-2xl text-gray-800">Register Stock</p>
        </div>
        <div>
          <button className="mr-5 text-4xl text-red-500 hover:scale-110 transition">
            <FaFilePdf />
          </button>
          <button className="mr-5 text-4xl text-green-500 hover:scale-110 transition">
            <BsFiletypeXls />
          </button>
          <button className="mr-2 text-4xl text-blue-400 hover:scale-110 transition">
            <BiSolidPrinter />
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mt-8 flex items-center space-x-6 shadow-lg bg-white p-4 rounded-lg">
        <input
          type="date"
          className="w-56 h-12 border border-gray-300 rounded-lg shadow-sm text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        />
        <select id="company" name="company" >
          <option value="company">select company</option>
          <option value="company">company 2</option>
          <option value="company">company 3</option>
          <option value="company">company 4</option>
        </select>

        <select id="group" name="group" >
          <option value="Group1">Select Group</option>
          <option value="Group2">Group 2</option>
          <option value="Group3">Group 3</option>
          <option value="Group4">Group 4</option>
        </select>

        <select id="type" name="type"  >
          <option value="type">Select Type</option>
          <option value="nwt">NWT</option>
          <option value="gwt">GWT</option>
          <option value="qwt">Qwt</option>
        </select>

        <button className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600 transition">
          Search
        </button>
        <input
          type="text"
          placeholder="Search for item name"
          className="w-56 h-12 ml-16 border border-gray-300 rounded-lg shadow-sm text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        />
      </div>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by party name/bill no./phone"
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Table Section */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="   bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
            <tr>
              <th className="py-3 px-4 border-b">S.No</th>
              <th className="py-3 px-4 border-b">Item name</th>
              <th className="py-3 px-4 border-b">Opening</th>
              <th className="py-3 px-4 border-b">Purchase</th>
              <th className="py-3 px-4 border-b">Sale</th>
              <th className="py-3 px-4 border-b">Sale Return</th>
              <th className="py-3 px-4 border-b">Purchase Return</th>
              <th className="py-3 px-4 border-b">Stock Plus</th>
              <th className="py-3 px-4 border-b">Stock Minus</th>
              <th className="py-3 px-4 border-b">QTY</th>
              <th className="py-3 px-4 border-b">Rate</th>
              <th className="py-3 px-4 border-b">MRP</th>
              <th className="py-3 px-4 border-b">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 transition">
              <td className="py-3 px-4 border-b"></td>
              <td className="py-3 px-4 border-b"></td>
              <td className="py-3 px-4 border-b"></td>
              <td className="py-3 px-4 border-b"></td>
              <td className="py-3 px-4 border-b"></td>
              <td className="py-3 px-4 border-b"></td>
              <td className="py-3 px-4 border-b"></td>
              <td className="py-3 px-4 border-b"></td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stockregister;
