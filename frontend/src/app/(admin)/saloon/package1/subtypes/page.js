"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function Subtypes() {
  const [subtypes, setSubtypes] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSubtypes();
  }, []);

  const fetchSubtypes = async () => {
    const response = await axios.get(" https://api.equi.co.in/api/packagesubtypes");
    setSubtypes(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(` https://api.equi.co.in/api/packagesubtypes/${editingId}`, { name });
    } else {
      await axios.post(" https://api.equi.co.in/api/packagesubtypes", { name });
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
      await axios.delete(` https://api.equi.co.in/api/packagesubtypes/${id}`);
      fetchSubtypes();
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Manage Subtypes</h2>
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
