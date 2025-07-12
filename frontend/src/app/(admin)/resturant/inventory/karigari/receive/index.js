"use client";
import { useKarigari } from "@/app/hooks/karigari";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { FaEdit, FaPlus, FaRupeeSign, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";

// Notyf needs to be imported properly if used
import { Notyf } from "notyf";
const notyf = new Notyf();

function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    isLoading,
    data,
    error,
    createKarigari,
    getKarigariById,
    updateKarigari,
  } = useKarigari();

  const [karigarList, setkarigarList] = useState([]);

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
    pcs: 0,
    tounch: 0,
    rate: 0,
  });

  const [errors, setErrors] = useState({});

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const token = getCookie("access_token");

  useEffect(() => {
    if (!token) {
      notyf.error("Authentication token not found!");
    }
  }, [token]);

  const fetchKarigariData = useCallback(async () => {
    if (!token) return;

    if (id) {
      try {
        const kgii = await getKarigariById(id);
        setFormData((prev) => ({
          ...prev,
          voucher_no: kgii.voucher_no || "",
          date: kgii.date || "",
          user_id: kgii.user_id || "",
          type: kgii.type || "",
          karigarlist_id: kgii.karigarlist_id || "",
          karigari_items: kgii.karigari_items || [],
        }));
      } catch (err) {
        console.error("Error fetching Karigari data:", err);
      }
    } else if (!isLoading && data) {
      setFormData((prev) => ({
        ...prev,
        voucher_no: "KR" + (parseInt(data.receiveCount) + 1),
        type: "received",
      }));
    }
  }, [id, isLoading, data, getKarigariById, token]);

  useEffect(() => {
    fetchKarigariData();
  }, [fetchKarigariData]);

  const KarigarListName = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/karigar-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setkarigarList(response.data);
    } catch (error) {
      console.error("Error fetching karigariList:", error);
    }
  };

  useEffect(() => {
    KarigarListName();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "karigarlist_id" ? Number(value) : type === "checkbox" ? checked : value,
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
      pcs: 0,
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

  const handleSubmit = async () => {
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }

    let validationErrors = "";
    if (id) {
      validationErrors = await updateKarigari(id, formData);
    } else {
      validationErrors = await createKarigari(formData);
    }

    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      notyf.success("Karigari saved successfully");
      setFormData({
        voucher_no: "",
        date: "",
        user_id: "",
        type: "",
        karigarlist_id: "",
        karigari_items: [],
      });
    }
  };

  return (
    <div className="absolute left-0 top-0 w-full bg-white h-full">
      <div className="w-full flex p-3 px-6 bg-green-500 text-white">
        <p className="flex-1 text-center font-semibold">Stock Receive</p>
        <Link href="/admin/inventory/karigari" className="flex items-center text-sm gap-2">
          <FaTimes />
        </Link>
      </div>

      <div className="flex py-3 px-3">
        <button className="text-sm px-4 flex flex-col items-center gap-1">
          <FaArrowRotateRight size={24} className="text-blue-700" />
          <span>Refresh</span>
        </button>
        <button onClick={handleSubmit} className="text-sm px-4 flex flex-col items-center gap-1">
          <FaSave size={24} className="text-blue-700" />
          <span>Save</span>
        </button>
      </div>

      <div className="flex flex-wrap px-6 py-1">
        {/* Form Inputs */}
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label>Voucher No.</label>
          <input
            type="text"
            name="voucher_no"
            value={formData.voucher_no}
            onChange={handleChange}
            className="form-input text-sm rounded"
          />
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input text-sm rounded"
          />
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label>Karigar List</label>
          <select
            name="karigarlist_id"
            value={formData.karigarlist_id}
            onChange={handleChange}
            className="form-select text-sm rounded"
          >
            <option value=""> ---Karigar List---</option>
            {karigarList.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add item form */}
        <div className="w-full"></div>
        <div className="flex flex-col w-1/6 gap-2 p-2 text-sm">
          <label>Product</label>
          <select
            name="product_name"
            value={pro.product_name}
            onChange={handleProChange}
            className="form-select text-sm rounded"
          >
            <option value="">-- Select Product --</option>
            {!isLoading &&
              data.productServices.map((prs, i) => (
                <option key={i} value={prs.name}>
                  {prs.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col w-1/6 gap-2 p-2 text-sm">
          <label>Nwt</label>
          <input
            type="number"
            name="nwt"
            value={pro.nwt}
            onChange={handleProChange}
            className="form-input text-sm rounded"
          />
        </div>
        <div className="flex flex-col w-1/6 gap-2 p-2 text-sm">
          <label>Pcs</label>
          <input
            type="number"
            name="pcs"
            value={pro.pcs}
            onChange={handleProChange}
            className="form-input text-sm rounded"
          />
        </div>
        <div className="flex flex-col w-1/6 gap-2 p-2 text-sm">
          <label>Tounch</label>
          <input
            type="number"
            name="tounch"
            value={pro.tounch}
            onChange={handleProChange}
            className="form-input text-sm rounded"
          />
        </div>
        <div className="flex flex-col w-1/6 gap-2 p-2 text-sm">
          <label>Rate</label>
          <input
            type="number"
            name="rate"
            value={pro.rate}
            onChange={handleProChange}
            className="form-input text-sm rounded"
          />
        </div>
        <div className="flex items-end p-2 w-1/6">
          <button onClick={addItem} className="text-sm bg-green-500 text-white px-4 py-2 rounded">
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;

//    "use client";

// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import axios from "axios";
// import { Notyf } from "notyf";
// import {
//   FaEdit,
//   FaPlus,
//   FaRupeeSign,
//   FaSave,
//   FaTimes,
//   FaTrash,
// } from "react-icons/fa";
// import { FaArrowRotateRight } from "react-icons/fa6";
// import { useKarigari } from "@/app/hooks/karigari";

// const notyf = new Notyf();

// function Page() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   const {
//     isLoading,
//     data,
//     error,
//     createKarigari,
//     getKarigariById,
//     updateKarigari,
//   } = useKarigari();

//   const [karigarList, setKarigarList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     voucher_no: "",
//     date: "",
//     user_id: "",
//     type: "received",
//     karigarlist_id: "",
//     karigari_items: [],
//   });

//   const [pro, setPro] = useState({
//     is_edit: false,
//     product_name: "",
//     nwt: 0,
//     pcs: 0,
//     tounch: 0,
//     rate: 0,
//   });

//   const token = useMemo(() => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; access_token=`);
//     return parts.length === 2
//       ? decodeURIComponent(parts.pop().split(";").shift())
//       : null;
//   }, []);

//   useEffect(() => {
//     if (!token) notyf.error("Authentication token not found!");
//   }, [token]);

//   const fetchKarigariData = useCallback(async () => {
//     if (!token) return;

//     try {
//       if (id) {
//         const kgii = await getKarigariById(id);
//         setFormData({
//           voucher_no: kgii.voucher_no || "",
//           date: kgii.date || "",
//           user_id: kgii.user_id || "",
//           type: kgii.type || "received",
//           karigarlist_id: kgii.karigarlist_id || "",
//           karigari_items: kgii.karigari_items || [],
//         });
//       } else if (!isLoading && data?.receiveCount != null) {
//         setFormData((prev) => ({
//           ...prev,
//           voucher_no: `KR${parseInt(data.receiveCount) + 1}`,
//         }));
//       }
//     } catch (err) {
//       console.error("Error fetching Karigari data:", err);
//     }
//   }, [id, isLoading, data, getKarigariById, token]);

//   useEffect(() => {
//     fetchKarigariData();
//   }, [fetchKarigariData]);

//   const loadKarigarList = useCallback(async () => {
//     if (!token) return;
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8000/api/karigar-list",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setKarigarList(response.data || []);
//     } catch (err) {
//       console.error("Error loading Karigar list:", err);
//     }
//   }, [token]);

//   useEffect(() => {
//     loadKarigarList();
//   }, [loadKarigarList]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val =
//       name === "karigarlist_id"
//         ? Number(value)
//         : type === "checkbox"
//         ? checked
//         : value;

//     setFormData((prev) => ({ ...prev, [name]: val }));
//     setErrors((prev) => ({ ...prev, [name]: null }));
//   };

//   const handleProChange = (e) => {
//     const { name, value } = e.target;
//     setPro((prev) => ({ ...prev, [name]: value }));
//   };

//   const addItem = () => {
//     const validationErrors = {};
//     if (!pro.product_name.trim()) {
//       validationErrors.product_name = "Product name is required";
//     }

//     if (Object.keys(validationErrors).length) {
//       setErrors(validationErrors);
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       karigari_items: [
//         ...prev.karigari_items,
//         { ...pro, karigarlist_id: formData.karigarlist_id },
//       ],
//     }));

//     setPro({ is_edit: false, product_name: "", nwt: 0, pcs: 0, tounch: 0, rate: 0 });
//   };

//   const deleteItem = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       karigari_items: prev.karigari_items.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!token) {
//       notyf.error("Authentication token not found!");
//       return;
//     }

//     const validationErrors = id
//       ? await updateKarigari(id, formData)
//       : await createKarigari(formData);

//     if (validationErrors) {
//       setErrors(validationErrors);
//     } else {
//       notyf.success("Karigari saved successfully");
//       setFormData({
//         voucher_no: "",
//         date: "",
//         user_id: "",
//         type: "received",
//         karigarlist_id: "",
//         karigari_items: [],
//       });
//     }
//   };

//   return (
//     <div className="absolute left-0 top-0 w-full h-full bg-white">
//       <div className="w-full flex p-3 px-6 bg-green-500 text-white">
//         <p className="flex-1 text-center font-semibold">Stock Receive</p>
//         <Link href="/admin/inventory/karigari" className="flex items-center text-sm gap-2">
//           <FaTimes />
//         </Link>
//       </div>

//       <div className="flex py-3 px-3">
//         <button className="text-sm px-4 flex flex-col items-center gap-1">
//           <FaArrowRotateRight size={24} className="text-blue-700" />
//           <span>Refresh</span>
//         </button>
//         <button onClick={handleSubmit} className="text-sm px-4 flex flex-col items-center gap-1">
//           <FaSave size={24} className="text-blue-700" />
//           <span>Save</span>
//         </button>
//       </div>

//       <div className="flex flex-wrap px-6 py-1">
//         {[
//           { label: "Voucher No.", name: "voucher_no", type: "text" },
//           { label: "Date", name: "date", type: "date" },
//         ].map(({ label, name, type }) => (
//           <div className="flex flex-col w-1/5 gap-2 p-2 text-sm" key={name}>
//             <label>{label}</label>
//             <input
//               type={type}
//               name={name}
//               value={formData[name]}
//               onChange={handleChange}
//               className="form-input text-sm rounded"
//             />
//           </div>
//         ))}

//         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
//           <label>Karigar List</label>
//           <select
//             name="karigarlist_id"
//             value={formData.karigarlist_id}
//             onChange={handleChange}
//             className="form-select text-sm rounded"
//           >
//             <option value=""> ---Karigar List---</option>
//             {karigarList.map((list) => (
//               <option key={list.id} value={list.id}>
//                 {list.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="w-full" />

//         {[
//           { label: "Product", name: "product_name", type: "select" },
//           { label: "Nwt", name: "nwt" },
//           { label: "Pcs", name: "pcs" },
//           { label: "Tounch", name: "tounch" },
//           { label: "Rate", name: "rate" },
//         ].map(({ label, name, type }) => (
//           <div className="flex flex-col w-1/6 gap-2 p-2 text-sm" key={name}>
//             <label>{label}</label>
//             {type === "select" ? (
//               <select
//                 name={name}
//                 value={pro[name]}
//                 onChange={handleProChange}
//                 className="form-select text-sm rounded"
//               >
//                 <option value="">-- Select Product --</option>
//                 {data?.productServices?.map((prs, i) => (
//                   <option key={i} value={prs.name}>
//                     {prs.name}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type="number"
//                 name={name}
//                 value={pro[name]}
//                 onChange={handleProChange}
//                 className="form-input text-sm rounded"
//               />
//             )}
//           </div>
//         ))}

//         <div className="flex items-end p-2 w-1/6">
//           <button onClick={addItem} className="text-sm bg-green-500 text-white px-4 py-2 rounded">
//             Add Item
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Page;

