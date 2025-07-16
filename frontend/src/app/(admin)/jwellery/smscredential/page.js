 'use client';
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

  const [credentialId, setCredentialId] = useState(null); // Holds the ID if a credential exists

  const fetchCredentials = async () => {
    try {
      const res = await axios.get("https://api.equi.co.in/api/sms-credentials");
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

    if (credentialId) {
      await axios.put(`https://api.equi.co.in/api/sms-credentials/${credentialId}`, form);
    } else {
      const res = await axios.post("https://api.equi.co.in/api/sms-credentials", form);
      setCredentialId(res.data.id); // In case it's new
    }

    fetchCredentials();
  };

  const handleDelete = async () => {
    if (credentialId && confirm("Are you sure to delete this SMS credential?")) {
      await axios.delete(`https://api.equi.co.in/api/sms-credentials/${credentialId}`);
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
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
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
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              placeholder={label}
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full mt-1 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {credentialId ? "Update Credential" : "Add Credential"}
        </button>

        {credentialId && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full mt-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Delete Credential
          </button>
        )}
      </form>
    </div>
  );
}
