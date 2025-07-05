"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Notyf } from "notyf";
import { FaBirthdayCake } from "react-icons/fa";
import { MdDinnerDining } from "react-icons/md";
import "notyf/notyf.min.css"; // Import Notyf styles
import Link from "next/link";

const CustomersCelebrate = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const notyf = new Notyf();

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Get Token from Cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const token = getCookie("access_token"); // Retrieve token
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await axios.get(" https://api.equi.co.in/api/customerUpcommingbirthday", config);
      setCustomers(data);
    } catch (error) {
      notyf.error("Error fetching customers!");
      console.error("Error fetching customers:", error);
    }
  };

  // Handle Checkbox Change
  const handleCheckboxChange = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId]
    );
  };

  // Send Bulk Messages
  const sendBulkMessages = async () => {
    if (selectedCustomers.length === 0) {
      notyf.error("Please select at least one customer!");
      return;
    }
  
    console.log("Sending customer IDs:", selectedCustomers); // Debugging log
  
    try {
      const token = getCookie("access_token"); // Retrieve token
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      await axios.post(" https://api.equi.co.in/api/bulksendmessagebidthday", { customer_ids: selectedCustomers }, config);
      notyf.success("Messages sent successfully!");
      setSelectedCustomers([]); // Clear selection after sending
    } catch (error) {
      notyf.error("Failed to send messages.");
      console.error("Error sending bulk messages:", error);
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Upcomming Customers Birthday </h1>
    <div className="space-x-3 ">
    {/* <button
        onClick={sendBulkMessages}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Send Message
       
      </button> */}
      <Link className="text-white bg-red-800 p-2" href="/jwellery/upcominganiversery/">Upcoming Anniversary</Link>
    </div>
      <table className="w-full border border-collapse border-gray-300 mt-5">
        <thead>
          <tr>
            {/* <th className="px-4 py-2 border text-center border-gray-300">Select</th> */}
            <th className="px-4 py-2 border text-center border-gray-300">Name</th>
            <th className="px-4 py-2 border text-center border-gray-300">Phone</th>
            <th className="px-4 py-2 border text-center border-gray-300">DOB</th>
            {/* <th className="px-4 py-2 border border-gray-300">Anniversary</th> */}
            {/* <th className="px-4 py-2 border border-gray-300">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              {/* <td className="px-4 py-2 border border-gray-300 text-center">
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={() => handleCheckboxChange(customer.id)}
                />
              
              </td> */}
              <td className="px-4 py-2 border text-center border-gray-300">{customer.name}</td>
              <td className="px-4 py-2 border text-center border-gray-300">{customer.phone}</td>
              <td className="px-4 py-2 border text-center border-gray-300">{customer.dob}</td>
              {/* <td className="px-4 py-2 border text-center border-gray-300">{customer.anniversary}</td> */}
              {/* <td className="px-4 py-2 border border-gray-300">
                <button className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded">
                  <FaBirthdayCake />
                </button>
                <button className="px-2 py-1 text-white bg-red-500 rounded">
                  <MdDinnerDining />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Send Bulk Messages Button */}
      
    </div>
  );
};

export default CustomersCelebrate;
