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
//         " http://127.0.0.1:8000/api/partial-order",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include the token in the headers
//           },
//         }
//       );

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
//     axios.get(" http://127.0.0.1:8000/api/order").then((response) => {
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
//         " http://127.0.0.1:8000/api/partial-order",
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
//             <th className="border border-gray-300 px-4 py-2">Gross Total</th>
//             <th className="border border-gray-300 px-4 py-2">Date</th>
//             <th className="border border-gray-300 px-4 py-2">Total Price</th>
//             <th className="border border-gray-300 px-4 py-2">Tax (18%)</th>
//             <th className="border border-gray-300 px-4 py-2">
//               Customer Details
//             </th>
//             <th className="border border-gray-300 px-4 py-2">Payment</th>
//             {/* <th className="border border-gray-300 px-4 py-2">Status</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           {orderData.map((order) => {
//             const customer = order?.users?.name || "N/A";
//             const tax = (parseFloat(order.gross_total || 0) * 18) / 100; // Tax calculation (18%)
//             const payment = order?.payments?.[0];
//             const dueAmount =
//               parseFloat(order.total_price || 0) -
//               parseFloat(payment?.price || 0); // Calculate due amount
//             const customerDetails = order?.users?.customers?.[0] || {}; // Extract customer details

//             // Get the paid amount for the specific order
//             const paidAmountForOrder = paidAmounts[order.id] || 0;

//             return (
//               <tr key={order.id} className="border-b">
//                 <td className="border border-gray-300 px-4 py-2">{customer}</td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {order.billno}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {order.gross_total}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {order.created_at
//                     ? new Date(order.created_at).toLocaleDateString()
//                     : "N/A"}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {order.total_price}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {tax.toFixed(2)}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   <p>
//                     <strong>Address:</strong> {customerDetails.address || "N/A"}
//                   </p>
//                   <p>
//                     <strong>Phone:</strong> {customerDetails.phone || "N/A"}
//                   </p>
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   <p>
//                     <strong>Paid Amount:</strong> ₹{order.total_payment}
//                   </p>
//                   <p>
//                     <strong>Due Amount:</strong> ₹{order.due_payment}
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

"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { reporturl } from "@/app/lib/axios";

const BillWise = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [token, setToken] = useState(null);

  //url of billing:http://127.0.0.1:8000/jwellery/printinvoice/?id=151

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
    setToken(accessToken);
  }, []);

  // Fetch data once token is available
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/billingPurchase",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const filteredData = data.filter((item) => {
    const lowerQuery = searchQuery.toLowerCase();
    const itemDate = new Date(item.bill_date);
    const isInDateRange =
      (!startDate || new Date(startDate) <= itemDate) &&
      (!endDate || new Date(endDate) >= itemDate);
    return (
      isInDateRange &&
      (item.product_name?.toLowerCase().includes(lowerQuery) ||
        item.billno?.toLowerCase().includes(lowerQuery) ||
        item.customer_name?.toLowerCase().includes(lowerQuery) ||
        item.customer_phone?.toLowerCase().includes(lowerQuery))
    );
  });

  // ✅ PDF Download
  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Order No.",
      "Product Name",
      "Customer Name",
      "Customer Ph",
      // "Order Amt.",
      // "Qty",
      // "G Weight",
      // "N Weight",
      // "Rate",
      "Order Date",
    ];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const row = [
        index + 1,
        item.billno,
        item.product_name,
        item.customer_name,
        item.customer_phone,
        // item.total_price,
        // item.quantity,
        // item.gross_weight,
        // item.net_weight,
        // item.rate,
        item.bill_date,
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("OrderWiseReport.pdf");
  };

  // ✅ Excel Download
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        "Order No.": item.billno,
        "Product Name": item.product_name,
        "Customer Name": item.customer_name,
        "Customer Ph": item.customer_phone,
        // "Order Amt.": item.total_price,
        // Quantity: item.quantity,
        // "G Weight": item.gross_weight,
        // "N Weight": item.net_weight,
        // Rate: item.rate,
        "Order Date": item.bill_date,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OrderWiseReport");
    XLSX.writeFile(workbook, "OrderWiseReport.xlsx");
  };

  // Show loading or auth error if token is not present
  if (!token) {
    return (
      <div className="p-6 text-center text-red-500 font-bold">
        Authentication token not found!
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">Order wise Report</p>
        <div>
          <button
            onClick={downloadPDF}
            className="mr-5 text-4xl text-red-500 hover:scale-110 transition"
          >
            <FaFilePdf />
          </button>
          <button
            onClick={downloadExcel}
            className="mr-5 text-4xl text-green-500 hover:scale-110 transition"
          >
            <BsFiletypeXls />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex items-center space-x-6 shadow-lg bg-white p-4 rounded-lg">
        <input
          type="date"
          className="w-56 h-12 border border-gray-300 rounded-lg text-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="w-56 h-12 border border-gray-300 rounded-lg text-lg"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600"
          onClick={() => {}}
        >
          Search
        </button>
        <button
          className="bg-red-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-red-600"
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
        >
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Customer name / Order no. / Phone / Product name..."
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left bg-white rounded-lg shadow-lg">
          <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
            <tr>
              <th className="py-3 px-4 border-b">S.No</th>
              <th className="py-3 px-4 border-b">Order No.</th>
              {/* <th className="py-3 px-4 border-b">Product Name</th> */}
              <th className="py-3 px-4 border-b">Customer Name</th>
              <th className="py-3 px-4 border-b">Customer Ph</th>
              {/* <th className="py-3 px-4 border-b">Order Amt.</th> */}
              {/* <th className="py-3 px-4 border-b">Qty</th> */}
              {/* <th className="py-3 px-4 border-b">G Wgt</th> */}
              {/* <th className="py-3 px-4 border-b">N Wgt</th> */}
              {/* <th className="py-3 px-4 border-b">Rate</th> */}
              <th className="py-3 px-4 border-b">Order Date</th>
              <th className="py-3 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              .filter((items) => items.order_slip !=0)
              .map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{index + 1}</td>
                  <td className="py-3 px-4 border-b">{item.billno}</td>
                  {/* <td className="py-3 px-4 border-b">{item.product_name}</td> */}
                  <td className="py-3 px-4 border-b">{item.customer_name}</td>
                  <td className="py-3 px-4 border-b">{item.customer_phone}</td>
                  {/* <td className="py-3 px-4 border-b">{item.total_price}</td> */}
                  {/* <td className="py-3 px-4 border-b">{item.quantity}</td> */}
                  {/* <td className="py-3 px-4 border-b">{item.gross_weight}</td> */}
                  {/* <td className="py-3 px-4 border-b">{item.net_weight}</td> */}
                  {/* <td className="py-3 px-4 border-b">{item.rate}</td> */}
                  <td className="py-3 px-4 border-b">{item.bill_date}</td>
                  <td className="py-3 px-4 border-b">
                    <a
                      href={`${reporturl}/jwellery/invoiceSlip/?id=${item.pdf_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      OrderSlip
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillWise;
