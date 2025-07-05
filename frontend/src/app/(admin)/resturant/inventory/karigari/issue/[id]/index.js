"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaRupeeSign,
  FaSave,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useKarigari } from "@/app/hooks/karigari";
import { FaArrowRotateRight } from "react-icons/fa6";
import { useRouter } from "next/router";
// import { useState } from "react";
import axios from "axios";

function Page() {
  const [karigarList, setkarigarList] = useState([]);

  const {
    isLoading,
    data,
    error,
    getKarigariById,
    updateKarigari,
    createKarigari,
  } = useKarigari();
  const [formData, setFormData] = useState({
    voucher_no: "",
    date: "",
    // user_id: ,
    type: "",
    karigari_items: [],
  });

  const router = useRouter();
  const { id } = router.query;
  console.log("karigri id",id)

  //fetch karigar_List

  async function KarigarListName() {
    try {
      const response = await axios.get("https://api.equi.co.in/api/karigar-list");
      // const data = await response.json();

      console.log("listofkarigir", response);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  }

  useEffect(()=>{
    KarigarListName()
  },[])

  // Fetch existing data when component mounts or `id`, `data`, or `isLoading` changes
  useEffect(() => {
    // KarigarListName();
    const fetchData = async () => {
      if (id && !data && !isLoading) {
        try {
          const kg = await getKarigariById(id);
          console.log(kg);
          setFormData((prevFormData) => ({
            ...prevFormData,
            voucher_no: kg.voucher_no,
            date: kg.date,
            type: "issue",
            karigari_items: kg.karigari_items,
          }));
        } catch (error) {
          console.error("Error fetching karigari:", error);
        }
      }
    };
    fetchData();
  }, [id, data, isLoading]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Simply update the value for the corresponding name
    }));
  };

  const [pro, setPro] = useState({
    is_edit: false,
    product_name: "",
    nwt: 0,
    tounch: 0,
    rate: 0,
  });

  // Handle changes for product-related fields
  const handleProChange = (e) => {
    const { name, value } = e.target;
    setPro((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add item to the formData's karigari_items array
  function addItem() {
    const validationErrors = {};

    if (!pro.product_name?.trim()) {
      validationErrors.product_name = "Product name is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      karigari_items: [...(prev.karigari_items || []), pro],
    }));

    setPro({
      is_edit: false,
      product_name: "",
      nwt: 0,
      tounch: 0,
      rate: 0,
    });
  }

  // Delete item from karigari_items
  function deleteItem(index) {
    setFormData((prev) => ({
      ...prev,
      karigari_items: prev.karigari_items.filter((_, i) => i !== index),
    }));
  }

  const [errors, setErrors] = useState({});

  // Handle form submission (either creating or updating Karigari)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure correct payload is passed
      const payload = {
        ...formData,
        karigari_items: formData.karigari_items, // Ensure items are part of the payload
      };
      let result;
      if (id) {
        // If an ID is present, update existing Karigari
        result = await updateKarigari(id, payload); // Assuming createKarigari takes an ID for updating
      } else {
        // Otherwise, create a new Karigari
        result = await createKarigari(payload); // Assuming createKarigari works for new records
      }

      if (result && result.errors) {
        setErrors(result.errors); // Handle validation errors
      } else {
        setFormData({
          voucher_no: "",
          date: "",
          karigari_items: [],
        });
        // Optionally redirect after successful submission
        router.push("/admin/inventory/karigari");
      }
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  return (
    <div className="absolute left-0 top-0 w-full bg-white h-full">
      <div className="w-full flex p-3 px-6 bg-green-500 text-white">
        <p className="flex-1 text-center font-semibold">Stock Issue</p>
        <Link
          href="/admin/inventory/karigari"
          className="flex items-center text-sm gap-2"
        >
          <FaTimes />
        </Link>
      </div>
      <div className="flex py-3 px-3">
        <button className="text-sm px-4 flex flex-col items-center gap-1">
          <FaArrowRotateRight size={24} className="text-blue-700" />
          <span>Refresh</span>
        </button>
        <button
          onClick={handleSubmit}
          className="text-sm px-4 flex flex-col items-center gap-1"
        >
          <FaSave size={24} className="text-blue-700" />
          <span>Save</span>
        </button>
      </div>
      <div className="flex flex-wrap px-6 py-1">
        <div className="w-full mb-4">
          <label className="text-sm font-semibold">Voucher No:</label>
          <input
            type="text"
            name="voucher_no"
            value={formData.voucher_no}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled
          />
        </div>
        <div className="w-full mb-4">
          <label className="text-sm font-semibold">Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 p-2">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h1>Add Product</h1>
            {pro.is_edit && (
              <button onClick={addItem} className="text-blue-600">
                <FaPlus />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              name="product_name"
              value={pro.product_name}
              onChange={handleProChange}
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Product Name"
            />
            <input
              type="number"
              name="nwt"
              value={pro.nwt}
              onChange={handleProChange}
              className="p-2 border border-gray-300 rounded-md"
              placeholder="NWT"
            />
            <input
              type="number"
              name="tounch"
              value={pro.tounch}
              onChange={handleProChange}
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Touch"
            />
            <input
              type="number"
              name="rate"
              value={pro.rate}
              onChange={handleProChange}
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Rate"
            />
          </div>
        </div>

        {formData.karigari_items &&
          formData.karigari_items.map((kgi, i) => (
            <div
              key={i}
              className="p-3 px-4 shadow-xl border border-gray-300 rounded space-y-2"
            >
              <div className="flex justify-between items-center">
                <h1>{kgi.product_name}</h1>
                <button
                  type="button"
                  onClick={() => deleteItem(i)}
                  className="text-red-500"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  {kgi.nwt} | {kgi.tounch}
                </span>
                <p className="flex items-center gap-1">
                  <FaRupeeSign className="text-green-500" />
                  <span>{kgi.rate || 0}</span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Page;
