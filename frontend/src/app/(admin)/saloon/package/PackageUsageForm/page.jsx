



// "use client";
// import { useState } from 'react';
// import axios from 'axios';

// export default function PackageUsageForm() {
//   const [packageId, setPackageId] = useState('');
//   const [searchedId, setSearchedId] = useState(null);
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [notFound, setNotFound] = useState(false);

//   const handleChange = (index, value) => {
//     const newItems = [...items];
//     newItems[index].todayuse = parseInt(value || 0);
//     setItems(newItems);
//   };

//   const handleSearch = () => {
//     const trimmedId = packageId.trim();
//     if (!trimmedId) return;

//     setLoading(true);
//     setNotFound(false);
//     setItems([]);

//     axios
//       .get(`http://127.0.0.1:8000/api/package-getall/${trimmedId}`)
//       .then((res) => {
//         if (res.data.length === 0) {
//           setNotFound(true);
//           setItems([]);
//         } else {
//           const updated = res.data.map((item) => ({
//             ...item,
//             todayuse: 0,
//           }));
//           setItems(updated);
//           setSearchedId(trimmedId);
//         }
//       })
//       .catch(() => {
//         setNotFound(true);
//         setItems([]);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleSubmit = async () => {
//     if (!searchedId) return;
//     setLoading(true);
//     try {
//       await axios.put(`http://127.0.0.1:8000/api/updateUsage/${searchedId}`, {
//         items: items.map(({ id, todayuse }) => ({ id, todayuse })),
//       });
//       alert("Today's usage updated!");
//     } catch (err) {
//       alert('Error updating usage');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-bold mb-4">Search Package ID</h2>

//       <div className="flex items-center gap-4">
//         <input
//           type="text"
//           value={packageId}
//           onChange={(e) => setPackageId(e.target.value)}
//           placeholder="Enter Package ID"
//           className="border px-2 py-1 rounded"
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Search
//         </button>
//       </div>

//       {notFound && (
//         <p className="text-red-500">No data found for this Package ID.</p>
//       )}

//       {items.length > 0 && (
//         <>
//           <h3 className="text-lg font-semibold mt-4 mb-2">Update Today's Usage</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto border border-gray-300">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-4 py-2">#</th>
//                   <th className="border px-4 py-2">Service Name</th>
//                   <th className="border px-4 py-2">Type</th>
//                   <th className="border px-4 py-2">Total Qty</th>
//                   <th className="border px-4 py-2">Used</th>
//                   <th className="border px-4 py-2">Today Use</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((item, index) => (
//                   <tr key={item.id}>
//                     <td className="border px-4 py-2 text-center">{index + 1}</td>
//                     <td className="border px-4 py-2">{item.service_name}</td>
//                     <td className="border px-4 py-2">{item.type}</td>
//                     <td className="border px-4 py-2 text-center">{item.total_quantity}</td>
//                     <td className="border px-4 py-2 text-center">{item.used ?? 0}</td>
//                     <td className="border px-4 py-2 text-center">
//                       <input
//                         type="number"
//                         min={0}
//                         value={item.todayuse}
//                         onChange={(e) => handleChange(index, e.target.value)}
//                         className="border px-2 py-1 w-20 text-center"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="bg-green-600 text-white px-6 py-2 rounded mt-4"
//           >
//             {loading ? 'Saving...' : 'Submit Usage'}
//           </button>
//         </>
//       )}
//     </div>
//   );
// }




// "use client";
// import { useRef, useState } from 'react';
// import axios from 'axios';

// export default function PackageUsageForm() {
//   const [packageId, setPackageId] = useState('');
//   const [searchedId, setSearchedId] = useState(null);
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [notFound, setNotFound] = useState(false);
//   const printRef = useRef(null);

//   const handleChange = (index, value) => {
//     const newItems = [...items];
//     newItems[index].todayuse = parseInt(value || 0);
//     setItems(newItems);
//   };

//   const handleSearch = () => {
//     const trimmedId = packageId.trim();
//     if (!trimmedId) return;

//     setLoading(true);
//     setNotFound(false);
//     setItems([]);

//     axios
//       .get(`http://127.0.0.1:8000/api/package-getall/${trimmedId}`)
//       .then((res) => {
//         if (res.data.length === 0) {
//           setNotFound(true);
//           setItems([]);
//         } else {
//           const updated = res.data.map((item) => ({
//             ...item,
//             todayuse: 0,
//           }));
//           setItems(updated);
//           setSearchedId(trimmedId);
//         }
//       })
//       .catch(() => {
//         setNotFound(true);
//         setItems([]);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleSubmit = async () => {
//     if (!searchedId) return;
//     setLoading(true);
//     try {
//       await axios.put(`http://127.0.0.1:8000/api/updateUsage/${searchedId}`, {
//         items: items.map(({ id, todayuse }) => ({ id, todayuse })),
//       });
//       alert("Today's usage updated!");
//     } catch (err) {
//       alert('Error updating usage');
//     }
//     setLoading(false);
//   };

//   const handlePrint = () => {
//     const printContent = printRef.current;
//     const printWindow = window.open('', '', 'width=800,height=600');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Package Usage Print</title>
//           <style>
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 20px;
//             }
//             th, td {
//               border: 1px solid #000;
//               padding: 8px;
//               text-align: center;
//             }
//             th {
//               background-color: #f2f2f2;
//             }
//             h2 {
//               text-align: center;
//             }
//           </style>
//         </head>
//         <body>
//           <h2>Package Usage for Package ID: ${searchedId}</h2>
//           ${printContent.innerHTML}
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-bold mb-4">Search Package ID</h2>

//       <div className="flex items-center gap-4">
//         <input
//           type="text"
//           value={packageId}
//           onChange={(e) => setPackageId(e.target.value)}
//           placeholder="Enter Package ID"
//           className="border px-2 py-1 rounded"
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Search
//         </button>
//       </div>

//       {notFound && (
//         <p className="text-red-500">No data found for this Package ID.</p>
//       )}

//       {items.length > 0 && (
//         <>
//           <h3 className="text-lg font-semibold mt-4 mb-2">Update Today's Usage</h3>

//           <div ref={printRef} className="overflow-x-auto">
//             <table className="min-w-full table-auto border border-gray-300">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-4 py-2">#</th>
//                   <th className="border px-4 py-2">Service Name</th>
//                   <th className="border px-4 py-2">Type</th>
//                   <th className="border px-4 py-2">Total Qty</th>
//                   <th className="border px-4 py-2">Used</th>
//                   <th className="border px-4 py-2">Today Use</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((item, index) => (
//                   <tr key={item.id}>
//                     <td className="border px-4 py-2">{index + 1}</td>
//                     <td className="border px-4 py-2">{item.service_name}</td>
//                     <td className="border px-4 py-2">{item.type}</td>
//                     <td className="border px-4 py-2">{item.total_quantity}</td>
//                     <td className="border px-4 py-2">{item.used ?? 0}</td>
//                     <td className="border px-4 py-2">
//                       <input
//                         type="number"
//                         min={0}
//                         value={item.todayuse}
//                         onChange={(e) => handleChange(index, e.target.value)}
//                         className="border px-2 py-1 w-20 text-center"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex gap-4 mt-4">
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="bg-green-600 text-white px-6 py-2 rounded"
//             >
//               {loading ? 'Saving...' : 'Submit Usage'}
//             </button>
//             <button
//               onClick={handlePrint}
//               className="bg-gray-800 text-white px-6 py-2 rounded"
//             >
//               Print
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import axios from "axios";

export default function PackageUsageForm() {
  const [packageId, setPackageId] = useState("");
  const [searchedId, setSearchedId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleChange = (index, value) => {
    const newItems = [...items];
    newItems[index].todayuse = parseInt(value || 0);
    setItems(newItems);
  };

  const handleSearch = () => {
    const trimmedId = packageId.trim();
    if (!trimmedId) return;

    setLoading(true);
    setNotFound(false);
    setItems([]);

    axios
      .get(`http://127.0.0.1:8000/api/package-getall/${trimmedId}`)
      .then((res) => {
        if (res.data.length === 0) {
          setNotFound(true);
          setItems([]);
        } else {
          const updated = res.data.map((item) => ({
            ...item,
            todayuse: 0,
          }));
          setItems(updated);
          setSearchedId(trimmedId);
        }
      })
      .catch(() => {
        setNotFound(true);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = async () => {
    if (!searchedId) return;
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:8000/api/updateUsage/${searchedId}`, {
        items: items.map(({ id, todayuse }) => ({ id, todayuse })),
      });
      alert("Today's usage updated!");
    } catch (err) {
      alert("Error updating usage");
    }
    setLoading(false);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-section")?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Package Usage Report</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }

            body {
              font-family: Arial, sans-serif;
              padding: 10mm;
            }

            h2 {
              text-align: center;
              margin-bottom: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }

            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }

            th {
              background-color: #f2f2f2;
            }

            .no-print {
              display: none;
            }
          </style>
        </head>
        <body>
          <h2>Package Usage Report - ID: ${searchedId}</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Search Package ID</h2>

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          placeholder="Enter Package ID"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {notFound && (
        <p className="text-red-500">No data found for this Package ID.</p>
      )}

      {items.length > 0 && (
        <>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Submit Usage"}
            </button>
            <button
              onClick={handlePrint}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Print
            </button>
          </div>

          <div id="print-section" className="mt-6 overflow-x-auto">
            <table className="w-full border">
            <thead>
  <tr>
    <th className="text-center">Service Name</th>
    <th className="text-center">Type</th>
    <th className="text-center">Total Qty</th>
    <th className="text-center">Used</th>
    <th className="text-center no-print">Today Use</th>
  </tr>
</thead>
<tbody>
  {items.map((item, index) => (
    <tr key={item.id}>
      <td className="text-center">{item.service_name}</td>
      <td className="text-center">{item.type}</td>
      <td className="text-center">{item.total_quantity}</td>
      <td className="text-center">{item.used ?? 0}</td>
      <td className="no-print text-center">
        <input
          type="number"
          min={0}
          value={item.todayuse}
          onChange={(e) => handleChange(index, e.target.value)}
          className="border px-2 py-1 w-20 text-center"
          placeholder="Today Use"
        />
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </>
      )}
    </div>
  );
}
