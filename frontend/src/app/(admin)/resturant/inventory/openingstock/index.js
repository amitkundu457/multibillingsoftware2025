
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Page = () => {
  const [manualForm, setManualForm] = useState({
    product_service_id: "",
    quantity: "",
    source: "",
    remarks: "",
  });
  const [csvFile, setCsvFile] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [producstList, setProductList] = useState([]);
  //token

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
  // /api/product-service-saloon?pro_ser_type=Product
  useEffect(() => {
    fetchStocks();
    featchProductsList();
  }, [csvFile]);

  const featchProductsList = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/product-service-saloon?pro_ser_type=Product",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProductList(res?.data);
      console.log("Fetched products:", res);
    } catch (error) {
      console.error("Fetch products failed:", error);
    }
  };

  const fetchStocks = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/stock-List", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched stocks:", res);
      setStocks(res.data.data || []);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const handleManualChange = (e) => {
    setManualForm({ ...manualForm, [e.target.name]: e.target.value });
  };

  const handleManualSubmit = async (e) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    console.log("manualForm", manualForm);
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/stock/add", manualForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStocks();
      toast.success("Stock added successfully");
      setManualForm({
        product_service_id: "",
        quantity: "",
        source: "",
        remarks: "",
      });
    } catch (err) {
      toast.error("Stock upload failed");
      console.error("Manual upload failed:", err);
    }
    setLoading(false);
  };

  const handleCsvChange = (e) => {
    
    setCsvFile(e.target.files[0]);
  }


  const handleCsvUpload = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
  
    if (!csvFile) {
      toast.error("No file selected");
      return;
    }
  
    // Optional: Check if file size is zero (empty file)
    if (csvFile.size === 0) {
      toast.error("Selected file is empty");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", csvFile);
    setLoading(true);
  
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/bulk-upload-stock", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("CSV uploaded successfully", res);
      fetchStocks();
      toast.success("CSV uploaded successfully");
      setCsvFile(null);  // clear selected file after success
    } catch (err) {
      toast.error("Stock upload failed");
      console.error("CSV upload failed:", err);
    }
    setLoading(false);
  };
  
  const handleEdit = async (id, updatedStock) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      await axios.put(`/api/stock/${id}`, updatedStock, {
       
          headers: { Authorization: `Bearer ${token}` },
     
      });
      fetchStocks();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    if (!confirm("Are you sure to delete this stock record?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete-stock/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      fetchStocks();
      toast.success("Stock deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
      console.error("Delete failed:", err);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = `product_service_id,quantity,source,remarks\n1,10,supplier,Restocked\n2,5,manual,Manual entry`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "sample_stock_upload.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const paginatedStocks = stocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(stocks.length / itemsPerPage);

  return (
    <div className=" w-full p-6  mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stock Manager</h1>

      {/* Manual Add Form */}
      <form
        onSubmit={handleManualSubmit}
        className="bg-white  p-4 flex justify-between  rounded mb-6"
      >
        {/* <h2 className="text-xl font-semibold mb-3">Manual Add</h2> */}
        <div className="flex w-[90%]  gap-3">
          <div>
            <label className="block mb-1">Product</label>
          <select
            name="product_service_id"
            placeholder="Product ID"
            value={manualForm.product_service_id}
            onChange={handleManualChange}
            className=" rounded p-1"
          >
            <option value="">Select Product</option>
            {producstList.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name} {"Id:"} {item.id}
              </option>
            ))}
          </select>

          </div>
          <div>
            <label className="block mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={manualForm.quantity}
            onChange={handleManualChange}
            className="border p-1 rounded"
          />
          </div>
         <div>
            <label className="block mb-1">Source</label>
         <input
            type="text"
            name="source"
            placeholder="Source"
            value={manualForm.source}
            onChange={handleManualChange}
            className="border p-1 rounded"
          />
         </div>
         <div>
          <label className="block mb-1">Remarks</label>
         <input
            type="text"
            name="remarks"
            placeholder="Remarks"
            value={manualForm.remarks}
            onChange={handleManualChange}
            className="border p-1 rounded"
          />
         </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-green-500 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Stock"}
        </button>
      </form>

      {/* CSV Upload */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">Bulk Upload (CSV)</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvChange}
          className="mb-3 cursor-pointer"
        />
        <div className="flex gap-3">
          <button
            onClick={handleCsvUpload}
            // disabled={loading || !csvFile}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700"
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
          <button
            onClick={handleDownloadSample}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Download Sample CSV
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
  {/* Title outside the table */}
  <h2 className="text-xl font-semibold mb-3">All Stock Records</h2>

  {/* Table */}
  <table className="min-w-full w-full text-sm text-left border border-gray-300 border-collapse">
    <thead className="bg-gray-200">
      <tr>
        <th className="px-4 py-2 border">#</th>
        <th className="px-4 py-2 border">Product ID</th>
        <th className="px-4 py-2 border">Quantity</th>
        <th className="px-4 py-2 border">Source</th>
        <th className="px-4 py-2 border">Remarks</th>
        <th className="px-4 py-2 border">Date</th>
        <th className="px-4 py-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {paginatedStocks.length > 0 ? (
        paginatedStocks.map((item, index) => (
          <tr key={item.id} className="border-t">
            <td className="px-4 py-2 border">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </td>
            <td className="px-4 py-2 border">{item?.product?.name}</td>
            <td className="px-4 py-2 border">{item.quantity}</td>
            <td className="px-4 py-2 border">{item.source}</td>
            <td className="px-4 py-2 border">{item.remarks}</td>
            <td className="px-4 py-2 border">
              {new Date(item.created_at).toLocaleString()}
            </td>
            <td className="px-4 py-2 border">
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center py-4 text-gray-500">
            No stock records found.
          </td>
        </tr>
      )}
    </tbody>
  </table>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="mt-4 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 border rounded ${
            currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )}
</div>

    </div>
  );
};

export default Page;
