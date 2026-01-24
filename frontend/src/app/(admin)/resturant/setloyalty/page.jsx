"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Loyalty = () => {
  const [loyalty, setLoyalty] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [modalData, setModalData] = useState({
    id: null,
    loyalty_balance: "",
    set_loyalty_points: "",
    min_loyalty_required: "",
    min_bill_to_redeem: "",
    category: "",
    cashback: "",
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  /* ---------------- FETCH DATA ---------------- */
  const fetchLoyalty = async () => {
    const token = getCookie("access_token");
    try {
      const res = await axios.get(
        "https://apibrize.brizindia.com/api/loyalty",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoyalty(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLoyalty();
  }, []);

  /* ---------------- OPEN MODAL ---------------- */
  const openModal = (data = null) => {
    if (data) {
      setModalData(data);
      setIsEditMode(true);
    } else {
      setModalData({
        id: null,
        loyalty_balance: "",
        set_loyalty_points: "",
        min_loyalty_required: "",
        min_bill_to_redeem: "",
        category: "",
        cashback: "",
      });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    const token = getCookie("access_token");
    try {
      if (isEditMode) {
        await axios.post(
          `https://apibrize.brizindia.com/api/loyalty/${modalData.id}`,
          modalData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "https://apibrize.brizindia.com/api/loyalty",

          modalData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchLoyalty();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const formatCategory = (value) => {
    if (!value) return "-";
    return value.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };
  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://apibrize.brizindia.com/api/loyalty/${id}`);
      fetchLoyalty();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Loyalty Settings</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          + Add Loyalty
        </button>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Redeem Amout</th>
            <th className="p-2 border">Redeem Points</th>
            <th className="p-2 border">Set ₹ per Point</th>
            {/* <th className="p-2 border">Min Loyalty</th>
            <th className="p-2 border">Min Bill</th> */}
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {loyalty.length ? (
            loyalty.map((item) => (
              <tr key={item.id}>
                <td className="p-2 text-center border">
                  {formatCategory(item.category)}
                </td>
                {/* <td className="p-2 text-center border">{item.category}</td> */}
                <td className="p-2 text-center border">{item.cashback}</td>
                <td className="p-2 text-center border">
                  {item.loyalty_balance}
                </td>
                <td className="p-2 text-center border">
                  {item.set_loyalty_points}
                </td>
                {/* <td className="p-2 text-center border">
                  {item.min_loyalty_required}
                </td>
                <td className="p-2 text-center border">
                  {item.min_bill_to_redeem}
                </td> */}
                <td className="p-2 text-center border">
                  <button
                    onClick={() => openModal(item)}
                    className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1 text-white bg-red-600 rounded"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-4 text-center">
                No Loyalty Data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ---------------- MODAL ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-[420px]">
            <h2 className="mb-4 text-lg font-semibold">
              {isEditMode ? "Edit Loyalty" : "Add Loyalty"}
            </h2>

            {/* Category */}
            <select
              value={modalData.category}
              onChange={(e) =>
                setModalData({ ...modalData, category: e.target.value })
              }
              className="w-full p-2 mb-3 border"
            >
              <option value="">Select Category</option>
              <option value="stage_one">Stage One</option>
              <option value="stage_two">Stage Two</option>
              <option value="stage_three">Stage Three</option>
            </select>

            {/* Cashback */}
            <input
              type="number"
              placeholder="Redeem Amout"
              value={modalData.cashback}
              onChange={(e) =>
                setModalData({ ...modalData, cashback: e.target.value })
              }
              className="w-full p-2 mb-3 border"
            />

            <input
              type="number"
              placeholder="Redeem Points"
              value={modalData.loyalty_balance}
              onChange={(e) =>
                setModalData({
                  ...modalData,
                  loyalty_balance: e.target.value,
                })
              }
              className="w-full p-2 mb-3 border"
            />

            <input
              type="number"
              placeholder="Set ₹ per Point"
              value={modalData.set_loyalty_points}
              onChange={(e) =>
                setModalData({
                  ...modalData,
                  set_loyalty_points: e.target.value,
                })
              }
              className="w-full p-2 mb-3 border"
            />

            {/* <input
              type="number"
              placeholder="Min Loyalty Required"
              value={modalData.min_loyalty_required}
              onChange={(e) =>
                setModalData({
                  ...modalData,
                  min_loyalty_required: e.target.value,
                })
              }
              className="w-full p-2 mb-3 border"
            />

            <input
              type="number"
              placeholder="Min Bill To Redeem"
              value={modalData.min_bill_to_redeem}
              onChange={(e) =>
                setModalData({
                  ...modalData,
                  min_bill_to_redeem: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border"
            /> */}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-white bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-600 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loyalty;
