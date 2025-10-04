 'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Loyalty = () => {
  const [loyalty, setLoyalty] = useState([]);
  
  // Modals
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalData, setModalData] = useState({ 
    loyalty_balance: "",
    set_loyalty_points: "",
    min_loyalty_required: "",
    min_bill_to_redeem: "",
  });

  // Redeem Setup state
  const [redeemPoints, setRedeemPoints] = useState("");
  const [redeemValue, setRedeemValue] = useState("");

  // Fetch loyalty data
  const fetchLoyalty = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/loyalty/");
      setLoyalty(response.data);
    } catch (error) {
      console.error("Error fetching loyalty:", error);
    }
  };

  useEffect(() => {
    fetchLoyalty();
  }, []);

  // Open Loyalty Modal
  const openLoyaltyModal = (data = {}) => {
    setModalData(data);
    setIsEditMode(!!data.id);
    setIsLoyaltyModalOpen(true);
  };

  // Save Loyalty
  const handleSaveLoyalty = async () => {
    try {
      if (isEditMode) {
        await axios.post(`http://127.0.0.1:8000/api/loyalty/${modalData.id}`, modalData);
      } else {
        await axios.post("http://127.0.0.1:8000/api/loyalty/", modalData);
      }
      fetchLoyalty();
      setIsLoyaltyModalOpen(false);
    } catch (error) {
      console.error("Error saving loyalty:", error);
    }
  };

  // Delete Loyalty
  const handleDeleteLoyalty = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/loyalty/${id}`);
      fetchLoyalty();
    } catch (error) {
      console.error("Error deleting loyalty:", error);
    }
  };

  // Redeem Setup submit
  const handleRedeemSubmit = async () => {
    const data = { points: redeemPoints, rupees: redeemValue };
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/redeem-setup", data);
      if (response.status === 201) {
        alert("Redeem setup saved successfully!");
        setRedeemPoints("");
        setRedeemValue("");
        setIsRedeemModalOpen(false);
      } else {
        alert("Error saving redeem setup.");
      }
    } catch (error) {
      console.error("Error posting redeem setup:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Loyalty</h1>

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => openLoyaltyModal()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Loyalty
        </button>
        <button
          onClick={() => setIsRedeemModalOpen(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          + Redeem Setup
        </button>
      </div>

      {/* Loyalty Table */}
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Loyalty Balance</th>
            <th className="px-4 py-2 text-left">Set Loyalty Point</th>
            <th className="px-4 py-2 text-left">Min Invoice to get Reward</th>
            <th className="px-4 py-2 text-left">Min. Bill to Redeem</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loyalty.length > 0 ? (
            loyalty.map((data) => (
              <tr key={data.id} className="border-b">
                <td className="px-4 py-2">{data.loyalty_balance}</td>
                <td className="px-4 py-2">{data.set_loyalty_points}</td>
                <td className="px-4 py-2">{data.min_loyalty_required}</td>
                <td className="px-4 py-2">{data.min_bill_to_redeem}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openLoyaltyModal(data)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteLoyalty(data.id)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No loyalty available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Loyalty Modal */}
      {isLoyaltyModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Loyalty" : "Add Loyalty"}</h2>
            <div className="mb-4">
              <label>Loyalty amount:</label>
              <input
                type="number"
                value={modalData.loyalty_balance}
                onChange={(e) => setModalData({ ...modalData, loyalty_balance: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label>Set Loyalty Point:</label>
              <input
                type="number"
                value={modalData.set_loyalty_points}
                onChange={(e) => setModalData({ ...modalData, set_loyalty_points: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label>Min Invoice to get point:</label>
              <input
                type="number"
                value={modalData.min_loyalty_required}
                onChange={(e) => setModalData({ ...modalData, min_loyalty_required: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label>Min Invoice to redeem point:</label>
              <input
                type="number"
                value={modalData.min_bill_to_redeem}
                onChange={(e) => setModalData({ ...modalData, min_bill_to_redeem: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={handleSaveLoyalty} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save Loyalty
              </button>
              <button onClick={() => setIsLoyaltyModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Redeem Setup</h2>
            <div className="flex items-center justify-between gap-2 mb-4">
              <label className="font-medium text-gray-600 w-1/2">Redemption Value</label>
              <input
                type="number"
                placeholder="point"
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
              <span className="text-gray-500 mx-2">=</span>
              <input
                type="number"
                placeholder="₹"
                value={redeemValue}
                onChange={(e) => setRedeemValue(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
            </div>
            <button
              onClick={handleRedeemSubmit}
              className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
            >
              Save Redeem Setup
            </button>
            <button
              onClick={() => setIsRedeemModalOpen(false)}
              className="mt-3 w-full bg-gray-400 text-white font-semibold py-2 rounded-lg hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loyalty;
