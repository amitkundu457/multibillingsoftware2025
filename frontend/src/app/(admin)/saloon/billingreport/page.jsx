"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const BillingReport = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async (startDate = "", endDate = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/billingreport",
        {
          params: { start_date: startDate, end_date: endDate },
        }
      );
      setOrders(response.data);
      setFilteredOrders(response.data); // Initialize filtered orders
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch all orders initially
  }, []);

  const handleShow = () => {
    fetchOrders(startDate, endDate);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOrders(
      orders.filter((order) =>
        ["billno", "users.name", "users.customers.phone"]
          .map((key) => getValueByKey(order, key)?.toLowerCase())
          .some((value) => value?.includes(term))
      )
    );
  };

  const getValueByKey = (object, keyPath) =>
    keyPath.split(".").reduce((acc, key) => acc && acc[key], object);

  if (loading)
    return (
      <div className="fixed top-0 right-0 bottom-0 left-0 grid place-items-center">
        <div className="loader"></div>
      </div>
    );
  if (error)
    return <div className="text-center mt-4 text-red-500">{error}</div>;

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 bg-white">
      <div className="bg-green-700 text-center p-3 text-white">Billing Reports</div>
      <div className="flex items-center gap-4 mb-4 px-5 mt-3">
        <div className="flex items-center gap-2">
          <label htmlFor="fromDate" className="text-sm font-medium">
            From:
          </label>
          <input
            type="date"
            id="fromDate"
            className="border rounded px-2 py-1 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="toDate" className="text-sm font-medium">
            To:
          </label>
          <input
            type="date"
            id="toDate"
            className="border rounded px-2 py-1 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded"
          onClick={handleShow}
        >
          Show
        </button>
        <div className="flex items-center gap-2 border px-2 py-1 rounded w-1/4">
          <span className="text-sm text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Search Here"
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded h-screen">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Bill No</th>
              <th className="border px-4 py-2 text-left">Customer Name</th>
              <th className="border px-4 py-2 text-left">Phone</th>
              <th className="border px-4 py-2 text-left">Order Amount</th>
              <th className="border px-4 py-2 text-left">Payment</th>
              {/* <th className="border px-4 py-2 text-left">Delivery Date</th> */}
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border px-4 py-2">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">{order.billno || "N/A"}</td>
                <td className="border px-4 py-2">
                  {order.users?.name || "N/A"}
                </td>
                <td className="border px-4 py-2">
                {order.users?.customers?.length ? order.users.customers[0].phone : "N/A"}
                </td>
                <td className="border px-4 py-2">{order.total_price || 0}</td>
                <td className="border px-4 py-2">
  {order.payments?.filter(payment => parseFloat(payment.price) > 0).map((payment) => (
    <div key={payment.id}>
      {payment.payment_method}: {payment.price}
    </div>
  ))}
</td>

                {/* <td className="border px-4 py-2">
                  {order.delivery_date
                    ? new Date(order.delivery_date).toLocaleDateString()
                    : "N/A"}
                </td> */}
                <td className="border px-4 py-2">
                  <div className="flex gap-2">
                    <Link
                      href={`/jwellery/printinvoice/?id=${order.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      🖨️
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Action Button */}
      {/* <button className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600">
        +
      </button> */}
    </div>
  );
};

export default BillingReport;
