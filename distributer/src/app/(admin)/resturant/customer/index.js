"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import { Notyf } from "notyf";
import "react-responsive-modal/styles.css";
import "notyf/notyf.min.css"; // Import Notyf styles

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      customerType: "",
      customerSubType: "",
      dob: "",
      anniversary: "",
      email: "",
      gender: "",
      address: "",
      pincode: "",
      state: "",
      country: "",
    },
  });

  // Memoize the notyf instance
  const notyf = useMemo(() => new Notyf(), []);

  const fetchCustomers = useCallback(async () => {
    try {
      const { data } = await axios.get("http://127.0.0.1:8000/api/customers");
      setCustomers(data);
    } catch (error) {
      notyf.error("Error fetching customers!");
      console.error("Error fetching customers:", error);
    }
  }, [notyf]); // Include notyf in the dependency array

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]); // Dependency is fetchCustomers

  // Handle Create/Update
  const onSubmit = async (data) => {
    try {
      if (modalType === "create") {
        await axios.post("http://127.0.0.1:8000/api/customers", data);
        notyf.success("Customer created successfully!");
      } else if (modalType === "edit") {
        await axios.post(
          `http://127.0.0.1:8000/api/customers/${currentCustomer.id}`,
          data
        );
        notyf.success("Customer updated successfully!");
      }

      fetchCustomers();
      closeModal();
    } catch (error) {
      notyf.error("An error occurred while saving the customer!");
      console.error("Error saving customer:", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/customers/${id}`);
        notyf.success("Customer deleted successfully!");
        fetchCustomers();
      } catch (error) {
        notyf.error("Error deleting customer!");
        console.error("Error deleting customer:", error);
      }
    }
  };

  // Open Modal
  const openModal = (type, customer = null) => {
    setModalType(type);
    setCurrentCustomer(customer);
    if (type === "edit") reset(customer); // Pre-fill form for edit
    else reset(); // Clear form for create
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">Customers</h1>
        <button
          onClick={() => openModal("create")}
          className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
        >
          Add Customer
        </button>
      </div>

      {/* Customer Table */}
      <table className="w-full border border-collapse border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">User ID</th>
            <th className="px-4 py-2 border border-gray-300">Address</th>
            <th className="px-4 py-2 border border-gray-300">Pincode</th>
            <th className="px-4 py-2 border border-gray-300">State</th>
            <th className="px-4 py-2 border border-gray-300">Country</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="px-4 py-2 border border-gray-300">
                {customer.user_id}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.address}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.pincode}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.state}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.country}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  onClick={() => openModal("edit", customer)}
                  className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <h2 className="mb-4 text-xl font-bold">
          {modalType === "create" ? "Add Customer" : "Edit Customer"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form content */}
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
