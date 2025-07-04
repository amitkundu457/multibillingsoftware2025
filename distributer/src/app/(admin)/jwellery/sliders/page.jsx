"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "@/app/components/modal/page";

import {
  getSliders,
  createSliders,
  updateSliders,
  deleteSliders,
  baseImageURL,
} from "@/app/components/config";

const Page = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    title: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch data from API
  useEffect(() => {
    fetchSlidersData();
  }, []);
  const fetchSlidersData = async () => {
    try {
      const response = await getSliders();
      setSliders(response.data);
    } catch (error) {
      console.log("Error fetching sliders:", error);
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
    data.append("title", formData.title);

    try {
      const response = await createSliders(data);
      setMessage(response.data.message);
      setCreateModalOpen(false);
      setFormData({ image: "", description: "", title: "" });
      setImageFile(null);
      fetchSlidersData();
      setSliders((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error("Error creating slider:", error);
      setMessage("Failed to create slider. Please try again.");
    }
  };

  const handleEdit = (slider) => {
    setEditData(slider);
    setFormData({
      image: slider.image,
      description: slider.description,
      title: slider.title,
    });
    setEditModalOpen(true);
  };

  const updateSliderData = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageFile) data.append("image", imageFile);
    data.append("description", formData.description);
    title;
    data.append("title", formData.title);

    try {
      const response = await updateSliders(editData.id, data);
      setMessage(response.data.message);
      setEditModalOpen(false);
      fetchSlidersData();
      setSliders((prev) =>
        prev.map((slider) =>
          slider.id === editData.id
            ? { ...slider, ...response.data.data }
            : slider
        )
      );
    } catch (error) {
      console.error("Error updating slider:", error);
      setMessage("Failed to update slider. Please try again.");
    }
  };

  const deleteSliderData = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;
    try {
      await deleteSliders(id);
      setSliders((prev) => prev.filter((slider) => slider.id !== id));
      setMessage("Slider deleted successfully.");
      fetchSlidersData();
    } catch (error) {
      console.log("Error deleting slider:", error);
      setMessage("Failed to delete slider. Please try again.");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between px-3">
        <h1 className="text-xl font-semibold">Sliders</h1>
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
              <th className="px-3 py-2 text-white bg-gray-700">Title</th>
              <th className="px-3 py-2 text-white bg-gray-700 rounded-r">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((slider, index) => (
              <tr key={slider?.id} className="border-b border-gray-200">
                <td className="px-3 py-2 text-center">{index + 1}</td>
                <td className="px-3 py-2 text-center">
                  <img
                    src={`${baseImageURL}${slider?.image}`}
                    alt="Slider"
                    width="100"
                    height="auto"
                  />
                </td>
                <td className="px-3 py-2">{slider?.description}</td>
                <td className="px-3 py-2">{slider?.title}</td>
                <td className="px-3 py-2 text-center">
                  <button
                    className="mr-2 text-blue-500"
                    onClick={() => handleEdit(slider)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteSliderData(slider?.id)}
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

      {/* Create New Slider Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Slider"
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
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-semibold"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
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

      {/* Edit Slider Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Slider"
      >
        <form onSubmit={updateSliderData} encType="multipart/form-data">
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
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-semibold"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-semibold">
              Title
            </label>
            <textarea
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
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

export default Page;
