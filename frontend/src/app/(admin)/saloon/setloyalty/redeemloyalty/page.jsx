 "use client";
import React, { useState } from "react";
import axios from "axios";

const Page = () => {
  const [redeemPoints, setRedeemPoints] = useState("");
  const [redeemValue, setRedeemValue] = useState("");
  const [maxRedeem, setMaxRedeem] = useState("");
  const [minInvoiceValue, setMinInvoiceValue] = useState("");
  const [loyaltyId, setLoyaltyId] = useState("");

  const handleSubmit = async () => {
    const data = {
      redeem_points: redeemPoints,
      redeem_point_value_ofEach_point: redeemValue,
      max_redeem: maxRedeem,
      min_invcValue_needed_toStartRedemp: minInvoiceValue,
      loyalty_id: loyaltyId ? loyaltyId : null,
    };

    try {
      const response = await axios.post(" http://127.0.0.1:8000/api/redeem-setup", data);
      
      if (response.status === 201) {
        alert("Data saved successfully!");
        console.log("Response:", response.data);
      } else {
        alert("Error saving data.");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full bg-gray-100 flex items-center justify-start p-6">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Redeem Setup
        </h1>

        {/* Redemption Value Section */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <label className="font-medium text-gray-600 w-1/2">Redemption Value</label>
          <input
            type="number"
            className="border rounded-lg p-2 w-full"
            placeholder="Enter loyalty point"
            value={redeemPoints}
            onChange={(e) => setRedeemPoints(e.target.value)}
          />
          <span className="text-gray-500 mx-2">=</span>
          <input
            type="number"
            className="border rounded-lg p-2 w-full"
            placeholder="Value of each loyalty point"
            value={redeemValue}
            onChange={(e) => setRedeemValue(e.target.value)}
          />
        </div>

        {/* Maximum Redeem Percentage Section */}
        <div className="mb-4">
          <label className="block font-medium text-gray-600">
            Maximum redeem % of invoice value
          </label>
          <input
            type="number"
            className="border rounded-lg p-2 w-full mt-1"
            placeholder="Enter max redeem %"
            value={maxRedeem}
            onChange={(e) => setMaxRedeem(e.target.value)}
          />
        </div>

        {/* Minimum Invoice Value Section */}
        <div className="mb-4">
          <label className="block font-medium text-gray-600">
            Minimum invoice value needed to start redemption
          </label>
          <input
            type="number"
            className="border rounded-lg p-2 w-full mt-1"
            placeholder="Enter minimum invoice value"
            value={minInvoiceValue}
            onChange={(e) => setMinInvoiceValue(e.target.value)}
          />
        </div>

        {/* Loyalty ID Section */}
        <div className="mb-4">
          <label className="block font-medium text-gray-600">Loyalty ID</label>
          <input
            type="number"
            className="border rounded-lg p-2 w-full mt-1"
            placeholder="Enter Loyalty ID"
            value={loyaltyId}
            onChange={(e) => setLoyaltyId(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          className="w-1/2 bg-orange-500 text-white font-semibold py-2 rounded-lg mt-6 hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Page;
