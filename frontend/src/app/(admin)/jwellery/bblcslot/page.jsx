 "use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";

export default function BBLCSlotAdmin() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    name: "",
    days: "",
    target: "BBLC",
    send_time: "10:00",
    enabled: true,
  });
  const [editingSlot, setEditingSlot] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch slots from backend
  const fetchSlots = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/bblc-slots");
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit create/update slot
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editingSlot) {
        // Update existing slot
        await axios.put(
          `http://127.0.0.1:8000/api/bblc-slots/${editingSlot.id}`,
          { ...form } // days is string
        );
        setEditingSlot(null);
      } else {
        // Create new slot
        if (slots.length + 1 > 4) {
          setError(
            "⚠️ Maximum 4 slots allowed. Please update or delete existing slot(s)."
          );
          setLoading(false);
          return;
        }

        await axios.post("http://127.0.0.1:8000/api/bblc-slots", {
          ...form, // days is string
        });
      }

      // Reset form
      setForm({
        name: "",
        days: "",
        target: "BBLC",
        send_time: "10:00",
        enabled: true,
      });

      fetchSlots(); // refresh slots
    } catch (err) {
      console.error(err);
      setError("⚠️ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Delete slot
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/bblc-slots/${id}`);
      fetchSlots();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit slot
  const openEdit = (slot) => {
    setEditingSlot(slot);
    setForm({
      name: slot.name,
      days: slot.days, // just use string
      target: slot.target,
      send_time: slot.send_time,
      enabled: slot.enabled,
    });
  };

  // Close edit modal
  const closeEdit = () => {
    setEditingSlot(null);
    setForm({
      name: "",
      days: "",
      target: "BBLC",
      send_time: "10:00",
      enabled: true,
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">BBLC Slots Admin</h1>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingSlot ? "Edit Slot" : "Create New Slot"}
        </h2>

        {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Slot Name"
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <input
            type="text"
            name="days"
            value={form.days}
            onChange={handleChange}
            placeholder="Day(s) e.g. 2,15,20"
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <input
            type="time"
            name="send_time"
            value={form.send_time}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="enabled"
              checked={form.enabled}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
            />
            <span className="text-gray-700 font-medium">Enabled</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg shadow col-span-full md:col-auto transition-colors ${
              editingSlot
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading
              ? "Processing..."
              : editingSlot
              ? "Update Slot"
              : "Create Slot"}
          </button>
        </form>
      </div>

      {/* Slots Table Card */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Name</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Day(s)</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Time</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Enabled</th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {slots.map((slot) => (
              <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{slot.name}</td>
                <td className="px-6 py-4 text-gray-600">{slot.days}</td>
                <td className="px-6 py-4 text-gray-600">{slot.send_time}</td>
                <td className="px-6 py-4">{slot.enabled ? "✅" : "❌"}</td>
                <td className="px-6 py-4 flex space-x-3">
                  <button
                    onClick={() => openEdit(slot)}
                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={closeEdit}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-5">Edit Slot</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                name="days"
                value={form.days}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="time"
                name="send_time"
                value={form.send_time}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={form.enabled}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-600"
                />
                <span className="text-gray-700 font-medium">Enabled</span>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-colors"
              >
                Update Slot
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
