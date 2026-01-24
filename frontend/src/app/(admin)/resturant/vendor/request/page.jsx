// "use client";
// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";

// export default function VendorRequests() {
//   const [requests, setRequests] = useState([]);

//   const loadRequests = async () => {
//     const res = await api.get("/vendor/restro/my-requests");
//     setRequests(res.data);
//   };

//   useEffect(() => {
//     loadRequests();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="mb-4 text-2xl font-bold">My Inventory Requests</h1>

//       <table className="w-full border">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="p-2 border">Product</th>
//             <th className="p-2 border">Requested</th>
//             <th className="p-2 border">Approved</th>
//             <th className="p-2 border">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {requests.map((r) => (
//             <tr key={r.id}>
//               <td className="p-2 border">{r.product?.product_name}</td>
//               <td className="p-2 border">
//                 {r.requested_qty} {r.requestedUnit?.unit_name}
//               </td>
//               <td className="p-2 border">
//                 {r.approved_qty
//                   ? `${r.approved_qty} ${r.approvedUnit?.unit_name}`
//                   : "-"}
//               </td>
//               <td className="p-2 border">
//                 <span
//                   className={`px-2 py-1 rounded text-white ${
//                     r.status === "approved"
//                       ? "bg-green-600"
//                       : r.status === "rejected"
//                       ? "bg-red-600"
//                       : "bg-yellow-500"
//                   }`}
//                 >
//                   {r.status}
//                 </span>
//               </td>
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

export default function VendorRequests() {
  const [requests, setRequests] = useState([]);

  /* ---------- GET TOKEN FROM COOKIE ---------- */
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  /* ---------- LOAD REQUESTS ---------- */
  const loadRequests = async () => {
    try {
      const token = getCookie("access_token");

      const res = await axios.get(
        "https://apibrize.brizindia.com/api/vendor/restro/my-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data);
    } catch (error) {
      console.error("Failed to load requests", error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">My Inventory Requests</h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Requested</th>
            <th className="p-2 border">Approved</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                No requests found
              </td>
            </tr>
          )}

          {requests.map((r) => (
            <tr key={r.id}>
              <td className="p-2 border">{r.product?.product_name ?? "-"}</td>

              <td className="p-2 border">
                {r.requested_qty} {r.requestedUnit?.unit_name}
              </td>

              <td className="p-2 border">
                {r.approved_qty
                  ? `${r.approved_qty} ${r.approvedUnit?.unit_name}`
                  : "-"}
              </td>

              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    r.status === "approved"
                      ? "bg-green-600"
                      : r.status === "rejected"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
