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
 
  useEffect(() => {
    fetch(`https://api.equi.co.in/api/get-family-kot/${bookingId}`)
      .then((res) => res.json())
      .then((data) => setKotData(data));
  }, [bookingId]);

  const handlePrint = () => {
    const printContent = kotRef.current;
    if (!printContent) {
      alert('KOT content not loaded yet!');
      return;
    }

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const contentClone = printContent.cloneNode(true);
    const printHiddenElements = contentClone.querySelectorAll('.print\\:hidden');
    printHiddenElements.forEach(el => el.remove());

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
        <h2 className="text-center font-bold text-lg mb-2">KOT SLIP</h2>
        <p>Booking ID: #{bookingId}</p>
        <p>Customer: {kotData.customer_name}</p>
        <p>Tables: {kotData.tables.join(", ")}</p>

        <div className="mt-2">
          {kotData.items.map((item) => (
            <div key={item.item_id} className="flex justify-between">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>
                ₹{(item.quantity * parseFloat(item.product_price)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <hr className="my-2 border-t border-dashed" />
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (5%):</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <p className="text-center mt-4">Thank you!</p>

        <div className="mt-4 flex justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Print Slip
          </button>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });