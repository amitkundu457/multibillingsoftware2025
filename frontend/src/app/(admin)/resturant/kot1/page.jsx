"use client";
import React, { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { MdOutlineRefresh } from "react-icons/md";
import { FiSave } from "react-icons/fi";
import { IoMdPrint } from "react-icons/io";
import axios from "axios";
import { LuLogOut } from "react-icons/lu";
import { useRouter } from "next/navigation";
import LogoutModel from "../../../components/logout/page";
import { Notyf } from "notyf";
import Printbill from "@/app/(admin)/jwellery/invoice/printbill";
import FamilyBookingModal from "./familyBookingModal";
import ParcelModal from "./parcelModal";

// ShowProduct Component (with quantity control)
export const ShowProduct = ({
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
      <p className="text-xl font-semibold">{name}</p>
      <p className="text-lg text-green-600">₹{price}</p>
      <p className="text-sm text-gray-500">Quantity: {quantity}</p>
      <div className="flex items-center space-x-2 mt-2">
        <button
          onClick={onDecrease}
          className="text-blue-500 font-semibold text-lg"
        ></button>
        <span className="font-bold text-xl">{quantity}</span>
        <button
          onClick={onIncrease}
          className="text-blue-500 font-semibold text-lg"
        >
          +
        </button>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 align-middle mr-5 text-2xl mt-2"
      >
        <ImCross />
      </button>
    </div>
  );
};

// Main Page Component
const Page = () => {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isaparcelBillModalOpen, setIsParcelBillModalOpen] = useState(false);

  const [familyBookingId, setfamilyBookingId] = useState("");
  const [parcelOrderId, setParcelOrderId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showParcelModal, setShowParcelModal] = useState(false);

  const [isLogoutModel, setIsLogoutModel] = useState(false);
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTableNo, setNewTableNo] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const handleAddTable = async () => {
    const token = getCookie("access_token");

    if (!newTableNo.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/kot-tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ table_no: newTableNo.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        onAddTable(data.table); // update frontend list
        setNewTableNo("");
        fetchKotTables();

        setIsModalOpen(false);
      } else {
        alert(data.message || "Failed to add table");
      }
    } catch (err) {
      console.error("Add table error:", err);
      alert("Server error");
    }
  };

  // Fetch data from API http://127.0.0.1:8000/api/product-and-service

  useEffect(() => {
    const token = getCookie("access_token");
    axios
      // .get(" http://127.0.0.1:8000/api/product-services",{headers: {
      .get(" http://127.0.0.1:8000/api/product-and-service", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        alert("Failed to fetch Data");
        console.log(error);
      });
  }, []);

  //fettch table count

  const fetchKotTables = async () => {
    const token = getCookie("access_token");

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/kot-tables", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTables(res.data.tables);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  useEffect(() => {
    fetchKotTables();
  }, []);

  const onSelectTable = (tableNo) => {
    setSelectedTable(tableNo === selectedTable ? null : tableNo); // click again to unselect
  };

  const onAddTable = (newTable) => {
    setTables((prev) => [...prev, newTable]);
  };

  // Handle product selection and quantity increase
  const handleSelectProduct = (product) => {
    setSelectedProduct((prevProducts) => {
      const existingProduct = prevProducts.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        // If product exists, increase its quantity
        return prevProducts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If product does not exist, add it with quantity 1
        return [...prevProducts, { ...product, quantity: 1 }];
      }
    });
  };

  // Increase product quantity
  const handleIncreaseQuantity = (product) => {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease product quantity
  const handleDecreaseQuantity = (product) => {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((item) =>
        item.id === product.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Handle product removal
  const handleRemoveProduct = (index) => {
    setSelectedProduct((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );
  };

  // const orderProducts = async ()=>{
  //   const token = getCookie("access_token");
  //   const payload = selectedProduct.map((item)=>({
  //     id:item.id,
  //    // productName:item.name,
  //     productPrice:item.rate,
  //     quantity:item.quantity

  //   }))

  //   try {

  //     const response =  await axios.post('http://127.0.0.1:8000/api/kot-orders',payload,{
  //       headers:{
  //         "Content-Type":"application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     alert("order placed!!");
  //     setSelectedProduct([]); // clear selected products

  //   } catch (error) {
  //     console.error("failed to place order:",error);
  //     alert("failed to placed order.please try again");

  //   }
  // };

  const orderProducts = async () => {
    const token = getCookie("access_token");
    console.log("product_id",selectedProduct)
    const payload = {
      table_no: selectedTable,
     
      items: selectedProduct.map((item) => ({
        product_id: item.id,
        product_price: item.rate,
        quantity: item.quantity,
        tax_rate:item.tax_rate

      })),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/kot-orders",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedProduct([]);
      console.log("kot bill", response);

      const printConfirmation = window.confirm(
        "Do you want to print the bill?"
      );
      if (printConfirmation) {
        Printbill(response.data.table_no, response.data.bill_inv);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      notyf.error("Failed to place order. Please try again.");
    }
  };

  const Printbill = (orderId, billInv) => {
    if (!orderId) {
      console.error("Order ID is required for printing.");
      return;
    }

    console.log("Order ID:", orderId);
    console.log("Bill Invoice Flag:", billInv);

    // Determine the correct URL based on billInv value
    const printUrl = `/resturant/printkot?id=${orderId}`;
    //   billInv == 0
    //     ? `/jwellery/printinvoice/${orderId}`
    //     : `/jwellery/estimate/${orderId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };

  const handleLogoutClick = () => {
    setIsLogoutModel(true);
  };

  const GenerateBillFunction = async () => {
    const token = getCookie("access_token");

    if (!familyBookingId.trim()) {
      alert("Please enter a kot number");
      return;
    }

    const printConfirmation = window.confirm("Do you want to print the bill?");
    if (printConfirmation) {
      setfamilyBookingId("");
      PrintTableBill(familyBookingId);
    }
  };

  const GenerateParcelBillFunction = async () => {
    const token = getCookie("access_token");

    if (!parcelOrderId.trim()) {
      alert("Please enter a kot number");
      return;
    }

    const printConfirmation = window.confirm("Do you want to print the bill?");
    if (printConfirmation) {
      setParcelOrderId("");
      PrintParcelBill(parcelOrderId);
    }
  };

  const PrintTableBill = (orderId) => {
    if (!orderId) {
      console.error("Order ID is required for printing.");
      return;
    }

    console.log("Order ID:", orderId);

    // Determine the correct URL based on billInv value
    const printUrl = `/resturant/printkotbill?id=${orderId}`;
    //   billInv == 0
    //     ? `/jwellery/printinvoice/${orderId}`
    //     : `/jwellery/estimate/${orderId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };
  const PrintParcelBill = (orderId) => {
    if (!orderId) {
      console.error("Order ID is required for printing.");
      return;
    }

    console.log("Order ID:", orderId);

    // Determine the correct URL based on billInv value
    const printUrl = `/resturant/printparcelbill?id=${orderId}`;
    //   billInv == 0
    //     ? `/jwellery/printinvoice/${orderId}`
    //     : `/jwellery/estimate/${orderId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center bg-green-600 w-full h-9">
        {/* <button className="text-white align-middle ml-5 text-2xl">
          <IoHome />
        </button> */}
        <div className="text-white mt-1 text-xl  items-center">KOT</div>
        {/* <button onClick={handleLogoutClick} className="ml-10 text-3xl text-white"><LuLogOut /></button> */}
        {/* <button className="text-white align-middle mr-5 text-2xl">
          <ImCross />
        </button> */}
      </header>

      {/* Navigation */}
      {/* <nav className="flex justify-items-start w-full pl-10 border  shadow-2xl">
        <div>
          <button className="text-4xl">
            <MdOutlineRefresh />
          </button>
          <p>refresh</p>
        </div>
        <div className="pl-10">
          <button className="text-4xl">
            <FiSave />
          </button>
          <p>save</p>
        </div>
        <div className="pl-10">
          <button className="text-4xl">
            <IoMdPrint />
          </button>
          <p>print</p>
        </div>
      </nav> */}

      {/* Filters */}
      {/* <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <input
          type="date"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      
        <select
          name="option1"
          defaultValue=""
          className="border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" disabled>
            Select Option 1
          </option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </select>
        <select
          name="option2"
          defaultValue=""
          className="border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" disabled>
            Select Option 2
          </option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </select>
        <select
          name="option3"
          defaultValue=""
          className="border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" disabled>
            Select Option 3
          </option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </select>
      </div> */}

      {/* Category & Item Selection */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <select
          name="category"
          id="category"
          className="border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Category</option>
          <option value="veg">Veg</option>
          <option value="nonveg">Non-Veg</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
        {/* <MdOutlineRefresh
          size={24}
          className="text-blue-500 cursor-pointer hover:rotate-90 transition-transform"
          title="Refresh"
        /> */}

        <button
          onClick={() => setIsParcelBillModalOpen(true)}
          className="bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          parcel order Bill
        </button>
        <button
          onClick={() => setIsBillModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Generate Bill
        </button>

        {/* <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Book Table
      </button> */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setOpenDropdown((prev) => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Take Order ▾
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
              <button
                onClick={() => {
                  setShowModal(true);
                  setOpenDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
              >
                Dine-in
              </button>
              <button
                onClick={() => {
                  setShowParcelModal(true);
                  setOpenDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
              >
                Parcel
              </button>
            </div>
          )}
        </div>

        <FamilyBookingModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
        <ParcelModal
          isOpen={showParcelModal}
          onClose={() => setShowParcelModal(false)}
        />
      </div>

      {/* show table icon  */}
      <div className="p-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex justify-between items-center">
            Choose a Table
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
            >
              Add Table
            </button>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {tables.map((table) =>
              table && table.table_no ? (
                <button
                  key={table.id}
                  // onClick={() => onSelectTable(table.table_no)}
                  className={`text-white font-bold rounded-xl h-24 flex items-center justify-center shadow transition
    ${
      selectedTable === table.table_no
        ? "bg-red-600 hover:bg-red-700"
        : table.status === "booked"
        ? "bg-red-600 hover:bg-red-700"
        : table.status === "available"
        ? "bg-green-500 hover:bg-green-600"
        : "bg-yellow-500 hover:bg-yellow-600"
    }
  `}
                >
                  {table.table_no}
                </button>
              ) : null
            )}
          </div>
        </div>

        {/* // Show product selection when a table is selected */}
        <div className="flex">
          {/* Product Grid */}
          <div className="w-3/4 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 h-[300px] overflow-y-auto">
            {data.map((item) => (
              <div
                onClick={() => handleSelectProduct(item)}
                key={item.id}
                className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer"
              >
                <p className="text-center font-semibold mb-2">{item.name}</p>
                <img
                  src={`http://127.0.0.1:8000/${item.image}`}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-center text-xl font-bold text-green-600">
                  ₹{item.rate}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Products */}
          <div className="w-1/4 p-4 bg-gray-100 border-l border-gray-300 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Selected Products
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {selectedProduct.map((product, index) => (
                <ShowProduct
                  key={index}
                  name={product.name}
                  price={product.rate}
                  quantity={product.quantity}
                  onIncrease={() => handleIncreaseQuantity(product)}
                  onDecrease={() => handleDecreaseQuantity(product)}
                  onRemove={() => handleRemoveProduct(index)}
                />
              ))}
            </div>
            <button
              onClick={orderProducts}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600"
            >
              Order
            </button>
          </div>
        </div>
      </div>

      {isLogoutModel && <LogoutModel onClose={() => setIsLogoutModel(false)} />}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Table
            </h3>
            <input
              type="text"
              placeholder="Enter table number (e.g., T10)"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTableNo}
              onChange={(e) => setNewTableNo(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTable}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {isBillModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Enter family Booking no.
            </h2>
            <input
              type="text"
              placeholder="kot number"
              value={familyBookingId}
              onChange={(e) => setfamilyBookingId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsBillModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={GenerateBillFunction}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isaparcelBillModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Enter parcel order no.
            </h2>
            <input
              type="text"
              placeholder="parcel order"
              value={parcelOrderId}
              onChange={(e) => setParcelOrderId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsParcelBillModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={GenerateParcelBillFunction}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
