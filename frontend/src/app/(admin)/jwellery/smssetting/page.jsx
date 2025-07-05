 "use client";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

// Utility to read cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
};

export default function MessageSettingsPage() {
  const categories = [
    "Today Birthday",
    "Anniversary",
    "BBLC",
    "Festival",
    "Promotion",
    "Registered Customer",
  ];

  const [credentials, setCredentials] = useState([]); // List of all shops
  const [sms_Credential_id, setShopId] = useState(null); // Selected shop ID
  const [messages, setMessages] = useState(
    categories.reduce((acc, key) => {
      acc[key] = { enabled: true, text: "", id: null, templateId: "" };
      return acc;
    }, {})
  );

  // ⬇️ Fetch credentials and messages on load or when shopId changes
  useEffect(() => {
    const token = getCookie("access_token");

    const fetchCredentials = async () => {
      try {
        const res = await axios.get("https://api.equi.co.in/api/sms-credentials");
        setCredentials(res.data);
        if (!sms_Credential_id && res.data.length > 0) {
          setShopId(res.data[0].id); // default select first shop
        }
      } catch (err) {
        console.error("Failed to fetch credentials:", err);
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await axios.get("https://api.equi.co.in/api/sms-settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetched = res.data;

        const mapped = categories.reduce((acc, key) => {
          const match = fetched.find(
            (item) =>
              item.status === key && item.sms_credential_id === sms_Credential_id
          );
          acc[key] = {
            text: match?.description || "",
            id: match?.id || null,
            enabled: true,
            templateId: match?.template_id || "",
          };
          return acc;
        }, {});

        setMessages(mapped);
      } catch (err) {
        console.error("Failed to fetch SMS templates:", err);
      }
    };

    fetchCredentials();
    if (sms_Credential_id) fetchMessages();
  }, [sms_Credential_id]);

  // ⬇️ Handle message change
  const handleTextChange = (key, value) => {
    setMessages((prev) => ({
      ...prev,
      [key]: { ...prev[key], text: value },
    }));
    debouncedSave(key);
  };

  // ⬇️ Handle template ID change
  const handleTemplateChange = (key, value) => {
    setMessages((prev) => ({
      ...prev,
      [key]: { ...prev[key], templateId: value },
    }));
    debouncedSave(key);
  };

  // ✅ Debounced Save Function
  const debouncedSave = useCallback(
    debounce((key) => {
      saveMessage(key);
    }, 2000),
    [messages, sms_Credential_id]
  );

  // ⬆️ Save to backend
  const saveMessage = async (key) => {
    const token = getCookie("access_token");
    const data = messages[key];

    const payload = {
      description: data.text,
      status: key,
      sms_credential_id: 1,
      template_id: data.templateId,
    };

    try {
      const res = await axios.post(
        "https://api.equi.co.in/api/sms-settings",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.data?.id) {
        setMessages((prev) => ({
          ...prev,
          [key]: { ...prev[key], id: res.data.data.id },
        }));
      }
    } catch (err) {
      console.error("Error saving template:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">SMS Template Settings</h2>

      {/* 🔽 Shop Dropdown */}
      <div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-700">
    SMS Provider: {credentials[0]?.business_name || "No Credential Available"}
  </h3>
</div>


      {/* 📝 Message and Template ID Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((key) => (
          <div key={key} className="border p-3 rounded shadow-sm">
            <label className="block text-sm font-medium mb-1">{key}</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded p-2 text-sm mb-2"
              value={messages[key].text}
              onChange={(e) => handleTextChange(key, e.target.value)}
              placeholder={`Enter message for ${key}`}
            />
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-sm"
              placeholder="Enter Template ID"
              value={messages[key].templateId}
              onChange={(e) => handleTemplateChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
