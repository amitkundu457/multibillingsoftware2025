// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import { FaArrowLeft, FaPlus, FaRupeeSign, FaTimes } from "react-icons/fa";
// import { Modal } from "react-responsive-modal";
// import "react-responsive-modal/styles.css";
// import axios from "axios";
// import { useStock } from "@/app/hooks/stock";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// function Page() {
//   const [formData, setFormData] = useState({
//     product_service_id: "",
//     quantity: "",
//     gross_weight: "",
//     net_weight: "",
//     rate: "",
//     mrp: 0,
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

//   //dowlod bittom
//   const handleDownloadProductServices = () => {
//     if (!data || !data.productServices || data.productServices.length === 0) {
//       alert("No data available to download.");
//       return;
//     }

//     const exportData = data.stock.map((prd) => ({
//       ID: prd.product_service_id,
//       Name: prd.product_service.name,
//       Quantity: prd.quantity ?? "",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Product Services");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const fileData = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     saveAs(fileData, "product_services.xlsx");
//   };

//   const [errors, setErrors] = useState({});
//   const [file, setFile] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [deleteModel, setDeleteModel] = useState(false);

//   const router = useRouter();

//   const handleDeleteAllStock = async () => {
//     const response = await axios.delete(
//       " https://apibrize.brizindia.com/api/delete-all-stock"
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
//     window.location.href = " https://apibrize.brizindia.com/api/download-sample-stock";
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const uploadStock = async () => {
//     const token = getToken(); // your function to get JWT token
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }

//     if (!file) {
//       alert("Please select a CSV file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("csv_file", file);

//     try {
//       const response = await axios.post(
//         "https://apibrize.brizindia.com/api/upload/stock",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Upload error:", error);
//       if (error.response && error.response.data) {
//         alert(error.response.data.error || "Upload failed.");
//       } else {
//         alert("Network or server error during upload.");
//       }
//     }
//   };

//   const setModelState = () => {
//     setIsOpen(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: null,
//     }));
//   };

//   const { data, isLoading, createStock, deleteStock } = useStock();
//   console.log(data);
//   const handleDelete = async (id) => {
//     await deleteStock(id);
//   };

//   const handleSubmit = async (e) => {
//     console.log("opening stock1");
//     e.preventDefault();
//     const validationErrors = await createStock(formData);

//     console.log("validationErrors stock opening ", validationErrors);
//     if (validationErrors) {
//       setErrors(validationErrors);
//       // router.push("/jwellery/inventory/openingstock")
//     } else {
//       setFormData({
//         product_service_id: "",
//         quantity: "",
//         gross_weight: "",
//         net_weight: "",
//         rate: "",
//         mrp: 0,
//       });
//     }
//   };
//   return (
//     <div className="absolute left-0 top-0 w-full h-full bg-white">
//       {/* //plus button to click model */}
//       <button
//         onClick={() => {
//           setIsOpen(true);
//         }}
//         className="absolute top-16 right-6 flex items-center gap-2 px-4 py-2 text-white font-semibold
//              bg-gradient-to-r from-blue-500 to-blue-700 rounded-full shadow-md
//              hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transition-all duration-300"
//       >
//         <FaPlus size={20} className="text-white" />
//         Click to Upload File
//       </button>
//       <button
//         onClick={() => {
//           setDeleteModel(true);
//         }}
//         className="absolute top-28 right-6 flex items-center gap-2 px-3 py-2 text-white font-semibold
//              bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-md
//              hover:from-red-600 hover:to-red-800 hover:shadow-lg transition-all duration-300"
//       >
//         <FaTimes size={20} className="text-white" />
//         Delete all stock
//       </button>
//       <button
//         onClick={handleDownloadProductServices}
//         className="absolute top-40 right-6 flex items-center gap-2 px-4 py-2 text-white font-semibold
//        bg-gradient-to-r from-green-500 to-green-700 rounded-full shadow-md
//        hover:from-green-600 hover:to-green-800 hover:shadow-lg transition-all duration-300"
//       >
//         <FaRupeeSign size={16} className="text-white" />
//         Download Product Services
//       </button>

//       <div className="w-full flex p-3 px-6 bg-green-500 text-white">
//         <Link href="/dashboard" className="flex items-center text-sm gap-2">
//           <FaArrowLeft />
//         </Link>
//         <p className="flex-1 text-center font-semibold">Opening Stocks</p>
//       </div>
//       <form onSubmit={handleSubmit} className="flex p-4">
//         <div className="flex flex-col gap-3 text-sm w-1/4 p-2">
//           <label htmlFor="">Product</label>
//           <select
//             name="product_service_id"
//             id=""
//             value={formData.product_service_id}
//             onChange={handleChange}
//             className="form-input border border-gray-400 text-sm rounded"
//           >
//             <option value="">-- Select Option --</option>
//             {!isLoading &&
//               data?.productServices &&
//               data?.productServices?.map((prd, i) => (
//                 <option key={i} value={prd.id}>
//                   {prd.name} <span>Id: </span>
//                   {prd.id}
//                 </option>
//               ))}
//           </select>
//           {errors.product_service_id && (
//             <p className="text-sm text-red-500">
//               {errors.product_service_id[0]}
//             </p>
//           )}
//         </div>
//         <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
//           <label htmlFor="">Quantity</label>
//           <input
//             name="quantity"
//             type="text"
//             placeholder="Qty"
//             className="form-input border border-gray-400 text-sm rounded"
//             value={formData.quantity}
//             onChange={handleChange}
//           />
//           {errors.quantity && (
//             <p className="text-sm text-red-500">{errors.quantity[0]}</p>
//           )}
//         </div>
//         <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
//           <label htmlFor="">Gross Wgt.</label>
//           <input
//             type="text"
//             placeholder="gwt"
//             className="form-input border border-gray-400 text-sm rounded"
//             name="gross_weight"
//             value={formData.gross_weight}
//             onChange={handleChange}
//           />
//           {errors.gross_weight && (
//             <p className="text-sm text-red-500">{errors.gross_weight[0]}</p>
//           )}
//         </div>
//         <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
//           <label htmlFor="">Net Wgt.</label>
//           <input
//             type="text"
//             placeholder="nwt"
//             className="form-input border border-gray-400 text-sm rounded"
//             name="net_weight"
//             value={formData.net_weight}
//             onChange={handleChange}
//           />
//           {errors.net_weight && (
//             <p className="text-sm text-red-500">{errors.net_weight[0]}</p>
//           )}
//         </div>
//         <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
//           <label htmlFor="">Rate.</label>
//           <input
//             type="text"
//             placeholder="Rate"
//             className="form-input border border-gray-400 text-sm rounded"
//             name="rate"
//             value={formData.rate}
//             onChange={handleChange}
//           />
//           {errors.rate && (
//             <p className="text-sm text-red-500">{errors.rate[0]}</p>
//           )}
//         </div>
//         <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
//           <label htmlFor="">MRP.</label>
//           <input
//             type="text"
//             placeholder="MRP"
//             className="form-input border border-gray-400 text-sm rounded"
//             name="mrp"
//             value={formData.mrp}
//             onChange={handleChange}
//           />
//           {errors.mrp && (
//             <p className="text-sm text-red-500">{errors.mrp[0]}</p>
//           )}
//         </div>
//         <div className="flex items-start pt-9 gap-3 w-[10%] p-2 text-sm rounded">
//           <button className="px-3 py-3 rounded bg-green-500 text-white">
//             <FaPlus />
//           </button>
//         </div>
//       </form>

//       <div className="flex flex-col gap-1 p-2 h-[500px] mt-10 overflow-y-auto border border-gray-300 rounded">
//         {!isLoading &&
//           data.stock
//             ?.filter((st) => st.date == null)
//             .map((st, i) => (
//               <div
//                 key={i}
//                 className="p-3 px-4 shadow-xl border border-gray-300 rounded space-y-2"
//               >
//                 <div className="flex justify-between items-center">
//                   <h1>
//                     {st.product_service
//                       ? st.product_service.name
//                       : st.product_service_name}
//                   </h1>
//                   <button
//                     type="button"
//                     onClick={() => handleDelete(st.id)}
//                     className="text-red-500"
//                   >
//                     <FaTimes />
//                   </button>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span>
//                     {st?.quantity} | {st?.gross_weight} | {st?.net_weight} |{" "}
//                     {st?.rate} | {st?.mrp}
//                   </span>
//                   <p className="flex items-center gap-1">
//                     <FaRupeeSign className="text-green-500" />
//                     <span>{st.mrp || 0}</span>
//                   </p>
//                 </div>
//               </div>
//             ))}
//       </div>

//       <Modal open={isOpen} onClose={() => setIsOpen(false)} center>
//         <div className="p-6 w-96 flex flex-col items-center bg-white shadow-lg rounded-lg">
//           {/* File Upload Section */}
//           <div className="w-full flex flex-col items-center p-4 bg-gray-100 rounded-lg">
//             <input
//               type="file"
//               onChange={handleFileChange}
//               className="mb-2 border p-2 rounded w-full"
//             />
//             <button
//               onClick={uploadStock}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition"
//             >
//               Upload
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="my-4 w-full border-t"></div>

//           {/* Sample Download Section */}
//           <div className="w-full flex flex-col items-center p-4 bg-gray-100 rounded-lg">
//             <button
//               onClick={handleDownloadSample}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//             >
//               Download Sample
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <Modal open={deleteModel} onClose={() => setDeleteModel(false)} center>
//         <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
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
//             onClick={handleDeleteAllStock}
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
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft, FaPlus, FaRupeeSign, FaTimes } from "react-icons/fa";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import { useStock } from "@/app/hooks/stock";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Page() {
  const [formData, setFormData] = useState({
    product_service_id: "",
    quantity: "",
    gross_weight: "",
    net_weight: "",
    rate: "",
    mrp: 0,
  });

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);

  const router = useRouter();
  const { data, isLoading, createStock, deleteStock } = useStock();

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

  const handleDownloadProductServices = () => {
    if (!data || !data.productServices || data.productServices.length === 0) {
      alert("No data available to download.");
      return;
    }

    const exportData = data.stock.map((prd) => ({
      ID: prd.product_service_id,
      Name: prd.product_service?.name,
      Quantity: prd.quantity ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Services");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "product_services.xlsx");
  };

  // const handleDeleteAllStock = async () => {
  //   const response = await axios.delete("https://apibrize.brizindia.com/api/delete-all-stock");
  //   if (response.status === 200) {
  //     alert(response.data.message);
  //     setDeleteModel(false);
  //   } else {
  //     alert("No records found to delete ");
  //   }
  // };

  const handleDeleteAllStock = async () => {
    const token = getToken(); // Reuse the token fetcher

    if (!token) {
      notifyTokenMissing(); // Optional: show error if no token
      return;
    }

    try {
      const response = await axios.delete(
        "https://apibrize.brizindia.com/api/delete-all-stock",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token here
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        setDeleteModel(false);
      } else {
        alert("No records found to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete stock.");
    }
  };

  const handleDownloadSample = () => {
    window.location.href =
      "https://apibrize.brizindia.com/api/download-sample-stock";
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadStock = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", file);

    try {
      const response = await axios.post(
        " https://apibrize.brizindia.com/api/upload/stock",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleDelete = async (id) => {
    await deleteStock(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await createStock(formData);
    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      setFormData({
        product_service_id: "",
        quantity: "",
        gross_weight: "",
        net_weight: "",
        rate: "",
        mrp: 0,
      });
    }
  };

  // PAGINATION LOGIC
  const itemsPerPage = 10;
  const filteredStock = !isLoading
    ? data?.stock?.filter((st) => st.date == null) || []
    : [];
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStock.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);

  return (
    <div className="absolute left-0 top-0 w-full h-full bg-white">
      {/* Header Buttons */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-16 right-6 flex items-center gap-2 px-4 py-2 text-white font-semibold bg-blue-600 rounded-full shadow hover:bg-blue-700 transition"
      >
        <FaPlus />
        Upload File
      </button>
      <button
        onClick={() => setDeleteModel(true)}
        className="absolute top-28 right-6 flex items-center gap-2 px-3 py-2 text-white font-semibold bg-red-600 rounded-full shadow hover:bg-red-700 transition"
      >
        <FaTimes />
        Delete all stock
      </button>
      <button
        onClick={handleDownloadProductServices}
        className="absolute top-40 right-6 flex items-center gap-2 px-4 py-2 text-white font-semibold bg-green-600 rounded-full shadow hover:bg-green-700 transition"
      >
        <FaRupeeSign />
        Download Product Services
      </button>

      {/* Back Header */}
      <div className="w-full flex p-3 px-6 bg-green-500 text-white">
        <Link href="/dashboard" className="flex items-center text-sm gap-2">
          <FaArrowLeft />
        </Link>
        <p className="flex-1 text-center font-semibold">Opening Stocks</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex p-4 flex-wrap gap-4">
        {/* Product */}
        <div className="flex flex-col w-[18%] text-sm">
          <label>Product</label>
          {/* <select
            name="product_service_id"
            value={formData.product_service_id}
            onChange={handleChange}
            className="form-input border border-gray-400 rounded"
          >
            <option value="">-- Select --</option>
            {!isLoading &&
              data?.productServices?.map((prd, i) => (
                <option key={i} value={prd.id}>
                  {prd.name}
                </option>
              ))}
          </select> */}
          <select
            name="product_service_id"
            id=""
            value={formData.product_service_id}
            onChange={handleChange}
            className="form-input border border-gray-400 text-sm rounded"
          >
            <option value="">-- Select Product --</option>
            {!isLoading &&
              data?.productServices &&
              data?.productServices?.map((prd, i) => (
                <option key={i} value={prd.id}>
                  {prd.name} <span>Id: </span>
                  {prd.id}
                </option>
              ))}
          </select>
          {errors.product_service_id && (
            <p className="text-red-500">{errors.product_service_id[0]}</p>
          )}
        </div>

        {["quantity", "gross_weight", "net_weight", "rate", "mrp"].map(
          (field) => (
            <div className="flex flex-col w-[10%]" key={field}>
              <label className="capitalize">{field.replace("_", " ")}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="form-input border border-gray-400 rounded text-sm"
                placeholder={field.toUpperCase()}
              />
              {errors[field] && (
                <p className="text-red-500">{errors[field][0]}</p>
              )}
            </div>
          )
        )}

        <div className="flex items-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaPlus />
          </button>
        </div>
      </form>

      {/* Table Section */}
      <div className="p-4 mt-10 border border-gray-300 rounded">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">S.No</th>
              <th className="border p-2 text-left">Product</th>
              <th className="border p-2 text-left">Qty</th>
              <th className="border p-2 text-left">Gross Wt</th>
              <th className="border p-2 text-left">Net Wt</th>
              <th className="border p-2 text-left">Rate</th>
              <th className="border p-2 text-left">MRP</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && currentItems.length > 0 ? (
              currentItems.map((st, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border p-2">{indexOfFirstItem + index + 1}</td>
                  <td className="border p-2">
                    {st.product_service?.name ||
                      st.product_service_name ||
                      "N/A"}
                  </td>
                  <td className="border p-2">{st.quantity}</td>
                  <td className="border p-2">{st.gross_weight}</td>
                  <td className="border p-2">{st.net_weight}</td>
                  <td className="border p-2">{st.rate}</td>
                  <td className="border p-2">{st.mrp}</td>
                  <td className="border p-2 text-center text-red-500">
                    <button onClick={() => handleDelete(st.id)}>
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No stock data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {/* {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">
              Next
            </button>
          </div>
        )} */}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 items-center gap-2 text-sm">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            {/* Dynamic Pagination Logic */}
            {(() => {
              const pagesToShow = [];
              const maxPageButtons = 5;

              const startPage = Math.max(
                1,
                currentPage <= maxPageButtons
                  ? 1
                  : currentPage - Math.floor(maxPageButtons / 2)
              );
              const endPage = Math.min(
                totalPages,
                startPage + maxPageButtons - 1
              );

              // Always show first 1-2 pages
              if (startPage > 1) {
                pagesToShow.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === 1
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    1
                  </button>
                );
                if (startPage > 2) {
                  pagesToShow.push(<span key="start-ellipsis">...</span>);
                }
              }

              // Dynamic middle pages
              for (let i = startPage; i <= endPage; i++) {
                if (i !== 1 && i !== totalPages) {
                  pagesToShow.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === i
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
              }

              // Always show last 1-2 pages
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pagesToShow.push(<span key="end-ellipsis">...</span>);
                }
                pagesToShow.push(
                  <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === totalPages
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {totalPages}
                  </button>
                );
              }

              return pagesToShow;
            })()}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)} center>
        <div className="p-6 w-96 flex flex-col items-center bg-white shadow-lg rounded-lg">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-2 border p-2 rounded w-full"
          />
          <button
            onClick={uploadStock}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
          >
            Upload
          </button>
          <div className="my-4 w-full border-t" />
          <button
            onClick={handleDownloadSample}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download Sample
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteModel} onClose={() => setDeleteModel(false)} center>
        <h2 className="text-xl font-semibold text-center mb-4">
          Delete All Stock?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setDeleteModel(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDeleteAllStock}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Page;
