"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { getMe } from "../../../components/config";
export default function PrintFamilyBillPage() {
  const searchParams = useSearchParams();
  const booking_id = searchParams.get("id");
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printStyle, setPrintStyle] = useState("thermal");
  const [cutomerid, setcutomerid] = useState(null);
  const billRef = useRef();
  const [companyName, setCompanyName] = useState("");
  const [buyerState, setbuyState] = useState("");
  const [sellerState, setSellerState] = useState("");
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

console.log("buyer",buyerState);
console.log("seller",sellerState);
  //restunat deatils
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

  //customer details here
  useEffect(() => {
    const token = getCookie("access_token");
    if (!cutomerid) return;

    axios
      .get(`http://127.0.0.1:8000/api/customers/get/${cutomerid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("customer details", response);
        setbuyState(response?.data?.data?.state?.trim().toLowerCase() || "");        // setCustomer(response.data.data);
      })
      .catch((err) => {
        console.error(err);
        // setError("Failed to fetch customer details");
      });
  }, [cutomerid]);

  useEffect(() => {
    const token = getCookie("access_token");

    if (booking_id) {
      const res = fetch(
        `http://127.0.0.1:8000/api/family-booking/${booking_id}/generate-bill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (res) => {
          const data = await res.json();
          setcutomerid(data?.customer_id);
          console.log("printkot bill", data);
          setcutomerid(data?.customer_id);
          if (!res.ok && data.bill_already_generated) {
            alert(
              `⚠️ Bill has already been generated for booking ID ${booking_id}.`
            );
          } else {
            setBill(data);
          }
          setBill(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [booking_id]);



  //gst condtion
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
      .total-row { 
        font-weight: bold; 
        border-top: 2px solid #000;
      }
    `;

    const styles = printStyle === "thermal" ? thermalStyles : a4Styles;

    iframe.contentDocument.write(`
      <html>
        <head>
          <title>Family Bill - Booking #${booking_id}</title>
          <style>
            ${styles}
          </style>
        </head>
        <body>
          ${contentClone.innerHTML}
          <script>
            setTimeout(() => {
              window.print();
              setTimeout(() => {
                window.close();
              }, 100);
            }, 200);
          </script>
        </body>
      </html>
    `);
    iframe.contentDocument.close();
  };

  if (!booking_id) return <p>Please provide booking_id.</p>;
  if (loading) return <p>Loading bill for booking #{booking_id}...</p>;
  if (!bill) return <p>No bill found for booking #{booking_id}.</p>;

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
        <div className="text-center mb-2">
          <h1 className="text-lg font-bold">
            🌟 {bill?.created_by?.name || "Unknown Creator"} 🌟
          </h1>
          <p>123 Main Street, City</p>
          <p>Phone: +91-9876543210</p>
          <p className="mt-1">----------------------------</p>

          <h2 className="text-base font-semibold">Family Bill</h2>
          <p>Invoice No.: #{bill?.kot_bill_id}</p>
          <p>Booking Id: #{bill.family_booking_id}</p>
          <p className="text-yellow-600 font-bold">
            Customer Name: {bill.customer_name}
          </p>

          {/* Address Section */}
          {bill.user_info && (
            <div className="mt-1 text-left text-xs leading-tight inline-block">
              <p>Phone No.: {bill.user_info[0]?.phone || "-"}</p>
              <p>
                Address: {bill.user_info[0]?.address || "-"},{" "}
                {bill.user_info[0]?.state || "-"},
                {bill.user_info[0]?.pincode || "-"}
              </p>
            </div>
          )}

          <p className="mt-1">Tables: {bill.tables.join(", ")}</p>
          <p>----------------------------</p>
        </div>

        {/* Bill Items */}
        <table className="w-full mb-2">
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Tax(%)</th>
              <th className="text-right">Amt</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-dotted border-gray-400"
              >
                <td className="text-left">{item.product_name}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">{item?.tax_rate}%</td>
                <td className="text-right">₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-right space-y-1 mt-2 border-t border-dotted border-black pt-2">
          {/* <p>Subtotal: ₹{bill.subtotal.toFixed(2)}</p>
          <p>CGST (9%): ₹{(bill.gst / 2).toFixed(2)}</p>
          <p>SGST (9%): ₹{(bill.gst / 2).toFixed(2)}</p> */}
          {
            !isSameState &&(
              <div>
                 <p>CGST : ₹{(bill.gst / 2).toFixed(2)}</p>
                 <p>SGST : ₹{(bill.gst / 2).toFixed(2)}</p>
              </div>
             
            )
          }
          {
            isSameState &&(
              <div>
                 <p>IGST : ₹{(bill.gst).toFixed(2)}</p>
               
              </div>
             
            )
          }
          <p className="font-bold text-base">
            Grand Total: ₹{bill.grand_total.toFixed(2)}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs">
          <p>----------------------------</p>
          <p>Thank you for dining with us!</p>
          <p>Visit Again 🙏</p>
          <p>----------------------------</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="text-center mt-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Print Bill
        </button>
      </div>
    </div>
  );
}
