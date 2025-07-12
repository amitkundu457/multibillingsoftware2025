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
        " http://127.0.0.1:8000/api/customers",
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
          " http://127.0.0.1:8000/api/customers",
          payload,
          config
        );
        notyf.success("Customer created successfully!");
        fetchCustomers();
      } else if (modalType === "edit") {
        console.log("updated.....", payload);
        await axios.post(
          ` http://127.0.0.1:8000/api/customers/${currentCustomer.id}`,
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
        await axios.delete(` http://127.0.0.1:8000/api/customers/${id}`);
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
        "http://127.0.0.1:8000/api/customerstype",

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
      .get(" http://127.0.0.1:8000/api/customersubtypes", {
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
            {/* <th className="px-4 py-2 border border-gray-300">Pincode</th> */}
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





// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Modal } from "react-responsive-modal";
// import { useForm } from "react-hook-form";
// import { Notyf } from "notyf";
// import "react-responsive-modal/styles.css";
// import "notyf/notyf.min.css";
// import toast from "react-hot-toast";
// import CustomerModal from "./CustomerModal";
// import { useLanguage } from "@/app/context/LanguageContext";
// import { translateTextArray } from "@/app/lib/translate"; // Adjust the import path as needed
// import { translateText } from "@/app/lib/translate";
// import LanguageSwitcher from "@/app/components/LanguageSwitcher";
// import { useLanguage } from "../context/LanguageContext";
// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [translatedCustomers, setTranslatedCustomers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState("create");
//   const [currentCustomer, setCurrentCustomer] = useState(null);
//   const [customerTypeData, setCustomerTypeData] = useState([]);
//   const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
//   const { language, t } = useLanguage();

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   const { register, handleSubmit, reset } = useForm();
//   const notyf = new Notyf();

//   const fetchCustomers = async () => {
//     try {
//       const token = getCookie("access_token");
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const { data } = await axios.get("http://127.0.0.1:8000/api/customers", config);
//       setCustomers(data);
//     } catch (error) {
//       notyf.error("Error fetching customers!");
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   useEffect(() => {
//     const translateCustomers = async () => {
//       if (language === "en") {
//         setTranslatedCustomers(customers);
//         return;
//       }
  
//       const texts = customers.flatMap(c => [
//         c.customer_name,
//         c.address,
//         c.state,
//         c.country,
//         c.remarke || ""
//       ]);
  
//       try {
//         const translated = await translateTextArray(texts, language);
//         console.log("Translated texts:", translated);
  
//         const updated = customers.map((c, index) => {
//           const i = index * 5;
//           return {
//             ...c,
//             customer_name: translated[i],
//             address: translated[i + 1],
//             state: translated[i + 2],
//             country: translated[i + 3],
//             remarke: translated[i + 4],
//           };
//         });
//         console.log("Updated:", updated);
//         setTranslatedCustomers(updated);
//       } catch (err) {
//         console.error("Translation failed:", err);
//         setTranslatedCustomers(customers); // fallback
//       }
//     };
  
//     if (customers.length > 0) translateCustomers();
//   }, [language, customers]);

 

//   const openModal = (type, customer = null) => {
//     setModalType(type);
//     setCurrentCustomer(type === "edit" ? customer : null);
//     if (type === "create") reset();
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentCustomer(null);
//   };

//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this customer?")) {
//       try {
//         await axios.delete(`http://127.0.0.1:8000/api/customers/${id}`);
//         toast.success("Customer deleted successfully!");
//         fetchCustomers();
//       } catch (error) {
//         toast.error("Cannot delete customer due to related data.");
//       }
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between">
//         <h1 className="mb-4 text-2xl font-bold">{t("Customers")}</h1>
//         <LanguageSwitcher />
//         <button
//           onClick={() => openModal("create")}
//           className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
//         >
//           {t("Add Customer")}
//         </button>
//       </div>

//       <table className="w-full border border-collapse border-gray-300">
//         <thead>
//           <tr>
//           <th>{t("name")}</th>
// <th>{t("phone")}</th>
// <th>{t("address")}</th>
// <th>{t("state")}</th>
// <th>{t("country")}</th>
// <th>{t("remark")}</th>
// <th>{t("actions")}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {translatedCustomers.map((customer) => (
//             <tr key={customer.id}>
//               <td className="px-4 py-2 border border-gray-300">{customer.customer_name}</td>
//               <td className="px-4 py-2 border border-gray-300">{customer.phone}</td>
//               <td className="px-4 py-2 border border-gray-300">{customer.address}</td>
//               <td className="px-4 py-2 border border-gray-300">{customer.state}</td>
//               <td className="px-4 py-2 border border-gray-300">{customer.country}</td>
//               <td className="px-4 py-2 border border-gray-300">{customer.remarke}</td>
//               <td className="px-4 py-2 border border-gray-300">
//                 <button
//                   onClick={() => openModal("edit", customer)}
//                   className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded"
//                 >{t("edit")} 
//                 </button>
//                 <button
//                   onClick={() => handleDelete(customer.id)}
//                   className="px-2 py-1 text-white bg-red-500 rounded"
//                 >
//                   {t("delete")}
//                 </button>
//               </td>
//             </tr>
//           ))}
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
//         reset={reset}
//         onSubmit={() => {}}
//       />
//     </div>
//   );
// };

// export default Customers;

// transalte  accroding to langauge 

// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import CustomerModal from "./CustomerModal";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// // import { useLanguage } from "../context/LanguageContext";
// import { useLanguage } from "@/app/context/LanguageContext";
// import LanguageSwitcher from "@/app/components/LanguageSwitcher";
// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState("create");
//   const [currentCustomer, setCurrentCustomer] = useState(null);
//   const [customerTypeData, setCustomerTypeData] = useState([]);
//   const [customerSubTypeData, setCustomerSubTypeData] = useState([]);

//   const { register, handleSubmit, reset } = useForm();
//   const { language, t } = useLanguage();

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
//     return null;
//   };

//   const translateCustomerData = async (customerList, targetLang) => {
//     const texts = customerList.flatMap(c => [
//       c.customer_name,
//       c.address,
//       c.state,
//       c.country,
//       c.remarke || ""
//     ]);

//     const response = await axios.post("http://localhost:8000/api/translate", {
//       text: texts,
//       target: targetLang
//     });

//     const translated = response.data.data;

//     const updated = customerList.map((c, index) => {
//       const i = index * 5;
//       return {
//         ...c,
//         customer_name: translated[i],
//         address: translated[i + 1],
//         state: translated[i + 2],
//         country: translated[i + 3],
//         remarke: translated[i + 4]
//       };
//     });

//     return updated;
//   };

//   const fetchCustomers = async () => {
//     try {
//       const token = getCookie("access_token");

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       };

//       const { data } = await axios.get("http://127.0.0.1:8000/api/customers", config);

//       if (language !== "en") {
//         const translatedData = await translateCustomerData(data, language);
//         setCustomers(translatedData);
//       } else {
//         setCustomers(data);
//       }
//     } catch (error) {
//       toast.error("Error fetching customers");
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, [language]);

//   const openModal = (type, customer = null) => {
//     setModalType(type);
//     setCurrentCustomer(type === "edit" ? customer : null);
//     if (type === "create") reset();
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentCustomer(null);
//   };

//   const handleDelete = async (id) => {
//     if (confirm(t("delete_confirm"))) {
//       try {
//         const token = getCookie("access_token");
//         await axios.delete(`http://127.0.0.1:8000/api/customers/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         toast.success(t("deleted"));
//         fetchCustomers();
//       } catch (error) {
//         toast.error(t("delete_error"));
//       }
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold mb-4">{t("customers")}</h1>
//         <h1><LanguageSwitcher/></h1>
//         <button onClick={() => openModal("create")} className="bg-blue-500 text-white px-4 py-2 rounded">
//           {t("add_customer")}
//         </button>
//       </div>

//       <table className="w-full border border-collapse border-gray-300">
//         <thead>
//           <tr>
//             <th>{t("name")}</th>
//             <th>{t("phone")}</th>
//             <th>{t("address")}</th>
//             <th>{t("state")}</th>
//             <th>{t("country")}</th>
//             <th>{t("remark")}</th>
//             <th>{t("actions")}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.map((customer) => (
//             <tr key={customer.id}>
//               <td className="border px-4 py-2">{customer.customer_name}</td>
//               <td className="border px-4 py-2">{customer.phone}</td>
//               <td className="border px-4 py-2">{customer.address}</td>
//               <td className="border px-4 py-2">{customer.state}</td>
//               <td className="border px-4 py-2">{customer.country}</td>
//               <td className="border px-4 py-2">{customer.remarke}</td>
//               <td className="border px-4 py-2 space-x-2">
//                 <button onClick={() => openModal("edit", customer)} className="bg-yellow-500 text-white px-2 py-1 rounded">
//                   {t("edit")}
//                 </button>
//                 <button onClick={() => handleDelete(customer.id)} className="bg-red-500 text-white px-2 py-1 rounded">
//                   {t("delete")}
//                 </button>
//               </td>
//             </tr>
//           ))}
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
//         reset={reset}
//         onSubmit={() => {}}
//       />
//     </div>
//   );
// };

// export default Customers;
