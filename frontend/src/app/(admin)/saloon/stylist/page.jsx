'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Saloon = () => {
  const [stylists, setStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stylistData, setStylistData] = useState({ name: '', expertise: '', isAvailable: true });

  // Fetch stylists
  const fetchStylists = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/stylists');
    setStylists(response.data);
  };

  useEffect(() => {
    fetchStylists();
  }, []);

  // Open modal for adding a stylist or editing existing
  const openModal = (stylist = null) => {
    setSelectedStylist(stylist);
    if (stylist) {
      setStylistData({ ...stylist });
    } else {
      setStylistData({ name: '', expertise: '', isAvailable: true });
    }
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedStylist(null);
  };

  // Create or Update Stylist
  const handleSave = async () => {
    if (selectedStylist) {
      // Update existing stylist
      await axios.put(`http://127.0.0.1:8000/api/stylists/${selectedStylist.id}`, stylistData);
    } else {
      // Add new stylist
      await axios.post('http://127.0.0.1:8000/api/stylists', stylistData);
    }
    fetchStylists(); // Re-fetch the list of stylists
    closeModal();
  };

  // Delete Stylist
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this stylist?')) {
      await axios.delete(`http://127.0.0.1:8000/api/stylists/${id}`);
      fetchStylists(); // Re-fetch after delete
    }
  };

  return (
    <div className="p-4">
      {/* Button to Add New Stylist */}
      <button 
        onClick={() => openModal()} 
        className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-blue-600 transition"
      >
        Add New Stylist
      </button>

      {/* Table for displaying the stylists */}
      <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Expertise</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stylists.map((stylist) => (
            <tr key={stylist.id} className="border-t">
              <td className="px-4 py-2">{stylist.name}</td>
              <td className="px-4 py-2">{stylist.expertise}</td>
              <td className="px-4 py-2">
                <button 
                  onClick={() => openModal(stylist)} 
                  className="bg-yellow-400 text-white py-1 px-2 rounded-md mr-2 hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(stylist.id)} 
                  className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit Stylist */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">{selectedStylist ? 'Edit Stylist' : 'Add New Stylist'}</h2>
            <input
              type="text"
              value={stylistData.name}
              onChange={(e) => setStylistData({ ...stylistData, name: e.target.value })}
              placeholder="Stylist Name"
              className="border border-gray-300 p-2 rounded-md w-full mb-4"
            />
            <input
              type="text"
              value={stylistData.expertise}
              onChange={(e) => setStylistData({ ...stylistData, expertise: e.target.value })}
              placeholder="Expertise"
              className="border border-gray-300 p-2 rounded-md w-full mb-4"
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={stylistData.isAvailable}
                onChange={(e) => setStylistData({ ...stylistData, isAvailable: e.target.checked })}
                className="mr-2"
              />
              <label>Available</label>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={handleSave} 
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
              >
                Save
              </button>
              <button 
                onClick={closeModal} 
                className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Saloon;
