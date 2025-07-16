"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import axios from "axios";

const LogoUploadModal = ({ open, onClose, masterId, currentLogo }) => {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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







  // Handle file selection
  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  // Handle logo upload/update
  const handleSubmit = async () => {
    if (!logo) return;

    setLoading(true);
    setError(null);
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    const formData = new FormData();
    formData.append("logo", logo);

    try {
      let response;
      const config = { headers: { "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
       } };

      if (masterId) {
        // Update the existing logo
        response = await axios.put(` https://api.equi.co.in/api/masterlogobill/${masterId}`, formData, config);
      } else {
        // Create a new record with the logo
        response = await axios.post(" https://api.equi.co.in/api/masterlogobill", formData, config);
      }

      alert(response.data.message);
      
      // Update the logo preview
      onClose(response.data.data.logo_url); 

    } catch (err) {
      setError("There was an error uploading the image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setLogo(null);
      setError(null);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} center>
      <h2>{masterId ? "Update Logo" : "Upload Logo"}</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        {currentLogo && !logo && (
          <img src={` https://api.equi.co.in/${currentLogo}`} alt="Current Logo" style={{ maxWidth: "100px" }} />
        )}
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Submit"}
      </button>
    </Modal>
  );
};

export default LogoUploadModal;
