"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "tailwindcss/tailwind.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

import {
  getDistrubuters,
  createDistrubuter,
  updateDistrubuter,
  deleteDistrubuter,
  getemployees,
} from "@/app/components/config";

const DistributorManager = () => {
  const notyf = new Notyf();
  const [distributors, setDistributors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "create" or "edit"
  const [currentDistributor, setCurrentDistributor] = useState(null);
  const [formData, setFormData] = useState({
    user_id: "",
    company_name: "",
    company_logo: "",
    address: "",
    phone: "",
    website: "",
    commission: "",
    email: "",
    pan_number: "",
    gst_number: "",
    ifsc_code: "",
    bank_name: "",
    account_number: "",
    account_holder_name: "",
    account_type: "",
    status: "",
  });

  const fetchDistributors = useCallback(async () => {
    try {
      const response = await getDistrubuters();
      setDistributors(response.data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      notyf.error("Failed to load distributors.");
    }
  }, []); // No dependencies, so this function is memoized and won't change

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await getemployees();
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      notyf.error("Failed to load employees.");
    }
  }, []); // No dependencies, so this function is memoized and won't change

  useEffect(() => {
    fetchDistributors();
    fetchEmployees();
  }, [fetchDistributors, fetchEmployees]);

  const openModal = (type, id = null) => {
    setModalType(type);
    if (type === "edit" && id) {
      const distributor = distributors.find((d) => d.id === id);
      if (distributor) {
        setCurrentDistributor(distributor);
        setFormData(distributor);
      }
    } else {
      setFormData({
        user_id: "",
        company_name: "",
        company_logo: "",
        address: "",
        phone: "",
        website: "",
        commission: "",
        email: "",
        pan_number: "",
        gst_number: "",
        ifsc_code: "",
        bank_name: "",
        account_number: "",
        account_holder_name: "",
        account_type: "",
        status: "",
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
      return null;
    };

    const token = getCookie("access_token");
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const url =
      modalType === "create"
        ? "http://127.0.0.1:8000/api/distrubuters"
        : `http://127.0.0.1:8000/api/distrubuters/${currentDistributor.id}`;

    try {
      if (modalType === "create") {
        await axios.post(url, formData, config);
        notyf.success("Distributor created successfully!");
      } else {
        await axios.put(url, formData, config);
        notyf.success("Distributor updated successfully!");
      }
      fetchDistributors();
      closeModal();
    } catch (error) {
      console.error("Error processing the request:", error);
      notyf.error("Failed to process the request.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDistrubuter(id);
      notyf.success("Distributor deleted successfully!");
      fetchDistributors();
    } catch (error) {
      console.error("Error deleting distributor:", error);
      notyf.error("Failed to delete distributor.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1>Distributor Management</h1>
        <button
          onClick={() => openModal("create")}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add Distributor
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Company Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {distributors.map((distributor) => (
              <tr key={distributor.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{distributor.company_name}</td>
                <td className="px-4 py-2 border">{distributor.phone}</td>
                <td className="px-4 py-2 border">{distributor.email}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => openModal("edit", distributor.id)}
                    className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(distributor.id)}
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        center
        className="custom-modal"
      >
        <h2 className="mb-4 text-xl font-bold">
          {modalType === "create" ? "Add New Distributor" : "Edit Distributor"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* User ID */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Company Name */}
          <div>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Company Logo */}
          <div>
            <input
              type="text"
              name="company_logo"
              value={formData.company_logo}
              onChange={handleChange}
              placeholder="Company Logo URL"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Address */}
          <div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Website */}
          <div>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              type="number"
              name="commission"
              value={formData.commission}
              onChange={handleChange}
              placeholder="Commission"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* PAN Number */}
          <div>
            <input
              type="text"
              name="pan_number"
              value={formData.pan_number}
              onChange={handleChange}
              placeholder="PAN Number"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* GST Number */}
          <div>
            <input
              type="text"
              name="gst_number"
              value={formData.gst_number}
              onChange={handleChange}
              placeholder="GST Number"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* IFSC Code */}
          <div>
            <input
              type="text"
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={handleChange}
              placeholder="IFSC Code"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Bank Name */}
          <div>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="Bank Name"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Account Number */}
          <div>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="Account Number"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Account Holder Name */}
          <div>
            <input
              type="text"
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={handleChange}
              placeholder="Account Holder Name"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Account Type */}
          <div>
            <select
              name="account_type"
              value={formData.account_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Account Type</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end col-span-2">
            <button
              type="submit"
              className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              {modalType === "create" ? "Create" : "Update"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DistributorManager;
