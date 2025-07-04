'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CoverUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

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






  const handleUpload = async () => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}
    if (!file) return;
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('cover', file);

    try {
      const res = await axios.post(
        'http://localhost:8000/api/cover/upload', // Replace with your API endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // Use your auth system
          },
        }
      );
      setUploadUrl(res.data.data.cover);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-lg mt-10 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Upload Cover Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {preview && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Preview:</p>
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded border" />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:bg-gray-400"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {message && (
        <p className="text-sm text-center text-green-600 mt-2">{message}</p>
      )}

      {uploadUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-1">Uploaded Cover Image:</p>
          <img src={uploadUrl} alt="Uploaded Cover" className="w-full h-48 object-cover rounded border" />
        </div>
      )}
    </div>
  );
}
