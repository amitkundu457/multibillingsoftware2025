"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SmsCredentialForm() {
  const [form, setForm] = useState({
    business_name: "",
    sms_username: "",
    sms_password: "",
    sms_sender: "",
    sms_entity_id: "",
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const token = getCookie("access_token");
  const [credentialId, setCredentialId] = useState(null); // Holds the ID if a credential exists

  const fetchCredentials = async () => {
    const token = getCookie("access_token");
    try {
      const res = await axios.get(
        " https://apibrize.brizindia.com/api/sms-credentials",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const existing = res.data[0]; // Since only one record is allowed
      if (existing) {
        setForm({
          business_name: existing.business_name,
          sms_username: existing.sms_username,
          sms_password: existing.sms_password,
          sms_sender: existing.sms_sender,
          sms_entity_id: existing.sms_entity_id,
        });
        setCredentialId(existing.id); // Set ID for update
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`, // 👈 Add your token here
      },
    };

    if (credentialId) {
      await axios.put(
        ` https://apibrize.brizindia.com/api/sms-credentials/${credentialId}`,
        form,
        headers
      );
    } else {
      const res = await axios.post(
        " https://apibrize.brizindia.com/api/sms-credentials",
        form,
        headers
      );
      setCredentialId(res.data.id); // In case it's new
    }

    fetchCredentials();
  };

  const handleDelete = async () => {
    if (
      credentialId &&
      confirm("Are you sure to delete this SMS credential?")
    ) {
      await axios.delete(
        ` https://apibrize.brizindia.com/api/sms-credentials/${credentialId}`
      );
      setForm({
        business_name: "",
        sms_username: "",
        sms_password: "",
        sms_sender: "",
        sms_entity_id: "",
      });
      setCredentialId(null);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="mb-6 text-2xl font-semibold text-center text-blue-600">
        SMS Credential
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "business_name", label: "Business Name" },
          { name: "sms_username", label: "SMS Username" },
          { name: "sms_password", label: "SMS Password" },
          { name: "sms_sender", label: "SMS Sender ID" },
          { name: "sms_entity_id", label: "SMS Entity ID" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type="text"
              placeholder={label}
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {credentialId ? "Update Credential" : "Add Credential"}
        </button>

        {credentialId && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full py-2 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Delete Credential
          </button>
        )}
      </form>
    </div>
  );
}
