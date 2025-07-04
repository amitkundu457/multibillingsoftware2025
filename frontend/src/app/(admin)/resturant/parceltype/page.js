"use client";
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/parcel-types";

export default function ParcelTypeManager() {
  const [parcelTypes, setParcelTypes] = useState([]);
  const [type, setType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setParcelTypes(data);
  };

  const handleSave = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    if (res.ok) {
      fetchTypes();
      setModalOpen(false);
      setType("");
      setEditingId(null);
    } else {
      const error = await res.json();
      alert(error.message || "Something went wrong");
    }
  };

  const handleEdit = (item) => {
    setType(item.type);
    setEditingId(item.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this parcel type?")) {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchTypes();
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Parcel Types</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Parcel Type
      </button>

      <ul className="space-y-2">
        {parcelTypes.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{item.type}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit" : "Add"} Parcel Type
            </h2>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Swiggy"
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingId(null);
                  setType("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
