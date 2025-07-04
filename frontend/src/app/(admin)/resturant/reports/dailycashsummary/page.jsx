import React from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";
import { reporturl } from "@/app/lib/axios";

const page = () => {
  return (
    <div>
      <div className="flex justify-between mt-8 bg-gray-200 py-8">
        <div className="ml-8">
          <p className="font-bold text-2xl ">Daily cash summary</p>
        </div>
        <div className="mr-12 ">
          <button className="mr-5 text-4xl text-red-500">
            <FaFilePdf />
          </button>
          <button className="mr-5 text-4xl text-green-500">
            <BsFiletypeXls />
          </button>
          <button className="mr-2 text-4xl text-blue-400">
            <BiSolidPrinter />
          </button>
        </div>
      </div>

      <div className="mt-8 justify-start ml-6 shadow-lg">
        <input
          type="date"
          className="mr-6 w-56 h-14 border border-gray-300 rounded-lg shadow-lg text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        />
        <input
          type="date"
          className="mr-6 w-56 h-14 border border-gray-300 rounded-lg shadow-lg text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        />
        <button className="bg-green-500 text-white rounded-2xl px-4 py-2">
          Search
        </button>
      </div>

     
      <div className="p-6 bg-white rounded-lg shadow-md">
  <ul className="space-y-4">
    {/* First Row with Orange Background */}
    <li className="flex justify-between font-semibold text-lg border-b pb-2 bg-orange-400">
      <p>Particular</p>
      <p>Amount</p>
    </li>

    {/* Bill Amount Row */}
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Bill Amount</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>

    {/* Discount Row */}
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Discount</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>

    {/* Bank Row */}
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Bank</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>

    {/* UPI Row */}
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">UPI</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>

    {/* Coupon Row */}
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Coupon</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>

    {/* Advance Adjustment Row */}
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Advance Adjustment</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>

    {/* Plain Green Row */}
    <li className="flex justify-between items-center py-2 bg-green-500 text-white">
      <p>Placeholder</p>
      <p>Something Here</p>
    </li>

    {/* Dummy Rows */}
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Dummy Row 1</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Dummy Row 2</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Dummy Row 3</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Dummy Row 4</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>
    <li className="flex justify-between items-center py-2 border-b">
      <p className="text-gray-700">Dummy Row 5</p>
      <p className="text-gray-600">&#8377; 0</p>
    </li>
  </ul>
</div>


    </div>
  );
};

export default page;
