// "use client";
// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import { useRouter } from "next/navigation";

// export default function VendorInventoryRequest() {
//   const [products, setProducts] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [form, setForm] = useState({
//     product_id: "",
//     requested_qty: "",
//     requested_unit_id: "",
//   });

//   const router = useRouter();

//   const loadData = async () => {
//     const prod = await api.get("/productresturant");
//     const unit = await api.get("/units");
//     setProducts(prod.data);
//     setUnits(unit.data);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const submitRequest = async (e) => {
//     e.preventDefault();
//     await api.post("/vendor/restro/request-inventory", form);
//     router.push("/vendor/requests");
//   };

//   return (
//     <div className="w-1/2 p-6">
//       <h1 className="mb-4 text-xl font-bold">Request Inventory</h1>

//       <form onSubmit={submitRequest} className="space-y-4">
//         <select
//           className="w-full p-2 border"
//           value={form.product_id}
//           onChange={(e) => setForm({ ...form, product_id: e.target.value })}
//         >
//           <option value="">Select Product</option>
//           {products.map((p) => (
//             <option key={p.id} value={p.id}>
//               {p.product_name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="number"
//           className="w-full p-2 border"
//           placeholder="Requested Quantity"
//           value={form.requested_qty}
//           onChange={(e) => setForm({ ...form, requested_qty: e.target.value })}
//         />

//         <select
//           className="w-full p-2 border"
//           value={form.requested_unit_id}
//           onChange={(e) =>
//             setForm({ ...form, requested_unit_id: e.target.value })
//           }
//         >
//           <option value="">Select Unit</option>
//           {units.map((u) => (
//             <option key={u.id} value={u.id}>
//               {u.unit_name}
//             </option>
//           ))}
//         </select>

//         <button className="px-4 py-2 text-white bg-green-600 rounded">
//           Send Request
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VendorInventoryRequest() {
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    requested_qty: "",
    requested_unit_id: "",
  });

  const router = useRouter();

  /* ---------- GET TOKEN FROM COOKIE ---------- */
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  /* ---------- LOAD PRODUCTS + UNITS ---------- */
  const loadData = async () => {
    try {
      const token = getCookie("access_token");

      const [prodRes, unitRes] = await Promise.all([
        axios.get("https://apibrize.brizindia.com/api/admin/res-products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://apibrize.brizindia.com/api/units", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProducts(prodRes.data);
      setUnits(unitRes.data);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------- SUBMIT REQUEST ---------- */
  const submitRequest = async (e) => {
    e.preventDefault();

    try {
      const token = getCookie("access_token");
      await axios.post(
        "https://apibrize.brizindia.com/api/vendor/restro/request-inventory",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      router.push("/resturant/vendor/inventory");
    } catch (error) {
      console.error("Failed to submit request", error);
    }
  };

  return (
    <div className="w-1/2 p-6 bg-white rounded shadow">
      <h1 className="mb-4 text-xl font-bold">Request Inventory</h1>

      <form onSubmit={submitRequest} className="space-y-4">
        {/* PRODUCT */}
        <select
          className="w-full p-2 border rounded"
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

        {/* QUANTITY */}
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Requested Quantity"
          value={form.requested_qty}
          onChange={(e) => setForm({ ...form, requested_qty: e.target.value })}
          required
        />

        {/* UNIT */}
        <select
          className="w-full p-2 border rounded"
          value={form.requested_unit_id}
          onChange={(e) =>
            setForm({ ...form, requested_unit_id: e.target.value })
          }
          required
        >
          <option value="">Select Unit</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.unit_name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Send Request
        </button>
      </form>
    </div>
  );
}
