// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Modal } from "react-responsive-modal";
// import { useForm } from "react-hook-form";
// import { Notyf } from "notyf";
// import "react-responsive-modal/styles.css";
// import "notyf/notyf.min.css"; // Import Notyf styles
// import CustomerModal from "./CustomerModal"; // Import CustomerModal
// import toast from "react-hot-toast";

// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [modalType, setModalType] = useState("create");
//   const [currentCustomer, setCurrentCustomer] = useState(null);
//   const [customerTypeData, setCustomerTypeData] = useState([]);
//   const [customerSubTypeData, setCustomerSubTypeData] = useState([]);

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };
//   const { register, handleSubmit, reset } = useForm({
//     defaultValues: {
//       name: "",
//       phone: "",
//       customerType: "",
//       customerSubType: "",
//       dob: "",
//       anniversary: "",
//       email: "",
//       gender: "",
//       address: "",
//       pincode: "",
//       state: "",
//       country: "",
//       remark: "",
//       customerEnquiry: "",
//     },
//   });
//   const notyf = new Notyf(); // Initialize Notyf

//   // Fetch Customers
//   const fetchCustomers = async () => {
//     try {
//       const token = getCookie("access_token"); // Retrieve token
//       console.log("customber token", token);

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the token in the headers
//         },
//       };

//       const { data } = await axios.get(
//         "  https://apibrize.brizindia.com/api/customers",
//         config
//       );
//       setCustomers(data);
//     } catch (error) {
//       notyf.error("Error fetching customers!");
//       console.error("Error fetching customers:", error);
//     }
//   };

//   // Handle Create/Update
//   const onSubmit = async (data) => {
//     try {
//       console.log("onsubmit", data);
//       const token = getCookie("access_token"); // Retrieve token
//       console.log(token);

//       const payload = {
//         ...data,
//         customer_type: data.customerTypeData, // Mapping to backend's expected field
//         customer_sub_type: data.customerSubTypeData || null, // Ensure the sub type is sent as null if not provided
//       };

//       console.log("payload", payload);

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the token in the headers
//           "Content-Type": "application/json",
//         },
//       };

//       if (modalType === "create") {
//         await axios.post(
//           "  https://apibrize.brizindia.com/api/customers",
//           payload,
//           config
//         );
//         notyf.success("Customer created successfully!");
//         fetchCustomers();
//       } else if (modalType === "edit") {
//         console.log("updated.....", payload);
//         await axios.post(
//           `  https://apibrize.brizindia.com/api/customers/${currentCustomer.id}`,
//           payload,
//           config
//         );
//         notyf.success("Customer updated successfully!");
//         console.log("update user");
//         fetchCustomers();
//       }

//       fetchCustomers();
//       closeModal();
//     } catch (error) {
//       notyf.error("An error occurred while saving the customer!");
//       console.error("Error saving customer:", error);
//     }
//   };

//   // Handle Delete
//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this customer?")) {
//       try {
//         await axios.delete(`  https://apibrize.brizindia.com/api/customers/${id}`);
//         toast.success("Customer deleted successfully!");
//         fetchCustomers();
//         console.log("customber deleted ");
//       } catch (error) {
//         toast.error(
//           "Cannot Delete Customer because they have associated Orders."
//         );
//         // notyf.error("Error deleting customer!");
//         console.error("Error deleting customer:", error);
//       }
//     }
//   };

//   // Open Modal
//   // const openModal = (type, customer = null) => {
//   //   setModalType(type);
//   //   setCurrentCustomer(customer);
//   //   if (type === "edit") reset(customer); // Pre-fill form for edit
//   //   else reset(); // Clear form for create
//   //   setIsModalOpen(true);
//   // };
//   // const openModal = (type, customer = null) => {
//   //   setModalType(type);
//   //   setCurrentCustomer(type === "edit" ? customer : null);
//   //   setIsModalOpen(true);
//   // };
//   const openModal = (type, customer = null) => {
//     setModalType(type);
//     setCurrentCustomer(type === "edit" ? customer : null);
  
//     if (type === "create") {
//       reset(); // 🧹 Clear form fields when creating
//     }
  
//     setIsModalOpen(true);
//   };

//   // Close Modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentCustomer(null);
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   useEffect(() => {
//     if (!isModalOpen) {
//       fetchCustomers();
//     }
//   }, [isModalOpen]);
//   // Fetch customer type data
//   useEffect(() => {
//     const token = getCookie("access_token"); // Retrieve token
//     console.log("customber token", token);
//     axios
//       .get(
//         " https://apibrize.brizindia.com/api/customerstype",

//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       ) // Correct endpoint for customer types
//       .then((response) => {
//         console.log(response.data);

//         setCustomerTypeData(response.data.data); // Ensure data format is correct
//       })
//       .catch(() => {
//         alert("Failed to fetch customer types");
//       });
//   }, []);

//   // Fetch customer sub-type data
//   useEffect(() => {
//     const token = getCookie("access_token");
//     axios
//       .get("  https://apibrize.brizindia.com/api/customersubtypes", {
//         headers: { Authorization: `Bearer ${token}` },
//       }) // Correct endpoint for sub-types
//       .then((response) => {
//         setCustomerSubTypeData(response.data); // Ensure response is correctly formatted
//       })
//       .catch(() => {
//         alert("Failed to fetch customer sub-types");
//       });
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between">
//         <h1 className="mb-4 text-2xl font-bold">Customers</h1>
//         <button
//           onClick={() => openModal("create")}
//           className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
//         >
//           Add Customer
//         </button>
//       </div>

//       {/* Customer Table */}
//       <table className="w-full border border-collapse border-gray-300">
//         <thead>
//           <tr>
//             <th className="px-4 py-2 border border-gray-300">Name</th>
//             <th className="px-4 py-2 border border-gray-300">Phone</th>
//             <th className="px-4 py-2 border border-gray-300">Address</th>
//             {/* <th className="px-4 py-2 border border-gray-300">Pincode</th> */}
//             <th className="px-4 py-2 border border-gray-300">State</th>
//             <th className="px-4 py-2 border border-gray-300">Country</th>
//             <th>Remark</th>
//             <th className="px-4 py-2 border border-gray-300">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.map((customer) => (
//             <tr key={customer.id}>
//               <td className="px-4 py-2 border border-gray-300">
//                 {customer.customer_name}
//               </td>
//               <td className="px-4 py-2 border border-gray-300">
//                 {customer.phone}
//               </td>
//               <td className="px-4 py-2 border border-gray-300">
//                 {customer.address}
//               </td>
//               {/* <td className="px-4 py-2 border border-gray-300">
//                 {customer.pincode}
//               </td> */}
//               <td className="px-4 py-2 border border-gray-300">
//                 {customer.state}
//               </td>

//               <td className="px-4 py-2 border border-gray-300">
//                 {customer.country}
//               </td>
//               <td className="px-4 py-2 border border-gray-300">
//                 {customer?.remarke}
//               </td>
//               <td className="px-4 py-2 border border-gray-300">
//                 <button
//                   onClick={() => openModal("edit", customer)}
//                   className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(customer.id)}
//                   className="px-2 py-1 text-white bg-red-500 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal */}
//       <CustomerModal
//         isModalOpen={isModalOpen}
//         closeModal={closeModal}
//         modalType={modalType}
//         currentCustomer={currentCustomer}
//         customerTypeData={customerTypeData}
//         customerSubTypeData={customerSubTypeData}
//         register={register}
//         handleSubmit={handleSubmit}
//         reset={reset}
//         onSubmit={onSubmit}
//       />
//     </div>
//   );
// };

// export default Customers;



"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import { Notyf } from "notyf";
import "react-responsive-modal/styles.css";
import "notyf/notyf.min.css"; // Import Notyf styles
import CustomerModal from "./CustomerModal"; // Import CustomerModal
import toast from "react-hot-toast";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
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
      gstNo:"",
      state: "",
      country: "",
      remark: "",
      customerEnquiry: "",
    },
  });
  const notyf = new Notyf(); // Initialize Notyf

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const token = getCookie("access_token"); // Retrieve token
      console.log("customber token", token);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      };

      const { data } = await axios.get(
        "  https://apibrize.brizindia.com/api/customers",
        config
      );
      setCustomers(data);
    } catch (error) {
      notyf.error("Error fetching customers!");
      console.error("Error fetching customers:", error);
    }
  };

  // Handle Create/Update
  const onSubmit = async (data) => {
    try {
      console.log("onsubmit", data);
      const token = getCookie("access_token"); // Retrieve token
      console.log(token);

      const payload = {
        ...data,
        customer_type: data.customerTypeData, // Mapping to backend's expected field
        customer_sub_type: data.customerSubTypeData || null, // Ensure the sub type is sent as null if not provided
      };

      console.log("payload", payload);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
          "Content-Type": "application/json",
        },
      };

      if (modalType === "create") {
        await axios.post(
          "  https://apibrize.brizindia.com/api/customers",
          payload,
          config
        );
        notyf.success("Customer created successfully!");
        fetchCustomers();
      } else if (modalType === "edit") {
        console.log("updated.....", payload);
        await axios.post(
          `  https://apibrize.brizindia.com/api/customers/${currentCustomer.id}`,
          payload,
          config
        );
        notyf.success("Customer updated successfully!");
        console.log("update user");
        fetchCustomers();
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
        await axios.delete(`  https://apibrize.brizindia.com/api/customers/${id}`);
        toast.success("Customer deleted successfully!");
        fetchCustomers();
        console.log("customber deleted ");
      } catch (error) {
        toast.error(
          "Cannot Delete Customer because they have associated Orders."
        );
        // notyf.error("Error deleting customer!");
        console.error("Error deleting customer:", error);
      }
    }
  };

  // Open Modal
  // const openModal = (type, customer = null) => {
  //   setModalType(type);
  //   setCurrentCustomer(customer);
  //   if (type === "edit") reset(customer); // Pre-fill form for edit
  //   else reset(); // Clear form for create
  //   setIsModalOpen(true);
  // };
  // const openModal = (type, customer = null) => {
  //   setModalType(type);
  //   setCurrentCustomer(type === "edit" ? customer : null);
  //   setIsModalOpen(true);
  // };
  const openModal = (type, customer = null) => {
    setModalType(type);
    setCurrentCustomer(type === "edit" ? customer : null);
  
    if (type === "create") {
      reset(); // 🧹 Clear form fields when creating
    }
  
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

  useEffect(() => {
    if (!isModalOpen) {
      fetchCustomers();
    }
  }, [isModalOpen]);
  // Fetch customer type data
  useEffect(() => {
    const token = getCookie("access_token"); // Retrieve token
    console.log("customber token", token);
    axios
      .get(
        " https://apibrize.brizindia.com/api/customerstype",

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
    const token = getCookie("access_token");
    axios
      .get("  https://apibrize.brizindia.com/api/customersubtypes", {
        headers: { Authorization: `Bearer ${token}` },
      }) // Correct endpoint for sub-types
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
            <th className="px-4 py-2 border border-gray-300">Phone</th>
            <th className="px-4 py-2 border border-gray-300">Address</th>
            <th className="px-4 py-2 border border-gray-300">Gst No</th>
            <th className="px-4 py-2 border border-gray-300">State</th>
            <th className="px-4 py-2 border border-gray-300">Country</th>
            <th>Remark</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="px-4 py-2 border border-gray-300">
                {customer.customer_name}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.phone}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.address}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.gstNo}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.state}
              </td>

              <td className="px-4 py-2 border border-gray-300">
                {customer.country}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer?.remarke}
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



