// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Barcode from "react-barcode";
// import axios from "axios";
// import { RxCross1 } from "react-icons/rx";

// const ProductSearch = () => {
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showPreview, setShowPreview] = useState(false);
//   const [barcodeData, setBarcodeData] = useState([]);
//   const [filterBarcodeData, setFilterBarcodeData] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [selectedBarcodes, setSelectedBarcodes] = useState({});
//   const printRef = useRef();

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop().split(";").shift());
//     }
//     return null;
//   };

//   const fetchAllBarCode = async () => {
//     const token = getCookie("access_token");
//     const response = await axios.get(" http://127.0.0.1:8000/api/barcodes", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     setBarcodeData(response.data);
//   };

//   const fetchProducts = async () => {
//     const token = getCookie("access_token");
//     try {
//       const response = await axios.get(
//         ` http://127.0.0.1:8000/api/barcode-search?search=${search}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllBarCode();
//   }, []);

//   useEffect(() => {
//     if (search.length > 2 || search === "") fetchProducts();
//   }, [search]);

//   const filterBarCode = (product) => {
//     const result = barcodeData.filter((item) => item.item_id === product.id);
//     setFilterBarcodeData(result);
//     setSelectedBarcodes({});
//   };

//   const addToCart = (product) => {
//     setCart([{ ...product, quantity: 1 }]);
//   };

//   const removeFromCart = (productId) => {
//     setCart(cart.filter((item) => item.id !== productId));
//   };

//   const toggleBarcodeSelection = (id, idx) => {
//     const key = `${id}-${idx}`;
//     setSelectedBarcodes((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const handlePrint = () => {
//     // Only selected barcodes
//     const selectedHTML = Array.from(
//       printRef.current.querySelectorAll(".barcode-card")
//     )
//       .filter((el) => el.querySelector("input[type=checkbox]")?.checked)
//       .map((el) => el.outerHTML)
//       .join("");

//     const newWindow = window.open("", "", "width=800,height=600");
//     newWindow.document.write("<html><head><title>Print</title>");
//     newWindow.document.write(`
//       <style>
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           #print-area, #print-area * {
//             visibility: visible;
//           }
//           #print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//             display: flex;
//             flex-wrap: wrap;
//             gap: 4mm;
//             padding: 4mm;
//           }
//           .barcode-card {
//             width: 70mm;
//             height: 30mm;
//             padding: 2mm;
//             box-sizing: border-box;
//             border: 1px solid #000;
//             display: flex;
//             flex-direction: column;
//             justify-content: center;
//             align-items: center;
//             font-size: 12px;
//             page-break-inside: avoid;
//           }
//           canvas {
//             width: 100% !important;
//             height: auto !important;
//           }
//           input[type="checkbox"] {
//             display: none !important;
//           }
//         }
//       </style>
//     `);
//     newWindow.document.write("</head><body>");
//     newWindow.document.write(`<div id="print-area">${selectedHTML}</div>`);
//     newWindow.document.write("</body></html>");
//     newWindow.document.close();

//     newWindow.onload = function () {
//       newWindow.focus();
//       newWindow.print();
//       newWindow.close();
//     };
//   };

//   return (
//     <div className="p-6 w-[80%] mx-auto">
//       {/* Search Bar */}
//       <div className="flex items-center border rounded-lg p-2 mb-4 shadow-sm">
//         <input
//           type="text"
//           placeholder="Search products by name, barcode, or item code"
//           className="w-full outline-none p-2"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Product List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             className="border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-100"
//             onClick={() => {
//               addToCart(product);
//               filterBarCode(product);
//             }}
//           >
//             <h3 className="text-lg font-semibold">{product.name}</h3>
//             <p className="text-sm text-gray-500">Barcode: {product.barcode}</p>
//             <p className="text-sm text-gray-500">Item Code: {product.item_code}</p>
//           </div>
//         ))}
//       </div>

//       {/* Cart */}
//       <div className="border-t pt-4">
//         <h2 className="text-xl font-semibold mb-4">Item Name</h2>
//         {cart.map((item) => (
//           <div key={item.id} className="flex space-x-12 items-center mb-2">
//             <p>{item.name}</p>
//             <button
//               onClick={() => removeFromCart(item.id)}
//               className="text-red-500 rounded-full text-[1.8rem]"
//             >
//               <RxCross1 />
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Preview & Action Buttons */}
//       <div className="mt-6 flex space-x-2">
//         <button
//           onClick={() => setShowPreview(true)}
//           className="bg-green-500 text-white text-[1.5rem] px-4 py-2 rounded-lg"
//         >
//           Preview
//         </button>
//         <button
//           onClick={() => setShowPreview(false)}
//           className="bg-orange-500 text-white px-4 py-2 rounded-lg"
//         >
//           Close
//         </button>
//         <button
//           onClick={handlePrint}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//         >
//           Print
//         </button>
//       </div>

//       {/* Barcode Preview Area */}
//       {showPreview && (
//         <div className="mt-6" ref={printRef}>
//           <div className="flex flex-wrap gap-4">
//             {filterBarcodeData.map((item) =>
//               Array(item.quantity)
//                 .fill(null)
//                 .map((_, idx) => {
//                   const key = `${item.id}-${idx}`;
//                   const isSelected = selectedBarcodes[key] || false;
//                   const barcodeValue = item.itemno;

//                   return (
//                     <div key={key} className="barcode-card border relative p-2">
//                       <input
//                         type="checkbox"
//                         className="absolute top-1 left-1 scale-125"
//                         checked={isSelected}
//                         onChange={() => toggleBarcodeSelection(item.id, idx)}
//                       />
//                       <div>₹{item.basic_rate} {item.product_name}</div>
//                       <div>
//                         NWT:{item.nwt} GWT:{item.gwt} DWT:{item.diamond_details}
//                       </div>
//                       <Barcode value={barcodeValue} width={2} height={60} />
//                     </div>
//                   );
//                 })
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductSearch;

"use client";
import React, { useState, useEffect, useRef } from "react";
import Barcode from "react-barcode";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";

const ProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [barcodeData, setBarcodeData] = useState([]);
  const [filterBarcodeData, setFilterBarcodeData] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedBarcodes, setSelectedBarcodes] = useState({});
  const printRef = useRef();
  const [selectAll, setSelectAll] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const fetchAllBarCode = async () => {
    const token = getCookie("access_token");
    const response = await axios.get(" http://127.0.0.1:8000/api/barcodes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setBarcodeData(response.data);
  };

  const fetchProducts = async () => {
    const token = getCookie("access_token");
    try {
      const response = await axios.get(
        ` http://127.0.0.1:8000/api/barcode-search?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchAllBarCode();
  }, []);

  useEffect(() => {
    if (search.length > 2 || search === "") fetchProducts();
  }, [search]);

  const filterBarCode = (product) => {
    const result = barcodeData.filter((item) => item.item_id === product.id);
    setFilterBarcodeData(result);
    setSelectedBarcodes({});
  };

  const addToCart = (product) => {
    setCart([{ ...product, quantity: 1 }]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const toggleBarcodeSelection = (id, idx) => {
    const key = `${id}-${idx}`;
    setSelectedBarcodes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrint = () => {
    // Only selected barcodes
    const selectedHTML = Array.from(
      printRef.current.querySelectorAll(".barcode-card")
    )
      .filter((el) => el.querySelector("input[type=checkbox]")?.checked)
      .map((el) => el.outerHTML)
      .join("");

    const newWindow = window.open("", "", "width=800,height=600");
    newWindow.document.write("<html><head><title>Print</title>");
    newWindow.document.write(`
      <style>
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            gap: 4mm;
           
          }
.barcode-card {
  width: 96mm;
  height: 12mm;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border: 0.5px solid black;
  font-size: 6px;
   gap: 2mm;
   
}

.barcode-card .empty-space {
  width: 46mm;
  flex-shrink: 0;
   height: 12mm;
}

.barcode-card .barcode-section {
  width: 26mm;
   
  
   height: 12mm;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.barcode-card .product-details {
  width: 25mm;
   height: 12mm;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 6px;
  line-height: 1;
  overflow: hidden;
   
}

.barcode-card > div {
  box-sizing: border-box;
}
          canvas {
            width: 100% !important;
            height: auto !important;
          }
          input[type="checkbox"] {
            display: none !important;
          }
        }
      </style>
    `);
    newWindow.document.write("</head><body>");
    newWindow.document.write(`<div id="print-area">${selectedHTML}</div>`);
    newWindow.document.write("</body></html>");
    newWindow.document.close();

    newWindow.onload = function () {
      newWindow.focus();
      newWindow.print();
      newWindow.close();
    };
  };

  return (
    <div className="p-6 w-[80%] mx-auto">
      {/* Search Bar */}
      <div className="flex items-center border rounded-lg p-2 mb-4 shadow-sm">
        <input
          type="text"
          placeholder="Search products by name, barcode, or item code"
          className="w-full outline-none p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-100"
            onClick={() => {
              addToCart(product);
              filterBarCode(product);
            }}
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">Barcode: {product.barcode}</p>
            <p className="text-sm text-gray-500">
              Item Code: {product.item_code}
            </p>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-4">Item Name</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex space-x-12 items-center mb-2">
            <p>{item.name}</p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 rounded-full text-[1.8rem]"
            >
              <RxCross1 />
            </button>
          </div>
        ))}
      </div>

      {/* Preview & Action Buttons */}
      <div className="mt-6 flex space-x-2">
        <button
          onClick={() => setShowPreview(true)}
          className="bg-green-500 text-white text-[1.5rem] px-4 py-2 rounded-lg"
        >
          Preview
        </button>
        <button
          onClick={() => setShowPreview(false)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Print
        </button>
      </div>

      {/* Barcode Preview Area */}
      {showPreview && (
        <div className="mt-6" ref={printRef}>

<div className="mb-2 flex items-center space-x-2">
      <input
        type="checkbox"
        checked={selectAll}
        onChange={() => {
          setSelectAll((prev) => {
            const newSelectAll = !prev;
            const newSelections = {};
            filterBarcodeData.forEach((item) => {
              for (let i = 0; i < item.quantity; i++) {
                newSelections[`${item.id}-${i}`] = newSelectAll;
              }
            });
            setSelectedBarcodes(newSelections);
            return newSelectAll;
          });
        }}
      />
      <label className="text-sm font-medium">
        {selectAll ? "Unselect All" : "Select All"}
      </label>
    </div>


          <div className="flex flex-wrap gap-4">
            {filterBarcodeData.map((item) =>
              Array(item.quantity)
                .fill(null)
                .map((_, idx) => {
                  const key = `${item.id}-${idx}`;
                  // const isSelected = selectedBarcodes[key] ?? true; // default selected
                  const isSelected = selectedBarcodes[key] ?? selectAll;
                  // const barcodeValue = item.itemno;
                  const barcodeValue = item.barcode_no;

                  return (
                  

                    <div
                      key={key}
                      className={`barcode-card relative flex w-[72mm] h-[30mm] items-center border-t ${
                        !isSelected ? "opacity-30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        className="absolute top-0 left-0 m-1 w-4 h-4 z-10 cursor-pointer print:hidden"
                        checked={isSelected}
                        onChange={() => toggleBarcodeSelection(item.id, idx)}
                      />

                      {/* 46mm empty space */}
                      <div className="empty-space w-[46mm]"></div>

                      {/* 26mm barcode */}
                      <div className="barcode-section flex   w-[26mm] h-[30mm]  items-center justify-center overflow-hidden">
                        <Barcode
                          value={barcodeValue}
                          width={2}
                          // height={28}
                          height={60}
                          // displayValue={false}
                          // margin={0}
                        />
                         <div className="truncate text-[8px]">
                        {/* {item?.barcode_no} */}
                        </div>
                      </div>

                      {/* 27mm product details */}
                      <div className="product-details w-[27mm] h-[30mm] flex flex-col justify-center text-[10px] leading-tight overflow-hidden ml-1">
                        <div className="truncate">
                        ₹{item.basic_rate} {item.product_name}
                        </div>
                        <div className="truncate text-[6px]">
                          NWT:{item.nwt}
                        </div>
                        <div className="truncate text-[6px]">
                          GWT:{item.gwt}
                        </div>
                        <div className="truncate text-[6px]">
                          DWT:{item.diamond_details}
                        </div>
                       
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
