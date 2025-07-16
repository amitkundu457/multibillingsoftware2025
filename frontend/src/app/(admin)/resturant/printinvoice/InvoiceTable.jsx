"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
  


const InvoiceTable = ({ table_no, logoUrl, taxes, companyName }) => {
   
  const [bill, setBill] = useState(null);

   useEffect(() => {
    if (table_no) {
      fetch(`https://api.equi.co.in/api/kot-orders/bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token logic
        },
        body: JSON.stringify({ table_no }),
      })
        .then((res) => res.json())
        .then(setBill)
        .catch(console.error);
    }
  }, [table_no]);

  if (!table_no) return <p>Please provide a table number.</p>;
  if (!bill) return <p>Loading bill for table {table_no}...</p>;
  
 const cgst = (bill.gst / 2).toFixed(2);
  const sgst = (bill.gst / 2).toFixed(2);

   return (
     <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200 font-sans text-gray-800">
      {/* --- Header --- */}
      <div className="text-center border-b border-gray-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">The Gourmet Kitchen</h1>
        <p className="text-sm text-gray-500">12-A, Central Plaza, Food Street, New City - 445566</p>
        <p className="text-sm text-gray-500">Phone: +91-9876543210 | GSTIN: 22AAAAA0000A1Z5</p>
        <h2 className="mt-4 text-xl font-semibold text-slate-600">Bill for Table No: {table_no}</h2>
      </div>

      {/* --- Table --- */}
      <table className="w-full text-sm mb-6 border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-indigo-50 text-indigo-700">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border text-left">Item</th>
            <th className="p-2 border text-right">Qty</th>
            <th className="p-2 border text-right">Price</th>
            <th className="p-2 border text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, index) => (
            <tr key={index} className="hover:bg-indigo-50">
              <td className="p-2 border text-center">{index + 1}</td>
              <td className="p-2 border">{item.product_name}</td>
              <td className="p-2 border text-right">{item.quantity}</td>
              <td className="p-2 border text-right">₹{item.product_price}</td>
              <td className="p-2 border text-right">₹{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Totals --- */}
      <div className="text-right text-sm space-y-1 border-t border-gray-300 pt-4">
        <p className="text-gray-600">Subtotal: ₹{bill.subtotal.toFixed(2)}</p>
        <p className="text-gray-600">CGST (9%): ₹{cgst}</p>
        <p className="text-gray-600">SGST (9%): ₹{sgst}</p>
        <p className="text-lg font-bold text-indigo-700">Grand Total: ₹{bill.grand_total.toFixed(2)}</p>
      </div>

      {/* --- Footer --- */}
      <div className="text-center mt-8 text-gray-500 text-sm border-t pt-4">
        <p>Thank you for choosing The Gourmet Kitchen!</p>
        <p>We hope to serve you again soon.</p>
      </div>
    </div>
  );
};

export default InvoiceTable;
