// import React, { useEffect, useState } from "react";
// import { Modal } from "react-responsive-modal";
// import axios from "axios";
// import { Notyf } from "notyf";
// import { useForm } from "react-hook-form";
// import "react-responsive-modal/styles.css";
// import "notyf/notyf.min.css"; // Import Notyf styles
// import { Country, State, City } from "country-state-city";
// import { GetCountries, GetCity, GetState } from "react-country-state-city";
// import toast from "react-hot-toast";
// import { getphoneSearch } from "../../../../app/components/config";

// const CustomerModal = ({
//   isModalOpen,
//   closeModal,
//   modalType,
//   currentCustomer,
//   // customerTypeData,
//   // customerSubTypeData,
// }) => {
//   const [loading, setLoading] = useState(false);
//   // const[customerType, setCustomerType] = useState([])
//   // const[customerSubType, setCustomerSubType] = useState([])
//   const [customerTypeData, setCustomerTypeData] = useState([]);
//   const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
//   const [smsModal, setSmsModal] = useState(false);
//   const [newCustomer, setNewCustomer] = useState(null); // holds added customer data
//   const [customerData,setCustomerData] = useState(null);

//   // const[CustomerEnquiry ,setEnuiry]=useState("");

//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   const getToken = () => {
//     const cookie = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("access_token="));
//     return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
//   };

//   const notifyTokenMissing = () => {
//     if (typeof window !== "undefined" && window.notyf) {
//       window.notyf.error("Authentication token not found!");
//     } else {
//       console.error("Authentication token not found!");
//     }
//   };

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
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
//       city: "",
//       visit_source: "",
//       // customerType: "",
//       // customerSubType: "",
//       customerTypeData: "",
//       customerSubTypeData: "",
//       customerEnquiry: "customer",
//       remarke: "",

//       // customer_sub_type:customerTypeData,

//       // customer_type
//     },
//   });

//   const notyf = new Notyf(); // Initialize Notyf for notifications

//   const selectedCountry = watch("country");
//   const selectedState = watch("state");

//   // Load countries on component mount
//   useEffect(() => {
//     const countryList = Country.getAllCountries();
//     setCountries(countryList);
//   }, []);

//   // Load states when country changes
//   useEffect(() => {
//     if (selectedCountry) {
//       const stateList = State.getStatesOfCountry(selectedCountry);
//       setStates(stateList);
//       setCities([]); // Clear cities
//       setValue("state", "");
//       setValue("city", "");
//     }
//   }, [selectedCountry, setValue]);

//   // Fetch cities when state changes
//   // useEffect(() => {
//   //   if (selectedState && selectedCountry) {
//   //     const cityList = City.getCitiesOfState(selectedCountry, selectedState);
//   //     setCities(cityList);
//   //     setValue("city", "");
//   //   }
//   // }, [selectedState, selectedCountry, setValue]);

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }

//     axios
//       .get("https://api.equi.co.in/api/customerstype", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setCustomerTypeData(res.data.data);
//       })
//       .catch(() => {
//         alert("Failed to fetch customer types");
//       });

//     axios
//       .get("https://api.equi.co.in/api/customersubtypes", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setCustomerSubTypeData(res.data);
//       })
//       .catch(() => {
//         alert("Failed to fetch customer sub-types");
//       });
//   }, []);
//   useEffect(() => {
//     // console.log("customerTypeData",customerTypeData)
//     // Reset form values if it's an edit, otherwise keep defaults
//     if (modalType === "edit" && currentCustomer) {
//       reset(currentCustomer); // Pre-fill form for editing customer
//     } else {
//       reset(); // Clear the form for create
//     }
//   }, [modalType, currentCustomer, reset]);

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   // //CustomersubType Handler
//   // const handlerCustomberSubType = async () => {
//   //   const response = await axios.get(" https://api.equi.co.in/api/customersubtypes");
//   //   setCustomerSubTypeData(response.data);

//   //   console.log("customerSubType", data);
//   // };

//   // //CustomerType Handler
//   // const handlerCustomberType = async () => {
//   //   const response = await axios.get(" https://api.equi.co.in/api/customerstype");
//   //   setCustomerTypeData(response?.data?.data)
//   //   console.log("customerType", data);
//   // };

//   // useEffect(() => {
//   //   handlerCustomberSubType();
//   //   handlerCustomberType();
//   // }, []);

//   const onSubmit = async (data) => {
//     try {
//       console.log("data customber type", data);
//       setLoading(true);
//       console.log("data.....", data);
//       console.log("data.customerType", data.customerType);
//       const token = getCookie("access_token"); // Retrieve token

//       // const payload = {
//       //   ...data,
//       // };
//       const payload = {
//         ...data,
//         customer_type: data.customerType, // Mapping to backend's expected field
//         customer_sub_type: data.customerSubType || null, // Ensure the sub type is sent as null if not provided
//       };
//       console.log("payload", payload);

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the token in the headers
//           "Content-Type": "application/json",
//         },
//       };

//       const dataToSend = {
//   ...payload, // all your form data
//   ...(customerData?.customer_id && { customer_id: customerData.customer_id }), // only add customer_id if it exists
// };

// if (modalType === "create") {
//   try {
//     const res = await axios.post(
//       "https://api.equi.co.in/api/customers",
//       dataToSend,
//       config
//     );

//     closeModal();
//     setSmsModal(true);
//     setNewCustomer(res.data.customer?.phone || res.data[1]?.phone); // adjust based on your backend
//     toast.success("Customer created successfully!");
//     reset();
//   } catch (error) {
//     toast.error(
//       error.response?.data?.message || "Something went wrong!"
//     );
//   }
// }
//  else if (modalType === "edit") {
//         await axios.post(
//           ` https://api.equi.co.in/api/customers/${currentCustomer.id}`,
//           payload,
//           config
//         );
//         toast.success("Customer updated successfully!");
//       }

//       closeModal();
//       setLoading(false);
//     } catch (error) {
//       if (error.response) {
//         const message =
//           error.response.data.message || "This number already exists.";
//         toast.error(message);
//       } else {
//         toast.error("An unexpected error occurred.");
//       }

//       setLoading(false);
//     }
//   };

//   const handleSendSms = async () => {
//     try {
//       await axios.post("https://api.equi.co.in/api/send-customer-sms", {
//         phone: newCustomer,
//         status: "Registered Customer",
//         sms_credential_id: 1,
//       });
//       alert("SMS sent successfully");
//     } catch (err) {
//       alert("SMS failed to send");
//       console.error(err);
//     }
//     setSmsModal(false); // Close modal
//   };

//   const phone = watch("phone");

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (phone && phone.length >= 10) {
//         getphoneSearch(phone)
//           .then((res) => {
//             if (res?.data) {
//               const customer = res.data;
//               setCustomerData(res.data);

//               setValue("name", customer.name);
//               setValue("address", customer.address);
//               setValue("email", customer.email);
//               setValue("phone", customer.phone);
//               setValue("dob", customer.dob);
//               setValue("anniversary", customer.anniversary);
//               setValue("gender", customer.gender);
//               setValue("pincode", customer.pincode);
//               setValue("state", customer.state);
//               setValue("country", customer.country);
//               setValue("remarke", customer.remarke);
//               setValue("customerTypeData", customer.customer_type);
//               setValue("customerSubTypeData", customer.customer_sub_type);
//               setValue("customerEnquiry", customer.customerEnquiry);
//             }
//           })
//           .catch((err) => {
//             // Optional: clear form or show message if not found
//             console.log("Customer not found, please enter manually.");
//           });
//       }
//     }, 800); // debounce input by 800ms

//     return () => clearTimeout(delayDebounce);
//   }, [phone, setValue]);

//   return (
//     <>
//       <Modal open={isModalOpen} onClose={closeModal} center>
//         <div className="p-6 w-[800px]">
//           <h2 className="text-2xl font-bold mb-4">
//             {modalType === "create" ? "Add Customerss" : "Edit Customer"}
//           </h2>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="flex space-x-3">
//               <div className="w-full flex justify-between">
//                 <div className="w-[48%]">
//                   <label className="block text-gray-700">Customer Name</label>
//                   <input
//                     {...register("name")}
//                     type="text"
//                     className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="w-[48%]">
//                   <label className="block text-gray-700">Phone</label>
//                   <input
//                     {...register("phone")}
//                     type="text"
//                     required
//                     className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* <div className="flex space-x-3">
//             <div className="w-[300px]">
//               <label className="block text-gray-700">Phone</label>
//               <input
//                 {...register("phone")}
//                 type="text"
//                 required
//                 className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div> */}

//             {/* type ,subtype anniversary */}

//             {/* {rateMaster.map((rates) => (
//                     <option key={rates.id} value={rates.id}>
//                       {rates.labelhere} &mdash; ({rates.rate})
//                     </option>
//                   ))} */}

//             {/* customerTypeData:"",
//       customerSubTypeData:"" */}
//             <div className="flex space-x-3">
//               <div className="w-full">
//                 <label className="block text-gray-700">Customer Type</label>
//                 <select
//                   {...register("customerTypeData")}
//                   className="w-full border p-2"
//                 >
//                   <option value="">Select Customer Type</option>
//                   {customerTypeData?.map((type) => (
//                     <option key={type.id} value={type.id}>
//                       {type.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="w-full">
//                 <label className="block text-gray-700">Customer Sub Type</label>
//                 <select
//                   {...register("customerSubTypeData")}
//                   className="w-full border p-2"
//                 >
//                   <option value="">Select Customer Sub Type</option>
//                   {customerSubTypeData?.map((type) => (
//                     <option key={type.id} value={type.id}>
//                       {type.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <div className="w-full">
//                 <label className="block text-gray-700">DOB</label>
//                 <input
//                   type="date"
//                   {...register("dob")}
//                   className="w-full border p-2"
//                 />
//               </div>
//               <div className="w-full">
//                 <label className="block text-gray-700">Anniversary</label>
//                 <input
//                   type="date"
//                   {...register("anniversary")}
//                   className="w-full border p-2"
//                 />
//               </div>
//             </div>

//             {/* Gender Field CustomerEnquiry */}
//             <div className="w-full flex justify-between space-x-2">
//               <div className=" w-full">
//                 <label className="block text-gray-700">Gender</label>
//                 <select
//                   {...register("gender")}
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Gender...</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <div className="w-full">
//                 <label htmlFor="customerEnquiry text-gray-700">
//                   Purpose of Visit
//                 </label>
//                 {/* Select purpose for customer visiting the shop */}
//                 <select
//                   id="customerEnquiry"
//                   defaultValue="customer"
//                   {...register("customerEnquiry")}
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="customer">Customer</option>
//                   <option value="prospective">Prospect</option>
//                 </select>
//               </div>
//             </div>

//             {/* Other form fields */}
//             <div className="flex space-x-3">
//               <div className="w-full">
//                 <label className="block text-gray-700">Email</label>
//                 <input
//                   {...register("email")}
//                   type="email"
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//             {/* sate */}
//             <div className="flex space-x-3">
//               <div className="w-full">
//                 <label className="block text-gray-700">Address</label>
//                 <input
//                   {...register("address")}
//                   type="text"
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="flex space-x-3">
//               <div className="w-full">
//                 <label className="block text-gray-700">Pincode</label>
//                 <input
//                   {...register("pincode")}
//                   type="text"
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* <div className="flex space-x-3">
//             <div className="w-full">
//               <label className="block text-gray-700">State</label>
//               <input
//                 {...register("state")}
//                 type="text"
//                 className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="flex space-x-3">
//             <div className="w-full">
//               <label className="block text-gray-700">Country</label>
//               <input
//                 {...register("country")}
//                 type="text"
//                 className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div> */}

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//               {/* Country Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Country <span className="text-red-500"></span>
//                 </label>
//                 <select
//                   {...register("country")}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
//                 >
//                   <option value="">Select Country</option>
//                   {countries.map((country) => (
//                     <option key={country.isoCode} value={country.isoCode}>
//                       {country.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.country && (
//                   <p className="text-red-500 text-xs">
//                     {errors.country.message}
//                   </p>
//                 )}
//               </div>

//               {/* State Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   State <span className="text-red-500"></span>
//                 </label>
//                 <select
//                   {...register("state")}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
//                 >
//                   <option value="">Select State</option>
//                   {states.map((state) => (
//                     <option key={state.isoCode} value={state.isoCode}>
//                       {state.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.state && (
//                   <p className="text-red-500 text-xs">{errors.state.message}</p>
//                 )}
//               </div>

//               {/* City Field */}

//               {/* <div>
//     <label className="block text-sm font-medium text-gray-600 mb-1">
//       City <span className="text-red-500">*</span>
//     </label>
//     <select
//       {...register("city")}
//       className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
//     >
//       <option value="">Select City</option>
//       {cities.map((city) => (
//         <option key={city.name} value={city.name}>
//           {city.name}
//         </option>
//       ))}
//     </select>
//     {errors.city && (
//       <p className="text-red-500 text-xs">{errors.city.message}</p>
//     )}
//   </div> */}
//             </div>

//             {/* remakr here  */}
//             <div className="w-full mr-2">
//               <label htmlFor="remark" className="block mb-1 font-medium">
//                 Remark<span className="text-red-500"></span>
//               </label>
//               <input
//                 id="remarke"
//                 {...register("remarke")}
//                 type="text"
//                 placeholder="Mention remark..."
//                 className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button
//               type="submit"
//               className={`px-4 py-2 text-white rounded-md ${
//                 loading ? "bg-gray-400" : "bg-blue-500"
//               }`}
//               disabled={loading}
//             >
//               {loading
//                 ? "Saving..."
//                 : modalType === "create"
//                 ? "Add Customer"
//                 : "Update Customer"}
//             </button>
//           </form>
//         </div>
//       </Modal>
//       {/* Modal to confirm SMS */}
//       {smsModal && newCustomer && (
//         <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-md w-[300px]">
//             <p className="mb-4">
//               Do you want to send an SMS to <strong>{newCustomer}</strong>?
//             </p>
//             <div className="flex gap-4 justify-end">
//               <button
//                 onClick={handleSendSms}
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => setSmsModal(false)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CustomerModal;


import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import { Notyf } from "notyf";
import { useForm } from "react-hook-form";
import "react-responsive-modal/styles.css";
import "notyf/notyf.min.css"; // Import Notyf styles
import { Country, State, City } from "country-state-city";
import { GetCountries, GetCity, GetState } from "react-country-state-city";
import toast from "react-hot-toast";
import { getphoneSearch } from "../../../../app/components/config";

const CustomerModal = ({
  isModalOpen,
  closeModal,
  modalType,
  currentCustomer,
  // customerTypeData,
  // customerSubTypeData,
}) => {
  const [loading, setLoading] = useState(false);
  // const[customerType, setCustomerType] = useState([])
  // const[customerSubType, setCustomerSubType] = useState([])
  const [customerTypeData, setCustomerTypeData] = useState([]);
  const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
  const [smsModal, setSmsModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState(null); // holds added customer data
  const [customerData,setCustomerData] = useState(null);

  // const[CustomerEnquiry ,setEnuiry]=useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

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


  const defaultValues = {
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
    city: "",
    visit_source: "",
    customerTypeData: "",
    customerSubTypeData: "",
    customerEnquiry: "customer",
    remarke: "",
  };
  

  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     name: "",
  //     phone: "",
  //     dob: "",
  //     anniversary: "",
  //     email: "",
  //     gender: "",
  //     address: "",
  //     pincode: "",
  //     state: "",
  //     country: "",
  //     city: "",
  //     visit_source: "",
  //     // customerType: "",
  //     // customerSubType: "",
  //     customerTypeData: "",
  //     customerSubTypeData: "",
  //     customerEnquiry: "customer",
  //     remarke: "",

  //     // customer_sub_type:customerTypeData,

  //     // customer_type
  //   },
  // });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const notyf = new Notyf(); // Initialize Notyf for notifications

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Load countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry);
      setStates(stateList);
      setCities([]); // Clear cities
      setValue("state", "");
      setValue("city", "");
    }
  }, [selectedCountry, setValue]);

  

  useEffect(() => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    axios
      .get("https://api.equi.co.in/api/customerstype", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCustomerTypeData(res.data.data);
      })
      .catch(() => {
        alert("Failed to fetch customer types");
      });

    axios
      .get("https://api.equi.co.in/api/customersubtypes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCustomerSubTypeData(res.data);
      })
      .catch(() => {
        alert("Failed to fetch customer sub-types");
      });
  }, []);
 
  // useEffect(() => {
  //   if (modalType === "edit" && currentCustomer) {
  //     reset(currentCustomer);
  //     setCustomerData(currentCustomer); // preload customer data
  //   } else {
  //     reset(); // clear form
  //     setCustomerData(null); // clear fetched customer data
  //   }
  // }, [modalType, currentCustomer, reset]);


  useEffect(() => {
    if (modalType === "edit" && currentCustomer) {
      reset({
        ...defaultValues,
        ...currentCustomer,
      });
      setCustomerData(currentCustomer);
    } else {
      reset(defaultValues);
      setCustomerData(null);
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
      console.log("data customber type", data);
      setLoading(true);
      console.log("data.....", data);
      console.log("data.customerType", data.customerType);
      const token = getCookie("access_token"); // Retrieve token

      // const payload = {
      //   ...data,
      // };
      const payload = {
        ...data,
        customer_type: data.customerType, // Mapping to backend's expected field
        customer_sub_type: data.customerSubType || null, // Ensure the sub type is sent as null if not provided
      };
      console.log("payload", payload);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
          "Content-Type": "application/json",
        },
      };

      const dataToSend = {
  ...payload, // all your form data
  ...(customerData?.customer_id && { customer_id: customerData.customer_id }), // only add customer_id if it exists
};

if (modalType === "create") {
  try {
    const res = await axios.post(
      "https://api.equi.co.in/api/customers",
      dataToSend,
      config
    );

    closeModal();
    setSmsModal(true);
    setNewCustomer(res.data.customer?.phone || res.data[1]?.phone); // adjust based on your backend
    toast.success("Customer created successfully!");
    reset();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong!"
    );
  }
}
 else if (modalType === "edit") {
        await axios.post(
          ` https://api.equi.co.in/api/customers/${currentCustomer.id}`,
          payload,
          config
        );
        toast.success("Customer updated successfully!");
      }

      closeModal();
      setLoading(false);
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data.message || "This number already exists.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }

      setLoading(false);
    }
  };

  const handleSendSms = async () => {
    try {
      await axios.post("https://api.equi.co.in/api/send-customer-sms", {
        phone: newCustomer,
        status: "Registered Customer",
        sms_credential_id: 1,
      });
      alert("SMS sent successfully");
    } catch (err) {
      alert("SMS failed to send");
      console.error(err);
    }
    setSmsModal(false); // Close modal
  };

  const phone = watch("phone");

 
  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (phone && phone.length >= 10 && modalType === "create") {
        getphoneSearch(phone)
          .then((res) => {
            if (res?.data) {
              const customer = res.data;
              setCustomerData(customer);
  
              // fill fields only in create mode
              setValue("name", customer.name);
              setValue("address", customer.address);
              setValue("email", customer.email);
              setValue("phone", customer.phone);
              setValue("dob", customer.dob);
              setValue("anniversary", customer.anniversary);
              setValue("gender", customer.gender);
              setValue("pincode", customer.pincode);
              setValue("state", customer.state);
              setValue("country", customer.country);
              setValue("remarke", customer.remarke);
              setValue("customerTypeData", customer.customer_type);
              setValue("customerSubTypeData", customer.customer_sub_type);
              setValue("customerEnquiry", customer.customerEnquiry);
            }
          })
          .catch(() => {
            console.log("Customer not found.");
          });
      }
    }, 800);
  
    return () => clearTimeout(delayDebounce);
  }, [phone, setValue, modalType]);
  

  return (
    <>
      <Modal open={isModalOpen} onClose={closeModal} center>
        <div className="p-6 w-[800px]">
          <h2 className="text-2xl font-bold mb-4">
            {modalType === "create" ? "Add Customerss" : "Edit Customer"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-3">
              <div className="w-full flex justify-between">
                <div className="w-[48%]">
                  <label className="block text-gray-700">Customer Name</label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-[48%]">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    {...register("phone")}
                    type="text"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* <div className="flex space-x-3">
            <div className="w-[300px]">
              <label className="block text-gray-700">Phone</label>
              <input
                {...register("phone")}
                type="text"
                required
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div> */}

            {/* type ,subtype anniversary */}

            {/* {rateMaster.map((rates) => (
                    <option key={rates.id} value={rates.id}>
                      {rates.labelhere} &mdash; ({rates.rate})
                    </option>
                  ))} */}

            {/* customerTypeData:"",
      customerSubTypeData:"" */}
            <div className="flex space-x-3">
              <div className="w-full">
                <label className="block text-gray-700">Customer Type</label>
                <select
                  {...register("customerTypeData")}
                  className="w-full border p-2"
                >
                  <option value="">Select Customer Type</option>
                  {customerTypeData?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className="block text-gray-700">Customer Sub Type</label>
                <select
                  {...register("customerSubTypeData")}
                  className="w-full border p-2"
                >
                  <option value="">Select Customer Sub Type</option>
                  {customerSubTypeData?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
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

            {/* Gender Field CustomerEnquiry */}
            <div className="w-full flex justify-between space-x-2">
              <div className=" w-full">
                <label className="block text-gray-700">Gender</label>
                <select
                  {...register("gender")}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="customerEnquiry text-gray-700">
                  Purpose of Visit
                </label>
                {/* Select purpose for customer visiting the shop */}
                <select
                  id="customerEnquiry"
                  defaultValue="customer"
                  {...register("customerEnquiry")}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="customer">Customer</option>
                  <option value="prospective">Prospect</option>
                </select>
              </div>
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
            {/* sate */}
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

            {/* <div className="flex space-x-3">
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
          </div> */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Country Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Country <span className="text-red-500"></span>
                </label>
                <select
                  {...register("country")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-xs">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* State Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  State <span className="text-red-500"></span>
                </label>
                <select
                  {...register("state")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-xs">{errors.state.message}</p>
                )}
              </div>

              
            </div>

            {/* remakr here  */}
            <div className="w-full mr-2">
              <label htmlFor="remark" className="block mb-1 font-medium">
                Remark<span className="text-red-500"></span>
              </label>
              <input
                id="remarke"
                {...register("remarke")}
                type="text"
                placeholder="Mention remark..."
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
      {/* Modal to confirm SMS */}
      {smsModal && newCustomer && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[300px]">
            <p className="mb-4">
              Do you want to send an SMS to <strong>{newCustomer}</strong>?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleSendSms}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setSmsModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerModal;

