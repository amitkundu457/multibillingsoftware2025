"use client";
import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";
import axios from "axios";
import { format } from "date-fns";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const Productwise = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const token = getCookie("access_token");

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("Authentication token not found!");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/productReportSales",
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Search filtering
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const searched = data.filter((item) =>
      item.name?.toLowerCase().includes(lowerQuery)
    );
    setFilteredData(searched);
  }, [searchQuery, data]);

  // Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Product Wise Sales Report", 14, 10);

    autoTable(doc, {
      // "Total Amount"
      startY: 20,
      head: [["S.No", "Product Name", "Total Quantity",]],
      body: filteredData.map((item, index) => [
        index + 1,
        item.name || "N/A",
        item.total_quantity || "N/A",
        // item.total_sales || "N/A",
      ]),
    });

    doc.save("ProductWisesaleReport.pdf");
  };

  // Download Excel
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        "Product Name": item.name || "N/A",
        "Total Quantity": item.total_quantity || "N/A",
        // "Total Amount": item.total_sales || "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Wise Sales");
    XLSX.writeFile(workbook, "ProductWisesaleReport.xlsx");
  };

  // Filter by date
  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const filtered = data.filter((item) => {
      const createdAt = new Date(item.created_at).getTime();
      return createdAt >= start && createdAt <= end;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">Product Wise Purchase</p>
        <div>
          <button
            onClick={handleDownloadPDF}
            className="mr-5 text-4xl text-red-500 hover:scale-110 transition"
          >
            <FaFilePdf />
          </button>
          <button
            onClick={handleDownloadExcel}
            className="mr-5 text-4xl text-green-500 hover:scale-110 transition"
          >
            <BsFiletypeXls />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Product Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 text-lg"
        />
      </div>

      {/* Table Section */}
      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <p className="text-center text-lg font-semibold text-gray-600">Loading...</p>
        ) : (
          <table className="w-full text-left bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
              <tr>
                <th className="py-3 px-4 border-b">SI.No</th>
                <th className="py-3 px-4 border-b">Product Name</th>
                <th className="py-3 px-4 border-b">Total Quantity</th>
                {/* <th className="py-3 px-4 border-b">Total Amount</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">{item.name || "N/A"}</td>
                    <td className="py-3 px-4 border-b">{item.total_quantity || "N/A"}</td>
                    {/* <td className="py-3 px-4 border-b">{item.total_sales || "N/A"}</td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Productwise;
