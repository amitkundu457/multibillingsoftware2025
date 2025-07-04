"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
// import Modal from "@/app/components/modal/page";
import Modal from "../../../components/modal/page";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  baseImageURL,
} from "../../../components/config";
// import AuthJs from "@/app/components/withAuth";
import AuthJs from "../../../components/withAuth";
import { useRouter } from "next/navigation"; // Ensure useRouter is imported
// @/app/components/config
const BrandsPage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState("");

  const [isClient, setIsClient] = useState(false); // State to track if the client-side is rendered
  // const router = useRouter(); // Move this inside useEffect for client-side rendering

  useEffect(() => {
    setIsClient(true); // Mark as client-side after the first render
  }, []);

  // Ensure router is used only on the client-side
  useEffect(() => {
    if (isClient) {
      // Perform actions that depend on the router
    }
  }, [isClient]);

  useEffect(() => {
    fetchBrandsData();
  }, []);

  const fetchBrandsData = async () => {
    try {
      const response = await getBrands();
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", imageFile);
    data.append("name", formData.name);

    try {
      const response = await createBrand(data);
      setMessage(response.data.message);
      setCreateModalOpen(false);
      setFormData({ name: "", image: "" });
      setImageFile(null);
      fetchBrandsData();
      setBrands((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error("Error creating brand:", error);
      setMessage("Failed to create brand. Please try again.");
    }
  };

  const handleEdit = (brand) => {
    setEditData(brand);
    setFormData({ name: brand.name, image: brand.image });
    setEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageFile) data.append("image", imageFile);
    data.append("name", formData.name);

    try {
      const response = await updateBrand(editData.id, data);
      setMessage(response.data.message);
      fetchBrandsData();
      setEditModalOpen(false);
      setBrands((prev) =>
        prev.map((brand) =>
          brand.id === editData.id ? { ...brand, ...response.data.data } : brand
        )
      );
    } catch (error) {
      console.error("Error updating brand:", error);
      setMessage("Failed to update brand. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await deleteBrand(id);
      setBrands((prev) => prev.filter((brand) => brand.id !== id));
      setMessage("Brand deleted successfully.");
      fetchBrandsData();
    } catch (error) {
      console.error("Error deleting brand:", error);
      setMessage("Failed to delete brand. Please try again.");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between px-3">
        <h1 className="text-xl font-semibold">Brands</h1>
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
              <th className="px-3 py-2 text-white bg-gray-700 rounded-r">Action</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand?.id} className="border-b border-gray-200">
                <td className="px-3 py-2 text-center">{index + 1}</td>
                <td className="px-3 py-2 text-center">
                  <img
                    src={`${baseImageURL}${brand?.image}`}
                    alt="Brand"
                    width="100"
                    height="auto"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    className="mr-2 text-blue-500"
                    onClick={() => handleEdit(brand)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(brand.id)}
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
        title="Create New Brand"
      >
        <form onSubmit={handleCreateSubmit} encType="multipart/form-data">
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
          <button
            type="submit"
            className="px-5 py-2 font-semibold text-white bg-green-500 rounded"
          >
            Submit
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Brand"
      >
        <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-semibold">
              Brand Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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

export default BrandsPage;
