


// "use client";

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { Notyf } from "notyf";

// const CustomerForm = ({ onClose }) => {
//   const [loading, setLoading] = useState(false);
//   const [customerTypes, setCustomerTypes] = useState([]);
//   const [customerSubTypes, setCustomerSubTypes] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const { register, handleSubmit, reset, watch, setValue } = useForm();
//   const selectedCountry = watch("country");
//   const notyf = new Notyf();

//   const getToken = () => {
//     const cookie = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("access_token="));
//     return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
//   };

//   const notifyTokenMissing = () => {
//     if (typeof window !== "undefined" && window.notyf) {
//       window.notyf.error("Authentication token not found!");
//     } else {
//       console.error("Authentication token not found!");
//     }
//   };







//   useEffect(() => {
//     const fetchInitialData = async () => {
//       const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }

//       try {
//         const [typesRes, subTypesRes, countriesRes] = await Promise.all([
//           axios.get("https://api.equi.co.in/api/customerstype",
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           ),
//           axios.get("https://api.equi.co.in/api/customersubtypes",
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           ),
//           axios.get("https://countriesnow.space/api/v0.1/countries/states"), // sample country-state API
//         ]);
//         setCustomerTypes(typesRes.data.data);
//         setCustomerSubTypes(subTypesRes.data);
//         setCountries(countriesRes.data.data);
//       } catch (error) {
//         console.error(error);
//         notyf.error("Failed to fetch dropdown data!");
//       }
//     };

//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     if (selectedCountry) {
//       const countryObj = countries.find((c) => c.name === selectedCountry);
//       setStates(countryObj?.states || []);
//       setValue("state", ""); // Reset state when country changes
//     }
//   }, [selectedCountry, countries, setValue]);

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2)
//       return decodeURIComponent(parts.pop().split(";").shift());
//     return null;
//   };

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const token = getCookie("access_token");

//       const payload = {
//         ...data,
//         visit_source:"",
//         customer_type: data.customerType,          // Make sure the customer type is being sent correctly
//         customer_sub_type: data.customerSubType,   // Ensure customerSubType is being sent correctly
//         customerTypeData: data.customerType,       // If this is expected, use it correctly
//         customerSubTypeData: data.customerSubType, // Adjusted to match the backend's expected key
//       };
//       // const payload = {
//       //   ...data,
//       //   visit_source: "",
//       //   customer_type: data.customerType,
//       //   customer_sub_type: data.customerSubType,
//       // };
      
//       await axios.post("https://api.equi.co.in/api/customers", payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       notyf.success("Customer created successfully!");
//       reset();
//       onClose();
//     } catch (error) {
//       console.error(error);
//       notyf.error("Error creating customer!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 w-[700px]">
//       <h2 className="text-2xl font-bold mb-4">Add Customer</h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="flex gap-4">
//           <div className="w-1/2">
//             <label>Customer Name</label>
//             <input {...register("name", { required: true })} className="w-full border p-2 rounded" />
//           </div>
//           <div className="w-1/2">
//             <label>Phone</label>
//             <input {...register("phone", { required: true })} className="w-full border p-2 rounded" />
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <div className="w-1/2">
//             <label>Customer Type</label>
//             <select {...register("customerType", { required: true })} className="w-full border p-2 rounded">
//               <option value="">Select Type</option>
//               {customerTypes.map((type) => (
//                 <option key={type.id} value={type.id}>{type.name}</option>
//               ))}
//             </select>
//           </div>

//           <div className="w-1/2">
//             <label>Customer Sub-Type</label>
//             <select {...register("customerSubType")} className="w-full border p-2 rounded">
//               <option value="">Select Sub-Type</option>
//               {customerSubTypes.map((sub) => (
//                 <option key={sub.id} value={sub.id}>{sub.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div>
//           <label>Date of Birth</label>
//           <input {...register("dob")} type="date" className="w-full border p-2 rounded" />
//         </div>

//         <div>
//           <label>Date of Anniversary</label>
//           <input {...register("anniversary")} type="date" className="w-full border p-2 rounded" />
//         </div>

//         <div>
//           <label>Gender</label>
//           <select {...register("gender")} className="w-full border p-2 rounded">
//             <option value="">Select Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <div>
//           <label>Email</label>
//           <input {...register("email")} type="email" className="w-full border p-2 rounded" />
//         </div>

//         <div>
//           <label>Address</label>
//           <input {...register("address")} type="text" className="w-full border p-2 rounded" />
//         </div>

//         <div className="flex gap-4">
//           <div className="w-1/2">
//             <label>Country</label>
//             <select {...register("country")} className="w-full border p-2 rounded">
//               <option value="">Select Country</option>
//               {countries.map((country) => (
//                 <option key={country.name} value={country.name}>{country.name}</option>
//               ))}
//             </select>
//           </div>
//           <div className="w-1/2">
//             <label>State</label>
//             <select {...register("state")} className="w-full border p-2 rounded">
//               <option value="">Select State</option>
//               {states.map((state) => (
//                 <option key={state.name} value={state.name}>{state.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div>
//           <label>Pincode</label>
//           <input {...register("pincode")} type="text" className="w-full border p-2 rounded" />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//         >
//           {loading ? "Saving..." : "Add Customer"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CustomerForm;
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Notyf } from "notyf";
import { Country, State } from "country-state-city";
import toast from "react-hot-toast";

const CustomerForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [customerSubTypes, setCustomerSubTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const selectedCountry = watch("country");
  const notyf = new Notyf();

  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = getToken();
      if (!token) {
        toast.error("Authentication token not found!");
        return;
      }
      try {
        const [typesRes, subTypesRes] = await Promise.all([
          axios.get("https://api.equi.co.in/api/customerstype", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://api.equi.co.in/api/customersubtypes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCustomerTypes(typesRes.data.data);
        setCustomerSubTypes(subTypesRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch dropdown data!");
      }
    };

    fetchInitialData();
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry); // selectedCountry is now ISO Code (e.g., IN)
      setStates(stateList);
      setValue("state", ""); // Reset state when country changes
    }
  }, [selectedCountry, setValue]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop().split(";").shift());
    return null;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = getCookie("access_token");

      const payload = {
        ...data,
        visit_source: "",
        // customer_type: data.customerType,
        // customer_sub_type: data.customerSubType,


       
        customer_type: data.customerType,          // Make sure the customer type is being sent correctly
        customer_sub_type: data.customerSubType,   // Ensure customerSubType is being sent correctly
        customerTypeData: data.customerType,       // If this is expected, use it correctly
        customerSubTypeData: data.customerSubType,
      };

      await axios.post("https://api.equi.co.in/api/customers", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
toast.success("Customer created successfully!");
      
      reset();
      onClose();
    } catch (error) {
      // console.error(error);
      // toast.error("Error creating customer!");
       if (error.response) {
              const message = error.response.data.message || "This number already exists.";
              toast.error(message);
            } else {
              toast.error("An unexpected error occurred.");
            }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-[700px]">
      <h2 className="text-2xl font-bold mb-4">Add Customer</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name & Phone */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label>Customer Name</label>
            <input {...register("name", { required: true })} className="w-full border p-2 rounded" />
          </div>
          <div className="w-1/2">
            <label>Phone</label>
            <input {...register("phone", { required: true })} className="w-full border p-2 rounded" />
          </div>
        </div>

        {/* Type & Sub-Type */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label>Customer Type</label>
            <select {...register("customerType")} className="w-full border p-2 rounded">
              <option value="">Select Type</option>
              {customerTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label>Customer Sub-Type</label>
            <select {...register("customerSubType")} className="w-full border p-2 rounded">
              <option value="">Select Sub-Type</option>
              {customerSubTypes.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* DOB, Anniversary */}
        <div>
          <label>Date of Birth</label>
          <input {...register("dob")} type="date" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Date of Anniversary</label>
          <input {...register("anniversary")} type="date" className="w-full border p-2 rounded" />
        </div>

        {/* Gender */}
        <div>
          <label>Gender</label>
          <select {...register("gender")} className="w-full border p-2 rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="w-full">
              <label htmlFor="customerEnquiry text-gray-700">
                Purpose of Visit
              </label>
              {/* Select purpose for customer visiting the shop */}
              <select
                id="customerEnquiry"
                defaultValue="customer"
                {...register("customerEnquiry")}
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                  <option value="customer">Customer</option>
                <option value="prospective">Prospect </option>
              
              </select>
            </div>

        {/* Email, Address */}
        <div>
          <label>Email</label>
          <input {...register("email")} type="email" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Address</label>
          <input {...register("address")} type="text" className="w-full border p-2 rounded" />
        </div>

        {/* Country & State */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label>Country</label>
            <select {...register("country")} className="w-full border p-2 rounded">
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label>State</label>
            <select {...register("state")} className="w-full border p-2 rounded">
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pincode */}
        <div>
          <label>Pincode</label>
          <input {...register("pincode")} type="text" className="w-full border p-2 rounded" />
        </div>

        {/* remake */}
        <div className="w-full mr-2">
            <label htmlFor="remark" className="block mb-1 font-medium">
              Remark<span className="text-red-500">*</span>
            </label>
            <input
              id="remarke"
              {...register("remarke")}
              type="text"
              placeholder="Mention remark..."
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Saving..." : "Add Customer"}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
