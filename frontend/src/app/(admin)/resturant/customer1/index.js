"use client";
import React, { useEffect, useState } from "react";
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
  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const notifyTokenMissing = () => {
    if (typeof window !== "undefined" && window.notyf) {
      window.notyf.error("Authentication token not found!");
    } else {
      console.error("Authentication token not found!");
    }
  };







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
  const notyf = new Notyf(); // Initialize Notyf

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get(" http://127.0.0.1:8000/api/customers");
      setCustomers(data);
    } catch (error) {
      notyf.error("Error fetching customers!");
      console.error("Error fetching customers:", error);
    }
  };

  // Handle Create/Update
  const onSubmit = async (data) => {
    try {
      if (modalType === "create") {
        await axios.post(" http://127.0.0.1:8000/api/customers", data);
        notyf.success("Customer created successfully!");
      } else if (modalType === "edit") {
        await axios.post(
          ` http://127.0.0.1:8000/api/customers/${currentCustomer.id}`,
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

  //CustomersubType Handler
  const handlerCustomberSubType = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    const data = await axios.get(" http://127.0.0.1:8000/api/customersubtypes",
      
{
  headers: { Authorization: `Bearer ${token}` },
}
    );
    console.log("customerSubType", data);
  };

  //CustomerType Handler
  const handlerCustomberType = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    const data = await axios.get(" http://127.0.0.1:8000/api/customerstype",
      
{
  headers: { Authorization: `Bearer ${token}` },
}
    );
    console.log("customerType", data);
  };

  useEffect(()=>{
    handlerCustomberSubType();
    handlerCustomberType()


  },[])
  // Handle Delete
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(` http://127.0.0.1:8000/api/customers/${id}`);
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

  useEffect(() => {
    fetchCustomers();
  }, []);

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
          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Customer Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                {...register("phone")}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Customer Type</label>
              <select
                // {...register("customerType")}
                className="w-full border p-2"
                required
              >
                <option value="">Select Customer Type</option>
                <option value="retail">Retail</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Customer Sub Type</label>
              <select
                // {...register("customerSubType")}
                className="w-full border p-2"
                required
              >
                <option value="">Select Customer Sub Type</option>
                <option value="retail">Retail</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">DOB</label>
              <input
                type="date"
                {...register("dob")}
                className="w-full border p-2"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Anniversary</label>
              <input
                type="date"
                {...register("anniversary")}
                className="w-full border p-2"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full border p-2"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Gender</label>
              <select
                {...register("gender")}
                className="w-full border p-2"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              {...register("address")}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Pincode</label>
              <input
                type="text"
                {...register("pincode")}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">State</label>
              <input
                type="text"
                {...register("state")}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                {...register("country")}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-500 rounded"
          >
            {modalType === "create" ? "Create" : "Update"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
