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
  const [logoUrl, setLogoUrl] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  useEffect(() => {
    const fetchLogoUrl = async () => {
      const token = getToken();
      const response = await axios.get(
        "https://apibrize.brizindia.com/api/masterlogobill",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLogoUrl(response.data.logo);
    };
    fetchLogoUrl();
  }, []);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getMe();
        if (response && response.data) {
          setCompanyName(response?.data?.user_information);
          console.log("Company Info:", response.data);
          setSellerState(
            response?.data?.user?.information?.state?.trim().toLowerCase() || ""
          );
        } else {
          setCompanyName("");
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };
    fetchCompanyDetails();
  }, []);

  // Customer details
  useEffect(() => {
    const token = getCookie("access_token");
    if (!cutomerid) return;

    axios
      .get(`https://apibrize.brizindia.com/api/customers/get/${cutomerid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setbuyState(response?.data?.data?.state?.trim().toLowerCase() || "");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [cutomerid]);

  // Bill details
  useEffect(() => {
    const token = getCookie("access_token");
    if (booking_id) {
      fetch(
        `https://apibrize.brizindia.com/api/family-booking/${booking_id}/generate-bill`,
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
          if (!res.ok && data.bill_already_generated) {
            alert(
              `⚠️ Bill has already been generated for booking ID ${booking_id}.`
            );
          } else {
            setBill(data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [booking_id]);

  // GST condition
  const isSameState = buyerState && sellerState && buyerState === sellerState;

  const handlePrint = () => {
    const printContent = billRef.current;
    if (!printContent) {
      alert("Bill content not loaded yet!");
      return;
    }

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
      .logo-container {
        text-align: center;
        margin-bottom: 6px;
      }
      .logo-container img {
        max-width: 60px;
        height: auto;
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
      .logo-container {
        text-align: left;
        margin-bottom: 10px;
      }
      .logo-container img {
        max-width: 120px;
        height: auto;
      }
    `;

    const styles = printStyle === "thermal" ? thermalStyles : a4Styles;

    iframe.contentDocument.write(`
      <html>
        <head>
          <title>Family Bill - Booking #${booking_id}</title>
          <style>${styles}</style>
        </head>
        <body>
          ${contentClone.innerHTML}
          <script>
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 100);
            }, 200);
          </script>
        </body>
      </html>
    `);
    iframe.contentDocument.close();
  };

  if (!booking_id) return <p>Please provide booking_id.</p>;
  if (loading) return <p>Loading bill for booking #{booking_id}...</p>;
  if (!bill) {
    return (
      <>
        <p>No bill found for booking #{booking_id}.</p>;
        <button
          onClick={window.location.reload}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 mt-6 bg-gray-100">
      {/* Print Type Select */}
      <div className="print:hidden">
        <label className="mr-2 font-medium">Print Style:</label>
        <select
          value={printStyle}
          onChange={(e) => setPrintStyle(e.target.value)}
          className="p-2 border border-gray-400 rounded"
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
        {/* Logo Section */}
        {logoUrl && (
          <div
            className={`logo-container ${
              printStyle === "thermal" ? "text-center" : "text-left"
            }`}
          >
            <img
              src={logoUrl}
              alt="Logo"
              className={`${
                printStyle === "thermal"
                  ? "mx-auto w-[60px] h-auto"
                  : "w-[120px] h-auto"
              }`}
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-2 text-center">
          <h1 className="text-lg font-bold">
            🌟 {bill?.created_by?.name || "Unknown Creator"} 🌟
          </h1>
          <p>
            {/* {bill?.client_address?.address_1 ||
              bill.client_address?.address_2 ||
              "NA"} */}
            {companyName?.address_1 || "-"}
          </p>
          {/* <p>Phone: {bill?.client_address?.mobile_number ?? "N/A"}</p> */}
          <p>Phone: {companyName?.mobile_number ?? "-"}</p>
          <p className="text-sm text-gray-700">
            {/* {bill?.client_address?.email || "No Email Provided"} */}
            {companyName?.email || "No Email Provided"}
          </p>
          <div>
            {/* <h1 className="font-extrabold tracking-wide text-gray-700 uppercase">
              GST IN: {bill?.client_address?.gst || {companyName?.gst}}
            </h1> */}
            <h1 className="font-extrabold tracking-wide text-gray-700 uppercase">
              GST NO: {companyName?.gst || "Not Provided"}
            </h1>
          </div>
          <p className="mt-1">----------------------------</p>

          <h2 className="text-base font-semibold"> Bill</h2>
          <p>Invoice No.: #{bill?.kot_bill_id}</p>
          <p>Booking Id: #{bill.family_booking_id}</p>
          <p className="font-bold text-yellow-600">
            Customer Name: {bill.customer_name}
          </p>
        </div>

        {/* Items */}
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
                className="border-b border-gray-400 border-dotted"
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
        <div className="pt-2 mt-2 space-y-1 text-right border-t border-black border-dotted">
          {!isSameState && (
            <div>
              <p>CGST : ₹{(bill.gst / 2).toFixed(2)}</p>
              <p>SGST : ₹{(bill.gst / 2).toFixed(2)}</p>
            </div>
          )}

          {isSameState && <p>IGST : ₹{bill.gst.toFixed(2)}</p>}
          {bill.bookingrow && (
            <p className="text-base font-semibold text-red-600">
              Redeem Amount:- ₹{bill.bookingrow.new_loyalty_cashback || 0}
            </p>
          )}
          <p className="text-base font-bold">
            Grand Total: ₹
            {bill.grand_total - (bill.bookingrow?.new_loyalty_cashback || 0)}
          </p>
        </div>

        {/* Payments */}
        {bill?.payments?.length > 0 && (
          <div className="w-full pt-2 mt-2 text-sm border-t border-black border-dotted">
            <p className="mb-1 font-semibold text-center underline">
              Payment Details
            </p>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Method</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.payments.map((payment, index) => (
                  <tr key={index}>
                    <td className="text-left">{payment.payment_method}</td>
                    <td className="text-right">
                      ₹{parseFloat(payment.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td className="text-left">Total Paid</td>
                  <td className="text-right">
                    ₹
                    {bill.payments
                      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 text-xs text-center">
          <p>----------------------------</p>
          <p>Thank you for dining with us!</p>
          <p>Visit Again 🙏</p>
          <p>----------------------------</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-4 text-center print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700"
        >
          Print Bill
        </button>
      </div>
    </div>
  );
}
