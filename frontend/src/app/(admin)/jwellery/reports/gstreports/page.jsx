"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { reporturl } from "@/app/lib/axios";

const Page = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getCookie("access_token");
      if (!token) {
        // Only notify, don't return from component
        if (typeof window !== "undefined" && window.notyf) {
          window.notyf.error("Authentication token not found!");
        } else {
          console.error("Authentication token not found!");
        }
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/gstReport",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // No need to include token here since it's handled inside the effect

  const filteredData = data.filter((item) => {
    const lowerQuery = searchQuery.toLowerCase();
    const itemDate = new Date(item.invoice_date);

    const isInDateRange =
      (!startDate || new Date(startDate) <= itemDate) &&
      (!endDate || new Date(endDate) >= itemDate);

    const matchesSearch =
      item.product_name?.toLowerCase().includes(lowerQuery) ||
      item.billno?.toLowerCase().includes(lowerQuery) ||
      item.customer_name?.toLowerCase().includes(lowerQuery) ||
      item.customer_phone?.toLowerCase().includes(lowerQuery) ||
      item.tax_name?.toLowerCase().includes(lowerQuery);

    return isInDateRange && matchesSearch;
  });

  const downloadPDF = () => {
    if (filteredData.length === 0) {
      alert("No data to export.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("GST Report", 14, 15);

    const tableColumn = [
      "S.No",
      "Customer Name",
      // "Product Name",
      "Bill No.",
      // "Tax Name",
      "Quantity",
      // "Rate",
      // "GST%",
      "GST Amt",
      // "Total Amt",
      "Bill Date",
    ];

    const tableRows = filteredData.map((item, index) => [
      index + 1,
      item.customer_name,
      // item.product_name,
      item.billno,
      // item.tax_name,
      item.total_qty,
      // item.rate,
      // item.gst_percent,
      item.total_tax,
      // item.total_price,
      item.invoice_date,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
      },
    });

    doc.save("GSTReport.pdf");
  };

  const downloadExcel = () => {
    if (filteredData.length === 0) {
      alert("No data to export.");
      return;
    }

    const exportData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "Customer Name": item.customer_name,
      // "Product Name": item.product_name,
      "Bill No.": item.billno,
      // "Tax Name": item.tax_name,
      Quantity: item.total_qty,
      // Rate: item.rate,
      // "GST%": item.gst_percent,
      "GST Amt": item.total_tax,
      // "Total Amt": item.total_price,
      "Bill Date": item.invoice_date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GSTReport");
    XLSX.writeFile(workbook, "GSTReport.xlsx");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">GST wise purchase Report</p>
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
          }}
        >
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Party name/bill no./phone /product name..."
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
              <th className="py-3 px-4 border-b">Customer Name</th>
              {/* <th className="py-3 px-4 border-b">Product Name</th> */}
              <th className="py-3 px-4 border-b">Bill No</th>
              {/* <th className="py-3 px-4 border-b">Tax Name</th> */}
              <th className="py-3 px-4 border-b">Quantity</th>
              {/* <th className="py-3 px-4 border-b">Rate</th> */}
              {/* <th className="py-3 px-4 border-b">GST%</th> */}
              <th className="py-3 px-4 border-b">GST Amt</th>
              <th className="py-3 px-4 border-b">Action</th>
              <th className="py-3 px-4 border-b">Bill Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{index + 1}</td>
                <td className="py-3 px-4 border-b">{item.customer_name}</td>
                {/* <td className="py-3 px-4 border-b">{item.product_name}</td> */}
                <td className="py-3 px-4 border-b">{item.billno}</td>
                {/* <td className="py-3 px-4 border-b">{item.tax_name}</td> */}
                <td className="py-3 px-4 border-b">{item.total_qty? item.total_qty :"NA"}</td>
                {/* <td className="py-3 px-4 border-b">{item.rate}</td> */}
                {/* <td className="py-3 px-4 border-b">{item.gst_percent}</td> */}
                <td className="py-3 px-4 border-b">{item.total_tax ? item.total_tax :"NA"}</td>
                {/* <td className="py-3 px-4 border-b">{item.total_price}</td> */}
                <td className="py-3 px-4 border-b">
                  <a
                    href={`${reporturl}/jwellery/printinvoice/?id=${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    BillPdf
                  </a>
                </td>
                <td className="py-3 px-4 border-b">{item.invoice_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
