"use client";
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
      const response = await axios.get(
        "https://apibrize.brizindia.com/api/loyalty"
      );
      console.log("resposne", response);
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
        await axios.post(
          `https://apibrize.brizindia.com/api/loyalty/${modalData.id}`,
          modalData
        );
      } else {
        await axios.post(
          "https://apibrize.brizindia.com/api/loyalty",
          modalData
        );
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
      await axios.delete(`https://apibrize.brizindia.com/api/loyalty/${id}`);
      fetchLoyalty();
    } catch (error) {
      console.error("Error deleting loyalty:", error);
    }
  };

  // Redeem Setup submit
  const handleRedeemSubmit = async () => {
    const data = { points: redeemPoints, rupees: redeemValue };
    try {
      const response = await axios.post(
        "https://apibrize.brizindia.com/api/redeem-setup",
        data
      );
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
      <h1 className="mb-6 text-3xl font-bold">Loyalty</h1>

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => openLoyaltyModal()}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          + Add Loyalty
        </button>
        <button
          onClick={() => setIsRedeemModalOpen(true)}
          className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
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
                    className="px-3 py-1 text-white bg-yellow-400 rounded hover:bg-yellow-500"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteLoyalty(data.id)}
                    className="px-3 py-1 ml-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center">
                No loyalty available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Loyalty Modal */}
      {isLoyaltyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-semibold">
              {isEditMode ? "Edit Loyalty" : "Add Loyalty"}
            </h2>
            <div className="mb-4">
              <label>Loyalty amount:</label>
              <input
                type="number"
                value={modalData.loyalty_balance}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    loyalty_balance: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label>Set Loyalty Point:</label>
              <input
                type="number"
                value={modalData.set_loyalty_points}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    set_loyalty_points: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label>Min Invoice to get point:</label>
              <input
                type="number"
                value={modalData.min_loyalty_required}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    min_loyalty_required: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label>Min Invoice to redeem point:</label>
              <input
                type="number"
                value={modalData.min_bill_to_redeem}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    min_bill_to_redeem: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSaveLoyalty}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Save Loyalty
              </button>
              <button
                onClick={() => setIsLoyaltyModalOpen(false)}
                className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-semibold">Redeem Setup</h2>
            <div className="flex items-center justify-between gap-2 mb-4">
              <label className="w-1/2 font-medium text-gray-600">
                Redemption Value
              </label>
              <input
                type="number"
                placeholder="point"
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <span className="mx-2 text-gray-500">=</span>
              <input
                type="number"
                placeholder="₹"
                value={redeemValue}
                onChange={(e) => setRedeemValue(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <button
              onClick={handleRedeemSubmit}
              className="w-full py-2 font-semibold text-white bg-orange-500 rounded-lg hover:bg-blue-600"
            >
              Save Redeem Setup
            </button>
            <button
              onClick={() => setIsRedeemModalOpen(false)}
              className="w-full py-2 mt-3 font-semibold text-white bg-gray-400 rounded-lg hover:bg-gray-500"
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
