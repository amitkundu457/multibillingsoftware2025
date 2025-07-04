"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getAssigndistributer } from "../../../components/config";
import axios from "axios";
function Page() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    
    fetchClients();
  }, []);
  const fetchClients = async () => {
    const response = await getAssigndistributer();
    const updatedUsers = response.data.map((user) => ({
      ...user,
     
    }));
    setUsers(updatedUsers || []);
  };
  // Function to update status
  const ApproveStatus = async (id, newStatus) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/approve/${id}`, {
        status: newStatus, // Send only status in the body, since ID is in the URL
      });
  
      if (response.status === 200) {
        fetchClients();
        console.log("Status updated successfully:", response.data);
      }
    } catch (error) {
      console.error("Failed to update status:", error.response?.data || error.message);
    }
  };
  

  const RejectStatus = async (id, newStatus) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/reject/${id}`, {
        status: newStatus, // Send only status in the body, since ID is in the URL
      });
  
      if (response.status === 200) {
        fetchClients();
        console.log("Status updated successfully:", response.data);
      }
    } catch (error) {
      console.error("Failed to update status:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div className="grid place-items-center bg-[#04A24C] text-white p-3">
        Assign Client
      </div>
      <table className="table-auto w-full border-collapse border border-[#F0B171]">
        <thead className="bg-[#F0B171]">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Mobile</th>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length !== 0 &&
            users?.map((user, index) => (
              <tr key={user.id}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-center">{user.cname}</td>
                <td className="border px-4 py-2 text-center">{user.cemail}</td>
                <td className="border px-4 py-2 text-center">
                  {user.mobile_number}
                </td>
                <td className="border px-4 py-2 text-center">
                  {user.pname ?? "N/A"}
                </td>
                <td
  className={`border px-4 py-2 text-center ${
    user.status === 1
      ? "text-green-600" // Approved
      : user.status === 0
      ? "text-red-600" // Rejected
      : "text-yellow-600" // Pending (null or undefined)
  }`}
>
  {user.status === 1
    ? "Approved"
    : user.status === 0
    ? "Rejected"
    : "Pending"}
</td>

                <td className="border px-4 py-2 text-center">
                <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => ApproveStatus(user.id, "1")}
           
          >
            Approve
          </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => RejectStatus(user.id, "1")}
                    // disabled={user.status !== "pending"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });
