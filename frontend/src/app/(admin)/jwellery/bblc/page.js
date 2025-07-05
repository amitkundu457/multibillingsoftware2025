"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CustomerReport = () => {
    const [startDate, setStartDate] = useState(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    useEffect(() => {
        fetchCustomers();
    }, [startDate, endDate]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(" https://api.equi.co.in/api/getLastVisitCustomers", {
                params: { start_date: startDate, end_date: endDate },
            });
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    // Export to Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(customers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
        XLSX.writeFile(workbook, "Customer_Report.xlsx");
    };

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Customer Report", 10, 10);
        doc.autoTable({
            head: [["SL", "Name", "Email", "Phone", "Address", "Last Visit", "Days Since Last Order"]],
            body: customers.map((customer, index) => [
                index + 1,
                customer.name,
                customer.email,
                customer.phone,
                customer.address,
                customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString() : "N/A",
                customer.days_since_last_order,
            ]),
        });
        doc.save("Customer_Report.pdf");
    };

    // Print Table
    const printTable = () => {
        window.print();
    };
    const handleCheckboxChange = (customerId) => {
        setSelectedCustomers((prev) =>
          prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId]
        );
      };
    const sendBulkMessages = async () => {
        if (selectedCustomers.length === 0) {
          notyf.error("Please select at least one customer!");
          return;
        }
      
        console.log("Sending customer IDs:", selectedCustomers); // Debugging log
      
        try {
          const token = getCookie("access_token"); // Retrieve token
          const config = { headers: { Authorization: `Bearer ${token}` } };
      
          await axios.post(" https://api.equi.co.in/api/bulksendmessage", { customer_ids: selectedCustomers }, config);
          notyf.success("Messages sent successfully!");
          setSelectedCustomers([]); // Clear selection after sending
        } catch (error) {
          notyf.error("Failed to send messages.");
          console.error("Error sending bulk messages:", error);
        }
      };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Bring Back Lost Customers</h1>
        
            <div className="flex space-x-4 mb-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <button onClick={fetchCustomers} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Fetch Data
                </button>
            </div>

            <div className="flex space-x-4 mb-4">
                <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Export to Excel
                </button>
                <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    Export to PDF
                </button>
                <button onClick={printTable} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                    Print
                </button>
                <button
        onClick={sendBulkMessages}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
       Send Message
      </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                        <th className="px-4 py-2 border text-center border-gray-300">Select</th>
                            <th className="border p-2 text-center">SL</th>
                            <th className="border p-2 text-center">Name</th>
                            <th className="border p-2 text-center">Email</th>
                            <th className="border p-2 text-center">Phone</th>
                            <th className="border p-2 text-center">Address</th>
                            <th className="border p-2 text-center">Last Visit</th>
                            <th className="border p-2 text-center">Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer, index) => (
                                <tr key={customer.id} className="border">
                                      <td className="px-4 py-2 border border-gray-300 text-center">
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={() => handleCheckboxChange(customer.id)}
                />
                {/* {customer.id} */}
              </td>
                                    <td className="border text-center p-2">{index + 1}</td>
                                    <td className="border text-center p-2">{customer.name}</td>
                                    <td className="border text-center p-2">{customer.email}</td>
                                    <td className="border text-center p-2">{customer.phone}</td>
                                    <td className="border text-center p-2">{customer.address}</td>
                                    <td className="border text-center p-2">
                                        {customer.last_order_at
                                            ? new Date(customer.last_order_at).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td className="border text-center p-2">{customer.days_since_last_order}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-2">No customers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CustomerReport;
