"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function CustomerReportPage() {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const [customerData, setCustomerData] = useState([]);
  const [customerTypeData, setCustomerTypeData] = useState([]);
  const [customerSubTypeData, setCustomerSubTypeData] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedSubType, setSelectedSubType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchCustomerData();
    fetchCustomerTypeData();
    fetchCustomerSubTypeData();
  }, []);

  const getDateOnly = (datetime) => {
    const date = new Date(datetime);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0];
  };
  const fetchCustomerData = async () => {
    const token = getCookie("access_token"); // Retrieve token

    const response = await axios.get("https://api.equi.co.in/api/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);

    setCustomerData(response.data);
    setFilteredData(response.data); // ✅ set default filteredData
  };

  const fetchCustomerTypeData = async () => {
    const token = getCookie("access_token"); // Retrieve token

    try {
      const response = await axios.get(
        "https://api.equi.co.in/api/customerstype",
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ space after 'Bearer'
          },
        }
      );

      setCustomerTypeData(response.data.data); // ✅ correct data usage
    } catch (error) {
      console.error("Error fetching customer types:", error);
    }
  };

  const fetchCustomerSubTypeData = async () => {
    const token = getCookie("access_token"); // Retrieve token

    try {
      const response = await axios.get(
        "https://api.equi.co.in/api/customersubtypes",
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ space after 'Bearer'
          },
        }
      );

      setCustomerSubTypeData(response.data); // ✅ correct data usage
    } catch (error) {
      console.error("Error fetching customer types:", error);
    }
  };

  const filterCustomerData = () => {
    let filtered = [...customerData];

    if (selectedType) {
      filtered = filtered.filter((c) => c.customer_type == selectedType);
    }

    if (selectedSubType) {
      filtered = filtered.filter((c) => c.customer_sub_type == selectedSubType);
    }

    if (startDate) {
      filtered = filtered.filter(
        (c) => new Date(c.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (c) => new Date(c.created_at) <= new Date(endDate)
      );
    }

    setFilteredData(filtered);
  };

  const exportToPDF = () => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [[
      "#",
      "Name",
      "Phone",
      "Email",
      "DOB",
      "Anniversary",
      "Visit Source",
      "Address",
      "Total Orders",
      "Total Amount"
    ]],
    body: filteredData.map((c, i) => [
      i + 1,
      c.name || "NA",
      c.phone || "NA",
      c.email || "NA",
      c.dob || "NA",
      c.anniversary || "NA",
      c.visit_source || "NA",
      `${c.address || "NA"}, ${c.state || "NA"}, ${c.pincode || "NA"}`,
      c.total_orders ?? 0,
      c.order_totals
        ? `₹ ${(
            c.order_totals
              .split(",")
              .reduce((sum, val) => sum + parseFloat(val || 0), 0)
          ).toFixed(2)}`
        : "₹ 0.00"
    ]),
    styles: {
      fontSize: 8,
    },
    headStyles: {
      fillColor: [22, 160, 133],
    },
    margin: { top: 10 },
  });

  doc.save("customer_report.pdf");
};


  const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    filteredData.map((c, i) => ({
      "#": i + 1,
      Name: c.name || "NA",
      Phone: c.phone || "NA",
      Email: c.email || "NA",
      DOB: c.dob || "NA",
      Anniversary: c.anniversary || "NA",
      "Visit Source": c.visit_source || "NA",
      Address: `${c.address || "NA"}, ${c.state || "NA"}, ${c.pincode || "NA"}`,
      "Total Orders": c.total_orders ?? 0,
      "Total Amount": c.order_totals
        ? c.order_totals
            .split(",")
            .reduce((sum, val) => sum + parseFloat(val || 0), 0)
            .toFixed(2)
        : "0.00",
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "customer_report.xlsx");
};


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Report</h2>
      <div className="mb-6 bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Customer Type */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Customer Type
            </label>
            <select
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select Customer Type</option>
              {customerTypeData.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Subtype */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Customer Sub Type
            </label>
            <select
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSubType}
              onChange={(e) => setSelectedSubType(e.target.value)}
            >
              <option value="">Select Customer Sub Type</option>
              {customerSubTypeData.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={filterCustomerData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>

        <button
          onClick={exportToPDF}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Export PDF
        </button>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">DOB</th>
              <th className="border p-2 text-left">Anniversary</th>
              <th className="border p-2 text-left">Visit Source</th>
              <th className="border p-2 text-left">Address</th>

              <th className="border p-2 text-left">No .of Orders</th>
              {/* <th className="border p-2 text-left">order Id</th> */}
              {/* <th className="border p-2 text-left">Total order Price</th> */}
            </tr>
          </thead>
          <tbody>
           {Array.isArray(filteredData) && filteredData.length > 0 ? (
  filteredData.map((data, index) => (
    <tr key={data.id || index} className="hover:bg-gray-50">
      <td className="border p-2">{index + 1}</td>
      <td className="border p-2">{data.customer_name || "NA"}</td>
      <td className="border p-2">{data.phone || "NA"}</td>
      <td className="border p-2">{data.email || "NA"}</td>
      <td className="border p-2">{data.dob || "NA"}</td>
      <td className="border p-2">{data.anniversary || "NA"}</td>
      <td className="border p-2">{data.visit_source || "NA"}</td>

      <td className="border p-2">
        {data.address || "NA"}, {data.state || "NA"}, {data.pincode || "NA"}
      </td>

      <td className="border p-2">{data.total_orders ?? 0}</td>

      {/* <td className="border p-2 text-sm font-semibold">
        ₹{" "}
        {data.order_totals
          ? data.order_totals
              .split(",")
              .reduce((sum, val) => sum + parseFloat(val || 0), 0)
              .toFixed(2)
          : "0.00"}
      </td> */}
    </tr>
  ))
) : (
  <tr>
    <td colSpan="10" className="text-center p-4">
      No customers found.
    </td>
  </tr>
)}

          </tbody>
        </table>
      </div>
    </div>
  );
}
