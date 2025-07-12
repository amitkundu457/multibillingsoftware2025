import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import { Notyf } from "notyf";
import { useForm } from "react-hook-form";
import "react-responsive-modal/styles.css";
import "notyf/notyf.min.css"; // Import Notyf styles
import { Country, State, City } from "country-state-city";
import { GetCountries, GetCity, GetState } from "react-country-state-city";

const CustomerModal = ({
  isModalOpen,
  closeModal,
  modalType,
  currentCustomer,
  // customerTypeData,
  // customerSubTypeData,
}) => {
  const [loading, setLoading] = useState(false);
  // const[customerType, setCustomerType] = useState([])
  // const[customerSubType, setCustomerSubType] = useState([])
  const [customerTypeData, setCustomerTypeData] = useState([]);
  const [customerSubTypeData, setCustomerSubTypeData] = useState([]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const notifyTokenMissing = () => {
    if (typeof window !== "undefined" && window.notyf) {
      window.notyf.error("Authentication token not found!");
    } else {
      console.error("Authentication token not found!");
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      dob: "",
      anniversary: "",
      email: "",
      gender: "",
      address: "",
      pincode: "",
      state: "",
      country: "",
      city: "",
      visit_source: "",
      // customerType: "",
      // customerSubType: "",
      customerTypeData: "",
      customerSubTypeData: "",

      // customer_sub_type:customerTypeData,

      // customer_type
    },
  });

  const notyf = new Notyf(); // Initialize Notyf for notifications

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Load countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry);
      setStates(stateList);
      setCities([]); // Clear cities
      setValue("state", "");
      setValue("city", "");
    }
  }, [selectedCountry, setValue]);

  // Fetch cities when state changes
  // useEffect(() => {
  //   if (selectedState && selectedCountry) {
  //     const cityList = City.getCitiesOfState(selectedCountry, selectedState);
  //     setCities(cityList);
  //     setValue("city", "");
  //   }
  // }, [selectedState, selectedCountry, setValue]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/customerstype", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCustomerTypeData(res.data.data);
      })
      .catch(() => {
        alert("Failed to fetch customer types");
      });

    axios
      .get("http://127.0.0.1:8000/api/customersubtypes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCustomerSubTypeData(res.data);
      })
      .catch(() => {
        alert("Failed to fetch customer sub-types");
      });
  }, []);
  useEffect(() => {
    // console.log("customerTypeData",customerTypeData)
    // Reset form values if it's an edit, otherwise keep defaults
    if (modalType === "edit" && currentCustomer) {
      reset(currentCustomer); // Pre-fill form for editing customer
    } else {
      reset(); // Clear the form for create
    }
  }, [modalType, currentCustomer, reset]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  // //CustomersubType Handler
  // const handlerCustomberSubType = async () => {
  //   const response = await axios.get(" http://127.0.0.1:8000/api/customersubtypes");
  //   setCustomerSubTypeData(response.data);

  //   console.log("customerSubType", data);
  // };

  // //CustomerType Handler
  // const handlerCustomberType = async () => {
  //   const response = await axios.get(" http://127.0.0.1:8000/api/customerstype");
  //   setCustomerTypeData(response?.data?.data)
  //   console.log("customerType", data);
  // };

  // useEffect(() => {
  //   handlerCustomberSubType();
  //   handlerCustomberType();
  // }, []);

  const onSubmit = async (data) => {
    try {
      console.log("data customber type", data);
      setLoading(true);
      console.log("data.....", data);
      console.log("data.customerType", data.customerType);
      const token = getCookie("access_token"); // Retrieve token

      // const payload = {
      //   ...data,
      // };
      const payload = {
        ...data,
        customer_type: data.customerType, // Mapping to backend's expected field
        customer_sub_type: data.customerSubType || null, // Ensure the sub type is sent as null if not provided
      };
      console.log("payload", payload);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
          "Content-Type": "application/json",
        },
      };

      if (modalType === "create") {
        await axios.post(
          " http://127.0.0.1:8000/api/customers",
          payload,
          config
        );
        notyf.success("Customer created successfully!");
      } else if (modalType === "edit") {
        await axios.post(
          ` http://127.0.0.1:8000/api/customers/${currentCustomer.id}`,
          payload,
          config
        );
        notyf.success("Customer updated successfully!");
      }

      closeModal();
      setLoading(false);
    } catch (error) {
      notyf.error("An error occurred while saving the customer!");
      console.error("Error saving customer:", error);
      setLoading(false);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={closeModal} center>
      <div className="p-6 w-[800px]">
        <h2 className="text-2xl font-bold mb-4">
          {modalType === "create" ? "Add Customer" : "Edit Customer"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex space-x-3">
            <div className="w-full flex justify-between">
              <div className="w-[48%]">
                <label className="block text-gray-700">Customer Name</label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-[48%]">
                <label className="block text-gray-700">Phone</label>
                <input
                  {...register("phone")}
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* <div className="flex space-x-3">
            <div className="w-[300px]">
              <label className="block text-gray-700">Phone</label>
              <input
                {...register("phone")}
                type="text"
                required
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div> */}

          {/* type ,subtype anniversary */}

          {/* {rateMaster.map((rates) => (
                    <option key={rates.id} value={rates.id}>
                      {rates.labelhere} &mdash; ({rates.rate})
                    </option>
                  ))} */}

          {/* customerTypeData:"",
      customerSubTypeData:"" */}
          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Customer Type</label>
              <select
                {...register("customerTypeData")}
                className="w-full border p-2"
              >
                <option value="">Select Customer Type</option>
                {customerTypeData?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Customer Sub Type</label>
              <select
                {...register("customerSubTypeData")}
                className="w-full border p-2"
              >
                <option value="">Select Customer Sub Type</option>
                {customerSubTypeData?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">DOB</label>
              <input
                type="date"
                {...register("dob")}
                className="w-full border p-2"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Anniversary</label>
              <input
                type="date"
                {...register("anniversary")}
                className="w-full border p-2"
              />
            </div>
          </div>

          {/* Gender Field */}
          <div className="w-full">
            <label className="block text-gray-700">Gender</label>
            <select
              {...register("gender")}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Other form fields */}
          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* sate */}
          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Address</label>
              <input
                {...register("address")}
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Pincode</label>
              <input
                {...register("pincode")}
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">State</label>
              <input
                {...register("state")}
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Country</label>
              <input
                {...register("country")}
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Country Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                {...register("country")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs">{errors.country.message}</p>
              )}
            </div>

            {/* State Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                {...register("state")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-xs">{errors.state.message}</p>
              )}
            </div>

            {/* City Field */}

            {/* <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      City <span className="text-red-500">*</span>
    </label>
    <select
      {...register("city")}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
    >
      <option value="">Select City</option>
      {cities.map((city) => (
        <option key={city.name} value={city.name}>
          {city.name}
        </option>
      ))}
    </select>
    {errors.city && (
      <p className="text-red-500 text-xs">{errors.city.message}</p>
    )}
  </div> */}
          </div>

          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-md ${
              loading ? "bg-gray-400" : "bg-blue-500"
            }`}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : modalType === "create"
              ? "Add Customer"
              : "Update Customer"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default CustomerModal;

// import React, { useEffect, useState } from "react";
// import { Modal } from "react-responsive-modal";
// import axios from "axios";
// import { Notyf } from "notyf";
// import { useForm } from "react-hook-form";
// import "react-responsive-modal/styles.css";
// import "notyf/notyf.min.css";
// import { Country, State } from "country-state-city";

// const CustomerModal = ({
//   isModalOpen,
//   closeModal,
//   modalType,
//   currentCustomer,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [customerTypeData, setCustomerTypeData] = useState([]);
//   const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);

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

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       name: "",
//       phone: "",
//       dob: "",
//       anniversary: "",
//       email: "",
//       gender: "",
//       address: "",
//       pincode: "",
//       state: "",
//       country: "",
//       visit_source: "",
//       customerTypeData: "",
//       customerSubTypeData: "",
//     },
//   });

//   const notyf = new Notyf();
//   const selectedCountry = watch("country");

//   useEffect(() => {
//     const countryList = Country.getAllCountries();
//     setCountries(countryList);
//   }, []);

//   useEffect(() => {
//     if (selectedCountry) {
//       const stateList = State.getStatesOfCountry(selectedCountry);
//       setStates(stateList);
//       setValue("state", "");
//     }
//   }, [selectedCountry, setValue]);

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }

//     axios
//       .get("http://127.0.0.1:8000/api/customerstype", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setCustomerTypeData(res.data.data))
//       .catch(() => alert("Failed to fetch customer types"));

//     axios
//       .get("http://127.0.0.1:8000/api/customersubtypes", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setCustomerSubTypeData(res.data))
//       .catch(() => alert("Failed to fetch customer sub-types"));
//   }, []);

//   useEffect(() => {
//     if (modalType === "edit" && currentCustomer) {
//       reset(currentCustomer);
//     } else {
//       reset();
//     }
//   }, [modalType, currentCustomer, reset]);

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const token = getToken();

//       const payload = {
//         ...data,
//         customer_type: data.customerTypeData,
//         customer_sub_type: data.customerSubTypeData || null,
//       };

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       };

//       if (modalType === "create") {
//         await axios.post("http://127.0.0.1:8000/api/customers", payload, config);
//         notyf.success("Customer created successfully!");
//       } else if (modalType === "edit") {
//         await axios.put(
//           `http://127.0.0.1:8000/api/customers/${currentCustomer.id}`,
//           payload,
//           config
//         );
//         notyf.success("Customer updated successfully!");
//       }

//       closeModal();
//     } catch (error) {
//       notyf.error("An error occurred while saving the customer!");
//       console.error("Error saving customer:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal open={isModalOpen} onClose={closeModal} center>
//       <div className="p-6 w-[800px]">
//         <h2 className="text-2xl font-bold mb-4">
//           {modalType === "create" ? "Add Customer" : "Edit Customer"}
//         </h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="flex space-x-3">
//             <div className="w-full flex justify-between">
//               <div className="w-[48%]">
//                 <label className="block text-gray-700">Customer Name</label>
//                 <input
//                   {...register("name")}
//                   type="text"
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="w-[48%]">
//                 <label className="block text-gray-700">Phone</label>
//                 <input
//                   {...register("phone")}
//                   type="text"
//                   required
//                   className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex space-x-3">
//             <div className="w-full">
//               <label className="block text-gray-700">Customer Type</label>
//               <select {...register("customerTypeData")} className="w-full border p-2">
//                 <option value="">Select Customer Type</option>
//                 {customerTypeData?.map((type) => (
//                   <option key={type.id} value={type.id}>
//                     {type.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="w-full">
//               <label className="block text-gray-700">Customer Sub Type</label>
//               <select {...register("customerSubTypeData")} className="w-full border p-2">
//                 <option value="">Select Customer Sub Type</option>
//                 {customerSubTypeData?.map((type) => (
//                   <option key={type.id} value={type.id}>
//                     {type.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex space-x-3">
//             <div className="w-full">
//               <label className="block text-gray-700">DOB</label>
//               <input
//                 type="date"
//                 {...register("dob")}
//                 className="w-full border p-2"
//               />
//             </div>
//             <div className="w-full">
//               <label className="block text-gray-700">Anniversary</label>
//               <input
//                 type="date"
//                 {...register("anniversary")}
//                 className="w-full border p-2"
//               />
//             </div>
//           </div>

//           <div className="w-full">
//             <label className="block text-gray-700">Gender</label>
//             <select
//               {...register("gender")}
//               className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Gender...</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           <div className="flex space-x-3">
//             <div className="w-full">
//               <label className="block text-gray-700">Email</label>
//               <input
//                 {...register("email")}
//                 type="email"
//                 className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="flex space-x-3">
//             <div className="w-full">
//               <label className="block text-gray-700">Address</label>
//               <input
//                 {...register("address")}
//                 type="text"
//                 className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="flex space-x-3">
//             <div className="w-full">
//               <label className="block text-gray-700">Country</label>
//               <select
//                 {...register("country")}
//                 onChange={(e) => setValue("country", e.target.value)}
//                 className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Country</option>
//                 {countries?.map((country) => (
//                   <option key={country.isoCode} value={country.isoCode}>
//                     {country.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="w-full">
//               <label className="block text-gray-700">State</label>
//               <select
//                 {...register("state")}
//                 onChange={(e) => setValue("state", e.target.value)}
//                 className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select State</option>
//                 {states?.map((state) => (
//                   <option key={state.isoCode} value={state.isoCode}>
//                     {state.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="w-full">
//             <label className="block text-gray-700">Pincode</label>
//             <input
//               {...register("pincode")}
//               type="text"
//               className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={closeModal}
//               className="px-4 py-2 bg-gray-400 text-white rounded"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className={`px-4 py-2 text-white rounded ${
//                 loading ? "bg-gray-500" : "bg-blue-500"
//               }`}
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default CustomerModal;
