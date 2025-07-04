 "use client";

import React, { useRef } from "react";

export default function InvoiceTable({ orderId, data, restaurantName = "My Restaurant" }) {
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  // Get current date/time string for header
  const dateStr = new Date().toLocaleString();

  // Calculate CGST and SGST as half of total GST
  const cgst = data.gst / 2;
  const sgst = data.gst / 2;

  return (
    <>
      <div
        ref={printRef}
        className="printable max-w-md mx-auto bg-white p-6 shadow-md border border-gray-300"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">{restaurantName}</h1>
          <p className="text-sm text-gray-600">{dateStr}</p>
          <hr className="my-2 border-gray-300" />
        </div>

        {/* Order info */}
        <p className="mb-4 font-semibold">Table no: {orderId}</p>

        {/* Items Table */}
       <table className="w-full border-collapse border border-gray-300 mb-4">
  <thead>
    <tr className="bg-gray-100">
      <th className="border border-gray-300 p-2 text-left">Product</th>
      <th className="border border-gray-300 p-2 text-center">Qty</th>
      {/* <th className="border border-gray-300 p-2 text-right">Price</th>
      <th className="border border-gray-300 p-2 text-right">Total</th> */}
    </tr>
  </thead>
  <tbody>
    {data.items.map((item) => (
      <tr key={item.product_id}>
        <td className="border border-gray-300 p-2">{item.product_name}</td>
        <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
        {/* <td className="border border-gray-300 p-2 text-right">₹{parseFloat(item.product_price).toFixed(2)}</td>
        <td className="border border-gray-300 p-2 text-right">₹{parseFloat(item.total).toFixed(2)}</td> */}
      </tr>
    ))}
  </tbody>
</table>

        {/* Totals */}
        {/* <div className="space-y-1 text-right text-sm">
          <div>
            <span className="font-semibold">Subtotal: </span>₹{data.subtotal.toFixed(2)}
          </div>
          <div>
            <span className="font-semibold">CGST (9%): </span>₹{cgst.toFixed(2)}
          </div>
          <div>
            <span className="font-semibold">SGST (9%): </span>₹{sgst.toFixed(2)}
          </div>
          <div className="border-t border-gray-300 mt-2 pt-2 font-bold text-lg">
            Grand Total: ₹{data.grand_total.toFixed(2)}
          </div>
        </div> */}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-700 italic text-sm">
          Thank you for dining with us!
        </div>
      </div>

      {/* Print button */}
      <div className="text-center mt-6">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print KOT Slip
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable,
          .printable * {
            visibility: visible;
          }
          .printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            background: white;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
