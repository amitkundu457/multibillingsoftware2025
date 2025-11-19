"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const BulkSmsSender = () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const fetchCustomerType = async () => {
    const token = getCookie("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(
      "https://apibrize.brizindia.com/api/customerstype",
      { headers }
    );
    console.log(response);

    setCustomerTypeData(response.data.data);
  };

  const fetchCustomerSubType = async () => {
    const token = getCookie("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(
      "https://apibrize.brizindia.com/api/customersubtypes",
      { headers }
    );

    setCustomerSubTypeData(response.data);
  };

  useEffect(() => {
    fetchCustomerType();
    fetchCustomerSubType();
  }, []);
  const [customerTypeData, setCustomerTypeData] = useState([]);
  const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
  const [customerTypeId, setCustomerTypeId] = useState("");
  const [customerSubTypeId, setCustomerSubtypeId] = useState("");

  const [sending, setSending] = useState(false);

  const sendBulkSms = async () => {
    setSending(true);

    try {
      const token = getCookie("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log("heardrs", headers);

      await axios.post(
        "https://apibrize.brizindia.com/api/bulk-sms",
        {
          customerType_id: customerTypeId,
          customerSubType_id: customerSubTypeId,
        },
        { headers }
      );
    } catch (err) {
      console.error(err);
      alert("Error sending SMS");
    }

    setSending(false);
  };

  const filteredSubTypes = customerTypeId
    ? customerSubTypeData.filter(
        (sub) => String(sub.type_id) == String(customerTypeId)
      )
    : customerSubTypeData;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Bulk SMS Sender</h2>

      <div>
        <label className="block font-medium">Customer Type</label>
        <select
          className="border p-2 w-full"
          value={customerTypeId}
          onChange={(e) => setCustomerTypeId(e.target.value)}
        >
          <option value="">All Types</option>
          {customerTypeData.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Customer Sub-Type</label>
        <select
          className="border p-2 w-full"
          value={customerSubTypeId}
          onChange={(e) => setCustomerSubtypeId(e.target.value)}
        >
          <option value="">All Sub-Types</option>
          {filteredSubTypes.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className={`w-full p-3 text-white font-semibold ${
          sending ? "bg-gray-400" : "bg-blue-600"
        } rounded`}
        disabled={sending}
        onClick={sendBulkSms}
      >
        {sending ? "Sending..." : "Send Bulk SMS"}
      </button>
    </div>
  );
};

export default BulkSmsSender;
