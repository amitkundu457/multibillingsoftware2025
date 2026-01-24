"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateUnit() {
  const [unit_name, setUnitName] = useState("");
  const [unit_type, setUnitType] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://apibrize.brizindia.com/api/units", {
        unit_name,
        unit_type,
      });

      router.push("/resturant/units");
    } catch (error) {
      console.error("Error creating unit:", error);
    }
  };

  return (
    <div className="w-1/2 p-6">
      <h1 className="mb-4 text-xl font-bold">Create Unit</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Unit Name (kg, liter, qty etc)"
          value={unit_name}
          onChange={(e) => setUnitName(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Unit Type (weight, volume, piece)"
          value={unit_type}
          onChange={(e) => setUnitType(e.target.value)}
          required
        />

        <button className="px-4 py-2 text-white bg-blue-600 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
