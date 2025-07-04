"use client";
import React from "react";

import {getLogo} from "@/app/components/config"
import useSWR from "swr";
const fetcher=async()=>{
const response=await getLogo()
return response.data.logo_url
}

const Receipt = ({ entries }) => {
  const { data: logoUrl, error } = useSWR('logo', fetcher);
  return (
    <div
      id="print-mode"
      className=" w-[720px] mx-auto p-6 border relative border-gray-300 shadow-lg bg-white"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">
          {entries[0]?.account_type || "N/A"}
        </h2>
        <h2 className="text-xl font-bold">RETAILJI JEWELLERY</h2>
        <p className="text-sm">KOLKATA, KOLKATA</p>
      </div>
      <img
        src={logoUrl}
        alt="RetailJi Logo"
        className="mx-auto h-16 absolute top-4"
      />

      <div className="mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Customer Details:</h3>
            <p className="text-sm">
              <strong>Name:</strong>{" "}
              {entries[0]?.accountmasters?.account_name || "N/A"} <br />
              <strong>Phone:</strong>{" "}
              {entries[0]?.accountmasters.phone || "N/A"} <br />
              <strong>City:</strong> {entries[0]?.accountmasters.city || "N/A"}{" "}
              <br />
              <strong>State:</strong>{" "}
              {entries[0]?.accountmasters.state || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Voucher No:</strong> {entries[0]?.rcp_no || "N/A"} <br />
              <strong>Date:</strong>{" "}
              {new Date(entries[0]?.created_at).toLocaleDateString() || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="opacity-10 absolute bottom-4">
        <img
          src={logoUrl}
          className="w-[70rem]"
          alt=""
        />
      </div>
      <table className="w-full border-collapse border border-gray-400 mt-6">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2 text-left">
              Description
            </th>
            <th className="border border-gray-400 px-4 py-2">Ref. No.</th>
            <th className="border border-gray-400 px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-2">
              {entries[0]?.recive_id == 0 ? "Cash" : "Online"}
            </td>
            <td className="border border-gray-400 px-4 py-2">
              {entries[0]?.ref_no}
            </td>
            <td className="border border-gray-400 px-4 py-2 text-right">
              {entries[0]?.amount}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between mt-6">
        <p className="text-lg font-bold">Total Amount: ₹{entries[0]?.amount}</p>
      </div>

      <div className="flex justify-between mt-12">
        <p className="text-sm">Customer Signature</p>
        <p className="text-sm">Authorised Signature</p>
      </div>
    </div>
  );
};

Receipt.displayName = "Receipt";

export default Receipt;
