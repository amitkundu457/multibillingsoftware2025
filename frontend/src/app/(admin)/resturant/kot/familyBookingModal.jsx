"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
// import { getphoneSearchrest } from "@/app/components/config";
import { getphoneSearchrest, getphoneSearch } from "../../../components/config";
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
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
      <p className="text-xl font-semibold">{name}</p>
      <p className="text-lg text-green-600">₹{price}</p>
      <p className="text-sm text-gray-500">Quantity: {quantity}</p>
      <div className="flex items-center mt-2 space-x-2">
        <button
          onClick={onDecrease}
          className="px-4 py-1 font-semibold text-white transition-all duration-300 ease-in-out transform shadow-md rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
        ></button>
        <span className="text-xl font-bold">{quantity}</span>
        <button
          onClick={onIncrease}
          className="px-4 py-0 text-lg font-semibold text-white transition-all duration-300 ease-in-out transform shadow-md rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
        >
          +
        </button>
      </div>
      <button
        onClick={onRemove}
        className="mt-2 mr-5 text-2xl text-red-500 align-middle"
      >
        <ImCross />
      </button>
    </div>
  );
};

export default function FamilyBookingModal({ isOpen, onClose }) {
  const [membersCount, setMembersCount] = useState("");
  const [tableOptions, setTableOptions] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFormVisible, setFormVisible] = useState(false);
  const [familyBookingId, setFamilyBookingId] = useState("");
  const [itemsCategory, setItemsCategory] = useState([]);
  const [data, setData] = useState([]);
  const [showBarcodeNumber, setShowBarcodeNumber] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [searchItem, setSearchItem] = useState(null);
  const [customerFound, setCustomerFound] = useState(null);
  const [pcss, setPcs] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredItems, setFilteredItems] = useState(data);

  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState("");
  // const [customerDetails, setCustomerDetails] = useState({
  //   name: "",
  //   address: "",
  //   gstin: "",
  // });

  const [customerDetails, setCustomerDetails] = useState({
    id: null,
    name: "",
    email: "",
    gender: "",
    dob: "",
    anniversary: "",
    address: "",
    gstin: "",
  });

  const handleOpenModal = () => {
    setFormVisible(true); // Open modal
  };

  useEffect(() => {
    if (customerFound === false) {
      setShowNewCustomerForm(true);
    }
  }, [customerFound]);
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (categoryId === "") {
      setFilteredItems(data); // Show all if no category
    } else {
      const filtered = data.filter(
        (item) => item.type.toString() === categoryId
      );
      setFilteredItems(filtered);
    }
  };

  useEffect(() => {
    const newItem = data.filter((p) =>
      p.name.toLowerCase().includes(searchItem.toLowerCase())
    );
    setFilteredItems(newItem);
  }, [searchItem]);

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

    if (isOpen) {
      fetch(" https://apibrize.brizindia.com/api/kot-tables", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setTableOptions(data.tables));
    }
  }, [isOpen, selectedTables]);

  useEffect(() => {
    const token = getCookie("access_token");
    axios
      .get(" https://apibrize.brizindia.com/api/product-and-service", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setFilteredItems(response.data);
      })
      .catch((error) => {
        alert("Failed to fetch products");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const token = getCookie("access_token");

      try {
        const response = await axios.get(
          " https://apibrize.brizindia.com/api/type",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItemsCategory(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    fetchBarCodeData();
  }, []);

  const fetchBarCodeData = async () => {
    try {
      const token = getCookie("access_token");
      const response = await axios.get(
        " https://apibrize.brizindia.com/api/barcodes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllProducts(response.data);
      return response.data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching barcode data:", error);
    }
  };

  const Printbill = (bookingId) => {
    if (!bookingId) {
      console.error("Order ID is required for printing.");
      return;
    }

    console.log("booking ID:", bookingId);

    const printUrl = `/resturant/printfamilykot?id=${bookingId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };

  const handleBooking = async () => {
    const token = getCookie("access_token");
    if (selectedProduct.length == 0 || selectedTables.length === 0) {
      alert("Please select at least one product and one table.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        " https://apibrize.brizindia.com/api/book-family-tables",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_name: customerDetails?.name || "",
            customer_id: customerDetails?.id || null,
            members_count: membersCount,
            table_ids: selectedTables,
            items: selectedProduct?.map((item) => ({
              product_id: item.id,
              product_price: item.rate,
              quantity: item.quantity,
              tax_rate: item?.tax_rate || null,
            })),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        const printConfirmation = window.confirm(
          "Do you want to print the kot ?"
        );
        if (printConfirmation) {
          Printbill(result.booking_id);
        }

        onClose();
      } else {
        alert(result.message || "Booking failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSelectedProduct([]);
      setSelectedTables([]);
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

  //new phone details
  useEffect(() => {
    if (phoneNumber.length === 10) {
      fetchCustomerByPhone();
    }

    if (phoneNumber.length < 10) {
      setCustomerFound(null);
      setCustomerDetails({
        id: null,
        name: "",
        email: "",
        gender: "",
        dob: "",
        anniversary: "",
        address: "",
        gstin: "",
      });
    }
  }, [phoneNumber]);

  const fetchCustomerByPhone = async () => {
    try {
      setLoadingCustomer(true);
      setCustomerError("");

      // const res = await axios.get(`/api/customers/phone/${phoneNumber}`);

      const res = await getphoneSearch(phoneNumber);
      // console.log("response customer",);
      // const customer = response.data;
      console.log("res data", res.data);
      if (res.data) {
        setCustomerFound(true);
        setCustomerDetails({
          // id: res.data.customer.id,
          // name: res.data.customer.name || "",
          // email: res.data.customer.email || "",
          // gender: res.data.customer.gender || "",
          // dob: res.data.customer.dob || "",
          // anniversary: res.data.customer.anniversary || "",
          // address: res.data.customer.address || "",
          // gstin: res.data.customer.gstin || "",

          id: res.data.id, // ✅ FIXED
          customer_id: res.data.customer_id,
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          gender: res.data.gender || "",
          dob: res.data.dob || "",
          anniversary: res.data.anniversary || "",
          address: res.data.address || "",
          gstin: res.data.gstNo || "",
        });
      } else {
        setCustomerFound(false);
      }
    } catch (err) {
      setCustomerFound(false);
    } finally {
      setLoadingCustomer(false);
    }
  };

  const resetCustomerForm = () => {
    setCustomerDetails({
      id: null,
      customer_id: null,
      name: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      anniversary: "",
      address: "",
      gstin: "",
      // state: "",
      // country: "",
      // pincode: "",
      // remarke: "",
    });

    setPhoneNumber("");
    setCustomerFound(null);
    // setLoyalty([]);
    // setStages([]);
    // setNewRedeemPoints(0);
    // setNewSelectedStage(null);
  };

  const handleCreateCustomer = async () => {
    const token = getCookie("access_token");
    try {
      const payload = {
        phone: phoneNumber,
        name: customerDetails.name,
        email: customerDetails.email,
        gender: customerDetails.gender,
        dob: customerDetails.dob,
        anniversary: customerDetails.anniversary,
        address: customerDetails.address,
        gstNo: customerDetails.gstin,

        city: customerDetails.city || "",
        state: customerDetails.state || "",
        country: "IN",
        pincode: customerDetails.pincode || "",
        remarke: customerDetails.remarke || "",

        customerTypeData: "",
        customerSubTypeData: "",
        customerEnquiry: "customer",
        visit_source: "",
      };

      const res = await axios.post(
        "https://apibrize.brizindia.com/api/customers",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomerDetails((prev) => ({
        ...prev,
        id: res.data.customer.id,
      }));

      setCustomerFound(true);
      resetCustomerForm();
    } catch (err) {
      setCustomerError("Failed to save customer");
    }
  };

  // Handle product removal
  const handleRemoveProduct = (index) => {
    setSelectedProduct((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );
  };

  const orderProducts = async () => {
    const token = getCookie("access_token");

    const payload = {
      table_no: selectedTables,
      items: selectedProduct.map((item) => ({
        product_id: item.id,
        product_price: item.rate,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        " https://apibrize.brizindia.com/api/book-family-tables",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedProduct([]);
      console.log(response);

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

  // const handleSearch = async () => {
  //   try {
  //     const response = await getphoneSearch(phoneNumber);
  //     console.log("response customer", response);
  //     const customer = response.data;
  //     setCustomerDetails({
  //       name: customer.name || "",
  //       id: customer.id || "",
  //       address: customer.address || "",
  //       gstin: customer.gstin || "",
  //     });
  //   } catch (error) {
  //     console.error("Error fetching customer details:", error);
  //     alert("Customer not found");
  //   }
  // };
  // const updatePayload = {
  //   family_booking_id: familyBookingId,
  //   items: selectedProduct?.map((item) => ({
  //     product_id: item.id,
  //     product_price: item.rate,
  //     quantity: item.quantity,
  //     tax_rate: item?.tax_rate || null,
  //   })),
  // };

  const handleAddItemClick = async () => {
    if (!familyBookingId) {
      alert("Please enter a booking ID");
      return;
    }
    try {
      const response = await axios.put(
        " https://apibrize.brizindia.com/api/update-family-tables",
        updatePayload
      );

      setSelectedProduct([]);

      const printConfirmation = window.confirm("Do you want to print the Kot?");

      if (printConfirmation) {
        Printbill(response.data.family_booking_id);
      }
    } catch (error) {}

    // Navigate to item-add form or open modal
    // Example: navigate(`/add-items/${familyBookingId}`);
    console.log("Add item for booking ID:", familyBookingId);
  };

  const handleSearchBarCode = async () => {
    if (!barcode.trim()) {
      setError("Please enter a barcode or fill details manually.");
      // setIsEditable(true);
      return;
    }

    try {
      console.log("alldata", allProducts);
      const foundItem = allProducts.find((p) => p.barcode_no === barcode);
      console.log("bracode2", foundItem);

      const barcodeFilter = filteredItems.filter(
        (p) => p.id === foundItem.item_id
      );
      setFilteredItems(barcodeFilter);

      if (foundItem) {
        console.log(foundItem.basic_rate);
        // setSelectedItem(foundItem);
        setPcs(Number(foundItem.pcs) || 1);

        setIsOpen(true); // <-- open modal with new data
      } else {
        alert("Product with this barcode not found");
      }
      // setBarcode("");
    } catch (error) {
      console.error("Error searching barcode:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen p-6 bg-white md:p-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Table Booking</h2>
            <button
              onClick={onClose}
              className="text-xl font-bold text-gray-500 hover:text-red-600"
            >
              ✕
            </button>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
            <div className="mb-10 space-x-2 ">
              <label className="block mb-1 ml-2 font-medium">
                {" "}
                Enter Mobile Number
              </label>

              {/* <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-9/12 p-2 border rounded"
                placeholder="Enter Mobile Number"
                // value={mobileNumber}
                // onChange={(e) => setMobileNumber(e.target.value)}
              /> */}
              <input
                type="text"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPhoneNumber(value);
                }}
                placeholder="Enter phone number"
              />
              {/* <button
                type="button"
                onClick={handleSearch}
                className="p-2 text-white transition duration-200 bg-green-500 rounded-full shadow hover:bg-green-600"
              >
                <IoIosSearch />
              </button> */}

              {/* <button
                type="button"
                className="p-2 text-white transition duration-200 bg-green-500 rounded-full shadow hover:bg-green-600"
                onClick={handleOpenModal}
              >
                <FaPlus />
              </button> */}

              {/* ui add here  */}
              {customerFound === true && (
                <p className="text-green-600 text-sm">Existing Customer</p>
              )}

              {customerFound === false && (
                <p className="text-red-600 text-sm">
                  New Customer – Please fill details
                </p>
              )}
              {/* {customerFound === true && (
                <p className="text-green-600 text-sm">Existing Customer</p>
              )}

              {customerFound === false && (
                <p className="text-red-600 text-sm">
                  New Customer – Please fill details
                </p>
              )}
              {customerFound === false && (
                <>
                  <input
                    placeholder="Customer Name"
                    value={customerDetails.name}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="Email"
                    value={customerDetails.email}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        email: e.target.value,
                      })
                    }
                  />

                  <select
                    value={customerDetails.gender}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>

                  <input
                    type="date"
                    value={customerDetails.dob}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        dob: e.target.value,
                      })
                    }
                  />

                  <input
                    type="date"
                    value={customerDetails.anniversary}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        anniversary: e.target.value,
                      })
                    }
                  />

                  <textarea
                    placeholder="Address"
                    value={customerDetails.address}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        address: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="GSTIN"
                    value={customerDetails.gstin}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        gstin: e.target.value,
                      })
                    }
                  />

                  <button
                    className="bg-yellow-700 p-2"
                    onClick={handleCreateCustomer}
                  >
                    Save Customer
                  </button>
                </>
              )} */}

              {customerFound === false && showNewCustomerForm && (
                <div className="relative p-4 mt-3 bg-yellow-50 border border-yellow-400 rounded-lg shadow-md">
                  {/* Close Icon */}
                  <button
                    className="absolute text-red-500 top-2 right-2 hover:text-red-700"
                    onClick={() => setShowNewCustomerForm(false)}
                  >
                    ✕
                  </button>

                  <h3 className="mb-3 text-sm font-semibold text-yellow-800">
                    New Customer Details
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Customer Name */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter customer name"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400"
                        value={customerDetails.name}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400"
                        value={customerDetails.email}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400"
                        value={customerDetails.gender}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            gender: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400"
                        value={customerDetails.dob}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            dob: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Anniversary */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Anniversary Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400"
                        value={customerDetails.anniversary}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            anniversary: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* GSTIN */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        GSTIN
                      </label>
                      <input
                        type="text"
                        placeholder="Enter GSTIN"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400"
                        value={customerDetails.gstin}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            gstin: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-3">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      placeholder="Enter address"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400"
                      value={customerDetails.address}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    className="w-full p-2 mt-4 font-semibold text-white bg-yellow-600 rounded hover:bg-yellow-700"
                    onClick={handleCreateCustomer}
                  >
                    Save Customer
                  </button>
                </div>
              )}
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

            <div>
              <label className="block mb-1 font-medium">
                Number of Members
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded"
                value={membersCount}
                onChange={(e) => setMembersCount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Select Tables</label>
              <div className="p-2 overflow-y-auto bg-white border rounded max-h-40">
                {tableOptions.map((table) => {
                  const isBooked = table.status === "booked";
                  return (
                    <label
                      key={table.id}
                      className={`flex items-center gap-2 p-2 mb-1 rounded cursor-pointer ${
                        isBooked
                          ? "bg-red-100 text-red-600 cursor-not-allowed"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={table.id}
                        disabled={isBooked}
                        checked={selectedTables?.includes(table.id)}
                        onChange={(e) => {
                          const id = parseInt(e.target.value);
                          setSelectedTables((prev) =>
                            e.target.checked
                              ? [...prev, id]
                              : prev.filter((t) => t !== id)
                          );
                        }}
                      />
                      Table #{table.table_no} ({table.status})
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Enter Booking ID</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Family Booking ID"
                className="w-1/2 p-2 border rounded"
                value={familyBookingId}
                onChange={(e) => setFamilyBookingId(Number(e.target.value))}
              />
              <button
                className="px-4 text-white bg-blue-600 rounded"
                onClick={handleAddItemClick}
              >
                Add Item
              </button>
              {/* filtered product */}
              <div>
                <input
                  type="text"
                  placeholder="Item name"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  name="category"
                  id="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                >
                  <option value="">Select Category </option>
                  {itemsCategory.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setFilteredItems(data)} // Reset filter
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
              {/* Barcode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Barcode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() => {
                      setShowBarcodeNumber(!showBarcodeNumber);
                    }}
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-red-500 peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>
              {/* barcode input feild */}
              {showBarcodeNumber && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => {
                      setBarcode(e.target.value);
                    }}
                    placeholder="Enter Barcode number"
                    className="w-full p-2 bg-red-100 border border-red-500 rounded outline-none focus:border-red-700"
                  />

                  <button
                    type="button"
                    onClick={handleSearchBarCode}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <h3 className="mb-4 text-2xl font-semibold">Select Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto max-h-[400px] mb-6 border p-4 rounded">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectProduct(item)}
                className="flex flex-col items-center p-3 transition bg-white border rounded-lg shadow cursor-pointer hover:shadow-lg"
              >
                <img
                  src={` https://apibrize.brizindia.com/storage/${item.image}`}
                  alt={item.name}
                  className="object-cover w-full mb-2 rounded h-28"
                />
                <p className="mb-1 text-sm font-semibold text-center truncate">
                  {item.name}
                </p>
                <p className="text-sm font-bold text-center text-green-600">
                  ₹{item.rate}
                </p>
              </div>
            ))}
          </div>

          <div className="w-1/4 p-4 bg-gray-100 border-l border-gray-300 rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Selected Products
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {selectedProduct?.map((product, index) => (
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
      className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
    >
      Generate KOT
    </button> */}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700"
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
