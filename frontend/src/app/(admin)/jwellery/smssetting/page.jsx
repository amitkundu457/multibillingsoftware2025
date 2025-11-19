"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// Utility to read cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
};

const categories = [
  "Birthday message",
  "anniversary message",
  "BBLC",
  "jwellery billing",
  "Registered Customer",
  "follow-Up_Reminder",
  "BULK_SMS",
  "Advanced Birthday",
  "Advanced Anniversary",
];

const makeEmptyMessages = () =>
  categories.reduce((acc, key) => {
    acc[key] = {
      enabled: true,
      text: "",
      id: null,
      templateId: "",
      saving: false,
      saved: false,
    };
    return acc;
  }, {});

export default function MessageSettingsPage() {
  const [credentials, setCredentials] = useState([]);
  const [selectedCredentialId, setSelectedCredentialId] = useState(null);
  const [messages, setMessages] = useState(makeEmptyMessages);
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [globalSaving, setGlobalSaving] = useState(false);

  // Fetch credentials on mount
  useEffect(() => {
    fetchCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoadingCredentials(true);
      const token = getCookie("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(
        "https://apibrize.brizindia.com/api/sms-credentials",
        {
          headers,
        }
      );
      setCredentials(res.data || []);
      if (!selectedCredentialId && res.data?.length > 0) {
        setSelectedCredentialId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch credentials:", err);
    } finally {
      setLoadingCredentials(false);
    }
  };

  // Fetch messages whenever selected credential changes
  useEffect(() => {
    if (selectedCredentialId) {
      fetchMessages(selectedCredentialId);
    } else {
      setMessages(makeEmptyMessages());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCredentialId]);

  const fetchMessages = async (credentialId) => {
    try {
      setLoadingMessages(true);
      const token = getCookie("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(
        "https://apibrize.brizindia.com/api/sms-settings",
        {
          headers,
        }
      );

      const fetched = res.data || [];

      const mapped = categories.reduce((acc, key) => {
        // try to match status with case-insensitive check and check credential id
        const match = fetched.find((item) => {
          const statusMatch =
            String(item.status).toLowerCase() === String(key).toLowerCase();
          const credentialMatch =
            String(item.sms_credential_id) === String(credentialId);
          return statusMatch && credentialMatch;
        });

        acc[key] = {
          text: match?.description || "",
          id: match?.id || null,
          enabled: true,
          templateId: match?.template_id || "",
          saving: false,
          saved: false,
        };
        return acc;
      }, {});

      setMessages(mapped);
    } catch (err) {
      console.error("Failed to fetch SMS templates:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Handlers for local edits (no auto-save)
  const handleTextChange = (key, value) => {
    setMessages((prev) => ({
      ...prev,
      [key]: { ...prev[key], text: value, saved: false },
    }));
  };

  const handleTemplateChange = (key, value) => {
    setMessages((prev) => ({
      ...prev,
      [key]: { ...prev[key], templateId: value, saved: false },
    }));
  };

  // Save a single message/template (POST if new, PUT if exists)
  const saveMessage = async (key, currentDataParam) => {
    if (!selectedCredentialId) {
      alert("Please select an SMS Provider first.");
      return;
    }

    // use provided snapshot data (used by Save All) or current state
    const currentData = currentDataParam ?? messages[key];

    // mark saving
    setMessages((prev) => ({
      ...prev,
      [key]: { ...prev[key], saving: true, saved: false },
    }));

    try {
      const token = getCookie("access_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        description: currentData.text,
        status: key,
        sms_credential_id: selectedCredentialId,
        template_id: currentData.templateId,
      };

      let res;
      if (currentData.id) {
        // Update existing
        res = await axios.put(
          `https://apibrize.brizindia.com/api/sms-settings/${currentData.id}`,
          payload,
          { headers }
        );
      } else {
        // Create new
        res = await axios.post(
          "https://apibrize.brizindia.com/api/sms-settings",
          payload,
          { headers }
        );
      }

      // extract id (API shape may vary)
      const newId =
        res?.data?.data?.id ?? res?.data?.id ?? currentData.id ?? null;

      setMessages((prev) => ({
        ...prev,
        [key]: { ...prev[key], id: newId, saving: false, saved: true },
      }));

      // clear "saved" badge after 3s
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [key]: { ...prev[key], saved: false },
        }));
      }, 3000);

      return res;
    } catch (err) {
      console.error("Error saving template:", err);
      setMessages((prev) => ({
        ...prev,
        [key]: { ...prev[key], saving: false },
      }));
      throw err;
    }
  };

  // Save all visible templates (uses snapshot to avoid concurrency read issues)
  const saveAll = async () => {
    if (!selectedCredentialId) {
      alert("Please select an SMS Provider first.");
      return;
    }

    setGlobalSaving(true);
    const snapshot = { ...messages };

    try {
      const promises = categories.map((key) => saveMessage(key, snapshot[key]));
      await Promise.all(promises);
    } catch (err) {
      console.error("Some saves failed:", err);
    } finally {
      setGlobalSaving(false);
    }
  };

  return (
    <div className="max-w-6xl p-4 mx-auto mt-10 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">SMS Template Settings</h2>
        {/* <div className="flex items-center gap-2">
           <select
             value={selectedCredentialId ?? ""}
             onChange={(e) => setSelectedCredentialId(e.target.value ? Number(e.target.value) : null)}
             className="p-2 text-sm border rounded"
             disabled={loadingCredentials}
           >
             <option value="">Select SMS Provider</option>
             {credentials.map((c) => (
               <option key={c.id} value={c.id}>
                 {c.business_name || c.name || `Provider #${c.id}`}
               </option>
             ))}
           </select>
 
           <button
             onClick={saveAll}
             disabled={globalSaving}
             className={`px-4 py-2 rounded text-white font-medium ${globalSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
           >
             {globalSaving ? "Saving..." : "Save All"}
           </button>
         </div> */}
      </div>

      {loadingMessages ? (
        <div>Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((key) => (
            <div key={key} className="p-3 border rounded shadow-sm">
              <label className="block mb-1 text-sm font-medium">{key}</label>

              <textarea
                rows={3}
                className="w-full p-2 mb-2 text-sm border border-gray-300 rounded"
                value={messages[key]?.text}
                onChange={(e) => handleTextChange(key, e.target.value)}
                placeholder={`Enter message for ${key}`}
              />

              <input
                type="text"
                className="w-full p-2 mb-2 text-sm border border-gray-300 rounded"
                placeholder="Enter Template ID"
                value={messages[key]?.templateId}
                onChange={(e) => handleTemplateChange(key, e.target.value)}
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => saveMessage(key)}
                  disabled={messages[key]?.saving}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    messages[key]?.saving
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {messages[key]?.saving ? "Saving..." : "Save"}
                </button>

                <div className="text-sm">
                  {messages[key]?.saved && (
                    <span className="text-green-600">Saved ✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
