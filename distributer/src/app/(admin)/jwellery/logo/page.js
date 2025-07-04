"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {getLogo,getcreateogo} from "../../../components/config"

const ImageUploadUpdate = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    // Fetch the current logo URL when the component mounts
    const fetchLogo = async () => {
      try {
        const response = await getLogo();
        setLogoUrl(response.data.logo_url);
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
      await handleSubmit(selectedFile); // Automatically upload the file
    }
  };

  const handleSubmit = async (fileToUpload) => {
    if (!fileToUpload) {
      setMessage("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("logo", fileToUpload);
  
    try {
      // Pass the formData to getcreateogo function
      const response = await getcreateogo(formData);
  
      setMessage(response.data.message);
      setLogoUrl(response.data.data.logo_url);
      setFile(null);
    } catch (error) {
      setMessage("Failed to upload and update the image. Please try again.");
      console.error("Error during file upload:", error);
    }
  };
  

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Update Logo</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Current Logo:</label>
        {logoUrl ? (
          <img
            src={logoUrl}
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

      {message && <p className="text-center text-lg text-red-500 mt-4">{message}</p>}
    </div>
  );
};

export default ImageUploadUpdate;
