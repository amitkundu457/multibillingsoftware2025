"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import Image from "next/image";
import {
  getcompany,
  baseImageURL,
  getRate,
  getProductService,
  createProductService,
  updateProductService,
  getServiceGroup,
  getType,
  deleteProductService,
} from "@/app/components/config";

const ItemManagement = () => {
  const [items, setItems] = useState([]); // Stores item data
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [currentItem, setCurrentItem] = useState(null); // Current item for editing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState([]);
  const [rate, setRate] = useState([]);
  const [group, setGroup] = useState([]);
  const [type, setItemstype] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    code: "",
    company_id: "",
    group_id: "",
    input_gst: "0%",
    output_gst: "0%",
    rate: 0,
    mrp: 0,
    commission: 0,
    stock_maintain: false,
    hsn: "",
    rate_type: "",
    image: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductService();
        setItems(response.data); // Assuming the API returns an array
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
    fetchItemsrate();
    fetchItemscompany();
    fetchItemsgrop();
    fetchItemstype();
  }, []);

  console.log(baseImageURL);

  const fetchItemsrate = async () => {
    try {
      const response = await getRate();
      setRate(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchItemscompany = async () => {
    try {
      const response = await getcompany();
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchItemsgrop = async () => {
    try {
      const response = await getServiceGroup();
      setGroup(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchItemstype = async () => {
    try {
      const response = await getType();
      setItemstype(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Handle save (Create/Update)
  const handleSave = async (e) => {
    e.preventDefault();

    // Prepare FormData
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      if (currentItem) {
        // Update an existing item using updateProductService
        await updateProductService(currentItem.id, formDataToSend);
      } else {
        // Create a new item using createProductService
        const response = await createProductService(formDataToSend);

        // Add the new item to the state
        // setItems((prev) => [...prev, response.data]);
      }

      // Close modal and reset form
      setOpenModal(false);
      setCurrentItem(null);
      resetForm();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData(item); // Populate the form with the selected item
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      // Use the deleteProductService function to send DELETE request
      await deleteProductService(id);

      // Remove the deleted item from the state
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      // Optionally, show an error message
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      code: "",
      company_id: "",
      group_id: "",
      input_gst: "0%",
      output_gst: "0%",
      rate_type: 0,
      rate: 0,
      mrp: 0,
      commission: 0,
      stock_maintain: false,
      hsn: "",
      image: null,
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Item Management</h1>
        <button
          onClick={() => {
            setOpenModal(true);
            resetForm();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Item....
        </button>
      </div>

      {/* Table */}
      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
            <th className="p-3">Item </th>
            <th className="p-3">Item Name</th>
            <th className="p-3">Code</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3">
                <img
                  src={`${baseImageURL}storage/${item.image}`}
                  alt={item.name || "Image"}
                  width={100}
                  height={100}
                  layout="intrinsic"
                />
              </td>
              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.code}</td>
              <td className="p-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.code)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)} center>
        <h2 className="text-xl font-bold mb-4">
          {currentItem ? "Edit Item" : "Add Item"}
        </h2>
        <form onSubmit={handleSave} className="space-y-4" encType="">
          <div className="grid grid-cols-2 gap-4">
            {/* Fields */}
            {[
              { label: "Item Name", name: "name", type: "text" },
              { label: "Code", name: "code", type: "text" },
              { label: "MRP", name: "mrp", type: "number" },
              { label: "Rate", name: "rate", type: "number" },
              { label: "HSN", name: "hsn", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rate Type
              </label>
              <select
                name="rate_type"
                value={formData.rate_type}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>Select item type</option>
                {type.map((rates) => (
                  <option key={rates.id} value={rates.id}>
                    {rates.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>Select item type</option>
                {rate.map((rates) => (
                  <option key={rates.id} value={rates.id}>
                    {rates.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>Select item type</option>
                {company.map((rates) => (
                  <option key={rates.id} value={rates.id}>
                    {rates.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Group
              </label>
              <select
                name="group_id"
                value={formData.group_id}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>Select item Group</option>
                {group.map((rates) => (
                  <option key={rates.id} value={rates.id}>
                    {rates.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select GST */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Input GST
              </label>
              <select
                name="input_gst"
                value={formData.input_gst}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>0%</option>
                <option>5%</option>
                <option>12%</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Output GST
              </label>
              <select
                name="output_gst"
                value={formData.output_gst}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>0%</option>
                <option>5%</option>
                <option>12%</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              {currentItem ? "Update Item" : "Add Item"}
            </button>
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ItemManagement;
