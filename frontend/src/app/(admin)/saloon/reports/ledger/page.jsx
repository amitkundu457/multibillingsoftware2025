import React from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";

const Page = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white py-4 px-6 rounded-lg shadow-md">
        <div>
          <h1 className="font-bold text-2xl text-gray-800">Ledger Report</h1>
        </div>
        <div className="flex space-x-4">
          <button
            className="text-3xl text-red-500 hover:scale-110 transition"
            title="Export as PDF"
          >
            <FaFilePdf />
          </button>
          <button
            className="text-3xl text-green-500 hover:scale-110 transition"
            title="Export as Excel"
          >
            <BsFiletypeXls />
          </button>
          <button
            className="text-3xl text-blue-400 hover:scale-110 transition"
            title="Print"
          >
            <BiSolidPrinter />
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mt-8 flex flex-wrap items-center space-y-4 md:space-y-0 md:space-x-6 bg-white p-6 rounded-lg shadow-md">
      <label htmlFor="agent" className="text-gray-600 text-lg font-medium">
          Choose Accounts:
        </label>
        <select
          id="agent"
          name="agent"
          className="w-48 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        >
          <option value="sa">select account</option>
          <option value="ac2">Account1</option>
          <option value="ac3">Account2</option>
          <option value="ac4">Account3</option>
        </select>
        <input
          type="date"
          className="w-64 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        />
        <input
          type="date"
          className="w-64 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        />
        <button className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600 transition">
          Show
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-6">
     
        <input
          type="text"
          placeholder="Search by account/voucher no./reference"
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Table Section */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700 font-semibold">
            <tr>
              {[
                "Sl. No",
                "Date",
                "Voucher No",
                "Type",
                "Ref. No.",
                "Account",
                "Debit",
                "Credit",
                "Running Balance",
              ].map((heading, index) => (
                <th
                  key={index}
                  className="py-3 px-4 border-b text-sm md:text-base"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-100 transition ${
                  rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                {[
                  rowIndex + 1,
                  "2025-01-14",
                  "VCH12345",
                  "Sale",
                  "REF67890",
                  "John Doe",
                  "$1,000",
                  "$500",
                  "$500",
                ].map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-3 px-4 border-b text-sm md:text-base text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
