"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs"; // For date manipulation

const CustomerReport = () => {
    // Default dates: Last 7 days
    const [startDate, setStartDate] = useState(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch customers when the component mounts
    useEffect(() => {
        fetchCustomers();
    }, [startDate, endDate]); // Re-fetch if date changes

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(" https://api.equi.co.in/api/lastlogin", {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                },
            });
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Client Last Visit</h1>

            {/* Date Filters */}
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
                <button
                    onClick={fetchCustomers}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Fetch Data
                </button>
            </div>

            {/* Display Data */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-center">SL</th>
                            <th className="border p-2 text-center">Name</th>
                            <th className="border p-2 text-center">Email</th>
                            <th className="border p-2 text-center">Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer,index) => (
                                <tr key={customer.id} className="border">
                                    <td className="border text-center p-2">{index + 1}</td>
                                    <td className="border text-center p-2">{customer.name}</td>
                                    <td className="border text-center p-2">{customer.email}</td>
                                    <td className="border text-center p-2">{new Date(customer.last_login_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-2">No customers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CustomerReport;
