"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function KotTables() {
  const [tables, setTables] = useState([]);
  const [tableNo, setTableNo] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  // ✅ Fetch all tables
  const fetchTables = async () => {
          const token = getCookie("access_token"); // Retrieve token

    try {
       const res = await axios.get("http://127.0.0.1:8000/api/kot-tables", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTables(res.data.tables || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // ✅ Add a new table
  const handleAddTable = async (e) => {
              const token = getCookie("access_token"); // Retrieve token

    e.preventDefault();
    if (!tableNo) return alert("Please enter table number");

    try {
       await axios.post(
        "http://127.0.0.1:8000/api/kot-tables",
        { table_no: tableNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTableNo("");
      fetchTables(); // Refresh list
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };

  // ✅ Delete table
  const handleDeleteTable = async (id) => {
    if (!confirm("Are you sure you want to delete this table?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/kot-tables/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTables(); // Refresh list
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">KOT Tables</h1>

      {/* Add Table Form */}
      <form onSubmit={handleAddTable} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Table Number"
          className="border p-2 rounded w-full"
          value={tableNo}
          onChange={(e) => setTableNo(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {/* Table List */}
      <ul className="divide-y">
        {tables.length > 0 ? (
          tables.map((table) => (
            <li
              key={table.id}
              className="flex justify-between items-center py-2"
            >
              <span className="font-medium">Table No: {table.table_no}</span>
              <button
                onClick={() => handleDeleteTable(table.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No tables found.</p>
        )}
      </ul>
    </div>
  );
}
