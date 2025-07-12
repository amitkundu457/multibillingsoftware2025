"use client";
import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import axios from "axios";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const Categorywise = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  // Get token from cookies
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
      return null;
    };

    const userToken = getCookie("access_token");
    if (!userToken) {
      alert("Authentication token not found!");
    } else {
      setToken(userToken);
    }
  }, []);

  // Fetch data when token is available
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categoryrate",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  // Filter by date
  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const filtered = data.filter((item) => {
      const createdAt = new Date(item.created_at).getTime();
      return createdAt >= start && createdAt <= end;
    });

    setFilteredData(filtered);
    setLoading(false);
  };

  // Reset filters
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(data);
  };

  // Search filter
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const searched = data.filter((item) => {
      const categoryMatch = item.category?.toLowerCase().includes(lowerQuery);
      const productMatch = item.name?.toLowerCase().includes(lowerQuery);
      return categoryMatch || productMatch;
    });
    setFilteredData(searched);
  }, [searchQuery, data]);

  // PDF Download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Product Wise Purchase Report", 14, 10);

    autoTable(doc, {
      // "Total Amount",
      startY: 20,
      head: [["S.No", "Category", "Product Name", "Quantity",  "Date"]],
      body: filteredData.map((item, index) => [
        index + 1,
        item.category || "N/A",
        item.name || "N/A",
        item.qty || "N/A",
        // item.total_price || "N/A",
        format(new Date(item.created_at), "dd/MM/yyyy"),
      ]),
    });

    doc.save("CategoryWisePurchase.pdf");
  };

  // Excel Download
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        Category: item.category || "N/A",
        "Product Name": item.name || "N/A",
        Quantity: item.qty || "N/A",
        // "Total Amount": item.total_price || "N/A",
        Date: format(new Date(item.created_at), "dd/MM/yyyy"),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Wise Purchase");
    XLSX.writeFile(workbook, "ProductWisePurchase.xlsx");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">Category Wise Purchase</p>
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

      {/* Filters */}
      <div className="mt-8 flex items-center space-x-6 shadow-lg bg-white p-4 rounded-lg">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-56 h-12 border border-gray-300 rounded-lg shadow-sm text-gray-700 text-lg"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-56 h-12 border border-gray-300 rounded-lg shadow-sm text-gray-700 text-lg"
        />
        <button
          onClick={handleFilter}
          className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600 transition"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-red-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Product Name or Category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 text-lg"
        />
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <p className="text-center text-lg font-semibold text-gray-600">Loading...</p>
        ) : (
          <table className="w-full text-left bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
              <tr>
                <th className="py-3 px-4 border-b">SI.No</th>
                <th className="py-3 px-4 border-b">Category</th>
                <th className="py-3 px-4 border-b">Product Name</th>
                <th className="py-3 px-4 border-b">Total Quantity</th>
                {/* <th className="py-3 px-4 border-b">Total Amount</th> */}
                <th className="py-3 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">{item?.category || "N/A"}</td>
                    <td className="py-3 px-4 border-b">{item?.name || "N/A"}</td>
                    <td className="py-3 px-4 border-b">{item?.qty || "N/A"}</td>
                    {/* <td className="py-3 px-4 border-b">{item?.total_price || "N/A"}</td> */}
                    <td className="py-3 px-4 border-b">
                      {format(new Date(item.created_at), "dd/MM/yyyy")}
                    </td>
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
        )}
      </div>
    </div>
  );
};

export default Categorywise;
