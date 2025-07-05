// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useForm } from "react-hook-form";

// export default function Home() {
//   const { register, handleSubmit, reset, setValue } = useForm();
//   const [items, setItems] = useState([]);
//   const [editingItem, setEditingItem] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const getCookie = (name) => {
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
//       if (parts.length === 2) {
//         return decodeURIComponent(parts.pop().split(";").shift());
//       }
//       return null;
//     };

//     const accessToken = getCookie("access_token");
//     if (!accessToken) {
//       console.error("Authentication token not found!");
//     } else {
//       setToken(accessToken);
//     }
//   }, []);

//   useEffect(() => {
//     if (!token) return;
//     fetchItems();
//   }, [token]);

//   const fetchItems = async () => {
//     try {
//       const response = await axios.get("https://api.equi.co.in/api/billcount", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setItems(response.data?.bill_count || []);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   const onSubmit = async (data) => {
//     if (!token) return;

//     try {
//       if (editingItem) {
//         const response = await axios.put(
//           `https://api.equi.co.in/api/billcount/${editingItem.id}`,
//           data,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         fetchItems();
//         reset();
//         setEditingItem(null);
//       } else {
//         const response = await axios.post(
//           "https://api.equi.co.in/api/billcount",
//           data,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         fetchItems();
//         reset();
//       }
//     } catch (error) {
//       console.error("Error saving item:", error);
//     }
//   };

// //   const handleEdit = (item) => {
// //     setValue("bill_count", item.bill_count);
// //     setEditingItem(item);
// //   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Left side form */}
//       <div className="w-1/3 p-6 bg-gray-100">
//         <h2 className="text-2xl font-semibold mb-4">
//           {editingItem ? "Edit Bill Count" : "Create Bill Count"}
//         </h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Bill Count
//             </label>
//             <input
//               type="number"
//               {...register("bill_count")}
//               className="mt-1 p-2 w-full border rounded-md"
//             />
//           </div>
//           {/* <button
//             type="submit"
//             className="w-full p-2 bg-green-500 text-white rounded-md"
//           >
//             {editingItem ? "Update" : "Create"}
//           </button> */}
//         </form>
//       </div>

//       {/* Right side display */}
//       <div className="w-2/3 p-6 bg-white overflow-y-auto">
//         <h2 className="text-2xl font-semibold mb-4">Bill Count List</h2>
//         <ul>
//         <li

//               className="flex border p-3 justify-between items-center"
//             >
//               <div>
//                 <p className="font-semibold">{items.bill_count}</p>
//               </div>
//               {/* <div>
//                 <button
//                   onClick={() => handleEdit(item)}
//                   className="px-4 py-1 bg-yellow-500 text-white rounded-md"
//                 >
//                   Edit
//                 </button>
//               </div> */}
//             </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function Home() {
  const { register, handleSubmit, reset } = useForm();
  const [billCount, setBillCount] = useState(null);
  const [token, setToken] = useState(null);

  // Get token from cookie
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
      }
      return null;
    };

    const accessToken = getCookie("access_token");
    if (!accessToken) {
      console.error("Authentication token not found!");
    } else {
      setToken(accessToken);
    }
  }, []);

  // Fetch bill count
  useEffect(() => {
    if (!token) return;
    fetchBillCount();
  }, [token]);

  const fetchBillCount = async () => {
    try {
      const response = await axios.get(
        "https://api.equi.co.in/api/billcountnumber",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBillCount(response.data?.bill_count || 0);
    } catch (error) {
      console.error("Error fetching bill count:", error);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!token) return;

    try {
      await axios.post("https://api.equi.co.in/api/billcount", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBillCount();
      reset();
    } catch (error) {
      console.error("Error saving bill count:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side form */}
      <div className="w-1/3 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Create Bill Count</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bill Count
            </label>
            <input
              type="number"
              {...register("bill_count", { required: true, min: 0 })}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter bill count"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded-md"
          >
            Create
          </button>
        </form>
      </div>

      {/* Right side display */}
      <div className="w-2/3 p-6 bg-white overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Current Bill Count</h2>
        <div className="border p-4 rounded-md shadow-sm text-lg">
          {billCount?.bill_count ?? "Loading..."}
        </div>
      </div>
    </div>
  );
}
