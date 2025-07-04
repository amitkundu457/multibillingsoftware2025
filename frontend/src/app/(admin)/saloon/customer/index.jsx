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

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const token = getCookie("access_token"); // Retrieve token
      console.log("customber token",token)
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      };
  
      const { data } = await axios.get(" http://127.0.0.1:8000/api/customers", config);
      setCustomers(data);
    } catch (error) {
      notyf.error("Error fetching customers!");
      console.error("Error fetching customers:", error);
    }
  };




  

  // Handle Create/Update
  const onSubmit = async (data) => {
    try {
      console.log("onsubmit",data)
      const token = getCookie("access_token"); // Retrieve token
      console.log(token);
      
  
      const payload = {
        ...data,
        customer_type: data.customerTypeData, // Mapping to backend's expected field
        customer_sub_type: data.customerSubTypeData || null, // Ensure the sub type is sent as null if not provided
      };

      console.log("payload",payload)
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
          "Content-Type": "application/json",
        },
      };
  
      if (modalType === "create") {
        await axios.post(" http://127.0.0.1:8000/api/customers", payload, config);
        notyf.success("Customer created successfully!");
        fetchCustomers();
      } else if (modalType === "edit") {
        console.log("updated.....",payload)
        await axios.post(
          ` http://127.0.0.1:8000/api/customers/${currentCustomer.id}`,
          payload,
          config
        );
        notyf.success("Customer updated successfully!");
        console.log("update user")
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
        await axios.delete(` http://127.0.0.1:8000/api/customers/${id}`);
        toast.success("Customer deleted successfully!");
        fetchCustomers();
        console.log("customber deleted ")
      } catch (error) {
       toast.error("Cannot Delete Customer because they have associated Orders.")
        // notyf.error("Error deleting customer!");
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


  useEffect(() => {
    if (!isModalOpen) {
      fetchCustomers();
    }
  }, [isModalOpen]);
  // Fetch customer type data
  useEffect(() => {
    const token = getCookie("access_token"); // Retrieve token
    console.log("customber token",token)
    axios
      .get("http://127.0.0.1:8000/api/customerstype",
        
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
      .get(" http://127.0.0.1:8000/api/customersubtypes",
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
            <th className="px-4 py-2 border border-gray-300">Phone</th>
            <th className="px-4 py-2 border border-gray-300">Address</th>
            {/* <th className="px-4 py-2 border border-gray-300">Pincode</th> */}
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
                {customer.phone}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {customer.address}
              </td>
              {/* <td className="px-4 py-2 border border-gray-300">
                {customer.pincode}
              </td> */}
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
// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Notyf } from "notyf";
// import toast from "react-hot-toast";
// import { useForm } from "react-hook-form";
// import CustomerModal from "./CustomerModal";

// // Reusable function for making API requests
// const apiRequest = async (method, url, data = null, token) => {
//   const config = {
//     headers: { Authorization: `Bearer ${token}` },
//   };
//   try {
//     if (method === "get") {
//       return await axios.get(url, config);
//     } else if (method === "post") {
//       return await axios.post(url, data, config);
//     } else if (method === "delete") {
//       return await axios.delete(url, config);
//     }
//   } catch (error) {
//     throw error.response?.data?.message || "Something went wrong!";
//   }
// };

// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState("create");
//   const [currentCustomer, setCurrentCustomer] = useState(null);
//   const [customerTypeData, setCustomerTypeData] = useState([]);
//   const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const { register, handleSubmit, reset } = useForm();

//   const notyf = new Notyf();
  
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   // Fetch Customers
//   const fetchCustomers = async () => {
//     setIsLoading(true);
//     const token = getCookie("access_token");
//     try {
//       const { data } = await apiRequest("get", "http://127.0.0.1:8000/api/customers", null, token);
//       setCustomers(data);
//     } catch (error) {
//       notyf.error("Error fetching customers!");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchData = async (url, setState) => {
//     setIsLoading(true);
//     const token = getCookie("access_token");
//     try {
//       const { data } = await apiRequest("get", url, null, token);
//       setState(data);
//     } catch (error) {
//       alert(`Failed to fetch data from ${url}`);
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle Create/Update
//   const onSubmit = async (data) => {
//     try {
//       const token = getCookie("access_token");
//       const payload = { ...data, customer_type: data.customerTypeData, customer_sub_type: data.customerSubTypeData || null };
      
//       const apiUrl = modalType === "create" ? "http://127.0.0.1:8000/api/customers" : `http://127.0.0.1:8000/api/customers/${currentCustomer.id}`;
//       await apiRequest(modalType === "create" ? "post" : "put", apiUrl, payload, token);
      
//       notyf.success(`${modalType === "create" ? "Customer created" : "Customer updated"} successfully!`);
//       fetchCustomers();
//       closeModal();
//     } catch (error) {
//       notyf.error("An error occurred while saving the customer!");
//       console.error(error);
//     }
//   };

//   // Handle Delete
//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this customer?")) {
//       try {
//         await apiRequest("delete", `http://127.0.0.1:8000/api/customers/${id}`, null, getCookie("access_token"));
//         toast.success("Customer deleted successfully!");
//         fetchCustomers();
//       } catch (error) {
//         toast.error("Cannot delete customer because they have associated orders.");
//         console.error(error);
//       }
//     }
//   };

//   const openModal = (type, customer = null) => {
//     setModalType(type);
//     setCurrentCustomer(customer);

//     const defaultValues = type === "edit" && customer ? customer : {
//       name: "",
//       phone: "",
//       dob: "",
//       anniversary: "",
//       email: "",
//       gender: "",
//       address: "",
//       pincode: "",
//       state: "",
//       country: "",
//       visit_source: "",
//       customerTypeData: "",
//       customerSubTypeData: "",
//     };

//     reset(defaultValues);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentCustomer(null);
//   };

//   useEffect(() => {
//     fetchCustomers();
//     fetchData("http://127.0.0.1:8000/api/customerstype", setCustomerTypeData);
//     fetchData("http://127.0.0.1:8000/api/customersubtypes", setCustomerSubTypeData);
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

//       <table className="w-full border border-collapse border-gray-300">
//         <thead>
//           <tr>
//             <th className="px-4 py-2 border border-gray-300">Name</th>
//             <th className="px-4 py-2 border border-gray-300">Address</th>
//             <th className="px-4 py-2 border border-gray-300">Pincode</th>
//             <th className="px-4 py-2 border border-gray-300">State</th>
//             <th className="px-4 py-2 border border-gray-300">Country</th>
//             <th className="px-4 py-2 border border-gray-300">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {isLoading ? (
//             <tr>
//               <td colSpan="6" className="text-center">Loading...</td>
//             </tr>
//           ) : (
//             customers.map((customer) => (
//               <tr key={customer.id}>
//                 <td className="px-4 py-2 border border-gray-300">{customer.name}</td>
//                 <td className="px-4 py-2 border border-gray-300">{customer.address}</td>
//                 <td className="px-4 py-2 border border-gray-300">{customer.pincode}</td>
//                 <td className="px-4 py-2 border border-gray-300">{customer.state}</td>
//                 <td className="px-4 py-2 border border-gray-300">{customer.country}</td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     onClick={() => openModal("edit", customer)}
//                     className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(customer.id)}
//                     className="px-2 py-1 text-white bg-red-500 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       <CustomerModal
//         isModalOpen={isModalOpen}
//         closeModal={closeModal}
//         modalType={modalType}
//         currentCustomer={currentCustomer}
//         customerTypeData={customerTypeData}
//         customerSubTypeData={customerSubTypeData}
//         register={register}
//         handleSubmit={handleSubmit}
//         onSubmit={onSubmit}
//       />
//     </div>
//   );
// };

// export default Customers;




// // "use client";
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Notyf } from "notyf";
// // import toast from "react-hot-toast";
// // import { useForm } from "react-hook-form";
// // import { Modal } from "react-responsive-modal";
// // import { Country, State } from "country-state-city";
// // import "react-responsive-modal/styles.css";
// // import "notyf/notyf.min.css";

// // const apiRequest = async (method, url, data = null, token) => {
// //   const config = {
// //     headers: { Authorization: `Bearer ${token}` },
// //   };
// //   try {
// //     if (method === "get") {
// //       return await axios.get(url, config);
// //     } else if (method === "post") {
// //       return await axios.post(url, data, config);
// //     } else if (method === "delete") {
// //       return await axios.delete(url, config);
// //     }
// //   } catch (error) {
// //     throw error.response?.data?.message || "Something went wrong!";
// //   }
// // };

// // const Customers = () => {
// //   const [customers, setCustomers] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [modalType, setModalType] = useState("create");
// //   const [currentCustomer, setCurrentCustomer] = useState(null);
// //   const [customerTypeData, setCustomerTypeData] = useState([]);
// //   const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
// //   const [countries, setCountries] = useState([]);
// //   const [states, setStates] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);

// //   const { register, handleSubmit, reset, watch, setValue } = useForm();
// //   const notyf = new Notyf();
  
// //   const selectedCountry = watch("country");

// //   const getCookie = (name) => {
// //     const value = `; ${document.cookie}`;
// //     const parts = value.split(`; ${name}=`);
// //     if (parts.length === 2) {
// //       return decodeURIComponent(parts.pop().split(";").shift());
// //     }
// //     return null;
// //   };

// //   const fetchCustomers = async () => {
// //     setIsLoading(true);
// //     const token = getCookie("access_token");
// //     try {
// //       const { data } = await apiRequest("get", "http://127.0.0.1:8000/api/customers", null, token);
// //       setCustomers(data);
// //     } catch (error) {
// //       notyf.error("Error fetching customers!");
// //       console.error(error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const fetchData = async (url, setState) => {
// //     setIsLoading(true);
// //     const token = getCookie("access_token");
// //     try {
// //       const { data } = await apiRequest("get", url, null, token);
// //       setState(data);
// //     } catch (error) {
// //       alert(`Failed to fetch data from ${url}`);
// //       console.error(error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const openModal = (type, customer = null) => {
// //     setModalType(type);
// //     setCurrentCustomer(customer);
// //     const defaultValues = type === "edit" && customer ? customer : {
// //       name: "",
// //       phone: "",
// //       dob: "",
// //       anniversary: "",
// //       email: "",
// //       gender: "",
// //       address: "",
// //       pincode: "",
// //       state: "",
// //       country: "",
// //       visit_source: "",
// //       customerTypeData: "",
// //       customerSubTypeData: "",
// //     };
// //     reset(defaultValues);
// //     setIsModalOpen(true);
// //   };

// //   const closeModal = () => {
// //     setIsModalOpen(false);
// //     setCurrentCustomer(null);
// //   };

// //   const onSubmit = async (data) => {
// //     try {
// //       const token = getCookie("access_token");
// //       const payload = { ...data, customer_type: data.customerTypeData, customer_sub_type: data.customerSubTypeData || null };
      
// //       const apiUrl = modalType === "create" ? "http://127.0.0.1:8000/api/customers" : `http://127.0.0.1:8000/api/customers/${currentCustomer.id}`;
// //       await apiRequest(modalType === "create" ? "post" : "put", apiUrl, payload, token);
      
// //       notyf.success(`${modalType === "create" ? "Customer created" : "Customer updated"} successfully!`);
// //       fetchCustomers();
// //       closeModal();
// //     } catch (error) {
// //       notyf.error("An error occurred while saving the customer!");
// //       console.error(error);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (confirm("Are you sure you want to delete this customer?")) {
// //       try {
// //         await apiRequest("delete", `http://127.0.0.1:8000/api/customers/${id}`, null, getCookie("access_token"));
// //         toast.success("Customer deleted successfully!");
// //         fetchCustomers();
// //       } catch (error) {
// //         toast.error("Cannot delete customer because they have associated orders.");
// //         console.error(error);
// //       }
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCustomers();
// //     fetchData("http://127.0.0.1:8000/api/customerstype", setCustomerTypeData);
// //     fetchData("http://127.0.0.1:8000/api/customersubtypes", setCustomerSubTypeData);
// //     const countryList = Country.getAllCountries();
// //     setCountries(countryList);
// //   }, []);

// //   useEffect(() => {
// //     if (selectedCountry) {
// //       const stateList = State.getStatesOfCountry(selectedCountry);
// //       setStates(stateList);
// //       setValue("state", "");
// //     }
// //   }, [selectedCountry, setValue]);

// //   return (
// //     <div className="p-6">
// //       <div className="flex justify-between">
// //         <h1 className="mb-4 text-2xl font-bold">Customers</h1>
// //         <button onClick={() => openModal("create")} className="px-4 py-2 mb-4 text-white bg-blue-500 rounded">
// //           Add Customer
// //         </button>
// //       </div>

// //       <table className="w-full border border-collapse border-gray-300">
// //         <thead>
// //           <tr>
// //             <th className="px-4 py-2 border border-gray-300">Name</th>
// //             <th className="px-4 py-2 border border-gray-300">Address</th>
// //             <th className="px-4 py-2 border border-gray-300">Pincode</th>
// //             <th className="px-4 py-2 border border-gray-300">State</th>
// //             <th className="px-4 py-2 border border-gray-300">Country</th>
// //             <th className="px-4 py-2 border border-gray-300">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {isLoading ? (
// //             <tr>
// //               <td colSpan="6" className="text-center">Loading...</td>
// //             </tr>
// //           ) : (
// //             customers.map((customer) => (
// //               <tr key={customer.id}>
// //                 <td className="px-4 py-2 border border-gray-300">{customer.name}</td>
// //                 <td className="px-4 py-2 border border-gray-300">{customer.address}</td>
// //                 <td className="px-4 py-2 border border-gray-300">{customer.pincode}</td>
// //                 <td className="px-4 py-2 border border-gray-300">{customer.state}</td>
// //                 <td className="px-4 py-2 border border-gray-300">{customer.country}</td>
// //                 <td className="px-4 py-2 border border-gray-300">
// //                   <button onClick={() => openModal("edit", customer)} className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded">Edit</button>
// //                   <button onClick={() => handleDelete(customer.id)} className="px-2 py-1 text-white bg-red-500 rounded">Delete</button>
// //                 </td>
// //               </tr>
// //             ))
// //           )}
// //         </tbody>
// //       </table>

// //       <Modal open={isModalOpen} onClose={closeModal} center>
// //         <div className="p-6 w-[800px]">
// //           <h2 className="text-2xl font-bold mb-4">{modalType === "create" ? "Add Customer" : "Edit Customer"}</h2>
// //           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// //             <div className="flex space-x-3">
// //               <div className="w-full flex justify-between">
// //                 <div className="w-[48%]">
// //                   <label className="block text-gray-700">Customer Name</label>
// //                   <input {...register("name")} type="text" className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
// //                 </div>
// //                 <div className="w-[48%]">
// //                   <label className="block text-gray-700">Phone</label>
// //                   <input {...register("phone")} type="text" required className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="flex space-x-3">
// //               <div className="w-full">
// //                 <label className="block text-gray-700">Email</label>
// //                 <input {...register("email")} type="email" className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
// //               </div>
// //             </div>

// //             <div className="flex space-x-3">
// //               <div className="w-full">
// //                 <label className="block text-gray-700">Gender</label>
// //                 <select {...register("gender")} className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
// //                   <option value="">Select Gender</option>
// //                   <option value="Male">Male</option>
// //                   <option value="Female">Female</option>
// //                 </select>
// //               </div>
// //               <div className="w-full">
// //                 <label className="block text-gray-700">Date of Birth</label>
// //                 <input {...register("dob")} type="date" className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
// //               </div>
// //             </div>

// //             <div className="flex space-x-3">
// //               <div className="w-full">
// //                 <label className="block text-gray-700">Anniversary</label>
// //                 <input {...register("anniversary")} type="date" className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
// //               </div>
// //               <div className="w-full">
// //                 <label className="block text-gray-700">Pincode</label>
// //                 <input {...register("pincode")} type="text" className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
// //               </div>
// //             </div>

// //             <div className="flex space-x-3">
// //               <div className="w-full">
// //                 <label className="block text-gray-700">Country</label>
// //                 <select
// //                   {...register("country")}
// //                   onChange={(e) => setValue("state", "")}
// //                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 >
// //                   <option value="">Select Country</option>
// //                   {countries.map((country) => (
// //                     <option key={country.isoCode} value={country.isoCode}>
// //                       {country.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="w-full">
// //                 <label className="block text-gray-700">State</label>
// //                 <select {...register("state")} className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
// //                   <option value="">Select State</option>
// //                   {states.map((state) => (
// //                     <option key={state.isoCode} value={state.isoCode}>
// //                       {state.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>

// //             <div className="flex space-x-3">
// //               <div className="w-full">
// //                 <label className="block text-gray-700">Customer Type</label>
// //                 <select {...register("customerTypeData")} className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
// //                   <option value="">Select Customer Type</option>
// //                   {customerTypeData.map((type) => (
// //                     <option key={type.id} value={type.id}>
// //                       {type.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="w-full">
// //                 <label className="block text-gray-700">Customer Sub-Type</label>
// //                 <select {...register("customerSubTypeData")} className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
// //                   <option value="">Select Customer Sub-Type</option>
// //                   {customerSubTypeData.map((subType) => (
// //                     <option key={subType.id} value={subType.id}>
// //                       {subType.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>

// //             <div className="w-full">
// //               <label className="block text-gray-700">Address</label>
// //               <textarea
// //                 {...register("address")}
// //                 className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 rows={4}
// //               />
// //             </div>

// //             <div className="flex justify-end">
// //               <button
// //                 type="submit"
// //                 className="px-4 py-2 text-white bg-blue-500 rounded mt-4"
// //                 disabled={isLoading}
// //               >
// //                 {modalType === "create" ? "Create" : "Update"} Customer
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default Customers;



// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Notyf } from "notyf";
// import toast from "react-hot-toast";
// import { useForm } from "react-hook-form";
// import { Modal } from "react-responsive-modal";
// import { Country, State } from "country-state-city";
// import "react-responsive-modal/styles.css";
// import "notyf/notyf.min.css";

// const apiRequest = async (method, url, data = null, token) => {
//   const config = { headers: { Authorization: `Bearer ${token}` } };
//   try {
//     if (method === "get") return await axios.get(url, config);
//     if (method === "post") return await axios.post(url, data, config);
//     if (method === "put") return await axios.put(url, data, config);
//     if (method === "delete") return await axios.delete(url, config);
//   } catch (error) {
//     throw error.response?.data?.message || "Something went wrong!";
//   }
// };

// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState("create");
//   const [currentCustomer, setCurrentCustomer] = useState(null);
//   const [customerTypeData, setCustomerTypeData] = useState([]);
//   const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const { register, handleSubmit, reset, watch, setValue } = useForm();
//   const notyf = new Notyf();
//   const selectedCountry = watch("country");

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
//     return null;
//   };

//   const fetchCustomers = async () => {
//     setIsLoading(true);
//     try {
//       const token = getCookie("access_token");
//       const { data } = await apiRequest("get", "http://127.0.0.1:8000/api/customers", null, token);
//       setCustomers(data);
//     } catch (error) {
//       notyf.error("Error fetching customers!");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchData = async (url, setState) => {
//     setIsLoading(true);
//     try {
//       const token = getCookie("access_token");
//       const { data } = await apiRequest("get", url, null, token);
//       setState(data);
//     } catch (error) {
//       toast.error(`Failed to fetch from ${url}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const openModal = (type, customer = null) => {
//     setModalType(type);
//     setCurrentCustomer(customer);
//     const defaultValues = type === "edit" && customer ? customer : {
//       name: "", phone: "", dob: "", anniversary: "", email: "",
//       gender: "", address: "", pincode: "", state: "", country: "",
//       visit_source: "", customerTypeData: "", customerSubTypeData: ""
//     };
//     reset(defaultValues);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentCustomer(null);
//   };

//   const onSubmit = async (data) => {
//     try {
//       const token = getCookie("access_token");
//       const payload = {
//         ...data,
//         customer_type: data.customerTypeData,
//         customer_sub_type: data.customerSubTypeData || null,
//       };
//       const apiUrl = modalType === "create"
//         ? "http://127.0.0.1:8000/api/customers"
//         : `http://127.0.0.1:8000/api/customers/${currentCustomer.id}`;

//       await apiRequest(modalType === "create" ? "post" : "put", apiUrl, payload, token);
//       notyf.success(`${modalType === "create" ? "Customer created" : "Customer updated"} successfully!`);
//       fetchCustomers();
//       closeModal();
//     } catch (error) {
//       notyf.error("Error saving customer!");
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this customer?")) {
//       try {
//         const token = getCookie("access_token");
//         await apiRequest("delete", `http://127.0.0.1:8000/api/customers/${id}`, null, token);
//         toast.success("Customer deleted successfully!");
//         fetchCustomers();
//       } catch (error) {
//         toast.error("Cannot delete customer due to associated data.");
//         console.error(error);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//     fetchData("http://127.0.0.1:8000/api/customerstype", setCustomerTypeData);
//     fetchData("http://127.0.0.1:8000/api/customersubtypes", setCustomerSubTypeData);
//     setCountries(Country.getAllCountries());
//   }, []);

//   useEffect(() => {
//     if (selectedCountry) {
//       setStates(State.getStatesOfCountry(selectedCountry));
//       setValue("state", "");
//     }
//   }, [selectedCountry]);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between">
//         <h1 className="mb-4 text-2xl font-bold">Customers</h1>
//         <button onClick={() => openModal("create")} className="px-4 py-2 mb-4 text-white bg-blue-600 rounded">
//           Add Customer
//         </button>
//       </div>

//       <table className="w-full border border-collapse border-gray-300">
//         <thead>
//           <tr>
//             <th className="px-4 py-2 border">Name</th>
//             <th className="px-4 py-2 border">Address</th>
//             <th className="px-4 py-2 border">Pincode</th>
//             <th className="px-4 py-2 border">State</th>
//             <th className="px-4 py-2 border">Country</th>
//             <th className="px-4 py-2 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {isLoading ? (
//             <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
//           ) : customers.length ? (
//             customers.map((c) => (
//               <tr key={c.id}>
//                 <td className="border px-4 py-2">{c.name}</td>
//                 <td className="border px-4 py-2">{c.address}</td>
//                 <td className="border px-4 py-2">{c.pincode}</td>
//                 <td className="border px-4 py-2">{c.state}</td>
//                 <td className="border px-4 py-2">{c.country}</td>
//                 <td className="border px-4 py-2">
//                   <button onClick={() => openModal("edit", c)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
//                   <button onClick={() => handleDelete(c.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr><td colSpan="6" className="text-center py-4">No customers found</td></tr>
//           )}
//         </tbody>
//       </table>

//       <Modal open={isModalOpen} onClose={closeModal} center>
//         <div className="p-6 w-[800px] max-w-full">
//           <h2 className="text-2xl font-semibold mb-4">{modalType === "create" ? "Add Customer" : "Edit Customer"}</h2>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block">Name</label>
//                 <input {...register("name")} className="w-full p-2 border rounded" required />
//               </div>
//               <div className="w-1/2">
//                 <label className="block">Phone</label>
//                 <input {...register("phone")} className="w-full p-2 border rounded" required />
//               </div>
//             </div>

//             <div>
//               <label className="block">Email</label>
//               <input {...register("email")} className="w-full p-2 border rounded" />
//             </div>

//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block">Gender</label>
//                 <select {...register("gender")} className="w-full p-2 border rounded">
//                   <option value="">Select</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                 </select>
//               </div>
//               <div className="w-1/2">
//                 <label className="block">Date of Birth</label>
//                 <input type="date" {...register("dob")} className="w-full p-2 border rounded" />
//               </div>
//             </div>

//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block">Anniversary</label>
//                 <input type="date" {...register("anniversary")} className="w-full p-2 border rounded" />
//               </div>
//               <div className="w-1/2">
//                 <label className="block">Pincode</label>
//                 <input {...register("pincode")} className="w-full p-2 border rounded" />
//               </div>
//             </div>

//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block">Country</label>
//                 <select {...register("country")} className="w-full p-2 border rounded">
//                   <option value="">Select Country</option>
//                   {countries.map((country) => (
//                     <option key={country.isoCode} value={country.isoCode}>
//                       {country.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="w-1/2">
//                 <label className="block">State</label>
//                 <select {...register("state")} className="w-full p-2 border rounded">
//                   <option value="">Select State</option>
//                   {states.map((state) => (
//                     <option key={state.isoCode} value={state.isoCode}>
//                       {state.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block">Customer Type</label>
//                 <select {...register("customerTypeData")} className="w-full p-2 border rounded">
//                   <option value="">Select Type</option>
//                   {customerTypeData.map((type) => (
//                     <option key={type.id} value={type.id}>{type.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="w-1/2">
//                 <label className="block">Customer Sub-Type</label>
//                 <select {...register("customerSubTypeData")} className="w-full p-2 border rounded">
//                   <option value="">Select Sub-Type</option>
//                   {customerSubTypeData.map((subType) => (
//                     <option key={subType.id} value={subType.id}>{subType.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block">Address</label>
//               <textarea {...register("address")} className="w-full p-2 border rounded" rows={3} />
//             </div>

//             <div className="text-right">
//               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//                 {modalType === "create" ? "Create" : "Update"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Customers;
