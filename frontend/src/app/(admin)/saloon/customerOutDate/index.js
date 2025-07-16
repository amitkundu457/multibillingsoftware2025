 "use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import { Notyf } from "notyf";
import "react-responsive-modal/styles.css";
import "notyf/notyf.min.css"; // Import Notyf styles
import CustomerModal from "./CustomerModal"; // Import CustomerModal

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [customerTypeData, setCustomerTypeData] = useState([]);
  const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
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







  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const token = getCookie("access_token"); // Retrieve token
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      };
  
      const { data } = await axios.get(" https://api.equi.co.in/api/customers", config);
      setCustomers(data);
    } catch (error) {
      notyf.error("Error fetching customers!");
      console.error("Error fetching customers:", error);
    }
  };
  

  // Handle Create/Update
  const onSubmit = async (data) => {
    try {
      const token = getCookie("access_token"); // Retrieve token
  
      const payload = {
        ...data,
        customer_type: data.customerType, // Mapping to backend's expected field
        customer_sub_type: data.customerSubType || null, // Ensure the sub type is sent as null if not provided
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
        await axios.delete(` https://api.equi.co.in/api/customers/${id}`);
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

  // Fetch customer type data
  useEffect(() => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    axios
      .get(" https://api.equi.co.in/api/customerstype",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ) // Correct endpoint for customer types
      .then((response) => {
        console.log(response.data);

        setCustomerTypeData(response.data.data); // Ensure data format is correct
      })
      .catch(() => {
        alert("Failed to fetch customer types");
      });
  }, []);

  // Fetch customer sub-type data
  useEffect(() => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    axios
      .get(" https://api.equi.co.in/api/customersubtypes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ) // Correct endpoint for sub-types
      .then((response) => {
        setCustomerSubTypeData(response.data); // Ensure response is correctly formatted
      })
      .catch(() => {
        alert("Failed to fetch customer sub-types");
      });
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
            <th className="px-4 py-2 border border-gray-300">Name</th>
            <th className="px-4 py-2 border border-gray-300">Address</th>
            <th className="px-4 py-2 border border-gray-300">Pincode</th>
            <th className="px-4 py-2 border border-gray-300">Phone</th>
            <th className="px-4 py-2 border border-gray-300">State</th>
            <th className="px-4 py-2 border border-gray-300">Country</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="px-4 py-2 border border-gray-300">
                {customer.name}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.address}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.pincode}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.phone}
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
      <CustomerModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        modalType={modalType}
        currentCustomer={currentCustomer}
        customerTypeData={customerTypeData}
        customerSubTypeData={customerSubTypeData}
        register={register}
        handleSubmit={handleSubmit}
        reset={reset}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default Customers;
