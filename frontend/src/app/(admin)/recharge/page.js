// "use client";
// import React, { useEffect, useState } from "react";
// // import { getCoin } from "@/app/components/config"; // Replace with your actual API config
// import {getCoin} from "../../components/config";
// import axios from "axios";
// import toast from "react-hot-toast";
// const RechargeUI = () => {
//   const [rechargeOptions, setRechargeOptions] = useState([]);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("online"); // Default to 'online'
//   const [loading, setLoading] = useState(false);
//   // Fetch recharge options from API
//   useEffect(() => {
//     const fetchRechargeOptions = async () => {
//       try {
//         const response = await getCoin();
//         setRechargeOptions(response.data);

//         // Set the default selection to the first option
//         if (response.data.length > 0) {
//           setSelectedOption(response.data[0]); // Default to first option
//         }
//       } catch (error) {
//         console.error("Error fetching recharge options:", error);
//       }
//     };

//     fetchRechargeOptions();
//   }, []);

//   // Handle option selection
//   const handleOptionClick = (option) => {
//     setSelectedOption(option); // Update selected option
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!selectedOption) {
//       alert("Please select a recharge option first!");

//       return;
//     }

//     // Function to get the token from cookies
//     const getCookie = (name) => {
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
//       if (parts.length === 2) {
//         return decodeURIComponent(parts.pop().split(";").shift());
//       }
//       return null;
//     };

//     const token = getCookie("access_token"); // Fetch the access token from cookies

//     if (!token) {
//       alert("Authentication token is missing. Please log in again.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const payload = {
//         coins: selectedOption.name,
//         amount: selectedOption.amount,
//         payment_method: paymentMethod,
//       };
//       console.log(payload);

//       // Add the token to the request headers
//       const response = await axios.post(
//         " http://127.0.0.1:8000/api/coinpurchase", // Laravel API endpoint
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass the token as a Bearer token
//           },
//         }
//       );
// console.log("recharge response", response?.data?.message);
// toast.success("Recharge successful!");
//       // alert(`Recharge successful: ${response.data.message}`);
//     } catch (error) {
//       console.error("Error submitting payment:", error);
//       toast.error("Payment failed! Please try again.");
//       // alert("Payment failed! Please try again.");
//     } finally {
//       setLoading(false);
//     }
//     window.location.href = "/dashboard";
//   };

//   return (
//     <div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
//       {/* Header */}
//       <div className="text-lg font-semibold text-gray-700 mb-4">
//         Recharge:{" "}
//         <span className="text-red-500">
//           Save around 25% with a lower third-party service fee.
//         </span>
//       </div>

//       {/* Recharge Options */}
//       <div className="grid grid-cols-5 gap-4 mb-6">
//         {rechargeOptions.map((option, index) => (
//           <div
//             key={index}
//             onClick={() => handleOptionClick(option)}
//             className={`border rounded-lg p-4 text-center cursor-pointer ${
//               selectedOption && selectedOption.id === option.id
//                 ? "border-yellow-400 bg-yellow-100"
//                 : "border-gray-300"
//             }`}
//           >
//             <div className="text-2xl font-bold text-yellow-500">
//               {option.name}
//             </div>
//             <div className="text-sm text-gray-500">${option.amount}</div>
//           </div>
//         ))}
//       </div>

//       {/* Payment Method */}
//       <div className="mb-6">
//         <label className="block text-gray-700 font-medium mb-2">
//           Select Payment Method
//         </label>
//         <div className="flex items-center space-x-4">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="online"
//               checked={paymentMethod === "online"}
//               onChange={() => setPaymentMethod("online")}
//               className="mr-2"
//             />
//             Online
//           </label>
//           <label className="flex items-center">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="cash"
//               checked={paymentMethod === "cash"}
//               onChange={() => setPaymentMethod("cash")}
//               className="mr-2"
//             />
//             Cash
//           </label>
//         </div>
//       </div>

//       {/* Total Amount and Submit */}
//       <div className="flex justify-between items-center">
//         <div className="text-lg font-medium">
//           Total: ${selectedOption ? selectedOption.amount : "0.00"}
//         </div>
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className={`${
//             loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
//           } text-white py-2 px-6 rounded-lg`}
//         >
//           {loading ? "Processing..." : "Submit Payment"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RechargeUI;

// "use client";
// import React, { useEffect, useState } from "react";
// // import { getCoin } from "@/app/components/config"; // Replace with your actual API config
// import { getCoin } from "../../components/config";
// import axios from "axios";
// import toast from "react-hot-toast";
// const RechargeUI = () => {
//   const [rechargeOptions, setRechargeOptions] = useState([]);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("online"); // Default to 'online'
//   const [loading, setLoading] = useState(false);
//   // Fetch recharge options from API
//   useEffect(() => {
//     const fetchRechargeOptions = async () => {
//       try {
//         const response = await getCoin();
//         setRechargeOptions(response.data);

//         // Set the default selection to the first option
//         if (response.data.length > 0) {
//           setSelectedOption(response.data[0]); // Default to first option
//         }
//       } catch (error) {
//         console.error("Error fetching recharge options:", error);
//       }
//     };

//     fetchRechargeOptions();
//   }, []);

//   // Handle option selection
//   const handleOptionClick = (option) => {
//     setSelectedOption(option); // Update selected option
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!selectedOption) {
//       alert("Please select a recharge option first!");

//       return;
//     }

//     // Function to get the token from cookies
//     const getCookie = (name) => {
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
//       if (parts.length === 2) {
//         return decodeURIComponent(parts.pop().split(";").shift());
//       }
//       return null;
//     };

//     const token = getCookie("access_token"); // Fetch the access token from cookies

//     if (!token) {
//       alert("Authentication token is missing. Please log in again.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const payload = {
//         coins: selectedOption.name,
//         amount: selectedOption.amount,
//         payment_method: paymentMethod,
//       };
//       console.log(payload);

//       // Add the token to the request headers
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/coinpurchase", // Laravel API endpoint
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass the token as a Bearer token
//           },
//         }
//       );
//       console.log("recharge response", response?.data?.message);
//       toast.success("Recharge successful!");
//       // alert(`Recharge successful: ${response.data.message}`);
//     } catch (error) {
//       console.error("Error submitting payment:", error);
//       toast.error("Payment failed! Please try again.");
//       // alert("Payment failed! Please try again.");
//     } finally {
//       setLoading(false);
//     }
//     window.location.href = "/dashboard";
//   };

//   return (
//     <div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
//       {/* Header */}
//       <div className="text-lg font-semibold text-gray-700 mb-4">
//         Recharge:{" "}
//         <span className="text-red-500">
//           Save around 25% with a lower third-party service fee.
//         </span>
//       </div>

//       {/* Recharge Options */}
//       <div className="grid grid-cols-5 gap-4 mb-6">
//         {rechargeOptions.map((option, index) => (
//           <div
//             key={index}
//             onClick={() => handleOptionClick(option)}
//             className={`border rounded-lg p-4 text-center cursor-pointer ${
//               selectedOption && selectedOption.id === option.id
//                 ? "border-yellow-400 bg-yellow-100"
//                 : "border-gray-300"
//             }`}
//           >
//             <div className="text-2xl font-bold text-yellow-500">
//               {option.name}
//             </div>
//             <div className="text-sm text-gray-500">${option.amount}</div>
//           </div>
//         ))}
//       </div>

//       {/* Payment Method */}
//       <div className="mb-6">
//         <label className="block text-gray-700 font-medium mb-2">
//           Select Payment Method
//         </label>
//         <div className="flex items-center space-x-4">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="online"
//               checked={paymentMethod === "online"}
//               onChange={() => setPaymentMethod("online")}
//               className="mr-2"
//             />
//             Online
//           </label>
//           <label className="flex items-center">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="cash"
//               checked={paymentMethod === "cash"}
//               onChange={() => setPaymentMethod("cash")}
//               className="mr-2"
//             />
//             Cash
//           </label>
//         </div>
//       </div>

//       {/* Total Amount and Submit */}
//       <div className="flex justify-between items-center">
//         <div className="text-lg font-medium">
//           Total: ${selectedOption ? selectedOption.amount : "0.00"}
//         </div>
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className={`${
//             loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
//           } text-white py-2 px-6 rounded-lg`}
//         >
//           {loading ? "Processing..." : "Submit Payment"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RechargeUI;




'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QrImagePreview = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/qr/upload')
      .then(res => {
        if (res.data && res.data.data?.cover) {
          setImageUrl(res.data.data.cover);
          setMessage(res.data.message);
        }
      })
      .catch(err => {
        setMessage('Failed to load QR image');
        console.error(err);
      });
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded text-center">
      <h2 className="text-lg font-bold mb-4">QR Code</h2>

      {message && <p className="mb-4 text-gray-700">{message}</p>}

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="QR Code"
          className="mx-auto border rounded w-60 h-60 object-contain"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QrImagePreview;
