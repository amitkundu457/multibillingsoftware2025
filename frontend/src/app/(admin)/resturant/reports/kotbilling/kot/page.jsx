

"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { reporturl } from "@/app/lib/axios";

const BillWise = () => {
  const [data, setData] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
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
          "https://api.equi.co.in/api/kot-billing",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("bill kot billing",response);
        setData(response.data || []);
        setFilteredResult(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const applyFilters = () => {
    const lowerQuery = searchQuery.toLowerCase();

    const result = data
      .filter((item) => item.order_slip !== 1)
      .filter((item) => {
        const itemDate = new Date(item.order_date);
        const isInDateRange =
          (!startDate || new Date(startDate) <= itemDate) &&
          (!endDate || new Date(endDate) >= itemDate);

        const matchesSearch =
          item?.user?.name?.toLowerCase().includes(lowerQuery) ||
          item?.customer?.phone?.toLowerCase().includes(lowerQuery) ||
          item?.order_id?.toString().includes(lowerQuery);

        const matchesFilter =
          filterType === "All"
            ? true
            : filterType === "Invoice"
            ? Number(item.bill_inv) !== 1
            : Number(item.bill_inv) === 1;

        return isInDateRange && matchesSearch && matchesFilter;
      });

    setFilteredResult(result);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, startDate, endDate, filterType, data]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Order No.",
      "Customer Name",
      "Customer Phone",
      "Billing Date",
    ];
    const tableRows = [];

    filteredResult.forEach((item, index) => {
      const row = [
        index + 1,
        item.order_id,
        item?.user?.name || "",
        item?.customer?.phone || "",
        new Date(item.order_date).toLocaleDateString("en-GB"),
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("BillWiseReport.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredResult.map((item, index) => ({
        "S.No": index + 1,
        "Order No.": item.order_id,
        "Customer Name": item?.user?.name || "",
        "Customer Phone": item?.customer?.phone || "",
        "Billing Date": new Date(item.order_date).toLocaleDateString("en-GB"),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BillWiseReport");
    XLSX.writeFile(workbook, "BillWiseReport.xlsx");
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
        <p className="font-bold text-2xl text-gray-800">KOT(billing) Report</p>
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
          className="bg-red-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-red-600"
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setSearchQuery("");
            setFilterType("All");
            setFilteredResult(data);
          }}
        >
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Customer name / Order No / Phone..."
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
              <th className="py-3 px-4 border-b">Order No.</th>
              <th className="py-3 px-4 border-b">Customer Name</th>
              {/* <th className="py-3 px-4 border-b">Customer Phone</th> */}
              <th className="py-3 px-4 border-b">Member count</th>
              
              {/* <th className="py-3 px-4 border-b">Billing Date</th> */}
              <th className="py-3 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{index + 1}</td>
                <td className="py-3 px-4 border-b">{item.booking_id}</td>
                <td className="py-3 px-4 border-b">{item?.customer_name}</td>
                {/* <td className="py-3 px-4 border-b">{item?.customer?.phone}</td> */}
                <td className="py-3 px-4 border-b">{item?.members_count}</td>
                {/* <td className="py-3 px-4 border-b">
                  {new Date(item.order_date).toLocaleDateString("en-GB")}
                </td> */}
                <td className="py-3 px-4 border-b">
                  <a
                    href={`${reporturl}/resturant/printfamilykot/?id=${item.booking_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    BillPdf
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
