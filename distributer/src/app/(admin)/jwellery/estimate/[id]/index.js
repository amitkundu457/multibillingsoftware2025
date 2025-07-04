"use client"
import React from "react";

const Invoice = ({ data }) => {
    return (
        <div className="max-w-4xl mx-auto border border-gray-300 p-6">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-lg font-bold uppercase">Approval</h1>
                <h2 className="text-xl font-bold">RETAILJI JEWELLERY</h2>
                <p className="text-sm">Kolkata, Kolkata</p>
            </div>

            {/* Customer and Order Details */}
            <div className="grid grid-cols-2 border-t border-b border-gray-300 py-4 mb-4">
                <div>
                    <h3 className="font-bold text-sm">Customer Details:</h3>
                    <p className="text-sm">Name: {data?.users?.name || "N/A"}</p>
                    <p className="text-sm">Phone: {data?.users?.customers[0]?.phone || "N/A"}</p>
                    <p className="text-sm">Address: {data?.users?.customers[0]?.address || "N/A"}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm">No: {data?.billno || "N/A"}</p>
                    <p className="text-sm">Date: {new Date(data?.created_at).toLocaleString() || "N/A"}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="table-auto w-full text-sm border border-gray-300 mb-4">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Sr No</th>
                    <th className="border border-gray-300 px-4 py-2">Item Name and Description</th>
                    <th className="border border-gray-300 px-4 py-2">Qty</th>
                    <th className="border border-gray-300 px-4 py-2">HSN</th>
                    <th className="border border-gray-300 px-4 py-2">Gross Wt. (gm)</th>
                    <th className="border border-gray-300 px-4 py-2">Net Wt. (gm)</th>
                    <th className="border border-gray-300 px-4 py-2">Hallmark</th>
                    <th className="border border-gray-300 px-4 py-2">Rate</th>
                    <th className="border border-gray-300 px-4 py-2">Labour</th>
                    <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                </tr>
                </thead>
                <tbody>
                {data?.details?.map((item, index) => (
                    <tr key={item.id}>
                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.product_name}</td>
                        <td className="border border-gray-300 px-4 py-2">1</td>
                        <td className="border border-gray-300 px-4 py-2">0</td>
                        <td className="border border-gray-300 px-4 py-2">{item.gross_weight}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.net_weight}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.hallmark || "0"}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.rate || "0"}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.making}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            {item.making || "0"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Summary */}
            <div className="text-sm border-t border-b border-gray-300 py-2">
                <p>
                    <span className="font-bold">In Word: </span>
                    Two Hundred and Seventy-Six Thousand, Five Hundred and Sixty-Seven Only
                </p>
            </div>

            {/* Payment Info */}
            <div className="text-sm mt-4 flex justify-between">
                <p>
                    <span className="font-bold">Payment Mode:</span> UPI - ₹ {data?.total_price || "N/A"}
                </p>
                <p>
                    <span className="font-bold">Gross Amount:</span> ₹ {data?.gross_total || "N/A"}
                </p>
            </div>

            {/* Total Amount */}
            <div className="text-right mt-6">
                <p className="text-lg font-bold">Bill Amount: ₹ {data?.total_price || "N/A"}</p>
            </div>
        </div>
    );
};

export default Invoice;
