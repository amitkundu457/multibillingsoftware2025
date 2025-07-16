"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import Modal from "@/app/components/modal/page";
import {
  getSolutions,
  createSolution,
  updateSolution,
  deleteSolution,
  baseImageURL,
} from "@/app/components/config";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Page = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    invert: false,
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSolutionsData = async () => {
      try {
        const response = await getSolutions();
        setSolutions(response.data);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };
    fetchSolutionsData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Input changed - Name: ${name}, Value: ${value}`);
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
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("invert", formData.invert ? 1 : 0);

    try {
      const response = await createSolution(data);
      setMessage(response.data.message);
      setCreateModalOpen(false);
      setFormData({ title: "", description: "", invert: false });
      setImageFile(null);
      setSolutions((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error("Error creating solution:", error);
      setMessage("Failed to create solution. Please try again.");
    }
  };

  const handleEdit = (solution) => {
    setEditData(solution);
    setFormData({
      title: solution.title,
      description: solution.description,
      invert: solution.invert,
    });
    setEditModalOpen(true);
  };

  const updateSolutionData = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageFile) data.append("image", imageFile);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("invert", formData.invert ? 1 : 0);
    console.log(data);
    try {
      const response = await axios.post(
        ` https://api.equi.co.in/api/solutions/update/${editData.id}`,
        data,
        {
          //   headers: {
          //     "Content-Type": "multipart/form-data",
          //   },
        }
      );
      setMessage(response.data.message);
      setEditModalOpen(false);
      setSolutions((prev) =>
        prev.map((sol) =>
          sol.id === editData.id ? { ...sol, ...response.data.data } : sol
        )
      );
    } catch (error) {
      console.log("Error updating solution:", error);
      setMessage("Failed to update solution. Please try again.");
    }
  };

  const deleteSolutionData = async (id) => {
    if (!confirm("Are you sure you want to delete this solution?")) return;
    try {
      await deleteSolution(id);
      setSolutions((prev) => prev.filter((sol) => sol.id !== id));
      setMessage("Solution deleted successfully.");
    } catch (error) {
      console.error("Error deleting solution:", error);
      setMessage("Failed to delete solution. Please try again.");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between px-3">
        <h1 className="text-xl font-semibold">Solutions</h1>
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
              <th className="px-3 py-2 text-white bg-gray-700">Title</th>
              <th className="px-3 py-2 text-white bg-gray-700">Description</th>
              <th className="px-3 py-2 text-white bg-gray-700">Invert</th>
              <th className="px-3 py-2 text-white bg-gray-700 rounded-r">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((solution, index) => (
              <tr key={solution.id} className="border-b border-gray-200">
                <td className="px-3 py-2 text-center">{index + 1}</td>
                <td className="px-3 py-2 text-center">
                  <img
                    src={`${baseImageURL}${solution?.image}`}
                    alt="Solution"
                    width="100%"
                    height="auto"
                  />
                </td>
                <td className="px-3 py-2">{solution.title}</td>
                <td className="px-3 py-2">{solution.description}</td>
                <td className="px-3 py-2 text-center">
                  {solution.invert ? "Yes" : "No"}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    className="mr-2 text-blue-500"
                    onClick={() => handleEdit(solution)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteSolutionData(solution.id)}
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

      {/* Create New Solution Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Solution"
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
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-semibold"
            >
              Description:
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData((prev) => ({ ...prev, description: data }));
              }}
            />
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="invert" className="mr-2">
              Invert:
            </label>
            <input
              type="checkbox"
              id="invert"
              name="invert"
              checked={formData.invert}
              onChange={handleInputChange}
              className="w-4 h-4 border border-gray-300"
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

      {/* Edit Solution Modal */}
      {editData && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Solution"
        >
          <form onSubmit={updateSolutionData} encType="multipart/form-data">
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block mb-2 text-sm font-semibold"
              >
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
                htmlFor="title"
                className="block mb-2 text-sm font-semibold"
              >
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
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-semibold"
              >
                Description:
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData((prev) => ({ ...prev, description: data }));
                }}
              />
            </div>
            <div className="flex items-center mb-4">
              <label htmlFor="invert" className="mr-2">
                Invert:
              </label>
              <input
                type="checkbox"
                id="invert"
                name="invert"
                checked={formData.invert}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gray-300"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-500 rounded"
            >
              Update
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
};

export default Page;
