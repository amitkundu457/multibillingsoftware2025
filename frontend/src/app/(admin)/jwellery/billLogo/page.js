"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getLogoBill, getcreateogoBill } from "../../../components/config";

const ImageUploadUpdate = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [billLogoUrl, setBillLogoUrl] = useState(""); // Updated variable name
  const [bisNumber, setBisNumber] = useState("");

  //token
  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const notifyTokenMissing = () => {
    if (typeof window !== "undefined" && window.notyf) {
      window.notyf.error("Authentication token not found!");
    } else {
      console.error("Authentication token not found!");
    }
  };

  const [logoId, setLogoId] = useState(null); // Store the logo ID dynamically
  console.log("kjhg", billLogoUrl);
  useEffect(() => {
    const fetchLogo = async () => {
      const token = getToken();
      if (!token) {
        notifyTokenMissing();
        return;
      }

      try {
        const response = await axios.get(
          " http://127.0.0.1:8000/api/masterlogobill",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched Logo Data:", response.data); // Debugging

        if (response.data && response.data.logo) {
          setBillLogoUrl(response.data.logo);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchLogo();
  }, []);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      await handleSubmit(selectedFile);
    }
  };

  const handleSubmit = async (fileToUpload) => {
    if (!fileToUpload) {
      setMessage("Please select a file to upload.");
      return;
    }

    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    const formData = new FormData();
    formData.append("logo", fileToUpload);

    try {
      console.log("Uploading file:", fileToUpload);

      const response = await axios.post(
        " http://127.0.0.1:8000/api/masterlogobill",
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server Response:", response.data);

      setMessage(response.data.message);
      setBillLogoUrl(response.data.data.logo); // Use `logo` from API
      setFile(null);
    } catch (error) {
      console.error(
        "Upload Error:",
        error.response ? error.response.data : error
      );
      setMessage("Failed to upload the image. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch the BIS number on load

    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    const fetchBis = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/bis-number-get",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBisNumber(res.data.bis_number);
      } catch (error) {
        console.error("Error fetching BIS number:", error);
      }
    };

    fetchBis();
  }, []);

  const handleSaveBIS = async () => {
    if (!bisNumber.trim()) {
      alert("Please enter a BIS number");
      return;
    }

    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/bis-number-store",
        {
          bis_number: bisNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("BIS number saved!");
      setBisNumber("");
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to save BIS number");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Update Logo</h2>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Current Logo:</label>
        {billLogoUrl ? (
          <img
            src={billLogoUrl}
            alt="Current Logo"
            className="w-48 h-auto rounded-lg mx-auto"
          />
        ) : (
          <p className="text-gray-500">No logo available</p>
        )}
      </div>

      <div className="mb-6">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4 max-w-sm mx-auto mt-10 p-4 border rounded shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter BIS Number
          </label>
          <input
            type="text"
            value={bisNumber}
            onChange={(e) => setBisNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. BIS123456"
          />
        </div>

        <div>
          <button
            onClick={handleSaveBIS}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save BIS Number
          </button>
        </div>
      </div>

      {message && (
        <p className="text-center text-lg text-red-500 mt-4">{message}</p>
      )}
    </div>
  );
};

export default ImageUploadUpdate;
