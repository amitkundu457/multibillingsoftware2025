"use client";
import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import axios from "axios";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {reporturl} from "@/app/lib/axios";

const Page = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  // Get token from cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://api.equi.co.in/api/employees", {
        headers: { authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch Report Data
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const result = await axios.get("https://api.equi.co.in/api/agentsalesreport", {
        headers: { authorization: `Bearer ${token}` },
      });
      setData(result.data);
      setFilteredData(result.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Handler
  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const orderDate = new Date(item.order_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchDate =
        (!start || orderDate >= start) && (!end || orderDate <= end);

      const matchAgent = !selectedAgent || item.employee_id == selectedAgent;

      return matchDate && matchAgent;
    });

    setFilteredData(filtered);
  };

  // Load on mount
  useEffect(() => {
    setIsClient(true);
    const t = getCookie("access_token");
    if (!t) {
      console.error("Authentication token not found!");
      return;
    }
    setToken(t);
  }, []);

  // Fetch data when token is available
  useEffect(() => {
    if (token) {
      fetchReportData();
      fetchEmployees();
    }
  }, [token]);

  // Refetch filtered data on dependencies
  useEffect(() => {
    handleFilter();
  }, [startDate, endDate, selectedAgent, data]);

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedAgent("");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Agent Name",
      "Bill No",
      // "Product Name",
      "Customer Name",
      "Qty",
      "Amount",
      // "Payment Mode",
      "Order Date",
    ];
    const tableRows = filteredData.map((item, index) => [
      index + 1,
      item.agent_name || "-",
      item.billno || "-",
      // item.product_name || "-",
      item.customer_name || "-",
      item.total_qty || "-",
      item.total_price || "-",
      // item.payment_method || "-",
      item.order_date ? format(new Date(item.order_date), "dd/MM/yyyy") : "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("AgentSaleReport.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        "Agent Name": item.agent_name,
        "Bill No": item.billno,
        // "Product Name": item.product_name,
        "Customer Name": item.customer_name,
        Qty: item.total_qty,
        Amount: item.total_price,
        // "Payment Mode": item.payment_method,
        "Order Date": item.order_date
          ? format(new Date(item.order_date), "dd/MM/yyyy")
          : "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AgentSaleReport");
    XLSX.writeFile(workbook, "AgentSaleReport.xlsx");
  };

  if (!isClient) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white py-4 px-6 rounded-lg shadow-md">
        <h1 className="font-bold text-2xl text-gray-800">Agent Sale Report</h1>
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
      <div className="mt-8 flex flex-wrap gap-4 items-center bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-48 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg px-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-48 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg px-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose Agent
          </label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-52 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg px-3"
          >
            <option value="">Select Agent</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="h-12 px-4 mt-5 text-white bg-red-500 hover:bg-red-600 rounded-lg"
        >
          Reset Date Filters
        </button>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        {loading ? (
          <div className="text-center text-lg font-medium text-gray-600 py-10">
            Loading...
          </div>
        ) : (
          <table className="w-full text-left bg-white rounded-lg shadow-md">
            <thead className="bg-blue-500 text-black rounded-sm font-semibold">
              <tr>
                {[
                  "S.No",
                  "Agent Name",
                  "Bill No",
                  // "Product Name",
                  "Customer Name",
                  "Qty",
                  "Amount",
                  // "Payment Mode",
                  "Date",
                  "Action",
                ].map((heading, index) => (
                  <th
                    key={index}
                    className="py-3 px-4 border-b text-sm md:text-base"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition text-gray-700"
                  >
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">{item.agent_name}</td>
                    <td className="py-3 px-4 border-b">{item.billno}</td>
                    {/* <td className="py-3 px-4 border-b">{item.product_name}</td> */}
                    <td className="py-3 px-4 border-b">{item.customer_name}</td>
                    <td className="py-3 px-4 border-b">{item.total_qty}</td>
                    <td className="py-3 px-4 border-b">{item.total_price}</td>
                    {/* <td className="py-3 px-4 border-b">
                      {item.payment_method}
                    </td> */}
                    <td className="py-3 px-4 border-b">
                      {item.order_date
                        ? format(new Date(item.order_date), "dd-MM-yyyy")
                        : ""}
                    </td>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 px-4 border-b text-center" colSpan={9}>
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

export default Page;
