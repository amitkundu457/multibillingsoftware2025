// "use client";
// import React, { useEffect, useState } from "react";
// import { FaArrowLeft } from "react-icons/fa";
// import { ImCross } from "react-icons/im";
// import { FaPlus } from "react-icons/fa";
// import axios from "axios";
// import { State, City } from "country-state-city";

// import {
//   StoreAccount,
//   StoreAccountMaster,
//   getAccountMaster,
//   getAccount,
//   createAccountGroup,
//   getAccountGroup,
//   UpdateAccount,
//   DeleteAccount,
//   deleteCoin,
//   //   getAccountType,
// } from "@/app/components/config";

// export const Model = ({ onClose }) => {
//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       onClick={onClose} // Close the modal when the background is clicked
//     >
//       <div
//         className="bg-white p-6 rounded-lg shadow-lg w-96"
//         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
//       >
//         <h2 className="text-xl font-bold mb-4">Add Group</h2>
//         <input
//           type="text"
//           placeholder="Group name"
//           className="w-full p-2 border rounded-md mb-4"
//         />
//         <div className="flex justify-between">
//           <button
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
//             onClick={onClose} // Close the modal when "Cancel" is clicked
//           >
//             Cancel
//           </button>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AccountForm = ({ closeModel, selectedItem ,fetchData }) => {
//   const [showModel, setShowModel] = useState(false);
//   const [customer, setCustomer] = useState([]);
//   const [groupData, setGroupData] = useState([]);

//   //   my sides
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);

//   const [accountmasterdata, setaccountmasterdata] = useState({
//     account_name: "",
//     gstin: "",
//     phone: "",
//     account_group_id: "",
//     city: "",
//     state: "",
//     contact_person: "",
//     blance: "",
//     status: false,
//   });
//   const selectedCountry = "IN";

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










//   async function groupDataFunction() {
//     const groupDatas = await getAccountGroup();
//     setGroupData(groupDatas.data);
//   }
//   // Fetch states for India (country code 'IN')
//   useEffect(() => {
//     const statesList = State.getStatesOfCountry(selectedCountry).map(
//       (state) => ({
//         value: state.isoCode,
//         label: state.name,
//       })
//     );
//     console.log("stateList", statesList);
//     setStates(statesList);
//     setSelectedState(null); // Reset state selection when country changes
//     setCities([]); // Clear cities when country changes
//     setSelectedCity(null); // Reset city selection when country changes
//   }, [selectedCountry]);

//   // Fetch cities when a state is selected
//   useEffect(() => {
//     console.log("selectedState", selectedState);
//     if (selectedState) {
//       const citiesList = City.getCitiesOfState(
//         selectedCountry,
//         selectedState.value
//       ).map((city) => ({
//         value: city.name,
//         label: city.name,
//       }));
//       setCities(citiesList);
//       setSelectedCity(null); // Reset city selection when state changes
//     } else {
//       setCities([]);
//       setSelectedCity(null);
//     }
//   }, [selectedState]);

//   // Fetch cities when a state is selected
//   useEffect(() => {
//     if (selectedState) {
//       console.log("selectedountry", selectedState);
//       const citiesList = City.getCitiesOfState(
//         selectedCountry,
//         selectedState.value
//       ).map((city) => ({
//         value: city.name,
//         label: city.name,
//       }));
//       console.log("citiesList", citiesList);
//       setCities(citiesList);
//       setSelectedCity(null); // Reset city selection when state changes
//     } else {
//       setCities([]);
//       setSelectedCity(null);
//     }
//   }, [selectedState]);

//   useEffect(() => {
//     groupDataFunction();
//   }, []);

//   //   udated here
//   useEffect(() => {
//     setaccountmasterdata((prev) => ({
//       ...prev,
//       state: selectedState ? selectedState.label : "",
//     }));
//   }, [selectedState]);

//   useEffect(() => {
//     setaccountmasterdata((prev) => ({
//       ...prev,
//       city: selectedCity ? selectedCity.label : "",
//     }));
//   }, [selectedCity]);

//   useEffect(() => {
//     if (selectedItem) {
//       setaccountmasterdata(selectedItem);
//     }
//   }, [selectedItem]);

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     axios
//       .get("http://127.0.0.1:8000/api/customers",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then((response) => {
//         setCustomer(response.data);
//       })
//       .catch(() => {
//         alert("failed to load customer name");
//       });
//   }, []);

//   const handleData = (e) => {
//     setaccountmasterdata({
//       ...accountmasterdata,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const submitAccountData = () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     if (selectedItem) {
//       axios
//         .put(
//           `http://127.0.0.1:8000/api/account-masters/${selectedItem.id}`,
//           accountmasterdata
//         )
//         .then(() => {
//           alert("data updated succesfully");
//           fetchData()
//           // closeModel();
//         })
//         .catch(() => {
//           alert("Failed to update data, try again");
//         });
//     } else {
//       axios
//         .post("http://127.0.0.1:8000/api/account-masters", accountmasterdata,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//         .then(() => {
//           alert("Data submitted successfully!");
//           closeModel();
//           setaccountmasterdata({
//             account_name: "",
//             gstin: "",
//             phone: "",
//             account_group_id: "",
//             city: "",
//             state: "",
//             contact_person: "",
//             blance: "",
//             status: false,
//           });
//         })
//         .catch(() => alert("Failed to submit data, try again"));
//     }
//   };
//   const cancelFormModel = () => {
//     closeModel();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="flex justify-between items-center bg-green-600 p-4">
//           <button className="text-white">
//             <FaArrowLeft className="text-2xl" />
//           </button>
//           <h2 className="text-white text-lg font-semibold">Account Master</h2>
//           <button onClick={cancelFormModel} className="text-white">
//             <ImCross className="text-2xl" />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               name="account_name"
//               value={accountmasterdata.account_name}
//               onChange={handleData}
//               type="text"
//               placeholder="Account Name"
//               className="border border-gray-300 p-2 rounded w-full"
//             />
//             <select
//               name="account_group_id"
//               value={accountmasterdata.account_group_id}
//               onChange={handleData}
//               className="border border-gray-300 p-2 rounded w-full"
//             >
//               <option value="" disabled>
//                 Select Group
//               </option>

//               {groupData.map((grp) => (
//                 <option value={grp.id} key={grp.id}>
//                   {grp.name}
//                 </option>
//               ))}
//             </select>

//             <input
//               name="gstin"
//               value={accountmasterdata.gstin}
//               onChange={handleData}
//               type="text"
//               placeholder="GSTIN"
//               className="border border-gray-300 p-2 rounded w-full"
//             />
//             <input
//               name="phone"
//               value={accountmasterdata.phone}
//               onChange={handleData}
//               type="text"
//               placeholder="Phone No"
//               className="border border-gray-300 p-2 rounded w-full"
//             />
//             {/* <select
//               name="city"
//               value={accountmasterdata.city}
//               onChange={handleData}
//               className="border border-gray-300 p-2 rounded w-full"
//             >
//               <option value="">Select City</option>
//               <option value="kolkata">Kolkata</option>
//               <option value="mumbai">Mumbai</option>
//               <option value="delhi">Delhi</option>
//               <option value="pune">Pune</option>
//             </select> */}

//             <select
//               value={selectedCity?.value || ""}
//               onChange={(e) => {
//                 const cityObj = cities.find(
//                   (city) => city.value === e.target.value
//                 );
//                 setSelectedCity(cityObj);
//                 setaccountmasterdata((prev) => ({
//                   ...prev,
//                   city: cityObj?.label || "",
//                 }));
//               }}
//               className="border border-gray-300 p-2 rounded w-full mb-4"
//               disabled={!selectedState}
//             >
//               <option value="">Select City</option>
//               {cities.map((city) => (
//                 <option key={city.value} value={city.value}>
//                   {city.label}
//                 </option>
//               ))}
//             </select>

//             {/* account type add   */}

//             {/* <input
//               name="state"
//               value={accountmasterdata.state}
//               onChange={handleData}
//               type="text"
//               placeholder="State"
//               className="border border-gray-300 p-2 rounded w-full"
//             /> */}

//             {/* <label className="block text-sm font-medium text-gray-700">
//               State
//             </label> */}

//             <select
//               value={selectedState?.value || ""}
//               onChange={(e) => {
//                 const stateObj = states.find(
//                   (state) => state.value === e.target.value
//                 );
//                 setSelectedState(stateObj);
//                 setaccountmasterdata((prev) => ({
//                   ...prev,
//                   state: stateObj?.label || "",
//                 }));
//               }}
//               className="border border-gray-300 p-2 rounded w-full mb-4"
//             >
//               <option value="">Select State</option>
//               {states.map((state) => (
//                 <option key={state.value} value={state.value}>
//                   {state.label}
//                 </option>
//               ))}
//             </select>

//             <input
//               name="contact_person"
//               value={accountmasterdata.contact_person}
//               onChange={handleData}
//               type="text"
//               placeholder="Contact Person"
//               className="border border-gray-300 p-2 rounded w-full"
//             />
//             <input
//               name="blance"
//               value={accountmasterdata.blance}
//               onChange={handleData}
//               type="text"
//               placeholder="Balance"
//               className="border border-gray-300 p-2 rounded w-full"
//             />

//             {/* opening blance */}

//             <div>
//               <input
//                 type="text"
//                 // name="blance"
//                 placeholder="Opening balance"
//                 className="border border-gray-300 p-2 rounded w-full"
//               />
//             </div>
//           </div>

//           <div className="flex justify-between">
//             <div className="mt-4 flex items-center">
//               <label className="mr-2 text-gray-700">Is Active?</label>
//               <input
//                 name="status"
//                 type="checkbox"
//                 checked={accountmasterdata.status}
//                 onChange={() =>
//                   setaccountmasterdata({
//                     ...accountmasterdata,
//                     status: !accountmasterdata.status,
//                   })
//                 }
//                 className="form-checkbox h-5 w-5 text-green-600"
//               />
//             </div>

//             {/* is Debit */}
//             <div className="flex gap-2 items-center">
//               <label className="mr-2 text-gray-700">Is Debit?</label>
//               <div className="flex items-center gap-2">
//                 <div>
//                   <input
//                     type="checkbox"
//                     name="status"
//                     //   checked={isDebit}
//                     //   onChange={() => setIsDebit(!isDebit)}
//                     className="toggle-checkbox"
//                   />
//                 </div>
//                 <div>Yes</div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end">
//             <button
//               onClick={submitAccountData}
//               className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountForm;

//  "use client";
// import { Modal } from "react-responsive-modal";
// import React, { useState, useRef, useEffect } from "react";
// import { State, City } from "country-state-city";
// import "react-responsive-modal/styles.css";
// import { useForm } from "react-hook-form";
// import Select from "react-select";
// import axios from 'axios';
// import {
//   StoreAccount,
//   StoreAccountMaster,
//   getAccountMaster,
//   getAccount,
//   createAccountGroup,
//   getAccountGroup,
//   UpdateAccount,
//   DeleteAccount,
//   deleteCoin,
//   getAccountType,
// } from "@/app/components/config";
//  import { FaUserPlus, FaPlus, FaPrint, FaPencilAlt } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { Notyf } from "notyf";
// import ReactDOM from "react-dom";
// import { createRoot } from "react-dom/client";
// const notyf = new Notyf();
//   // import { Notyf } from 'notyf';
// import "notyf/notyf.min.css"; // Import Notyf CSS

//  const AccountForm = ({ closeModel, selectedItem }) => {
//     const [error, setError] = useState(null);
//     const cancelFormModel = () => {
//       closeModel();
//     };

//    const {
//       register: registerThree,
//       handleSubmit: handleSubmitThree,
//       //formState: { errors: errors },
//     } = useForm();

//   const [entries, setEntries] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [modalType, setModalType] = useState("");
//   const [filter, setFilter] = useState("RECEIPT");
//   const [dateRange, setDateRange] = useState({ from: "", to: "" });
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [submitStatus, setSubmitStatus] = useState("");
//   const [accountmaster, setAccountMaster] = useState("");
//   const [isDebit, setIsDebit] = useState(false);
//   const [accountMasters, setAccountMasters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [accountgroup, setAccountGroup] = useState([]);
//   const [accountType, setAccountType] = useState([]);
//   const [newAccountType, setNewAccountType] = useState("");

//   const [accountTypeModal, setAccountTypeModal] = useState(false);

//   const [masterGroup, setMasterGroup] = useState(false);

//   const selectedCountry = "IN"; // Set country to India (ISO code 'IN')
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);

//   // Fetch states for India (country code 'IN')
//   useEffect(() => {
//     const statesList = State.getStatesOfCountry(selectedCountry).map(
//       (state) => ({
//         value: state.isoCode,
//         label: state.name,
//       })
//     );
//     setStates(statesList);
//     setSelectedState(null); // Reset state selection when country changes
//     setCities([]); // Clear cities when country changes
//     setSelectedCity(null); // Reset city selection when country changes
//   }, [selectedCountry]);

//   // Fetch cities when a state is selected
//   useEffect(() => {
//     if (selectedState) {
//       const citiesList = City.getCitiesOfState(
//         selectedCountry,
//         selectedState.value
//       ).map((city) => ({
//         value: city.name,
//         label: city.name,
//       }));
//       setCities(citiesList);
//       setSelectedCity(null); // Reset city selection when state changes
//     } else {
//       setCities([]);
//       setSelectedCity(null);
//     }
//   }, [selectedState]);

//   // Handle state selection
// const handleStateChange = (selectedOption) => {
//   setSelectedState(selectedOption);
//   setValue("state", selectedOption ? selectedOption.label : ""); // Update form state
// };

// // Handle city selection
// const handleCityChange = (selectedOption) => {
//   setSelectedCity(selectedOption);
//   setValue("city", selectedOption ? selectedOption.label : ""); // Update form city
// };
// const accountTypeSubmit = async (e) => {
//   e.preventDefault(); // Prevent the default form submission

//   const data = { name: newAccountType };

//   try {
//     const response = await fetch("http://127.0.0.1:8000/api/account-types", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       // Successfully submitted, close the modal and handle success
//       alert("Account Type saved successfully!");
//       setNewAccountType(""); // Clear the input field
//       handleCloseAccountType(); // Close the modal

//       // Optionally, refetch the account types after submission
//       fetchAccountType(); // You can call a function passed as prop to re-fetch
//     } else {
//       alert("Failed to save Account Type");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("An error occurred. Please try again.");
//   }
// };

// const handleSubmitdata = async (event) => {
//   event.preventDefault();

//   const formData = new FormData(event.target);
//   const data = Object.fromEntries(formData);
//   data.status = isDebit ? 1 : 0;

//   // Include selected state and city in the data
//   if (selectedState) data.state = selectedState.value;
//   if (selectedCity) data.city = selectedCity.value;

//   try {
//     const response = await axios.post("http://127.0.0.1:8000/api/account-masters", data, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer YOUR_ACCESS_TOKEN"
//       }
//     });
//     console.log("Success:", response.data);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

//   const onmasterSubmitgroup = async (data) => {
//     try {
//       // Send the data to the backend
//       const response = await createAccountGroup(data);
//       console.log(response);
//       setSubmitStatus("Receipt created successfully!");
//       notyf.success(`Data placed successfully!`);
//       fetchAccountGroup();
//       reset(); // Reset the form after successful submission
//     } catch (error) {
//       console.error(error);
//       setSubmitStatus("Failed to create receipt.");
//       notyf.error("Failed to place order. Please try again.");
//     }
//   };

//   const handleCloseMaster = () => {
//     setAccountMaster(false);
//   };

//   const handleAccountType = () => {
//     setAccountTypeModal(true);
//   };
//   const handleCloseAccountType = () => {
//     setAccountTypeModal(false);
//   };

//   const handleGroup = () => {
//     setMasterGroup(true);
//   };
//   const handleCloseGroup = () => {
//     setMasterGroup(false);
//   };

//    return (
//      <div>
//         <Modal open={accountmaster} onClose={handleCloseMaster} center>
//         <div className="p-6 bg-white rounded-md shadow-md max-w-lg mx-auto">
//           <h1 className="text-lg font-bold mb-4">Account Form</h1>
//           <form onSubmit={handleSubmitdata}>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Account Name</label>
//                 <input type="text" name="account_name" className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Account Type</label>
//                 <select name="account_type_id" className="flex-grow p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
//                   <option value="">Select account type</option>
//                   {accountType.map((account) => (
//                     <option key={account.id} value={account.id}>{account.name}</option>
//                   ))}
//                 </select>

//                 <div
//                       onClick={handleAccountType}
//                       className="bg-green-600 h-[30px] w-[30px] rounded grid place-items-center text-white ml-2"
//                     >
//                       <FaPlus />
//                     </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">GSTIN</label>
//                 <input type="text" name="gstin" maxLength={15} className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Phone No</label>
//                 <input type="text" name="phone" maxLength={10} className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Select Group</label>
//                 <select name="account_group_id" className="flex-1 w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
//                   <option value="">Select Group</option>
//                   {accountgroup.map((grp) => (
//                     <option value={grp.id} key={grp.id}>{grp.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div
//                     onClick={handleGroup}
//                     className=" grid place-items-center"
//                   >
//                     <div className="bg-green-600 h-[30px] rounded grid place-items-center text-white  w-[30px]  ">
//                       <FaPlus />
//                     </div>
//                   </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Address</label>
//                 <textarea name="address" maxLength={250} className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Select State</label>
//                 <Select value={selectedState} onChange={handleStateChange} options={states} placeholder="Select State" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Select City</label>
//                 <Select value={selectedCity} onChange={handleCityChange} options={cities} isDisabled={!selectedState} placeholder="Select City" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Contact Person</label>
//                 <input type="text" name="contact_person" className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Opening balance</label>
//                 <input type="text" name="blance" className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Is Debit?</label>
//                 <div className="flex items-center gap-2">
//                   <span>No</span>
//                   <input type="checkbox" name="status" checked={isDebit} onChange={() => setIsDebit(!isDebit)} className="toggle-checkbox" />
//                   <span>Yes</span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4">
//               <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none">Save</button>
//             </div>
//           </form>
//         </div>
//       </Modal>

//        {/* account type model */}

//             <Modal open={accountTypeModal} onClose={handleCloseAccountType}>
//               <div className="modal-content">
//                 <form onSubmit={accountTypeSubmit}>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Account Type
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter Account Type"
//                       name="newAccountType"
//                       value={newAccountType}
//                       onChange={(e) => setNewAccountType(e.target.value)} // Update the state
//                       className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>

//                   <div className="mt-4">
//                     <button
//                       type="submit"
//                       className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </Modal>

//              {/* //select group */}
//              <Modal open={masterGroup} onClose={handleCloseGroup}>
//                     <form onSubmit={handleSubmitThree(onmasterSubmitgroup)}>
//                       <div>
//                         <label className="block text-sm font-medium mb-1">
//                           Account Group
//                         </label>
//                         <input
//                           type="text"
//                           {...registerThree("name", {
//                             required: " Name is required",
//                             maxLength: 255,
//                           })}
//                           className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />

//                       </div>
//                       <div className="mt-4">
//                         <button
//                           type="submit"
//                           className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none"
//                         >
//                           Save
//                         </button>
//                       </div>
//                     </form>
//                   </Modal>

//      </div>
//    )
//  }

//  export default AccountForm;


"use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { State, City } from "country-state-city";

import {
  getAccountGroup
} from "@/app/components/config";

export const Model = ({ onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-96"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold mb-4">Add Group</h2>
      <input
        type="text"
        placeholder="Group name"
        className="w-full p-2 border rounded-md mb-4"
      />
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          onClick={onClose}
        >
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Save
        </button>
      </div>
    </div>
  </div>
);

const AccountForm = ({ closeModel, selectedItem, fetchData }) => {
  const [groupData, setGroupData] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [accountData, setAccountData] = useState({
    account_name: "",
    gstin: "",
    phone: "",
    account_group_id: "",
    city: "",
    state: "",
    contact_person: "",
    blance: "",
    status: false,
  });

  const selectedCountry = "IN";

  const getToken = () => {
    const cookie = document.cookie.split("; ").find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const notifyTokenMissing = () => {
    if (typeof window !== "undefined" && window.notyf) {
      window.notyf.error("Authentication token not found!");
    } else {
      console.error("Authentication token not found!");
    }
  };

  useEffect(() => {
    setStates(
      State.getStatesOfCountry(selectedCountry).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    );
    setSelectedState(null);
    setCities([]);
    setSelectedCity(null);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      const citiesList = City.getCitiesOfState(selectedCountry, selectedState.value).map((city) => ({
        value: city.name,
        label: city.name,
      }));
      setCities(citiesList);
      setSelectedCity(null);
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedState]);

  useEffect(() => {
    setAccountData((prev) => ({
      ...prev,
      state: selectedState?.label || "",
      city: selectedCity?.label || "",
    }));
  }, [selectedState, selectedCity]);

  useEffect(() => {
    if (selectedItem) {
      setAccountData(selectedItem);
    }
  }, [selectedItem]);

  useEffect(() => {
    getAccountGroup().then((res) => setGroupData(res.data));
  }, []);

  const handleChange = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const submitData = async () => {
    const token = getToken();
    if (!token) return notifyTokenMissing();

    try {
      if (selectedItem) {
        await axios.put(
          `http://127.0.0.1:8000/api/account-masters/${selectedItem.id}`,
          accountData
        );
        alert("Data updated successfully");
        fetchData();
        closeModel();
      } else {
        await axios.post("http://127.0.0.1:8000/api/account-masters", accountData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Data submitted successfully");
        closeModel();
        setAccountData({
          account_name: "",
          gstin: "",
          phone: "",
          account_group_id: "",
          city: "",
          state: "",
          contact_person: "",
          blance: "",
          status: false,
        });
      }
    } catch (error) {
      alert("Failed to submit/update data, try again");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center bg-green-600 p-4">
          <button className="text-white">
            <FaArrowLeft className="text-2xl" />
          </button>
          <h2 className="text-white text-lg font-semibold">Account Master</h2>
          <button onClick={closeModel} className="text-white">
            <ImCross className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="account_name" value={accountData.account_name} onChange={handleChange} placeholder="Account Name" className="border border-gray-300 p-2 rounded w-full" />
            <select name="account_group_id" value={accountData.account_group_id} onChange={handleChange} className="border border-gray-300 p-2 rounded w-full">
              <option value="" disabled>Select Group</option>
              {groupData.map((grp) => (
                <option key={grp.id} value={grp.id}>{grp.name}</option>
              ))}
            </select>
            <input name="gstin" value={accountData.gstin} onChange={handleChange} placeholder="GSTIN" className="border border-gray-300 p-2 rounded w-full" />
            <input name="phone" value={accountData.phone} onChange={handleChange} placeholder="Phone No" className="border border-gray-300 p-2 rounded w-full" />

            <select value={selectedCity?.value || ""} onChange={(e) => setSelectedCity(cities.find((c) => c.value === e.target.value))} className="border border-gray-300 p-2 rounded w-full">
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </select>

            <select value={selectedState?.value || ""} onChange={(e) => setSelectedState(states.find((s) => s.value === e.target.value))} className="border border-gray-300 p-2 rounded w-full">
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.value} value={state.value}>{state.label}</option>
              ))}
            </select>

            <input name="contact_person" value={accountData.contact_person} onChange={handleChange} placeholder="Contact Person" className="border border-gray-300 p-2 rounded w-full" />
            <input name="blance" value={accountData.blance} onChange={handleChange} placeholder="Balance" className="border border-gray-300 p-2 rounded w-full" />
          </div>

          <div className="flex justify-between items-center mt-4">
            <label className="flex items-center gap-2 text-gray-700">
              <span>Is Active?</span>
              <input type="checkbox" checked={accountData.status} onChange={() => setAccountData({ ...accountData, status: !accountData.status })} />
            </label>

            <button onClick={submitData} className="px-6 py-2 bg-blue-600 text-white rounded-md">
              {selectedItem ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
