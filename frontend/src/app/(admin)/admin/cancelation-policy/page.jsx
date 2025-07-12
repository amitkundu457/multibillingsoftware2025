'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function FrontendEditor({ type = 'Cancellation and Refund Policy' }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  // Load content from API
  useEffect(() => {
  axios
    .get(`http://127.0.0.1:8000/api/frontend-settings/${type}`)
    .then((res) => {
      setDescription(res.data.description || '');
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error loading content:', err);
      setLoading(false);
    });
}, [type]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:8000/api/frontend-settings`, {
        type,
        description,
      });
      alert('Saved successfully!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving.');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Edit "{type}" Content
      </h2>

      <div className="bg-white border rounded mb-4">
        <CKEditor
          editor={ClassicEditor}
          data={description}
          onChange={(event, editor) => {
            const data = editor.getData();
            setDescription(data);
          }}
        />
      </div>

      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}
