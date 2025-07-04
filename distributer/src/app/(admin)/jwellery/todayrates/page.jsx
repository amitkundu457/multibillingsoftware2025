 'use client';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChevronRight, FaTrash } from "react-icons/fa6";
import Model from "./model";

const IndexPage = () => {
  const [rateDatas, setRateDatas] = useState([]);
  const [modelState, setModelState] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchRateMasters();
  }, []);

  const fetchRateMasters = () => {
    axios.get('http://127.0.0.1:8000/api/ratemaster/')
      .then((response) => {
        setRateDatas(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch rate masters:", error);
      });
  };

  const closeModel = () => {
    setModelState(false);
    setSelectedItem(null);
    fetchRateMasters(); // Refresh the table after adding/updating
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModelState(true);
  };

  const deleteRateMaster = (id) => {
    if (window.confirm("Are you sure you want to delete this rate?")) {
      axios.delete(`http://127.0.0.1:8000/api/ratemaster/${id}`)
        .then(() => {
          setRateDatas(rateDatas.filter((data) => data.id !== id));
          alert("Rate deleted successfully");
        })
        .catch((error) => {
          console.error("Failed to delete rate:", error);
          alert("Failed to delete rate");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white text-center py-4 text-xl font-semibold">
        Today Rates
      </header>

      <div className="container mx-auto p-4">
        <table className="min-w-full bg-white border-collapse shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left bg-gray-200 text-sm font-semibold text-gray-700">Label</th>
              <th className="px-6 py-4 text-left bg-gray-200 text-sm font-semibold text-gray-700">Rate</th>
              <th className="px-6 py-4 text-left bg-gray-200 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rateDatas.length > 0 ? (
              rateDatas.map((data) => (
                <tr key={data.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{data.labelhere}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{data.rate}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 flex justify-between items-center">
                    <button
                      aria-label="Edit rate"
                      onClick={() => handleEdit(data)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaChevronRight className="text-5xl" />
                    </button>
                    <button
                      aria-label="Delete rate"
                      onClick={() => deleteRateMaster(data.id)}
                      className="text-red-600 hover:text-red-800 text-xl mr-4"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No rates available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Conditionally render the modal */}
      {modelState && (
        <Model 
          closeModal={closeModel} 
          selectedItem={selectedItem} 
        />
      )}
    </div>
  );
};

export default IndexPage;
