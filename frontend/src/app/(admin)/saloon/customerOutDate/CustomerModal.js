import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import { Notyf } from "notyf";
import { useForm } from "react-hook-form";
import "react-responsive-modal/styles.css";
import "notyf/notyf.min.css"; // Import Notyf styles

const CustomerModal = ({
  isModalOpen,
  closeModal,
  modalType,
  currentCustomer,
 // customerTypeData,
 // customerSubTypeData,
}) => {
  const [loading, setLoading] = useState(false);
       
     
    
       
    
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
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

  const notyf = new Notyf(); // Initialize Notyf for notifications

  useEffect(() => {
    // Reset form values if it's an edit, otherwise keep defaults
    if (modalType === "edit" && currentCustomer) {
      reset(currentCustomer); // Pre-fill form for editing customer
    } else {
      reset(); // Clear the form for create
    }
  }, [modalType, currentCustomer, reset]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = getCookie("access_token"); // Retrieve token
  
      const payload = {
        ...data,
       };
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
          "Content-Type": "application/json",
        },
      };

      if (modalType === "create") {
        await axios.post(" https://api.equi.co.in/api/customers", payload, config);
        notyf.success("Customer created successfully!");
      } else if (modalType === "edit") {
        await axios.post(
          ` https://api.equi.co.in/api/customers/${currentCustomer.id}`,
          payload,
          config
        );
        notyf.success("Customer updated successfully!");
      }

      closeModal();
      setLoading(false);
    } catch (error) {
      notyf.error("An error occurred while saving the customer!");
      console.error("Error saving customer:", error);
      setLoading(false);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={closeModal} center>
    <div className="p-6 w-[800px]">
      <h2 className="text-2xl font-bold mb-4">
        {modalType === "create" ? "Add Customer" : "Edit Customer"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex space-x-3">
          <div className="w-full">
            <label className="block text-gray-700">Phone</label>
            <input
              {...register("phone")}
              type="text"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="w-[300px]">
            <label className="block text-gray-700">Customer Name</label>
            <input
              {...register("name")}
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        
  
        
  
        
  
        {/* Gender Field */}
        <div className="w-full">
          <label className="block text-gray-700">Gender</label>
          <select
            {...register("gender",   )}
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
  
        {/* Other form fields */}
        <div className="flex space-x-3">
          <div className="w-full">
            <label className="block text-gray-700">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <div className="flex space-x-3">
          <div className="w-full">
            <label className="block text-gray-700">Address</label>
            <input
              {...register("address")}
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <div className="flex space-x-3">
          <div className="w-full">
            <label className="block text-gray-700">Pincode</label>
            <input
              {...register("pincode")}
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <div className="flex space-x-3">
          <div className="w-full">
            <label className="block text-gray-700">State</label>
            <input
              {...register("state")}
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <div className="flex space-x-3">
          <div className="w-full">
            <label className="block text-gray-700">Country</label>
            <input
              {...register("country")}
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded-md ${
            loading ? "bg-gray-400" : "bg-blue-500"
          }`}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : modalType === "create"
            ? "Add Customer"
            : "Update Customer"}
        </button>
      </form>
    </div>
  </Modal>
  
  );
};

export default CustomerModal;
