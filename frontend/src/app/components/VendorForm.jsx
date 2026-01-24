// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function VendorForm({ refresh, editData, clearEdit }) {
//   const [formData, setFormData] = useState({
//     vendor_name: "",
//     category: "",
//     email: "",
//     password: "",
//     phone: "",
//     address: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const isEdit = Boolean(editData?.id);

//   useEffect(() => {
//     if (isEdit) {
//       setFormData({
//         vendor_name: editData.vendor_name,
//         category: editData.category,
//         email: editData.email,
//         password: "",
//         phone: editData.phone,
//         address: editData.address,
//       });
//     }
//   }, [editData]);

// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   return parts.length === 2 ? parts.pop().split(";").shift() : null;
// };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const token = getCookie("access_token");

//     try {
//       if (isEdit) {
//         await axios.put(
//           `https://apibrize.brizindia.com/api/vendor/update/${editData.id}`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setSuccess("Vendor updated successfully!");
//       } else {
//         await axios.post(
//           "https://apibrize.brizindia.com/api/vendor/store",
//           formData,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setSuccess("Vendor created successfully!");
//       }

//       setFormData({
//         vendor_name: "",
//         category: "",
//         email: "",
//         password: "",
//         phone: "",
//         address: "",
//       });

//       refresh();
//       clearEdit();
//     } catch (error) {
//       if (error.response?.status === 409) {
//         setError("Email already exists!");
//       } else {
//         setError("Something went wrong.");
//       }
//     }
//   };

//   return (
//     <div className="max-w-xl p-6 bg-white rounded shadow-lg">
//       <h2 className="mb-4 text-2xl font-bold">
//         {isEdit ? "Update Vendor" : "Create Vendor"}
//       </h2>

//       {error && (
//         <p className="p-2 mb-2 text-red-600 bg-red-100 rounded">{error}</p>
//       )}
//       {success && (
//         <p className="p-2 mb-2 text-green-600 bg-green-100 rounded">
//           {success}
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Vendor Name */}
//         <div>
//           <label className="block font-medium">Vendor Name</label>
//           <input
//             type="text"
//             name="vendor_name"
//             value={formData.vendor_name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         {/* Category */}
// <div>
//   <label className="block font-medium">Vendor Category</label>
//   <select
//     name="category"
//     value={formData.category}
//     onChange={handleChange}
//     className="w-full p-2 border rounded"
//     required
//   >
//     <option value="">Select Category</option>
//     <option value="canteen">Canteen</option>
//     <option value="tea_center">Tea</option>
//     <option value="resturant">Resturant</option>
//   </select>
// </div>

//         {/* Email */}
//         <div>
//           <label className="block font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         {/* Password (only show in create) */}
//         {!isEdit && (
//           <div>
//             <label className="block font-medium">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//         )}

//         {/* Phone */}
//         <div>
//           <label className="block font-medium">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         {/* Address */}
//         <div>
//           <label className="block font-medium">Address</label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           ></textarea>
//         </div>

//         <button
//           type="submit"
//           className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
//         >
//           {isEdit ? "Update Vendor" : "Create Vendor"}
//         </button>

//         {isEdit && (
//           <button
//             type="button"
//             onClick={clearEdit}
//             className="px-4 py-2 ml-3 text-white bg-gray-500 rounded"
//           >
//             Cancel Edit
//           </button>
//         )}
//       </form>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Country, State, City } from "country-state-city";

export default function VendorForm({
  isEdit = false,
  // editData = null,
  onSuccess = () => {}, // Callback to refresh vendor list
  onClose = () => {},

  refresh,
  editData,
  clearEdit,
}) {
  const [form, setForm] = useState({
    business_name: "",
    vendor_name: "",
    category: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    gst: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  /* ---------------- PREFILL FOR EDIT ---------------- */
  useEffect(() => {
    setCountries(Country.getAllCountries());

    if (isEdit && editData) {
      setForm({
        business_name: editData.business_name ?? "",
        vendor_name: editData.vendor_name ?? "",
        category: editData.category ?? "",
        email: editData.email ?? "",
        password: "",
        phone: editData.phone ?? "",
        address: editData.address ?? "",
        country: editData.country ?? "",
        state: editData.state ?? "",
        city: editData.city ?? "",
        gst: editData.gst ?? "",
        pincode: editData.pincode ?? "",
      });

      if (editData.country) {
        setStates(State.getStatesOfCountry(editData.country));
      }
      if (editData.state) {
        setCities(City.getCitiesOfState(editData.country, editData.state));
      }
    }
  }, [isEdit, editData]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Country → Reset states/cities
    if (name === "country") {
      setStates(State.getStatesOfCountry(value));
      setCities([]);
      setForm({ ...form, country: value, state: "", city: "" });
      return;
    }

    // State → Reset city
    if (name === "state") {
      setCities(City.getCitiesOfState(form.country, value));
      setForm({ ...form, state: value, city: "" });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  /* ---------------- RESET FORM ---------------- */
  const resetForm = () => {
    setForm({
      business_name: "",
      vendor_name: "",
      category: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      gst: "",
      pincode: "",
    });
    setStates([]);
    setCities([]);
    setError("");
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = getCookie("access_token");

    if (!token) {
      setError("Authentication token missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await axios.put(
          `https://apibrize.brizindia.com/api/vendor/update/${editData.id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "https://apibrize.brizindia.com/api/vendor/store",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        resetForm();
        // Reset after create
      }
      refresh();
      clearEdit();
      onSuccess(); // Refresh vendor list
      onClose();
    } catch (err) {
      if (err.response?.status === 409) setError("Email already exists");
      else setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-lg"
    >
      <h3 className="mb-6 text-xl font-bold text-gray-800">
        {isEdit ? "Update Vendor" : "Create Vendor"}
      </h3>

      {error && <p className="mb-4 font-medium text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Business Name */}
        <div>
          <label className="font-medium text-gray-700 label">
            Business Name *
          </label>
          <input
            type="text"
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Vendor Name */}
        <div>
          <label className="font-medium text-gray-700 label">
            Vendor Name *
          </label>
          <input
            type="text"
            name="vendor_name"
            value={form.vendor_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="font-medium text-gray-700 label">Category *</label>
          {/* <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Category</option>
            <option value="canteen">Canteen</option>
            <option value="tea_center">Tea Center</option>
            <option value="resturant">Resturant</option>
          </select> */}

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Category</option>
            <option value="canteen">Canteen</option>
            <option value="tea_center">Tea Center</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="font-medium text-gray-700 label">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isEdit}
            className="w-full px-3 py-2 border border-gray-300 rounded input bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Password */}
        {!isEdit && (
          <div>
            <label className="font-medium text-gray-700 label">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="font-medium text-gray-700 label">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* GST */}
        <div>
          <label className="font-medium text-gray-700 label">GST</label>
          <input
            type="text"
            name="gst"
            value={form.gst}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Country */}
        <div>
          <label className="font-medium text-gray-700 label">Country</label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="font-medium text-gray-700 label">State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            disabled={!form.country}
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="font-medium text-gray-700 label">City</label>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            disabled={!form.state}
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pincode */}
        <div>
          <label className="font-medium text-gray-700 label">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label className="font-medium text-gray-700 label">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded input focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 transition border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 font-medium text-white transition bg-green-600 rounded-md hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
