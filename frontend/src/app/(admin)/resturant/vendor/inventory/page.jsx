// "use client";
// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import Link from "next/link";

// export default function VendorInventory() {
//   const [inventory, setInventory] = useState([]);

//   const loadInventory = async () => {
//     const res = await api.get("/vendor/restro/my-inventory");
//     setInventory(res.data);
//   };

//   useEffect(() => {
//     loadInventory();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">My Inventory</h1>
//         <Link
//           href="/vendor/inventory/request"
//           className="px-4 py-2 text-white bg-blue-600 rounded"
//         >
//           Request Inventory
//         </Link>
//       </div>

//       <table className="w-full border">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="p-2 border">Product</th>
//             <th className="p-2 border">Unit</th>
//             <th className="p-2 border">Quantity</th>
//           </tr>
//         </thead>

//         <tbody>
//           {inventory.length === 0 && (
//             <tr>
//               <td colSpan="3" className="p-4 text-center">
//                 No inventory available
//               </td>
//             </tr>
//           )}

//           {inventory.map((item) => (
//             <tr key={item.id}>
//               <td className="p-2 border">
//                 {item.product?.product_name}
//               </td>
//               <td className="p-2 border">
//                 {item.unit?.unit_name}
//               </td>
//               <td className="p-2 border">{item.qty}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function VendorInventory() {
  const [inventory, setInventory] = useState([]);

  /* ---------- GET TOKEN FROM COOKIE ---------- */
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  /* ---------- LOAD INVENTORY ---------- */
  const loadInventory = async () => {
    try {
      const token = getCookie("access_token");

      const res = await axios.get(
        "https://apibrize.brizindia.com/api/vendor/restro/my-inventory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInventory(res.data);
    } catch (error) {
      console.error("Failed to load inventory", error);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Inventory</h1>

        <Link
          href="/resturant/vendor/inventory/request"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Request Inventory
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Unit</th>
            <th className="p-2 border">Quantity</th>
          </tr>
        </thead>

        <tbody>
          {inventory.length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center">
                No inventory available
              </td>
            </tr>
          )}

          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border">
                {item.product?.product_name ?? "-"}
              </td>
              <td className="p-2 border">{item.unit?.unit_name ?? "-"}</td>
              <td className="p-2 border">{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
