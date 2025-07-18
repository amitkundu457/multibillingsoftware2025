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
import axios from "axios";

const Page = () => {
  const params = useSearchParams();
  const [karigarList, setkarigarList] = useState([]);
  const id = params.get("id");

  const {
    isLoading,
    data,
    error,
    createKarigari,
    updateKarigari,
    getKarigariById,
  } = useKarigari();

  const [formData, setFormData] = useState({
    voucher_no: "",
    date: "",
    user_id: "",
    type: "",
    karigarlist_id: "",
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
  const [token, setToken] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  useEffect(() => {
    const tkn = getCookie("access_token");
    if (!tkn) {
      console.error("Authentication token not found!");
    }
    setToken(tkn);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchKarigarList = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/karigar-list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setkarigarList(response.data);
      } catch (error) {
        console.error("Error fetching karigariList:", error);
      }
    };

    fetchKarigarList();
  }, [token]);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const kgii = await getKarigariById(id);
          setFormData((prev) => ({
            ...prev,
            voucher_no: kgii.voucher_no || "",
            date: kgii.date || "",
            user_id: kgii.user_id || "",
            karigarlist_id: kgii.karigarlist_id || "",
            type: kgii.type || "",
            karigari_items: kgii.karigari_items || [],
          }));
        } catch (error) {
          console.error("Error fetching Karigari data:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (!id && !isLoading && data) {
      setFormData((prev) => ({
        ...prev,
        voucher_no: `KI${parseInt(data.issueCount) + 1}`,
        type: "issue",
      }));
    }
  }, [id, isLoading, data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "karigarlist_id"
          ? Number(value)
          : type === "checkbox"
          ? checked
          : value,
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
      karigari_items: [
        ...(prev.karigari_items || []),
        {
          ...pro,
          karigarlist_id: formData.karigarlist_id,
        },
      ],
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
    let validationErrors = "";

    if (id) {
      validationErrors = await updateKarigari(id, formData);
    } else {
      validationErrors = await createKarigari(formData);
    }

    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      setFormData({
        voucher_no: "",
        date: "",
        user_id: "",
        type: "issue",
        karigarlist_id: "",
        karigari_items: [],
      });
    }
  };

  if (!token) {
    return (
      <div className="p-4 text-red-600 text-center">
        Authentication token not found!
      </div>
    );
  }

  // return (
  //   <div className="absolute left-0 top-0 w-full bg-white h-full">
  //     {/* rest of the UI code... */}
  //   </div>
  // );

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
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Voucher No.</label>
          <input
            type="text"
            name="voucher_no"
            value={formData.voucher_no}
            onChange={handleChange}
            className="form-input text-sm rounded"
          />
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input text-sm rounded"
          />
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Karigar List</label>
          <select
            name="karigarlist_id"
            value={formData.karigarlist_id}
            onChange={handleChange}
            className="form-select text-sm rounded"
          >
            <option value="">-- Select Karigar --</option>
            {karigarList.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full" />
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Product</label>
          <select
            name="product_name"
            value={pro.product_name}
            onChange={handleProChange}
            className="form-select text-sm rounded"
          >
            <option value="">-- Select Product --</option>
            {!isLoading &&
              data?.productServices?.map((prs, i) => (
                <option key={i} value={prs.name}>
                  {prs.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Nwt</label>
          <input
            type="number"
            name="nwt"
            value={pro.nwt}
            onChange={handleProChange}
            className="form-input text-sm rounded"
            placeholder="nwt"
          />
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Tounch</label>
          <input
            type="number"
            name="tounch"
            value={pro.tounch}
            onChange={handleProChange}
            className="form-input text-sm rounded"
            placeholder="tounch"
          />
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Rate</label>
          <input
            type="number"
            name="rate"
            value={pro.rate}
            onChange={handleProChange}
            className="form-input text-sm rounded"
            placeholder="rate"
          />
        </div>
        <div className="flex items-end p-2 w-1/5">
          <button
            onClick={addItem}
            className="text-sm bg-green-500 text-white py-2 px-6 rounded"
          >
            <FaPlus />
          </button>
        </div>
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

export default Page;

//
{
  /* <div className="absolute left-0 top-0 w-full bg-white h-full">
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
         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
           <label htmlFor="">Voucher No.</label>
           <input
             type="text"
             name="voucher_no"
             value={formData.voucher_no}
             onChange={handleChange}
             className="form-input text-sm rounded"
           />
         </div>
         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
           <label htmlFor="">Date</label>
           <input
             type="date"
             name="date"
             value={formData.date}
             onChange={handleChange}
             className="form-input text-sm rounded"
           />
         </div>
         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
           <label htmlFor="">Karigar List</label>
           <select
           name="karigarlist_id"
           // value={formData.user_id}
           value={formData.karigarlist_id}
           onChange={handleChange}
           className="form-select text-sm rounded"
         >
           <option value="">-- Select Karigar --</option>
           {
               karigarList.map((list)=>(
                 <option key={list.id} value={list.id}>{list.name}</option>
 
               ))
             }
             
             
           </select>
         </div>
         <div className="w-full" />
         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
           <label htmlFor="">Product</label>
           <select
             name="product_name"
             value={pro.product_name}
             onChange={handleProChange}
             className="form-select text-sm rounded"
           >
             <option value="">-- Select Product --</option>
             {!isLoading &&
               data?.productServices?.map((prs, i) => (
                 <option key={i} value={prs.name}>
                   {prs.name}
                 </option>
               ))}
           </select>
         </div>
         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
           <label htmlFor="">Nwt</label>
           <input
             type="number"
             name="nwt"
             value={pro.nwt}
             onChange={handleProChange}
             className="form-input text-sm rounded"
             placeholder="nwt"
           />
         </div>
         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
           <label htmlFor="">Tounch</label>
           <input
             type="number"
             name="tounch"
             value={pro.tounch}
             onChange={handleProChange}
             className="form-input text-sm rounded"
             placeholder="tounch"
           />
         </div>
         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
           <label htmlFor="">Rate</label>
           <input
             type="number"
             name="rate"
             value={pro.rate}
             onChange={handleProChange}
             className="form-input text-sm rounded"
             placeholder="rate"
           />
         </div>
         <div className="flex items-end p-2 w-1/5">
           <button
             onClick={addItem}
             className="text-sm bg-green-500 text-white py-2 px-6 rounded"
           >
             <FaPlus />
           </button>
         </div>
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
  } */
}
