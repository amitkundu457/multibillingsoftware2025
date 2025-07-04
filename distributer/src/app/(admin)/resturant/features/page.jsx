"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "@/app/components/modal/page";
import { getTabs,updateTabs,createTabs,deleteTabs,baseImageURL } from "@/app/components/config";

const Page = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    descrition: "", // Changed from description to descrition
    image: "",
    icon: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch tabs data
  useEffect(() => {
    const fetchTabsData = async () => {
    try {
        const response = await getTabs();
        if (response.data && response.data.success) {
          setFeatures(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching features:", error);
      }
    };
    fetchTabsData();
  }, []);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image file change handler
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Icon file change handler
  const handleIconChange = (e) => {
    setIconFile(e.target.files[0]);
  };

  // Submit new tab
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageFile) data.append("image", imageFile);
    if (iconFile) data.append("icon", iconFile);
    data.append("title", formData.title);
    data.append("descrition", formData.descrition); // Changed to descrition

    try {
      const response = await createTabs(data);
      setMessage(response.data.message);
      setCreateModalOpen(false);
      setFormData({ title: "", descrition: "", image: "", icon: "" });
      setImageFile(null);
      setIconFile(null);
      setTabs((prev) => {
        const newTabs = [...prev, response.data.data];
        localStorage.setItem("tabs", JSON.stringify(newTabs)); // Update localStorage with new data
        return newTabs;
      });
    } catch (error) {
      console.error("Error creating tab:", error);
      setMessage("Failed to create tab. Please try again.");
    }
  };

  // Edit tab handler
  const handleEdit = (tab) => {
    setEditData(tab);
    setFormData({
      title: tab.title,
      descrition: tab.descrition, // Changed to descrition
      image: tab.image,
      icon: tab.icon,
    });
    setEditModalOpen(true);
  };

  // Update tab
  const updateTabData = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageFile) data.append("image", imageFile);
    if (iconFile) data.append("icon", iconFile);
    data.append("title", formData.title);
    data.append("descrition", formData.descrition); // Changed to descrition

    try {
      const response = await updateTabs(editData.id, data);
      setMessage(response.data.message);
      setEditModalOpen(false);
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === editData.id ? { ...tab, ...response.data.data } : tab
        )
      );
      localStorage.setItem("tabs", JSON.stringify(tabs)); // Update localStorage with updated data
    } catch (error) {
      console.error("Error updating tab:", error);
      setMessage("Failed to update tab. Please try again.");
    }
  };

  // Delete tab
  const deleteTabData = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tab?")) return;
    try {
      await deleteTabs(id);
      setTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== id);
        localStorage.setItem("tabs", JSON.stringify(newTabs)); // Update localStorage with the deleted data
        return newTabs;
      });
      setMessage("Tab deleted successfully.");
    } catch (error) {
      console.error("Error deleting tab:", error);
      setMessage("Failed to delete tab. Please try again.");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between px-3">
        <h1 className="text-xl font-semibold">Tabs</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/50 rounded flex items-center gap-1"
        >
          <FaPlus /> <span>Create New</span>
        </button>
      </div>
      <div className="py-4 text-left">
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              <th className="px-3 py-2 text-white bg-gray-700 rounded-l">#</th>
              <th className="px-3 py-2 text-white bg-gray-700">Title</th>
              <th className="px-3 py-2 text-white bg-gray-700">Image</th>
              <th className="px-3 py-2 text-white bg-gray-700">Icon</th>
              <th className="px-3 py-2 text-white bg-gray-700">Descrition</th>
              <th className="px-3 py-2 text-white bg-gray-700 rounded-r">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tabs) &&
              tabs.map((tab, index) => (
                <tr key={tab?.id} className="border-b border-gray-200">
                  <td className="px-3 py-2 text-center">{index + 1}</td>
                  <td className="px-3 py-2">{tab?.title}</td>
                  <td className="px-3 py-2 text-center">
                    <img
                      src={`${baseImageURL}${tab?.image}`}
                      alt="Tab Image"
                      width="100"
                      height="auto"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <img
                      src={`${baseImageURL}${tab?.icon}`}
                      alt="Tab Icon"
                      width="50"
                      height="auto"
                    />
                  </td>
                  <td className="px-3 py-2">{tab?.descrition}</td> {/* Changed to descrition */}
                  <td className="px-3 py-2 text-center">
                    <button
                      className="mr-2 text-blue-500"
                      onClick={() => handleEdit(tab)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => deleteTabData(tab.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {message && (
        <div className="mt-4 font-semibold text-green-600">{message}</div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Tab"
      >
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-semibold">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 text-sm font-semibold">
              Image File:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="icon" className="block mb-2 text-sm font-semibold">
              Icon File:
            </label>
            <input
              type="file"
              id="icon"
              name="icon"
              onChange={handleIconChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="descrition"
              className="block mb-2 text-sm font-semibold"
            >
              Description:
            </label>
            <textarea
              id="descrition"
              name="descrition" // Changed to descrition
              value={formData.descrition} // Changed to descrition
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-white bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-500 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Tab"
      >
        <form onSubmit={updateTabData} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-semibold">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 text-sm font-semibold">
              Image File:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="icon" className="block mb-2 text-sm font-semibold">
              Icon File:
            </label>
            <input
              type="file"
              id="icon"
              name="icon"
              onChange={handleIconChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="descrition"
              className="block mb-2 text-sm font-semibold"
            >
              Description:
            </label>
            <textarea
              id="descrition"
              name="descrition"
              value={formData.descrition} // Changed to descrition
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-white bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-500 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default Page;
