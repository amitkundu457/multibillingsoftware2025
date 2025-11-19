"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MembershipReport() {
  const [report, setReport] = useState([]);

  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          " https://apibrize.brizindia.com/api/membership-plan-report",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReport(response?.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching report:", error);
        setReport([]);
      }
    };

    fetchReport();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Membership Plan Report
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
        <table className="w-full border-collapse text-gray-700">
          <thead>
            <tr className="bg-gray-200 text-left text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Plan Name</th>
              <th className="p-4 font-semibold text-center">Total Customers</th>
              <th className="p-4 font-semibold text-center">Validity (Days)</th>
              <th className="p-4 font-semibold text-center">Plan Price</th>
              <th className="p-4 font-semibold text-center">
                Total Revenue (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {report.map((row, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-4 text-left font-medium">
                  {row.plan_name ?? ""}
                </td>
                <td className="p-4">{row.total_customer}</td>
                <td className="p-4 text-left font-medium">
                  {row.validity ?? ""}
                </td>
                <td className="p-4 text-left font-medium">{row.price ?? ""}</td>
                <td className="p-4 font-semibold">
                  ₹{row.total_revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
