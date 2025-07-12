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

function Page() {
  // <-- Capitalize "Page"
  const { data, isLoading, createPurchase } = usePurchase();

  const [billAmount, setBillAmount] = useState(0);
  const [modal, setModal] = useState(false);
  const[supplierlist, setSupplierlist] = useState([]);

  const [file, setFile] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [deleteModel, setDeleteModel] = useState(false);

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








  const handleDeleteAllPurchase = async () => {
    const response = await axios.delete(
      "http://127.0.0.1:8000/api/delete-all-purchase"
    );
    if (response.status === 200) {
      alert(response.data.message); // Show success message
      setDeleteModel(false);
      console.log(response);
    } else {
      alert("No records found to delete ");
    }
  };

  const supplierList = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    const response = await axios.get("http://127.0.0.1:8000/api/suppliers",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("response", response?.data);
    setSupplierlist(response?.data);
  };

  useEffect(() => {
    supplierList();
  }, []);

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
    fileFormData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      // Log FormData

      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload/purchase",
        fileFormData
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);

      alert("Error uploading file");
    }
  };

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (!isLoading) {
      setFormData({
        voucher_no: "PU" + (parseInt(data.purchaseCount) + 1),
      });
    }
  }, [isLoading, data]);

  const [pur, setPur] = useState({
    is_edit: false,
    product_name: "",
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
    if (formData.purchase_items) {
      const totalAmount = formData.purchase_items.reduce((sum, item) => {
        return sum + parseFloat(item.net_amount || 0); // Make sure net_amount is a number
      }, 0);

      setBillAmount(totalAmount.toFixed(2)); // Setting the final total amount
    }
  }, [formData.purchase_items]);

  const [errors, setErrors] = useState({});

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
        updatedData.taxable = calculateTaxable(updatedData); // Amount without GST
        updatedData.total_gst = calculateGst(updatedData); // GST amount
        updatedData.net_amount = calculateNetAmount(updatedData); // Amount with GST
      }

      return updatedData;
    });
  };

  const calculateTaxable = (data) => {
    const pcs = parseFloat(data.pcs) || 0;
    const nwt = parseFloat(data.nwt) || 0;
    const rate = parseFloat(data.rate) || 0;
    const otherChg = parseFloat(data.other_chg) || 0;
    const disc = parseFloat(data.disc) || 0;
    const discPercent = parseFloat(data.disc_percent) || 0;

    const baseAmount = pcs * nwt * rate; // Base amount
    const discount = baseAmount * (discPercent / 100) + disc; // Total discount
    const taxableAmount = baseAmount + otherChg - discount; // Taxable amount

    return taxableAmount.toFixed(2);
  };

  const calculateGst = (data) => {
    const gst = parseFloat(data.gst) || 0;
    const taxable = parseFloat(data.taxable) || 0;

    const gstAmount = (taxable * gst) / 100; // GST amount
    return gstAmount.toFixed(2);
  };

  const calculateNetAmount = (data) => {
    const taxable = parseFloat(data.taxable) || 0;
    const totalGst = parseFloat(data.total_gst) || 0;

    const netAmount = taxable + totalGst;
    return netAmount.toFixed(2);
  };

  function addItem() {
    const validationErrors = {};

    if (!pur.product_name?.trim()) {
      validationErrors.product_name = "Product name is required";
    }

    // If there are validation errors, set errors and return early to prevent adding the item
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors state to show them
      return; // Prevent adding item if validation fails
    }
    setFormData((prev) => ({
      ...prev,
      purchase_items: [...(prev.purchase_items || []), pur],
    }));

    setPur({
      product_name: "",
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
  }

  function editItem(index) {
    const itemToEdit = formData.purchase_items[index];

    if (itemToEdit) {
      setPur({
        ...itemToEdit,
        is_edit: true,
      });
    } else {
      console.error(`No item found at index ${index}`);
    }
  }

  function deleteItem(index) {
    setFormData((prev) => ({
      ...prev,
      purchase_items: prev.purchase_items.filter((_, i) => i !== index),
    }));
  }

  function additional() {
    const totalAmount = formData.purchase_items.reduce((sum, item) => {
      return sum + parseFloat(item.net_amount || 0); // Make sure net_amount is a number
    }, 0);
    const discountPercent = parseFloat(formData.discount || 0);
    const creditNote = parseFloat(formData.credit_note || 0);
    const addition = parseFloat(formData.addition || 0);

    const discountedAmount =
      totalAmount - (totalAmount * discountPercent) / 100;
    const updatedBillAmount = discountedAmount - creditNote + addition;

    setBillAmount(updatedBillAmount.toFixed(2));
    setModal(false);
  }

  const handleSubmit = async (e) => {
    event.preventDefault();
    const validationErrors = await createPurchase(formData);
    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      setFormData({
        voucher_no: "",
        date: "",
        bill_no: "",
        is_igst: false,
        user_id: "",
        payment_mode: "cash",
        credit_days: 0,
        purchase_items: [],
        discount: 0,
        credit_note: 0,
        addition: 0,
      });
    }
  };
  return (
    <div className="absolute left-0 top-0 w-full bg-white h-full">
      {/* //plus button to click model */}
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="absolute top-36 right-4 flex items-center gap-2 px-2 py-2 text-white font-semibold 
             bg-gradient-to-r from-blue-500 to-blue-700 rounded-full shadow-md 
             hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transition-all duration-300"
      >
        <FaPlus size={20} className="text-white" />
        Click to Upload File
      </button>
      <button
        onClick={() => {
          setDeleteModel(true);
        }}
        className="absolute top-38 right-6 flex items-center gap-2 px-2 py-2 text-white font-semibold 
             bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-md 
             hover:from-red-600 hover:to-red-800 hover:shadow-lg transition-all duration-300"
      >
        <FaTimes size={20} className="text-white" />
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
        <Link href="/admin" className="flex items-center text-sm gap-2">
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
            href="/admin/inventory/purchase/report"
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
            className="bg-green-500 flex flex-col text-sm items-center p-2 rounded text-white"
          >
            <FaPercentage />
            <span>Disc</span>
          </button>
          <div className="flex items-center text-white p-3 bg-orange-500 rounded">
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
            <button className="pl-3">
              <MdDownload size={26} />
            </button>
          </div>
        </div>
        <div className="w-[8%] flex items-end text-sm gap-1 p-1">
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
        </div>
        <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
          <label htmlFor="">Supplier List</label>
          <div className="w-full flex gap-2">
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="form-select w-full text-sm rounded"
            >
              <option value="">-- Select Supplier --</option>
              <option value="1">Rahul Kumar....</option>
              <option value="2">Amir</option>
            </select>
            {/* <Link href={"#"}>
              <FaUserPlus size={24} />
            </Link> */}
          </div>
        </div>
        <div className="w-1/5 flex flex-col text-sm gap-1 p-1">
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
          <select
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
          <label htmlFor="">Rate</label>
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
              <th className="text-sm font-medium bg-gray-300 py-3">Rate</th>
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
            {formData.purchase_items &&
              formData.purchase_items.map((pr, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    {pr.product_name}
                  </td>
                  <td className="px-3 py-2 text-sm text-center border-x border-b border-gray-300">
                    <p>Qty: {pr.pcs}</p>
                    <p>Gwt: {pr.gwt}</p>
                    <p>Nwt: {pr.nwt}</p>
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
                      <button
                        onClick={() => editItem(i)}
                        className="text-blue-500"
                      >
                        <FaPencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

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

      <Modal open={deleteModel} onClose={() => setDeleteModel(false)} center>
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
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
