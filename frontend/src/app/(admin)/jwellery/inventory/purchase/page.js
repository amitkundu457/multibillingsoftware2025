// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";
// import {
//   FaArrowLeft,
//   FaEdit,
//   FaPercentage,
//   FaPlus,
//   FaRegListAlt,
//   FaSave,
//   FaTimes,
//   FaUserPlus,
// } from "react-icons/fa";
// import { FaArrowRotateRight, FaPencil } from "react-icons/fa6";
// import { MdKeyboardDoubleArrowRight, MdDownload } from "react-icons/md";
// import { usePurchase } from "@/app/hooks/purchase";
// import { Modal } from "react-responsive-modal";
// import "react-responsive-modal/styles.css";

// function Page() {
//   // <-- Capitalize "Page"
//   const { data, isLoading, createPurchase } = usePurchase();

//   const [billAmount, setBillAmount] = useState(0);
//   const [modal, setModal] = useState(false);
//   const [supplierlist, setSupplierlist] = useState([]);
//   const [file, setFile] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [deleteModel, setDeleteModel] = useState(false);
//   const [isloader, setLoader] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [errors, setErrors] = useState({});








//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   const token = getCookie("access_token");



// //new data added here 


//   const supplierList = async () => {
//     const token = getCookie("access_token");
//     const response = await axios.get("http://127.0.0.1:8000/api/suppliers",
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }

//     );
//     console.log("response", response?.data?.suppliers);
//     setSupplierlist(response?.data?.suppliers);
//   };

//   useEffect(() => {
//     supplierList();
//   }, []);
  

//   const [formData, setFormData] = useState({
//     voucher_no: "",
//     date: "",
//     bill_no: "",
//     is_igst: 0,
//     user_id: "",
//     payment_mode: "cash",
//     credit_days: 0,
//     purchase_items: [],
//     discount: 0,
//     credit_note: 0,
//     addition: 0,
//   });

//   const [pur, setPur] = useState({
//     is_edit: false,
//     product_name: "",
//     product_service_id:"",
//     pcs: 0,
//     gwt: 0,
//     nwt: 0,
//     rate: 0,
//     other_chg: 0,
//     disc: 0,
//     disc_percent: 0,
//     gst: 0,
//     taxable: 0,
//     total_gst: 0,
//     net_amount: 0,
//   });



//   useEffect(() => {
//     if (!token) {
//       notyf.error("Authentication token not found!");
//       return;
//     }
//     fetchSupplierList();
//   }, []);

//   useEffect(() => {
//     if (!isLoading && data?.purchaseCount != null) {
//       setFormData((prev) => ({
//         ...prev,
//         voucher_no: "PU" + (parseInt(data.purchaseCount) + 1),
//       }));
//     }
//   }, [isLoading, data]);

//   useEffect(() => {
//     if (formData.purchase_items) {
//       const totalAmount = formData.purchase_items.reduce((sum, item) => {
//         return sum + parseFloat(item.net_amount || 0);
//       }, 0);
//       setBillAmount(totalAmount.toFixed(2));
//     }
//   }, [formData.purchase_items]);

//   const fetchSupplierList = async () => {
//     const token = getCookie("access_token");
//     const response = await axios.get("http://127.0.0.1:8000/api/suppliers",
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }

//     );
//     setSupplierlist(response?.data?.suppliers || []);
//   };

//   const handleDeleteAllPurchase = async () => {
//     const response = await axios.delete(
//       "http://127.0.0.1:8000/api/delete-all-purchase"
//       ,{
//         headers:{authorization:`Bearer ${token}`}
//       }
//     );
//     if (response.status === 200) {
//       alert(response.data.message); // Show success message
//       setDeleteModel(false);
//       console.log(response);
//     } else {
//       alert("No records found to delete ");
//     }
//   };

//   const handleDownloadSample = () => {
//     window.location.href = "http://127.0.0.1:8000/api/download-sample-purchase";
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const uploadStock = async () => {
//     if (!file) {
//       alert("Please select a file.");
//       return;
//     }

//     const fileFormData = new FormData();
//     fileFormData.append("file", file);

//     fileFormData.append("data", JSON.stringify(formData)); // Convert object to string
//     fileFormData.append("product_name", pur.product_name);
//     fileFormData.append("product_service_id", pur.product_service_id);
  
//     fileFormData.forEach((value, key) => {
//       console.log(key, value);
//     });

//     try {
//       setLoader(true);
//       setUploadProgress(0);

//       // Simulate Fake Upload Progress (0% → 100% in 2 seconds)
//       let progress = 0;
//       const fakeProgress = setInterval(() => {
//         progress += 10;
//         setUploadProgress(progress);
//         if (progress >= 100) {
//           clearInterval(fakeProgress);
//         }
//       }, 200); // Every 200ms, increase progress by 10% (Total 2s)

//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/purchase/bulk-upload-csv",
//         fileFormData,
//         {
//           headers: {
//             authorization: `Bearer ${token}`,
//           },
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(percentCompleted);
//           },
//         }
//       );
//       toast.success("File uploaded successfully!");

//       clearInterval(fakeProgress); // Stop fake progress if upload finishes early
//       setUploadProgress(100); // Ensure it reaches 100%

//       // alert(response.data.message);
//       setIsOpen(false);
//     } catch (error) {
//       console.log(error);
//       toast.error("Error uploading file!");
      
//       setIsOpen(false);
//     } finally {
//       setTimeout(() => {
//         setLoader(false);
//         setUploadProgress(0); // Reset progress bar after 2s
//       }, 2000); // Wait 2 seconds before resetting
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: null,
//     }));
//   };

//   const handlePurChange = (e) => {
//     const { name, value } = e.target;
  
//     setPur((prevData) => {
//       const updatedData = {
//         ...prevData,
//         [name]: value,
//       };
  
//       // If product_name is changed, find and update product_service_id
//       if (name === "product_name") {
//         const selectedProduct = data.productServices.find(
         
//           (p) => p.name === value
//         );
//         updatedData.product_service_id = selectedProduct?.id || "";
//       }
  
//       console.log("updatedData",updatedData)
//       // If numeric/tax-related field changes, recalculate
//       if (
//         [
//           "pcs",
//           "nwt",
//           "rate",
//           "other_chg",
//           "disc",
//           "disc_percent",
//           "gst",
//         ].includes(name)
//       ) {
//         updatedData.taxable = calculateTaxable(updatedData);
//         updatedData.total_gst = calculateGst(updatedData);
//         updatedData.net_amount = calculateNetAmount(updatedData);
//       }
  
//       return updatedData;
//     });
//   };
  

//   const calculateTaxable = (data) => {
//     const pcs = parseFloat(data.pcs) || 0;
//     const nwt = parseFloat(data.nwt) || 0;
//     const rate = parseFloat(data.rate) || 0;
//     const otherChg = parseFloat(data.other_chg) || 0;
//     const disc = parseFloat(data.disc) || 0;
//     const discPercent = parseFloat(data.disc_percent) || 0;

//     const baseAmount = pcs * nwt * rate;
//     const discount = baseAmount * (discPercent / 100) + disc;
//     const taxableAmount = baseAmount + otherChg - discount;

//     return taxableAmount.toFixed(2);
//   };

//   const calculateGst = (data) => {
//     const gst = parseFloat(data.gst) || 0;
//     const taxable = parseFloat(data.taxable) || 0;
//     const gstAmount = (taxable * gst) / 100;
//     return gstAmount.toFixed(2);
//   };

//   const calculateNetAmount = (data) => {
//     const taxable = parseFloat(data.taxable) || 0;
//     const totalGst = parseFloat(data.total_gst) || 0;
//     const netAmount = taxable + totalGst;
//     return netAmount.toFixed(2);
//   };

//   const addItem = () => {
//     const validationErrors = {};
//     if (!pur.product_name?.trim()) {
//       validationErrors.product_name = "Product name is required";
//     }
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       purchase_items: [...(prev.purchase_items || []), pur],
//     }));

//     setPur({
//       is_edit: false,
//       product_name: "",
//       product_service_id:"",
//       pcs: 0,
//       gwt: 0,
//       nwt: 0,
//       rate: 0,
//       other_chg: 0,
//       disc: 0,
//       disc_percent: 0,
//       gst: 0,
//       taxable: 0,
//       total_gst: 0,
//       net_amount: 0,
//     });
//   };

//   const editItem = (index) => {
//     const itemToEdit = formData.purchase_items[index];
//     if (itemToEdit) {
//       setPur({ ...itemToEdit, is_edit: true });
//     }
//   };

//   const deleteItem = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       purchase_items: prev.purchase_items.filter((_, i) => i !== index),
//     }));
//   };

//   const additional = () => {
//     const totalAmount = formData.purchase_items.reduce((sum, item) => {
//       return sum + parseFloat(item.net_amount || 0);
//     }, 0);
//     const discountPercent = parseFloat(formData.discount || 0);
//     const creditNote = parseFloat(formData.credit_note || 0);
//     const addition = parseFloat(formData.addition || 0);

//     const discountedAmount = totalAmount - (totalAmount * discountPercent) / 100;
//     const updatedBillAmount = discountedAmount - creditNote + addition;

//     setBillAmount(updatedBillAmount.toFixed(2));
//     setModal(false);
//   };

//   const handleSubmit = async () => {
//     // e.preventDefault(); // Fix: event -> e
//     console.log("formData", formData);
//     const validationErrors = await createPurchase(formData);
//     console.log("validationErrors",validationErrors)
//     if (validationErrors) {
//       setErrors(validationErrors);
//     } else {
//       setFormData({
//         voucher_no: "",
//         date: "",
//         bill_no: "",
//         is_igst: false,
//         user_id: "",
//         payment_mode: "cash",
//         credit_days: 0,
//         purchase_items: [],
//         discount: 0,
//         credit_note: 0,
//         addition: 0,
//       });
//     }
//   };
//   return (
//     <div className="absolute left-0 top-0 w-full bg-white h-full">
//       {/* //plus button to click model */}
//       <button
//         onClick={() => {
//           setIsOpen(true);
//         }}
//         className="absolute top-14 right-[35%] mt-2 mr-7 flex items-center gap-2 px-3 py-2 text-white font-semibold 
//         bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md 
//         hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transition-all duration-300"
//       >
//         <FaPlus size={16} className="text-white" />
//         Bulk Upload
//       </button>
//       <button
//         onClick={() => {
//           setDeleteModel(true);
//         }}
//         className="absolute top-16 right-[22%] mr-1 flex items-center gap-2 px-2 py-2 text-white font-semibold 
//              bg-gradient-to-r from-red-500 to-red-700 rounded-md shadow-sm 
//              hover:from-red-600 hover:to-red-800 hover:shadow-lg transition-all duration-300"
//       >
//         <FaTimes size={18} className="text-white" />
//         Delete all purchase
//       </button>

//       <Modal
//         open={modal}
//         classNames={{
//           overlay: "customOverlay",
//           modal: "customModal",
//         }}
//         onClose={() => setModal(false)}
//       >
//         <div className="py-4 flex flex-wrap gap-2">
//           <div className="flex flex-col gap-1 w-full">
//             <label htmlFor="">Disc %</label>
//             <input
//               type="text"
//               name="addt_discount"
//               placeholder="Enter disc"
//               value={formData.discount}
//               onChange={handleChange}
//               className="text-sm rounded form-input"
//             />
//           </div>
//           <div className="flex flex-col gap-1 w-full">
//             <label htmlFor="">Credit Note</label>
//             <input
//               type="text"
//               name="credit_note"
//               placeholder="Enter credit note"
//               value={formData.credit_note}
//               onChange={handleChange}
//               className="text-sm rounded form-input"
//             />
//           </div>
//           <div className="flex flex-col gap-1 w-full">
//             <label htmlFor="">Addition</label>
//             <input
//               type="text"
//               name="addition"
//               placeholder="Enter addition"
//               value={formData.addition}
//               onChange={handleChange}
//               className="text-sm rounded form-input"
//             />
//           </div>
//           <div className="flex justify-center w-full">
//             <button
//               onClick={() => additional()}
//               className="w-max px-4 py-2 rounded bg-green-500 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </Modal>
//       <div className="w-full flex p-3 px-6 bg-green-500 text-white">
//         <Link href="/dashboard" className="flex items-center text-sm gap-2">
//           <FaArrowLeft />
//         </Link>
//         <p className="flex-1 text-center font-semibold">Purchase</p>
//       </div>
//       <div className="w-full flex justify-between items-center p-3 px-6 shadow-xl">
//         <div className="flex">
//           <button className="text-sm px-4 flex flex-col items-center gap-1">
//             <FaArrowRotateRight size={24} className="text-blue-700" />
//             <span>Refresh</span>
//           </button>
//           <Link
//             href="/jwellery/reports/purchasereport"
//             className="text-sm px-4 flex flex-col items-center gap-1"
//           >
//             <FaRegListAlt size={24} className="text-blue-700" />
//             <span>Report</span>
//           </Link>
//           <button
//             onClick={() => handleSubmit()}
//             className="text-sm px-4 flex flex-col items-center gap-1"
//           >
//             <FaSave size={24} className="text-blue-700" />
//             <span>Save</span>
//           </button>
//         </div>
//         <div className="flex items-center gap-1.5 ">
//           <button
//             onClick={() => setModal(true)}
//             className="bg-green-500 hidden  text-sm items-center p-2.5 rounded text-white"
//           >
//             <div className="flex ">
//               {" "}
//               <FaPercentage />
//               <span>Disc</span>
//             </div>
//           </button>
//           <div className="flex items-center text-white px-3 py-2 bg-orange-500 rounded">
//             <span>Bill Amount</span>
//             <MdKeyboardDoubleArrowRight size={18} />
//             <span className="ml-8">&#8377; {billAmount}</span>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-wrap py-1 px-4">
//         <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Voucher No</label>
//           <input
//             type="text"
//             name="voucher_no"
//             value={formData.voucher_no}
//             onChange={handleChange}
//             className={`form-input text-sm rounded ${
//               errors.voucher_no ? "border-red-500 text-red-500" : ""
//             }`}
//             placeholder="Enter voucher no."
//           />
//         </div>
//         <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Date</label>
//           <input
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             className={`form-input text-sm rounded ${
//               errors.date ? "border-red-500 text-red-500" : ""
//             }`}
//             placeholder="Enter date"
//           />
//         </div>
//         <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Bill No</label>
//           <div className="flex items-center w-full">
//             <input
//               name="bill_no"
//               value={formData.bill_no}
//               onChange={handleChange}
//               type="text"
//               className={`form-input text-sm rounded w-full ${
//                 errors.bill_no ? "border-red-500 text-red-500" : ""
//               }`}
//               placeholder="Enter bill no."
//             />
//             <button className="pl-3">
//               <MdDownload size={26} />
//             </button>
//           </div>
//         </div>
//         <div className="w-[8%] flex items-end text-sm gap-1 p-1">
//           <label className="inline-flex mb-3 items-center cursor-pointer">
//             <input
//               name="is_igst"
//               value={formData.is_igst}
//               onChange={handleChange}
//               type="checkbox"
//               className="sr-only peer"
//             />
//             <span className="ms-3 text-sm font-medium text-gray-900 mr-2">
//               Is IGST
//             </span>
//             <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
//           </label>
//         </div>
//         <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Supplier List</label>
//           <div className="w-full flex gap-2">
//             <select
//               name="user_id"
//               value={formData.user_id}
//               onChange={handleChange}
//               className="form-select w-full text-sm rounded"
//             >
//                <option value="">--Select Supplier--</option>
//               {
//                 supplierlist.map((supplier)=>(
//                   <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
//                 ))
//               }
//               {/* <option value="">-- Select Supplier --</option>
//               <option value="1">Rahul Kumar....</option>
//               <option value="2">Amir</option> */}
//             </select>
//             {/* <Link href={"#"}>
//               <FaUserPlus size={24} />
//             </Link> */}
//           </div>
//         </div>
//         <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
//           <select
//             name="payment_mode"
//             value={formData.payment_mode}
//             onChange={handleChange}
//             className="form-select w-full text-sm rounded"
//           >
//             <option value="cash">CASH</option>
//             <option value="credit">CREDIT</option>
//           </select>
//         </div>
//         <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
//           <input
//             name="credit_days"
//             value={formData.credit_days}
//             onChange={handleChange}
//             type="number"
//             className="form-input text-sm rounded"
//             placeholder="Credit days"
//           />
//         </div>
//       </div>
//       <div className="flex flex-wrap px-4">
//       <div className="w-[10%] flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Product</label>
//           <select
//             name="product_name"
//             value={pur.product_name}
            
//             onChange={handlePurChange}
//             className="form-select text-sm rounded"
//           >
//             <option value="">-- Select --</option>
//             {!isLoading &&
//               data.productServices.length > 0 &&
//               data.productServices.map((prd, i) => (
//                 <option key={i} value={prd.name}>
//                   {prd.name}
//                 </option>
//               ))}
//           </select>
//           {errors.product_name && (
//             <div style={{ color: "red" }}>{errors.product_name}</div>
//           )}
//         </div>
//         <div className="w-[6%] flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Pcs</label>
//           <input
//             type="text"
//             name="pcs"
//             value={pur.pcs}
//             onChange={handlePurChange}
//             className="form-input text-sm rounded"
//             placeholder="Pcs"
//           />
//         </div>
        // <div className="w-[6%] flex flex-col text-sm gap-1 p-1">
        //   <label htmlFor="">Gwt</label>
        //   <input
        //     type="text"
        //     name="gwt"
        //     value={pur.gwt}
        //     onChange={handlePurChange}
        //     className="form-input text-sm rounded"
        //     placeholder="Gwt"
        //   />
        // </div>
        // <div className="w-[6%] flex flex-col text-sm gap-1 p-1">
        //   <label htmlFor="">Nwt</label>
        //   <input
        //     type="text"
        //     name="nwt"
        //     value={pur.nwt}
        //     onChange={handlePurChange}
        //     className="form-input text-sm rounded"
        //     placeholder="Nwt"
        //   />
        // </div>
//         <div className="w-[6%] flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Rate</label>
//           <input
//             type="text"
//             name="rate"
//             value={pur.rate}
//             onChange={handlePurChange}
//             className="form-input text-sm rounded"
//             placeholder="Rate"
//           />
//         </div>
        // <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
        //   <label htmlFor="">Other Chg</label>
        //   <input
        //     type="text"
        //     name="other_chg"
        //     value={pur.other_chg}
        //     onChange={handlePurChange}
        //     className="form-input text-sm rounded"
        //     placeholder="Other Chg"
        //   />
        // </div>
//         <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Disc(%)</label>
//           <input
//             type="text"
//             name="disc_percent"
//             value={pur.disc_percent}
//             onChange={handlePurChange}
//             className="form-input text-sm rounded"
//             placeholder="Disc(%)"
//           />
//         </div>
//         <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Disc(Rs.)</label>
//           <input
//             type="text"
//             name="disc"
//             value={pur.disc}
//             onChange={handlePurChange}
//             className="form-input text-sm rounded"
//             placeholder="Disc(Rs.)"
//           />
//         </div>
//         <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">GST</label>
//           <select
//             name="gst"
//             value={pur.gst}
//             onChange={handlePurChange}
//             className="form-select text-sm rounded"
//           >
//             <option value="">GST</option>
//             <option value="3">3</option>
//             <option value="5">5</option>
//             <option value="12">12</option>
//             <option value="18">18</option>
//             <option value="28">28</option>
//           </select>
//         </div>
//         <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Taxable</label>
//           <input
//             type="text"
//             readOnly
//             name="taxable"
//             value={pur.taxable}
//             onChange={handlePurChange}
//             className="form-input text-sm rounded"
//             placeholder="Taxable"
//           />
//         </div>
//         <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Total GST</label>
//           <input
//             type="text"
//             readOnly
//             name="total_gst"
//             value={pur.total_gst}
//             onChange={handlePurChange}
//             className="form-input text-sm rounded"
//             placeholder="Total GST"
//           />
//         </div>
//         <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
//           <label htmlFor="">Net Amount</label>
//           <input
//             type="text"
//             readOnly
//             name="net_amount"
//             value={pur.net_amount}
//             onChange={handlePurChange}
//             className="form-input text-sm rounded"
//             placeholder="Net Amount"
//           />
//         </div>
//         <div className="flex items-end text-sm gap-1 p-1">
//           <button
//             type="button"
//             onClick={() => addItem()}
//             className="px-2 py-2 rounded bg-green-500 text-white mb-1"
//           >
//             <FaPlus />
//           </button>
//         </div>
//       </div>
//       <div className="p-3">
//         <table className="w-full">
//           <thead>
//             <tr>
//               <th className="text-sm font-medium bg-gray-300 py-3 rounded-tl">
//                 Item
//               </th>
//               <th className="text-sm font-medium bg-gray-300 py-3">Qty</th>
//               <th className="text-sm font-medium bg-gray-300 py-3">Rate</th>
//               <th className="text-sm font-medium bg-gray-300 py-3">Disc%</th>
//               <th className="text-sm font-medium bg-gray-300 py-3">
//                 Disc(Rs.)
//               </th>
//               <th className="text-sm font-medium bg-gray-300 py-3">GST</th>
//               <th className="text-sm font-medium bg-gray-300 py-3">Taxable</th>
//               <th className="text-sm font-medium bg-gray-300 py-3">GST Amt</th>
//               <th className="text-sm font-medium bg-gray-300 py-3">
//                 Net Amount
//               </th>
//               <th className="text-sm font-medium bg-gray-300 py-3 rounded-tr">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.purchase_items &&
//               formData.purchase_items.map((pr, i) => (
//                 <tr key={i}>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     {pr.product_name}
//                   </td>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     <p>Qty: {pr.pcs}</p>
//                     <p>Gwt: {pr.gwt}</p>
//                     <p>Nwt: {pr.nwt}</p>
//                   </td>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     {pr.rate}
//                   </td>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     {pr.disc_percent}
//                   </td>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     {pr.disc}
//                   </td>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     {pr.gst}
//                   </td>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     {pr.taxable}
//                   </td>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     {pr.total_gst}
//                   </td>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     {pr.net_amount}
//                   </td>
//                   <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
//                     <div className="flex gap-3 justify-center">
//                       <button
//                         onClick={() => deleteItem(i)}
//                         className="text-red-500"
//                       >
//                         <FaTimes size={18} />
//                       </button>
//                       <button
//                         onClick={() => editItem(i)}
//                         className="text-blue-500"
//                       >
//                         <FaPencil size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       <Modal
//         classNames={{
//           modal: "bg-white shadow-lg  rounded-md p-6", // Apply styles here
//         }}
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//         center
//       >
//         <div className="p-6 w-96 flex flex-col  items-center ">
//           {/* File Upload Section */}
//           {/* <div className="w-full flex flex-col items-center p-4 ">
//             <input
//               type="file"
//               onChange={handleFileChange}
//               className="mb-2 border p-2 rounded w-full outline-none"
//             />
//             <button
//               onClick={uploadStock}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition"
//             >
//               Upload
//             </button>
//           </div> */}
//           {/* File Upload Section */}
//           <div className="w-full flex flex-col items-center p-4">
//             <input
//               type="file"
//               onChange={handleFileChange}
//               className="mb-2 border p-2 rounded w-full outline-none"
//             />

//             {/* Upload Button */}
//             <button
//               onClick={uploadStock}
//               className={`px-4 py-2 rounded-md mt-2 transition ${
//                 isloader
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-blue-500 hover:bg-blue-600 text-white"
//               }`}
//               disabled={isLoading}
//             >
//               {isloader ? `Uploading... ${uploadProgress}%` : "Upload"}
//             </button>

//             {/* Progress Bar */}
//             {isloader && (
//               <div className="w-full bg-gray-200 rounded-full mt-2">
//                 <div
//                   className="h-3 bg-blue-500 rounded-full transition-all"
//                   style={{
//                     width: `${uploadProgress}%`,
//                     transition: "width 0.5s ease-in-out",
//                   }}
//                 ></div>
//               </div>
//             )}
//           </div>

//           {/* Divider */}

//           {/* Sample Download Section */}
//           <div className="w-full flex flex-col items-center p-4 ">
//             <button
//               onClick={handleDownloadSample}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//             >
//               Download Sample
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <Modal
//         classNames={{
//           modal: "bg-green-700 rounded-md p-6", // Apply styles here
//         }}
//         open={deleteModel}
//         onClose={() => setDeleteModel(false)}
//         center
//       >
//         <h2 className="text-xl font-semibold text-gray-800 mt-7 text-center mb-4">
//           Are you sure you want to delete all stock?
//         </h2>

//         <div className="flex justify-center gap-4 mt-4">
//           <button
//             className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
//             onClick={() => setDeleteModel(false)}
//           >
//             Cancel
//           </button>

//           <button
//             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//             onClick={handleDeleteAllPurchase}
//           >
//             Confirm
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default Page;







"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FaArrowLeft,
  FaEdit,
  FaPercentage,
  FaPlus,
  FaRegListAlt,
  FaSave,
  FaTimes,
  FaUserPlus,
} from "react-icons/fa";
import { FaArrowRotateRight, FaPencil } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight, MdDownload } from "react-icons/md";
import { usePurchase } from "@/app/hooks/purchase";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import toast from "react-hot-toast";
import {getProductService} from '@/app/components/config'

function Page() {
  // <-- Capitalize "Page"
  const { data, isLoading, createPurchase } = usePurchase();

  console.log("data of purchase", data);
  const [billAmount, setBillAmount] = useState(0);
  const [modal, setModal] = useState(false);
  const [supplierlist, setSupplierlist] = useState([]);
  const [file, setFile] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [isloader, setLoader] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [producstList, setProductList] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);

 
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedData = purchaseList?.flatMap((purchase) =>
    purchase?.purchase_items?.map((item) => ({
      ...item,
      purchase,
    }))
  );

  // Get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = paginatedData?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(paginatedData?.length / itemsPerPage);

  const token = getCookie("access_token");
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;
  // const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  const supplierList = async () => {
    const token = getCookie("access_token");
    const response = await axios.get("http://127.0.0.1:8000/api/suppliers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("response", response?.data?.suppliers);
    setSupplierlist(response?.data?.suppliers);
  };

  

  const fetchpurchaseList = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/saloon-purchase-returnss",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("purchase list", response.data);
      setPurchaseList(response?.data.data);
      // toast.success("Purchase list fetched successfully!");
    } catch (error) {
      console.error("Error fetching purchase list:", error);
      toast.error("Failed to fetch purchase list.");
    }
  };

  useEffect(() => {
    supplierList();
    featchProductsList();
    fetchpurchaseList();
   
  }, []);

  const [formData, setFormData] = useState({
    voucher_no: "",
    date: formattedDate,
    bill_no: "",
    is_igst: 0,
    user_id: "",
    payment_mode: "cash",
    credit_days: 0,
    purchase_items: [],
    discount: 0,
    credit_note: 0,
    addition: 0,
  });

  const [pur, setPur] = useState({
    is_edit: false,
    product_name: "",
    product_service_id: "",
    pcs: 0,
    gwt: 0,
    nwt: 0,
    rate: 0,
    other_chg: 0,
    disc: 0,
    disc_percent: 0,
    gst: 0,
    taxable: 0,
    total_gst: 0,
    net_amount: 0,
  });

  useEffect(() => {
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }
    fetchSupplierList();
  }, []);

  useEffect(() => {
    if (!isLoading && data?.purchaseCount != null) {
      setFormData((prev) => ({
        ...prev,
        voucher_no: "PU" + (parseInt(data.purchaseCount) + 1),
      }));
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (formData.purchase_items) {
      const totalAmount = formData.purchase_items.reduce((sum, item) => {
        return sum + parseFloat(item.net_amount || 0);
      }, 0);
      setBillAmount(totalAmount.toFixed(2));
    }
  }, [formData.purchase_items]);

  const fetchSupplierList = async () => {
    const token = getCookie("access_token");
    const response = await axios.get("http://127.0.0.1:8000/api/suppliers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSupplierlist(response?.data?.suppliers || []);
  };

  const handleDeleteAllPurchase = async () => {
    const response = await axios.delete(
      "http://127.0.0.1:8000/api/delete-all-purchase",
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      alert(response.data.message); // Show success message
      setDeleteModel(false);
      console.log(response);
    } else {
      alert("No records found to delete ");
    }
  };

  const handleProductSelect = (e) => {
    const selectedId = e.target.value;

    const selectedProduct = producstList.find(
      (item) => item.id.toString() === selectedId
    );

    if (selectedProduct) {
      setPur((prev) => ({
        ...prev,
        product_service_id: selectedProduct.id,
        product_name: selectedProduct.name,
      }));
    } else {
      setPur((prev) => ({
        ...prev,
        product_service_id: "",
        product_name: "",
      }));
    }
  };

  const handleDownloadSample = () => {
    window.location.href = "http://127.0.0.1:8000/api/download-sample-purchase";
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadStock = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const fileFormData = new FormData();
    fileFormData.append("file", file);

    fileFormData.append("data", JSON.stringify(formData)); // Convert object to string
    fileFormData.append("product_name", pur.product_name);
    fileFormData.append("product_service_id", pur.product_service_id);

    fileFormData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      setLoader(true);
      setUploadProgress(0);

      // Simulate Fake Upload Progress (0% → 100% in 2 seconds)
      let progress = 0;
      const fakeProgress = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(fakeProgress);
        }
      }, 200); // Every 200ms, increase progress by 10% (Total 2s)

      const response = await axios.post(
        "http://127.0.0.1:8000/api/purchase/bulk-upload-csv",
        fileFormData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      toast.success("File uploaded successfully!");

      clearInterval(fakeProgress); // Stop fake progress if upload finishes early
      setUploadProgress(100); // Ensure it reaches 100%

      // alert(response.data.message);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error uploading file!");

      setIsOpen(false);
    } finally {
      setTimeout(() => {
        setLoader(false);
        setUploadProgress(0); // Reset progress bar after 2s
      }, 2000); // Wait 2 seconds before resetting
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const handlePurChange = (e) => {
    const { name, value } = e.target;

    setPur((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      // If product_name is changed, find and update product_service_id
      if (name === "product_name") {
        const selectedProduct = data.productServices.find(
          (p) => p.name === value
        );
        updatedData.product_service_id = selectedProduct?.id || "";
      }

      console.log("updatedData", updatedData);
      // If numeric/tax-related field changes, recalculate
      if (
        [
          "pcs",
          "nwt",
          "rate",
          "other_chg",
          "disc",
          "disc_percent",
          "gst",
        ].includes(name)
      ) {
        updatedData.taxable = calculateTaxable(updatedData);
        updatedData.total_gst = calculateGst(updatedData);
        updatedData.net_amount = calculateNetAmount(updatedData);
      }

      return updatedData;
    });
  };

  //sallon products
  const featchProductsList = async () => {
    try {
      // const res = await axios.get(
      //   "http://127.0.0.1:8000/api/product-service-saloon?pro_ser_type=Product",
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
       const res = await getProductService();
      setProductList(res?.data);
    } catch (error) {
      console.error("Fetch products failed:", error);
    }
  };

  const calculateTaxable = (data) => {
    const pcs = parseFloat(data.pcs) || 0;
    const nwt = parseFloat(data.nwt) || 0;
    const rate = parseFloat(data.rate) || 0;
    const otherChg = parseFloat(data.other_chg) || 0;
    const disc = parseFloat(data.disc) || 0;
    const discPercent = parseFloat(data.disc_percent) || 0;

    const baseAmount = pcs * rate;
    const discount = baseAmount * (discPercent / 100) + disc;
    const taxableAmount = baseAmount + otherChg - discount;

    return taxableAmount.toFixed(2);
  };

  const calculateGst = (data) => {
    const gst = parseFloat(data.gst) || 0;
    const taxable = parseFloat(data.taxable) || 0;
    const gstAmount = (taxable * gst) / 100;
    return gstAmount.toFixed(2);
  };

  const calculateNetAmount = (data) => {
    const taxable = parseFloat(data.taxable) || 0;
    const totalGst = parseFloat(data.total_gst) || 0;
    const netAmount = taxable + totalGst;
    return netAmount.toFixed(2);
  };

  const addItem = () => {
    const validationErrors = {};
    // if (!pur.product_name?.trim()) {
    //   validationErrors.product_name = "Product name is required";
    // }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      purchase_items: [...(prev.purchase_items || []), pur],
    }));

    setPur({
      is_edit: false,
      product_name: "",
      product_service_id: "",
      pcs: 0,
      gwt: 0,
      nwt: 0,
      rate: 0,
      other_chg: 0,
      disc: 0,
      disc_percent: 0,
      gst: 0,
      taxable: 0,
      total_gst: 0,
      net_amount: 0,
    });
  };

  const editItem = (index) => {
    const itemToEdit = formData.purchase_items[index];
    if (itemToEdit) {
      setPur({ ...itemToEdit, is_edit: true });
    }
  };

  const deleteItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      purchase_items: prev.purchase_items.filter((_, i) => i !== index),
    }));
  };

  const additional = () => {
    const totalAmount = formData.purchase_items.reduce((sum, item) => {
      return sum + parseFloat(item.net_amount || 0);
    }, 0);
    const discountPercent = parseFloat(formData.discount || 0);
    const creditNote = parseFloat(formData.credit_note || 0);
    const addition = parseFloat(formData.addition || 0);

    const discountedAmount =
      totalAmount - (totalAmount * discountPercent) / 100;
    const updatedBillAmount = discountedAmount - creditNote + addition;

    setBillAmount(updatedBillAmount.toFixed(2));
    setModal(false);
  };

  const handleSubmit = async () => {
    try {
      console.log("formData", formData);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/saloon-purchase",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Purchase saved successfully!");
      fetchpurchaseList()
      console.log("response", response.data);

      // Success response handling
      // if (response.status === 200 || response.status === 201) {
      setFormData({
        voucher_no: "",
        date: "",
        bill_no: "",
        is_igst: 0,
        user_id: "",
        payment_mode: "cash",
        credit_days: 0,
        purchase_items: [],
        discount: 0,
        credit_note: 0,
        addition: 0,
      });
      setErrors({}); // Clear any existing errors
      // alert("Purchase saved successfully!");
      // }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error saving purchase!");
    }
  };

  return (
    <div className="absolute left-0 top-0 w-full bg-white h-full">
      {/* //plus button to click model */}
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="absolute top-14 right-[35%] mt-2 mr-7 flex items-center gap-2 px-3 py-2 text-white font-semibold 
        bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md 
        hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transition-all duration-300"
      >
        <FaPlus size={16} className="text-white" />
        Bulk Upload
      </button>
      <button
        onClick={() => {
          setDeleteModel(true);
        }}
        className="absolute top-16 right-[22%] mr-1 flex items-center gap-2 px-2 py-2 text-white font-semibold 
             bg-gradient-to-r from-red-500 to-red-700 rounded-md shadow-sm 
             hover:from-red-600 hover:to-red-800 hover:shadow-lg transition-all duration-300"
      >
        <FaTimes size={18} className="text-white" />
        Delete all purchase
      </button>

      <Modal
        open={modal}
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
        onClose={() => setModal(false)}
      >
        <div className="py-4 flex flex-wrap gap-2">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="">Disc %</label>
            <input
              type="text"
              name="addt_discount"
              placeholder="Enter disc"
              value={formData.discount}
              onChange={handleChange}
              className="text-sm rounded form-input"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="">Credit Note</label>
            <input
              type="text"
              name="credit_note"
              placeholder="Enter credit note"
              value={formData.credit_note}
              onChange={handleChange}
              className="text-sm rounded form-input"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="">Addition</label>
            <input
              type="text"
              name="addition"
              placeholder="Enter addition"
              value={formData.addition}
              onChange={handleChange}
              className="text-sm rounded form-input"
            />
          </div>
          <div className="flex justify-center w-full">
            <button
              onClick={() => additional()}
              className="w-max px-4 py-2 rounded bg-green-500 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
      <div className="w-full flex p-3 px-6 bg-green-500 text-white">
        <Link href="/dashboard" className="flex items-center text-sm gap-2">
          <FaArrowLeft />
        </Link>
        <p className="flex-1 text-center font-semibold">Purchase</p>
      </div>
      <div className="w-full flex justify-between items-center p-3 px-6 shadow-xl">
        <div className="flex">
          <button className="text-sm px-4 flex flex-col items-center gap-1">
            <FaArrowRotateRight size={24} className="text-blue-700" />
            <span>Refresh</span>
          </button>
          <Link
            href="/jwellery/reports/purchasereport"
            className="text-sm px-4 flex flex-col items-center gap-1"
          >
            <FaRegListAlt size={24} className="text-blue-700" />
            <span>Report</span>
          </Link>
          <button
            onClick={() => handleSubmit()}
            className="text-sm px-4 flex flex-col items-center gap-1"
          >
            <FaSave size={24} className="text-blue-700" />
            <span>Save</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setModal(true)}
            className="bg-green-500  text-sm items-center p-2.5 rounded text-white"
          >
            <div className="flex ">
              {" "}
              <FaPercentage />
              <span>Disc</span>
            </div>
          </button>
          <div className="flex items-center text-white px-3 py-2 bg-orange-500 rounded">
            <span>Bill Amount</span>
            <MdKeyboardDoubleArrowRight size={18} />
            <span className="ml-8">&#8377; {billAmount}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap py-1 px-4">
        <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Voucher No</label>
          <input
            type="text"
            name="voucher_no"
            value={formData.voucher_no}
            onChange={handleChange}
            className={`form-input text-sm rounded ${
              errors.voucher_no ? "border-red-500 text-red-500" : ""
            }`}
            placeholder="Enter voucher no."
          />
        </div>
        <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-input text-sm rounded ${
              errors.date ? "border-red-500 text-red-500" : ""
            }`}
            placeholder="Enter date"
          />
        </div>
        <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Bill No</label>
          <div className="flex items-center w-full">
            <input
              name="bill_no"
              value={formData.bill_no}
              onChange={handleChange}
              type="text"
              className={`form-input text-sm rounded w-full ${
                errors.bill_no ? "border-red-500 text-red-500" : ""
              }`}
              placeholder="Enter bill no."
            />
          </div>
        </div>
        {/* <div className="w-[8%] flex items-end text-sm gap-1 p-1">
          <label className="inline-flex mb-3 items-center cursor-pointer">
            <input
              name="is_igst"
              value={formData.is_igst}
              onChange={handleChange}
              type="checkbox"
              className="sr-only peer"
            />
            <span className="ms-3 text-sm font-medium text-gray-900 mr-2">
              Is IGST
            </span>
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div> */}
        <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Supplier List</label>
          <div className="w-full flex gap-2">
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="form-select w-full text-sm rounded"
            >
              <option value="">--Select Supplier--</option>
              {supplierlist.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
              {/* <option value="">-- Select Supplier --</option>
              <option value="1">Rahul Kumar....</option>
              <option value="2">Amir</option> */}
            </select>
            {/* <Link href={"#"}>
              <FaUserPlus size={24} />
            </Link> */}
          </div>
        </div>
        <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Payment Mode</label>
          <select
            name="payment_mode"
            value={formData.payment_mode}
            onChange={handleChange}
            className="form-select w-full text-sm rounded"
          >
            <option value="cash">CASH</option>
            <option value="credit">CREDIT</option>
          </select>
        </div>
        <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Credit Days</label>
          <input
            name="credit_days"
            value={formData.credit_days}
            onChange={handleChange}
            type="number"
            className="form-input text-sm rounded"
            placeholder="Credit days"
          />
        </div>
      </div>
      <div className="flex flex-wrap px-4">
        <div className="w-[10%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Product</label>
          {/* <select
            name="product_name"
            value={pur.product_name}
            
            onChange={handlePurChange}
            className="form-select text-sm rounded"
          >
            <option value="">-- Select --</option>
            {!isLoading &&
              data.productServices.length > 0 &&
              data.productServices.map((prd, i) => (
                <option key={i} value={prd.name}>
                  {prd.name}
                </option>
              ))}
          </select> */}
          {/* <select
             name="product_service_id"
             value={pur.product_service_id}
             
             onChange={handlePurChange}
             className="form-select text-sm rounded"
            >
              <option value="">Select Product</option>
              {producstList.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name} (ID: {item.id})
                </option>
              ))}
                
            </select> */}
          <select
            name="product_service_id"
            value={pur.product_service_id}
            onChange={handleProductSelect}
            className="form-select text-sm rounded"
          >
            <option value="">Select Product</option>
            {producstList.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name} (ID: {item.id})
              </option>
            ))}
          </select>

          {errors.product_name && (
            <div style={{ color: "red" }}>{errors.product_name}</div>
          )}
        </div>
        <div className="w-[6%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Pcs</label>
          <input
            type="text"
            name="pcs"
            value={pur.pcs}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Pcs"
          />
        </div>

        <div className="w-[6%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Gwt</label>
          <input
            type="text"
            name="gwt"
            value={pur.gwt}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Gwt"
          />
        </div>
        <div className="w-[6%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Nwt</label>
          <input
            type="text"
            name="nwt"
            value={pur.nwt}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Nwt"
          />
        </div>
        

        <div className="w-[6%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Amount</label>
          <input
            type="text"
            name="rate"
            value={pur.rate}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Rate"
          />
        </div>
        <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Other Chg</label>
          <input
            type="text"
            name="other_chg"
            value={pur.other_chg}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Other Chg"
          />
        </div>

        <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Disc(%)</label>
          <input
            type="text"
            name="disc_percent"
            value={pur.disc_percent}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Disc(%)"
          />
        </div>
        <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Disc(Rs.)</label>
          <input
            type="text"
            name="disc"
            value={pur.disc}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Disc(Rs.)"
          />
        </div>
        <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">GST</label>
          <select
            name="gst"
            value={pur.gst}
            onChange={handlePurChange}
            className="form-select text-sm rounded"
          >
            <option value="">GST</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="12">12</option>
            <option value="18">18</option>
            <option value="28">28</option>
          </select>
        </div>
        <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Taxable</label>
          <input
            type="text"
            readOnly
            name="taxable"
            value={pur.taxable}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Taxable"
          />
        </div>
        <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Total GST</label>
          <input
            type="text"
            readOnly
            name="total_gst"
            value={pur.total_gst}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Total GST"
          />
        </div>
        <div className="w-[8%] flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Net Amount</label>
          <input
            type="text"
            readOnly
            name="net_amount"
            value={pur.net_amount}
            onChange={handlePurChange}
            className="form-input text-sm rounded"
            placeholder="Net Amount"
          />
        </div>
        <div className="flex items-end text-sm gap-1 p-1">
          <button
            type="button"
            onClick={() => addItem()}
            className="px-2 py-2 rounded bg-green-500 text-white mb-1"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      <div className="p-3">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-sm font-medium bg-gray-300 py-3 rounded-tl">
                Item
              </th>
              <th className="text-sm font-medium bg-gray-300 py-3">Qty</th>
              <th className="text-sm font-medium bg-gray-300 py-3">Amount</th>
              <th className="text-sm font-medium bg-gray-300 py-3">Disc%</th>
              <th className="text-sm font-medium bg-gray-300 py-3">
                Disc(Rs.)
              </th>
              <th className="text-sm font-medium bg-gray-300 py-3">GST</th>
              <th className="text-sm font-medium bg-gray-300 py-3">Taxable</th>
              <th className="text-sm font-medium bg-gray-300 py-3">GST Amt</th>
              <th className="text-sm font-medium bg-gray-300 py-3">
                Net Amount
              </th>
              <th className="text-sm font-medium bg-gray-300 py-3 rounded-tr">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {formData?.purchase_items &&
              formData?.purchase_items?.map((pr, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    {pr.product_name}
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    <p>Qty: {pr.pcs}</p>
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    {pr.rate}
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    {pr.disc_percent}
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    {pr.disc}
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    {pr.gst}
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    {pr.taxable}
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    {pr.total_gst}
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    {pr.net_amount}
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => deleteItem(i)}
                        className="text-red-500"
                      >
                        <FaTimes size={18} />
                      </button>
                      {/* <button
                        onClick={() => editItem(i)}
                        className="text-blue-500"
                      >
                        <FaPencil size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="overflow-x-auto p-4">
          <table className="min-w-full bg-white border rounded text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Supplier Name</th>
                <th className="border p-2">Bill No</th>
                <th className="border p-2">Payment Mode</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Pcs</th>
                <th className="border p-2">N.wt</th>
                <th className="border p-2">G.wt</th>
                <th className="border p-2">Pcs</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Others Chg</th>
                <th className="border p-2">Taxable</th>
                <th className="border p-2">Total GST</th>
                <th className="border p-2">Net Amount</th>
              </tr>
            </thead>

            <tbody>
              {currentItems?.map((entry, index) => (
                <tr
                  key={`${entry.purchase.id}-${entry.id}-${index}`}
                  className="border-b"
                >
                  <td className="border p-2">
                    {entry?.purchase?.supplier?.name || "N/A"}
                  </td>
                  <td className="border p-2">{entry.purchase.bill_no}</td>
                  <td className="border p-2">{entry.purchase.payment_mode}</td>
                  <td className="border p-2">{entry.purchase.date}</td>
                  <td className="border p-2">{entry.product_name}</td>
                  <td className="border p-2">{entry.pcs}</td>
                  <td className="border p-2">{entry.nwt}</td>other_chg
                  <td className="border p-2">{entry.gwt}</td>
                  <td className="border p-2">{entry.rate}</td>
                  <td className="border p-2">{entry.other_chg}</td>
                  <td className="border p-2">{entry.taxable}</td>
                  <td className="border p-2">{entry.total_gst}</td>
                  <td className="border p-2">{entry.net_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center gap-2 p-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border bg-green-500 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-green-500 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        classNames={{
          modal: "bg-white shadow-lg  rounded-md p-6", // Apply styles here
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        center
      >
        <div className="p-6 w-96 flex flex-col  items-center ">
          {/* File Upload Section */}
          {/* <div className="w-full flex flex-col items-center p-4 ">
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-2 border p-2 rounded w-full outline-none"
            />
            <button
              onClick={uploadStock}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition"
            >
              Upload
            </button>
          </div> */}
          {/* File Upload Section */}
          <div className="w-full flex flex-col items-center p-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-2 border p-2 rounded w-full outline-none"
            />

            {/* Upload Button */}
            <button
              onClick={uploadStock}
              className={`px-4 py-2 rounded-md mt-2 transition ${
                isloader
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              disabled={isLoading}
            >
              {isloader ? `Uploading... ${uploadProgress}%` : "Upload"}
            </button>

            {/* Progress Bar */}
            {isloader && (
              <div className="w-full bg-gray-200 rounded-full mt-2">
                <div
                  className="h-3 bg-blue-500 rounded-full transition-all"
                  style={{
                    width: `${uploadProgress}%`,
                    transition: "width 0.5s ease-in-out",
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* Divider */}

          {/* Sample Download Section */}
          <div className="w-full flex flex-col items-center p-4 ">
            <button
              onClick={handleDownloadSample}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Download Sample
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        classNames={{
          modal: "bg-green-700 rounded-md p-6", // Apply styles here
        }}
        open={deleteModel}
        onClose={() => setDeleteModel(false)}
        center
      >
        <h2 className="text-xl font-semibold text-gray-800 mt-7 text-center mb-4">
          Are you sure you want to delete all stock?
        </h2>

        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            onClick={() => setDeleteModel(false)}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={handleDeleteAllPurchase}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Page;
