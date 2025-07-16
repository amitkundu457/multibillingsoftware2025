// "use client";
// import { useState, useEffect } from "react";
// import StockListTable from "../stocklist/page";
// import StockReturnsTable from "../salereturns/page";
// import axios from "axios";

// export default function PurchaseReturn() {
//   const [supplierName, setSupplierName] = useState("");
//   const [referenceNo, setReferenceNo] = useState("");
//   const [purchaseDate, setPurchaseDate] = useState("");
//   const [payments, setPayments] = useState([]);
//   const [status, setStatus] = useState("Return");
//   const [loading, setLoading] = useState(true);
//   const [stockReturns, setStockReturns] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [paymentType, setPaymentType] = useState("");
//   const [account, setAccount] = useState("");
//   const [paymentNote, setPaymentNote] = useState("");
  // const [suppliersData, setSuppliersData] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [reason, setReason] = useState("");

//   useEffect(() => {
//     const currentDate = new Date();
//     const formattedDate = currentDate.toLocaleDateString("en-CA"); // Formats to YYYY-MM-DD
//     setPurchaseDate(formattedDate);
//   }, []);

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







//   // Fetch stock returns data
//   const fetchStockReturns = async () => {
//     try {
//       const response = await fetch(
//         "https://api.equi.co.in/api/purchase-returns"
//       );
//       const data = await response.json();
//       setStockReturns(data);
//     } catch (error) {
//       console.error("Error fetching stock returns:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchStockReturns();
//   }, []);

//   //fetch supplirs list

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     axios
//       .get("https://api.equi.co.in/api/suppliers",
        
// {
//   headers: { Authorization: `Bearer ${token}` },
// }
//       )
//       .then((response) => {
//         setSuppliersData(response.data);
//         const data = response.data;
//         console.log("suppleirs Data", data);
//       }, [])
//       .catch((error) => {
//         alert("failed to load suppliers data");
//       });
//   }, []);

//   // Fetch payments and sort by date (newest first)
//   const fetchPayments = async () => {
//     try {
//       const response = await fetch(
//         "https://api.equi.co.in/api/purchase-returns"
//       );
//       const data = await response.json();
//       console.log("payment info", response);
//       // Sort payments by date (newest first)
//       const sortedPayments = data.sort(
//         (a, b) => new Date(b.date) - new Date(a.date)
//       );
//       setPayments(sortedPayments);
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//     }
//   };
//   useEffect(() => {
    
//     fetchPayments();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("purchesReturn check here ");
//     const formData = {
//       supplier_name: selectedSupplier,
//       reference_no: referenceNo,
//       date: purchaseDate,
//       status,
//       amount,
//       payment_type: paymentType,
//       payment_note: paymentNote,
//       reasons: reason,
//     };
//     console.log(formData);

//     try {
//       const response = await fetch(" https://api.equi.co.in/api/purchase-returns", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         alert("Purchase return submitted successfully!");
//         setSupplierName("");
//         setReferenceNo("");
//         setPurchaseDate(new Date().toISOString().split("T")[0]);
//         setStatus("Return");
//         setAmount("");
//         setPaymentType("");
//         setAccount("");
//         setPaymentNote("");
//         setReason("");
//         fetchPayments();
//       } else {
//         const errorData = await response.json();
//         alert(
//           "Error submitting data: " + (errorData.message || "Unknown error")
//         );
//       }
//     } catch (error) {
//       console.log(error);

//       console.error("Fetch error:", error);
//       alert("An error occurred: " + error.message);
//     }
//   };

//   const handleCancel = () => {
//     setSupplierName("");
//     setReferenceNo("");
//     setPurchaseDate(new Date().toISOString().split("T")[0]);
//     setStatus("Return");
//     setReason("");
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
//           purchase/return<span className="text-gray-500"> Stock</span>
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          // <div>
          //   <label className="block font-medium">Supplier Name *</label>
          //   <select
          //     value={selectedSupplier}
          //     onChange={(e) => setSelectedSupplier(e.target.value)}
          //     className="w-full p-2 border rounded"
          //   >
          //     <option value="">- Select Supplier -</option>
          //     {suppliersData.suppliers &&
          //       suppliersData.suppliers.map((supplier) => (
          //         <option key={supplier.id} value={supplier.name}>
          //           {supplier.name}
          //         </option>
          //       ))}
          //   </select>
          // </div>

//           <div>
//             <label className="block font-medium">Reference No.</label>
//             <input
//               type="text"
//               value={referenceNo}
//               onChange={(e) => setReferenceNo(e.target.value)}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//           <div>
//             <label className="block font-medium">Purchase Date *</label>
//             <input
//               type="date"
//               value={purchaseDate}
//               onChange={(e) => setPurchaseDate(e.target.value)}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block font-medium">Status *</label>
//             <select
//               className="w-full p-2 border rounded"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//             >
//               <option value="Return">Return</option>
//               <option value="Cancel">Cancel</option>
//             </select>
//           </div>
//         </div>
//         {/* //reason input */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
//           <div className="w-full">
//             <label className="block font-medium">
//               Any specific Reason for purchase/return stock
//             </label>

//             <input
//               type="text"
//               className=" p-2 border rounded w-full"
//               value={reason}
//               onChange={(e) => {
//                 setReason(e.target.value);
//               }}
//             />
//           </div>
//         </div>

//         <h3 className="text-lg font-semibold mt-6">
//           Previous Payments Information:
//         </h3>
//         <table className="w-full mt-2 border rounded">
//           <thead className="bg-gray-300">
//             <tr>
//               <th className="p-2">#</th>
//               <th className="p-2">Date</th>
//               <th className="p-2">Payment Type</th>
//               <th className="p-2">Payment Note</th>
//               <th className="p-2">Amount</th>
//             </tr>
//           </thead>
//           <tbody className="text-center">
//             {payments.length > 0 ? (
//               payments.map((payment, index) => (
//                 <tr key={index}>
//                   <td className="p-2">{index + 1}</td>
//                   <td className="p-2">{payment.date}</td>
//                   <td className="p-2">{payment.payment_type}</td>
//                   <td className="p-2">{payment.payment_note}</td>
//                   <td className="p-2">{payment.amount}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} className="p-4 text-gray-500">
//                   Payments Pending!!
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         <h3 className="text-lg font-semibold mt-6">Make Payment:</h3>
//         <div className="bg-gray-200 p-4 rounded-lg">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block font-medium">Amount</label>
//               <input
//                 type="text"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block font-medium">Payment Type</label>
//               <select
//                 className="w-full p-2 border rounded"
//                 value={paymentType}
//                 onChange={(e) => setPaymentType(e.target.value)}
//               >
//                 <option value="">-Select-</option>
//                 <option value="1">Cash</option>
//                 <option value="2">Accouont</option>
//                 <option value="3">Card</option>
//               </select>
//             </div>
//           </div>
//           <div className="mt-4">
//             <label className="block font-medium">Payment Note</label>
//             <textarea
//               value={paymentNote}
//               onChange={(e) => setPaymentNote(e.target.value)}
//               className="w-full p-2 border rounded"
//             ></textarea>
//           </div>
//         </div>

//         <div className="flex justify-center mt-6">
//           <button
//             className="bg-green-600 text-white py-2 px-6 rounded"
//             onClick={handleSubmit}
//           >
//             Submit
//           </button>
//           <button
//             className="bg-orange-500 text-white py-2 px-6 rounded ml-4"
//             onClick={handleCancel}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PurchaseReturn() {
  const [supplierName, setSupplierName] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("Return");
  const [loading, setLoading] = useState(true);
  const [stockReturns, setStockReturns] = useState([]);
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [account, setAccount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [reason, setReason] = useState("");
  const [productServiceId, setProductServiceId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [producstList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliersData, setSuppliersData] = useState([]);
  const paymentsPerPage = 5;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const token = getCookie("access_token");

  useEffect(() => {
    setPurchaseDate(new Date().toISOString().split("T")[0]);
  }, []);

  // supplier data fetching
  useEffect(() => {
    // const token = getToken();
    // if (!token) {
    //   notifyTokenMissing();
    //   return;
    // }
    axios
      .get("https://api.equi.co.in/api/suppliers",
        
{
  headers: { Authorization: `Bearer ${token}` },
}
      )
      .then((response) => {
        setSuppliersData(response.data);
        const data = response.data;
        console.log("suppleirs Data", data);
      }, [])
      .catch((error) => {
        alert("failed to load suppliers data");
      });
  }, []);

  useEffect(() => {
    const fetchSalesReturn = async () => {
      try {
        const response = await axios.get("https://api.equi.co.in/api/saloon-purchase-returns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStockReturns(response.data);
      } catch (error) {
        console.error("Error fetching stock returns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalesReturn();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("https://api.equi.co.in/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomerData(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const featchProductsList = async () => {
    try {
      const res = await axios.get(
        "https://api.equi.co.in/api/product-service-saloon?pro_ser_type=Product",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProductList(res?.data);
    } catch (error) {
      console.error("Fetch products failed:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    featchProductsList();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("https://api.equi.co.in/api/saloon-purchase-returns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedPayments = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setPayments(sortedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      customer_name: selectedSupplier,
      reference_no: referenceNo,
      date: purchaseDate,
      status,
      amount,
      payment_type: paymentType,
      payment_note: paymentNote,
      reason,
      product_service_id: productServiceId,
      quantity,
    };

    try {
      await axios.post("https://api.equi.co.in/api/saloon-purchase-return", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Sale return submitted successfully!");
      handleCancel();
      fetchPayments();
    } catch (error) {
      console.error("Error submitting sale return:", error);
      alert("Error submitting data: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setSupplierName("");
    setReferenceNo("");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setStatus("Return");
    setAmount("");
    setPaymentType("");
    setAccount("");
    setPaymentNote("");
    setReason("");
    setProductServiceId("");
    setQuantity("");
  };

  // Pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gradient-to-b from-white to-gray-100 min-h-screen">
      <div className="max-full mx-auto bg-white p-6 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-4">
        purchase/return Stock
        </h2>

        {/* Form and Inputs Here (as you already wrote) */}
         {/* Customer Name and Reference No */}
         <div className="flex flex-col md:flex-row gap-4 mt-4">
          {/* <div className="flex-1">
            <label className="block font-medium">Customer Name</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">- Select customer -</option>
              {customerData.map((supplier) => (
                <option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="flex-1">
            <label className="block font-medium">Supplier Name *</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">- Select Supplier -</option>
              {suppliersData.suppliers &&
                suppliersData.suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </option>
                ))}
            </select>
          </div>
          

          <div className="flex-1">
            <label className="block font-medium">Reference No.</label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Date and Status */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1">
            <label className="block font-medium">Purchase Date *
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Status *</label>
            <select
              className="w-full p-2 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Return">Return</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div className="mt-4">
          <label className="block font-medium">Reason for Return</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Product and Quantity */}
        <div className="flex  md:flex-row gap-4 mt-4">
          <div className="flex-1">
            <label className="block font-medium">Product/Service ID *</label>
            <select
              name="product_service_id"
              value={productServiceId}
              onChange={(e) => setProductServiceId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Product</option>
              {producstList.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name} (ID: {item.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block font-medium">Quantity *</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />
          </div>
        </div>

        {/* Payment Info */}
        <h3 className="text-lg font-semibold mt-6">Make Payment:</h3>
        <div className="bg-gray-200 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-medium">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium">Payment Type</label>
              <select
                className="w-full p-2 border rounded"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="">-Select-</option>
                <option value="1">Cash</option>
                <option value="2">Account</option>
                <option value="3">Card</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block font-medium">Payment Note</label>
            <textarea
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-green-600 text-white py-2 px-6 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-orange-500 text-white py-2 px-6 rounded ml-4"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>

        {/* Payments Table */}
        <h3 className="text-lg font-semibold mt-8 mb-2">Previous Payments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded shadow-sm">
            <thead className="bg-gray-300">
              <tr>
                <th className="p-2">SI.NO</th>
                <th className="p-2">Product</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Payment Type</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Reason</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {currentPayments.length > 0 ? (
                currentPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-2">{indexOfFirstPayment + index + 1}</td>
                    <td className="p-2">{payment.product?.name}</td>
                    <td className="p-2">{payment.quantity}</td>
                    <td className="p-2">{payment?.saloon_purchase_return_payments?.payment_type}</td>
                    <td className="p-2">{payment?.saloon_purchase_return_payments?.amount}</td>
                    <td className="p-2">{payment.reason}</td>
                    <td className="p-2">{payment.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-gray-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


