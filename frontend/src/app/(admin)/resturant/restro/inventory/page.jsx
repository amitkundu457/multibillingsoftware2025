// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// const BASE_URL = "https://apibrize.brizindia.com/api";

// export default function RestroInventory() {
//   const [inventory, setInventory] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [units, setUnits] = useState([]);

//   const [form, setForm] = useState({
//     product_id: "",
//     unit_id: "",
//     qty: "",
//   });

//   /* ---------------- COOKIE ---------------- */
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   /* ---------------- AXIOS CONFIG (TOKEN HERE) ---------------- */
//   const axiosConfig = () => {
//     const token = getCookie("access_token");
//     return {
//       withCredentials: true,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     };
//   };

//   /* ---------------- LOAD DATA ---------------- */
//   const loadData = async () => {
//     try {
//       const [invRes, prodRes, unitRes] = await Promise.all([
//         axios.get(`${BASE_URL}/restro/inventory`, axiosConfig()),
//         axios.get(`${BASE_URL}/res-products`, axiosConfig()),
//         axios.get(`${BASE_URL}/units`, axiosConfig()),
//       ]);

//       setInventory(invRes.data);
//       setProducts(prodRes.data);
//       setUnits(unitRes.data);
//     } catch (error) {
//       console.error(
//         "Failed to load inventory data",
//         error.response?.data || error.message
//       );
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   /* ---------------- ADD STOCK ---------------- */
//   const addStock = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post(`${BASE_URL}/restro/add-stock`, form, axiosConfig());

//       setForm({ product_id: "", unit_id: "", qty: "" });
//       loadData();
//     } catch (error) {
//       console.error(
//         "Failed to add stock",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="mb-4 text-2xl font-bold">🍽️ Restro Inventory</h1>

//       {/* ADD STOCK FORM */}
//       <form onSubmit={addStock} className="flex flex-wrap gap-3 mb-6">
//         <select
//           className="p-2 border rounded w-52"
//           value={form.product_id}
//           onChange={(e) => setForm({ ...form, product_id: e.target.value })}
//           required
//         >
//           <option value="">Select Product</option>
//           {products.map((p) => (
//             <option key={p.id} value={p.id}>
//               {p.product_name}
//             </option>
//           ))}
//         </select>

//         <select
//           className="w-32 p-2 border rounded"
//           value={form.unit_id}
//           onChange={(e) => setForm({ ...form, unit_id: e.target.value })}
//           required
//         >
//           <option value="">Unit</option>
//           {units.map((u) => (
//             <option key={u.id} value={u.id}>
//               {u.unit_name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="number"
//           className="w-32 p-2 border rounded"
//           placeholder="Quantity"
//           value={form.qty}
//           onChange={(e) => setForm({ ...form, qty: e.target.value })}
//           required
//         />

//         <button
//           type="submit"
//           className="px-4 text-white bg-blue-600 rounded hover:bg-blue-700"
//         >
//           ➕ Add Stock
//         </button>
//       </form>

//       {/* INVENTORY TABLE */}
//       <div className="overflow-x-auto">
//         <table className="w-full border rounded">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 text-left border">Product</th>
//               <th className="p-2 text-left border">Unit</th>
//               <th className="p-2 text-left border">Available Qty</th>
//             </tr>
//           </thead>
//           <tbody>
//             {inventory.length > 0 ? (
//               inventory.map((row) => (
//                 <tr key={row.id} className="hover:bg-gray-50">
//                   <td className="p-2 border">
//                     {row.product?.product_name ?? "-"}
//                   </td>
//                   <td className="p-2 border">{row.unit?.unit_name ?? "-"}</td>
//                   <td className="p-2 font-semibold border">
//                     {row.qty_available}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" className="p-4 text-center text-gray-500">
//                   No inventory found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://apibrize.brizindia.com/api";

export default function RestroInventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    unit_id: "",
    qty: "",
  });

  /* ---------------- COOKIE ---------------- */
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  /* ---------------- AXIOS CONFIG (FIXED) ---------------- */
  const axiosConfig = () => {
    const token = getCookie("access_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
  };

  /* ---------------- LOAD DATA ---------------- */
  const loadData = async () => {
    try {
      const [invRes, prodRes, unitRes] = await Promise.all([
        axios.get(`${BASE_URL}/restro/inventory`, axiosConfig()),
        axios.get(`${BASE_URL}/res-products`, axiosConfig()),
        axios.get(`${BASE_URL}/units`, axiosConfig()),
      ]);

      setInventory(invRes.data);
      setProducts(prodRes.data);
      setUnits(unitRes.data);
    } catch (error) {
      console.error(
        "Failed to load inventory data:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- ADD STOCK ---------------- */
  const addStock = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/restro/add-stock`, form, axiosConfig());

      setForm({ product_id: "", unit_id: "", qty: "" });
      loadData();
    } catch (error) {
      console.error(
        "Failed to add stock:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">🍽️ Restro Inventory</h1>

      {/* ADD STOCK FORM */}
      <form onSubmit={addStock} className="flex flex-wrap gap-3 mb-6">
        <select
          className="p-2 border rounded w-52"
          value={form.product_id}
          onChange={(e) => setForm({ ...form, product_id: e.target.value })}
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.product_name}
            </option>
          ))}
        </select>

        <select
          className="w-32 p-2 border rounded"
          value={form.unit_id}
          onChange={(e) => setForm({ ...form, unit_id: e.target.value })}
          required
        >
          <option value="">Unit</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.unit_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="w-32 p-2 border rounded"
          placeholder="Quantity"
          value={form.qty}
          onChange={(e) => setForm({ ...form, qty: e.target.value })}
          required
        />

        <button
          type="submit"
          className="px-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          ➕ Add Stock
        </button>
      </form>

      {/* INVENTORY TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left border">Product</th>
              <th className="p-2 text-left border">Unit</th>
              <th className="p-2 text-left border">Available Qty</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length ? (
              inventory.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {row.product?.product_name ?? "-"}
                  </td>
                  <td className="p-2 border">{row.unit?.unit_name ?? "-"}</td>
                  <td className="p-2 font-semibold border">
                    {row.qty_available}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No inventory found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
