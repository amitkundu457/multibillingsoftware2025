"use client";
import React, { useEffect, useState } from "react";

export default function AdvanceMessageDate() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    birthdayAdvance: "",
    anniversaryAdvance: "",
    bblcAdvanceDate: "",
    reminderAdvanceDate: "",
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const [editingId, setEditingId] = useState(null);

  // Fetch all data
  const fetchData = async () => {
    const token = getCookie("access_token");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/sms-advance-date/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or Update
  const handleSubmit = async (e) => {
    const token = getCookie("access_token");
    e.preventDefault();

    const url = editingId
      ? `http://127.0.0.1:8000/api/sms-advance-date/${editingId}`
      : "http://127.0.0.1:8000/api/sms-advance-date/";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ birthdayAdvance: "", anniversaryAdvance: "", bblcAdvanceDate: "", reminderAdvanceDate: "" });
        setEditingId(null);
        fetchData(); // refresh list
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit entry
  const handleEdit = (item) => {
    setForm({
      birthdayAdvance: item.birthdayAdvance,
      anniversaryAdvance: item.anniversaryAdvance,
      bblcAdvanceDate: item.bblcAdvanceDate,
      reminderAdvanceDate: item.reminderAdvanceDate,
    });
    setEditingId(item.id);
  };

  // Delete entry
  const handleDelete = async (id) => {
    const token = getCookie("access_token");
     if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/sms-advance-date/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Advance Message Dates</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="number"
          name="birthdayAdvance"
          placeholder="Birthday Advance"
          value={form.birthdayAdvance}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="anniversaryAdvance"
          placeholder="Anniversary Advance"
          value={form.anniversaryAdvance}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="bblcAdvanceDate"
          placeholder="BBLC Advance"
          value={form.bblcAdvanceDate}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="reminderAdvanceDate"
          placeholder="Reminder Advance"
          value={form.reminderAdvanceDate}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      {/* Data List */}
      <ul className="space-y-2">
        {data.map((item) => (
          <li key={item.id} className="flex justify-between items-center border p-2 rounded">
            <span>
              Birthday: {item.birthdayAdvance} | Anniversary: {item.anniversaryAdvance} | BBLC: {item.bblcAdvanceDate} | Reminder: {item.reminderAdvanceDate}
            </span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(item)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
