"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function Home() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [token, setToken] = useState(null);

  // Get token on mount
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
      return null;
    };

    const accessToken = getCookie("access_token");
    if (!accessToken) {
      if (typeof notyf !== "undefined") {
        notyf.error("Authentication token not found!");
      } else {
        console.error("Authentication token not found!");
      }
    } else {
      setToken(accessToken);
    }
  }, []);

  // Fetch items once token is available
  useEffect(() => {
    if (!token) return;

    const fetchItems = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/type", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [token]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const onSubmit = async (data) => {
    if (!token) return;

    if (editingItem) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/type/${editingItem.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedItem = response.data;
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingItem.id ? updatedItem : item
          )
        );
        fetchItems();
        reset();
        setEditingItem(null);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/type",
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

  const handleEdit = (item) => {
    setValue("name", item.name);
    setValue("description", item.description);
    setEditingItem(item);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/type/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
          {editingItem ? "Edit type" : "Create type"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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

          {/* Description field (optional) */}
          {/*<div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                {...register("description")}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>*/}

          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded-md"
          >
            {editingItem ? "Update Product Type" : "Create Product Type"}
          </button>
        </form>
      </div>

      {/* Right side display */}
      <div className="w-2/3 p-6 bg-white overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Items</h2>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex border p-3 border-b-0 justify-between items-center py-2"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                {/*<p className="text-sm text-gray-500">{item.description}</p>*/}
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
