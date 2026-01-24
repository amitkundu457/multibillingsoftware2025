// "use client";
// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import Link from "next/link";

// export default function UnitList() {
//   const [units, setUnits] = useState([]);

//   const fetchUnits = async () => {
//     const res = await api.get("/units");
//     setUnits(res.data);
//   };

//   const deleteUnit = async (id) => {
//     if (!confirm("Delete this unit?")) return;
//     await api.delete(`/units/${id}`);
//     fetchUnits();
//   };

//   useEffect(() => {
//     fetchUnits();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">Units</h1>
//         <Link
//           href="/units/create"
//           className="px-4 py-2 text-white bg-blue-600 rounded"
//         >
//           Add Unit
//         </Link>
//       </div>

//       <table className="w-full border">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="p-2 border">ID</th>
//             <th className="p-2 border">Unit Name</th>
//             <th className="p-2 border">Unit Type</th>
//             <th className="p-2 border">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {units.map((u) => (
//             <tr key={u.id}>
//               <td className="p-2 border">{u.id}</td>
//               <td className="p-2 border">{u.unit_name}</td>
//               <td className="p-2 border">{u.unit_type}</td>
//               <td className="p-2 border">
//                 <Link
//                   href={`/units/${u.id}/edit`}
//                   className="px-3 py-1 mr-2 text-white bg-green-600 rounded"
//                 >
//                   Edit
//                 </Link>

//                 <button
//                   onClick={() => deleteUnit(u.id)}
//                   className="px-3 py-1 text-white bg-red-600 rounded"
//                 >
//                   Delete
//                 </button>
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
import Link from "next/link";

export default function UnitList() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://apibrize.brizindia.com/api";

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/units`);
      setUnits(res.data);
    } catch (error) {
      console.error("Error fetching units:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUnit = async (id) => {
    if (!confirm("Delete this unit?")) return;

    try {
      await axios.delete(`${API_BASE}/units/${id}`);
      fetchUnits();
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Units</h1>

        <Link
          href="/resturant/units/create"
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          Add Unit
        </Link>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Unit Name</th>
              <th className="p-2 border">Unit Type</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {units.length > 0 ? (
              units.map((u) => (
                <tr key={u.id}>
                  <td className="p-2 border">{u.id}</td>
                  <td className="p-2 border">{u.unit_name}</td>
                  <td className="p-2 border">{u.unit_type}</td>
                  <td className="p-2 border">
                    {/* <Link
                      href={`/resturant/units/${u.id}/edit`}
                      className="px-3 py-1 mr-2 text-white bg-green-600 rounded"
                    >
                      Edit
                    </Link> */}

                    <button
                      onClick={() => deleteUnit(u.id)}
                      className="px-3 py-1 text-white bg-red-600 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No units found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
