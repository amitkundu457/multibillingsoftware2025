"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import format from "date-fns/format";

const BarcodeReport = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
    return null;
  };

  useEffect(() => {
    const token = getCookie("access_token");
    if (!token) {
      console.error("Authentication token not found!");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.equi.co.in/api/barcodeReport", {
          headers: { authorization: `Bearer ${token}` },
        });
        setData(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const lowerQuery = searchQuery.toLowerCase();
    const itemDate = item.created_at ? new Date(item.created_at) : null;
    const isInDateRange =
      itemDate &&
      (!startDate || new Date(startDate) <= itemDate) &&
      (!endDate || new Date(endDate) >= itemDate);

    return (
      isInDateRange &&
      (item.product_name?.toLowerCase().includes(lowerQuery) ||
        item.barcode_no?.toLowerCase().includes(lowerQuery) ||
        item.sku?.toLowerCase().includes(lowerQuery) ||
        item.design?.toLowerCase().includes(lowerQuery) ||
        item.itemno?.toLowerCase().includes(lowerQuery))
    );
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Barcode No",
      "Product Name",
      "SKU",
      "Qty",
      "Purchase Rate",
      "Sale Rate",
      "MRP",
      "Date",
    ];
    const tableRows = filteredData.map((item, index) => [
      index + 1,
      item.barcode_no || "-",
      item.product_name || "-",
      item.sku || "-",
      item.pcs || "-",
      item.purchase_rates || "-",
      item.sale_rate || "-",
      item.mrp || "-",
      format(new Date(item.created_at), "dd/MM/yyyy"),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("BarcodeReport.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        "Barcode No": item.barcode_no,
        "Product Name": item.product_name,
        "SKU": item.sku,
        "Item No": item.itemno,
        "Design": item.design,
        "Qty": item.pcs,
        "Purchase Rate": item.purchase_rates,
        "Sale Rate": item.sale_rate,
        "MRP": item.mrp,
        "Date": format(new Date(item.created_at), "dd/MM/yyyy"),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BarcodeReport");
    XLSX.writeFile(workbook, "BarcodeReport.xlsx");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">Barcode Report</p>
        <div>
          <button onClick={downloadPDF} className="mr-5 text-4xl text-red-500 hover:scale-110 transition">
            <FaFilePdf />
          </button>
          <button onClick={downloadExcel} className="mr-5 text-4xl text-green-500 hover:scale-110 transition">
            <BsFiletypeXls />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex items-center space-x-6 shadow-lg bg-white p-4 rounded-lg">
        <input type="date" className="w-56 h-12 border rounded-lg text-lg px-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" className="w-56 h-12 border rounded-lg text-lg px-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600" onClick={() => {}}>
          Search
        </button>
        <button className="bg-red-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-red-600" onClick={() => {
          setStartDate(""); setEndDate("");
        }}>
          Reset
        </button>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Product name/Barcode no./SKU/Item No/Design..."
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table or Loader */}
      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-lg font-semibold text-gray-500">Loading...</div>
        ) : (
          <table className="w-full text-left rounded-lg shadow-lg">
            <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Barcode No</th>
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">SKU</th>
                <th className="border px-4 py-2">Item No</th>
                <th className="border px-4 py-2">Design</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Purchase Rate</th>
                <th className="border px-4 py-2">Sale Rate</th>
                <th className="border px-4 py-2">MRP</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{index + 1}</td>
                  <td className="py-3 px-4 border-b">{item.barcode_no}</td>
                  <td className="py-3 px-4 border-b">{item.product_name}</td>
                  <td className="py-3 px-4 border-b">{item.sku}</td>
                  <td className="py-3 px-4 border-b">{item.itemno}</td>
                  <td className="py-3 px-4 border-b">{item.design}</td>
                  <td className="py-3 px-4 border-b">{item.pcs}</td>
                  <td className="py-3 px-4 border-b">{item.purchase_rates}</td>
                  <td className="py-3 px-4 border-b">{item.sale_rate}</td>
                  <td className="py-3 px-4 border-b">{item.mrp}</td>
                  <td className="py-3 px-4 border-b">{format(new Date(item.created_at), "dd/MM/yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BarcodeReport;
