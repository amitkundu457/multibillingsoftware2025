"use client";
import React, { useState } from "react";

import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import {
  FaHome,
  FaTimes,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaPrint,
} from "react-icons/fa";

const Page = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <nav className="flex items-center p-2 bg-green-600 text-white">
        {/* Home Icon */}
        <div className="flex items-center">
          <FaHome size={24} />
        </div>

        {/* Token Paragraph in the center */}
        <div className="flex-grow text-center">
          <p className="font-semibold text-lg">wallet</p>
        </div>

        {/* Cross Button on the right */}
        <div>
          <button className="text-2xl">
            <FaTimes />
          </button>
        </div>
      </nav>

      {/* header */}

      <div className="flex items-center justify-between bg-white p-4 shadow-md">
        {/* Left Side - Date Inputs */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">From:</label>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <label className="text-sm font-medium">To:</label>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <button className="bg-green-900 text-white w-full rounded-2xl px-4 py-2">
            Show
          </button>
        </div>

        {/* Right Side - Add Button */}
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-orange-600 transition"
        >
          +
        </button>
      </div>

      {/* table */}
      <div className="mt-4">
  <table className="w-full border-collapse text-white">
    <thead className="bg-green-500">
      <tr className="border-b border-white">
        <th className="p-3">Date</th>
        <th className="p-3">Invoice</th>
        <th className="p-3">Customer Details</th>
        <th className="p-3">Wallet</th>
        <th className="p-3">Sales By</th>
        <th className="p-3">Payment Details</th>
        <th className="p-3">Wallet Details</th>
        <th className="p-3">Action</th>
      </tr>
    </thead>
    <tbody className="bg-green-400" >
      <tr className="border-b">
        <td className="px-4 py-2">2025-01-25</td>
        <td className="px-4 py-2">INV12345</td>
        <td className="px-4 py-2">John Doe, johndoe@example.com</td>
        <td className="px-4 py-2">$500</td>
        <td className="px-4 py-2">Alice</td>
        <td className="px-4 py-2">
          <ul>
            <li>Cash: $200</li>
            <li>Card: $150</li>
            <li>UPI: $150</li>
          </ul>
        </td>
        <td className="px-4 py-2">Bank Wallet</td>
        <td className="px-4 py-2">
          <button className="text-blue-500">View</button>
        </td>
      </tr>
      <tr className="border-b">
        <td className="px-4 py-2">2025-01-20</td>
        <td className="px-4 py-2">INV12346</td>
        <td className="px-4 py-2">Jane Smith, janesmith@example.com</td>
        <td className="px-4 py-2">$300</td>
        <td className="px-4 py-2">Bob</td>
        <td className="px-4 py-2">
          <ul>
            <li>Cash: $100</li>
            <li>Card: $100</li>
            <li>UPI: $100</li>
          </ul>
        </td>
        <td className="px-4 py-2">Digital Wallet</td>
        <td className="px-4 py-2">
          <button className="text-blue-500">View</button>
        </td>
      </tr>
      <tr className="border-b">
        <td className="px-4 py-2">2025-01-30</td>
        <td className="px-4 py-2">INV12347</td>
        <td className="px-4 py-2">Samuel Green, samuelgreen@example.com</td>
        <td className="px-4 py-2">$200</td>
        <td className="px-4 py-2">Charlie</td>
        <td className="px-4 py-2">
          <ul>
            <li>Cash: $50</li>
            <li>Card: $100</li>
            <li>UPI: $50</li>
          </ul>
        </td>
        <td className="px-4 py-2">Paypal Wallet</td>
        <td className="px-4 py-2">
          <button className="text-blue-500">View</button>
        </td>
      </tr>
    </tbody>
  </table>

  {/* Modal */}
  <Modal open={open} onClose={() => setOpen(false)} center>
    <div className="p-6 w-[600px] flex gap-6">
      {/* Left Side - Additional Input Fields */}
      <div className="w-1/2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              className="w-full p-1.5 border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kot No.</label>
            <input
              type="text"
              className="w-full p-1.5 border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Search Item</label>
            <input
              type="text"
              className="w-full p-1.5 border rounded-md text-sm"
            />
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Select Option</label>
              <select className="w-full p-2 border rounded-md text-sm">
                <option value="">Choose an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Name, Phone & Payment Details */}
      <div className="w-1/2">
        {/* Name & Phone Fields */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className="w-full p-1.5 border rounded-md text-sm"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            className="w-full p-1.5 border rounded-md text-sm"
          />
        </div>

        {/* Payment Details */}
        <p className="font-semibold bg-green-500 text-white py-4 rounded-2xl text-center text-lg mb-2">
          Payment Details
        </p>
        <div className="mb-3">
          <label className="block text-sm font-medium">Cash</label>
          <input
            type="number"
            className="w-full p-1.5 border rounded-md text-sm"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Card</label>
          <input
            type="number"
            className="w-full p-1.5 border rounded-md text-sm"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">UPI</label>
          <input
            type="number"
            className="w-full p-1.5 border rounded-md text-sm"
          />
        </div>

        {/* Save & Checkout Button */}
        <button className="w-full bg-orange-500 text-white py-2 rounded-md">
          Save & Checkout
        </button>
      </div>
    </div>
  </Modal>
</div>

    </div>
  );
};

export default Page;
