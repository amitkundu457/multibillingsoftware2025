"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "@/app/components/modal/page";
import {
    getServices ,createServices,
  baseImageURL,
  updateServices,
  deleteServices
} from "@/app/components/config";


const Page = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
   
    fetchServiceData();
  }, []);
 const fetchServiceData = async () => {
      try {
        const response = await getServices();
        setServices(response.data);
      } catch (error) {
        console.log("Error fetching services:", error);
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

    try {
      const response = await createServices(data);
      setMessage(response.data.message);
      setCreateModalOpen(false);
      setFormData({ image: ""});
      setImageFile(null);
      setServices((prev) => [...prev, response.data.data]);
       fetchServiceData();
    } catch (error) {
      console.error("Error creating service:", error);
      setMessage("Failed to create service. Please try again.");
    }
  };

  const handleEdit = (service) => {
    setEditData(service);
    setFormData({
      image: service.image,
      description: service.description,
    });
    setEditModalOpen(true);
  };

  const updateServiceData = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageFile) data.append("image", imageFile);
    

    try {
      const response = await updateServices(editData.id, data);
      setMessage(response.data.message);
      setEditModalOpen(false);
       fetchServiceData();
      setServices((prev) =>
        prev.map((service) =>
          service.id === editData.id ? { ...service, ...response.data.data } : service
        )
      );
    } catch (error) {
      console.error("Error updating service:", error);
      setMessage("Failed to update service. Please try again.");
    }
  };

  const deleteServiceData = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await deleteServices(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
      setMessage("Service deleted successfully.");
       fetchServiceData();
    } catch (error) {
      console.log("Error deleting service:", error);
      setMessage("Failed to delete service. Please try again.");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between px-3">
        <h1 className="text-xl font-semibold">Services</h1>
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
              
              <th className="px-3 py-2 text-white bg-gray-700 rounded-r">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service?.id} className="border-b border-gray-200">
                <td className="px-3 py-2 text-center">{index + 1}</td>
                <td className="px-3 py-2 text-center">
                  <img
                    src={`${baseImageURL}${service?.image}`}
                    alt="Service"
                    width="100"
                    height="auto"
                  />
                </td>
                {/* <td className="px-3 py-2">{service?.description}</td> */}
                <td className="px-3 py-2 text-center">
                  <button
                    className="mr-2 text-blue-500"
                    onClick={() => handleEdit(service)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteServiceData(service.id)}
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

      {/* Create New Service Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Service"
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
            {/* <label htmlFor="description" className="block mb-2 text-sm font-semibold">
              Description:
            </label> */}
            {/* <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            ></textarea> */}
          </div>
          <button
            type="submit"
            className="px-5 py-2 font-semibold text-white bg-green-500 rounded"
          >
            Submit
          </button>
        </form>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Service"
      >
        <form onSubmit={updateServiceData} encType="multipart/form-data">
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
          {/* <div className="mb-4">
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
          </div> */}
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
