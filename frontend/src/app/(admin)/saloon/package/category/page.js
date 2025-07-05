"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function CategoryPackage() {
  const [subtypes, setSubtypes] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);


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





  useEffect(() => {
    fetchSubtypes();
  }, []);

  const fetchSubtypes = async () => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}

    const response = await axios.get("https://api.equi.co.in/api/package-category",
      
{
  headers: { Authorization: `Bearer ${token}` },
}

    );
    setSubtypes(response.data);
  };

  const handleSubmit = async (e) => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}

    e.preventDefault();
    if (editingId) {
      await axios.put(`https://api.equi.co.in/api/package-category/${editingId}`, { name });
    } else {
      await axios.post("https://api.equi.co.in/api/package-category", { name },
        
{
  headers: { Authorization: `Bearer ${token}` },
}

      );
    }
    setName("");
    setEditingId(null);
    fetchSubtypes();
  };

  const handleEdit = (subtype) => {
    setName(subtype.name);
    setEditingId(subtype.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subtype?")) {
      await axios.delete(`https://api.equi.co.in/api/package-category/${id}`);
      fetchSubtypes();
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Manage Category</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex ">
        <input
          type="text"
          placeholder="Subtype Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Add"}
        </button>
        </div>
      </form>

      <ul className="border p-4">
        {subtypes.map((subtype) => (
          <li key={subtype.id} className="flex justify-between py-2">
            {subtype.name}
            <div>
              <button onClick={() => handleEdit(subtype)} className="bg-yellow-500 text-white px-2 py-1 mr-2">Edit</button>
              <button onClick={() => handleDelete(subtype.id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
