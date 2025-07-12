



// 'use client';
// import React, { useEffect, useState } from 'react';
// import {
//   baseImageURL,
//   getProductService,
// } from "@/app/components/config";
// import axios from 'axios';

// const Page = () => {
//   const today = new Date().toISOString().split('T')[0];

//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [startDate, setStartDate] = useState(today);
//   const [endDate, setEndDate] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

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

//   const fetchProductsList = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }

//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8000/api/product-service-saloon?pro_ser_type=Product",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Fetched products:", response.data);
//       setItems(response.data);
//       setFilteredItems(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Fetch products failed:", error);
//       setError("Failed to load data");
//       setLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const response = await getProductService();
//       setItems(response.data);
//       setFilteredItems(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Fetch via config failed:", err);
//       setError("Failed to load data");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchProductsList();
//   }, []);

//   useEffect(() => {
//     if (!startDate || !endDate) {
//       setFilteredItems(items);
//       return;
//     }

//     const filtered = items.filter((item) => {
//       const expiryRaw = item.expires || item.expiry_date || item.expired_at || '';
//       const expiryDate = new Date(expiryRaw);

//       return (
//         expiryDate.toString() !== 'Invalid Date' &&
//         expiryDate >= new Date(startDate) &&
//         expiryDate <= new Date(endDate)
//       );
//     });

//     setFilteredItems(filtered);
//   }, [startDate, endDate, items]);

//   return (
//     <div>
//       {/* Date Filter Inputs */}
//       <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
//         <div className="flex flex-col">
//           <label className="text-gray-700 font-medium mb-1">Start Date</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         <div className="flex flex-col">
//           <label className="text-gray-700 font-medium mb-1">Choose: Expiry Date</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//       </div>

//       {/* Display Table */}
//       <table className="w-full bg-white rounded-lg shadow overflow-hidden mt-4">
//         <thead>
//           <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
//             <th className="p-3">Item</th>
//             <th className="p-3">Item Name</th>
//             <th className="p-3">Code</th>
//             <th className="p-3">Expiry Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredItems.length > 0 ? (
//             filteredItems.map((item) => (
//               <tr key={item.id} className="border-b">
//                 <td className="p-3">
//                   <img
//                     src={`${baseImageURL}storage/${item.image}`}
//                     alt={item.name || "Image"}
//                     width={100}
//                     height={100}
//                   />
//                 </td>
//                 <td className="p-3">{item.name}</td>
//                 <td className="p-3">{item.code}</td>
//                 <td className="p-3">{item.expires || item.expiry_date || item.expired_at || 'N/A'}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" className="p-3 text-center text-gray-500">
//                 No items found in the selected date range.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Page;

'use client';
import React, { useEffect, useState } from 'react';
import {
  baseImageURL,
  getProductService,
} from "@/app/components/config";
import axios from 'axios';

const Page = () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const fetchProductsList = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/product-service-saloon?pro_ser_type=Product",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems(response.data);
      setFilteredItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch products failed:", error);
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await getProductService();
      setItems(response.data);
      setFilteredItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch via config failed:", err);
      setError("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProductsList();
  }, []);

  useEffect(() => {
    if (!startDate) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter((item) => {
      const expiryRaw = item.expires || item.expiry_date || item.expired_at || '';
      if (!expiryRaw) return false;

      const expiryDate = new Date(expiryRaw);
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date(today);

      return expiryDate >= start && expiryDate <= end;
    });

    setFilteredItems(filtered);
  }, [startDate, endDate, items]);

  const handleStartDateChange = (value) => {
    setStartDate(value);
    if (!endDate) {
      setEndDate(today);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Expiry Report</h2>

      {/* Date Filter Inputs */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Start Expiry Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            max={yesterday}
            className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">End Expiry Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
            max={today}
            className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Display Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
              <th className="p-3">Image</th>
              <th className="p-3">Item Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">
                    <img
                      src={`${baseImageURL}storage/${item.image}`}
                      alt={item.name || "Image"}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.code}</td>
                  <td className="p-3">
                    {item.expires || item.expiry_date || item.expired_at || 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No items found in the selected expiry date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
