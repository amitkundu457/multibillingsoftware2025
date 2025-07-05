"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

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

  const notifyTokenMissing = () => {
    if (typeof window !== "undefined" && window.notyf) {
      window.notyf.error("Authentication token not found!");
    } else {
      console.error("Authentication token not found!");
    }
  };







  // Fetch items using Axios
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const response = await axios.get(" https://api.equi.co.in/api/enquiry",
        {
          headers: { Authorization: `Bearer ${token}` },
        }

      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Handle form submission for creating or updating items
  const onSubmit = async (data) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    if (editingItem) {
      // Update item
      try {
        const response = await axios.put(
          ` https://api.equi.co.in/api/enquiry/${editingItem.id}`,
          data
        );
        const updatedItem = response.data;
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        );
        fetchItems();
        reset();
        setEditingItem(null);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    } else {
      // Create new item
      try {
        const response = await axios.post(
          " https://api.equi.co.in/api/enquiry",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }

        );
        setItems((prevItems) => [...prevItems, response.data]);
        fetchItems();
        reset();
      } catch (error) {
        console.error("Error creating item:", error);
      }
    }
  };

  // Handle editing an item
  const handleEdit = (item) => {
    setValue("name", item.name);
    setValue("description", item.description);
    setValue("source", item.source);
    setValue("date", item.date);
    setValue("phone", item.phone);
    setValue("email", item.email);
    setEditingItem(item);
  };

  // Handle deleting an item
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        ` https://api.equi.co.in/api/enquiry/${id}`
      );
      if (response.status === 200) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side form */}
      <div className="w-1/3 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">
          {editingItem ? "Edit Enquiry" : "Create Enquiry"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Source
            </label>
            <select {...register("source")} className="mt-1 p-2 w-full border rounded-md">
              <option value="direct">Direct</option>
              <option value="vendor">Vendor</option>
              <option value="convenience">Convenience</option>
              <option value="enquiry">Enquiry</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              className="mt-1 p-2 w-full border rounded-md"
            ></textarea>
          </div>

        
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              {...register("date")}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

        

          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded-md"
          >
            {editingItem ? "Update Enquiry" : "Create Enquiry"}
          </button>
        </form>
      </div>

      {/* Right side display */}
      <div className="w-2/3 p-6 bg-white overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Enquiry List</h2>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex border p-3 border-b-0 justify-between items-center py-2"
            >
              <div>
                <p className="font-semibold">Name: {item.name}</p>
                <p>Description: {item.description}</p>
                <p>Source: {item.source}</p>
                <p>Date: {item.date}</p>
                <p>Phone: {item.phone}</p>
                <p>Email: {item.email}</p>
              </div>
              <div className="flex space-x-2">
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
