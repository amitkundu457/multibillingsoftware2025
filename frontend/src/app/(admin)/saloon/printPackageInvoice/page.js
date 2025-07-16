"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation"; // Get query parameters

const SalonInvoice = () => {
  const [data, setData] = useState([]);
  const [invoice, setInvoice] = useState({});
  const [clientData, setClientData] = useState({});
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get `id` from URL query params

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await axios.get(
        `https://api.equi.co.in/api/printpackage-bill/${id}`
      );
      const invoiceResponse = await axios.get(
        `https://api.equi.co.in/api/generate-package-invoice/22`
      );

      setData(response.data);
      setInvoice(invoiceResponse.data);
      console.log(data);
    };

    const getClientData = async () => {
      const token = getCookie("access_token");
      if (!token) {
        notyf.error("Authentication token not found!");
        return;
      }

      const clientResponse = await axios.get(
        `https://api.equi.co.in/api/auth/agme`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClientData(clientResponse.data);
    };

    fetchOrderDetails();
    getClientData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
     // ref={printRef}
      className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-lg border border-gray-300 print:w-full print:shadow-none print:border-none print:p-4"
    >
      {/* Salon Details */}
      <div className="text-center mb-6 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {clientData?.user?.information?.business_name || "Salon Name"}
        </h1>
        <p className="text-sm text-gray-600">
          {clientData?.user?.information?.address_1},
          {clientData?.user?.information?.city},
          {clientData?.user?.information?.state} -
          {clientData?.user?.information?.pincode},
          {clientData?.user?.information?.country} | Ph: +91
          {clientData?.user?.information?.mobile_number}
        </p>
        <p className="text-sm text-gray-600">GST No: 27A234A1Z5</p>
        <p className="text-sm text-gray-600">{clientData?.user?.email}</p>
      </div>

      {/* Invoice Details */}
      <div className="mb-6">
        <p className="text-sm text-gray-700">
          <strong>Invoice No:</strong> {invoice?.invoice_number || "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Customer Details */}
      {data?.users && (
        <div className="mb-6 bg-gray-100 p-6 rounded-lg" key={data.id}>
          <h2 className="text-lg font-semibold text-gray-800">Customer Details</h2>
          <p className="text-sm"><strong>Name:</strong> {data.users.name}</p>
          <p className="text-sm"><strong>Contact:</strong> +91 {data.users.customers[0]?.phone}</p>
          <p className="text-sm"><strong>Address:</strong> {data.users.customers[0]?.address}</p>
          <p className="text-sm"><strong>Pin Code:</strong> {data.users.customers[0]?.pincode}</p>
        </div>
      )}

      {/* Package Details */}
      {data?.package && (
        <div className="mb-6 border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800" key={data.id}>
            Package Details
          </h2>
          <p className="text-sm">
            <strong>Package Number : </strong> {data.package.package_no}
          </p>
          <p className="text-sm">
            <strong>Total Package Amount : </strong>
            {data.package.package_amount}
          </p>
          <p className="text-sm">
            <strong>Remaining Balance : </strong>
            {data.package.remaining_amount}
          </p>
        </div>
      )}

      {/* Service Usage Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Service Used</h2>
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">Service</th>
              <th className="border px-3 py-2">PRICE</th>
              <th className="border px-3 py-2">STYLIST</th>
              <th className="border px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.service_details?.map((details) => (
              <tr key={details.id}>
                <td className="border px-3 py-2">{details.service_name}</td>
                <td className="border px-3 py-2">{details.price}</td>
                <td className="border px-3 py-2">{details.stylist_name}</td>
                <td className="border px-3 py-2">{new Date(data.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Payment Summary</h2>
        <p className="text-sm"><strong>Subtotal:</strong> {data?.price ?? "N/A"}</p>
        <p className="text-sm"><strong>Payment Method:</strong> PACKAGE</p>
      </div>

      {/* Signature & Print Button */}
      <div className="flex justify-between mt-8">
        <p className="text-sm"><strong>Customer Signature: ___________</strong></p>
        <p className="text-sm"><strong>Salon Representative: ___________</strong></p>
      </div>

      {/* <button
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 print:hidden"
        onClick={handlePrint}
      >
        Print Invoice
      </button> */}
    </div>
  );
};

export default SalonInvoice;
