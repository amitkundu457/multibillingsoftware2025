"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaRupeeSign, FaTimes } from "react-icons/fa";

import Barcode from "react-barcode";
import {
  createBarcode,
  getBarcode,
  getProductService,
  getcompany,
  getRatemaster,
} from "../../../components/config";
const BarcodeData = () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [brands, setBrands] = useState([]);
  const [item, setItems] = useState([]);
  const [rate, setRate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purity, setPurity] = useState([]);
  const [prefix, setPrefix] = useState(""); // User-entered prefix
  const [suffix, setSuffix] = useState(""); // Auto-incremented suffix
  const [barcode, setBarcode] = useState(""); // Full barcode (prefix + suffix)
  const[barcodeCount,setBarcodeCount] = useState(0);

  const fields = [
    "barcode_no",
    "sku",
    "itemno",
    "item_id",
    // "brand_id",
    // "purity_id",
    // "huid",
    // "gwt",
    // "nwt",
    // "design",
    "pcs",
    // "making_in_rs",
    // "making_in_percent",
    // "bill_number",
    // "image",
    // "basic_rate",
    // "purchase_rates",
    // "mrp",
    // "sale_rate",
    // "gm",
    // "diamond_value",
    // "diamond_details",
    // "stone_details",
    // "stone_value",
    // "hallmark",
    // "hallmark_charge",
    // "wastage_charge",
    // "other_charge",
 
    
  ];
  const fieldTitles = {
    barcode_no: "Barcode No",
    sku: "SKU",
    itemno: "Item No",
    // item_id: "Item ID",
    item_id: "Product Name", 
    // brand_id: "Brand",
    // purity_id: "Purity",
    // huid: "HUID",
    // gwt: "Gross Weight (GWT)",
    // nwt: "Net Weight (NWT)",
    // design: "Design",
    // pcs: "Pieces",
    // making_in_rs: "making in (Rs)-- per grm",
    // making_in_percent: "Making Charge (%)",
    // bill_number: "Bill Number",
    // image: "Image",
    // basic_rate: "Basic Rate",
    // purchase_rates: "Purchase Rate",
    // mrp: "MRP",
    // sale_rate: "Sale Rate",
    // gm: "Gram",
    // diamond_value: "Diamond Value",
    // diamond_details: "Diamond (Carats)",
    // stone_details: "Stone Wgt",
    // stone_value: "Stone Value",
    // hallmark: "Hallmark",
    // hallmark_charge: "Hallmark Charge",
    // wastage_charge: "Wastage Charge",
    // other_charge: "Other Charges",
  };
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
  });

  const [file, setFile] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadSample = () => {
    window.location.href = " https://api.equi.co.in/api/download-sample-barcode";
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadStock = async () => {
    const token = getCookie("access_token"); // Retrieve the token
    const headers = {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    };

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", file); // Append file
    formDataToSend.append("brand_id", watch("brand_id")); // Append brand_id
    formDataToSend.append("purity_id", watch("purity_id")); // Append purity_id
    formDataToSend.append("item_id", watch("item_id")); // Append purity_id
    formDataToSend.append("barcode_no", watch("barcode_no")); // Append purity_id

    // Log FormData to verify
    formDataToSend.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const response = await axios.post(
        " https://api.equi.co.in/api/upload/barcode",
        formDataToSend,
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      console.log(formDataToSend);
      

      alert("Error uploading file");
    }
  };

  // Fetch data from API
  useEffect(() => {
    fetchDataproduct();
    fetchData();
    fetchBrands();
    fetchRate();
    barocdeCount();
  }, []); // Add dependencies if needed

  const fetchData = async () => {
    try {
      const response = await getBarcode(); // Pass any data you need to send as an argument
      console.log("API Response:", response); // Log the full response

      // Check if data exists and set it
      if (response && response.data) {
        setDataList(response.data); // Assuming response.data contains the desired data
      } else {
        console.error("No data found in the response.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data.");
    }
  };
  useEffect(() => {
    if (selectedRecord) {
      Object.keys(selectedRecord).forEach((key) =>
        setValue(key, selectedRecord[key] || "")
      );
    }
  }, [selectedRecord, setValue]);
  const fetchDataproduct = async () => {
    const token = getCookie("access_token"); // Retrieve the token
    const headers = {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    };
    try {
      // const response = await getProductService();
      const response = await axios.get(
        "https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Product",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems(response.data); // Assuming the API returns an array
      setLoading(false);
      console.log("Product data fetched successfully:", response.data);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };
  const fetchBrands = async () => {
    try {
      const response = await getcompany();
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const fetchRate = async () => {
    try {
      const response = await getRatemaster();
      setRate(response.data);
      console.log("ratemaster", response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Handle form submission for creating new data
  const handleCreate = async (data) => {
    try {
      const response = await createBarcode(data);
      if (response.status === 200) {
        alert("Data stored successfully!");
        setDataList([...dataList, response.data]);
        fetchData();
        barocdeCount()
        reset();
        setOpenCreateModal(false);
      }
    } catch (error) {
      console.error("Error storing data:", error);
      alert("Failed to store data.");
    }
  };

  //to get last barcode number

  useEffect(() => {
    const fetchNextBarcode = async () => {
      try {
        const response = await axios.get(
          " https://api.equi.co.in/api/next-barcode"
        );
        setSuffix(response.data.next_barcode_number.toString()); // Ensure suffix is a string
      } catch (error) {
        console.error("Error fetching next barcode:", error);
      }
    };

    fetchNextBarcode();
  }, []);

  // useEffect(() => {
  //   if (suffix !== "") {
  //     setBarcode(prefix + suffix); // Only update if suffix is available
  //   }
  // }, [prefix, suffix]);

  // Handle form submission for updating data
  const handleUpdate = async (data) => {
    console.log("Update data:", data); // Log the data being sent for update
   
    try {
      const response = await axios.put(
        ` https://api.equi.co.in/api/barcodes/${selectedRecord.id}`,
        data
      );
      if (response.status === 200) {
        alert("Data updated successfully!");
        const updatedList = dataList.map((item) =>
          item.id === selectedRecord.id ? { ...item, ...data } : item
        );
        setDataList(updatedList);
        reset();
        setOpenUpdateModal(false);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data.");
    }
  };

  //purity countByAuthenticatedUser

  const fetchPurity = async () => {
    const token = getCookie("access_token"); // Retrieve the token
    const headers = {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    };
    const response = await axios.get("https://api.equi.co.in/api/purity",{ headers });
    console.log("purity", response);

    setPurity(response.data);
    if (response.status !== 200) {
      alert("failed to fetch purity");
    }
  };
  const barocdeCount = async () => {
    const token = getCookie("access_token"); // Retrieve the token
    const headers = {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    };
    const response = await axios.get("https://api.equi.co.in/api/countByAuthenticatedUser",{ headers });
    console.log("setBarcodeCount", response);

   setBarcodeCount(response?.data?.barcode_count);
   
  };

  useEffect(() => {
    fetchPurity();
  }, []);

  // Handle record deletion
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        const response = await axios.get(
          ` https://api.equi.co.in/api/barcodes-delete/${id}`
        );
        if (response.status === 200) {
          alert("Data deleted successfully!");
          setDataList(dataList.filter((item) => item.id !== id));
          barocdeCount()
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Failed to delete data.");
      }
    }
  };

  // Open update modal and pre-fill data
  const openUpdateForm = (record) => {
    setSelectedRecord(record);
    Object.keys(record).forEach((key) => setValue(key, record[key]));
    setOpenUpdateModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="absolute top-26 right-4 flex items-center gap-2 px-6 py-2 text-white font-semibold 
                   bg-gradient-to-r from-blue-500 to-blue-700 rounded-full shadow-md 
                   hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transition-all duration-300"
      >
        <FaPlus size={20} className="text-white" />
        Click to Upload File
      </button>
      
      <h1 className="text-2xl font-bold mb-6">Barcode Data</h1>
      <h4 className="text-lg font-semibold mb-4">Total Count: {barcodeCount}</h4>

      {/* Add Data Button */}
      <button
        onClick={() => setOpenCreateModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Barcode Data
      </button>

      {/* Data Display Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-center">Barcode No</th>
            <th className="border px-4 py-2 text-center">SKU</th>
            <th className="border px-4 py-2 text-center">Item No</th>
            {/* <th className="border px-4 py-2">Barcode</th> */}
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2 text-center items-center mx-auto">{item.barcode_no}</td>
              <td className="border px-4 py-2 text-center">{item.sku}</td>
              <td className="border px-4 py-2 text-center">{item.itemno}</td>
              {/* <td className="border px-4 py-2 grid place-items-center"><Barcode displayValue={false} value={`${item.barcode_no}-${item.name}`} width={1} height={40} /></td> */}
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => openUpdateForm(item)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Modal */}
      <Modal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <h2 className="text-xl font-semibold text-green-500 mb-4">Add Barcode Data</h2>
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field} className="flex flex-col">
                {/* <label className="block text-gray-700 capitalize">
                {field.replace(/_/g, " ")} {field.includes("percent") ? "(%)" : ""}
                </label> */}
                <label className="block text-gray-700 capitalize">
          {fieldTitles[field] || field.replace(/_/g, " ")}
        </label>

                {/* Check if the field is "item_id" to render a select dropdown */}
                {field === "item_id" ? (
                  <select
                    {...register(field)}
                    className="border rounded w-full px-3 py-2"
                  >
                    <option value="">Select Product</option>
                    {item.map((items) => (
                      <option key={items.id} value={items.id}>
                        {items.name}
                      </option> // ✅ Added `key={items.id}`
                    ))}
                  </select>
                ) : field === "barcode_no" ? (
                  <div className="flex items-center border rounded-md overflow-hidden">
                  {/* Prefix Input (No Border) */}
                  <input
                    type="text"
                    placeholder="Enter barcode prefix"
                    {...register(field)}
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="px-4 py-2 w-2/3 focus:outline-none focus:ring-0 border-none"
                  />
                
                  {/* Slash Separator */}
                  <span className="px-2 text-gray-600 h-6">/</span>
                
                  {/* Read-only Suffix (No Border & Closer to Prefix) */}
                  <span className="px-4 py-2 bg-gray-100 text-gray-500">{suffix}</span>
                </div>
                
                
                ) : field === "purity_id" ? (
                  <select
                    {...register(field)}
                    className="border rounded w-full px-3 py-2"
                  >
                    <option value="">Select purity</option>
                    {purity?.map((pur) => (
                      <option key={pur.id} value={pur.id}>
                        {pur.name}
                      </option> // ✅ Added `key={pur.id}`
                    ))}
                  </select>
                ) : field === "brand_id" ? (
                  <select
                    {...register(field)}
                    className="border rounded w-full px-3 py-2"
                  >
                    <option value="">Select Purity</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...register(field)}
                    className="border rounded w-full px-3 py-2"

                    
                    // placeholder={`Enter ${field.replace("_", " ")}`}
                    placeholder={`Enter ${fieldTitles[field] || field.replace(/_/g, " ")}`}

                  />
                )}

                {errors[field] && (
                  <p className="text-red-500">{errors[field].message}</p>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
          >
            Save
          </button>
        </form>
      </Modal>

      {/* Update Modal */}
      <Modal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Update Barcode Data</h2>

        {/* Debugging - Log selected record to check data */}
        {console.log("Selected Record:", selectedRecord)}

        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field} className="flex flex-col">
                {/* <label className="block text-gray-700 capitalize">
                {field.replace(/_/g, " ")} {field.includes("percent") ? "(%)" : ""}
                </label>                 */}
                 <label className="block text-gray-700 capitalize">
          {fieldTitles[field] || field.replace(/_/g, " ")}
        </label>

                {/* Conditionally Render Select Dropdowns */}
                {field === "item_id" ? (
                  <select
                    {...register(field)}
                    defaultValue={selectedRecord?.[field] || ""}
                    className="border rounded w-full px-3 py-2"
                  >
                    <option value="">Select Item</option>
                    {item.length > 0 ? (
                      item.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Items Available</option>
                    )}
                  </select>
                ) : field === "purity_id" ? (
                  <select
                    {...register(field)}
                    className="border rounded w-full px-3 py-2"
                  >
                    <option value="">Select purity</option>
                    {purity?.map((pur) => (
                      <option key={pur.id} value={pur.id}>
                        {pur.name}
                      </option> // ✅ Added `key={pur.id}`
                    ))}
                  </select>
                ) : field === "brand_id" ? (
                  <select
                    {...register(field)}
                    defaultValue={selectedRecord?.[field] || ""}
                    className="border rounded w-full px-3 py-2"
                  >
                    <option value="">Select Brand</option>
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Brands Available</option>
                    )}
                  </select>
                ) : (
                  <input
                    {...register(field)}
                    defaultValue={selectedRecord?.[field] || ""}
                    className="border rounded w-full px-3 py-2"
                    // placeholder={`Enter ${field.replace("_", " ")}`}
                    placeholder={`Enter ${fieldTitles[field] || field.replace(/_/g, " ")}`}
                  />
                )}

                {/* Display Validation Errors */}
                {errors[field] && (
                  <p className="text-red-500">{errors[field].message}</p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Update
          </button>
        </form>
      </Modal>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} center>
        <div className="p-6 w-96 flex flex-col items-center bg-white shadow-lg rounded-lg">
          {/* File Upload Section */}
          <div className="w-full flex flex-col items-center p-4 bg-gray-100 rounded-lg">
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-2 border p-2 rounded w-full"
            />
            <button
              onClick={uploadStock}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition"
            >
              Upload
            </button>
          </div>

          {/* Divider */}
          <div className="my-4 w-full border-t"></div>

          {/* Sample Download Section */}
          <div className="w-full flex flex-col items-center p-4 bg-gray-100 rounded-lg">
            <button
              onClick={handleDownloadSample}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Download Sample
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BarcodeData;
