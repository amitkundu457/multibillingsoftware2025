// "use client";
// import { useState, useEffect, Fragment } from "react";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { Dialog, Transition } from "@headlessui/react";
// import Subtypes from "./subtypes/page";
// import Groupsd from "./group/page";
// import CategoryPackage from "./category/page";

// export default function Packages() {
//   const [openModals, setOpenModal] = useState(null);
//   const [packages, setPackages] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subtypes, setSubtypes] = useState([]);
//   const [taxes, setTaxes] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [taxtype, setTaxtype] = useState([]);
//   const [namePacks, setnamePack] = useState([]);
//   const [serviceTypes, setServiceTypes] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSubtypeModalOpen, setIsSubtypeModalOpen] = useState(false);
//   const[productList,setProductList]=useState([]);
//   const[serviceList,setServicesList]=useState([]);

//   //new changes
//   // const [productList, setProductList] = useState([]);
//   // const [serviceList, setServiceList] = useState([]);

//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [selectedServices, setSelectedServices] = useState([]);

//   const [selectedProductId, setSelectedProductId] = useState('');
//   const [selectedProductQty, setSelectedProductQty] = useState(1);

//   const [selectedServiceId, setSelectedServiceId] = useState('');
//   const [selectedServiceQty, setSelectedServiceQty] = useState(1);

//   //selected product and serive
//   // const [selectedProducts, setSelectedProducts] = useState([]);
//   // const [selectedServices, setSelectedServices] = useState([]);
//   const handleAddProduct = () => {
//     const selected = productList.find((p) => p.id === Number(selectedProductId));
//     if (selected && !selectedProducts.find((p) => p.id === selected.id)) {
//       setSelectedProducts([
//         ...selectedProducts,
//         { id: selected.id, name: selected.name, quantity: selectedProductQty },
//       ]);
//       setSelectedProductId('');
//       setSelectedProductQty(1);
//     }
//   };

//   const handleAddService = () => {
//     const selected = serviceList.find((s) => s.id === Number(selectedServiceId));
//     if (selected && !selectedServices.find((s) => s.id === selected.id)) {
//       setSelectedServices([
//         ...selectedServices,
//         { id: selected.id, name: selected.name, quantity: selectedServiceQty },
//       ]);
//       setSelectedServiceId('');
//       setSelectedServiceQty(1);
//     }
//   };

//   const removeProduct = (id) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
//   };

//   const removeService = (id) => {
//     setSelectedServices((prev) => prev.filter((s) => s.id !== id));
//   };

//   //setServicesList setProductList
//   const { register, handleSubmit, reset, setValue } = useForm({
//     defaultValues: {
//       name: "",
//       pa_name_id: "",
//       type_id: "",
//       category_id: "",
//       subtype_id: "",
//       price: "",
//       hsn: "",
//       tax_id: "",
//       group_id: "",
//       service_type_id: "",
//       nos: "",
//     },
//   });

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

//   useEffect(() => {
//     fetchPackages();
//     fetchDropdownData();
//     fetchService()
//     fetchProduct()
//   }, []);

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };
//   const token = getCookie("access_token");

//   const fetchPackages = async () => {
//     try {
//       const response = await axios.get("https://api.equi.co.in/api/packages", {
//         headers: {
//           Authorization: `Bearer ${token}`, // Attach token
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("Package data:", response.data);
//       setPackages(response.data);
//     } catch (error) {
//       console.error("Error fetching packages:", error);
//     }
//   };

//   const fetchProduct = async (type) => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {

//       const response = await axios.get(`https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Product`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }

//       );
//       setProductList(response.data);
//       console.log('serive list',response)
//       //setServicesList setProductList
//       console.log("prodcut and serveice",response);
//       // setData(response.data);
//     } catch (error) {
//       console.error("Error fetching product/service data:", error);
//     } finally {
//       // setLoading(false);
//     }
//   };

//   //savice
//   const fetchService = async (type) => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {

//       const response = await axios.get(`https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Service`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }

//       );
//       setServicesList(response.data);
//       console.log("serveice",response);
//       // setData(response.data);
//     } catch (error) {
//       console.error("Error fetching product/service data:", error);
//     } finally {
//       // setLoading(false);
//     }
//   };

//   const fetchDropdownData = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {
//       const [
//         namePack,
//         typeRes,
//         categoryRes,
//         subtypeRes,
//         taxRes,
//         taxTypeRes,
//         groupRes,
//         serviceRes,
//       ] = await Promise.all([
//         axios.get(
//           "https://api.equi.co.in/api/packagename",

//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         ),
//         axios.get(
//           "https://api.equi.co.in/api/package-type",

//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         ),
//         axios.get(
//           "https://api.equi.co.in/api/package-category",

//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         ),
//         axios.get(
//           "https://api.equi.co.in/api/packagesubtypes",

//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         ),
//         axios.get(
//           "https://api.equi.co.in/api/taxf",

//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         ),
//         axios.get(
//           "https://api.equi.co.in/api/tax-type",

//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         ),
//         axios.get(
//           "https://api.equi.co.in/api/membership-groups",

//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         ),
//         axios.get(
//           "https://api.equi.co.in/api/packageservice-type",

//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         ),
//       ]);

//       console.log("Type Data:", typeRes.data);
//       console.log("Category Data:", categoryRes.data);
//       console.log("Subtype Data:", subtypeRes.data);
//       console.log("Tax Data:", taxRes.data);
//       console.log("Tax Type Data:", taxTypeRes.data);
//       console.log("Group Data:", groupRes.data);
//       console.log("Service Data:", serviceRes.data);

//       setnamePack(namePack.data);
//       setTypes(typeRes.data);
//       setCategories(categoryRes.data);
//       setSubtypes(subtypeRes.data);
//       setTaxes(taxRes.data);
//       setTaxtype(taxTypeRes.data);
//       setGroups(groupRes.data);
//       setServiceTypes(serviceRes.data);
//     } catch (error) {
//       console.error("Error fetching dropdown data:", error);
//     }
//   };

//   // const getCookie = (name) => {
//   //   const value = `; ${document.cookie}`;
//   //   const parts = value.split(`; ${name}=`);
//   //   if (parts.length === 2) {
//   //     return decodeURIComponent(parts.pop().split(";").shift());
//   //   }
//   //   return null;
//   // };
//   // const token = getCookie("access_token");

//   const axiosInstance = axios.create({
//     baseURL: "https://api.equi.co.in/api",
//     headers: {
//       Authorization: `Bearer ${token}`, // Attach token
//       "Content-Type": "application/json",
//     },
//   });

//   // Usage in onSubmit
//   const onSubmit = async (data) => {
//     try {
//       if (data.id) {
//         await axiosInstance.put(`/packages/${data.id}`, data);
//         toast.success("Package updated successfully");
//       } else {
//         await axiosInstance.post("/packages", data);
//         console.log("package data on create time", data);
//         toast.success("Package added successfully");
//       }
//       closeModal();
//       fetchPackages();
//     } catch (error) {
//       console.error("Error saving package:", error);
//       toast.error("Failed to save package");
//     }
//   };

//   const handleEdit = (pkg) => {
//     Object.keys(pkg).forEach((key) => setValue(key, pkg[key]));
//     openModal();
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this package?"))
//       return;
//     try {
//       await axios.delete(`https://api.equi.co.in/api/packages/${id}`);
//       toast.success("Package deleted successfully");
//       fetchPackages();
//     } catch (error) {
//       console.error("Error deleting package:", error);
//       toast.error("Failed to delete package");
//     }
//   };

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => {
//     setIsOpen(false);
//     reset();
//   };
//   const handleOpenModal = (modalType) => {
//     setOpenModal(modalType);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(null);
//   };
//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Packages</h2>
//       <button
//         onClick={openModal}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         + Add Package
//       </button>

//       {/* Grid View */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 overflow-auto lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
//         {packages.length === 0 ? (
//           <p className="text-center col-span-full text-gray-500 text-lg">
//             No records found
//           </p>
//         ) : (
//           packages.map((pkg) => (
//             <div
//               key={pkg.id}
//               className="border border-gray-200 rounded-2xl shadow-lg bg-white p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
//             >
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                 {namePacks.find((t) => t.id === pkg.pa_name_id)?.name || "N/A"}
//               </h3>

//               <p className="text-gray-600">
//                 <strong>Price:</strong>{" "}
//                 <span className="text-blue-600">${pkg.price}</span>
//               </p>
//               <p className="text-gray-600">
//                 <strong>HSN:</strong> {pkg.hsn}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Type:</strong>{" "}
//                 {types.find((t) => t.id === pkg.type_id)?.name || "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Category:</strong>{" "}
//                 {categories.find((c) => c.id === pkg.category_id)?.name ||
//                   "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Subtype:</strong>{" "}
//                 {subtypes.find((s) => s.id === pkg.subtype_id)?.name || "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Tax:</strong>{" "}
//                 {taxes.find((t) => t.id === pkg.tax_id)?.name || "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Group:</strong>{" "}
//                 {groups.find((g) => g.id === pkg.group_id)?.name || "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Service Type:</strong>{" "}
//                 {serviceTypes.find((s) => s.id === pkg.service_type_id)?.name ||
//                   "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>No. of Services:</strong> {pkg.nos}
//               </p>

//               <div className="mt-4 flex gap-3">
//                 <button
//                   onClick={() => handleEdit(pkg)}
//                   className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(pkg.id)}
//                   className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Modal for Add/Edit */}
//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeModal}>
//           <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
//             <Dialog.Panel className="w-[70%]  bg-white rounded p-6 shadow-lg">
//               <Dialog.Title className="text-xl font-bold">
//                 Add/Edit Package
//               </Dialog.Title>
//               <form
//                 onSubmit={handleSubmit(onSubmit)}
//                 className="grid gap-4 mt-4 grid-cols-2"
//               >
//                 <div className="flex flex-col mt-1 w-full">
//                   <label className="block text-gray-700 text-sm font-medium mb-2">
//                     Name
//                   </label>
//                   <select {...register("pa_name_id")} className="border p-2">
//                     <option value="">Select Type</option>
//                     {namePacks.map((type) => (
//                       <option key={type.id} value={type.id}>
//                         {type.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 {["price", "hsn", "nos"].map((field) => (
//                   <input
//                     key={field}
//                     {...register(field)}
//                     type="text"
//                     placeholder={field.toUpperCase()}
//                     className="border "
//                   />
//                 ))}

//                 {[
//                   { name: "type_id", data: types },
//                   {
//                     name: "category_id",
//                     data: categories,
//                     hasAddButton: "category",
//                   },
//                   {
//                     name: "subtype_id",
//                     data: subtypes,
//                     hasAddButton: "subtype", // Custom flag for subtype
//                   },
//                   { name: "tax_id", data: taxes },
//                   { name: "tax_type_id", data: taxtype },
//                   { name: "group_id", data: groups, hasAddButton: "group" },
//                   { name: "service_type_id", data: serviceTypes },
//                 ].map((item) => (
//                   <div key={item.name} className="flex items-center gap-2">
//                     <select
//                       {...register(item.name)}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">
//                         Select {item.name.replace("_", " ")}
//                       </option>
//                       {item.data.map((d) => (
//                         <option key={d.id} value={d.id}>
//                           {d.name}
//                         </option>
//                       ))}
//                     </select>

//                     {/* "+" Button for adding subtype */}
//                     {item.hasAddButton && (
//                       <button
//                         type="button"
//                         onClick={() => handleOpenModal(item.hasAddButton)}
//                         className="bg-green-500 text-white px-3 py-1 rounded"
//                       >
//                         +
//                       </button>
//                     )}
//                   </div>
//                 ))}

//                 {/* serive and products */}
//                 {/* <div className="flex flex-col mt-1">
//                   <label>Service List</label>
//                   <select>
//                    {
//                      serviceList.map((c)=>(
//                       <option >{c.name}{"  "}{"Mrp:"}{c.mrp? c.map:"NA"} {"  "}{"Tax"} {"  "}{c.tax_rate?c.tax_rate:"NA"}</option>
//                      ))
//                    }
//                   </select>
//                 </div>
//                 <div className="flex flex-col mt-1">
//                  <div> <label>Product List</label></div>
//                  <div>
//                  <select>
//                    {
//                      productList.map((c)=>(
//                       <option >{c.name}{"  "}{"Mrp:"}{c.mrp? c.map:"NA"} {"  "}{"Tax"} {"  "}{c.tax_rate?c.tax_rate:"NA"}</option>
//                      ))
//                    }
//                   </select>
//                  </div>
//                 </div> */}
//                 {/* Services */}
// {/* <div className="flex flex-col mt-1 col-span-2">
//   <label>Service List</label>
//   <select onChange={handleServiceSelect} className="border p-2">
//     <option value="">Select Service</option>
//     {serviceList.map((c) => (
//       <option key={c.id} value={c.id}>
//         {c.name} | Mrp: {c.mrp || "NA"} | Tax: {c.tax_rate || "NA"}
//       </option>
//     ))}
//   </select> */}

// {/*
//   <div className="flex flex-wrap gap-2 mt-2">
//     {selectedServices.map((s) => (
//       <span
//         key={s.id}
//         className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
//       >
//         {s.name}
//         <button
//           type="button"
//           onClick={() => removeService(s.id)}
//           className="ml-2 text-red-500"
//         >
//           &times;
//         </button>
//       </span>
//     ))}
//   </div>
// </div> */}

// {/* Products */}
// {/* <div className="flex flex-col mt-1 col-span-2">
//   <label>Product List</label>
//   <select onChange={handleProductSelect} className="border p-2">
//     <option value="">Select Product</option>
//     {productList.map((c) => (
//       <option key={c.id} value={c.id}>
//         {c.name} | Mrp: {c.mrp || "NA"} | Tax: {c.tax_rate || "NA"}
//       </option>
//     ))}
//   </select> */}

//   {/* Selected Products */}
//   {/* <div className="flex flex-wrap gap-2 mt-2">
//     {selectedProducts.map((p) => (
//       <span
//         key={p.id}
//         className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
//       >
//         {p.name}
//         <button
//           type="button"
//           onClick={() => removeProduct(p.id)}
//           className="ml-2 text-red-500"
//         >
//           &times;
//         </button>
//       </span>
//     ))}
//   </div>
// </div> */}

// <div className="p-4">
//       {/* Product Selection */}
//       <div className="flex gap-2 mb-4">
//         <select
//           value={selectedProductId}
//           onChange={(e) => setSelectedProductId(e.target.value)}
//           className="border rounded p-2"
//         >
//           <option value="">Select Product</option>
//           {productList.map((product) => (
//             <option key={product.id} value={product.id}>
//               {product.name}
//             </option>
//           ))}
//         </select>
//         <input
//           type="number"
//           min="1"
//           value={selectedProductQty}
//           onChange={(e) => setSelectedProductQty(Number(e.target.value))}
//           className="border rounded p-2 w-24"
//         />
//         <button
//           type="button"
//           onClick={handleAddProduct}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Add Product
//         </button>
//       </div>

//       {/* Service Selection */}
//       <div className="flex gap-2 mb-4">
//         <select
//           value={selectedServiceId}
//           onChange={(e) => setSelectedServiceId(e.target.value)}
//           className="border rounded p-2"
//         >
//           <option value="">Select Service</option>
//           {serviceList.map((service) => (
//             <option key={service.id} value={service.id}>
//               {service.name}
//             </option>
//           ))}
//         </select>
//         <input
//           type="number"
//           min="1"
//           value={selectedServiceQty}
//           onChange={(e) => setSelectedServiceQty(Number(e.target.value))}
//           className="border rounded p-2 w-24"
//         />
//         <button
//           type="button"
//           onClick={handleAddService}
//           className="bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Add Service
//         </button>
//       </div>

//       {/* Display Selected Products */}
//       <div className="mb-4">
//         <h3 className="font-semibold mb-2">Selected Products</h3>
//         {selectedProducts.map((item) => (
//           <div key={item.id} className="flex justify-between mb-1">
//             <span>{item.name}</span>
//             <span>Qty: {item.quantity}</span>
//           </div>
//         ))}
//       </div>

//       {/* Display Selected Services */}
//       <div className="mb-4">
//         <h3 className="font-semibold mb-2">Selected Services</h3>
//         {selectedServices.map((item) => (
//           <div key={item.id} className="flex justify-between mb-1">
//             <span>{item.name}</span>
//             <span>Qty: {item.quantity}</span>
//           </div>
//         ))}
//       </div>
//     </div>

//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                   Save
//                 </button>
//               </form>
//             </Dialog.Panel>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Modal for Adding Subtype */}
//       <Transition appear show={openModals === "subtype"} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <Dialog.Panel className="bg-white p-6 rounded shadow-md w-[30rem]">
//               <Subtypes />
//               <button
//                 onClick={handleCloseModal}
//                 className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//               >
//                 Close
//               </button>
//             </Dialog.Panel>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Modal for Adding Group */}
//       <Transition appear show={openModals === "group"} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <Dialog.Panel className="bg-white p-6 rounded shadow-md w-[30rem]">
//               <Groupsd /> {/* Replace with the component to add group */}
//               <button
//                 onClick={handleCloseModal}
//                 className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//               >
//                 Close
//               </button>
//             </Dialog.Panel>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Modal for Addingcategory */}
//       <Transition appear show={openModals === "category"} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <Dialog.Panel className="bg-white p-6 rounded shadow-md w-[30rem]">
//               <CategoryPackage />{" "}
//               {/* Replace with the component to add group */}
//               <button
//                 onClick={handleCloseModal}
//                 className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//               >
//                 Close
//               </button>
//             </Dialog.Panel>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// }

"use client";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import Subtypes from "./subtypes/page";
import Groupsd from "./group/page";
import CategoryPackage from "./category/page";

export default function Packages() {
  const [openModals, setOpenModal] = useState(null);
  const [packages, setPackages] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [taxtype, setTaxtype] = useState([]);
  const [namePacks, setnamePack] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubtypeModalOpen, setIsSubtypeModalOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [serviceList, setServicesList] = useState([]);

  //new changes
  // const [productList, setProductList] = useState([]);
  // const [serviceList, setServiceList] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductQty, setSelectedProductQty] = useState(1);

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedServiceQty, setSelectedServiceQty] = useState(1);

  //selected product and serive
  // const [selectedProducts, setSelectedProducts] = useState([]);
  // const [selectedServices, setSelectedServices] = useState([]);
  const handleAddProduct = () => {
    const selected = productList.find(
      (p) => p.id === Number(selectedProductId)
    );
    if (selected && !selectedProducts.find((p) => p.id === selected.id)) {
      setSelectedProducts([
        ...selectedProducts,
        { ...selected, quantity: selectedProductQty },
      ]);
      setSelectedProductId("");
      setSelectedProductQty(1);
    }
  };

  const handleAddService = () => {
    const selected = serviceList.find(
      (s) => s.id === Number(selectedServiceId)
    );
    if (selected && !selectedServices.find((s) => s.id === selected.id)) {
      setSelectedServices([
        ...selectedServices,
        { id: selected.id, name: selected.name, quantity: selectedServiceQty },
      ]);
      setSelectedServiceId("");
      setSelectedServiceQty(1);
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const removeService = (id) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== id));
  };

  //setServicesList setProductList
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      pa_name_id: "",
      type_id: "",
      category_id: "",
      subtype_id: "",
      price: "",
      hsn: "",
      tax_id: "",
      group_id: "",
      service_type_id: "",
      nos: "",
    },
  });

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
    fetchPackages();
    fetchDropdownData();
    fetchService();
    fetchProduct();
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const token = getCookie("access_token");

  const fetchPackages = async () => {
    try {
      const response = await axios.get("https://api.equi.co.in/api/packages", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
          "Content-Type": "application/json",
        },
      });
      console.log("Package data:", response.data);
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const fetchProduct = async (type) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const response = await axios.get(
        `https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Product`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProductList(response.data);
      console.log("serive list", response);
      //setServicesList setProductList
      console.log("prodcut and serveice", response);
      // setData(response.data);
    } catch (error) {
      console.error("Error fetching product/service data:", error);
    } finally {
      // setLoading(false);
    }
  };

  //savice
  const fetchService = async (type) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const response = await axios.get(
        `https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Service`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServicesList(response.data);
      console.log("serveice", response);
      // setData(response.data);
    } catch (error) {
      console.error("Error fetching product/service data:", error);
    } finally {
      // setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const [
        namePack,
        typeRes,
        categoryRes,
        subtypeRes,
        taxRes,
        taxTypeRes,
        groupRes,
        serviceRes,
      ] = await Promise.all([
        axios.get(
          "https://api.equi.co.in/api/packagename",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          "https://api.equi.co.in/api/package-type",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          "https://api.equi.co.in/api/package-category",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          "https://api.equi.co.in/api/packagesubtypes",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          "https://api.equi.co.in/api/taxf",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          "https://api.equi.co.in/api/tax-type",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          "https://api.equi.co.in/api/membership-groups",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          "https://api.equi.co.in/api/packageservice-type",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      console.log("Type Data:", typeRes.data);
      console.log("Category Data:", categoryRes.data);
      console.log("Subtype Data:", subtypeRes.data);
      console.log("Tax Data:", taxRes.data);
      console.log("Tax Type Data:", taxTypeRes.data);
      console.log("Group Data:", groupRes.data);
      console.log("Service Data:", serviceRes.data);

      setnamePack(namePack.data);
      setTypes(typeRes.data);
      setCategories(categoryRes.data);
      setSubtypes(subtypeRes.data);
      setTaxes(taxRes.data);
      setTaxtype(taxTypeRes.data);
      setGroups(groupRes.data);
      setServiceTypes(serviceRes.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  // const getCookie = (name) => {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) {
  //     return decodeURIComponent(parts.pop().split(";").shift());
  //   }
  //   return null;
  // };
  // const token = getCookie("access_token");

  const axiosInstance = axios.create({
    baseURL: "https://api.equi.co.in/api",
    headers: {
      Authorization: `Bearer ${token}`, // Attach token
      "Content-Type": "application/json",
    },
  });

  // Usage in onSubmit
  const onSubmit = async (data) => {
    products: selectedProducts;
    services: selectedServices;

    console.log("serive", selectedProducts);
    console.log("product", selectedServices);

    const result = services.map((service) => {
      const taxAmount = (service.rate * service.tax_rate) / 100;
      const amountWithTax = service.rate + taxAmount;
      const totalAmountWithTax = amountWithTax * service.quantity;

      return {
        ...service,
        taxAmount: taxAmount.toFixed(2),
        amountWithTax: amountWithTax.toFixed(2),
        totalAmountWithTax: totalAmountWithTax.toFixed(2),
      };
    });

    console.log(result);

    try {
      if (data.id) {
        await axiosInstance.put(`/packages/${data.id}`, data);
        toast.success("Package updated successfully");
      } else {
        await axiosInstance.post("/packages", data);
        console.log("package data on create time", data);
        toast.success("Package added successfully");
      }
      closeModal();
      fetchPackages();
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
    }
  };

  const handleEdit = (pkg) => {
    Object.keys(pkg).forEach((key) => setValue(key, pkg[key]));
    openModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?"))
      return;
    try {
      await axios.delete(`https://api.equi.co.in/api/packages/${id}`);
      toast.success("Package deleted successfully");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    reset();
    setSelectedProducts([]);
    setSelectedServices([]);
  };
  const handleOpenModal = (modalType) => {
    setOpenModal(modalType);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Packages</h2>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Add Package
      </button>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 overflow-auto lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {packages.length === 0 ? (
          <p className="text-center col-span-full text-gray-500 text-lg">
            No records found
          </p>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className="border border-gray-200 rounded-2xl shadow-lg bg-white p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {namePacks.find((t) => t.id === pkg.pa_name_id)?.name || "N/A"}
              </h3>

              <p className="text-gray-600">
                <strong>Price:</strong>{" "}
                <span className="text-blue-600">${pkg.price}</span>
              </p>
              <p className="text-gray-600">
                <strong>HSN:</strong> {pkg.hsn}
              </p>
              <p className="text-gray-600">
                <strong>Type:</strong>{" "}
                {types.find((t) => t.id === pkg.type_id)?.name || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Category:</strong>{" "}
                {categories.find((c) => c.id === pkg.category_id)?.name ||
                  "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Subtype:</strong>{" "}
                {subtypes.find((s) => s.id === pkg.subtype_id)?.name || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Tax:</strong>{" "}
                {taxes.find((t) => t.id === pkg.tax_id)?.name || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Group:</strong>{" "}
                {groups.find((g) => g.id === pkg.group_id)?.name || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Service Type:</strong>{" "}
                {serviceTypes.find((s) => s.id === pkg.service_type_id)?.name ||
                  "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>No. of Services:</strong> {pkg.nos}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add/Edit */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
            <Dialog.Panel className="w-[70%]  bg-white rounded p-6 shadow-lg">
              <Dialog.Title className="text-xl font-bold">
                Add/Edit Package
              </Dialog.Title>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4 mt-4 grid-cols-2"
              >
                <div className="flex flex-col mt-1 w-full">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Name
                  </label>
                  <select {...register("pa_name_id")} className="border p-2">
                    <option value="">Select Type</option>
                    {namePacks.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                {["price", "hsn", "nos"].map((field) => (
                  <input
                    key={field}
                    {...register(field)}
                    type="text"
                    placeholder={field.toUpperCase()}
                    className="border "
                  />
                ))}

                {[
                  { name: "type_id", data: types },
                  {
                    name: "category_id",
                    data: categories,
                    hasAddButton: "category",
                  },
                  {
                    name: "subtype_id",
                    data: subtypes,
                    hasAddButton: "subtype", // Custom flag for subtype
                  },
                  { name: "tax_id", data: taxes },
                  { name: "tax_type_id", data: taxtype },
                  { name: "group_id", data: groups, hasAddButton: "group" },
                  { name: "service_type_id", data: serviceTypes },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <select
                      {...register(item.name)}
                      className="border p-2 w-full"
                    >
                      <option value="">
                        Select {item.name.replace("_", " ")}
                      </option>
                      {item.data.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>

                    {/* "+" Button for adding subtype */}
                    {item.hasAddButton && (
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item.hasAddButton)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}

                <div className="p-4">
                  {/* Product Selection */}
                  <div className="flex gap-2 mb-4">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="border rounded p-2"
                    >
                      <option value="">Select Product</option>
                      {productList.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={selectedProductQty}
                      onChange={(e) =>
                        setSelectedProductQty(Number(e.target.value))
                      }
                      className="border rounded p-2 w-24"
                    />
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Add Product
                    </button>
                  </div>

                  {/* Service Selection */}
                  <div className="flex gap-2 mb-4">
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="border rounded p-2"
                    >
                      <option value="">Select Service</option>
                      {serviceList.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={selectedServiceQty}
                      onChange={(e) =>
                        setSelectedServiceQty(Number(e.target.value))
                      }
                      className="border rounded p-2 w-24"
                    />
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Add Service
                    </button>
                  </div>

                  {/* Display Selected Products */}
                  {/* <div className="mb-4">
                    <h3 className="font-semibold mb-2">Selected Products</h3>
                    {selectedProducts.map((item) => (
                      <div key={item.id} className="flex justify-between mb-1">
                        <span>{item.name}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div> */}

                  {/* Display Selected Services */}
                  {/* <div className="mb-4">
                    <h3 className="font-semibold mb-2">Selected Services</h3>
                    {selectedServices.map((item) => (
                      <div key={item.id} className="flex justify-between mb-1">
                        <span>{item.name}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div> */}

                  <div className="mt-4">
                    <h4 className="font-bold">Selected Products</h4>
                    <ul className="list-disc pl-5">
                      {selectedProducts.map((product) => (
                        <li key={product.id}>
                          {product.name} - Qty: {product.quantity}
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="ml-2 text-red-500"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>

                    <h4 className="font-bold mt-4">Selected Services</h4>
                    <ul className="list-disc pl-5">
                      {selectedServices.map((service) => (
                        <li key={service.id}>
                          {service.name} - Qty: {service.quantity}
                          <button
                            onClick={() => removeService(service.id)}
                            className="ml-2 text-red-500"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Modal for Adding Subtype */}
      <Transition appear show={openModals === "subtype"} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded shadow-md w-[30rem]">
              <Subtypes />
              <button
                onClick={handleCloseModal}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Modal for Adding Group */}
      <Transition appear show={openModals === "group"} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded shadow-md w-[30rem]">
              <Groupsd /> {/* Replace with the component to add group */}
              <button
                onClick={handleCloseModal}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Modal for Addingcategory */}
      <Transition appear show={openModals === "category"} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded shadow-md w-[30rem]">
              <CategoryPackage />{" "}
              {/* Replace with the component to add group */}
              <button
                onClick={handleCloseModal}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
