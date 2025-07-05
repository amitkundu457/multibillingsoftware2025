'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import the React Icons
const Loyalty = () => {
  const [loyalty, setLoyalty] = useState([]); // Array to store tax data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
  const [isEditMode, setIsEditMode] = useState(false); // If editing an existing tax or adding a new one
  const [modalData, setModalData] = useState({ 
    loyalty_balance: "",
    set_loyalty_points:"",
    min_loyalty_required: "",
    min_bill_to_redeem: " ",
    max_loyalty_redeemable: "",
    expiry: ""
  }); // Modal form data

  // Fetch all loyalty from API
  const fetchloyalty = async () => {
    try {
      const response = await axios.get(" https://api.equi.co.in/api/loyalty/");
      setLoyalty(response.data); // Assuming the data is under the 'data' key
    } catch (error) {
      console.error("Error fetching loyalty:", error);
    }
  };

  useEffect(() => {
    fetchloyalty(); // Fetch loyalty on component mount
  }, []);

  // Open modal for adding or editing tax
  const openModal = (data = {}) => {
    setModalData(data);
    setIsEditMode(!!data.id); // Check if editing an existing tax
    setIsModalOpen(true);
  };

  // Save tax (either create or update)
  const handleSaveTax = async () => {
    if (isEditMode) {
      // Update existing tax
      try {
        await axios.post(` https://api.equi.co.in/api/loyalty/${modalData.id}`, modalData);
        fetchloyalty();
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error updating tax:", error);
      }
    } else {
      // Create new tax
      try {
        await axios.post(" https://api.equi.co.in/api/loyalty/", modalData);
        fetchloyalty();
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error adding tax:", error);
      }
    }
  };

  // Delete tax
  const handleDeleteTax = async (id) => {
    try {
      await axios.delete(` https://api.equi.co.in/api/loyalty/${id}`);
      fetchloyalty();
    } catch (error) {
      console.error("Error deleting tax:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">loyalty</h1>
      <button
        onClick={() => openModal()}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add Loyalty
      </button>

      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Loyalty Balance</th>
            <th className="px-4 py-2 text-left">set Loyalty Point</th>

            <th className="px-4 py-2 text-left">Min Loyalty</th>
            <th className="px-4 py-2 text-left">Min. Bill to Redeem</th>
            <th className="px-4 py-2 text-left">Max Loyalty</th>
            <th className="px-4 py-2 text-left">Expiry</th>
            <th className="px-4 py-2 text-left">Actions</th>

          </tr>
        </thead>
        <tbody>
          {/* Ensure loyalty is an array before calling .map */}
          {Array.isArray(loyalty) && loyalty.length > 0 ? (
            loyalty.map((data) => (
              <tr key={data.id} className="border-b">
                <td className="px-4 py-2">{data.loyalty_balance}</td>
                <td className="px-4 py-2">{data.set_loyalty_points}</td>

                <td className="px-4 py-2">{data.min_loyalty_required}</td>
                <td className="px-4 py-2">{data.min_bill_to_redeem}</td>
                <td className="px-4 py-2">{data.max_loyalty_redeemable}</td>
                <td className="px-4 py-2">{data.expiry}</td>
                <td className="px-4 py-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => openModal(data)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    <FaEdit size={16} />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteTax(data.id)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">No loyalty available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for adding/editing tax */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Tax" : "Add Tax"}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Loyalty amount:</label>
              <input
                type="number"
                placeholder="Enter loyalty  Balance"
                value={modalData.loyalty_balance}
                onChange={(e) => setModalData({ ...modalData, loyalty_balance: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">set Loyalty Point:</label>
              <input
                type="number"
                placeholder="Enter loyalty  Balance"
                value={modalData.set_loyalty_points}
                onChange={(e) => setModalData({ ...modalData, set_loyalty_points: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Minimum value of invoice to redeem loyalty point</label>
              <input
                type="number"
                placeholder="enter value"
                value={modalData.min_loyalty_required}
                onChange={(e) => setModalData({ ...modalData, min_loyalty_required: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Minimum value of invoice for get  point:</label>
              <input
                type="number"
                placeholder="Enter value"
                value={modalData.min_bill_to_redeem}
                onChange={(e) => setModalData({ ...modalData, min_bill_to_redeem: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">maximum loyalty to redeem:</label>
              <input
                type="number"
                placeholder="Enter value"
                value={modalData.max_loyalty_redeemable}
                onChange={(e) => setModalData({ ...modalData, max_loyalty_redeemable: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Expiry date of loyalty</label>
              <input
                type="date"
                placeholder="select Days"
                value={modalData.expiry}
                onChange={(e) => setModalData({ ...modalData, expiry: e.target.value })}
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

export default Loyalty;
