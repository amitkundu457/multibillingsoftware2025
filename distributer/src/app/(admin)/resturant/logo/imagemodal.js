// "use client"
import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import axios from "axios";

const LogoUploadModal = ({ open, onClose, masterId, currentLogo }) => {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  // Handle logo upload/update
  const handleSubmit = async () => {
    if (!logo) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("logo", logo);

    try {
      let response;
      if (masterId) {
        // Update the existing logo
        response = await axios.put(`/api/masters/${masterId}`, formData);
      } else {
        // Create a new record with the logo
        response = await axios.post("/api/masters", formData);
      }

      // Show success message
      alert(response.data.message);
      // Close modal
      onClose();
    } catch (err) {
      setError("There was an error uploading the image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset logo state when modal is opened or closed
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
          <img src={currentLogo} alt="Current Logo" style={{ maxWidth: "100px" }} />
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
