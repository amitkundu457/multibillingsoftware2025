// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";

// const BASE_URL = "https://apibrize.brizindia.com/api";

// export default function ProductPage() {
//   const [products, setProducts] = useState([]);

//   /* ---------- GET TOKEN ---------- */
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   /* ---------- AXIOS CONFIG ---------- */
//   const axiosAuth = () => {
//     const token = getCookie("access_token");
//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       withCredentials: true,
//     };
//   };

//   /* ---------- FETCH PRODUCTS ---------- */
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/res-products`, axiosAuth());
//       setProducts(res.data);
//     } catch (error) {
//       console.error(
//         "Error fetching products:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   /* ---------- DELETE PRODUCT ---------- */
//   const deleteProduct = async (id) => {
//     if (!confirm("Are you sure to delete?")) return;

//     try {
//       await axios.delete(`${BASE_URL}/res-products/${id}`, axiosAuth());
//       fetchProducts();
//     } catch (error) {
//       console.error(
//         "Error deleting product:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div className="max-w-6xl p-6 mx-auto">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-3xl font-bold">Products</h1>
//         <Link
//           href="/resturant/restroproducts/product/create"
//           className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
//         >
//           Add Product
//         </Link>
//       </div>

//       <div className="overflow-x-auto bg-white rounded shadow">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
//                 Tax
//               </th>
//               <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
//                 Mrp
//               </th>
//               <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
//                 Image
//               </th>
//               <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {products.length > 0 ? (
//               products.map((p) => (
//                 <tr key={p.id}>
//                   <td className="px-6 py-4">{p.product_name}</td>
//                   <td className="px-6 py-4">{p.tax_rate}</td>
//                   <td className="px-6 py-4">{p.mrp}</td>

//                   <td className="px-6 py-4">
//                     {p.image ? (
//                       <img
//                         src={`http://localhost:8000/storage/${p.image}`}
//                         alt={p.product_name}
//                         className="object-cover w-16 h-16 rounded"
//                       />
//                     ) : (
//                       "—"
//                     )}
//                   </td>
//                   <td className="px-6 py-4 space-x-3">
//                     <Link
//                       href={`/resturant/restroproducts/product/edit/${p.id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => deleteProduct(p.id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="p-4 text-center text-gray-500">
//                   No products found
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
import Link from "next/link";
import axios from "axios";

const BASE_URL = "https://apibrize.brizindia.com/api";
const IMAGE_BASE = "https://apibrize.brizindia.com/storage";

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  /* ---------- GET TOKEN ---------- */
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  /* ---------- AXIOS AUTH (FIXED) ---------- */
  const axiosAuth = () => {
    const token = getCookie("access_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
  };

  /* ---------- FETCH PRODUCTS ---------- */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/res-products`, axiosAuth());
      setProducts(res.data);
    } catch (error) {
      console.error(
        "Fetch products error:",
        error.response?.data || error.message
      );
    }
  };

  /* ---------- DELETE PRODUCT ---------- */
  const deleteProduct = async (id) => {
    if (!confirm("Are you sure to delete?")) return;

    try {
      await axios.delete(`${BASE_URL}/res-products/${id}`, axiosAuth());
      fetchProducts();
    } catch (error) {
      console.error(
        "Delete product error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/resturant/restroproducts/product/create"
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Tax</th>
              <th className="px-6 py-3 text-left">MRP</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length ? (
              products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-6 py-4">{p.product_name}</td>
                  <td className="px-6 py-4">{p.tax_rate}</td>
                  <td className="px-6 py-4">{p.mrp}</td>

                  <td className="px-6 py-4">
                    {p.image ? (
                      <img
                        src={`${IMAGE_BASE}/${p.image}`}
                        alt={p.product_name}
                        className="object-cover w-16 h-16 rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-6 py-4 space-x-3">
                    {/* <Link
                      href={`/resturant/restroproducts/product/edit/${p.id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link> */}
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
