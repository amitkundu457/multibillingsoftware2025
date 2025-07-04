"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const BarcodeReport = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getCookie("access_token");
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/barcode-print-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.error("Failed to fetch report data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let data = [...reportData];

    if (startDate) {
      data = data.filter((item) => new Date(item.printed_at) >= new Date(startDate));
    }
    if (endDate) {
      data = data.filter((item) => new Date(item.printed_at) <= new Date(endDate));
    }
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((item) =>
        item.product?.name?.toLowerCase().includes(q) ||
        item.barcode?.barcode_no?.toLowerCase().includes(q)
      );
    }

    setFilteredData(data);
    setPage(1);
  }, [startDate, endDate, search, reportData]);

  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Barcode Print History</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <input
          type="text"
          placeholder="Search by product or barcode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-4 py-2 w-full md:w-72"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Product</th>
              <th className="p-3">Barcode</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Printed By</th>
              <th className="p-3">Printed At</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{(page - 1) * itemsPerPage + idx + 1}</td>
                <td className="p-3">{item.product?.name || "-"}</td>
                <td className="p-3">{item.barcode?.barcode_no || "-"}</td>
                <td className="p-3">{item.barcode?.sku || "-"}</td>
                <td className="p-3">₹{item.barcode?.basic_rate || "-"}</td>
                <td className="p-3">{item.user?.name || "-"}</td>
                <td className="p-3">{format(new Date(item.printed_at), "yyyy-MM-dd HH:mm")}</td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm">
          Showing {Math.min((page - 1) * itemsPerPage + 1, filteredData.length)} -{" "}
          {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeReport;
