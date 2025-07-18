"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const Home = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("Authentication token not found!");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/salesreport",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const filteredData = data.filter((item) => {
    const lowerQuery = searchQuery.toLowerCase();
    const itemDate = new Date(item.payment_date);
    const isInDateRange =
      (!startDate || new Date(startDate) <= itemDate) &&
      (!endDate || new Date(endDate) >= itemDate);

    return (
      isInDateRange &&
      (item.product_name?.toLowerCase().includes(lowerQuery) ||
        item.billno?.toLowerCase().includes(lowerQuery) ||
        item.customer_name?.toLowerCase().includes(lowerQuery) ||
        item.payment_method?.toLowerCase().includes(lowerQuery))
    );
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Bill No.",
      "Product Name",
      "Customer Name",
      "Payment Mode",
      "Total Payment",
      "Payment Date",
    ];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const row = [
        index + 1,
        item.billno || "",
        item.product_name || "",
        item.customer_name || "",
        item.payment_method || "",
        item.price || "",
        item.payment_date || "",
      ];
      tableRows.push(row);
    });

    const total = filteredData.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0),
      0
    );
    const totalRow = ["", "", "", "", "Total Payment:", total.toFixed(2), ""];
    tableRows.push(totalRow);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("SalesRegister.pdf");
  };

  const downloadExcel = () => {
    const rows = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "Bill No.": item.billno || "",
      "Product Name": item.product_name || "",
      "Customer Name": item.customer_name || "",
      "Payment Mode": item.payment_method || "",
      "Total Payment": item.price || "",
      "Payment Date": item.payment_date || "",
    }));

    const total = filteredData.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0),
      0
    );
    rows.push({
      "S.No": "",
      "Bill No.": "",
      "Product Name": "",
      "Customer Name": "",
      "Payment Mode": "Total Payment:",
      "Grand Total": total.toFixed(2),
      "Payment Date": "",
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalesRegister");
    XLSX.writeFile(workbook, "SalesRegister.xlsx");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">Sales Register</p>
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

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Party name/bill no. /Payment Mode/product name..."
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-xl text-gray-500">
            Loading...
          </div>
        ) : (
          <table className="w-full text-left bg-white rounded-lg shadow-lg">
            <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
              <tr>
                <th className="py-3 px-4 border-b">S.No</th>
                <th className="py-3 px-4 border-b">Bill no.</th>
                <th className="py-3 px-4 border-b">Product Name</th>
                <th className="py-3 px-4 border-b">Party Name</th>
                <th className="py-3 px-4 border-b">Payment Mode</th>
                <th className="py-3 px-4 border-b">Total pymt</th>
                <th className="py-3 px-4 border-b">Pymt Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{index + 1}</td>
                  <td className="py-3 px-4 border-b">{item.billno}</td>
                  <td className="py-3 px-4 border-b">{item.product_name}</td>
                  <td className="py-3 px-4 border-b">{item.customer_name}</td>
                  <td className="py-3 px-4 border-b">{item.payment_method}</td>
                  <td className="py-3 px-4 border-b">{item.price}</td>
                  <td className="py-3 px-4 border-b">{item.payment_date}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blue-500 rounded-sm font-semibold">
                <td colSpan="5" className="py-3 px-4 border-t text-right">
                  Grand Total:
                </td>
                <td className="py-3 px-4 border-t">
                  {filteredData
                    .reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
                    .toFixed(2)}
                </td>
                <td className="py-3 px-4 border-t"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default Home;
