"use client";
import React, { forwardRef } from "react";

const Receipt = forwardRef(({ entries }, ref) => {
  return (
    <div
      ref={ref}
      className="max-w-4xl mx-auto p-6 border relative border-gray-300 shadow-lg bg-white"
    >
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-xl font-bold">RETAILJI JEWELLERY</h2>
        <p className="text-sm">KOLKATA, KOLKATA</p>
      </div>
      <img
        src="https://i.imgur.com/w8dR0Ys.png"
        alt="RetailJi Logo"
        className="mx-auto h-16 absolute top-4"
      />

      {/* Customer and Voucher Details */}
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Customer Details:</h3>
            <p className="text-sm">
              <strong>Name:</strong>{" "}
              {entries[0]?.accountmasters?.account_name || "N/A"} <br />
              <strong>Phone:</strong> {entries[0]?.customer_phone || "N/A"}{" "}
              <br />
              <strong>Address:</strong> {entries[0]?.customer_address || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Voucher No:</strong> {entries[0]?.voucher_no || "N/A"}{" "}
              <br />
              <strong>Date:</strong>{" "}
              {new Date(entries[0]?.created_at).toLocaleDateString() || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="opacity-10 absolute bottom-4">
        <img
          src="https://i.imgur.com/w8dR0Ys.png"
          className="w-[70rem]"
          alt="RetailJi Watermark"
        />
      </div>

      {/* Table Section */}
      <table className="w-full border-collapse border border-gray-400 mt-6">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2 text-left">
              Description
            </th>
            <th className="border border-gray-400 px-4 py-2">Ref. No.</th>
            <th className="border border-gray-400 px-4 py-2 text-right">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td className="border border-gray-400 px-4 py-2">
                Received Amount
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {entry.reference_no || "N/A"}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                ₹{entry.amount || "0.00"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="flex justify-between mt-6">
        <p className="text-lg font-bold">
          Total Amount: ₹
          {entries.reduce((total, entry) => total + (entry.amount || 0), 0)}
        </p>
      </div>

      {/* Signature Section */}
      <div className="flex justify-between mt-12">
        <p className="text-sm">Customer Signature</p>
        <p className="text-sm">Authorised Signature</p>
      </div>
    </div>
  );
});

// Explicitly set the display name for the forwardRef component
Receipt.displayName = "Receipt";

export default Receipt;
