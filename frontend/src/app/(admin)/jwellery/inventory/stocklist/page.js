// "use client";
// import axios from "axios";
// import { useState, useEffect, useCallback } from "react";
// import { Notyf } from "notyf"; // Import Notyf
// import "notyf/notyf.min.css";

// export default function StockListTable() {
//   const [selectedOption, setSelectedOption] = useState("Stock");
//   const [stocks, setStocks] = useState([]);
//   const [purchase, setPurchase] = useState([]);
//   const [totalPurchase, setTotalPurchase] = useState(0);
//   const notyf = new Notyf();

//   // Function to get the cookie token
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   const token = getCookie("access_token");

//   const fetchStockData = useCallback(async () => {
//     if (!token) {
//       notyf.error("Authentication token not found!");
//       return;
//     }
//     try {
//       const { data } = await axios.get("http://127.0.0.1:8000/api/stocks", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStocks(data?.stock || []);
//     } catch (error) {
//       console.error("Stock API Error:", error);
//       notyf.error("Failed to fetch stock data");
//     }
//   }, [token]);

//   const fetchPurchaseData = useCallback(async () => {
//     if (!token) {
//       notyf.error("Authentication token not found!");
//       return;
//     }
//     try {
//       const { data } = await axios.get("http://127.0.0.1:8000/api/purchase", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPurchase(data?.purchase || []);
//       setTotalPurchase(data?.purchase.length || 0);
//     } catch (error) {
//       console.error("Purchase API Error:", error);
//       notyf.error("Failed to fetch purchase data");
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchStockData();
//     fetchPurchaseData();
//   }, [fetchStockData, fetchPurchaseData]);

//   const totalQuantity = stocks.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-2 p-3 rounded-sm bg-green-600 text-white">
//         <h1 className="text-xl p-3">Stock List</h1>
//         <div className="font-bold text-2xl">
//           {selectedOption === "Stock" ? (
//             <div>Total Stock = {totalQuantity}</div>
//           ) : (
//             <div>Total Purchase = {totalPurchase}</div>
//           )}
//         </div>
//       </div>

//       <div className="mb-3">
//         <select
//           value={selectedOption}
//           onChange={(e) => setSelectedOption(e.target.value)}
//           className="px-6 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//         >
//           <option value="Stock">Stock</option>
//           <option value="Purchase">Purchase</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         {selectedOption === "Stock" ? (
//           <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
//             <thead>
//               <tr className="bg-blue-500 text-white text-left">
//                 <th className="py-2 px-4 border">Product Name</th>
//                 <th className="py-2 px-4 border">Quantity</th>
//                 <th className="py-2 px-4 border">Gross Weight</th>
//                 <th className="py-2 px-4 border">Net Weight</th>
//                 <th className="py-2 px-4 border">Rate</th>
//                 <th className="py-2 px-4 border">MRP</th>
//                 <th className="py-2 px-4 border">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stocks.length > 0 ? (
//                 stocks.map((item, index) => (
//                   <tr
//                     key={index}
//                     className="border-b hover:bg-gray-100 transition"
//                   >
//                     <td className="py-2 px-4 border">
//                       {item.product_service?.name || "N/A"}
//                     </td>
//                     <td className="py-2 px-4 border">
//                       {item.quantity || "N/A"}
//                     </td>
//                     <td className="py-2 px-4 border">
//                       {item.gross_weight || "0"}
//                     </td>
//                     <td className="py-2 px-4 border">
//                       {item.net_weight || "0"}
//                     </td>
//                     <td className="py-2 px-4 border">{item.rate || "N/A"}</td>
//                     <td className="py-2 px-4 border">{item.mrp || "N/A"}</td>
//                     <td className="py-2 px-4 border">
//                       {/* {item.product_service?.created_at
//                         ? new Date(item?.created_at).toISOString().split("T")[0]
//                         : "N/A"} */}
//                       {item.product_service?.created_at
//                         ? (() => {
//                             const date = new Date(item.created_at);
//                             const day = String(date.getDate()).padStart(2, "0");
//                             const month = String(date.getMonth() + 1).padStart(
//                               2,
//                               "0"
//                             );
//                             const year = String(date.getFullYear()).slice(-2); // Get last 2 digits
//                             return `${day}/${month}/${year}`;
//                           })()
//                         : "N/A"}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="py-2 px-4 border text-center">
//                     No Stock Data Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         ) : (
//           <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
//             <thead>
//               <tr className="bg-blue-500 text-white text-left">
//                 <th className="py-2 px-4 border">Product Name</th>
//                 <th className="py-2 px-4 border">PCS</th>
//                 <th className="py-2 px-4 border">Gross Wgt</th>
//                 <th className="py-2 px-4 border">Net Wgt</th>
//                 <th className="py-2 px-4 border">Rate</th>
//                 <th className="py-2 px-4 border">Other Chg</th>
//                 <th className="py-2 px-4 border">Disc</th>
//                 <th className="py-2 px-4 border">Disc %</th>
//                 <th className="py-2 px-4 border">GST</th>
//                 <th className="py-2 px-4 border">Taxable</th>
//                 <th className="py-2 px-4 border">Total GST</th>
//                 <th className="py-2 px-4 border">Net Amount</th>
//                 <th className="py-2 px-4 border">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {purchase.length > 0 ? (
//                 purchase.map((item, index) =>
//                   item.purchase_items.map((pItem, pIndex) => (
//                     <tr
//                       key={`${index}-${pIndex}`}
//                       className="border-b hover:bg-gray-100 transition"
//                     >
//                       <td className="py-2 px-4 border">
//                         {pItem.product_name || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border">{pItem.pcs || "N/A"}</td>
//                       <td className="py-2 px-4 border">{pItem.gwt || "0"}</td>
//                       <td className="py-2 px-4 border">{pItem.nwt || "0"}</td>
//                       <td className="py-2 px-4 border">
//                         {pItem.rate || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border">
//                         {pItem.other_chg || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border">
//                         {pItem.disc || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border">
//                         {pItem.disc_percent || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border">{pItem.gst || "N/A"}</td>
//                       <td className="py-2 px-4 border">
//                         {pItem.taxable || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border">
//                         {pItem.total_gst || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border">
//                         {pItem.net_amount || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border">
//                         {pItem.created_at
//                           ? new Date(pItem.created_at)
//                               .toISOString()
//                               .split("T")[0]
//                           : "N/A"}
//                       </td>
//                     </tr>
//                   ))
//                 )
//               ) : (
//                 <tr>
//                   <td colSpan="13" className="py-2 px-4 border text-center">
//                     No Purchase Data Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";
// import axios from "axios";
// import { useState, useEffect, useCallback } from "react";
// import { Notyf } from "notyf";
// import "notyf/notyf.min.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// export default function StockListTable() {
//   const [selectedOption, setSelectedOption] = useState("Stock");
//   const [stocks, setStocks] = useState([]);
//   const [purchase, setPurchase] = useState([]);
//   const [totalPurchase, setTotalPurchase] = useState(0);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const notyf = new Notyf();

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   const token = getCookie("access_token");

//   const fetchStockData = useCallback(async () => {
//     if (!token) {
//       notyf.error("Authentication token not found!");
//       return;
//     }
//     try {
//       const { data } = await axios.get("http://127.0.0.1:8000/api/stocks", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStocks(data?.stock || []);
//     } catch (error) {
//       console.error("Stock API Error:", error);
//       notyf.error("Failed to fetch stock data");
//     }
//   }, [token]);

//   const fetchPurchaseData = useCallback(async () => {
//     if (!token) {
//       notyf.error("Authentication token not found!");
//       return;
//     }
//     try {
//       const { data } = await axios.get("http://127.0.0.1:8000/api/purchase", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPurchase(data?.purchase || []);
//       setTotalPurchase(data?.purchase.length || 0);
//     } catch (error) {
//       console.error("Purchase API Error:", error);
//       notyf.error("Failed to fetch purchase data");
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchStockData();
//     fetchPurchaseData();
//   }, [fetchStockData, fetchPurchaseData]);


//   const handleResetDate = () => {
//     setFromDate('');
//     setToDate('');
//   };
  

//   const isWithinDateRange = (dateString) => {
//     const date = new Date(dateString);
//     return (
//       (!fromDate || date >= fromDate) &&
//       (!toDate || date <= toDate)
//     );
//   };

//   const totalQuantity = stocks
//     .filter((item) => isWithinDateRange(item.created_at))
//     .reduce((sum, item) => sum + item.quantity, 0);

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     const title = selectedOption === "Stock" ? "Stock List" : "Purchase List";
//     doc.text(title, 14, 10);

//     const data = selectedOption === "Stock"
//       ? stocks
//           .filter((item) => isWithinDateRange(item.created_at))
//           .map((item) => [
//             item.product_service?.name || "N/A",
//             item.quantity || "N/A",
//             item.gross_weight || "0",
//             item.net_weight || "0",
//             item.rate || "N/A",
//             item.mrp || "N/A",
//             item.created_at
//               ? new Date(item.created_at).toLocaleDateString()
//               : "N/A",
//           ])
//       : purchase.flatMap((item) =>
//           item.purchase_items
//             .filter((pItem) => isWithinDateRange(pItem.created_at))
//             .map((pItem) => [
//               pItem.product_name || "N/A",
//               pItem.pcs || "N/A",
//               pItem.gwt || "0",
//               pItem.nwt || "0",
//               pItem.rate || "N/A",
//               pItem.other_chg || "N/A",
//               pItem.disc || "N/A",
//               pItem.disc_percent || "N/A",
//               pItem.gst || "N/A",
//               pItem.taxable || "N/A",
//               pItem.total_gst || "N/A",
//               pItem.net_amount || "N/A",
//               pItem.created_at
//                 ? new Date(pItem.created_at).toLocaleDateString()
//                 : "N/A",
//             ])
//         );

//     const headers = selectedOption === "Stock"
//       ? [["Product", "Qty", "Gross", "Net", "Rate", "MRP", "Date"]]
//       : [["Product", "PCS", "Gross", "Net", "Rate", "Other", "Disc", "Disc%", "GST", "Taxable", "Total GST", "Net Amt", "Date"]];

//     autoTable(doc, {
//       startY: 20,
//       head: headers,
//       body: data,
//     });

//     doc.save(`${selectedOption.toLowerCase()}_list.pdf`);
//   };

//   const handleExportExcel = () => {
//     const rows = selectedOption === "Stock"
//       ? stocks
//           .filter((item) => isWithinDateRange(item.created_at))
//           .map((item) => ({
//             Product: item.product_service?.name || "N/A",
//             Quantity: item.quantity || "N/A",
//             GrossWeight: item.gross_weight || "0",
//             NetWeight: item.net_weight || "0",
//             Rate: item.rate || "N/A",
//             MRP: item.mrp || "N/A",
//             Date: item.created_at
//               ? new Date(item.created_at).toLocaleDateString()
//               : "N/A",
//           }))
//       : purchase.flatMap((item) =>
//           item.purchase_items
//             .filter((pItem) => isWithinDateRange(pItem.created_at))
//             .map((pItem) => ({
//               Product: pItem.product_name || "N/A",
//               PCS: pItem.pcs || "N/A",
//               GrossWeight: pItem.gwt || "0",
//               NetWeight: pItem.nwt || "0",
//               Rate: pItem.rate || "N/A",
//               OtherCharges: pItem.other_chg || "N/A",
//               Discount: pItem.disc || "N/A",
//               DiscountPercent: pItem.disc_percent || "N/A",
//               GST: pItem.gst || "N/A",
//               Taxable: pItem.taxable || "N/A",
//               TotalGST: pItem.total_gst || "N/A",
//               NetAmount: pItem.net_amount || "N/A",
//               Date: pItem.created_at
//                 ? new Date(pItem.created_at).toLocaleDateString()
//                 : "N/A",
//             }))
//         );

//     const worksheet = XLSX.utils.json_to_sheet(rows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, selectedOption);
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, `${selectedOption.toLowerCase()}_list.xlsx`);
//   };

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-4 p-3 rounded-sm bg-green-600 text-white">
//         <h1 className="text-xl">Stock List</h1>
//         <div className="font-bold text-2xl">
//           {selectedOption === "Stock"
//             ? `Total Stock = ${totalQuantity}`
//             : `Total Purchase = ${totalPurchase}`}
//         </div>
//       </div>

//       <div className="flex flex-wrap items-center gap-4 mb-4">
//         <select
//           value={selectedOption}
//           onChange={(e) => setSelectedOption(e.target.value)}
//           className="px-6 py-2 border rounded-md"
//         >
//           <option value="Stock">Stock</option>
//           <option value="Purchase">Purchase</option>
//         </select>

//         {/* <div className="flex items-center gap-2">
//           <label>From:</label>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => setFromDate(date)}
//             className="px-2 py-1 border rounded-md"
//             placeholderText="Start Date"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <label>To:</label>
//           <DatePicker
//             selected={toDate}
//             onChange={(date) => setToDate(date)}
//             className="px-2 py-1 border rounded-md"
//             placeholderText="End Date"
//           />
//         </div> */}
//         <div className="flex items-center gap-4 mb-4">
//   {/* Date From */}
//   <div>
//     <label className="block text-sm font-medium text-gray-700">From Date</label>
//     <input
//       type="date"
//       className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//       value={fromDate}
//       onChange={(e) => setFromDate(e.target.value)}
//     />
//   </div>

//   {/* Date To */}
//   <div>
//     <label className="block text-sm font-medium text-gray-700">To Date</label>
//     <input
//       type="date"
//       className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//       value={toDate}
//       onChange={(e) => setToDate(e.target.value)}
//     />
//   </div>

//   {/* Reset Button */}
//   <div className="pt-6">
//     <button
//       onClick={handleResetDate}
//       className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
//     >
//       Reset
//     </button>
//   </div>
// </div>


//         <button
//           onClick={handleExportPDF}
//           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//         >
//           Export PDF
//         </button>
//         <button
//           onClick={handleExportExcel}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Export Excel
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         {selectedOption === "Stock" ? (
//           <table className="min-w-full bg-white border border-gray-200 shadow rounded">
//             <thead>
//               <tr className="bg-blue-500 text-white">
//                 <th className="py-2 px-4 border">Product Name</th>
//                 <th className="py-2 px-4 border">Quantity</th>
//                 <th className="py-2 px-4 border">Gross Weight</th>
//                 <th className="py-2 px-4 border">Net Weight</th>
//                 <th className="py-2 px-4 border">Rate</th>
//                 <th className="py-2 px-4 border">MRP</th>
//                 <th className="py-2 px-4 border">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stocks.filter(item => isWithinDateRange(item.created_at)).length > 0 ? (
//                 stocks
//                   .filter(item => isWithinDateRange(item.created_at))
//                   .map((item, index) => (
//                     <tr key={index} className="hover:bg-gray-100">
//                       <td className="py-2 px-4 border">{item.product_service?.name || "N/A"}</td>
//                       <td className="py-2 px-4 border">{item.quantity || "N/A"}</td>
//                       <td className="py-2 px-4 border">{item.gross_weight || "0"}</td>
//                       <td className="py-2 px-4 border">{item.net_weight || "0"}</td>
//                       <td className="py-2 px-4 border">{item.rate || "N/A"}</td>
//                       <td className="py-2 px-4 border">{item.mrp || "N/A"}</td>
//                       <td className="py-2 px-4 border">
//                         {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
//                       </td>
//                     </tr>
//                   ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center py-4">
//                     No Stock Data Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         ) : (
//           <table className="min-w-full bg-white border border-gray-200 shadow rounded">
//             <thead>
//               <tr className="bg-blue-500 text-white">
//                 <th className="py-2 px-4 border">Product</th>
//                 <th className="py-2 px-4 border">PCS</th>
//                 <th className="py-2 px-4 border">Gross Wgt</th>
//                 <th className="py-2 px-4 border">Net Wgt</th>
//                 <th className="py-2 px-4 border">Rate</th>
//                 <th className="py-2 px-4 border">Other Chg</th>
//                 <th className="py-2 px-4 border">Disc</th>
//                 <th className="py-2 px-4 border">Disc %</th>
//                 <th className="py-2 px-4 border">GST</th>
//                 <th className="py-2 px-4 border">Taxable</th>
//                 <th className="py-2 px-4 border">Total GST</th>
//                 <th className="py-2 px-4 border">Net Amt</th>
//                 <th className="py-2 px-4 border">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {purchase.length > 0 ? (
//                 purchase.flatMap((item, index) =>
//                   item.purchase_items
//                     .filter((pItem) => isWithinDateRange(pItem.created_at))
//                     .map((pItem, pIndex) => (
//                       <tr key={`${index}-${pIndex}`} className="hover:bg-gray-100">
//                         <td className="py-2 px-4 border">{pItem.product_name || "N/A"}</td>
//                         <td className="py-2 px-4 border">{pItem.pcs || "N/A"}</td>
//                         <td className="py-2 px-4 border">{pItem.gwt || "0"}</td>
//                         <td className="py-2 px-4 border">{pItem.nwt || "0"}</td>
//                         <td className="py-2 px-4 border">{pItem.rate || "N/A"}</td>
//                         <td className="py-2 px-4 border">{pItem.other_chg || "N/A"}</td>
//                         <td className="py-2 px-4 border">{pItem.disc || "N/A"}</td>
//                         <td className="py-2 px-4 border">{pItem.disc_percent || "N/A"}</td>
//                         <td className="py-2 px-4 border">{pItem.gst || "N/A"}</td>
//                         <td className="py-2 px-4 border">{pItem.taxable || "N/A"}</td>
//                         <td className="py-2 px-4 border">{pItem.total_gst || "N/A"}</td>
//                         <td className="py-2 px-4 border">{pItem.net_amount || "N/A"}</td>
//                         <td className="py-2 px-4 border">
//                           {pItem.created_at
//                             ? new Date(pItem.created_at).toLocaleDateString()
//                             : "N/A"}
//                         </td>
//                       </tr>
//                     ))
//                 )
//               ) : (
//                 <tr>
//                   <td colSpan="13" className="text-center py-4">
//                     No Purchase Data Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }



// components/StockList.js
"use client";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import { Notyf } from "notyf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import "react-datepicker/dist/react-datepicker.css";
import "notyf/notyf.min.css";

export default function StockList() {
  const [stocks, setStocks] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const notyf = new Notyf();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? decodeURIComponent(parts.pop().split(";").shift()) : null;
  };

  const token = getCookie("access_token");

  const fetchStockData = useCallback(async () => {
    if (!token) {
      notyf.error("Token not found");
      return;
    }

    try {
      const { data } = await axios.get(" http://127.0.0.1:8000/api/stocks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks(data?.stock || []);
    } catch (err) {
      console.error("Stock API Error:", err);
      notyf.error("Failed to fetch stock data");
    }
  }, [token]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  const handleResetDate = () => {
    setFromDate("");
    setToDate("");
  };

  const isWithinDateRange = (dateString) => {
    const date = new Date(dateString);
    return (!fromDate || date >= new Date(fromDate)) && (!toDate || date <= new Date(toDate));
  };

  const filteredStocks = stocks.filter((item) => isWithinDateRange(item.created_at));
  const totalQuantity = filteredStocks.reduce((sum, item) => sum + item.quantity, 0);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock List", 14, 10);

    const headers = [["Product", "Qty", "Gross", "Net", "Rate", "MRP", "Date"]];
    const data = filteredStocks.map((item) => [
      item.product_service?.name || "N/A",
      item.quantity || "N/A",
      item.gross_weight || "0",
      item.net_weight || "0",
      item.rate || "N/A",
      item.mrp || "N/A",
      new Date(item.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, { startY: 20, head: headers, body: data });
    doc.save("stock_list.pdf");
  };

  const handleExportExcel = () => {
    const rows = filteredStocks.map((item) => ({
      Product: item.product_service?.name || "N/A",
      Quantity: item.quantity || "N/A",
      GrossWeight: item.gross_weight || "0",
      NetWeight: item.net_weight || "0",
      Rate: item.rate || "N/A",
      MRP: item.mrp || "N/A",
      Date: new Date(item.created_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "stock_list.xlsx");
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4 bg-green-600 text-white p-3 rounded">
        <h1 className="text-xl">Stock List</h1>
        <div className="font-bold text-xl">Total Stock = {totalQuantity}</div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">From Date</label>
          <input type="date" className="border rounded px-2 py-1" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">To Date</label>
          <input type="date" className="border rounded px-2 py-1" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <button onClick={handleResetDate} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mt-6">Reset</button>
        <button onClick={handleExportPDF} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-6">Export PDF</button>
        <button onClick={handleExportExcel} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-6">Export Excel</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow border">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border">Product Name</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Gross Weight</th>
              <th className="py-2 px-4 border">Net Weight</th>
              <th className="py-2 px-4 border">Rate</th>
              <th className="py-2 px-4 border">MRP</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{item.product_service?.name || "N/A"}</td>
                  <td className="py-2 px-4 border">{item.quantity}</td>
                  <td className="py-2 px-4 border">{item.gross_weight}</td>
                  <td className="py-2 px-4 border">{item.net_weight}</td>
                  <td className="py-2 px-4 border">{item.rate}</td>
                  <td className="py-2 px-4 border">{item.mrp}</td>
                  <td className="py-2 px-4 border">{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No Stock Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


