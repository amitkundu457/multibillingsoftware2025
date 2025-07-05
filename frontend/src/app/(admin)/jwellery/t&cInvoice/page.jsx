


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import toast from "react-hot-toast";

const notyf = new Notyf();

const TermsEditor = () => {
  const [content, setContent] = useState("");
  const [termId, setTermId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get JWT token from cookies
  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  // Notify if token is missing
  const notifyTokenMissing = () => {
    toast.error("Authentication token not found!");
  };

  // Fetch existing terms from Laravel backend
  const fetchTerms = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      const res = await axios.get("https://api.equi.co.in/api/terms-condition-invoice", {
        headers: { Authorization: `Bearer ${token}` },
      });
console.log("ternm and condtion",res)
      if (res.data.length > 0) {
        setContent(res.data[0].content);
        setTermId(res.data[0].id);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("❌ Failed to load terms.");
    }
  };

  // Handle submit - create or update
  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = { content };

      if (termId) {
        await axios.put(
          `https://api.equi.co.in/api/terms-condition-invoice/${termId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Terms updated successfully ✅");
        setMessage("✅ Updated successfully");
      } else {
        const res = await axios.post(
          `https://api.equi.co.in/api/terms-condition-invoice`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTermId(res.data.data.id);
        toast.success("Terms created successfully ✅");
        setMessage("✅ Created successfully");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
      setMessage("❌ Failed to save terms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-white rounded ">
      <h2 className="text-2xl font-bold mb-4">Terms and Conditions (Invoice)</h2>

      {/* Editor */}
      <textarea
        className="w-full h-64 p-3 border border-gray-300 rounded mb-4 resize-none"
        placeholder="Enter terms here. Each line will appear as a bullet point."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving..." : termId ? "Update Terms" : "Create Terms"}
      </button>

      {/* Message */}
      {message && (
        <p className={`mt-4 text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {/* Preview */}
      <div className="mt-8 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Preview</h3>
        <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
          {content
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line, index) => (
              <li key={index}>{line.replace(/^•\s*/, "")}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TermsEditor;
