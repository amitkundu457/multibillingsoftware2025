"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "@/app/components/modal/page";
import {
  getEcosystems,
  createEcosystem,
  updateEcosystem,
  deleteEcosystem,
  baseImageURL
} from "@/app/components/config";

const Ecosystem = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    description:'',
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [ecosystem, setEcosystem] = useState([]);
  const [message, setMessage] = useState("");


  // Fetch data from API
  useEffect(() => {
   
    fetchEcosystemData();
  }, []);
 const fetchEcosystemData = async () => {
      try {
        const response = await getEcosystems();
        setEcosystem(response.data);
      } catch (error) {
        console.log("Error fetching ecosystems:", error);
      }
    };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", imageFile);
    data.append("description", formData.description);

    try {
      const response = await createEcosystem(data);
      setMessage(response.data.message);
      setCreateModalOpen(false);
      setFormData({ image: "", description: "" });
      fetchEcosystemData()
      setImageFile(null);
      setEcosystem((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error("Error creating ecosystem:", error);
      setMessage("Failed to create ecosystem. Please try again.");
    }
  };

  const handleEdit = (ecosystem) => {
    setEditData(ecosystem);
    setFormData({
      image: ecosystem.image,
      description: ecosystem.description,
    });
    setEditModalOpen(true);
  };

  const updateEcosystemData = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageFile) data.append("image", imageFile);
    data.append("description", formData.description);

    try {
      const response = await updateEcosystem(editData.id, data);
      setMessage(response.data.message);
      fetchEcosystemData()
      setEditModalOpen(false);
      setEcosystem((prev) =>
        prev.map((eco) =>
          eco.id === editData.id ? { ...eco, ...response.data.data } : eco
        )
      );
    } catch (error) {
      console.error("Error updating ecosystem:", error);
      setMessage("Failed to update ecosystem. Please try again.");
    }
  };

  const deleteEcosystemData = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ecosystem?"))
      return;
    try {
      await deleteEcosystem(id);
      setEcosystem((prev) => prev.filter((eco) => eco.id !== id));
      setMessage("Ecosystem deleted successfully.");
      fetchEcosystemData()
    } catch (error) {
      console.log("Error deleting ecosystem:", error);
      setMessage("Failed to delete ecosystem. Please try again.");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between px-3">
        <h1 className="text-xl font-semibold">Ecosystem</h1>
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
              <th className="px-3 py-2 text-white bg-gray-700">Image</th>
              <th className="px-3 py-2 text-white bg-gray-700">Description</th>
              <th className="px-3 py-2 text-white bg-gray-700 rounded-r">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {ecosystem.map((ecosystem, index) => (
              <tr key={ecosystem?.id} className="border-b border-gray-200">
                <td className="px-3 py-2 text-center">{index + 1}</td>
                <td className="px-3 py-2 text-center">
                  <img
                    src={`${baseImageURL}${ecosystem?.image}`}
                    alt="Ecosystem"
                    width="100"
                    height="auto"
                  />
                </td>
                <td className="px-3 py-2">{ecosystem?.description}</td>
                <td className="px-3 py-2 text-center">
                  <button
                    className="mr-2 text-blue-500"
                    onClick={() => handleEdit(ecosystem)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteEcosystemData(ecosystem?.id)}
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

      {/* Create New Ecosystem Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Ecosystem"
      >
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 text-sm font-semibold">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-5 py-2 font-semibold text-white bg-green-500 rounded"
          >
            Submit
          </button>
        </form>
      </Modal>

      {/* Edit Ecosystem Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Ecosystem"
      >
        <form onSubmit={updateEcosystemData} encType="multipart/form-data">
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
            <label htmlFor="description" className="block mb-2 text-sm font-semibold">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-5 py-2 font-semibold text-white bg-green-500 rounded"
          >
            Submit
          </button>
        </form>
      </Modal>
    </section>
  );
};

export default Ecosystem;
