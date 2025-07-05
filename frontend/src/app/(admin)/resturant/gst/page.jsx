'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const TaxPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalData, setModalData] = useState({ name: "", amount: "", fixed_amount: "" });

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







  // Fetch all taxes
  const fetchTaxes = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      const response = await axios.get("https://api.equi.co.in/api/tax"
        ,{
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTaxes(response.data.data);
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  // Open modal for add/edit
  const openModal = (data = {}) => {
    setModalData(data);
    setIsEditMode(!!data.id);
    setIsModalOpen(true);
  };

  // Create or update tax
  const handleSaveTax = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`https://api.equi.co.in/api/tax/${modalData.id}`, modalData);
      } else {
        await axios.post("https://api.equi.co.in/api/tax", modalData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      fetchTaxes();
      setIsModalOpen(false);
      setModalData({ name: "", amount: "", fixed_amount: "" });
    } catch (error) {
      console.error("Error saving tax:", error);
    }
  };

  // Delete tax
  const handleDeleteTax = async (id) => {
    try {
      await axios.delete(`https://api.equi.co.in/api/tax/${id}`);
      fetchTaxes();
    } catch (error) {
      console.error("Error deleting tax:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Taxes</h1>
      <button
        onClick={() => openModal()}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add Tax
      </button>

      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Amount(%)</th>
            <th className="px-4 py-2 text-left">Fixed Amount</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(taxes) && taxes.length > 0 ? (
            taxes.map((tax) => (
              <tr key={tax.id} className="border-b">
                <td className="px-4 py-2">{tax.name}</td>
                <td className="px-4 py-2">{tax.amount}</td>
                <td className="px-4 py-2">{tax.fixed_amount}</td>
                <td className="px-4 py-2 flex items-center space-x-2">
                  <button
                    onClick={() => openModal(tax)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTax(tax.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No taxes available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Tax" : "Add Tax"}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tax Name</label>
              <input
                type="text"
                placeholder="Enter Tax Name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount(%)</label>
              <input
                type="number"
                placeholder="Enter Amount"
                value={modalData.amount}
                onChange={(e) => setModalData({ ...modalData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Fixed Amount</label>
              <input
                type="number"
                placeholder="Enter Fixed Amount"
                value={modalData.fixed_amount}
                onChange={(e) => setModalData({ ...modalData, fixed_amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSaveTax}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxPage;
