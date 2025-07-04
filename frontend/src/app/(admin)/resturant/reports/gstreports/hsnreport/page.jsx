import React from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";

const Page = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <div>
          <p className="font-bold text-2xl text-gray-800">HSN report</p>
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
        <input
          type="date"
          className="w-56 h-12 border border-gray-300 rounded-lg shadow-sm text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        />
        <button className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600 transition">
          Search
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by voucher Date/ party name/bill no./phone"
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Table Section */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4 border-b">S.No</th>
              <th className="py-3 px-4 border-b">HSN</th>
              <th className="py-3 px-4 border-b">GST</th>
              <th className="py-3 px-4 border-b">Taxable</th>
              <th className="py-3 px-4 border-b">CGST Amount</th>
              <th className="py-3 px-4 border-b">SGST Amount</th>
              <th className="py-3 px-4 border-b">IGST Amount</th>
              <th className="py-3 px-4 border-b">Total GST</th>
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

export default Page;
