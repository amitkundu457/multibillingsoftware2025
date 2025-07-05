// "use client"
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function PackageName() {
//   const [subtypes, setSubtypes] = useState([]);
//   const [name, setName] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchSubtypes();
//   }, []);

//   //token
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

//   const fetchSubtypes = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     const response = await axios.get("https://api.equi.co.in/api/packagename",
//       {
//                   headers: { Authorization: `Bearer ${token}` },
//                 }

//     );
//     setSubtypes(response.data);
//   };

//   const handleSubmit = async (e) => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     e.preventDefault();
//     if (editingId) {
//       await axios.post(`https://api.equi.co.in/api/packagename/${editingId}`, { name },

//       );
//     } else {
//       await axios.post("https://api.equi.co.in/api/packagename", { name },

// {
//   headers: { Authorization: `Bearer ${token}` },
// }
//       );
//     }
//     setName("");
//     setEditingId(null);
//     fetchSubtypes();
//   };

//   const handleEdit = (subtype) => {
//     setName(subtype.name);
//     setEditingId(subtype.id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this subtype?")) {
//       await axios.delete(`https://api.equi.co.in/api/package-category/${id}`);
//       fetchSubtypes();
//     }
//   };

//   return (
//     <div className="">
//       <h2 className="text-xl font-bold mb-4">create package name</h2>
//       <form onSubmit={handleSubmit} className="mb-4">
//         <div className="flex ">
//         <input
//           type="text"
//           placeholder="Subtype Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2 mr-2"
//           required
//         />
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           {editingId ? "Update" : "Add"}
//         </button>
//         </div>
//       </form>

//       <ul className="border p-4">
//         {subtypes.map((subtype) => (
//           <li key={subtype.id} className="flex justify-between py-2">
//             {subtype.name}
//             <div>
//               <button onClick={() => handleEdit(subtype)} className="bg-yellow-500 text-white px-2 py-1 mr-2">Edit</button>
//               <button onClick={() => handleDelete(subtype.id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function PackageName() {
//   const [subtypes, setSubtypes] = useState([]);
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [expiresAfterMonths, setExpiresAfterMonths] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchSubtypes();
//   }, []);

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

//   const fetchSubtypes = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     const response = await axios.get("https://api.equi.co.in/api/packagename", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setSubtypes(response.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }

//     const payload = {
//       name,
//       price,
//       expires_after_months: expiresAfterMonths,
//     };
// console.log("Payload:", payload);
// console.log("Editing ID:", editingId);
//     if (editingId) {
//       await axios.post(
//         `https://api.equi.co.in/api/packagename/${editingId}`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } else {
//       await axios.post("https://api.equi.co.in/api/packagename", payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     }

//     setName("");
//     setPrice("");
//     setExpiresAfterMonths("");
//     setEditingId(null);
//     fetchSubtypes();
//   };

//   const handleEdit = (subtype) => {
//     setName(subtype.name);
//     setPrice(subtype.price);
//     setExpiresAfterMonths(subtype.expires_after_months);
//     setEditingId(subtype.id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this Package?")) {
//       await axios.delete(`https://api.equi.co.in/api/packagename/${id}`);
//       fetchSubtypes();
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Create Package Name</h2>
//       <form onSubmit={handleSubmit} className="mb-4">
//         <div className="flex flex-col md:flex-row gap-2">
//           <input
//             type="text"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="border p-2"
//             required
//           />
//           <input
//             type="number"
//             step="0.01"
//             placeholder="Price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="border p-2"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Expires After (months)"
//             value={expiresAfterMonths}
//             onChange={(e) => setExpiresAfterMonths(e.target.value)}
//             className="border p-2"
//             required
//           />
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//             {editingId ? "Update" : "Add"}
//           </button>
//         </div>
//       </form>

//       <ul className="border p-4">
//         {subtypes.map((subtype) => (
//           <li key={subtype.id} className="flex justify-between py-2">
//             <div>
//               <strong>{subtype.name}</strong> - ₹{subtype.price} - {subtype.expires_after_months} months
//             </div>
//             <div>
//               <button onClick={() => handleEdit(subtype)} className="bg-yellow-500 text-white px-2 py-1 mr-2">
//                 Edit
//               </button>
//               <button onClick={() => handleDelete(subtype.id)} className="bg-red-500 text-white px-2 py-1">
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// 'use client';

// import { useForm, useFieldArray } from 'react-hook-form';
// import axios from 'axios';
// import { useState, useEffect } from 'react';

// export default function PackageForm() {
//   const { register, control, handleSubmit, reset } = useForm({
//     defaultValues: {
//       name: '',
//       price: '',
//       expires_after_months: '',
//       items: [{ service_name: '', total_quantity: '' }]
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'items'
//   });

//   const [packages, setPackages] = useState([]);

//   //toake
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

//   const fetchPackages = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {
//       const res = await axios.get('https://api.equi.co.in/api/newPakageindex');
//       setPackages(res.data);
//     } catch (error) {
//       console.error('Failed to fetch packages:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPackages();
//   }, []);

//   const onSubmit = async (data) => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {
//       await axios.post('https://api.equi.co.in/api/newPakageStore', data,

// {
//   headers: { Authorization: `Bearer ${token}` },
// }
//       );
//       reset();
//       fetchPackages();
//       alert('Package created successfully!');
//     } catch (error) {
//       alert('Failed to create package');
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this package?')) return;
//     try {
//       await axios.delete(`https://api.equi.co.in/api/newpackagenamedestroy/${id}`);
//       fetchPackages();
//     } catch (error) {
//       console.error('Failed to delete package:', error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Create New Package</h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded bg-gray-50">
//         <input {...register('name')} placeholder="Package Name" className="border p-2 w-full" />
//         <input {...register('price')} type="number" step="0.01" placeholder="Price" className="border p-2 w-full" />
//         <input {...register('expires_after_months')} type="number" placeholder="Expires After (months)" className="border p-2 w-full" />

//         <h2 className="font-semibold mt-4">Package Items</h2>
//         {fields.map((item, index) => (
//           <div key={item.id} className="flex space-x-2 mb-2">
//             <input
//               {...register(`items.${index}.service_name`)}
//               placeholder="Service Name"
//               className="border p-2 w-full"
//             />
//             <input
//               {...register(`items.${index}.total_quantity`)}
//               type="number"
//               placeholder="Quantity"
//               className="border p-2 w-full"
//             />
//             <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
//           </div>
//         ))}
//         <button type="button" onClick={() => append({ service_name: '', total_quantity: '' })} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Add Item
//         </button>

//         <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded mt-4">Create Package</button>
//       </form>

//       <hr className="my-6" />

//       <h2 className="text-xl font-bold">All Packages</h2>
//       <ul className="space-y-4 mt-4">
//         {packages.map((pkg) => (
//           <li key={pkg.id} className="border p-4 rounded bg-white shadow">
//             <h3 className="font-semibold">{pkg.name}</h3>
//             <p>Price: ${pkg.price}</p>
//             <p>Expires after: {pkg.expires_after_months} months</p>
//             <ul className="list-disc list-inside">
//               {pkg.items.map((item, idx) => (
//                 <li key={idx}>
//                   {item.service_name} - Qty: {item.total_quantity}
//                 </li>
//               ))}
//             </ul>
//             <button onClick={() => handleDelete(pkg.id)} className="mt-2 bg-red-500 text-white px-4 py-1 rounded">
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// 'use client';

// import { useForm, useFieldArray } from 'react-hook-form';
// import axios from 'axios';
// import { useState, useEffect } from 'react';

// export default function PackageForm() {
//   const { register, control, handleSubmit, reset } = useForm({
//     defaultValues: {
//       name: '',
//       price: '',
//       expires_after_months: '',
//       service_items: [{ service_name: '', total_quantity: '' }],
//       product_items: [{ product_name: '', total_quantity: '' }]
//     }
//   });

//   const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
//     control,
//     name: 'service_items'
//   });

//   const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
//     control,
//     name: 'product_items'
//   });

//   const [packages, setPackages] = useState([]);

//   const [productList, setProductList] = useState([]);
//   const [serviceList, setServicesList] = useState([]);

//   const getToken = () => {
//     const cookie = document.cookie
//       .split('; ')
//       .find((row) => row.startsWith('access_token='));
//     return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
//   };

//   const notifyTokenMissing = () => {
//     if (typeof window !== 'undefined' && window.notyf) {
//       window.notyf.error('Authentication token not found!');
//     } else {
//       console.error('Authentication token not found!');
//     }
//   };

//   const fetchPackages = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {
//       const res = await axios.get('https://api.equi.co.in/api/newPakageindex');
//       setPackages(res.data);
//     } catch (error) {
//       console.error('Failed to fetch packages:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPackages();
//     fetchProduct();
//     fetchService()
//   }, []);

//   const onSubmit = async (data) => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     console.log("data", data);
//     try {
//       await axios.post('https://api.equi.co.in/api/newPakageStore', data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       reset();
//       fetchPackages();
//       alert('Package created successfully!');
//     } catch (error) {
//       alert('Failed to create package');
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this package?')) return;
//     try {
//       await axios.delete(`https://api.equi.co.in/api/newpackagenamedestroy/${id}`);
//       fetchPackages();
//     } catch (error) {
//       console.error('Failed to delete package:', error);
//     }
//   };

//   //pakcage details
//   const fetchProduct = async (type) => {
//       const token = getToken();
//       if (!token) {
//         notifyTokenMissing();
//         return;
//       }
//       try {
//         const response = await axios.get(
//           `https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Product`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setProductList(response.data);
//         console.log("serive list", response);
//         //setServicesList setProductList
//         console.log("prodcut and serveice", response);
//         // setData(response.data);
//       } catch (error) {
//         console.error("Error fetching product/service data:", error);
//       } finally {
//         // setLoading(false);
//       }
//     };

//     //savice
//     const fetchService = async (type) => {
//       const token = getToken();
//       if (!token) {
//         notifyTokenMissing();
//         return;
//       }
//       try {
//         const response = await axios.get(
//           `https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Service`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setServicesList(response.data);
//         console.log("serveice", response);
//         // setData(response.data);
//       } catch (error) {
//         console.error("Error fetching product/service data:", error);
//       } finally {
//         // setLoading(false);
//       }
//     };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Create New Package</h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded bg-gray-50">
//         <input {...register('name')} placeholder="Package Name" className="border p-2 w-full" />
//         <input {...register('price')} type="number" step="0.01" placeholder="Price" className="border p-2 w-full" />
//         <input {...register('expires_after_months')} type="number" placeholder="Expires After (months)" className="border p-2 w-full" />

//         {/* Services Section */}
//         <h2 className="font-semibold mt-4">Service Items</h2>
//         {serviceFields.map((item, index) => (
//           <div key={item.id} className="flex space-x-2 mb-2">
//             <select
//               {...register(`service_items.${index}.service_name`)}
//               className="border p-2 w-full"
//             >
//               <option value="">Select Service</option>
//               {serviceList.map((product) => (
//                 <option key={product.id} value={product.name}>
//                                     {product.name} {" "} - {"Mrp:"}{product.rate?product.rate:"0"} - {" "}{"Tax"} - {product.tax_rate?product.tax_rate:'0'}%

//                 </option>
//               ))}
//             </select>
//             <input
//               {...register(`service_items.${index}.total_quantity`)}
//               type="number"
//               placeholder="Quantity"
//               className="border p-2 w-full"
//             />
//             <button type="button" onClick={() => removeService(index)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
//           </div>
//         ))}
//         <button type="button" onClick={() => appendService({ service_name: '', total_quantity: '' })} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Add Service
//         </button>

//         {/* Products Section */}
//         <h2 className="font-semibold mt-6">Product Items</h2>
//         {productFields.map((item, index) => (
//           <div key={item.id} className="flex space-x-2 mb-2">
//             <select
//               {...register(`product_items.${index}.product_name`)}
//               className="border p-2 w-full"
//             >
//               <option value="">Select Product</option>
//               {productList.map((product) => (
//                 <option key={product.id} value={product.name}>
//                   {product.name} {" "} - {"Mrp:"}{product.rate?product.rate:"0"} - {" "}{"Tax"} - {product.tax_rate?product.tax_rate:'0'}%
//                 </option>
//               ))}
//             </select>
//             <input
//               {...register(`product_items.${index}.total_quantity`)}
//               type="number"
//               placeholder="Quantity"
//               className="border p-2 w-full"
//             />
//             <button type="button" onClick={() => removeProduct(index)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
//           </div>
//         ))}
//         <button type="button" onClick={() => appendProduct({ product_name: '', total_quantity: '' })} className="bg-purple-500 text-white px-4 py-2 rounded">
//           Add Product
//         </button>

//         <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded mt-4">Create Package</button>
//       </form>

//       <hr className="my-6" />

//       <h2 className="text-xl font-bold">All Packages</h2>
//       <ul className="space-y-4 mt-4">
//         {packages.map((pkg) => (
//           <li key={pkg.id} className="border p-4 rounded bg-white shadow">
//             <h3 className="font-semibold">{pkg.name}</h3>
//             <p>Price: ${pkg.price}</p>
//             <p>Expires after: {pkg.expires_after_months} months</p>
//             {pkg.items && (
//               <>
//                 <h4 className="font-semibold">Services | Product:</h4>
//                 <ul className="list-disc list-inside">
//                   {pkg.items.map((item, idx) => (
//                     <li key={idx}>
//                       {item.service_name} - Qty: {item.total_quantity} -Type: {item.type}
//                     </li>
//                   ))}
//                 </ul>
//               </>
//             )}
//             {pkg.product_items && (
//               <>
//                 <h4 className="font-semibold">Products:</h4>
//                 <ul className="list-disc list-inside">
//                   {pkg.product_items.map((item, idx) => (
//                     <li key={idx}>
//                       {item.product_name} - Qty: {item.total_quantity}
//                     </li>
//                   ))}
//                 </ul>
//               </>
//             )}
//             <button onClick={() => handleDelete(pkg.id)} className="mt-2 bg-red-500 text-white px-4 py-1 rounded">
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";

export default function PackageForm() {
  const { register, control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      price: "",
      expires_after_months: "",
      service_items: [
        {
          service_id: "",
          service_name: "",
          rate: "",
          tax_rate: "",
          total_quantity: "",
        },
      ],
      product_items: [
        {
          product_id: "",
          product_name: "",
          rate: "",
          tax_rate: "",
          total_quantity: "",
        },
      ],
    },
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control,
    name: "service_items",
  });

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({
    control,
    name: "product_items",
  });

  const [packages, setPackages] = useState([]);
  const [productList, setProductList] = useState([]);
  const [serviceList, setServicesList] = useState([]);

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

  const fetchPackages = async () => {
    try {
      const res = await axios.get("https://api.equi.co.in/api/newPakageindex");
      setPackages(res.data);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    }
  };

  const fetchProduct = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const res = await axios.get(
        `https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Product`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProductList(res.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const fetchService = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const res = await axios.get(
        `https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Service`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServicesList(res.data);
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchProduct();
    fetchService();
  }, []);

  const onSubmit = async (data) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    products: data.product_items;
    services: data.service_items;
    let totalProductAmount = 0;
    const result = data.product_items.map((service) => {
      const taxAmount = (Number(service.rate) * Number(service.tax_rate)) / 100;
      const amountWithTax = Number(service.rate) + taxAmount;
      const totalAmountWithTax =
        Number(amountWithTax) * Number(service.total_quantity);
      totalProductAmount += totalAmountWithTax;
      console.log("totalProductAmount", totalProductAmount);
      console.log("taxamount", taxAmount);
      console.log("amountWithTax", amountWithTax);
      console.log("totalAmountWithTax", totalAmountWithTax);

      return {
        ...service,
        taxAmount: taxAmount.toFixed(2),
        amountWithTax: amountWithTax.toFixed(2),
        // totalAmountWithTax: totalAmountWithTax.toFixed(2),
      };
    });
    const results =data.service_items.map((service) => {
      const taxAmount = (Number(service.rate) * Number(service.tax_rate)) / 100;
      const amountWithTax = Number(service.rate) + taxAmount;
      const totalAmountWithTax =
        Number(amountWithTax) * Number(service.total_quantity);
      totalProductAmount += totalAmountWithTax;
      console.log("totalProductAmount", totalProductAmount);
      console.log("taxamount", taxAmount);
      console.log("amountWithTax", amountWithTax);
      console.log("totalAmountWithTax", totalAmountWithTax);

      return {
        ...service,
        taxAmount: taxAmount.toFixed(2),
        amountWithTax: amountWithTax.toFixed(2),
        // totalAmountWithTax: totalAmountWithTax.toFixed(2),
      };
    });

    // data.totalPackAmount=totalProductAmount.toFixed(2);
    data.totalPackageAmount=Math.round(totalProductAmount)

    console.log("data.totalProductAmount", data);
    console.log("totalProductAmount o", totalProductAmount);
    console.log("result", result);
    console.log("products", data.product_items);
    console.log("services", data.service_items);
    console.log("data", data);
    try {
      await axios.post("https://api.equi.co.in/api/newPakageStore", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      reset();
      fetchPackages();
      alert("Package created successfully!");
    } catch (error) {
      alert("Failed to create package");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await axios.delete(
        `https://api.equi.co.in/api/newpackagenamedestroy/${id}`
      );
      fetchPackages();
    } catch (error) {
      console.error("Failed to delete package:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Package</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border p-4 rounded bg-gray-50"
      >
        <input
          {...register("name")}
          placeholder="Package Name"
          className="border p-2 w-full"
        />
        <input
          {...register("price")}
          type="number"
          step="0.01"
          placeholder="Price"
          className="border p-2 w-full hidden"
        />
        {/* <input
          {...register("expires_after_months")}
          type="number"
          placeholder="Expires After (months)"
          className="border p-2 w-full"
        /> */}

        {/* Service Items */}
        <h2 className="font-semibold mt-4">Service Items</h2>
        {serviceFields.map((item, index) => (
          <div key={item.id} className="flex space-x-2 mb-2">
            <select
              className="border p-2 w-full"
              onChange={(e) => {
                const selected = serviceList.find(
                  (service) => service.name === e.target.value
                );
                if (selected) {
                  setValue(
                    `service_items.${index}.service_name`,
                    selected.name
                  );
                  setValue(`service_items.${index}.service_id`, selected.id);
                  setValue(`service_items.${index}.rate`, selected.rate);
                  setValue(
                    `service_items.${index}.tax_rate`,
                    selected.tax_rate
                  );
                }
              }}
            >
              <option value="">Select Service</option>
              {serviceList.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name} - Mrp: {service.rate ?? 0} - Tax:{" "}
                  {service.tax_rate ?? 0}%
                </option>
              ))}
            </select>
            <input
              {...register(`service_items.${index}.total_quantity`)}
              type="number"
              placeholder="Quantity"
              className="border p-2 w-full"
            />
            <button
              type="button"
              onClick={() => removeService(index)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendService({})}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Service
        </button>

        {/* Product Items */}
        <h2 className="font-semibold mt-6">Product Items</h2>
        {productFields.map((item, index) => (
          <div key={item.id} className="flex space-x-2 mb-2">
            <select
              className="border p-2 w-full"
              onChange={(e) => {
                const selected = productList.find(
                  (prod) => prod.name === e.target.value
                );
                if (selected) {
                  setValue(
                    `product_items.${index}.product_name`,
                    selected.name
                  );
                  setValue(`product_items.${index}.product_id`, selected.id);
                  setValue(`product_items.${index}.rate`, selected.rate);
                  setValue(
                    `product_items.${index}.tax_rate`,
                    selected.tax_rate
                  );
                }
              }}
            >
              <option value="">Select Product</option>
              {productList.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name} - Mrp: {product.rate ?? 0} - Tax:{" "}
                  {product.tax_rate ?? 0}%
                </option>
              ))}
            </select>
            <input
              {...register(`product_items.${index}.total_quantity`)}
              type="number"
              placeholder="Quantity"
              className="border p-2 w-full"
            />
            <button
              type="button"
              onClick={() => removeProduct(index)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendProduct({})}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded mt-4"
        >
          Create Package
        </button>
      </form>

      <hr className="my-6" />
      <h2 className="text-xl font-bold">All Packages</h2>
      <ul className="space-y-4 mt-4">
        {packages.map((pkg) => (
          <li key={pkg.id} className="border p-4 rounded bg-white shadow">
            <h3 className="font-semibold">{pkg.name}</h3>
            <p>Price: ₹{pkg.totalPackageAmount}</p>
            {/* <p>Expires after: {pkg.expires_after_months} months</p> */}
            {pkg.items && (
              <>
                <h4 className="font-semibold">Items:</h4>
                <ul className="list-disc list-inside">
                  {pkg.items.map((item, idx) => (
                    <li key={idx}>
                      {item.service_name || item.product_name} - Qty:{" "}
                      {item.total_quantity} - Type: {item.type}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button
              onClick={() => handleDelete(pkg.id)}
              className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
