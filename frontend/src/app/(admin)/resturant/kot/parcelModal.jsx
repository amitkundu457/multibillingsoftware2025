"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
// import { getphoneSearch } from "@/app/components/config";
import { getphoneSearchrest } from "../../../components/config";
import { IoIosSearch } from "react-icons/io";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CustomerForm from "./CustomerForm";

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

function ParcelModal({ isOpen, onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFormVisible, setFormVisible] = useState(false);
  const [parcelTypes, setParcelTypes] = useState([]);

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    gstin: "",
  });

  const [data, setData] = useState([]);

  const handleOpenModal = () => {
    setFormVisible(true); // Open modal
  };

  const handleCloseModal = () => {
    setFormVisible(false); // Close modal
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  useEffect(() => {
    const token = getCookie("access_token");
    axios
      .get("http://127.0.0.1:8000/api/product-and-service", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        alert("Failed to fetch products");
        console.log(error);
      });
  }, []);

  const Printbill = (bookingId) => {
    if (!bookingId) {
      console.error("Order ID is required for printing.");
      return;
    }

    console.log("booking ID:", bookingId);

    const printUrl = `/resturant/printparcelkot?id=${bookingId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };

  const handleBooking = async () => {
    const token = getCookie("access_token");

    if (selectedProduct.length === 0) {
      alert("Please enter  at least one product.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/parcel-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: customerDetails?.id || null,
          items: selectedProduct.map((item) => ({
            product_id: parseInt(item.id),
            product_price: parseFloat(item.rate),
            quantity: parseInt(item.quantity),
            tax_rate:parseInt(item.tax_rate),
          })),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSelectedProduct([]);
        setCustomerDetails(null);
        const printConfirmation = window.confirm(
          "Do you want to print the kot?"
        );
        if (printConfirmation) {
          Printbill(result.parcel_order_id);
        }
        onClose();
      } else {
        alert(result.message || "Booking failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
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

  const handleSearch = async () => {
    try {
      const response = await getphoneSearchrest(phoneNumber);
      const customer = response.data;
      setCustomerDetails({
        name: customer?.name || "",
        id: customer.id || "",
        address: customer?.address || "",
        gstin: customer?.gstin || "",
      });
    } catch (error) {
      console.error("Error fetching customer details:", error);
      alert("Customer not found");
    }
  };

  const API_URL = "http://127.0.0.1:8000/api/parcel-types";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json()) 
      .then((data) => {
        setParcelTypes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching parcel types:", error);
        setLoading(false);
      });
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen bg-white p-6 md:p-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Parcel Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className=" space-x-2 mb-10">
              <label className="block mb-1 font-medium ml-2">
                {" "}
                Enter Mobile Number
              </label>

              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-9/12 p-2 border rounded"
                placeholder="Enter Mobile Number"
                // value={mobileNumber}
                // onChange={(e) => setMobileNumber(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow transition duration-200"
              >
                <IoIosSearch />
              </button>

              <button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow transition duration-200"
                onClick={handleOpenModal}
              >
                <FaPlus />
              </button>
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                //  value={customerName}
                value={customerDetails?.name}
                // onChange={(e) => setCustomerName(e.target.value)}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="mt-6">
            <select className="  border rounded ">
              <option value="" disabled selected>
                 Select Parcel Type
              </option>
              {parcelTypes.map((type) => (
                <option key={type.id} value={type.type}>
                   {type.type}
                </option>
              ))}
            </select>
            </div>
           
          </div>
          <div>
            {/* <label className="block mb-1 font-medium">Enter Booking ID</label>
    <div className="flex gap-2">
      <input
        type="number"
        placeholder="Family Booking ID"
        className="p-2 border rounded w-1/2"
        value={familyBookingId}
        onChange={(e) => setFamilyBookingId(Number(e.target.value))}
      />
       <button
        className="bg-blue-600 text-white px-4 rounded"
        onClick={handleAddItemClick}
      >
        Add Item
      </button>
    
    </div> */}
          </div>

          {/* Products Grid */}
          <h3 className="text-2xl font-semibold mb-4">Select Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto max-h-[400px] mb-6 border p-4 rounded">
            {data.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectProduct(item)}
                className="bg-white border rounded-lg p-3 shadow hover:shadow-lg cursor-pointer flex flex-col items-center transition"
              >
                <img
                  src={`http://127.0.0.1:8000/${item.image}`}
                  alt={item.name}
                  className="w-full h-28 object-cover rounded mb-2"
                />
                <p className="text-sm font-semibold text-center mb-1 truncate">
                  {item.name}
                </p>
                <p className="text-green-600 text-center font-bold text-sm">
                  ₹{item.rate}
                </p>
              </div>
            ))}
          </div>

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
            {/* <button
      onClick={orderProducts}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600"
    >
      Generate KOT
    </button> */}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Generating kot..." : "Generate KOT"}
            </button>
          </div>
        </div>
        <Modal
          open={isFormVisible}
          onClose={handleCloseModal}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal",
          }}
        >
          <CustomerForm onClose={handleCloseModal} />
        </Modal>
      </div>
    </>
  );
}

export default ParcelModal;
