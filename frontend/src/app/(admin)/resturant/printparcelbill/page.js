"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getMe } from "../../../components/config";

const ParcelBill = () => {
  const [buyerState, setbuyState] = useState("");
  const [sellerState, setSellerState] = useState("");
  const [companyName, setCompanyName] = useState("");
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printStyle, setPrintStyle] = useState("thermal");
  const billRef = useRef();
  const searchParams = useSearchParams();
  const parcel_order_id = searchParams.get("id");
  console.log("buyer", buyerState);
  console.log("seller", sellerState);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getMe();
        console.log("Company details fetched:", response); // Log the API response to verify the data
        if (response && response.data) {
          setCompanyName(response.data); // Update state with the company name
          setSellerState(
            response?.data?.user?.information?.state?.trim().toLowerCase() || ""
          );
        } else {
          console.log("Company name not found in the response");
          setCompanyName(""); // Set default if name is not found
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);
  useEffect(() => {
    const fetchBill = async () => {
      const token = getCookie("access_token");

      try {
        const res = await fetch(
          `https://api.equi.co.in/api/parcel-order/${parcel_order_id}/generate-bill`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Include token here
            },
          }
        );

        const data = await res.json();
        console.log("billpracel", data);
        setBillData(data);
        setbuyState(data?.customer?.state);
        // if (res.ok);
        // else console.error('Server error:', data.message);
      } catch (err) {
        console.error("Error fetching bill:", err);
      } finally {
        setLoading(false);
      }
    };

    if (parcel_order_id) fetchBill();
  }, [parcel_order_id]);
  const isSameState = buyerState && sellerState && buyerState === sellerState;
  console.log("isSameState", isSameState);
  const handlePrint = () => {
    const printContent = billRef.current;
    if (!printContent) {
      alert("Bill content not loaded yet!");
      return;
    }

    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const contentClone = printContent.cloneNode(true);
    const printHiddenElements =
      contentClone.querySelectorAll(".print\\:hidden");
    printHiddenElements.forEach((el) => el.remove());

    const thermalStyles = `
      @page {
        size: 80mm 100%;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: monospace;
        font-size: 12px;
        width: 80mm;
        margin: 0 auto;
        padding: 10px 5px;
        line-height: 1.2;
      }
      .header {
        text-align: center;
        margin-bottom: 10px;
      }
      .restaurant-name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 3px;
      }
      .bill-type {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .divider {
        border-top: 1px dashed #000;
        margin: 5px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th {
        text-align: left;
        padding: 2px 0;
        border-bottom: 1px dashed #000;
      }
      td {
        padding: 3px 0;
      }
      .text-right {
        text-align: right;
      }
      .total-row {
        border-top: 1px dashed #000;
        font-weight: bold;
        padding-top: 5px;
      }
      .footer {
        text-align: center;
        margin-top: 10px;
        font-size: 10px;
      }
    `;

    const a4Styles = `
      @page {
        size: A4;
        margin: 10mm;
      }
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        margin: 0;
        padding: 0;
      }
      .print-area {
        width: 100%;
        max-width: 210mm;
        padding: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 6px 0;
        border-bottom: 1px solid #ddd;
      }
      .text-right { 
        text-align: right; 
      }
      .text-center { 
        text-align: center; 
      }
      .total-row { 
        font-weight: bold; 
        border-top: 2px solid #000;
        border-bottom: 2px solid #000;
      }
    `;

    const styles = printStyle === "thermal" ? thermalStyles : a4Styles;

    iframe.contentDocument.write(`
      <html>
        <head>
          <title>Parcel Bill - Order #${
            billData?.bill?.parcel_order_id || ""
          }</title>
          <style>
            ${styles}
          </style>
        </head>
        <body>
          ${contentClone.innerHTML}
          <script>
            setTimeout(function() {
              window.print();
              setTimeout(() => {
                document.body.removeChild(document.querySelector('iframe'));
              }, 100);
            }, 200);
          </script>
        </body>
      </html>
    `);
    iframe.contentDocument.close();
  };

  if (loading) return <div className="text-center mt-4">Loading bill...</div>;
  if (!billData)
    return (
      <div className="text-center mt-4">
        No bill found for ID {parcel_order_id}.
      </div>
    );

  const { bill, customer, user, items } = billData;

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-6 min-h-screen bg-gray-100 p-4">
      {/* Print Type Select */}
      <div className="print:hidden">
        <label className="mr-2 font-medium">Print Style:</label>
        <select
          value={printStyle}
          onChange={(e) => setPrintStyle(e.target.value)}
          className="border border-gray-400 p-2 rounded"
        >
          <option value="thermal">Thermal Printer (80mm)</option>
          <option value="pdf">A4 Paper</option>
        </select>
      </div>

      {/* Bill Content */}
      <div
        ref={billRef}
        className={`${
          printStyle === "thermal"
            ? "w-[80mm] bg-white p-2 font-mono text-[12px] mx-auto"
            : "w-[210mm] bg-white p-6 font-sans text-[14px]"
        }`}
      >
        {/* Header */}
        <div className="header">
          <div className="restaurant-name text-green-700 font-extrabold text-lg">
            {billData?.created_by?.name || "Unknown Creator"}
          </div>

          <div className="bill-type">PARCEL BILL</div>
          <div className="divider"></div>
        </div>

        {/* Order Info */}
        <div className="mb-3">
          <div>
            <strong>Order ID:</strong> {bill?.parcel_order_id}
          </div>
          <div>
            <strong>Customer:</strong> {user?.name}
          </div>
          <div>
            <strong>Phone:</strong> {customer?.phone}
          </div>
          <div>
            <strong>Date:</strong> {new Date(bill?.created_at).toLocaleString()}
          </div>
        </div>
        <div className="divider"></div>

        {/* Items Table */}

        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-center py-2 px-3 border-b border-gray-300">
                ITEM
              </th>
              <th className="text-center py-2 px-3 border-b border-gray-300">
                QTY
              </th>
              <th className="text-center py-2 px-3 border-b border-gray-300">
                Tax(%)
              </th>
              <th className="text-center py-2 px-3 border-b border-gray-300">
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="text-center py-2 px-3 border-b">
                  {item.product_name}
                </td>
                <td className="text-center py-2 px-3 border-b">
                  {item?.quantity}
                </td>
                <td className="text-center py-2 px-3 border-b">
                  {item?.tax_rate}
                </td>
                <td className="text-center py-2 px-3 border-b">
                  ₹{item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="divider"></div>

        {/* Totals */}
        <div className="totals">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            {/* <span>GST:</span>
            <span>₹{bill.gst.toFixed(2)}</span> */}
            {!isSameState && (
              <div>
                <p>CGST : ₹{(bill.gst / 2).toFixed(2)}</p>
                <p>SGST : ₹{(bill.gst / 2).toFixed(2)}</p>
              </div>
            )}
            {isSameState && (
              <div>
                <p>IGST : ₹{bill.gst.toFixed(2)}</p>
              </div>
            )}
          </div>
          <div className="flex justify-between total-row">
            <span>TOTAL:</span>
            <span>₹{bill.grand_total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="divider"></div>
          <div>Thank you for your order!</div>
          <div>Please visit again</div>
        </div>
      </div>

      {/* Print Button */}
      <div className="print:hidden">
        <button
          onClick={handlePrint}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Print Bill
        </button>
      </div>
    </div>
  );
};

export default ParcelBill;
