'use client';
import React, { useEffect, useState } from "react";
import axios from 'axios';

const StylistReport = () => {
    const [data,setData] = useState([]);


   useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(' https://apibrize.brizindia.com/api/stylist-report');
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching stylist report:', error);
      }
    };

    fetchReport();
  }, []);

 
    

  return (
   <div className="p-4 bg-gray-100 min-h-screen">
  <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Stylist Report</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
      <thead className="bg-blue-100 text-blue-800 font-semibold text-sm">
        <tr>
          <th className="px-4 py-3 text-left">#</th>
          <th className="px-4 py-3 text-left">Stylist Name</th>
          <th className="px-4 py-3 text-left">Expertise</th>
          <th className="px-4 py-3 text-left">Available</th>
          <th className="px-4 py-3 text-left">Total Services</th>
          <th className="px-4 py-3 text-left">Total Customers</th>
          <th className="px-4 py-3 text-left">Total Price</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-700">
        {data.map((stylist, index) => (
          <tr
            key={index}
            className="border-b hover:bg-gray-50 transition-colors"
          >
            <td className="px-4 py-2 font-medium">{index + 1}</td>
            <td className="px-4 py-2">{stylist.stylist_name}</td>
            <td className="px-4 py-2">{stylist.expertise}</td>
            <td className="px-4 py-2">
              <span
                className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                  stylist.available ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {stylist.available ? "Yes" : "No"}
              </span>
            </td>
            <td className="px-4 py-2 text-blue-700 font-medium">
              {stylist.total_services}
            </td>
            <td className="px-4 py-2 text-purple-700 font-medium">
              {stylist.total_customers}
            </td>
            <td className="px-4 py-2 text-green-700 font-medium">
              ₹{parseFloat(stylist.total_price).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default StylistReport;
