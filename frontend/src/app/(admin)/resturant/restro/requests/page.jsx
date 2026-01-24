// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// const BASE_URL = "https://apibrize.brizindia.com/api";

// export default function RestroRequests() {
//   const [requests, setRequests] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [approveData, setApproveData] = useState({});

//   /* ---------------- COOKIE ---------------- */
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   /* ---------------- AXIOS CONFIG ---------------- */
//   const getAxiosConfig = () => {
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
//       const [reqRes, unitRes] = await Promise.all([
//         axios.get(`${BASE_URL}/restro/requests`, getAxiosConfig()),
//         axios.get(`${BASE_URL}/units`, getAxiosConfig()),
//       ]);

//       setRequests(reqRes.data);
//       setUnits(unitRes.data);
//     } catch (error) {
//       console.error(
//         "Failed to load data",
//         error.response?.data || error.message
//       );
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   /* ---------------- APPROVE ---------------- */
//   const approve = async (request) => {
//     try {
//       await axios.put(
//         `${BASE_URL}/restro/request/${request.id}/approve`,
//         {
//           approved_qty: approveData[request.id]?.approved_qty,
//           approved_unit_id:
//             approveData[request.id]?.approved_unit_id ??
//             request.requested_unit.id,
//         },
//         getAxiosConfig()
//       );

//       loadData();
//     } catch (error) {
//       console.error("Approve failed", error.response?.data || error.message);
//     }
//   };

//   /* ---------------- REJECT ---------------- */
//   const reject = async (id) => {
//     try {
//       await axios.put(
//         `${BASE_URL}/restro/request/${id}/reject`,
//         {},
//         getAxiosConfig()
//       );

//       loadData();
//     } catch (error) {
//       console.error("Reject failed", error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="mb-4 text-2xl font-bold">📦 Restro Inventory Requests</h1>

//       <div className="overflow-x-auto">
//         <table className="w-full border rounded">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">Vendor</th>
//               <th className="p-2 border">Product</th>
//               <th className="p-2 border">Requested</th>
//               <th className="p-2 border">Approve</th>
//               <th className="p-2 border">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {requests.length ? (
//               requests.map((r) => (
//                 <tr key={r.id} className="hover:bg-gray-50">
//                   <td className="p-2 border">{r.vendor?.vendor_name ?? "-"}</td>

//                   <td className="p-2 border">
//                     {r.product?.product_name ?? "-"}
//                   </td>

//                   <td className="p-2 border">
//                     {r.requested_qty}{" "}
//                     <span className="text-sm text-gray-600">
//                       {r.requested_unit?.unit_name}
//                     </span>
//                   </td>

//                   <td className="p-2 border">
//                     <div className="flex gap-2">
//                       <input
//                         type="number"
//                         min="0"
//                         className="w-20 p-1 border rounded"
//                         placeholder="Qty"
//                         value={approveData[r.id]?.approved_qty || ""}
//                         onChange={(e) =>
//                           setApproveData({
//                             ...approveData,
//                             [r.id]: {
//                               ...approveData[r.id],
//                               approved_qty: e.target.value,
//                             },
//                           })
//                         }
//                       />

//                       <select
//                         className="p-1 border rounded"
//                         value={
//                           approveData[r.id]?.approved_unit_id ??
//                           r.requested_unit?.id
//                         }
//                         onChange={(e) =>
//                           setApproveData({
//                             ...approveData,
//                             [r.id]: {
//                               ...approveData[r.id],
//                               approved_unit_id: e.target.value,
//                             },
//                           })
//                         }
//                       >
//                         {units.map((u) => (
//                           <option key={u.id} value={u.id}>
//                             {u.unit_name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </td>

//                   <td className="p-2 border">
//                     <button
//                       onClick={() => approve(r)}
//                       className="px-3 py-1 mr-2 text-white bg-green-600 rounded hover:bg-green-700"
//                     >
//                       Approve
//                     </button>

//                     <button
//                       onClick={() => reject(r.id)}
//                       className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="p-4 text-center text-gray-500">
//                   No requests found
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

export default function RestroRequests() {
  const [requests, setRequests] = useState([]);
  const [units, setUnits] = useState([]);
  const [approveData, setApproveData] = useState({});

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
  const getAxiosConfig = () => {
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
      const [reqRes, unitRes] = await Promise.all([
        axios.get(`${BASE_URL}/restro/requests`, getAxiosConfig()),
        axios.get(`${BASE_URL}/units`, getAxiosConfig()),
      ]);

      setRequests(reqRes.data);
      setUnits(unitRes.data);
    } catch (error) {
      console.error(
        "Failed to load data:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- APPROVE ---------------- */
  const approve = async (request) => {
    try {
      await axios.put(
        `${BASE_URL}/restro/request/${request.id}/approve`,
        {
          approved_qty: approveData[request.id]?.approved_qty,
          approved_unit_id:
            approveData[request.id]?.approved_unit_id ??
            request.requested_unit.id,
        },
        getAxiosConfig()
      );

      loadData();
    } catch (error) {
      console.error("Approve failed:", error.response?.data || error.message);
    }
  };

  /* ---------------- REJECT ---------------- */
  const reject = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/restro/request/${id}/reject`,
        {},
        getAxiosConfig()
      );

      loadData();
    } catch (error) {
      console.error("Reject failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">📦 Restro Inventory Requests</h1>

      <div className="overflow-x-auto">
        <table className="w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Requested</th>
              <th className="p-2 border">Approve</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.length ? (
              requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{r.vendor?.vendor_name ?? "-"}</td>

                  <td className="p-2 border">
                    {r.product?.product_name ?? "-"}
                  </td>

                  <td className="p-2 border">
                    {r.requested_qty}{" "}
                    <span className="text-sm text-gray-600">
                      {r.requested_unit?.unit_name}
                    </span>
                  </td>

                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        className="w-20 p-1 border rounded"
                        placeholder="Qty"
                        value={approveData[r.id]?.approved_qty || ""}
                        onChange={(e) =>
                          setApproveData({
                            ...approveData,
                            [r.id]: {
                              ...approveData[r.id],
                              approved_qty: e.target.value,
                            },
                          })
                        }
                      />

                      <select
                        className="p-1 border rounded"
                        value={
                          approveData[r.id]?.approved_unit_id ??
                          r.requested_unit?.id
                        }
                        onChange={(e) =>
                          setApproveData({
                            ...approveData,
                            [r.id]: {
                              ...approveData[r.id],
                              approved_unit_id: e.target.value,
                            },
                          })
                        }
                      >
                        {units.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.unit_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td className="p-2 border">
                    <button
                      onClick={() => approve(r)}
                      className="px-3 py-1 mr-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => reject(r.id)}
                      className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
