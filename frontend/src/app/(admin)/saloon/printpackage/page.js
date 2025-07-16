


"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const PackageReceipt = () => {
  const [clientData, setClientData] = useState({});
  const [packageData, setPackageData] = useState({});
  const [itemsList, setItemsList] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const handlePrint = () => {
    const printContents = document.getElementById("print-area").innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            @media print {
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
                  Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
              }
              th {
                background-color: #f3f4f6; /* Tailwind gray-100 */
                text-transform: uppercase;
                font-size: 12px;
              }
              .text-center {
                text-align: center;
              }
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.equi.co.in/api/printpackage/${id}`
        );
        setItemsList(response?.data?.items);
        setCustomerData(response?.data?.customer_info);
        setPackageData(response?.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    const getClientData = async () => {
      try {
        const token = getCookie("access_token");
        if (!token) {
          alert("Authentication token not found!");
          return;
        }

        const clientResponse = await axios.get(
          `https://api.equi.co.in/api/auth/agme`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClientData(clientResponse.data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchPackageDetails();
    getClientData();
  }, [id]);


  return (
    <>
      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:max-w-full {
            max-width: 100% !important;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }

          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>

      {/* Receipt content to print */}
      <div
        id="print-area"
        className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-300 print:max-w-full print:shadow-none print:border-none"
      >
        {/* Salon Info */}
        <div className="text-center mb-6 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {clientData?.user?.information?.business_name || "Salon Name"}
          </h1>
          <p className="text-sm text-gray-600">
            {clientData?.user?.information?.address_1},{" "}
            {clientData?.user?.information?.city},{" "}
            {clientData?.user?.information?.state} -{" "}
            {clientData?.user?.information?.pincode},{" "}
            {clientData?.user?.information?.country} | Ph: +91{" "}
            {clientData?.user?.information?.mobile_number}
          </p>
          <p className="text-sm text-gray-600">GST No: 27A234A1Z5</p>
          <p className="text-sm text-gray-600">{clientData?.user?.email}</p>
        </div>

        {/* Customer Details */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm border-b pb-2 mb-2">Customer Details</h3>
          <p>
            <span className="text-sm">Name:</span> {customerData?.name || "N/A"}
          </p>
          <p>
            <span className="text-sm">Phone:</span>{" "}
            {packageData?.customer?.phone || "N/A"}
          </p>
          <p>
            <span className="text-sm">Email:</span> {customerData?.email || "N/A"}
          </p>
        </div>

        {/* Package Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Package ID</th>
                <th className="px-4 py-2 border">Service Name</th>
                <th className="px-4 py-2 border">Total Quantity</th>
                <th className="px-4 py-2 border">Type</th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2 border">{item.id}</td>
                  <td className="px-4 py-2 border">{item.package_name_id}</td>
                  <td className="px-4 py-2 border">{item.service_name}</td>
                  <td className="px-4 py-2 border">{item.total_quantity}</td>
                  <td className="px-4 py-2 border">{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Package Details */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
          <h3 className="text-sm border-b pb-2 mb-2">Package Details</h3>
          <p>
            <span className="text-sm">Package Name:</span>{" "}
            {packageData?.package?.name || "N/A"}
          </p>
          <p>
            <span className="text-sm">Package No:</span>{" "}
            {packageData?.assigned_package?.package_no || "N/A"}
          </p>
          <p>
            <span className="text-sm">Receipt No:</span>{" "}
            {packageData?.assigned_package?.receipt_no || "N/A"}
          </p>
          <p>
            <span className="text-sm">Service Amount:</span> ₹
            {packageData?.assigned_package?.service_amount || "0.00"}
          </p>
          <p>
            <span className="text-sm">Package Amount:</span> ₹
            {packageData?.assigned_package?.package_amount || "0.00"}
          </p>
          <p>
            <span className="text-sm">Paid Amount:</span> ₹
            {packageData?.assigned_package?.paid_amount || "0.00"}
          </p>
          <p>
            <span className="text-sm">Package Expiry:</span>{" "}
            {packageData?.assigned_package?.package_expiry || "N/A"}
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-6 text-center print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:bg-blue-700"
        >
          Print Receipt
        </button>
      </div>
    </>
  );
};

export default PackageReceipt;
