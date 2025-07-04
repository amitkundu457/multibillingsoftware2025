"use client"
import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import { Notyf } from "notyf";
import "react-responsive-modal/styles.css";
import "notyf/notyf.min.css";
import {
    getCustomertype,
    createCustomertype,
    updateCustomertype,
    deleteCustomertype,
    getDistrubuters
} from "@/app/components/config"
import axios from "axios";

// API calls for customer subtypes


const CustomeType = () => {
    const [type, setType] = useState([]); // Stores customer subtypes
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
    const [editData, setEditData] = useState(null);
    const { register, handleSubmit, reset } = useForm({
        defaultValues: { name: '' }
    });
    const notyf = new Notyf();

    // Fetch data from API
    const fetchData = async () => {
        try {
            const response = await getCustomertype();
            setType(response.data.data);  // Use response.data instead of res.data
            console.log(response);  // Log the whole response object to inspect the result
        } catch (error) {
            notyf.error("Error fetching customers!");
            console.error("Error fetching customers:", error);
        }
    };


    useEffect(() => {
      fetchData();
        // console.log(data)
    }, []);




    // Handle form submission
    // const onSubmit = async (formData) => {
    //     // Determine the API method based on the modal type
    //     const method = modalType === "create" ? createCustomertype : updateCustomertype;
    //     const endpoint = modalType === "create" ? "/customerstype" : `/customerstype/${editData.id}`;
    //
    //     try {
    //         // Use the appropriate API method (create or update) with the form data
    //         const response = await method(modalType === "create" ? data : [editData.id, formData]);
    //
    //         if (response.success) {
    //             notyf.success(modalType === "create" ? "Created successfully!" : "Updated successfully!");
    //             fetchData();  // Re-fetch data after creation or update
    //             closeModal();
    //         } else {
    //             notyf.error("Something went wrong.");
    //         }
    //     } catch (error) {
    //         console.error(error);  // Log error for debugging
    //         notyf.error("Error processing request.");
    //     }
    // };
    const onSubmit = async (data) => {
        try {
            // Log the data to ensure the correct values are being passed
            console.log("Submitting data:", data);

            if (modalType === "create") {
                await createCustomertype(data);
                notyf.success("Customer created successfully!");
            } else if (modalType === "edit") {
                if (data.id) {
                    await updateCustomertype(data.id, data); // Make sure data.id exists
                    notyf.success("Customer updated successfully!");
                } else {
                    notyf.error("Customer ID is missing for update.");
                }
            }

            fetchData(); // Re-fetch updated data
            closeModal(); // Close modal after success
        } catch (error) {
            notyf.error("An error occurred while saving the customer!");
            console.error("Error saving customer:", error);
        }
    };


    // Handle delete
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this customer sub type?")) {
            try {
                const response = await deleteCustomertype(id); // Using the delete API function
                if (response.success) {
                    notyf.success("Deleted successfully!");
                    fetchData();
                } else {
                    notyf.error("Error deleting.");
                }
            } catch (error) {
                notyf.error("Error processing request.");
            }
        }
    };

    // Open modal
    const openModal = (type, data = null) => {
        setModalType(type);
        if (type === "edit") setEditData(data);
        reset(data || {}); // Populate form if editing
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditData(null);
        reset();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Customer  Types</h1>
            <button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => openModal("create")}
            >
                Add Customer  Type
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border">ID</th>
                        {/*<th className="py-2 px-4 border">Type</th>*/}
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {type && type.length > 0 ? (
                        type.map((item) => (  // Removed the extra braces here
                            <tr key={item.id}>
                                <td className="py-2 px-4 border">{item.id}</td>
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="py-2 px-4 border text-center">
                                No customer types available.
                            </td>
                        </tr>
                    )}
                    </tbody>

                </table>
            </div>

            {/* Modal */}
            <Modal open={isModalOpen} onClose={closeModal} center>
                <h2 className="mb-4 text-xl font-bold">
                    {modalType === "create" ? "Add Customer  Type" : "Edit Customer  Type"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            {...register("name", {required: true})}
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

export default CustomeType;
