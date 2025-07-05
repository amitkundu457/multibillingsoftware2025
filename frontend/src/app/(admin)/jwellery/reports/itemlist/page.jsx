"use client"
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";
import axios from "axios";

const Page = () => {
  const [items, setItems] = useState([]);
  const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
 
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(" https://api.equi.co.in/api/item-list-report");
        console.log("Fetched Data:", response.data);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);
  const handleDownloadPDF = async (type) => {
    try {
      const url = ` https://api.equi.co.in/api/item-list-forreport?format=${type}&start_date=${startDate}&end_date=${endDate}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            type === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download ${type.toUpperCase()}`);
      }

      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = `ItemListReport.${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(`Error downloading ${type.toUpperCase()}:`, error);
      alert(`Error downloading ${type.toUpperCase()}. Please try again.`);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white py-4 px-6 rounded-lg shadow-md">
        <div>
          <h1 className="font-bold text-2xl text-gray-800">Item List</h1>
        </div>
         <div>
                        <button
                          onClick={() => handleDownloadPDF("pdf")}
                          className="mr-5 text-4xl text-red-500 hover:scale-110 transition"
                        >
                          <FaFilePdf />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF("xlsx")}
                          className="mr-5 text-4xl text-green-500 hover:scale-110 transition"
                        >
                          <BsFiletypeXls />
                        </button>
                        <button className="mr-2 text-4xl text-blue-400 hover:scale-110 transition">
                          <BiSolidPrinter />
                        </button>
                      </div>
      </div>

      {/* Search Section */}
      <div className="mt-8 flex flex-wrap items-center space-y-4 md:space-y-0 md:space-x-6 bg-white p-6 rounded-lg shadow-md">
        <label htmlFor="agent" className="text-gray-600 text-lg font-medium">
          Choose Agent:
        </label>
        <select
          id="agent"
          name="agent"
          className="w-48 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        >
          <option value="salman">Select agent</option>
          <option value="shahrukh">Shahrukh</option>
          <option value="akshay">Akshay</option>
          <option value="salman">Salman</option>
        </select>
        <label htmlFor="group" className="text-gray-600 text-lg font-medium">
          Select Group:
        </label>
        <select
          id="group"
          name="group"
          className="w-48 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        >
          <option value="salman">Select group</option>
          <option value="shahrukh">Shahrukh</option>
          <option value="akshay">Akshay</option>
          <option value="salman">Salman</option>
        </select>
        <button className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600 transition">
          Search
        </button>
      </div>

      {/* Table Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Code</th>
              <th className="border px-4 py-2 text-left">Rate</th>
              {/* <th className="border px-4 py-2 text-left">Image</th> */}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.code}</td>
                <td className="border px-4 py-2">{item.rate}</td>
                {/* <td className="border px-4 py-2">
                  <img
                    src={` https://api.equi.co.in/${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
