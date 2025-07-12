// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function Home() {
//     const [productList, setProductList] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const getCookie = (name) => {
//         const value = `; ${document.cookie}`;
//         const parts = value.split(`; ${name}=`);
//         if (parts.length === 2) {
//             return decodeURIComponent(parts.pop().split(";").shift());
//         }
//         return null;
//     };

//     const token = getCookie("access_token");
    
//     useEffect(() => {
//         if (!token) {
//             console.error("Authentication token not found!");
//             return;
//         }
//         fetchProductsList();
//     }, [token]);

//     const fetchProductsList = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get("http://127.0.0.1:8000/api/stockDetails", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setProductList(response.data);
//         } catch (error) {
//             console.error("Error fetching items:", error);
//         } finally {
//             setLoading(false);  // ✅ Ensures loading is reset even if an error occurs
//         }
//     };

//     return (
//         <>
//             <h1>Stock Report</h1>
//             {loading ? (
//                 <div>Loading....</div>
//             ) : (
//                 <div className="p-4 bg-gray-100 min-h-screen">
//                     <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
//                         <thead>
//                             <tr className="bg-blue-500 text-white text-left">
//                                 <th className="py-2 px-4 border">Product Name</th>
//                                 <th className="py-2 px-4 border">Total Quantity</th>
//                                 <th className="py-2 px-4 border">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {productList.map((item) => (
//                                 <tr key={item.id} className="hover:bg-gray-100">
//                                     <td className="py-2 px-4 border">{item.name}</td>
                                    
//                                     <td className="py-2 px-4 border">{item.available_quantity>0 ? item.available_quantity : "0"}</td>

//                                     <td className="py-2 px-4 border">
//                                         {item.available_quantity > 0 ? (
//                                             <span className="text-green-500">In Stock</span>
//                                         ) : (
//                                             <span className="text-red-500">Out of Stock</span>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </>
//     );
// }


"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";

export default function Home() {
  const [productList, setProductList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!token) {
      console.error("Authentication token not found!");
      return;
    }
    fetchProductsList();
  }, [token]);

  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
  
    const filtered = productList.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(lowerSearch);
  
      const status =
        item.available_quantity > 0 ? "in stock" : "out of stock";
      const statusMatch = status.includes(lowerSearch);
  
      return nameMatch || statusMatch;
    });
  
    setFilteredList(filtered);
  }, [searchQuery, productList]);
  

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/product-service-saloon?pro_ser_type=Product",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("'featchProductsList",response)
      setProductList(response.data);
      setFilteredList(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // PDF Download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["S.No", "Product Name", "Total Quantity", "Status"]],
      body: filteredList.map((item, index) => [
        index + 1,
        item.name,
        item.available_quantity > 0 ? item.available_quantity : "0",
        item.available_quantity > 0 ? "In Stock" : "Out of Stock",
      ]),
    });

    doc.save("Stock_Report.pdf");
  };

  // Excel Download
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredList.map((item, index) => ({
        "S.No": index + 1,
        "Product Name": item.name,
        "Total Quantity":
          item.current_stock > 0 ? item.current_stock : "0",
        Status: item.current_stock > 0 ? "In Stock" : "Out of Stock",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Report");
    XLSX.writeFile(workbook, "Stock_Report.xlsx");
  };

  return (
    <>
      <h1 className="text-2xl font-bold px-4 py-2">Stock Report</h1>

      <div className="flex justify-between items-center px-4 mb-4">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 h-10 px-4 border border-gray-300 rounded-md text-sm"
        />

        <div className="flex items-center gap-4 ml-4">
          <button
            onClick={handleDownloadPDF}
            className="text-2xl text-red-600 hover:text-red-800"
            title="Download PDF"
          >
            <FaFilePdf />
          </button>
          <button
            onClick={handleDownloadExcel}
            className="text-2xl text-green-600 hover:text-green-800"
            title="Download Excel"
          >
            <BsFiletypeXls />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="px-4">Loading....</div>
      ) : (
        <div className="p-4 bg-gray-100 min-h-screen">
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white text-left">
                <th className="py-2 px-4 border">SI.NO</th>
                <th className="py-2 px-4 border">Product Name</th>
                <th className="py-2 px-4 border">Total Quantity</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((item,index) => (
                  <tr key={index}  className="hover:bg-gray-100">
                     <td className="py-2 px-4 border">{index+1}</td>
                    <td className="py-2 px-4 border">{item.name}</td>
                    <td className="py-2 px-4 border">
                      {item.current_stock > 0
                        ? item.current_stock
                        : "0"}
                    </td>
                    <td className="py-2 px-4 border">
                      {item.current_stock > 0 ? (
                        <span className="text-green-500">In Stock</span>
                      ) : (
                        <span className="text-red-500">Out of Stock</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
