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
  console.log("product", data);
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
          " https://apibrize.brizindia.com/api/karigar-list",
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
            disabled
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
        {/* {formData.karigari_items?.map((kgi, i) => (
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
      ))} */}

        {/* Table View */}
        {formData.karigari_items.length > 0 && (
          <div className="px-6 py-4">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Product</th>
                  <th className="border px-2 py-1">Nwt</th>
                  <th className="border px-2 py-1">Tounch</th>
                  <th className="border px-2 py-1">Rate</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.karigari_items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{item.product_name}</td>
                    <td className="border px-2 py-1">{item.nwt}</td>
                    <td className="border px-2 py-1">{item.tounch}</td>
                    <td className="border px-2 py-1">{item.rate}</td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        onClick={() => deleteItem(idx)}
                        className="text-red-500"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import {
//   FaEdit,
//   FaPlus,
//   FaRupeeSign,
//   FaSave,
//   FaTimes,
// } from "react-icons/fa";
// import { FaArrowRotateRight } from "react-icons/fa6";
// import { useKarigari } from "@/app/hooks/karigari";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";

// const Page = () => {
//   const params = useSearchParams();
//   const [karigarList, setkarigarList] = useState([]);
//   const id = params.get("id");

//   const {
//     isLoading,
//     data,
//     createKarigari,
//     updateKarigari,
//     getKarigariById,
//   } = useKarigari();

//   const [formData, setFormData] = useState({
//     voucher_no: "",
//     date: new Date().toISOString().slice(0, 10), // default today
//     user_id: "",
//     type: "issue",
//     karigarlist_id: "",
//     karigari_items: [],
//   });

//   const [pro, setPro] = useState({
//     is_edit: false,
//     edit_index: null,
//     product_name: "",
//     nwt: 0,
//     tounch: 0,
//     rate: 0,
//   });

//   const [errors, setErrors] = useState({});
//   const [token, setToken] = useState("");

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
//     return null;
//   };

//   useEffect(() => {
//     const tkn = getCookie("access_token");
//     setToken(tkn);
//   }, []);

//   useEffect(() => {
//     if (!token) return;
//     const fetchKarigarList = async () => {
//       try {
//         const res = await axios.get("https://apibrize.brizindia.com/api/karigar-list", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setkarigarList(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchKarigarList();
//   }, [token]);

//   useEffect(() => {
//     if (id) {
//       const fetchData = async () => {
//         try {
//           const kgii = await getKarigariById(id);
//           setFormData({
//             voucher_no: kgii.voucher_no || "",
//             date: kgii.date || new Date().toISOString().slice(0, 10),
//             user_id: kgii.user_id || "",
//             karigarlist_id: kgii.karigarlist_id || "",
//             type: kgii.type || "issue",
//             karigari_items: kgii.karigari_items || [],
//           });
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       fetchData();
//     } else if (!isLoading && data) {
//       setFormData((prev) => ({
//         ...prev,
//         voucher_no: `KI${parseInt(data.issueCount) + 1}`,
//       }));
//     }
//   }, [id, isLoading, data]);

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "karigarlist_id" ? Number(value) : value,
//     }));
//   };

//   const handleProChange = (e) => {
//     const { name, value } = e.target;
//     setPro((prev) => ({ ...prev, [name]: value }));
//   };

//   const addItem = () => {
//     if (!formData.karigarlist_id) {
//       alert("Select Karigar first");
//       return;
//     }
//     if (!pro.product_name) {
//       alert("Select Product first");
//       return;
//     }

//     const newItem = {
//       product_name: pro.product_name,
//       nwt: parseFloat(pro.nwt),
//       tounch: parseFloat(pro.tounch),
//       rate: parseFloat(pro.rate),
//       karigarlist_id: formData.karigarlist_id,
//     };

//     const updatedItems = [...formData.karigari_items];
//     if (pro.is_edit && pro.edit_index !== null) {
//       updatedItems[pro.edit_index] = newItem;
//     } else {
//       updatedItems.push(newItem);
//     }

//     setFormData((prev) => ({ ...prev, karigari_items: updatedItems }));
//     setPro({ is_edit: false, edit_index: null, product_name: "", nwt: 0, tounch: 0, rate: 0 });
//   };

//   const deleteItem = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       karigari_items: prev.karigari_items.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let validationErrors = "";
//     if (id) {
//       validationErrors = await updateKarigari(id, formData);
//     } else {
//       validationErrors = await createKarigari(formData);
//     }
//     if (validationErrors) {
//       setErrors(validationErrors);
//     } else {
//       setFormData({
//         voucher_no: "",
//         date: new Date().toISOString().slice(0, 10),
//         user_id: "",
//         type: "issue",
//         karigarlist_id: "",
//         karigari_items: [],
//       });
//     }
//   };

//   if (!token)
//     return <div className="p-4 text-red-600 text-center">Authentication token not found!</div>;

//   return (
//     <div className="absolute left-0 top-0 w-full bg-white h-full">
//       <div className="w-full flex p-3 px-6 bg-green-500 text-white">
//         <p className="flex-1 text-center font-semibold">Stock Issue</p>
//         <Link href="/jwellery/inventory/karigari" className="flex items-center text-sm gap-2">
//           <FaTimes />
//         </Link>
//       </div>

//       <div className="flex py-3 px-3 gap-2">
//         <button className="text-sm px-4 flex flex-col items-center gap-1">
//           <FaArrowRotateRight size={24} className="text-blue-700" />
//           <span>Refresh</span>
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="text-sm px-4 flex flex-col items-center gap-1"
//         >
//           <FaSave size={24} className="text-blue-700" />
//           <span>Save</span>
//         </button>
//       </div>

//       <div className="flex flex-wrap px-6 py-1 gap-2">
//         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
//           <label>Voucher No.</label>
//           <input
//             type="text"
//             name="voucher_no"
//             value={formData.voucher_no}
//             onChange={handleChange}
//             className="form-input text-sm rounded"
//           />
//         </div>
//         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
//           <label>Date</label>
//           <input
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             className="form-input text-sm rounded"
//           />
//         </div>
//         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
//           <label>Karigar List</label>
//           <select
//             name="karigarlist_id"
//             value={formData.karigarlist_id}
//             onChange={handleChange}
//             className="form-select text-sm rounded"
//           >
//             <option value="">-- Select Karigar --</option>
//             {karigarList.map((k) => (
//               <option key={k.id} value={k.id}>{k.name}</option>
//             ))}
//           </select>
//         </div>
//         <div className="w-full" />
//         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
//           <label>Product</label>
//           <select
//             name="product_name"
//             value={pro.product_name}
//             onChange={handleProChange}
//             className="form-select text-sm rounded"
//           >
//             <option value="">-- Select Product --</option>
//             {!isLoading &&
//               data?.productServices?.map((prs, i) => (
//                 <option key={i} value={prs.name}>
//                   {prs.name}
//                 </option>
//               ))}
//           </select>
//         </div>
//         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
//           <label>Nwt</label>
//           <input type="number" name="nwt" value={pro.nwt} onChange={handleProChange} className="form-input rounded text-sm" />
//         </div>
//         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
//           <label>Tounch</label>
//           <input type="number" name="tounch" value={pro.tounch} onChange={handleProChange} className="form-input rounded text-sm" />
//         </div>
//         <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
//           <label>Rate</label>
//           <input type="number" name="rate" value={pro.rate} onChange={handleProChange} className="form-input rounded text-sm" />
//         </div>
//         <div className="flex items-end p-2 w-1/5">
//           <button
//             onClick={addItem}
//             className="text-sm bg-green-500 text-white py-2 px-6 rounded flex items-center gap-1"
//           >
//             <FaPlus /> Add
//           </button>
//         </div>
//       </div>

//       {/* Table View */}
//       {formData.karigari_items.length > 0 && (
//         <div className="px-6 py-4">
//           <table className="w-full border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border px-2 py-1">Product</th>
//                 <th className="border px-2 py-1">Nwt</th>
//                 <th className="border px-2 py-1">Tounch</th>
//                 <th className="border px-2 py-1">Rate</th>
//                 <th className="border px-2 py-1">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {formData.karigari_items.map((item, idx) => (
//                 <tr key={idx}>
//                   <td className="border px-2 py-1">{item.product_name}</td>
//                   <td className="border px-2 py-1">{item.nwt}</td>
//                   <td className="border px-2 py-1">{item.tounch}</td>
//                   <td className="border px-2 py-1">{item.rate}</td>
//                   <td className="border px-2 py-1 text-center">
//                     <button onClick={() => deleteItem(idx)} className="text-red-500">
//                       <FaTimes />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Page;
