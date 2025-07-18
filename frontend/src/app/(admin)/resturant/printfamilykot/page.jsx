"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import dynamic from "next/dynamic";

const Page = () => {
  const [kotData, setKotData] = useState(null);
  const kotRef = useRef();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const now = new Date();
  const formattedDateTime = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  useEffect(() => {
    const token = getCookie("access_token");

    fetch(`http://127.0.0.1:8000/api/get-family-kot/${bookingId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setKotData(data))
      .catch((err) => console.error("Error fetching KOT:", err));
  }, [bookingId]);

  const handlePrint = () => {
    const printContent = kotRef.current;
    if (!printContent) {
      alert("KOT content not loaded yet!");
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
        width: 280px;
        margin: 0 auto;
        padding: 10px;
        font-size: 12px;
        line-height: 1.2;
      }
      .printable {
        width: 280px;
        background: white;
        padding: 10px;
      }
      h2 {
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 8px;
      }
      hr {
        border-top: 1px dashed #000;
        margin: 5px 0;
      }
      .flex {
        display: flex;
      }
      .justify-between {
        justify-content: space-between;
      }
      .font-bold {
        font-weight: bold;
      }
      .text-center {
        text-align: center;
      }
      .mt-2 {
        margin-top: 8px;
      }
      .mt-4 {
        margin-top: 16px;
      }
      .my-2 {
        margin-top: 8px;
        margin-bottom: 8px;
      }
    `;

    iframe.contentDocument.write(`
      <html>
        <head>
          <title>KOT - Booking #${bookingId}</title>
          <style>
            ${thermalStyles}
          </style>
        </head>
        <body>
          <div class="printable">
            ${contentClone.innerHTML}
          </div>
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

  if (!kotData) return <p>Loading...</p>;

  const subtotal = kotData.items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.product_price),
    0
  );
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div
        ref={kotRef}
        className="printable font-mono bg-white text-black p-4 w-[280px] text-sm rounded shadow-md"
      >
        <h2 className="text-center font-bold text-lg mb-1">
          {kotData.user.name}
        </h2>
        <p className="text-center font-bold text-xs mb-2">
          {formattedDateTime}
        </p>

        <p className="font-bold">Booking ID: #{bookingId}</p>
        <p className="font-bold">Customer: {kotData.customer_name}</p>
        <p className="font-bold">Tables: {kotData.tables.join(", ")}</p>

        <div className="mt-2 border-t border-b border-dashed py-2 text-sm">
          <div className="flex justify-between font-bold mb-1">
            <span className="w-3/4">Item</span>
            <span className="w-1/4 text-right">Qty</span>
          </div>

          {kotData.items.map((item) => (
            <div key={item.item_id} className="flex justify-between font-bold">
              <span className="w-3/4">{item.product_name}</span>
              <span className="w-1/4 text-right">{item.quantity}</span>
            </div>
          ))}
        </div>

        <hr className="my-2 border-t border-dashed" />

        <p className="text-center mt-4 font-bold">Thank you!</p>

        <div className="mt-4 flex justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold"
          >
            Print Slip
          </button>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
