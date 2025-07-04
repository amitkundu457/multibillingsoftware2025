





"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { reporturl } from "@/app/lib/axios"; // Adjust the import path as needed

const BillWise = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
      return null;
    };

    const accessToken = getCookie("access_token");
    setToken(accessToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/package-report",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched data:", response);
        setData(response.data.assigned_packages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);
  useEffect(() => {
    console.log("All bill_inv values:", data.map((item) => item.bill_inv));
  }, [data]);
  

  const filteredData = data.filter((item) => {
    const lowerQuery = searchQuery.toLowerCase();
  
    const createdAt = item.created_at?.slice(0, 10); // format: YYYY-MM-DD
  
    const isInDateRange =
      (!startDate || startDate <= createdAt) &&
      (!endDate || endDate >= createdAt);
  
    const matchesSearch =
      item.package_no?.toLowerCase().includes(lowerQuery) ||
      item.users?.name?.toLowerCase().includes(lowerQuery) ||
      item.customer?.phone?.toLowerCase().includes(lowerQuery);
  
    
    return isInDateRange && matchesSearch;
  });
  

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Package No.",
    
      "Customer Name",
      "Customer Ph",
      
      "Assign Date",
    ];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const row = [
        index + 1,
        item.package_no,
    
        item.users?.name,
        item.customer?.phone,
        
        item.created_at?.slice(0, 10),
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("package.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        "package No.": item.package_no,
        // "Product Name": item.product_name,
        "Customer Name": item.users?.name,
        "Customer Ph":   item.customer?.phone,
        // "Bill Amt.": item.total_price,
        // "Quantity": item.quantity,
        // "G Weight": item.gross_weight,
        // "N Weight": item.net_weight,
        // Rate: item.rate,
        "Assign Date": item.created_at?.slice(0, 10),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BillWiseReport");
    XLSX.writeFile(workbook, "pacakge.xlsx");
  };

  if (!token) {
    return (
      <div className="p-6 text-center text-red-500 font-bold">
        Authentication token not found!
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">Package Reports</p>
        <div>
          <button
            onClick={downloadPDF}
            className="mr-5 text-4xl text-red-500 hover:scale-110 transition"
          >
            <FaFilePdf />
          </button>
          <button
            onClick={downloadExcel}
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
          className="w-56 h-12 border border-gray-300 rounded-lg text-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="w-56 h-12 border border-gray-300 rounded-lg text-lg"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        
        <button
          className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600"
          onClick={() => {}}
        >
          Search
        </button>
        <button
          className="bg-red-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-red-600"
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setSearchQuery("");
            setFilterType("All");
          }}
        >
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Customer name / Bill no. / Phone / Product name..."
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left bg-white rounded-lg shadow-lg">
          <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
            <tr>
              <th className="py-3 px-4 border-b">S.No</th>
              <th className="py-3 px-4 border-b">package No.</th>
              <th className="py-3 px-4 border-b">Customer Name</th>
              <th className="py-3 px-4 border-b">Customer Ph</th>
              {/* <th className="py-3 px-4 border-b">Bill Amt.</th>
              <th className="py-3 px-4 border-b">Qty</th> */}
              <th className="py-3 px-4 border-b">Assign Date</th>
              
              <th className="py-3 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
  {filteredData.map((item, index) => (
    <tr key={index} className="hover:bg-gray-50">
      <td className="py-3 px-4 border-b">{index + 1}</td>
      <td className="py-3 px-4 border-b">{item.package_no}</td>
      <td className="py-3 px-4 border-b">{item.users?.name}</td>
      <td className="py-3 px-4 border-b">{item.customer?.phone}</td>
      <td className="py-3 px-4 border-b">{item.created_at?.slice(0, 10)}</td>
      <td className="py-3 px-4 border-b">
        <a
          href={`${reporturl}/saloon/printpackage/?id=${item.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Print
        </a>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default BillWise;
