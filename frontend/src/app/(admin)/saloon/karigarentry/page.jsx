"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Notyf } from "notyf";

export default function KarigarEntry() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [karigars, setKarigars] = useState([]);
  const [editingKarigar, setEditingKarigar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const notyf = new Notyf(); // Initialize Notyf

  // Token fetch logic
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
      return null;
    };

    const retrievedToken = getCookie("access_token");
    if (!retrievedToken) {
      notyf.error("Authentication token not found!");
    } else {
      setToken(retrievedToken);
    }
  }, []);

  // Fetch karigars once token is available
  useEffect(() => {
    if (token) {
      fetchKarigars();
    }
  }, [token]);

  const fetchKarigars = async () => {
    try {
      const response = await axios.get("https://api.equi.co.in/api/karigar-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKarigars(response.data);
    } catch (error) {
      console.error("Error fetching karigars:", error);
    }
  };

  const onSubmit = async (data) => {
    if (!token) return;

    if (editingKarigar) {
      try {
        const response = await axios.post(
          `https://api.equi.co.in/api/karigar-list/${editingKarigar.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedKarigar = response.data;
        setKarigars((prev) =>
          prev.map((karigar) =>
            karigar.id === updatedKarigar.id ? updatedKarigar : karigar
          )
        );
        fetchKarigars();
        reset();
        setEditingKarigar(null);
        notyf.success("Karigar updated successfully!");
      } catch (error) {
        console.error("Error updating karigar:", error);
      }
    } else {
      try {
        const response = await axios.post("https://api.equi.co.in/api/karigar-list", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKarigars((prev) => [...prev, response.data]);
        fetchKarigars();
        reset();
        notyf.success("Karigar created successfully!");
      } catch (error) {
        console.error("Error creating karigar:", error);
      }
    }
  };

  const handleEdit = (karigar) => {
    setValue("name", karigar.name);
    setValue("description", karigar.description);
    setEditingKarigar(karigar);
  };

  const handleDelete = async (id) => {
    if (!token) return;
    try {
      const response = await axios.delete(`https://api.equi.co.in/api/karigar-list/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setKarigars((prev) => prev.filter((k) => k.id !== id));
        fetchKarigars();
        notyf.success("Karigar deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting karigar:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left form */}
      <div className="w-1/3 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">
          {editingKarigar ? "Edit Karigar" : "Create Karigar"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register("name")}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded-md"
            disabled={!token}
          >
            {editingKarigar ? "Update Karigar" : "Create Karigar"}
          </button>
        </form>
      </div>

      {/* Right list */}
      <div className="w-2/3 p-6 bg-white overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Karigars</h2>
        {karigars.length === 0 ? (
          <p className="text-gray-500 text-lg text-center py-10">Karigar list is empty.</p>
        ) : (
          <ul>
            {karigars.map((karigar) => (
              <li
                key={karigar.id}
                className="flex border p-3 border-b-0 justify-between items-center py-2"
              >
                <div>
                  <p className="font-semibold">{karigar.name}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(karigar)}
                    className="px-4 py-1 bg-yellow-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(karigar.id)}
                    className="px-4 py-1 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
