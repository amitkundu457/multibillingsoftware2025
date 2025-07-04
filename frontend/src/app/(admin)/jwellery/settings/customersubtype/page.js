"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import {
  customersubtypes,
  createCustomersubtype,
  updateCustomersubtype,
  deleteCustomersubtype,
  getCustomertype,
} from "@/app/components/config";

// Dynamically import the Modal component
const Modal = dynamic(() => import("react-responsive-modal"), { ssr: false });

const CustomerSubTypes = () => {
  const [data, setData] = useState([]);
  const [types, setTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [editData, setEditData] = useState(null);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      type_id: "",
      name: "",
    },
  });
  const notyf = typeof window !== "undefined" ? new Notyf() : null; // Ensure Notyf is only initialized on the client side

  const fetchCustomerSubtypes = async () => {
    try {
      const response = await customersubtypes();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching customer subtypes:", error);
      if (notyf) notyf.error("Error fetching customer subtypes.");
    }
  };

  const fetchCustomerTypes = async () => {
    try {
      const response = await getCustomertype();
      setTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching customer types:", error);
      if (notyf) notyf.error("Error fetching customer types.");
    }
  };

  useEffect(() => {
    fetchCustomerSubtypes();
    fetchCustomerTypes();
  }, []);

  const onSubmit = async (formData) => {
    try {
      if (modalType === "create") {
        await createCustomersubtype(formData);
        if (notyf) notyf.success("Customer Subtype created successfully!");
      } else if (modalType === "edit") {
        await updateCustomersubtype(editData.id, formData);
        if (notyf) notyf.success("Customer Subtype updated successfully!");
      }
      fetchCustomerSubtypes();
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
      if (notyf) notyf.error("Error saving data.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this customer subtype?")) {
      try {
        await deleteCustomersubtype(id);
        if (notyf) notyf.success("Customer Subtype deleted successfully!");
        fetchCustomerSubtypes();
      } catch (error) {
        console.error("Error deleting customer subtype:", error);
        if (notyf) notyf.error("Error deleting customer subtype.");
      }
    }
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    if (type === "edit") setEditData(data);
    reset(data || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    reset();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Sub Types</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => openModal("create")}
      >
        Add Customer Sub Type
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border">{item.id}</td>
                <td className="py-2 px-4 border">{item.customer_type.name}</td>
                <td className="py-2 px-4 border">{item.name}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                    onClick={() => openModal("edit", item)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={isModalOpen} onClose={closeModal} center>
        <h2 className="mb-4 text-xl font-bold">
          {modalType === "create" ? "Add Customer Sub Type" : "Edit Customer Sub Type"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Type</label>
            <select
              className="w-full p-2 border rounded"
              {...register("type_id", { required: true })}
            >
              <option value="">Select Category Type</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full p-2 border rounded"
              placeholder="Enter Sub Type Name"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            {modalType === "create" ? "Create" : "Update"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerSubTypes;
