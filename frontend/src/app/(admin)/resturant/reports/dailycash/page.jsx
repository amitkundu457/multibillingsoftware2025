"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentSummaryCards = () => {
  const [allPayments, setAllPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const notifyTokenMissing = () => {
    if (typeof window !== "undefined" && window.notyf) {
      window.notyf.error("Authentication token not found!");
    } else {
      console.error("Authentication token not found!");
    }
  };

  const fetchAllPayments = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        " https://apibrize.brizindia.com/api/all-payments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllPayments(res.data.data);
      filterAndSummarize(res.data.data, fromDate, toDate); // initial filter
    } catch (error) {
      console.error("Error fetching payments", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSummarize = (data, from, to) => {
    const summaryResult = {
      cash: 0,
      upi: 0,
      card: 0,
      advance: 0,
      others: 0,
    };

    const filtered = data.filter((item) => {
      const date = item.created_at.split("T")[0];
      return (!from || date >= from) && (!to || date <= to);
    });

    filtered.forEach((item) => {
      const mode = item.payment_method?.toLowerCase() ?? "others";
      const amount = parseFloat(item.amount) || 0;

      if (summaryResult[mode] !== undefined) {
        summaryResult[mode] += amount;
      } else {
        summaryResult["others"] += amount;
      }
    });

    setSummary(summaryResult);
  };

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const handleFilter = () => {
    filterAndSummarize(allPayments, fromDate, toDate);
  };

  const paymentTypes = ["cash", "upi", "card", "advance", "others"];
  const cardColors = {
    cash: "bg-gradient-to-r from-green-400 to-green-600 text-white",
    upi: "bg-gradient-to-r from-indigo-400 to-indigo-600 text-white",
    card: "bg-gradient-to-r from-pink-400 to-pink-600 text-white",
    advance: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white",
    others: "bg-gradient-to-r from-gray-400 to-gray-600 text-white",
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Payment Summary</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {paymentTypes.map((type) => (
            <div
              key={type}
              className={`p-5 shadow-xl rounded-2xl transform transition hover:scale-105 duration-300 ${cardColors[type]}`}
            >
              <h3 className="text-lg font-bold capitalize tracking-wide">
                {type}
              </h3>
              <p className="text-2xl font-extrabold mt-2">
                ₹{summary[type]?.toFixed(2) || "0.00"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentSummaryCards;
