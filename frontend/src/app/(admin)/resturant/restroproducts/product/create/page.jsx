// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// const BASE_URL = "https://apibrize.brizindia.com/api";

// export default function CreateProductPage() {
//   const router = useRouter();

//   const [form, setForm] = useState({});
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [units, setUnits] = useState([]);
//   const [brands, setBrands] = useState([]);

//   /* ---------------- TOKEN FROM COOKIE ---------------- */
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   /* ---------------- AXIOS AUTH CONFIG ---------------- */
//   const axiosAuth = (isMultipart = false) => {
//     const token = getCookie("access_token");
//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         ...(isMultipart ? {} : { "Content-Type": "application/json" }),
//       },
//       withCredentials: true,
//     };
//   };

//   /* ---------------- FORM CHANGE ---------------- */
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   /* ---------------- FILE CHANGE ---------------- */
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   /* ---------------- FETCH UNITS ---------------- */
//   useEffect(() => {
//     const fetchUnits = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/units`, axiosAuth(true));
//         setUnits(res.data);
//       } catch (err) {
//         console.error(
//           "Failed to fetch units",
//           err.response?.data || err.message
//         );
//       }
//     };
//     fetchUnits();
//   }, []);

//   /* ---------------- FETCH BRANDS (COMPANY) ---------------- */
//   useEffect(() => {
//     const fetchBrands = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/company`, axiosAuth(true));
//         setBrands(res.data);
//       } catch (err) {
//         console.error(
//           "Failed to fetch brands",
//           err.response?.data || err.message
//         );
//       }
//     };
//     fetchBrands();
//   }, []);

//   /* ---------------- SUBMIT (POST with TOKEN) ---------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();
//       Object.keys(form).forEach((key) => data.append(key, form[key]));
//       if (image) data.append("image", image);

//       await axios.post(
//         `${BASE_URL}/res-products`,
//         data,
//         axiosAuth(true) // 👈 TOKEN ADDED HERE
//       );

//       router.push("/resturant/restroproducts/product");
//     } catch (err) {
//       console.error(
//         "Error creating product:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-100 to-gray-200">
//       <div className="w-full max-w-3xl p-8 bg-white shadow-xl rounded-2xl">
//         <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
//           ➕ Add New Product
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* GRID */}
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <Input
//               label="Product Name"
//               name="product_name"
//               onChange={handleChange}
//               required
//             />

//             {/* BRAND */}
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-600">
//                 Brand
//               </label>
//               <select
//                 name="brand"
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//               >
//                 <option value="">Select Brand</option>
//                 {brands.map((brand) => (
//                   <option key={brand.id} value={brand.id}>
//                     {brand.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* <Input
//               label="Rate"
//               name="rate"
//               type="number"
//               onChange={handleChange}
//               required
//             /> */}
//             <Input
//               label="MRP"
//               name="mrp"
//               type="number"
//               onChange={handleChange}
//             />

//             {/* <Input label="Rate ID" name="rate_id" onChange={handleChange} /> */}
//             <Input label="HSN" name="hsn" onChange={handleChange} />

//             <Input
//               label="Tax Rate (%)"
//               name="tax_rate"
//               type="number"
//               step="0.01"
//               onChange={handleChange}
//             />

//             {/* UNIT */}
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-600">
//                 Unit
//               </label>
//               <select
//                 name="default_unit"
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//               >
//                 <option value="">Select Unit</option>
//                 {units.map((unit) => (
//                   <option key={unit.id} value={unit.id}>
//                     {unit.unit_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <Input
//               label="Expiry Date"
//               name="expires"
//               type="date"
//               onChange={handleChange}
//             />
//           </div>

//           {/* DESCRIPTION */}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-600">
//               Description
//             </label>
//             <textarea
//               name="description"
//               onChange={handleChange}
//               rows="3"
//               className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Product description..."
//             />
//           </div>

//           {/* IMAGE */}
//           <div className="flex items-center gap-4">
//             <input type="file" onChange={handleFileChange} />
//             {preview && (
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="object-cover w-24 h-24 border rounded-lg shadow"
//               />
//             )}
//           </div>

//           {/* BUTTON */}
//           <button
//             type="submit"
//             className="w-full py-3 text-lg font-semibold text-white transition-all duration-200 shadow-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//           >
//             💾 Save Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ---------- Reusable Input ---------- */
// function Input({ label, name, type = "text", onChange, ...props }) {
//   return (
//     <div>
//       <label className="block mb-1 text-sm font-medium text-gray-600">
//         {label}
//       </label>
//       <input
//         type={type}
//         name={name}
//         onChange={onChange}
//         {...props}
//         className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//       />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const BASE_URL = "https://apibrize.brizindia.com/api";

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [units, setUnits] = useState([]);
  const [brands, setBrands] = useState([]);

  /* ---------------- TOKEN FROM COOKIE ---------------- */
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  /* ---------------- AXIOS AUTH (FIXED) ---------------- */
  const axiosAuth = () => {
    const token = getCookie("access_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
  };

  /* ---------------- FORM CHANGE ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- FILE CHANGE ---------------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------- FETCH UNITS ---------------- */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/units`, axiosAuth())
      .then((res) => setUnits(res.data))
      .catch((err) =>
        console.error("Units error", err.response?.data || err.message)
      );
  }, []);

  /* ---------------- FETCH BRANDS ---------------- */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/company`, axiosAuth())
      .then((res) => setBrands(res.data))
      .catch((err) =>
        console.error("Brands error", err.response?.data || err.message)
      );
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (image) data.append("image", image);

      await axios.post(`${BASE_URL}/res-products`, data, {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          Accept: "application/json",
        },
      });

      router.push("/resturant/restroproducts/product");
    } catch (err) {
      console.error("Create product error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-3xl p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          ➕ Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Product Name"
              name="product_name"
              onChange={handleChange}
              required
            />

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Brand
              </label>
              <select
                name="brand"
                onChange={handleChange}
                required
                className="w-full p-2.5 border rounded-lg"
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="MRP"
              name="mrp"
              type="number"
              onChange={handleChange}
            />
            <Input label="HSN" name="hsn" onChange={handleChange} />
            <Input
              label="Tax Rate (%)"
              name="tax_rate"
              type="number"
              onChange={handleChange}
            />

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Unit
              </label>
              <select
                name="default_unit"
                onChange={handleChange}
                required
                className="w-full p-2.5 border rounded-lg"
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.unit_name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Expiry Date"
              name="expires"
              type="date"
              onChange={handleChange}
            />
          </div>

          <textarea
            name="description"
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border rounded-lg"
            placeholder="Product description..."
          />

          <input type="file" onChange={handleFileChange} />
          {preview && <img src={preview} className="w-24 h-24" />}

          <button className="w-full py-3 text-white bg-blue-600 rounded-xl">
            💾 Save Product
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Input ---------- */
function Input({ label, name, type = "text", onChange, ...props }) {
  return (
    <div>
      <label className="block mb-1 text-sm">{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        {...props}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
