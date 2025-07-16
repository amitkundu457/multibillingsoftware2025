







// "use client";
// import React, { useEffect, useState } from "react";
// import { FaFilePdf } from "react-icons/fa6";
// import { BsFiletypeXls } from "react-icons/bs";
// import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { reporturl } from "@/app/lib/axios";
// // Optional: Replace this with your notification system if notyf is not defined globally
// const notyf = {
//   error: (msg) => alert(msg),
// };

// const Home = () => {
//   const [data, setData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   // Get token from cookie
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   const token = getCookie("access_token");

//   useEffect(() => {
//     if (!token) {
//       notyf.error("Authentication token not found!");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const response = await axios.get("https://api.equi.co.in/api/saloon-order-cash", {
//           headers: { authorization: `Bearer ${token}` },
//         });
//         console.log("Fetched saloon dailycash:", response.data);  
//         setData(response.data.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [token]);
//   const filteredData = data.filter((item) => {
//     const lowerQuery = searchQuery.toLowerCase();
//     const itemDate = new Date(item.created_at); // Use created_at for date filtering
//     const isInDateRange =
//       (!startDate || new Date(startDate) <= itemDate) &&
//       (!endDate || new Date(endDate) >= itemDate);
  
//     return (
//       isInDateRange &&
//       (
//         item.billno?.toLowerCase().includes(lowerQuery) ||
//         item.users?.name?.toLowerCase().includes(lowerQuery)
//       )
//     );
//   });
  
  

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     const tableColumn = [
//       "S.No",
//       "Bill No.",
//       // "Product Name",
//       "Customer Name",
//       // "Payment Mode",
//       // "Total Payment",
//       "Payment Date",
//     ];
//     const tableRows = [];

//     filteredData.forEach((item, index) => {
//       const row = [
//         index + 1,
//         item.billno || "",
//         // item.product_name || "",
//         item.customer_name || "",
//         // item.payment_method || "",
//         // item.price || "",
//         item.payment_date || "",
//       ];
//       tableRows.push(row);
//     });

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//     });

//     doc.save("PaymentReport.pdf");
//   };

//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredData.map((item, index) => ({
//         "S.No": index + 1,
//         "Bill No.": item.billno || "",
//         // "Product Name": item.product_name || "",
//         "Customer Name": item.customer_name || "",
//         // "Payment Mode": item.payment_method || "",
//         // "Total Payment": item.price || "",
//         "Payment Date": item.payment_date || "",
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentReport");
//     XLSX.writeFile(workbook, "PaymentReport.xlsx");
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center bg-gray-200 py-6 px-8 rounded-lg shadow-md">
//         <p className="font-bold text-2xl text-gray-800">Tax Report</p>
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

//       {/* Search Input */}
//       <div className="mt-6">
//         <input
//           type="text"
//           placeholder="Search by Customer name / bill no...."
//           className="w-full h-12 border border-gray-300 rounded-lg px-4 text-lg"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       <div className="mt-6 overflow-x-auto">
//         <table className="w-full text-left bg-white rounded-lg shadow-lg">
//           <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold">
//             <tr>
//               <th className="py-3 px-4 border-b">S.No</th>
//               <th className="py-3 px-4 border-b">Bill no.</th>
//               {/* <th className="py-3 px-4 border-b">Product Name</th> */}
//               <th className="py-3 px-4 border-b">Customer Name</th>
//               <th className="py-3 px-4 border-b">GST Amount</th>
//               <th className="py-3 px-4 border-b">Pymt Date</th>
//               <th className="py-3 px-4 border-b">Action</th>
            
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((item, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="py-3 px-4 border-b">{index + 1}</td>
//                 <td className="py-3 px-4 border-b">{item.billno}</td>
//                 {/* <td className="py-3 px-4 border-b">{item.product_name}</td> */}
//                 <td className="py-3 px-4 border-b">{item.users?.name}</td>
//                 <td className="py-3 px-4 border-b">{item.totaltax==null?"NA":item.totaltax}</td>
//                 {/* <td className="py-3 px-4 border-b">{item.price}</td> */}
//                 <td className="py-3 px-4 border-b">{item.created_at?.slice(0,10)}</td>
//                 <td className="py-3 px-4 border-b">
//                   <a
//                     href={`${reporturl}/saloon/printinvoice/?id=${item.id}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     prints
//                   </a>
//                 </td>
              
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Home;



"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import { BiSolidPrinter } from "react-icons/bi";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
// import { reporturl } from "../../../../lib/axios";
import { reporturl } from "@/app/lib/axios";

const BillWise = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [token, setToken] = useState(null);

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

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.equi.co.in/api/parcel-billReport",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(" response for billing",response);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);
  useEffect(() => {
    console.log("All bill_inv values:", data.map((item) => item.bill_inv));
  }, [data]);
  const filteredData = data
    .filter((item) => item.order_slip !== 1)
    .filter((item) => {
      const lowerQuery = searchQuery.toLowerCase();
      const itemDate = new Date(item.bill_date);
      const isInDateRange =
        (!startDate || new Date(startDate) <= itemDate) &&
        (!endDate || new Date(endDate) >= itemDate);

      const matchesSearch =
        item.product_name?.toLowerCase().includes(lowerQuery) ||
        item.billno?.toLowerCase().includes(lowerQuery) ||
        item.customer_name?.toLowerCase().includes(lowerQuery) ||
        item.customer_phone?.toLowerCase().includes(lowerQuery);
        const matchesFilter =
        filterType === "All"
          ? true
          : filterType === "Invoice"
          ? Number(item.bill_inv) !== 1
          : Number(item.bill_inv) === 1;

      return isInDateRange && matchesSearch && matchesFilter;
    });

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Bill No.",
      // "Product Name",
      "Customer Name",
      "Customer Ph",
      // "Bill Amt.",
      // "Qty",
      // "G Weight",
      // "N Weight",
      // "Rate",
      "Billing Date",
    ];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const row = [
        index + 1,
        item.billno,
        // item.product_name,
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

    doc.save("BillWiseReport.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        "Bill No.": item.billno,
        // "Product Name": item.product_name,
        "Customer Name": item.customer_name,
        "Customer Ph": item.customer_phone,
        // "Bill Amt.": item.total_price,
        // "Quantity": item.quantity,
        // "G Weight": item.gross_weight,
        // "N Weight": item.net_weight,
        // Rate: item.rate,
        "Billing Date": item.bill_date,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BillWiseReport");
    XLSX.writeFile(workbook, "BillWiseReport.xlsx");
  };

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
        <p className="font-bold text-2xl text-gray-800">Pacel Billing</p>
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
        {/* <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-12 border border-gray-300 rounded-lg text-lg px-4"
        >
          <option value="All">All</option>
          <option value="Invoice">Tax Invoice</option>
          <option value="Estimate">Estimate</option>
        </select> */}
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
            setSearchQuery("");
            setFilterType("All");
          }}
        >
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Customer name / Bill no. / Phone / Product name..."
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
              <th className="py-3 px-4 border-b">Bill No.</th>
              <th className="py-3 px-4 border-b">Customer Name</th>
              <th className="py-3 px-4 border-b">Customer Ph</th>
              <th className="py-3 px-4 border-b">GST Amount</th>
              {/* <th className="py-3 px-4 border-b">Bill Amt.</th>
              <th className="py-3 px-4 border-b">Qty</th> */}
              <th className="py-3 px-4 border-b">Billing Date</th>
              
              <th className="py-3 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{index + 1}</td>
                <td className="py-3 px-4 border-b">{item?.booking_id}</td>
                <td className="py-3 px-4 border-b">{item?.customer_details?.userc?.name}</td>
                <td className="py-3 px-4 border-b">{item?.customer_details?.phone}</td>
                {/* <td className="py-3 px-4 border-b">{item.total_price}</td>
                <td className="py-3 px-4 border-b">{item.quantity}</td> */}
                 <td className="py-3 px-4 border-b">{item?.gst}</td>
                <td className="py-3 px-4 border-b">{new Date(item.booking?.created_at).toLocaleDateString("en-GB")}</td>
                {/* printparcelbill */}
                <td className="py-3 px-4 border-b">
                  <a
                    href={`${reporturl}/resturant/printparcelbill/?id=${item.booking_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    BillPdf
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
