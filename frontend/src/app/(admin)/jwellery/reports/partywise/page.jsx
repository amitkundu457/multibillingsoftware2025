// "use client";
// import React, { useEffect, useState } from "react";
// import { FaFilePdf } from "react-icons/fa6";
// import { BsFiletypeXls } from "react-icons/bs";
// import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";

// const Home = () => {
//   const [data, setData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const getCookie = (name) => {
//       const value = `; ${document.cookie}`
//       const parts = value.split(`; ${name}=`);
//       if (parts.length === 2) {
//         return decodeURIComponent(parts.pop().split(";").shift());
//       }
//       return null;
//     };

//     const fetchedToken = getCookie("access_token");
//     setToken(fetchedToken);
//   }, []);

//   useEffect(() => {
//     if (!token) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("https://api.equi.co.in/api/partyreport", {
//           headers: { authorization: `Bearer ${token}` },
//         });
//         setData(response?.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token]);

//   const filteredData = data.filter((item) => {
//     const lowerQuery = searchQuery.toLowerCase();
//     const itemDate = new Date(item.date);
//     const isInDateRange =
//       (!startDate || new Date(startDate) <= itemDate) &&
//       (!endDate || new Date(endDate) >= itemDate);

//     return (
//       isInDateRange &&
//       (
//         item.bill_no?.toLowerCase().includes(lowerQuery) ||
//         item.supplier_name?.toLowerCase().includes(lowerQuery) ||
//         item.payment_mode?.toLowerCase().includes(lowerQuery) ||
//         item.voucher_no?.toLowerCase().includes(lowerQuery) ||
//         item.product_name?.toLowerCase().includes(lowerQuery)
//       )
//     );
//   });

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     const tableColumn = [
//       "S.No", "Bill No.", "Supplier Name", "Payment Mode", "Voucher No", "Product Name",
//       "Quantity", "Gross Wgt", "Net Wgt", "Rate", "GST%", "Taxable Amt", "GST Amt", "Total Amt", "Purchase Date"
//     ];
//     const tableRows = [];

//     filteredData.forEach((item, index) => {
//       const row = [
//         index + 1,
//         item.bill_no || "",
//         item.supplier_name || "",
//         item.payment_mode || "",
//         item.voucher_no || "",
//         item.product_name || "",
//         item.quantity || "",
//         item.gross_weight || "",
//         item.net_weight || "",
//         item.rate || "",
//         item.gst_percent || "",
//         item.taxable_amount || "",
//         item.total_gst || "",
//         item.total_amount || "",
//         item.date || "",
//       ];
//       tableRows.push(row);
//     });

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//       styles: { fontSize: 8 },
//     });

//     doc.save("Partywisereport.pdf");
//   };

//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredData.map((item, index) => ({
//         "S.No": index + 1,
//         "Bill No.": item.bill_no || "",
//         "Supplier Name": item.supplier_name || "",
//         "Payment Mode": item.payment_mode || "",
//         "Voucher No": item.voucher_no || "",
//         "Product Name": item.product_name || "",
//         Quantity: item.quantity || "",
//         "Gross Wgt": item.gross_weight || "",
//         "Net Wgt": item.net_weight || "",
//         Rate: item.rate || "",
//         "GST %": item.gst_percent || "",
//         "Taxable Amt": item.taxable_amount || "",
//         "GST Amt": item.total_gst || "",
//         "Total Amt": item.total_amount || "",
//         "Purchase Date": item.date || "",
//       }))
//     );

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Partywisereport");
//     XLSX.writeFile(workbook, "Partywisereport.xlsx");
//   };

//   if (token === null) {
//     // still checking for token
//     return <div className="p-4 text-gray-600">Checking authentication...</div>;
//   }

//   if (!token) {
//     // token not found
//     return <p className="text-red-500 p-4">Authentication token not found!</p>;
//   }

//   return (
//     <div className="mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">

//       {/* Header */}
//       <div className="flex space-x-7 bg-gray-200 py-6 px-8 rounded-lg shadow-md">
//         <p className="font-bold text-2xl text-gray-800">Partywise Report</p>
//         <div>
//           <button
//             onClick={downloadPDF}
//             className="mr-5 text-4xl text-red-500 hover:scale-110 transition"
//           >
//             <FaFilePdf />
//           </button>
//           <button
//             onClick={downloadExcel}
//             className="mr-5 text-4xl text-green-500 hover:scale-110 transition"
//           >
//             <BsFiletypeXls />
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="mt-8 flex items-center space-x-6 shadow-lg bg-white p-4 rounded-lg">
//         <input
//           type="date"
//           className="w-56 h-12 border border-gray-300 rounded-lg text-lg"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//         />
//         <input
//           type="date"
//           className="w-56 h-12 border border-gray-300 rounded-lg text-lg"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//         />
//         <button
//           className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600"
//           onClick={() => {}}
//         >
//           Search
//         </button>
//         <button
//           className="bg-red-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-red-600"
//           onClick={() => {
//             setStartDate("");
//             setEndDate("");
//           }}
//         >
//           Reset
//         </button>
//       </div>

//       {/* Search */}
//       <div className="mt-6">
//         <input
//           type="text"
//           placeholder="Search by Party name/bill no. /Payment Mode/product name..."
//           className="w-full h-12 border border-gray-300 rounded-lg px-4 text-lg"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Table or Loader */}
//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           <p className="ml-4 text-gray-600 text-lg">Loading data...</p>
//         </div>
//       ) : (
//         <div className="mt-6 overflow-x-auto">
//           <table className="w-full min-w-[1500px] text-left bg-white rounded-lg shadow-lg">
//             <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-poppins">
//               <tr>
//                 <th className="py-3 px-4 border-b">S.No</th>
//                 <th className="py-3 px-4 border-b">Bill no.</th>
//                 <th className="py-3 px-4 border-b">Supplier Name</th>
//                 <th className="py-3 px-4 border-b">Payment Mode</th>
//                 <th className="py-3 px-4 border-b">Vch No</th>
//                 <th className="py-3 px-4 border-b">Product Name</th>
//                 <th className="py-3 px-4 border-b">Qty</th>
//                 <th className="py-3 px-4 border-b">g_wgt</th>
//                 <th className="py-3 px-4 border-b">n_wgt</th>
//                 <th className="py-3 px-4 border-b">Rate</th>
//                 <th className="py-3 px-4 border-b">GST%</th>
//                 <th className="py-3 px-4 border-b">Taxable amt</th>
//                 <th className="py-3 px-4 border-b">GST amt</th>
//                 <th className="py-3 px-4 border-b">Total Amt</th>
//                 <th className="py-3 px-4 border-b">Purchase Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((item, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="py-3 px-4 border-b">{index + 1}</td>
//                   <td className="py-3 px-4 border-b">{item.bill_no}</td>
//                   <td className="py-3 px-4 border-b">{item.supplier_name}</td>
//                   <td className="py-3 px-4 border-b">{item.payment_mode}</td>
//                   <td className="py-3 px-4 border-b">{item.voucher_no}</td>
//                   <td className="py-3 px-4 border-b">{item.product_name}</td>
//                   <td className="py-3 px-4 border-b">{item.quantity}</td>
//                   <td className="py-3 px-4 border-b">{item.gross_weight}</td>
//                   <td className="py-3 px-4 border-b">{item.net_weight}</td>
//                   <td className="py-3 px-4 border-b">{item.rate}</td>
//                   <td className="py-3 px-4 border-b">{item.gst_percent}</td>
//                   <td className="py-3 px-4 border-b">{item.taxable_amount}</td>
//                   <td className="py-3 px-4 border-b">{item.total_gst}</td>
//                   <td className="py-3 px-4 border-b">{item.total_amount}</td>
//                   <td className="py-3 px-4 border-b">{item.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;



"use client";
import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import axios from "axios";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { reporturl } from "@/app/lib/axios";

const Page = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("https://api.equi.co.in/api/customers", {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log("Customers:",res);
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch Report Data
  const fetchReportData = async () => {
    try {
      // "https://api.equi.co.in/api/partyreport" https://api.equi.co.in/api/agentsalesreport
      setLoading(true);
      const result = await axios.get("https://api.equi.co.in/api/partyreport", {
        headers: { authorization: `Bearer ${token}` },
      });
console.log("reslut",result)
      setData(result.data);
      setFilteredData(result.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const filtered = data.filter((item) => {
      console.log("filter here",item)
      const orderDate = new Date(item.order_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchDate = (!start || orderDate >= start) && (!end || orderDate <= end);
      const matchCustomer = !selectedCustomer || item.customer_id == selectedCustomer;
      console.log("selectedcutomber",selectedCustomer)
      console.log("item.customer_id",item.customer_id)

      return matchDate && matchCustomer;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    setIsClient(true);
    const t = getCookie("access_token");
    if (!t) {
      console.error("Authentication token not found!");
      return;
    }
    setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      fetchReportData();
      fetchCustomers();
    }
  }, [token]);

  useEffect(() => {
    handleFilter();
  }, [startDate, endDate, selectedCustomer, data]);

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCustomer("");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Agent Name",
      "Bill No",
      "Customer Name",
      "Qty",
      "Amount",
      "Order Date",
    ];
    const tableRows = filteredData.map((item, index) => [
      index + 1,
      item.agent_name || "-",
      item.billno || "-",
      item.customer_name || "-",
      item.total_qty || "-",
      item.total_price || "-",
      item.order_date ? format(new Date(item.order_date), "dd/MM/yyyy") : "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("AgentSaleReport.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        "Agent Name": item.agent_name,
        "Bill No": item.billno,
        "Customer Name": item.customer_name,
        Qty: item.total_qty,
        Amount: item.total_price,
        "Order Date": item.order_date
          ? format(new Date(item.order_date), "dd/MM/yyyy")
          : "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AgentSaleReport");
    XLSX.writeFile(workbook, "AgentSaleReport.xlsx");
  };

  if (!isClient) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white py-4 px-6 rounded-lg shadow-md">
        <h1 className="font-bold text-2xl text-gray-800"> Customer Wise Report</h1>
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
      <div className="mt-8 flex flex-wrap gap-4 items-center bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-48 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg px-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-48 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg px-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose Customer
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-52 h-12 border border-gray-300 rounded-lg text-gray-700 text-lg px-3"
          >
            <option value="">Select Customer</option>
            {customers?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="h-12 px-4 mt-5 text-white bg-red-500 hover:bg-red-600 rounded-lg"
        >
          Reset Date Filters
        </button>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        {loading ? (
          <div className="text-center text-lg font-medium text-gray-600 py-10">
            Loading...
          </div>
        ) : (
          <table className="w-full text-left bg-white rounded-lg shadow-md">
            <thead className="bg-blue-500 text-black rounded-sm font-semibold">
              <tr>
                {[
                  "S.No",
                  "Agent Name",
                  "Bill No",
                  "Customer Name",
                  "Qty",
                  "Amount",
                  "Date",
                  "Action",
                ].map((heading, index) => (
                  <th
                    key={index}
                    className="py-3 px-4 border-b text-sm md:text-base"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition text-gray-700"
                  >
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">{item.agent_name}</td>
                    <td className="py-3 px-4 border-b">{item.billno}</td>
                    <td className="py-3 px-4 border-b">{item.customer_name}</td>
                    <td className="py-3 px-4 border-b">{item.total_qty}</td>
                    <td className="py-3 px-4 border-b">{item.total_price}</td>
                    <td className="py-3 px-4 border-b">
                      {item.order_date
                        ? format(new Date(item.order_date), "dd-MM-yyyy")
                        : ""}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <a
                        href={`${reporturl}/jwellery/printinvoice/?id=${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        BillPdf
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 px-4 border-b text-center" colSpan={9}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
