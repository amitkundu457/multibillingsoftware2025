import React, { useState } from 'react'

export default function CreateEditModal({ data, onClose, onSave }) {
  const [formData, setFormData] = useState(data || { name: "", amount: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-4 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl font-bold">
          {data ? "Edit Product" : "Add Product"}
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 text-white bg-gray-500 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
