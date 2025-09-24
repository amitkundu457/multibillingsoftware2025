"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SlotManager() {
    const [slots, setSlots] = useState([]);
    const [slotDate, setSlotDate] = useState("");
    const [offsets, setOffsets] = useState([0]);
    const [loading, setLoading] = useState(false);

    // Fetch slots
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

    // Dynamic offset handling
    const handleOffsetChange = (index, value) => {
        const newOffsets = [...offsets];
        newOffsets[index] = parseInt(value) || 0;
        setOffsets(newOffsets);
    };
    const addOffset = () => setOffsets([...offsets, 0]);
    const removeOffset = (index) => setOffsets(offsets.filter((_, i) => i !== index));

    // Create slots
    const createSlots = async () => {
        if (!slotDate) return alert("Please select a start date");
        setLoading(true);
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/bblc-slots", {
                slot_date: slotDate,
                offsets,
            });
            setSlots([...slots, ...res.data]);
            setSlotDate("");
            setOffsets([0]);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // Delete slot
    const deleteSlot = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slot?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/bblc-slots/${id}`);
            setSlots(slots.filter((s) => s.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Label logic
    const getLabel = (date) => {
        const today = new Date();
        const slot = new Date(date);
        if (slot.toDateString() === today.toDateString()) return "Today";
        if (slot > today) return "Upcoming";
        return "Missed";
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Professional Slot Manager</h1>

            {/* Create Slots Panel */}
            <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Create Slots Dynamically</h2>

                {/* Start Date */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2 font-medium">Start Date:</label>
                    <input
                        type="date"
                        value={slotDate}
                        onChange={(e) => setSlotDate(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Offsets */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2 font-medium">Offsets (days):</label>
                    {offsets.map((offset, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                            <input
                                type="number"
                                value={offset}
                                onChange={(e) => handleOffsetChange(index, e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={() => removeOffset(index)}
                                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addOffset}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Add Offset
                    </button>
                </div>

                <button
                    onClick={createSlots}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    {loading ? "Creating..." : "Create Slots"}
                </button>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slots.map((slot) => (
                    <div
                        key={slot.id}
                        className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-600 p-4 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transition transform"
                    >
                        <div>
                            <p className="text-gray-700 font-semibold text-lg">{slot.slot_name}</p>
                            <p className="text-gray-500 text-sm">
                                {new Date(slot.slot_date).toLocaleDateString()}
                            </p>
                        </div>
                        <span
                            className={`mt-3 inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                getLabel(slot.slot_date) === "Today"
                                    ? "bg-green-100 text-green-800"
                                    : getLabel(slot.slot_date) === "Upcoming"
                                        ? "bg-indigo-100 text-indigo-800"
                                        : "bg-red-100 text-red-800"
                            }`}
                        >
              {getLabel(slot.slot_date)}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
