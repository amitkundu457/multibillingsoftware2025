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
//   const [selectAll, setSelectAll] = useState(true);

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
//     const response = await axios.get(
//       " https://apibrize.brizindia.com/api/barcodes",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     setBarcodeData(response.data);
//   };

//   const fetchProducts = async () => {
//     const token = getCookie("access_token");
//     try {
//       const response = await axios.get(
//         ` https://apibrize.brizindia.com/api/barcode-search?search=${search}`,
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

//           }
// .barcode-card {
//   width: 96mm;
//   height: 12mm;
//   box-sizing: border-box;
//   display: flex;
//   align-items: center;
//   border: 0.5px solid black;
//   font-size: 6px;
//    gap: 2mm;

// }

// .barcode-card .empty-space {
//   width: 46mm;
//   flex-shrink: 0;
//    height: 12mm;
// }

// .barcode-card .barcode-section {
//   width: 26mm;

//    height: 12mm;
//   flex-shrink: 0;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   overflow: hidden;
// }

// .barcode-card .product-details {
//   width: 25mm;
//    height: 12mm;
//   flex-shrink: 0;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   font-size: 6px;
//   line-height: 1;
//   overflow: hidden;

// }

// .barcode-card > div {
//   box-sizing: border-box;
// }
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
//       <div className="flex items-center p-2 mb-4 border rounded-lg shadow-sm">
//         <input
//           type="text"
//           placeholder="Search products by name, barcode, or item code"
//           className="w-full p-2 outline-none"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Product List */}
//       <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-5">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             className="p-4 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
//             onClick={() => {
//               addToCart(product);
//               filterBarCode(product);
//             }}
//           >
//             <h3 className="text-lg font-semibold">{product.name}</h3>
//             <p className="text-sm text-gray-500">Barcode: {product.barcode}</p>
//             <p className="text-sm text-gray-500">
//               Item Code: {product.item_code}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Cart */}
//       <div className="pt-4 border-t">
//         <h2 className="mb-4 text-xl font-semibold">Item Name</h2>
//         {cart.map((item) => (
//           <div key={item.id} className="flex items-center mb-2 space-x-12">
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
//       <div className="flex mt-6 space-x-2">
//         <button
//           onClick={() => setShowPreview(true)}
//           className="bg-green-500 text-white text-[1.5rem] px-4 py-2 rounded-lg"
//         >
//           Preview
//         </button>
//         <button
//           onClick={() => setShowPreview(false)}
//           className="px-4 py-2 text-white bg-orange-500 rounded-lg"
//         >
//           Close
//         </button>
//         <button
//           onClick={handlePrint}
//           className="px-4 py-2 text-white bg-blue-500 rounded-lg"
//         >
//           Print
//         </button>
//       </div>

//       {/* Barcode Preview Area */}
//       {showPreview && (
//         <div className="mt-6" ref={printRef}>
//           <div className="flex items-center mb-2 space-x-2">
//             <input
//               type="checkbox"
//               checked={selectAll}
//               onChange={() => {
//                 setSelectAll((prev) => {
//                   const newSelectAll = !prev;
//                   const newSelections = {};
//                   filterBarcodeData.forEach((item) => {
//                     for (let i = 0; i < item.quantity; i++) {
//                       newSelections[`${item.id}-${i}`] = newSelectAll;
//                     }
//                   });
//                   setSelectedBarcodes(newSelections);
//                   return newSelectAll;
//                 });
//               }}
//             />
//             <label className="text-sm font-medium">
//               {selectAll ? "Unselect All" : "Select All"}
//             </label>
//           </div>

//           <div className="flex flex-wrap gap-4">
//             {filterBarcodeData.map((item) =>
//               Array(item.quantity)
//                 .fill(null)
//                 .map((_, idx) => {
//                   const key = `${item.id}-${idx}`;
//                   // const isSelected = selectedBarcodes[key] ?? true; // default selected
//                   const isSelected = selectedBarcodes[key] ?? selectAll;
//                   // const barcodeValue = item.itemno;
//                   const barcodeValue = item.barcode_no;

//                   return (
//                     <div
//                       key={key}
//                       className={`barcode-card relative flex w-[72mm] h-[30mm] items-center border-t ${
//                         !isSelected ? "opacity-30" : ""
//                       }`}
//                     >
//                       {/* Checkbox */}
//                       <input
//                         type="checkbox"
//                         className="absolute top-0 left-0 z-10 w-4 h-4 m-1 cursor-pointer print:hidden"
//                         checked={isSelected}
//                         onChange={() => toggleBarcodeSelection(item.id, idx)}
//                       />

//                       {/* 46mm empty space */}
//                       <div className="empty-space w-[46mm]"></div>

//                       {/* 26mm barcode */}
//                       <div className="barcode-section flex   w-[26mm] h-[30mm]  items-center justify-center overflow-hidden">
//                         <Barcode
//                           value={barcodeValue}
//                           width={2}
//                           // height={28}
//                           height={60}
//                           // displayValue={false}
//                           // margin={0}
//                         />
//                         <div className="truncate text-[8px]">
//                           {/* {item?.barcode_no} */}
//                         </div>
//                       </div>

//                       {/* 27mm product details */}
// <div className="product-details w-[27mm] h-[30mm] flex flex-col justify-center text-[10px] leading-tight overflow-hidden ml-1">
//   <div className="truncate">
//     ₹{item.basic_rate} {item.product_name}
//   </div>
//   <div className="truncate text-[6px]">
//     NWT:{item.nwt}
//   </div>
//   <div className="truncate text-[6px]">
//     GWT:{item.gwt}
//   </div>
//   <div className="truncate text-[6px]">
//     DWT:{item.diamond_details}
//   </div>
// </div>
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

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Barcode from "react-barcode";
// import axios from "axios";

// /* 🔹 LABEL SIZE PRESETS (mm) */
// const LABEL_PRESETS = {
//   "50x25": {
//     width: 50,
//     height: 25,
//     empty: 8,
//     barcode: 34,
//     barcodeWidth: 1.2,
//     barcodeHeight: 18,
//     font: 6,
//   },
//   "60x40": {
//     width: 60,
//     height: 40,
//     empty: 10,
//     barcode: 40,
//     barcodeWidth: 1.4,
//     barcodeHeight: 28,
//     font: 7,
//   },
//   "72x30": {
//     width: 72,
//     height: 30,
//     empty: 12,
//     barcode: 50,
//     barcodeWidth: 1.5,
//     barcodeHeight: 22,
//     font: 7,
//   },
// };

// const ProductSearch = () => {
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [barcodeData, setBarcodeData] = useState([]);
//   const [filterBarcodeData, setFilterBarcodeData] = useState([]);
//   const [showPreview, setShowPreview] = useState(false);
//   const [labelSize, setLabelSize] = useState("72x30");

//   const selectedLabel = LABEL_PRESETS[labelSize];
//   const printRef = useRef();

//   const getCookie = (name) => {
//     const v = `; ${document.cookie}`;
//     const p = v.split(`; ${name}=`);
//     return p.length === 2 ? p.pop().split(";").shift() : null;
//   };

//   /* 🔹 FETCH BARCODES */
//   useEffect(() => {
//     const token = getCookie("access_token");
//     axios
//       .get("https://apibrize.brizindia.com/api/barcodes", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setBarcodeData(res.data));
//   }, []);

//   /* 🔹 SEARCH */
//   useEffect(() => {
//     const token = getCookie("access_token");
//     if (search.length > 2 || search === "") {
//       axios
//         .get(
//           `https://apibrize.brizindia.com/api/barcode-search?search=${search}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         .then((res) => setProducts(res.data));
//     }
//   }, [search]);

//   const filterBarCode = (product) => {
//     setFilterBarcodeData(barcodeData.filter((b) => b.item_id === product.id));
//   };

//   /* 🔹 PRINT */
//   const handlePrint = () => {
//     const html = printRef.current.innerHTML;
//     const w = window.open("", "", "width=900,height=650");

//     w.document.write(`
//       <html>
//       <head>
//         <style>
//           @page { size: A4; margin: 5mm; }
//           body { margin:0; font-family: Arial, sans-serif; }

//           .grid {
//             width:210mm;
//             display:grid;
//             grid-template-columns: repeat(auto-fit, minmax(${
//               selectedLabel.width
//             }mm, 1fr));
//             gap:2mm;
//           }

//           .label {
//             width:${selectedLabel.width}mm;
//             height:${selectedLabel.height}mm;
//             border:0.5px solid #000;
//             box-sizing:border-box;
//             padding:1mm;
//             display:flex;
//             align-items:center;
//             justify-content:center;
//             font-size:${selectedLabel.font}px;
//           }

//           .barcode-box {
//             text-align:center;
//             width:100%;
//             line-height:1.2;
//           }

//           .code {
//             font-weight:bold;
//             font-size:${selectedLabel.font + 1}px;
//           }

//           .wt {
//             font-size:${selectedLabel.font - 1}px;
//           }

//           .name {
//             font-weight:600;
//             font-size:${selectedLabel.font}px;
//           }
//         </style>
//       </head>
//       <body>${html}</body>
//       </html>
//     `);

//     w.document.close();
//     w.onload = () => {
//       w.print();
//       w.close();
//     };
//   };

//   return (
//     <div className="w-[80%] mx-auto p-6">
//       <input
//         className="w-full p-2 mb-4 border rounded"
//         placeholder="Search product"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       <div className="grid grid-cols-5 gap-4 mb-4">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             className="p-3 border cursor-pointer"
//             onClick={() => filterBarCode(p)}
//           >
//             <b>{p.name}</b>
//           </div>
//         ))}
//       </div>

//       <div className="flex items-center gap-3 mb-4">
//         <b>Label Size:</b>
//         <select
//           value={labelSize}
//           onChange={(e) => setLabelSize(e.target.value)}
//           className="px-2 py-1 border"
//         >
//           <option value="50x25">50 × 25</option>
//           <option value="60x40">60 × 40</option>
//           <option value="72x30">72 × 30</option>
//         </select>
//       </div>

//       <div className="flex gap-3 mb-4">
//         <button
//           onClick={() => setShowPreview(true)}
//           className="px-4 py-2 text-white bg-green-500 rounded"
//         >
//           Preview
//         </button>
//         <button
//           onClick={handlePrint}
//           className="px-4 py-2 text-white bg-blue-500 rounded"
//         >
//           Print
//         </button>
//       </div>

//       {showPreview && (
//         <div ref={printRef}>
//           <div className="grid">
//             {filterBarcodeData.map((item) =>
//               Array(item.quantity)
//                 .fill(0)
//                 .map((_, idx) => (
//                   <div key={`${item.id}-${idx}`} className="label">
//                     <div className="barcode-box">
//                       <Barcode
//                         value={item.barcode_no}
//                         width={selectedLabel.barcodeWidth}
//                         height={selectedLabel.barcodeHeight}
//                         displayValue={false}
//                       />

//                       <div className="code">{item.barcode_no}</div>
//                       <div className="wt">
//                         NWT:{item.nwt} | GWT:{item.gwt}
//                       </div>
//                       <div className="wt">
//                         DWT:{item.diamond_details || "-"}
//                       </div>
//                       <div className="name">
//                         ₹{item.basic_rate} {item.product_name}
//                       </div>
//                     </div>
//                   </div>
//                 ))
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

/* 🔹 LABEL SIZE PRESETS (mm) */
const LABEL_PRESETS = {
  "50x25": {
    width: 50,
    height: 25,
    barcodeWidth: 1.2,
    barcodeHeight: 18,
    font: 6,
  },
  "60x40": {
    width: 60,
    height: 40,
    barcodeWidth: 1.4,
    barcodeHeight: 28,
    font: 7,
  },
  "72x30": {
    width: 72,
    height: 30,
    barcodeWidth: 1.5,
    barcodeHeight: 22,
    font: 7,
  },
};

const ProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [barcodeData, setBarcodeData] = useState([]);
  const [filterBarcodeData, setFilterBarcodeData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [labelSize, setLabelSize] = useState("72x30");

  /* 🔹 SELECTED BARCODE STATE */
  const [selectedBarcodes, setSelectedBarcodes] = useState({});

  const selectedLabel = LABEL_PRESETS[labelSize];
  const printRef = useRef();

  const getCookie = (name) => {
    const v = `; ${document.cookie}`;
    const p = v.split(`; ${name}=`);
    return p.length === 2 ? p.pop().split(";").shift() : null;
  };

  /* 🔹 FETCH BARCODES */
  useEffect(() => {
    const token = getCookie("access_token");
    axios
      .get("https://apibrize.brizindia.com/api/barcodes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBarcodeData(res.data));
  }, []);

  /* 🔹 SEARCH */
  useEffect(() => {
    const token = getCookie("access_token");
    if (search.length > 2 || search === "") {
      axios
        .get(
          `https://apibrize.brizindia.com/api/barcode-search?search=${search}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => setProducts(res.data));
    }
  }, [search]);

  /* 🔹 FILTER BARCODE + DEFAULT SELECT ALL */
  const filterBarCode = (product) => {
    const data = barcodeData.filter((b) => b.item_id === product.id);
    setFilterBarcodeData(data);

    const map = {};
    data.forEach((item) => {
      Array(item.quantity)
        .fill(0)
        .forEach((_, idx) => {
          map[`${item.id}-${idx}`] = true; // default selected
        });
    });
    setSelectedBarcodes(map);
  };

  /* 🔹 TOGGLE SINGLE BARCODE */
  const toggleSelect = (key) => {
    setSelectedBarcodes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* 🔹 PRINT ONLY SELECTED */
  const handlePrint = () => {
    const nodes = printRef.current.querySelectorAll(
      ".label[data-selected='true']"
    );

    let html = `<div class="grid">`;
    nodes.forEach((n) => (html += n.outerHTML));
    html += `</div>`;

    const w = window.open("", "", "width=900,height=650");
    w.document.write(`
      <html>
      <head>
        <style>
          @page { size:A4; margin:5mm; }
          body { font-family:Arial; margin:0; }

          .grid {
            width:210mm;
            display:grid;
            grid-template-columns: repeat(auto-fit, minmax(${selectedLabel.width}mm,1fr));
            gap:2mm;
          }

          .label {
            width:${selectedLabel.width}mm;
            height:${selectedLabel.height}mm;
            border:0.5px solid #000;
            padding:1mm;
            box-sizing:border-box;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:${selectedLabel.font}px;
          }
        </style>
      </head>
      <body>${html}</body>
      </html>
    `);
    w.document.close();
    w.onload = () => {
      w.print();
      w.close();
    };
  };

  return (
    <div className="w-[80%] mx-auto p-6">
      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Search product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-5 gap-4 mb-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-3 border cursor-pointer"
            onClick={() => filterBarCode(p)}
          >
            <b>{p.name}</b>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <b>Label Size:</b>
        <select
          value={labelSize}
          onChange={(e) => setLabelSize(e.target.value)}
          className="px-2 py-1 border"
        >
          <option value="50x25">50 × 25</option>
          <option value="60x40">60 × 40</option>
          <option value="72x30">72 × 30</option>
        </select>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowPreview(true)}
          className="px-4 py-2 text-white bg-green-500 rounded"
        >
          Preview
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Print Selected
        </button>
      </div>

      {showPreview && (
        <div ref={printRef}>
          <div className="grid">
            {filterBarcodeData.map((item) =>
              Array(item.quantity)
                .fill(0)
                .map((_, idx) => {
                  const key = `${item.id}-${idx}`;
                  const checked = selectedBarcodes[key];

                  return (
                    <div
                      key={key}
                      className="relative label"
                      data-selected={checked}
                      style={{ opacity: checked ? 1 : 0.3 }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelect(key)}
                        className="absolute top-1 left-1"
                      />

                      <div className="barcode-box">
                        <Barcode
                          value={item.barcode_no}
                          width={selectedLabel.barcodeWidth}
                          height={selectedLabel.barcodeHeight}
                          displayValue={false}
                        />
                        <div className="code">{item.barcode_no}</div>
                        <div className="wt">
                          NWT:{item.nwt} | GWT:{item.gwt}
                        </div>
                        <div className="wt">
                          DWT:{item.diamond_details || "-"}
                        </div>
                        <div className="name">
                          ₹{item.basic_rate} {item.product_name}
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
