"use client";
import React, { useState, useEffect,useCallback } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import ReactSelect from "react-select";
import { getDistrubuters } from "../../../components/config";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [distributors, setDistributors] = useState([]);
  const { register, handleSubmit, reset, setValue,getValues ,  } = useForm();
  const [roles, setRoles] = useState([]);
   const [distributorsc, setDistributorsc] = useState([]);
 
   
  // Fetch clients from the API
  useEffect(() => {
  

    fetchClients();
    fetchRoles();
    fetchDistributors();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(' https://api.equi.co.in/api/roles');
      console.log('API Response:', response); // Check the full response
      setRoles(response.data); 
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(" https://api.equi.co.in/api/user-infos");
      setClients(response.data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  const fetchDistributors = useCallback(async () => {
    try {
      const response = await getDistrubuters();
      setDistributorsc(response.data);
      console.log("data", response.data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      notyf.error("Failed to load distributors.");
    }
  }, []); // No dependencies, so this function is memoized and won't change
  // Fetch distributors from the API
  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await axios.get(" https://api.equi.co.in/api/distributors/search");
        setDistributors(response.data.data);
      } catch (error) {
        console.error("Error fetching distributors:", error);
      }
    };

    fetchDistributors();
  }, []);

  // Open the edit modal and populate it with the selected client's data
  const handleEdit = (client) => {
    reset();
    setSelectedClient(client);
    setValue("client_id", client.id);
    setValue("first_name", client.first_name);
    setValue("last_name", client.last_name);
    setValue("email", client.email);
    setValue("mobile_number", client.mobile_number);
    setValue("category", client.category);
    setValue("business_name", client.business_name);
    setValue("address_1", client.address_1);
    setValue("address_2", client.address_2);
    setValue("landmark", client.landmark);
    setValue("pincode", client.pincode);
    setValue("country", client.country);
    setValue("state", client.state);
    setValue("city", client.city);
    setValue("agreed_to_terms", client.agreed_to_terms);
    setValue("contant_person", client.contant_person);
    setValue("product_id", client.product_id);
    setValue("user_id", client.user_id);
    setValue("dist_id", client.dist_id);
    setEditModalOpen(true);
  };
  

  // Open the assign modal
  const handleAssign = (client) => {
    setSelectedClient(client);
    setValue("client_id", client.id);
    setAssignModalOpen(true);
  };

  // Handle form submission for updating client data
  const onSubmitEdit = async (data) => {
    // alert('test')
    try {
      const response = await axios.post(
        ` https://api.equi.co.in/api/user-infos/${data.user_id}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        alert("Client updated successfully!");
        setEditModalOpen(false);
        reset();
        // Refresh the client list
        const updatedClients = await axios.get(" https://api.equi.co.in/api/user-infos");
        setClients(updatedClients.data.data);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating client:", error);
     toast.error(error.response.data?.message);
      alert("An error occurred while updating the client.");
    }
  };

  // Handle form submission for assigning distributor
  const onSubmitAssign = async (data) => {
    console.log("Form Data Submitted:", data); // Debugging log
  
    try {
      const response = await axios.post(
        ` https://api.equi.co.in/api/assign-distributor`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (response.status === 200) {
        alert("Distributor assigned successfully!");
        setAssignModalOpen(false);
        reset();
      } else {
        alert("Distributor assigned successfully!");
      }
    } catch (error) {
      console.error("Error assigning distributor:", error);
  
      // Show correct error message
      alert(error.response?.data?.message || "Failed to assign distributor. Please try again.");
    }
  };
  


  const handleDelete = (id) => {
    axios
      .post(` https://api.equi.co.in/api/user-infosdel/${id}`)
      .then((response) => {
        console.log(response);
        fetchClients();
        alert("Deleted successfully!");
        // Optionally refresh the data or remove the item from the state
      })
      .catch((error) => {
        alert("Failed to delete");
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();

    const url = ' https://api.equi.co.in/api/user-infos/27'; // API endpoint
    const method = 'post'; // Use PUT or PATCH depending on your API

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      closeActionModal(); // Close the modal after successful update
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
 
  

  return (
    <div>
      <div className="grid place-items-center bg-[#04A24C] text-white p-3">
        Client Management <form onSubmit={handleSubmit(onSubmitAssign)}>
  {/* <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
    Assign
  </button> */}
</form>
      </div>
      <table className="table-auto w-full border-collapse border border-[#F0B171]">
        <thead className="bg-[#F0B171]">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Mobile</th>
            {/* <th className="border px-4 py-2">Distributer Name</th> */}
            <th className="border px-4 py-2">Distributer Phone number</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="border px-4 py-2">{client.id}</td>
              <td className="border px-4 py-2">
                {client.first_name} {client.last_name}
              </td>
              <td className="border px-4 py-2">{client?.email}</td>
              <td className="border px-4 py-2">{client?.mobile_number}</td>
              <td className="border px-4 py-2">{client.distributor?.phone}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleEdit(client)}
                >
                  Edit
                </button>
                <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all duration-200"
                    title="Delete"
                  >
                    <MdDelete size={20} />
                    </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => handleAssign(client)}
                >
                  Assign Distributor
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Edit Client</h2>
          <form onSubmit={handleSubmit(onSubmitEdit)}>
            <input type="text" {...register("client_id", { required: true })} hidden />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name:</label>
              <input
                type="text"
                {...register("first_name", { required: true })}
                className="w-full border px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input
                type="text"
                {...register("last_name", { required: true })}
                className="w-full border px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                {...register("email")}
                className="w-full border px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Mobile:</label>
              <input
                type="text"
                {...register("mobile_number", { required: true })}
                className="w-full border px-3 py-2"
              />
            </div>
            <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Category:</label>
  <select
            name="category"
            // value={roleClient}
            {...register("category", { required: true })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          >
            <option value="">Select a category</option>
            {roles
              ?.filter((role) => role.name !== "admin") // Exclude the "admin" role
              .map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
          </select>
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Business Name:</label>
  <input
    type="text"
    {...register("business_name")}
    className="w-full border px-3 py-2"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Address 1:</label>
  <input
    type="text"
    {...register("address_1")}
    className="w-full border px-3 py-2"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Address 2:</label>
  <input
    type="text"
    {...register("address_2")}
    className="w-full border px-3 py-2"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Landmark:</label>
  <input
    type="text"
    {...register("landmark")}
    className="w-full border px-3 py-2"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Pincode:</label>
  <input
    type="text"
    {...register("pincode")}
    className="w-full border px-3 py-2"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Country:</label>
  <input
    type="text"
    {...register("country")}
    className="w-full border px-3 py-2"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">State:</label>
  <input
    type="text"
    {...register("state")}
    className="w-full border px-3 py-2"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">City:</label>
  <input
    type="text"
    {...register("city")}
    className="w-full border px-3 py-2"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Agreed to Terms:</label>
  <input
    type="checkbox"
    {...register("agreed_to_terms")}
    className="w-full border px-3 py-2"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Contact Person:</label>
  <input
    type="text"
    {...register("contant_person")}
    className="w-full border px-3 py-2"
  />
</div>



<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Distributor ID:</label>
  

<select
          {...register("dist_id")}
        // value={client.distributor_id}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          >
            <option value="" disabled>
              Select a Partner
            </option>
            {distributorsc.map((category, index) => (
              <option key={index} value={category.user_id}>
                {category.userdist.name} ({category.phone})
              </option>
            ))}
          </select>
</div>


            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </form>
        </div>
      </Modal>

      {/* Assign Distributor Modal */}
      <Modal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Assign Distributors</h2>
          {selectedClient && (
            <form onSubmit={handleSubmit(onSubmitAssign)}>
              <p>
                Assigning{" "}
                <strong>
                  {selectedClient.first_name} {selectedClient.last_name}
                </strong>{" "}
                to a distributor.
              </p>
              <input
                type="text"
                {...register("client_id", { required: true })}
                hidden
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Distributor:
                </label>
                <ReactSelect
  options={distributors.map((dist) => ({
    value: dist.user_id,
    label: `${dist.userdist.name} (${dist.phone})`,
  }))}
  placeholder="Select a distributor"
  onChange={(selectedOption) => {
    console.log("Selected Distributor:", selectedOption); // Debugging
    setValue("distributor_id", selectedOption ? selectedOption.value : ""); // Make sure it's "distributor_id"
  }}
  className="mb-4"
/>

              </div>
              <button
  type="button"
  className="bg-blue-500 text-white px-4 py-2 rounded"
  onClick={() => onSubmitAssign({
    client_id: selectedClient?.users.id,
    distributor_id: getValues("distributor_id"), // Ensure it gets the value
  })}
>
  Test Assign
</button>


            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ClientManagement;
