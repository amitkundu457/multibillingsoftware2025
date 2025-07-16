"use client";
import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";
import axios from "axios";
import { format } from "date-fns";

const ProductWise = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState("");

  // Get cookie on mount
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
      return null;
    };
    setToken(getCookie("access_token"));
  }, []);

  // Fetch data
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.equi.co.in/api/Saloon-service",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched data saloon service:", response?.data);
        setData(response?.data);
        setFilteredData(response?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, [token]);

  const handleDownloadPDF = async (type) => {
    try {
      const url = `https://api.equi.co.in/api/product-services-pdf?format=${type}&start_date=${startDate}&end_date=${endDate}`;
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
      a.download = `productwisePurchase.${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(`Error downloading ${type.toUpperCase()}:`, error);
      alert(`Error downloading ${type.toUpperCase()}. Please try again.`);
    }
  };

  // Filter by date
  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const filtered = data.filter((item) => {
      const createdAt = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return createdAt >= start && createdAt <= end;
    });

    setFilteredData(filtered);
  };

  // Search filter
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();

    const searched = data.filter((item) => {
      const productName = item.name?.toLowerCase() || "";
      const brand = item.brand?.toLowerCase() || "";
      const partyName = item.party_name?.toLowerCase() || "";
      const billNo = item.bill_no?.toString() || "";
      const phone = item.phone?.toString() || "";

      return (
        productName.includes(lowerQuery) ||
        brand.includes(lowerQuery) ||
        partyName.includes(lowerQuery) ||
        billNo.includes(lowerQuery) ||
        phone.includes(lowerQuery)
      );
    });

    setFilteredData(searched);
  }, [searchQuery, data]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">Service Report</p>
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

      {/* Filters Section */}
      <div className="mt-8 flex items-center space-x-6 shadow-lg bg-white p-4 rounded-lg">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-56 h-12 border border-gray-300 rounded-lg shadow-sm text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-56 h-12 border border-gray-300 rounded-lg shadow-sm text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition"
        />
        <button
          onClick={handleFilter}
          className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600 transition"
        >
          Search
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by item name, party name, bill no, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Table Section */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
            <tr>
              <th className="py-3 px-4 border-b">S.No</th>
              <th className="py-3 px-4 border-b">Serivce Name</th>
              {/* <th className="py-3 px-4 border-b">Brand</th> */}
              <th className="py-3 px-4 border-b">Amount</th>
              <th className="py-3 px-4 border-b">Tax</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border-b">{index + 1}</td>
                  <td className="py-3 px-4 border-b">{item.name || "N/A"}</td>
                  {/* <td className="py-3 px-4 border-b">{item.brand || "0"}</td> */}
                  <td className="py-3 px-4 border-b">{item.rate || "0.0"}</td>
                  <td className="py-3 px-4 border-b">{item.tax_rate || "0.0"}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-3 px-4 border-b text-center" colSpan="6">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductWise;
