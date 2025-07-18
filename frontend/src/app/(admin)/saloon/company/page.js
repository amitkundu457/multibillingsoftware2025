"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const API_URL = "http://127.0.0.1:8000/api/company";

export default function Home() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  // Fetch all companies
  const fetchItems = useCallback(async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const notifyTokenMissing = () => {
    if (typeof window !== "undefined" && window.notyf) {
      window.notyf.error("Authentication token not found!");
    } else {
      console.error("Authentication token not found!");
    }
  };

  const onSubmit = async (data) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      if (editingItem) {
        // Update
        const response = await axios.put(`${API_URL}/${editingItem.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems((prev) =>
          prev.map((item) =>
            item.id === response.data.id ? response.data : item
          )
        );
        setEditingItem(null);
      } else {
        // Create
        const response = await axios.post(API_URL, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems((prev) => [...prev, response.data.data]);
      }

      reset(); // Clear form after submit
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleEdit = (item) => {
    setValue("name", item.name);
    setEditingItem(item);
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form */}
      <div className="w-1/3 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">
          {editingItem ? "Edit Company" : "Create Company"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded-md"
          >
            {editingItem ? "Update Company" : "Create Company"}
          </button>
        </form>
      </div>

      {/* Display */}
      <div className="w-2/3 p-6 bg-white overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Companies</h2>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border p-3 mb-2"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-4 py-1 bg-yellow-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
