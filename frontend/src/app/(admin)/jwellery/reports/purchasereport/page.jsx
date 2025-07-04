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

const ProductWise = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
 //token
  //token
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const token = getCookie("access_token");
  // Function to Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(" Purchase Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "S.No",
          "Voucher No",
          "Payment Mode",
          "Product Name",
          "Quantity",
          "Net Amount",
          "Date",
        ],
      ],
      body: filteredData.map((item, index) => [
        index + 1,
        item.voucher_no || "N/A",
        item.payment_mode || "N/A",
        item.purchase_items.map((p) => p.product_name).join(", "),
        item.purchase_items.map((p) => p.pcs).join(", "),
        item.purchase_items.map((p) => p.net_amount).join(", "),
        format(new Date(item.created_at), "dd/MM/yyyy"),
      ]),
    });

    doc.save("PurchaseReport.pdf");
  };

  // Function to Download Excel
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        "Voucher No": item.voucher_no || "N/A",
        "Payment Mode": item.payment_mode || "N/A",
        "Product Name": item.purchase_items
          .map((p) => p.product_name)
          .join(", "),
        Quantity: item.purchase_items.map((p) => p.pcs).join(", "),
        "Net Amount": item.purchase_items.map((p) => p.net_amount).join(", "),
        Date: format(new Date(item.created_at), "dd/MM/yyyy"),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, " Purchase Report");
    XLSX.writeFile(workbook, "PurchaseReport.xlsx");
  };
  useEffect(() => {
    console.log("Filtered Data Updated:", filteredData);
  }, [filteredData]);
  
  
  const handlePrint = () => {
    console.log("Printing Data:", filteredData); // Debugging
  
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to print!");
      return;
    }
  
    // Short delay to ensure UI updates before printing
    setTimeout(() => {
      window.print();
    }, 500);
  };
  

  // Fetch Data with Loading
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show Loading
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/purchase",
          {
            headers: { Authorization: `Bearer ${token}` },
          });
        setData(response?.data?.purchase);
        setFilteredData(response?.data?.purchase);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again later.");
      } finally {
        setLoading(false); // Hide Loading
      }
    };

    fetchData();
  }, []);

  // Filter by Date with Loading
  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const filtered = data.filter((item) => {
      setLoading(true); // Show loading during filtering
      const createdAt = new Date(item.created_at).getTime(); // Correct date field
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      return createdAt >= start && createdAt <= end;
    });

    setFilteredData(filtered);
    setLoading(false);
  };

  // Reset Date Filters
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(data); // Show all data again
  };

 


  // Search Filtering
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const searched = data.filter(
      (item) =>
        item.payment_mode?.toLowerCase().includes(lowerQuery) ||
        item.purchase_items.some((purchaseItem) =>
          purchaseItem.product_name?.toLowerCase().includes(lowerQuery)
        )
    );
    setFilteredData(searched);
  }, [searchQuery, data]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">
          Purchase Report
        </p>
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
          {/* <button
            onClick={handlePrint}
            className="mr-2 text-4xl text-blue-400 hover:scale-110 transition"
          >
            <BiSolidPrinter />
          </button> */}
        </div>
      </div>

      {/* Filters Section */}
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

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Payment Mode or Product Name......"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 text-lg"
        />
      </div>

      {/* Table Section */}
      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <p className="text-center text-lg font-semibold text-gray-600">
            Loading...
          </p>
        ) : (
          <table className="w-full text-left bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
              <tr>
                <th className="py-3 px-4 border-b">S.No</th>
                <th className="py-3 px-4 border-b">Voucher No</th>
                <th className="py-3 px-4 border-b">Payment Mode</th>
                <th className="py-3 px-4 border-b">Product Name</th>
                <th className="py-3 px-4 border-b">Quantity</th>
                <th className="py-3 px-4 border-b">Net Amount</th>
                <th className="py-3 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">
                      {item?.voucher_no || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {item?.payment_mode || "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      {item.purchase_items.map((item, index) => (
                        <span key={index}>{item.product_name}</span>
                      ))}
                    </td>
                    <td className="border px-4 py-2">
                      {item.purchase_items.map((item, index) => (
                        <span key={index}>{item.pcs}</span>
                      ))}
                    </td>
                    <td className="border px-4 py-2">
                      {item.purchase_items.map((item, index) => (
                        <span key={index}>{item.net_amount}</span>
                      ))}
                    </td>
                    <td className="border px-4 py-2">
                      {item?.purchase_items?.map((item, index) => (
                        <span key={index}>
                          {format(new Date(item.created_at), "dd/MM/yyyy")}
                        </span>
                      ))}
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

export default ProductWise;
