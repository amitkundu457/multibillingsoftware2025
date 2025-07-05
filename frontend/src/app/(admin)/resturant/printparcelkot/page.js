 'use client';
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

const ParcelKOT = () => {
  const [kotData, setKotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const kotRef = useRef();
  const searchParams = useSearchParams();
  const parcel_order_id = searchParams.get("id");

  useEffect(() => {
    const fetchKOT = async () => {
      try {
        const response = await fetch(`https://api.equi.co.in/api/parcel-kot/${parcel_order_id}`);
        const data = await response.json();

        if (response.ok) {
          setKotData(data);
        } else {
          console.error("Error fetching KOT:", data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (parcel_order_id) fetchKOT();
  }, [parcel_order_id]);

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
        width: 260px;
        margin: 0 auto;
        padding: 12px;
        font-size: 12px;
        line-height: 1.2;
      }
      .printable {
        width: 260px;
        background: white;
        padding: 12px;
      }
      .header {
        text-align: center;
        margin-bottom: 8px;
      }
      .token-circle {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #16a34a;
        color: white;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 4px auto;
      }
      .kot-title {
        font-size: 12px;
        font-weight: bold;
      }
      .order-info {
        font-size: 11px;
        line-height: 1.3;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
      }
      th {
        text-align: left;
        padding-bottom: 4px;
        border-bottom: 1px dashed #000;
      }
      td {
        padding: 3px 0;
        border-bottom: 1px dashed #d1d5db;
      }
      .text-right {
        text-align: right;
      }
      .footer {
        text-align: center;
        font-size: 10px;
        margin-top: 8px;
      }
    `;

    iframe.contentDocument.write(`
      <html>
        <head>
          <title>KOT - Order #${kotData?.order_id || ''}</title>
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

  if (loading) return <div className="text-center mt-4 text-sm">Loading KOT...</div>;
  if (!kotData) return <div className="text-center mt-4 text-sm">No KOT found for Parcel Order ID: {parcel_order_id}</div>;

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-6 min-h-screen bg-gray-100 p-4">
      {/* KOT Content - EXACTLY matches your original design */}
      <div
        ref={kotRef}
        className="w-[260px] font-mono text-sm text-black bg-white p-3 shadow-md border border-gray-300"
      >
        {/* Header */}
        <div className="text-center mb-2">
          <div className="text-[14px] font-bold uppercase">My Restaurant</div>
          <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center mx-auto mt-1 mb-1">
            {kotData.token}
          </div>
          <div className="text-[12px] font-bold">Kitchen Order Ticket</div>
        </div>

        {/* Order Info */}
        <div className="text-[12px] leading-tight space-y-1">
          <p><span className="font-semibold">Order ID:</span> {kotData.order_id}</p>
          <p><span className="font-semibold">Customer:</span> {kotData.user.name}</p>
          <p><span className="font-semibold">Date:</span> {kotData.date}</p>
        </div>

        {/* Items */}
        <div className="border-t border-dashed border-black mt-2 pt-2">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left pb-1">Item</th>
                <th className="text-right pb-1">Qty</th>
              </tr>
            </thead>
            <tbody>
              {kotData.items.map((item, idx) => (
                <tr key={idx} className="border-b border-dashed border-black">
                  <td className="py-1">{item.product_name}</td>
                  <td className="py-1 text-right">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] mt-3">Thank you! Please prepare promptly.</p>
      </div>

      {/* Print Button */}
      <div className="print:hidden">
        <button
          onClick={handlePrint}
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
        >
          Print KOT
        </button>
      </div>
    </div>
  );
};

export default ParcelKOT;