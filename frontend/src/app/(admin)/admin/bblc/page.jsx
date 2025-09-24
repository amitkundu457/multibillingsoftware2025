"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";

export default function BBLCSlotsPage() {
    const [slots, setSlots] = useState([]);
    const [form, setForm] = useState({
        name: "",
        days: "",
        target: "lost_customers",
        send_time: "10:00",
        enabled: true,
    });
    const [editingSlot, setEditingSlot] = useState(null); // for modal

    // Fetch all slots
    const fetchSlots = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/bblc-slots");
            setSlots(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchSlots(); }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // Submit new slot
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, days: form.days.split(',').map(d => d.trim()) };
            if(editingSlot) {
                await axios.put(`http://127.0.0.1:8000/api/bblc-slots/${editingSlot.id}`, payload);
                setEditingSlot(null);
            } else {
                await axios.post("http://127.0.0.1:8000/api/bblc-slots", payload);
            }
            setForm({ name: "", days: "", target: "lost_customers", send_time: "10:00", enabled: true });
            fetchSlots();
        } catch (err) {
            console.error(err);
        }
    };

    // Delete slot
    const handleDelete = async (id) => {
        if(confirm("Are you sure you want to delete this slot?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/bblc-slots/${id}`);
                fetchSlots();
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Open modal for edit
    const openEdit = (slot) => {
        setEditingSlot(slot);
        setForm({
            name: slot.name,
            days: slot.days.join(','),
            target: slot.target,
            send_time: slot.send_time,
            enabled: slot.enabled,
        });
    };

    // Close modal
    const closeEdit = () => {
        setEditingSlot(null);
        setForm({ name: "", days: "", target: "lost_customers", send_time: "10:00", enabled: true });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">BBLC Slots Admin Panel</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <input type="text" name="name" placeholder="Slot Name" value={form.name} onChange={handleChange}
                           className="p-2 border rounded w-full" required />
                    <input type="text" name="days" placeholder="Days (e.g. 2,15,20,25)" value={form.days} onChange={handleChange}
                           className="p-2 border rounded w-full" required />
                    <input type="time" name="send_time" value={form.send_time} onChange={handleChange}
                           className="p-2 border rounded w-full" required />
                    <select name="target" value={form.target} onChange={handleChange} className="p-2 border rounded w-full">
                        <option value="lost_customers">Lost Customers</option>
                        <option value="new_customers">New Customers</option>
                    </select>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleChange} />
                        <span className="text-gray-700">Enabled</span>
                    </div>
                    <button type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-full md:col-auto">
                        {editingSlot ? "Update Slot" : "Create Slot"}
                    </button>
                </form>
            </div>

            {/* Slots Table */}
            <div className="bg-white shadow rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Days</th>
                        <th className="px-4 py-2 text-left">Target</th>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-left">Enabled</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {slots.map(slot => (
                        <tr key={slot.id}>
                            <td className="px-4 py-2">{slot.name}</td>
                            <td className="px-4 py-2">{slot.days.join(', ')}</td>
                            <td className="px-4 py-2">{slot.target}</td>
                            <td className="px-4 py-2">{slot.send_time}</td>
                            <td className="px-4 py-2">{slot.enabled ? '✅' : '❌'}</td>
                            <td className="px-4 py-2 flex space-x-2">
                                <button className="text-yellow-500 hover:text-yellow-700" onClick={() => openEdit(slot)}><FiEdit size={18}/></button>
                                <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(slot.id)}><FiTrash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={closeEdit}><FiX size={20}/></button>
                        <h2 className="text-xl font-bold mb-4">Edit Slot</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <input type="text" name="name" value={form.name} onChange={handleChange} className="p-2 border rounded" required />
                            <input type="text" name="days" value={form.days} onChange={handleChange} className="p-2 border rounded" required />
                            <input type="time" name="send_time" value={form.send_time} onChange={handleChange} className="p-2 border rounded" required />
                            <select name="target" value={form.target} onChange={handleChange} className="p-2 border rounded">
                                <option value="lost_customers">Lost Customers</option>
                                <option value="new_customers">New Customers</option>
                            </select>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleChange} />
                                <span className="text-gray-700">Enabled</span>
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Update Slot</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
