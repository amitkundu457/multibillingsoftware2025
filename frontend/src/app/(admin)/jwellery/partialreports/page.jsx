// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Modal } from "react-responsive-modal";
// import "react-responsive-modal/styles.css";

// const PartialOrder = () => {
//   const [orderData, setOrderData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOption, setSelectedOption] = useState("");
//   const [dueAmount, setDueAmount] = useState(0);
//   const [remainingAmount, setRemainingAmount] = useState(dueAmount);
//   const [userId, setUserId] = useState([]);
//   const [orderId, setOrderId] = useState(0);
//   const [paymentData, setPaymentData] = useState({
//     price: 0,
//     date: "",
//     payment_method: "",
//   });

//   const [paidAmounts, setPaidAmounts] = useState({}); // Store paid amounts for each order

//   const paymentOption = ["Cash", "Card", "Upi", "Adjust", "Advance"];
//   const [open, setOpen] = useState(false);

//   const openModal = (dueAmount, customerId, orderId) => {
//     setDueAmount(dueAmount);
//     setOrderId(orderId);
//     setPaymentData({ ...paymentData, dueAmount, orderId, customerId });
//     setOpen(true);
//   };

//   const closeModal = () => setOpen(false);

//   // Function to retrieve a cookie by name
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   useEffect(() => {
//     fetchOrderData();
//   }, []); // Empty dependency array ensures this runs only once when the component mounts

//   const fetchOrderData = async () => {
//     const token = getCookie("access_token"); // Retrieve the token from cookies

//     try {
//       if (!token) {
//         throw new Error("No token found. Please log in to access this data.");
//       }

//       const response = await axios.get(
//         " https://api.equi.co.in/api/partial-order",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include the token in the headers
//           },
//         }
//       );
// console.log("response",response);
//       if (response.status === 200) {
//         setOrderData(response.data.data || []); // Set the fetched data or empty array
//       } else {
//         throw new Error("Failed to fetch order data. Please try again later.");
//       }
//     } catch (err) {
//       console.error("Error fetching order data:", err.message);
//       setError(err.message || "An unknown error occurred.");
//     } finally {
//       setLoading(false); // Stop loading regardless of success or error
//     }
//   };
//   // Fetch user ID
//   useEffect(() => {
//     axios.get(" https://api.equi.co.in/api/order").then((response) => {
//       setUserId(response.data.id);
//     });
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Show loading indicator
//   }

//   if (error) {
//     return <div>Error: {error}</div>; // Show error message if fetching fails
//   }

//   const paymentMethod = async () => {
//     try {
//       const today = new Date();
//       const paymentDate = today.toISOString().split("T")[0];
//       const dataPost = {
//         order_id: paymentData.orderId,
//         customer_id: paymentData.customerId,
//         payment_date: paymentDate,
//         payment_method: selectedOption,
//         price: paymentData.price,
//       };

//       const response = await axios.post(
//         " https://api.equi.co.in/api/partial-order",
//         dataPost
//       );

//       if (response.status === 201) {
//         // Update the paid amount for the specific order
//         setPaidAmounts((prevPaidAmounts) => ({
//           ...prevPaidAmounts,
//           [paymentData.orderId]:
//             (prevPaidAmounts[paymentData.orderId] || 0) + paymentData.price,
//         }));

//         // Update remainingAmount after payment is made
//         const newRemainingAmount = dueAmount - paymentData.price;
//         setRemainingAmount(newRemainingAmount);

//         // Now increase the dueAmount by ₹250 for the specific order (as per the requirement)
//         const newDueAmount = dueAmount + 250;
//         setDueAmount(newDueAmount);
//         fetchOrderData();
//         alert("Payment processed successfully!");
//         closeModal();
//       } else {
//         alert("Payment processing failed");
//       }
//     } catch (error) {
//       console.error("Error processing payment", error);
//       alert("An error occurred while processing the payment.");
//     }
//   };

//   const handleAmountChange = (e) => {
//     const enteredAmount = parseFloat(e.target.value) || 0; // Ensure a valid number
//     setPaymentData({ ...paymentData, price: enteredAmount });

//     // Correctly update remainingAmount:
//     const updatedRemainingAmount = dueAmount - enteredAmount;
//     setRemainingAmount(updatedRemainingAmount);
//   };

//   return (
//     <div>
//       <h1 className="text-lg font-bold mb-4">Partial Orders</h1>
//       <table className="table-auto w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100 border-b">
//             <th className="border border-gray-300 px-4 py-2">Customer Name</th>
//             <th className="border border-gray-300 px-4 py-2">Bill No</th>
//             {/* <th className="border border-gray-300 px-4 py-2">Gross Total</th> */}
//             <th className="border border-gray-300 px-4 py-2">Date</th>
//             <th className="border border-gray-300 px-4 py-2">Total Price</th>
//             {/* <th className="border border-gray-300 px-4 py-2">Tax (18%)</th> */}
//             <th className="border border-gray-300 px-4 py-2">
//               Customer Ph:
//             </th>
//             <th className="border border-gray-300 px-4 py-2">Payment</th>
//             {/* <th className="border border-gray-300 px-4 py-2">Status</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           {orderData.map((order) => {
            // const customer = order?.users?.name || "N/A";
            // const tax = (parseFloat(order.gross_total || 0) * 18) / 100; // Tax calculation (18%)
            // const payment = order?.payments?.[0];
            // const dueAmount =
            //   parseFloat(order.total_price || 0) -
            //   parseFloat(payment?.price || 0); // Calculate due amount
            // const customerDetails = order?.users?.customers?.[0] || {}; // Extract customer details

            // // Get the paid amount for the specific order
            // const paidAmountForOrder = paidAmounts[order.id] || 0;

//             return (
//               <tr key={order.id} className="border-b">
//                 <td className="border border-gray-300 px-4 py-2">{customer}</td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {order.billno}
//                 </td>
//                 {/* <td className="border border-gray-300 px-4 py-2">
//                   {order.gross_total}
//                 </td> */}
//                 <td className="border border-gray-300 px-4 py-2">
//                   {order.created_at
//                     ? new Date(order.created_at).toLocaleDateString()
//                     : "N/A"}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {order.total_price}
//                 </td>
//                 {/* <td className="border border-gray-300 px-4 py-2">
//                   {tax.toFixed(2)}
//                 </td> */}
//                 <td className="border border-gray-300 px-4 py-2">
//                   {/* <p>
//                     <strong>Address:</strong> {customerDetails.address || "N/A"}
//                   </p> */}
//                   <p>
//                     {customerDetails.phone || "N/A"}
//                   </p>
                // </td>
                // <td className="border border-gray-300 px-4 py-2">
                //   <p>
                //     <strong>Paid Amount:</strong> ₹{order.total_payment}
                //   </p>
                //   <p>
                //     <strong>Due Amount:</strong> ₹{order.due_payment}
                //   </p>
                //   <p>
                //     <strong>Total Price:</strong> ₹{order.total_price}
                //   </p>
                //   {order.due_payment == 0 ? (
                //     <p className="bg-green-700 text-white p-2 w-[4rem] rounded">
                //       Paid
                //     </p>
                //   ) : (
                //     <button
                //       className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                //       onClick={() =>
                //         openModal(dueAmount, order.users.id, order.id)
                //       }
                //     >
                //       Make Payment
                //     </button>
                //   )}
                // </td>
//                 {/* <td className="border border-gray-300 px-4 py-2">
//                   {dueAmount > 0 ? "Pending" : "Paid"}
//                 </td> */}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <Modal open={open} onClose={closeModal} center>
//         <div className="p-6 bg-white rounded-lg shadow-md">
//           <strong className="text-lg font-semibold block mb-2 text-gray-800">
//             Bill Amount
//           </strong>
//           <p>{orderId}</p>
//           <p className="text-xl font-bold text-green-600">
//             ₹{dueAmount.toFixed(2)}
//           </p>

//           {/* Payment Options */}
//           <div className="mt-6">
//             <p className="text-gray-700 font-medium mb-2">
//               Choose Payment Option:
//             </p>
//             <div className="flex gap-4">
//               {paymentOption.map((option) => (
//                 <button
//                   key={option}
//                   className={`px-4 py-2 rounded-lg transition ${
//                     selectedOption === option
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-gray-800"
//                   } hover:bg-blue-400`}
//                   onClick={() => setSelectedOption(option)}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Cash Amount Input */}
//           <div className="mt-6">
//             <label
//               htmlFor="amount"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Enter Amount
//             </label>
//             <input
//               type="number"
//               name="amount"
//               value={paymentData.price}
//               onChange={handleAmountChange}
//               className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>

//           {/* Remaining Amount */}
//           <p className="mt-4 text-gray-700 font-medium">
//             Remaining Amount:{" "}
//             <span className="font-bold text-red-600">
//               ₹{remainingAmount.toFixed(2)}
//             </span>
//           </p>

//           {/* Action Buttons */}
//           <div className="flex justify-between mt-6">
//             <button
//               className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 font-medium hover:bg-gray-400"
//               onClick={closeModal}
//             >
//               Back
//             </button>
//             <button
//               onClick={paymentMethod}
//               className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
//             >
//               Payment
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default PartialOrder;

// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Modal } from "react-responsive-modal";
// import "react-responsive-modal/styles.css";

// const PartialOrder = () => {
//   const [orderData, setOrderData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOption, setSelectedOption] = useState("Cash");
//   const [dueAmount, setDueAmount] = useState(0);
//   const [remainingAmount, setRemainingAmount] = useState(dueAmount);
//   const [orderId, setOrderId] = useState(0);
//   const [paymentData, setPaymentData] = useState({
//     price: 0,
//     date: "",
//     payment_method: "",
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [paidAmounts, setPaidAmounts] = useState({});
//   const paymentOption = ["Cash", "Card", "Upi", "Others"];
//   const [open, setOpen] = useState(false);

// //   const openModal = (dueAmount, customerId, orderId) => {
// //     setDueAmount(dueAmount);
// //     setOrderId(orderId);
// //     setPaymentData({ ...paymentData, dueAmount, orderId, customerId });
// //     setOpen(true);
// //   };

// const openModal = (dueAmount, customerId, orderId) => {
//     setDueAmount(dueAmount);
//     setRemainingAmount(dueAmount); // important!
//     setOrderId(orderId);
//     setSelectedOption("Cash"); // reset
//     setPaymentData({
//       price: 0,
//       date: "",
//       payment_method: "",
//       customerId,
//       orderId,
//     });
//     setOpen(true);
//   };
  
// //   const closeModal = () => setOpen(false);
// const closeModal = () => {
//     setSelectedOption("");
//     setPaymentData({ price: 0, date: "", payment_method: "" });
//     setOpen(false);
//   };

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   useEffect(() => {
//     fetchOrderData();
//   }, []);

//   const fetchOrderData = async () => {
//     const token = getCookie("access_token");

//     try {
//       if (!token) {
//         throw new Error("No token found.");
//       }

//       const response = await axios.get(
//         "https://api.equi.co.in/api/partial-order",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         setOrderData(response.data.data || []);
//       } else {
//         throw new Error("Failed to fetch order data.");
//       }
//     } catch (err) {
//       setError(err.message || "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const paymentMethod = async () => {
//     try {
//       const today = new Date();
//       const paymentDate = today.toISOString().split("T")[0];
//       const dataPost = {
//         order_id: paymentData.orderId,
//         customer_id: paymentData.customerId,
//         payment_date: paymentDate,
//         payment_method: selectedOption,
//         price: paymentData.price,
//       };

//       const response = await axios.post(
//         "https://api.equi.co.in/api/partial-order",
//         dataPost
//       );

//       if (response.status === 201) {
//         setPaidAmounts((prev) => ({
//           ...prev,
//           [paymentData.orderId]:
//             (prev[paymentData.orderId] || 0) + paymentData.price,
//         }));

//         const newRemainingAmount = dueAmount - paymentData.price;
//         setRemainingAmount(newRemainingAmount);

//         const newDueAmount = dueAmount;
//         setDueAmount(newDueAmount);
//         fetchOrderData();
//         alert("Payment processed successfully!");
//         closeModal();
//       } else {
//         alert("Payment failed.");
//       }
//     } catch (error) {
//       alert("Error processing payment.");
//     }
//   };

//   const handleAmountChange = (e) => {
//     const enteredAmount = parseFloat(e.target.value) || 0;
//     setPaymentData({ ...paymentData, price: enteredAmount });
//     const updatedRemainingAmount = dueAmount - enteredAmount;
//     setRemainingAmount(updatedRemainingAmount);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="p-4">
//       <h1 className="text-lg font-bold mb-4">Partial Orders</h1>

//       {/* Search and Date Filter */}
//       <div className="flex flex-wrap gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by customer name, phone, or bill no"
//           className="border px-4 py-2 rounded w-full sm:w-[300px]"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//         />
//         <div>
//           <label className="block text-sm font-medium">From Date</label>
//           <input
//             type="date"
//             className="border px-4 py-2 rounded"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">To Date</label>
//           <input
//             type="date"
//             className="border px-4 py-2 rounded"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>
//       </div>

//       <table className="table-auto w-full border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border px-4 py-2">Customer Name</th>
//             <th className="border px-4 py-2">Bill No</th>
//             <th className="border px-4 py-2">Date</th>
//             <th className="border px-4 py-2">Total Price</th>
//             <th className="border px-4 py-2">Customer Phone</th>
//             <th className="border px-4 py-2">Payment</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orderData
//             .filter((order) => {
//               const name = order?.users?.name?.toLowerCase() || "";
//               const phone = order?.users?.customers?.[0]?.phone || "";
//               const billno = order?.billno?.toLowerCase() || "";
//               const createdDate = new Date(order.created_at);
//               const searchMatch =
//                 name.includes(searchTerm) ||
//                 phone.includes(searchTerm) ||
//                 billno.includes(searchTerm);
//               const dateMatch =
//                 (!fromDate || createdDate >= new Date(fromDate)) &&
//                 (!toDate || createdDate <= new Date(toDate + "T23:59:59"));
//               return searchMatch && dateMatch;
//             })
//             .map((order) => {
//             //   const customer = order?.users?.name || "N/A";
//             //   const payment = order?.payments?.[0];
//             //   const dueAmount =
//             //     parseFloat(order.total_price || 0) -
//             //     parseFloat(payment?.price || 0);
//             //   const customerDetails = order?.users?.customers?.[0] || {};
//             const customer = order?.users?.name || "N/A";
//             const tax = (parseFloat(order.gross_total || 0) * 18) / 100; // Tax calculation (18%)
//             const payment = (order?.payments?.[0])
//             const dueAmount =(order?.due_payment)
//             //   parseFloat(order.total_price || 0) -
//             //   parseFloat(payment?.price || 0); // Calculate due amount
//             const customerDetails = order?.users?.customers?.[0] || {}; // Extract customer details

//             // Get the paid amount for the specific order
//             const paidAmountForOrder = paidAmounts[order.id] || 0;

//               return (
//                 <tr key={order.id}>
//                   <td className="border px-4 py-2">{customer}</td>
//                   <td className="border px-4 py-2">{order.billno}</td>
//                   <td className="border px-4 py-2">
//                     {order.created_at
//                       ? new Date(order.created_at).toLocaleDateString()
//                       : "N/A"}
//                   </td>
//                   <td className="border px-4 py-2">{order.total_price}</td>
//                   <td className="border px-4 py-2">
//                     {customerDetails.phone || "N/A"}
//                   </td>
//                   {/* <td className="border px-4 py-2">
//                     <p>
//                       <strong>Paid:</strong> ₹{order.total_payment}
//                     </p>
//                     <p>
//                       <strong>Due:</strong> ₹{order.due_payment}
//                     </p>
//                     {order.due_payment == 0 ? (
//                       <span className="bg-green-600 text-white px-2 py-1 rounded inline-block mt-1">
//                         Paid
//                       </span>
//                     ) : (
//                       <button
//                         onClick={() =>
//                           openModal(dueAmount, order.users.id, order.id)
//                         }
//                         className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//                       >
//                         Make Payment
//                       </button>
//                     )}
//                   </td> */}
                                 
//                 <td className="border border-gray-300 px-4 py-2">
//                   <p>
//                     <strong>Paid Amount:</strong> ₹{(order.total_payment).toFixed(1)}
//                   </p>
//                   <p>
//                     <strong>Due Amount:</strong> ₹{(order.due_payment).toFixed(1)}
//                   </p>
//                   <p>
//                     <strong>Total Price:</strong> ₹{order.total_price}
//                   </p>
//                   {order.due_payment == 0 ? (
//                     <p className="bg-green-700 text-white p-2 w-[4rem] rounded">
//                       Paid
//                     </p>
//                   ) : (
//                     <button
//                       className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
//                       onClick={() =>
//                         openModal(dueAmount, order.users.id, order.id)
//                       }
//                     >
//                       Make Payment
//                     </button>
//                   )}
//                 </td>
//                 </tr>
//               );
//             })}
//         </tbody>
//       </table>
// {/* 
      
//       <Modal open={open} onClose={closeModal} center>
//         <div className="p-6 bg-white rounded-lg shadow-md">
//           <p className="text-lg font-semibold">Due Amount: ₹{dueAmount}</p>

//           <div className="mt-4">
//             <p className="mb-2 font-medium">Select Payment Option:</p>
//             <div className="flex flex-wrap gap-2">
//               {paymentOption.map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => setSelectedOption(option)}
//                   className={`px-3 py-1 rounded ${
//                     selectedOption === option
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200"
//                   }`}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mt-4">
//             <label className="block font-medium mb-1">Enter Amount</label>
//             <input
//               type="number"
//               value={paymentData.price}
//               onChange={handleAmountChange}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//           <p className="mt-3">
//             Remaining Amount: ₹
//             <strong className="text-red-600">
//               {remainingAmount.toFixed(2)}
//             </strong>
//           </p>

//           <div className="flex justify-end gap-4 mt-6">
//             <button
//               className="bg-gray-300 px-4 py-2 rounded"
//               onClick={closeModal}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-green-600 text-white px-4 py-2 rounded"
//               onClick={paymentMethod}
//             >
//               Pay Now
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }; */}
// <Modal open={open} onClose={closeModal} center>
// <div className="p-6 bg-white rounded-lg shadow-md">
//   <strong className="text-lg font-semibold block mb-2 text-gray-800">
//     Bill Amount
//   </strong>
//   <p>{orderId}</p>
//   <p className="text-xl font-bold text-green-600">
//     ₹{dueAmount.toFixed(2)}
//   </p>

//   {/* Payment Options */}
//   <div className="mt-6">
//     <p className="text-gray-700 font-medium mb-2">
//       Choose Payment Option:
//     </p>
//     <div className="flex gap-4">
//       {paymentOption.map((option) => (
//         <button
//           key={option}
//           className={`px-4 py-2 rounded-lg transition ${
//             selectedOption === option
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 text-gray-800"
//           } hover:bg-blue-400`}
//           onClick={() => setSelectedOption(option)}
//         >
//           {option}
//         </button>
//       ))}
//     </div>
//   </div>

//   {/* Cash Amount Input */}
//   <div className="mt-6">
//     <label
//       htmlFor="amount"
//       className="block text-gray-700 font-medium mb-1"
//     >
//       Enter Amount
//     </label>
//     <input
//       type="number"
//       name="amount"
//       value={paymentData.price}
//       onChange={handleAmountChange}
//       className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//     />
//   </div>

//   {/* Remaining Amount */}
//   <p className="mt-4 text-gray-700 font-medium">
//     Remaining Amount:{" "}
//     <span className="font-bold text-red-600">
//       ₹{remainingAmount.toFixed(2)}
//     </span>
//   </p>

//   {/* Action Buttons */}
//   <div className="flex justify-between mt-6">
//     <button
//       className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 font-medium hover:bg-gray-400"
//       onClick={closeModal}
//     >
//       Back
//     </button>
//     <button
//       onClick={paymentMethod}
//       className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
//     >
//       Payment
//     </button>
//   </div>
// </div>
// </Modal>
// </div>
// );
// };

// export default PartialOrder;



"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import toast from "react-hot-toast";
const PartialOrder = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Cash");
  const [dueAmount, setDueAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [orderId, setOrderId] = useState(0);
  const[isPaying,setIsPaying]=useState(false);
  const [paymentData, setPaymentData] = useState({
    price: 0,
    date: "",
    payment_method: "",
    customerId: 0,
    orderId: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paidAmounts, setPaidAmounts] = useState({});
  const paymentOption = ["Cash", "Card", "Upi", "Others"];
  const [open, setOpen] = useState(false);

  const openModal = (dueAmount, customerId, orderId) => {
    setDueAmount(dueAmount);
    setRemainingAmount(dueAmount);
    setOrderId(orderId);
    setSelectedOption("Cash");
    setPaymentData({
      price: 0,
      date: "",
      payment_method: "Cash",
      customerId,
      orderId,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setSelectedOption("Cash");
    setPaymentData({
      price: 0,
      date: "",
      payment_method: "Cash",
      customerId: 0,
      orderId: 0,
    });
    setOpen(false);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    const token = getCookie("access_token");

    try {
      if (!token) throw new Error("No token found.");
      const response = await axios.get("https://api.equi.co.in/api/partial-order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setOrderData(response.data.data || []);
      } else {
        throw new Error("Failed to fetch order data.");
      }
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethod = async () => {
    if(isPaying){
        toast.success("Payamnet is processing")
        return;
    }
    if (paymentData.price <= 0) {
        toast.error("Enter a valid amount greater than 0");
        return;
      }
    
      if (paymentData.price > dueAmount) {
        toast.error("Entered amount exceeds due amount.");
        return;
      }
    setIsPaying(true);
    try {
      const today = new Date();
      const paymentDate = today.toISOString().split("T")[0];

      const dataPost = {
        order_id: paymentData.orderId,
        customer_id: paymentData.customerId,
        payment_date: paymentDate,
        payment_method: selectedOption,
        price: paymentData.price,
      };

      const response = await axios.post(
        "https://api.equi.co.in/api/partial-order",
        dataPost
      );

      if (response.status === 201) {
        setPaidAmounts((prev) => ({
          ...prev,
          [paymentData.orderId]:
            (prev[paymentData.orderId] || 0) + paymentData.price,
        }));

        const newRemainingAmount = dueAmount - paymentData.price;
        setRemainingAmount(newRemainingAmount);
        setDueAmount(newRemainingAmount);

        fetchOrderData();
        toast.success("Payment processed successfully!");
        setIsPaying(false);
        closeModal();
      } else {
        toast.error("Payment failed.");
        setIsPaying(false);
      }
    } catch (error) {
      toast.error("Error processing payment.");
      setIsPaying(false);
    }
    finally {
        setIsPaying(false); // Always reset
      }
  };

  const handleAmountChange = (e) => {
    const enteredAmount = parseFloat(e.target.value) || 0;
    if (enteredAmount > dueAmount) {
        toast.error("Amount cannot exceed due amount");
        return;
      }
    setPaymentData({ ...paymentData, price: enteredAmount });
    const updatedRemainingAmount = dueAmount - enteredAmount;
    setRemainingAmount(updatedRemainingAmount);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Partial Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
       
       <div>
       <label className="block text-sm font-medium">Search</label>
       <input
          type="text"
          placeholder="Search by customer name, phone, or bill no"
          className="border px-4  rounded w-full sm:w-[300px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
       </div>
        <div>
          <label className="block text-sm font-medium">From Date</label>
          <input
            type="date"
            className="border px-4 py-2 rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">To Date</label>
          <input
            type="date"
            className="border px-4 py-2 rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Bill No</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Total Price</th>
            <th className="border px-4 py-2">Customer Phone</th>
            <th className="border px-4 py-2">Payment</th>
          </tr>
        </thead>
        <tbody>
          {orderData
            .filter((order) => {
              const name = order?.users?.name?.toLowerCase() || "";
              const phone = order?.users?.customers?.[0]?.phone || "";
              const billno = order?.billno?.toLowerCase() || "";
              const createdDate = new Date(order.created_at);
              const searchMatch =
                name.includes(searchTerm) ||
                phone.includes(searchTerm) ||
                billno.includes(searchTerm);
              const dateMatch =
                (!fromDate || createdDate >= new Date(fromDate)) &&
                (!toDate || createdDate <= new Date(toDate + "T23:59:59"));
              return searchMatch && dateMatch;
            })
            .map((order) => {
              const customer = order?.users?.name || "N/A";
              const customerDetails = order?.users?.customers?.[0] || {};
              const dueAmount = parseFloat(order?.due_payment || 0);
              const paidAmount = parseFloat(order?.total_payment || 0);
              return (
                <tr key={order.id}>
                  <td className="border px-4 py-2">{customer}</td>
                  <td className="border px-4 py-2">{order.billno}</td>
                  <td className="border px-4 py-2">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">{order.total_price}</td>
                  <td className="border px-4 py-2">
                    {customerDetails.phone || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <p><strong>Paid:</strong> ₹{paidAmount.toFixed(2)}</p>
                    <p><strong>Due:</strong> ₹{dueAmount.toFixed(2)}</p>
                    {dueAmount === 0 ? (
                      <span className="bg-green-600 text-white px-2 py-1 rounded inline-block mt-1">
                        Paid
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          openModal(dueAmount, order.users.id, order.id)
                        }
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                      >
                        Make Payment
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Modal */}
      <Modal open={open} onClose={closeModal} center>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <strong className="text-lg font-semibold block mb-2 text-gray-800">
            Bill Amount
          </strong>
          <p>{orderId}</p>
          <p className="text-xl font-bold text-green-600">
            ₹{dueAmount.toFixed(2)}
          </p>

          <div className="mt-6">
            <p className="text-gray-700 font-medium mb-2">
              Choose Payment Option:
            </p>
            <div className="flex gap-4 flex-wrap">
              {paymentOption.map((option) => (
                <button
                  key={option}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedOption === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  } hover:bg-blue-400`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-1">
              Enter Amount
            </label>
            <input
              type="number"
              value={paymentData.price}
              onChange={handleAmountChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <p className="mt-4 text-gray-700 font-medium">
            Remaining Amount:{" "}
            <span className="font-bold text-red-600">
              ₹{remainingAmount.toFixed(2)}
            </span>
          </p>

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 font-medium hover:bg-gray-400"
              onClick={closeModal}
            >
              Back
            </button>
            <button
            disabled={isPaying}
              onClick={paymentMethod}
              className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                isPaying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isPaying ? "Processing..." : "Payment"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PartialOrder;
