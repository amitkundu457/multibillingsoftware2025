"use client";
import { useState, useEffect } from "react";
import StockListTable from "../stocklist/page";
import StockReturnsTable from "../stockreturns/page";

export default function PurchaseForm() {
  const [supplierName, setSupplierName] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("Return");
  const [loading, setLoading] = useState(true);
  const [stockReturns, setStockReturns] = useState([]);
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [account, setAccount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-CA"); // Formats to YYYY-MM-DD
    setPurchaseDate(formattedDate);
  }, []);
  

  // Fetch stock returns data
  useEffect(() => {
    const fetchStockReturns = async () => {
      try {
        const response = await fetch(" https://api.equi.co.in/api/stock-returns/");
        const data = await response.json();
        setStockReturns(data);
      } catch (error) {
        console.error("Error fetching stock returns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockReturns();
  }, []);

  // Fetch payments and sort by date (newest first)
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(" https://api.equi.co.in/api/stock-returns/");
        const data = await response.json();
        // Sort payments by date (newest first)
        const sortedPayments = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPayments(sortedPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      supplier_name: supplierName,
      reference_no: referenceNo,
      date: purchaseDate,
      status,
      amount,
      payment_type: paymentType,
      payment_note: paymentNote,
    };

    try {
      const response = await fetch(" https://api.equi.co.in/api/stock-returns/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Purchase return submitted successfully!");
        setSupplierName("");
        setReferenceNo("");
        setPurchaseDate(new Date().toISOString().split("T")[0]);
        setStatus("Return");
        setAmount("");
        setPaymentType("");
        setAccount("");
        setPaymentNote("");
      } else {
        const errorData = await response.json();
        alert("Error submitting data: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred: " + error.message);
    }
  };

  const handleCancel = () => {
    setSupplierName("");
    setReferenceNo("");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setStatus("Return");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
          Stock Return <span className="text-gray-500">Add/Update Stock</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-medium">Supplier Name *</label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Reference No.</label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-medium">Purchase Date *</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Status *</label>
            <select
              className="w-full p-2 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Return">Return</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6">Previous Payments Information:</h3>
        <table className="w-full mt-2 border rounded">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Date</th>
              <th className="p-2">Payment Type</th>
              <th className="p-2">Payment Note</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr key={index}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{payment.date}</td>
                  <td className="p-2">{payment.payment_type}</td>
                  <td className="p-2">{payment.payment_note}</td>
                  <td className="p-2">{payment.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  Payments Pending!!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 className="text-lg font-semibold mt-6">Make Payment:</h3>
        <div className="bg-gray-200 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Payment Type</label>
              <select
                className="w-full p-2 border rounded"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="">-Select-</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block font-medium">Payment Note</label>
            <textarea
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-green-600 text-white py-2 px-6 rounded" onClick={handleSubmit}>
            Submit
          </button>
          <button className="bg-orange-500 text-white py-2 px-6 rounded ml-4" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
