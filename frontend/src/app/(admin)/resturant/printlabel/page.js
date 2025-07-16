"use client";
import React, { useState, useEffect, useRef } from "react";
import Barcode from "react-barcode";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";

const ProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [barcodeData, setBarcodeData] = useState([]);
  const [filterBarcodeData, setFilterBarcodeData] = useState([]);
  const [cart, setCart] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedBarcodes, setSelectedBarcodes] = useState({});
  const printRef = useRef();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
    return null;
  };

  const fetchAllBarCode = async () => {
    const token = getCookie("access_token");
    const response = await axios.get("https://api.equi.co.in/api/barcodes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBarcodeData(response.data);
  };

  useEffect(() => {
    fetchAllBarCode();
  }, []);

  useEffect(() => {
    const token = getCookie("access_token");
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `https://api.equi.co.in/api/barcode-search?search=${search}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Product fetch error", err);
      }
    };

    if (search.length > 2 || search === "") fetchProducts();
  }, [search]);

  const filterBarCode = (product) => {
    const result = barcodeData.filter((item) => item.item_id === product.id);
    setFilterBarcodeData(result);
  };

  const addToCart = (product) => {
    setCart([{ ...product, quantity: 1 }]); // Only one product allowed in cart
    filterBarCode(product);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    setFilterBarcodeData([]);
  };

  const toggleBarcodeSelection = (barcodeId) => {
    setSelectedBarcodes((prev) => ({
      ...prev,
      [barcodeId]: !prev[barcodeId],
    }));
  };



  useEffect(() => {
  // Initialize selectedBarcodes state: all selected by default
  const initialSelection = {};
  filterBarcodeData.forEach(item => {
    initialSelection[item.id] = true;
  });
  setSelectedBarcodes(initialSelection);
}, [filterBarcodeData]);


  const handlePrint = async () => {
  try {
    const token = getCookie("access_token");
    // Only include selected barcodes explicitly selected
    const selectedItems = filterBarcodeData.filter(
      (item) => selectedBarcodes[item.id] === true
    );

    if (selectedItems.length === 0) {
      alert("Please select at least one barcode to print.");
      return;
    }

    await axios.post(
      "https://api.equi.co.in/api/barcode-print-history",
      {
        barcodes: selectedItems.map((item) => ({
          barcode_id: item.id,
          product_id: item.item_id,
        })),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Print history saved.");
    window.print();
  } catch (err) {
    console.error("Failed to save print history:", err);
    alert("Print save failed!");
  }
};



  return (
    <div className="p-6 w-[80%] mx-auto">
      <style>{`
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
            padding: 10mm;
          }
          .print-hide {
            display: none !important;
          }
          .barcode-card {
            width: 26mm;
            padding: 0;
            text-align: center;
            font-size: 10px;
            page-break-inside: avoid;
          }
          .barcode-card svg {
            width: 100% !important;
            height: auto !important;
            display: block;
          }
        }
      `}</style>

      {/* Search Input */}
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
            onClick={() => addToCart(product)}
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">Barcode: {product.barcode}</p>
            <p className="text-sm text-gray-500">Item Code: {product.item_code}</p>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-4">Selected Item</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex space-x-12 items-center mb-2">
            <p>{item.name}</p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 text-[1.8rem]"
            >
              <RxCross1 />
            </button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex space-x-2">
        <button
          onClick={() => setShowPreview(true)}
          className="bg-green-500 text-white text-[1.1rem] px-4 py-2 rounded-lg"
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

      {/* Preview / Print Area */}
      {showPreview && (
        <div className="mt-6" id="print-area" ref={printRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filterBarcodeData.map((item) =>
  (selectedBarcodes[item.id] ?? true) && // Only render if selected
    Array(item.quantity)
      .fill(null)
      .map((_, idx) => {
        const barcodeValue = item.itemno;
        return (
          <div
            key={`${item.id}-${idx}`}
            className="barcode-card p-4 border rounded-lg grid place-items-center"
          >
            <div className="mb-2 print-hide">
              <input
                type="checkbox"
                checked={!!selectedBarcodes[item.id]}
                onChange={() => toggleBarcodeSelection(item.id)}
                className="mr-2"
              />
              <label>Select for print</label>
            </div>
            <p className="text-center font-semibold">{item.name}</p>
            <p className="text-center text-[11px]">Price: ₹{item.basic_rate}</p>
            <div className="flex space-x-[4px] print-hide">
              <p className="text-center text-[11px]">nwt: {item.nwt}</p>
              <p className="text-center text-[11px]">gwt: ₹{item.gwt}</p>
            </div>
            <div className="w-full max-w-[250px] flex justify-center items-center overflow-hidden">
             <Barcode value={barcodeValue} width={2} height={80} format="CODE128" />
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
