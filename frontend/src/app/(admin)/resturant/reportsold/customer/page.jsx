"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { clientReport } from "../../../../components/config";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Debounce logic
  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchClients();
    }, 500); // Wait 500ms after the last change
    return () => clearTimeout(debounceFetch); // Cleanup the timeout
  }, [startDate, endDate]);

  const fetchClients = async () => {
    try {
      const response = await clientReport({
        start_date: startDate,
        end_date: endDate,
      });
      console.log("Request Params:", { start_date: startDate, end_date: endDate });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  

  return (
    <div>
      <div className="grid place-items-center bg-[#04A24C] text-white p-3">
        Assign Client
      </div>

      {/* Date Filter */}
      <div className="p-4">
        <div className="flex gap-4 items-center">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
  type="date"
  id="start-date"
  value={startDate}
  onChange={(e) => {
    console.log("Start Date Changed:", e.target.value);  // Log the change
    setStartDate(e.target.value);
  }}
  className="border rounded p-2"
/>
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
  type="date"
  id="end-date"
  value={endDate}
  onChange={(e) => {
    console.log("End Date Changed:", e.target.value);  // Log the change
    setEndDate(e.target.value);
  }}
  className="border rounded p-2"
/>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table-auto w-full border-collapse border border-[#F0B171]">
        <thead className="bg-[#F0B171]">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Mobile</th>
            <th className="border px-4 py-2">Product</th>
          </tr>
        </thead>
        <tbody>
        {users.length === 0 ? (
  <tr>
    <td colSpan="5" className="text-center py-4">No clients found for the selected date range.</td>
  </tr>
) : (
  users.map((user, index) => (
    <tr key={index}>
      <td className="border px-4 py-2 text-center">{index + 1}</td>
      <td className="border px-4 py-2 text-center">{user.cname}</td>
      <td className="border px-4 py-2 text-center">{user.cemail}</td>
      <td className="border px-4 py-2 text-center">{user.mobile_number}</td>
      <td className="border px-4 py-2 text-center">{user.pname ?? "N/A"}</td>
    </tr>
  ))
)}

        </tbody>
      </table>
    </div>
  );
};

export default Page;
