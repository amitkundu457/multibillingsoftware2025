// "use client";

// import React, { useState, useEffect } from "react";
// import { Modal } from "react-responsive-modal";
// import "react-responsive-modal/styles.css";
// import axios from "axios";
// import Image from "next/image";
// import {
//   getcompany,
//   baseImageURL,
//   getRate,
//   getProductService,
//   createProductService,
//   updateProductService,
//   getServiceGroup,
//   getType,
//   deleteProductService,
// } from "@/app/components/config";

// const ItemManagement = () => {
//   const [items, setItems] = useState([]); // Stores item data
//   const [openModal, setOpenModal] = useState(false); // Modal state
//   const [currentItem, setCurrentItem] = useState(null); // Current item for editing
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [company, setCompany] = useState([]);
//   const [rate, setRate] = useState([]);
//   const [group, setGroup] = useState([]);
//   const [type, setItemstype] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     type: "",
//     code: "",
//     company_id: "",
//     group_id: "",
//     input_gst: "0%",
//     output_gst: "0%",
//     rate: 0,
//     mrp: 0,
//     commission: 0,
//     stock_maintain: false,
//     hsn: "",
//     rate_type: "",
//     image: null,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getProductService();
//         setItems(response.data); // Assuming the API returns an array
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load data");
//         setLoading(false);
//       }
//     };
//     fetchData();
//     fetchItemsrate();
//     fetchItemscompany();
//     fetchItemsgrop();
//     fetchItemstype();
//   }, []);

//   console.log(baseImageURL);

//   const fetchItemsrate = async () => {
//     try {
//       const response = await getRate();
//       setRate(response.data);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   const fetchItemscompany = async () => {
//     try {
//       const response = await getcompany();
//       setCompany(response.data);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   const fetchItemsgrop = async () => {
//     try {
//       const response = await getServiceGroup();
//       setGroup(response.data);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   const fetchItemstype = async () => {
//     try {
//       const response = await getType();
//       setItemstype(response.data);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   // Handle form changes
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Handle file input
//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       image: e.target.files[0],
//     });
//   };

//   // Handle save (Create/Update)
//   const handleSave = async (e) => {
//     e.preventDefault();

//     // Prepare FormData
//     const formDataToSend = new FormData();
//     for (const key in formData) {
//       formDataToSend.append(key, formData[key]);
//     }

//     try {
//       if (currentItem) {
//         // Update an existing item using updateProductService
//         await updateProductService(currentItem.id, formDataToSend);
//       } else {
//         // Create a new item using createProductService
//         const response = await createProductService(formDataToSend);

//         // Add the new item to the state
//         setItems((prev) => [...prev, response.data]);
//       }

//       // Close modal and reset form
//       setOpenModal(false);
//       setCurrentItem(null);
//       resetForm();
//     } catch (error) {
//       console.error("Error saving item:", error);
//     }
//   };

//   const handleEdit = (item) => {
//     setCurrentItem(item);
//     setFormData(item); // Populate the form with the selected item
//     setOpenModal(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       // Use the deleteProductService function to send DELETE request
//       await deleteProductService(id);

//       // Remove the deleted item from the state
//       setItems((prev) => prev.filter((item) => item.id !== id));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//       // Optionally, show an error message
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       name: "",
//       type: "",
//       code: "",
//       company_id: "",
//       group_id: "",
//       input_gst: "0%",
//       output_gst: "0%",
//       rate_type: 0,
//       rate: 0,
//       mrp: 0,
//       commission: 0,
//       stock_maintain: false,
//       hsn: "",
//       image: null,
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Item Management</h1>
//         <button
//           onClick={() => {
//             setOpenModal(true);
//             resetForm();
//           }}
//           className="bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Add Item
//         </button>
//       </div>

//       {/* Table */}
//       <table className="w-full bg-white rounded-lg shadow overflow-hidden">
//         <thead>
//           <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
//             <th className="p-3">Item </th>
//             <th className="p-3">Item Name</th>
//             <th className="p-3">Code</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => (
//             <tr key={item.id} className="border-b">
//               <td className="p-3">
//                 <img
//                   src={`${baseImageURL}storage/${item.image}`}
//                   alt={item.name || "Image"}
//                   width={100}
//                   height={100}
//                   layout="intrinsic"
//                 />
//               </td>
//               <td className="p-3">{item.name}</td>
//               <td className="p-3">{item.code}</td>
//               <td className="p-3">
//                 <button
//                   onClick={() => handleEdit(item)}
//                   className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(item.code)}
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)} center>
//         <h2 className="text-xl font-bold mb-4">
//           {currentItem ? "Edit Item" : "Add Item"}
//         </h2>
//         <form onSubmit={handleSave} className="space-y-4" encType="">
//           <div className="grid grid-cols-2 gap-4">
//             {/* Fields */}
//             {[
//               { label: "Item Name", name: "name", type: "text" },
//               { label: "Code", name: "code", type: "text" },
//               { label: "MRP", name: "mrp", type: "number" },
//               { label: "Rate", name: "rate", type: "number" },
//               { label: "HSN", name: "hsn", type: "text" },
//             ].map((field) => (
//               <div key={field.name}>
//                 <label className="block text-sm font-medium text-gray-700">
//                   {field.label}
//                 </label>
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   value={formData[field.name]}
//                   onChange={handleInputChange}
//                   className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500"
//                 />
//               </div>
//             ))}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Rate Type
//               </label>
//               <select
//                 name="rate_type"
//                 value={formData.rate_type}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option>Select item type</option>
//                 {type.map((rates) => (
//                   <option key={rates.id} value={rates.id}>
//                     {rates.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Item Type
//               </label>
//               <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option>Select item type</option>
//                 {rate.map((rates) => (
//                   <option key={rates.id} value={rates.id}>
//                     {rates.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Company
//               </label>
//               <select
//                 name="company_id"
//                 value={formData.company_id}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option>Select item type</option>
//                 {company.map((rates) => (
//                   <option key={rates.id} value={rates.id}>
//                     {rates.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Item Group
//               </label>
//               <select
//                 name="group_id"
//                 value={formData.group_id}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option>Select item Group</option>
//                 {group.map((rates) => (
//                   <option key={rates.id} value={rates.id}>
//                     {rates.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Select GST */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Input GST
//               </label>
//               <select
//                 name="input_gst"
//                 value={formData.input_gst}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option>0%</option>
//                 <option>5%</option>
//                 <option>12%</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Output GST
//               </label>
//               <select
//                 name="output_gst"
//                 value={formData.output_gst}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option>0%</option>
//                 <option>5%</option>
//                 <option>12%</option>
//               </select>
//             </div>

//             {/* Image Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Image
//               </label>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//             >
//               {currentItem ? "Update Item" : "Add Item"}
//             </button>
//             <button
//               type="button"
//               onClick={() => setOpenModal(false)}
//               className="bg-gray-300 text-black px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default ItemManagement;


// "use client";

// import React, { useState, useEffect } from "react";
// import { Modal } from "react-responsive-modal";
// import "react-responsive-modal/styles.css";
// import axios from "axios";
// import Image from "next/image";
// import {
//   getcompany,
//   baseImageURL,
//   getRate,
//   getProductService,
//   createProductService,
//   updateProductService,
//   getServiceGroup,
//   getType,
//   deleteProductService,
// } from "@/app/components/config";

// const ItemManagement = () => {
//   const [items, setItems] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [currentItem, setCurrentItem] = useState();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [company, setCompany] = useState([]);
//   const [rate, setRate] = useState([]);
//   const [rateMaster, setRateMaster] = useState([]);
//   const [group, setGroup] = useState([]);
//   const [type, setItemstype] = useState([]);
//   const [taxes, setTaxes] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     type: "",
//     code: "",
//     company_id: "",
//     group_id: "",
//     input_gst: "",
//     output_gst: "",
//     gram: 0,
//     mrp: 0,
//     tax_rate: "",
//     stock_maintain: false,
//     hsn: "",
//     rate_id: "",
//     image: null,
//   });

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
//     return null;
//   };

//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const accessToken = getCookie("access_token");
//     if (!accessToken) return;
//     setToken(accessToken);
//   }, []);

//   useEffect(() => {
//     if (!token) return;

//     axios
//       .get("http://127.0.0.1:8000/api/ratemasterget", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setRateMaster(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [token]);

//   useEffect(() => {
//     if (!token) return;
//     fetchTaxes();
//   }, [token]);

//   useEffect(() => {
//     fetchData();
//     fetchItemsrate();
//     fetchItemscompany();
//     fetchItemsgrop();
//     fetchItemstype();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await getProductService();
//       setItems(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to load data");
//       setLoading(false);
//     }
//   };

//   const fetchItemsrate = async () => {
//     try {
//       const response = await getRate();
//       setRate(response.data);
//     } catch (error) {
//       console.error("Error fetching rate:", error);
//     }
//   };

//   const fetchItemscompany = async () => {
//     try {
//       const response = await getcompany();
//       setCompany(response.data);
//     } catch (error) {
//       console.error("Error fetching company:", error);
//     }
//   };

//   const fetchItemsgrop = async () => {
//     try {
//       const response = await getServiceGroup();
//       setGroup(response.data);
//     } catch (error) {
//       console.error("Error fetching group:", error);
//     }
//   };

//   const fetchItemstype = async () => {
//     try {
//       const response = await getType();
//       setItemstype(response.data);
//     } catch (error) {
//       console.error("Error fetching type:", error);
//     }
//   };

//   const fetchTaxes = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/tax", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTaxes(response.data.data);
//     } catch (error) {
//       console.error("Error fetching taxes:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       image: e.target.files[0],
//     });
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     try {
//       const formDataToSend = new FormData();

//       for (const key in formData) {
//         if (formData[key] !== null && formData[key] !== undefined) {
//           formDataToSend.append(key, formData[key]);
//         }
//       }

//       if (currentItem) {
//         await axios.post(
//           `http://127.0.0.1:8000/api/product-services/${currentItem.id}?_method=POST`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//       } else {
//         await axios.post("http://127.0.0.1:8000/api/product-services", formDataToSend, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         });
//       }

//       fetchData();
//       setOpenModal(false);
//       setCurrentItem(null);
//       resetForm();
//     } catch (error) {
//       console.error("Error saving item:", error);
//     }
//   };

//   const handleEdit = (item) => {
//     setCurrentItem(item);
//     setFormData({
//       ...item,
//       image: null,
//     });
//     setOpenModal(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteProductService(id);
//       fetchData();
//       setItems((prev) => prev.filter((item) => item.id !== id));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       type: "",
//       code: "",
//       company_id: "",
//       group_id: "",
//       rate_id: "",
//       gram: 0,
//       mrp: 0,
//       tax_rate: "",
//       stock_maintain: false,
//       hsn: "",
//       image: null,
//     });
//   };

//   if (!token) {
//     return <div className="p-4 text-red-500">Authentication token not found!</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Item Management</h1>
//         <button
//           onClick={() => {
//             setOpenModal(true);
//             resetForm();
//           }}
//           className="bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Add Item
//         </button>
//       </div>
//       <table className="w-full bg-white rounded-lg shadow overflow-hidden">
//         <thead>
//           <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
//             <th className="p-3">Item </th>
//             <th className="p-3">Item Name</th>
//             <th className="p-3">Code</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => (
//             <tr key={item.id} className="border-b">
//               <td className="p-3">
//                 <img
//                   src={`${baseImageURL}storage/${item.image}`}
//                   alt={item.name || "Image"}
//                   width={100}
//                   height={100}
//                   layout="intrinsic"
//                 />
//               </td>
//               <td className="p-3">{item.name}</td>
//               <td className="p-3">{item.code}</td>
//               <td className="p-3">
//                 <button
//                   onClick={() => handleEdit(item)}
//                   className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(item.id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)} center>
//         <h2 className="text-xl font-bold mb-4">
//           {currentItem ? "Edit Item" : "Add Item"}
//         </h2>
//         <form
//           onSubmit={handleSave}
//           className="space-y-4"
//           encType="multipart/form-data"
//         >
//           <div className="grid grid-cols-2 gap-4">
//             {/* Fields */}
//             {[
//               { label: "Item Name", name: "name", type: "text" },
//               { label: "Code", name: "code", type: "text" },
//               { label: "MRP", name: "mrp", type: "number" },
//               { label: "gram", name: "gram", type: "number" },
//               { label: "HSN", name: "hsn", type: "text" },
//             ].map((field) => (
//               <div key={field.name}>
//                 <label className="block text-sm font-medium text-gray-700">
//                   {field.label}
//                 </label>
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   value={formData[field.name]}
//                   onChange={handleInputChange}
//                   className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500"
//                 />
//               </div>
//             ))}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Rate
//               </label>
//               <div className="relative">
//                 <select
//                   name="rate_id"
//                   value={formData.rate_id || ""}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 bg-white p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 >
//                   <option value="">Select item type</option>
//                   {rateMaster.map((rates) => (
//                     <option key={rates.id} value={rates.id}>
//                       {rates.labelhere} &mdash; ({rates.rate})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Item Type
//               </label>
//               <select
//                 name="type"
//                 value={formData.type || ""}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option>Select item type</option>
//                 {rate.map((rates) => (
//                   <option key={rates.id} value={rates.id}>
//                     {rates.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 product tax
//               </label>
//               <select
//                 name="tax_rate"
//                 value={formData.tax_rate || ""}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option value="">Select tax</option>
//                 {taxes.map((taxe) => (
//                   <option key={taxe.id} value={taxe.amount}>
//                     {`${Math.round(taxe.amount)}%`}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Company
//               </label>
//               <select
//                 name="company_id"
//                 value={formData.company_id}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option>Select Company</option>
//                 {company.map((rates) => (
//                   <option key={rates.id} value={rates.id}>
//                     {rates.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Item Group
//               </label>
//               <select
//                 name="group_id"
//                 value={formData.group_id}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               >
//                 <option>Select item Group</option>
//                 {group.map((rates) => (
//                   <option key={rates.id} value={rates.id}>
//                     {rates.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Select GST */}

//             {/* Image Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Image
//               </label>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 className="border border-gray-300 p-2 rounded w-full"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//             >
//               {currentItem ? "Update Item" : "Add Item"}
//             </button>
//             <button
//               type="button"
//               onClick={() => setOpenModal(false)}
//               className="bg-gray-300 text-black px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default ItemManagement;



"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import Image from "next/image";
import {
  getcompany,
  baseImageURL,
  getRate,
  getProductService,
  createProductService,
  updateProductService,
  getServiceGroup,
  getType,
  deleteProductService,
} from "../../../components/config";
// @/app/components/config
const ItemManagement = () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const [items, setItems] = useState([]); // Stores item data
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [currentItem, setCurrentItem] = useState(); // Current item for editing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState([]);

  const [rate, setRate] = useState([]);
  const [rateMaster, setRateMaster] = useState([]);
  const [group, setGroup] = useState([]);
  const [category, setCategory] = useState([]);

  const [type, setItemstype] = useState([]);
  const [taxes, setTaxes] = useState([]); // Array to store tax data

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

  useEffect(() => {
    fetchCategory();
  }, []);
  const fetchCategory = async () => {
    const token = getCookie("access_token");
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }

    try {
      const response = await axios.get(" http://127.0.0.1:8000/api/type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    code: "",
    company_id: "",
    group_id: "",
    input_gst: "",
    output_gst: "",
    //gram: 0,
    //rate: 0,
    pro_ser_type: "Product",
    expires: "",

    tax_rate: "",
    stock_maintain: false,
    hsn: "",
    rate_id: "",
    brand: "",
    rate: "",
    description: "",
    image: null,
  });

  //fetch rate master
  useEffect(() => {
    const token = getCookie("access_token");
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }

    axios
      .get(" http://127.0.0.1:8000/api/ratemasterget", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRateMaster(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //

  useEffect(() => {
    fetchData();
    fetchItemsrate();
    fetchItemscompany();
    fetchItemsgrop();
    fetchItemstype();
    // FetchRateMaster();
  }, []);

  console.log(baseImageURL);

  // const FetchRateMaster=()=>{
  //   axios
  //     .get(" http://127.0.0.1:8000/api/ratemasterget")
  //     .then((response) => {
  //       setRateMaster(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      // const response = await getProductService();
      const response=await axios.get("http://127.0.0.1:8000/api/product-and-service",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
        

      )
      console.log("data saloon product",response)
      setItems(response.data); // Assuming the API returns an array
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const fetchItemsrate = async () => {
    try {
      const response = await getRate();
      setRate(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchItemscompany = async () => {
    try {
      const response = await getcompany();
      console.log("company",response)
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchItemsgrop = async () => {
    try {
      const response = await getServiceGroup();
      setGroup(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchItemstype = async () => {
    try {
      const response = await getType();
      setItemstype(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  //fetch taxes

  const fetchTaxes = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const response = await axios.get(" http://127.0.0.1:8000/api/tax", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("text list",response);
      setTaxes(response.data.data); // Assuming the data is under the 'data' key
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };

  useEffect(() => {
    fetchTaxes(); // Fetch taxes on component mount
  }, []);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Handle save (Create/Update)
  const handleSave = async (e) => {
    e.preventDefault();

    console.log("Current Item:", currentItem); // <-- Add this line

    // Prepare FormData
    const formDataToSend = new FormData();
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      if (currentItem) {
        // Update an existing item using updateProductService
        // await updateProductService(currentItem.id, formDataToSend);
        await axios.post(`http://127.0.0.1:8000/api/update-product/${currentItem.id}`,formDataToSend,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        fetchData();
       
      } else {
        // Create a new item using createProductService Saloon-product-services
        // const response = await createProductService(formDataToSend);
        await axios.post(`http://127.0.0.1:8000/api/Saloon-product-services`,formDataToSend,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        fetchData();
        // Add the new item to the state
        // setItems((prev) => [...prev, response.data]);
      }

      // Close modal and reset form
      setOpenModal(false);
      setCurrentItem(null);
      resetForm();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    console.log("itenm update",item)
    setFormData({
      ...item, // Spread the existing item data to populate the form
      // image: null, // Keep image as null (or you can show current image in the form)
      image: item.image || null,  
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      // Use the deleteProductService function to send DELETE request
      await deleteProductService(id);
      fetchData();
      // Remove the deleted item from the state
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      // Optionally, show an error message
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      code: "",
      company_id: "",
      group_id: "",
      pro_ser_type: "Product",
      expires: "",

      rate_id: "",
      gram: "",
      rate: 0,
      tax_rate: "",
      brand: "",
      description: "",
      rate: "",

      stock_maintain: false,
      hsn: "",
      image: null,
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Item Management</h1>
        <button
          onClick={() => {
            setOpenModal(true);
            resetForm();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {/* Table */}
      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
            <th className="p-3">Item </th>
            <th className="p-3">Item Name</th>
            <th className="p-3">Code</th>
            <th className="p-3">Type</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3">
                <img
                  src={`${baseImageURL}storage/${item.image}`}
                  alt={item.name || "Image"}
                  width={100}
                  height={100}
                  layout="intrinsic"
                />
              </td>
              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.code}</td>
              <td className="p-3">{item.pro_ser_type}</td>
              <td className="p-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)} center>
        <h2 className="text-xl font-bold mb-4">
          {currentItem ? "Edit Product/Services" : "Add Product/Services"}
        </h2>
        <form onSubmit={handleSave} className="space-y-4" encType="">
          {/* Category Selection */}
          <div>
            <label>Category:</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="pro_ser_type"
                  value="Product"
                  checked={formData.pro_ser_type === "Product"}
                  onChange={handleInputChange}
                />
                Product
              </label>
              <label>
                <input
                  type="radio"
                  name="pro_ser_type"
                  value="Service"
                  checked={formData.pro_ser_type === "Service"}
                  onChange={handleInputChange}
                />
                Service
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fields */}
            {[
              { label: "Product/ services name", name: "name", type: "text" },
              { label: "Code", name: "code", type: "text" },
              { label: "Amount", name: "rate", type: "number" },
              // { label: "gram", name: "gram", type: "number" },
              { label: "HSN", name: "hsn", type: "text" },
              // { label: "Brand", name: "brand", type: "text" },
              { label: "Description", name: "description", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate
              </label>
              <div className="relative">
                <select
                  name="rate_id"
                  value={formData.rate_id || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 bg-white p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select item type</option>
                  {rateMaster.map((rates) => (
                    <option key={rates.id} value={rates.id}>
                      {rates.labelhere} &mdash; ({rates.rate})
                    </option>
                  ))}
                </select>
              </div>
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Type
              </label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>Select item type</option>
                {rate.map((rates) => (
                  <option key={rates.id} value={rates.id}>
                    {rates.name}
                  </option>
                ))}
              </select>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                product tax
              </label>
              <select
                name="tax_rate"
                value={formData.tax_rate || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Select tax</option>
                {
                  taxes.map((tex ,index)=>(
                    <option value={tex.amount} key={index}>{tex.amount}%</option>
                  ))
                }

        
              </select>
            </div>

            {/* brands */}
            <div className="flex flex-col ">
              <label>Barnd</label>
              <select
              value={formData.brand || ""}
              name="brand"
              className=" border rounded w-full border-gray-300"
              onChange={handleInputChange}
              >
                <option value=''>Select Brand</option>
                {
                  company.map((c)=>(<option value={c.id} key={c.id}>{c.name}</option>))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                category
              </label>
              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>Select Category</option>
                {/* {company.map((rates) => (
                  <option key={rates.id} value={rates.id}>
                    {rates.name}
                  </option>
                ))} */}
                {category.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Group
              </label>
              <select
                name="group_id"
                value={formData.group_id}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option>Select item Group</option>
                {group.map((rates) => (
                  <option key={rates.id} value={rates.id}>
                    {rates.name}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Select GST */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Set Expiry
              </label>
              <input
                type="date"
                name="expires"
                value={formData.expires}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              {currentItem ? "Update Item" : "Add Item"}
            </button>
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ItemManagement;
