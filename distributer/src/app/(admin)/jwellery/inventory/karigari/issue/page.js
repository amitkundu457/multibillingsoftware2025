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
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const params = useSearchParams();
  const id = params.get('id');
  const { isLoading, data, error, createKarigari, updateKarigari, getKarigariById } = useKarigari();

  const [formData, setFormData] = useState({
    voucher_no: "",
    date: "",
    user_id: "",
    type: "",
    karigari_items: [],
  });

  const [pro, setPro] = useState({
    is_edit: false,
    product_name: "",
    nwt: 0,
    tounch: 0,
    rate: 0,
  });

  const [errors, setErrors] = useState({});

  // Consolidated useEffect for both cases: editing and creating
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          let kgii = await getKarigariById(id);
          setFormData((prev) => ({
            ...prev,
            voucher_no: kgii.voucher_no || "",
            date: kgii.date || "",
            user_id: kgii.user_id || "",
            type: kgii.type || "",
            karigari_items: kgii.karigari_items || [],
          }));
        } catch (error) {
          console.error("Error fetching Karigari data:", error);
        }
      } else if (!isLoading && data) {
        setFormData((prev) => ({
          ...prev,
          voucher_no: `KI${parseInt(data.issueCount) + 1}`,
          type: "issue",
        }));
      }
    };

    fetchData();
  }, [id, isLoading, data, getKarigariById]);

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

  const handleProChange = (e) => {
    const { name, value } = e.target;

    setPro((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addItem = () => {
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
  };

  const deleteItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      karigari_items: prev.karigari_items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = '';
    if (id) {
      validationErrors = await updateKarigari(formData, id);
    } else {
      validationErrors = await createKarigari(formData);
    }
    if (validationErrors) {
      console.log(validationErrors);
      setErrors(validationErrors);
    } else {
      setFormData({
        voucher_no: "",
        date: "",
        user_id: "",
        type: "issue",
        karigari_items: [],
      });
    }
  };

  return (
    <div className="absolute left-0 top-0 w-full bg-white h-full">
      <div className="w-full flex p-3 px-6 bg-green-500 text-white">
        <p className="flex-1 text-center font-semibold">Stock Issue</p>
        <Link
          href="/jwellery/inventory/karigari"
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
        {/* Form content */}
      </div>
      <div className="flex flex-col gap-1 p-2">
        {formData.karigari_items?.map((kgi, i) => (
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
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
