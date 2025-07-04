"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

import {
  displayCoin,
  getBillno,
  getProductService,
} from "@/app/components/config";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // Import Notyf CSS
import { IoIosSearch } from "react-icons/io";

import { getphoneSearch } from "@/app/components/config";
import Printbill from "@/app/(admin)/jwellery/invoice/printbill";

const notyf = new Notyf();
export default function InvoicePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [billNo, setBillNo] = useState("");

  const [bill_inv, setbillinv] = useState("");

  const [addedProducts, setAddedProducts] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [coin, setItemscoin] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [dateid, setDateid] = useState("");
  const [grossTotal, setGrossTotal] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [modalStep, setModalStep] = useState(1); // 1 for customer details, 2 for checkout
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    gstin: "",
  });
  const gto = grossTotal;
  console.log(gto);
  const [cashAmount, setCashAmount] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    cardAmount: 0,
    serviceCharge: 0,
  });
  const [upiAmount, setUpiAmount] = useState(0);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [couponNo, setCouponNo] = useState("");
  const [couponAmount, setCouponAmount] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [customerid, setCustomerId] = useState(false);

  const remainingAmount =
    gto -
    (Number(cashAmount) +
      Number(cardDetails.cardAmount) +
      Number(cardDetails.serviceCharge) +
      Number(upiAmount) +
      Number(adjustAmount) +
      Number(advanceAmount));

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    // Reset amounts for all other methods to 0
    setCashAmount(method === "cash" ? gto : 0);
    setCardDetails(
      method === "card"
        ? { cardAmount: gto, serviceCharge: 0 }
        : { cardAmount: 0, serviceCharge: 0 }
    );
    setUpiAmount(method === "upi" ? gto : 0);
    setAdjustAmount(method === "adjust" ? gto : 0);
    setAdvanceAmount(method === "advance" ? gto : 0);
  };

  const handleSearch = async () => {
    try {
      const response = await getphoneSearch(phoneNumber);
      const customer = response.data;
      setCustomerDetails({
        name: customer.name || "",
        id: customer.id || "",
        address: customer.address || "",
        gstin: customer.gstin || "",
      });
    } catch (error) {
      console.error("Error fetching customer details:", error);
      alert("Customer not found");
    }
  };

  useEffect(() => {
    fetchItems();
    fetchItemsCoin();
    fetchNextBillNo();
  }, []);
  const fetchItems = async () => {
    try {
      const response = await getProductService();
      setItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsCoin = async () => {
    try {
      const response = await displayCoin();
      console.log(response.data.total_coins);
      setItemscoin(response.data.total_coins);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchNextBillNo = async () => {
    try {
      const response = await getBillno();
      setBillNo(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching bill number:", error);
    }
  };
  const openModal = (item) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };
  const handleNextStep = (e) => {
    e.preventDefault();
    setModalStep(2); // Move to the checkout step
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productDetails = {
      code: selectedItem.code,
      type: selectedItem.type,
      name: selectedItem.name,
      rate: selectedItem.rate || 0,
      grossWeight: Number(formData.get("grossWeight")) || 0,
      netWeight: Number(formData.get("netWeight")) || 0,
      pcs: Number(formData.get("pcs")) || 1,
      making: Number(formData.get("making")) || 0,
      discountPercent: Number(formData.get("discountPercent")) || 0,
      diamondWeight: Number(formData.get("diamondWeight")) || 0,
      diamondValue: Number(formData.get("diamondValue")) || 0,
      stoneWeight: Number(formData.get("stoneWeight")) || 0,
      stoneValue: Number(formData.get("stoneValue")) || 0,
      huid: formData.get("huid") || "",
      hallmark: formData.get("hallmark") || "",
    };

    setAddedProducts((prev) => [...prev, productDetails]);
    closeModal();
    calculateTotals([...addedProducts, productDetails]);
  };

  const calculateTotals = (products) => {
    let gross = 0;
    let discount = 0;

    products.forEach((product) => {
      const productTotal =
        product.rate * product.netWeight +
        product.making +
        product.diamondValue;
      const productDiscount = (product.discountPercent / 100) * productTotal;
      gross += productTotal;
      discount += productDiscount;
    });

    setGrossTotal(gross);
    setDiscountTotal(discount);
  };

  const openCheckout = () => {
    setCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
    setModalStep(1);
  };

  const openCustomerid = () => {
    setCustomerId(true);
  };

  const closeCustomerid = () => {
    setCustomerId(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const handleCheckoutSubmit = async () => {
    const token = getCookie("access_token");
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }

    if (!customerDetails?.id) {
      notyf.error(
        "Please ensure customer details are complete before proceeding."
      );
      return;
    }

    if (addedProducts.length === 0) {
      notyf.error("No products added to the order.");
      return;
    }

    const paymentDetails = {
      cash: { cashAmount },
      card: {
        cardAmount: cardDetails.cardAmount,
        serviceCharge: cardDetails.serviceCharge,
      },
      upi: { upiAmount },
      adjust: { adjustAmount },
      advance: { advanceAmount },
    };
    const paymentMethodDetails = paymentDetails[paymentMethod];

    if (!paymentMethodDetails) {
      notyf.error("Invalid payment method selected.");
      return;
    }

    const payload = {
      products: addedProducts.map((product) => ({
        name: product.name,
        code: product.code,
        grossWeight: product.grossWeight,
        netWeight: product.netWeight,
        making: product.making,
        rate: product.rate,
        stoneWeight: product.stoneWeight,
        stoneValue: product.stoneValue,
        huid: product.huid,
        hallmark: product.hallmark,
      })),
      grossTotal,
      discountTotal,
      paymentMethod,
      dateid,
      bill_inv,
      customer_id: customerDetails.id,
      price:
        paymentMethodDetails.cashAmount ||
        paymentMethodDetails.cardAmount ||
        paymentMethodDetails.upiAmount ||
        0,
    };
    console.log(payload);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/order",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      notyf.success(`Order placed successfully!`);
      fetchItemsCoin();

      // Reset state
      setAddedProducts([]);
      setGrossTotal(0);
      setDiscountTotal(0);
      closeCheckout();
      // Show confirmation dialog for printing the bill
      // const printConfirmation = window.confirm("Do you want to print the bill?");
      const printConfirmation = window.confirm(
        "Do you want to print the bill?"
      );
      if (printConfirmation) {
        Printbill(response.data.order_id, response.data.bill_inv); // Call the direct print function
      }
    } catch (error) {
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
    const printUrl = `/jwellery/printinvoice?id=${orderId}`;
    //   billInv == 0
    //     ? `/jwellery/printinvoice/${orderId}`
    //     : `/jwellery/estimate/${orderId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };

  return (
    <div className="flex flex-col h-full absolute top-0 right-0 bottom-0 left-0 bg-white">
      <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 border rounded">
        {/* Invoice Dropdown */}
        <select
          name="bill_inv"
          className="border rounded px-4 py-2"
          onChange={(e) => setbillinv(e.target.value)}
        >
          <option value="0">INVOICE</option>
          <option value="1">ESTIMATE</option>
          {/* Other options */}
        </select>

        {/* Approval Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">APPROVAL</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>

        {/* Bill Number */}
        <input
          type="text"
          placeholder="Bill No"
          value={billNo}
          className="border rounded px-4 py-2"
        />

        {/* Date Picker */}
        <div className="flex items-center border rounded px-4 py-2">
          <input
            type="date"
            name="date"
            value={dateid}
            // value="12/12/2024"
            // className="focus:outline-none"
            onChange={(e) => {
              console.log("Date Change:", e.target.value);
              setDateid(e.target.value);
            }}
          />
          {/*<button>*/}
          {/*    <svg*/}
          {/*        xmlns="http://www.w3.org/2000/svg"*/}
          {/*        fill="none"*/}
          {/*        viewBox="0 0 24 24"*/}
          {/*        stroke="currentColor"*/}
          {/*        className="w-5 h-5 text-gray-500"*/}
          {/*    >*/}
          {/*        <path*/}
          {/*            strokeLinecap="round"*/}
          {/*            strokeLinejoin="round"*/}
          {/*            strokeWidth="2"*/}
          {/*            d="M8 7V3m8 4V3m-9 9h10M5 12h14M5 18h14m-9-6h4"*/}
          {/*        />*/}
          {/*    </svg>*/}
          {/*</button>*/}
        </div>

        {/* Salesman Dropdown */}
        <select className="border rounded px-4 py-2">
          <option>Select Salesman</option>
          {/* Other options */}
        </select>

        {/* Category Dropdown */}
        <select className="border rounded px-4 py-2">
          <option>Select Category</option>
          {/* Other options */}
        </select>

        {/* Refresh Icon */}
        <button className="p-2 border rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.812-1.268a9 9 0 11-3.733-5.142M12 9v3l2 2"
            />
          </svg>
        </button>

        {/* Search Item */}
        <div>
          <label className="font-medium">Search Item</label>
          <input
            type="text"
            placeholder="Search Item"
            className="border rounded px-4 py-2 ml-2"
          />
        </div>

        {/* Barcode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Barcode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-red-500 peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>
        <span>
          <span className="text-blue-950 text-lg font-bold"> Total Coin</span>:{" "}
          <span className="text-orange-900 text-lg font-bold">{coin}</span>
        </span>
      </div>

      <main className="flex flex-1">
        <div className="flex-1 grid grid-cols-7 gap-4 p-4 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.code}
              className="border-blue-500 border h-[200px] rounded-lg p-4 flex flex-col items-center text-center cursor-pointer"
              onClick={() => openModal(item)}
            >
              <p className="mt-2 text-sm font-bold">{item.name || "No Type"}</p>
              <div className=" w-full h-32 flex items-center justify-center text-gray-500">
                {item.image ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.image}`}
                    alt={item.code}
                    width={100}
                    height={100}
                  />
                ) : (
                  "No Image"
                )}
              </div>

              {/*<p className="text-gray-600">{item.code}</p>*/}
              <p className="text-gray-600">₹{item.rate || 0}</p>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <aside className="w-1/4 bg-gray-100 p-4 relative h-full">
          <div className="mb-16 overflow-y-auto">
            {addedProducts.map((product, index) => (
              <div key={index} className="border p-2 rounded mb-2">
                <p className="font-bold">{product.type}</p>
                <p>Code: {product.code}</p>
                <p>Gross Wgt: {product.grossWeight}</p>
                <p>Net Wgt: {product.netWeight}</p>
                <p>Making: ₹{product.making}</p>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-100">
            <div className="flex justify-between">
              <p>Gross Total:</p>
              <p>₹{grossTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Discount:</p>
              <p>₹{discountTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold">
              <p>Net Total:</p>
              <p>₹{(grossTotal - discountTotal).toFixed(2)}</p>
            </div>
            <button
              className="w-full bg-green-500 text-white p-2 rounded mt-4"
              onClick={openCheckout}
            >
              Checkout
            </button>
          </div>
        </aside>
      </main>

      {/* Modal */}
      {selectedItem && (
        <Modal open={isOpen} onClose={closeModal} center>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <h2 className="text-lg font-bold">{selectedItem.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Gross Wgt</label>
                <input
                  name="grossWeight"
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Net Wgt</label>
                <input
                  name="netWeight"
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Pcs</label>
                <input
                  name="pcs"
                  type="number"
                  defaultValue={1}
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Making in Rs.</label>
                <input
                  name="making"
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Disc %</label>
                <input
                  name="discountPercent"
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Dia (Wgt)</label>
                <input
                  name="diamondWeight"
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Diamond Value</label>
                <input
                  name="diamondValue"
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Stone Wgt</label>
                <input
                  name="stoneWeight"
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Stone Value</label>
                <input
                  name="stoneValue"
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>HUID</label>
                <input
                  name="huid"
                  type="text"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Hallmark</label>
                <input
                  name="hallmark"
                  type="text"
                  className="w-full p-2 rounded border"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded mt-4"
            >
              Add Product
            </button>
          </form>
        </Modal>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <Modal
          open={openCheckout}
          onClose={closeCheckout}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customcheck",
          }}
        >
          {modalStep === 1 && (
            <>
              <h2 className="text-lg font-bold">Customer Details</h2>
              <div className="flex flex-col justify-center items-center">
                <form
                  className="w-full space-y-4 p-4 bg-white shadow-md rounded-md"
                  onSubmit={handleNextStep}
                >
                  {/* Phone No Input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Type phone then press enter"
                      className="flex-1 border border-green-500 rounded-md p-4 text-sm focus:ring focus:ring-green-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="bg-green-500 p-2 rounded-full text-white shadow-md hover:bg-green-600"
                    >
                      <IoIosSearch />
                    </button>
                  </div>

                  {/* Customer Name */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customerDetails.name}
                      onChange={(e) =>
                        setCustomerDetails((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Customer Name"
                      className="flex-1 border border-green-500 rounded-md p-4 text-sm focus:ring focus:ring-green-300 focus:outline-none"
                    />

                    <input
                      type="text"
                      value={customerDetails.id}
                      onChange={(e) =>
                        setCustomerDetails((prev) => ({
                          ...prev,
                          id: e.target.value,
                        }))
                      }
                      placeholder="Customer Name"
                      className="flex-1 border border-green-500 rounded-md p-4 text-sm focus:ring focus:ring-green-300 focus:outline-none"
                    />
                  </div>

                  {/* Address */}
                  <textarea
                    value={customerDetails.address}
                    onChange={(e) =>
                      setCustomerDetails((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Address"
                    className="w-full border border-green-500 rounded-md p-2 text-sm focus:ring focus:ring-green-300 focus:outline-none"
                    rows="2"
                  ></textarea>

                  {/* GSTIN */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customerDetails.gstin}
                      onChange={(e) =>
                        setCustomerDetails((prev) => ({
                          ...prev,
                          gstin: e.target.value,
                        }))
                      }
                      placeholder="GSTIN"
                      className="flex-1 border border-green-500 rounded-md p-4 text-sm focus:ring focus:ring-green-300 focus:outline-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={closeCheckout}
                      className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          {modalStep === 2 && (
            <>
              <div className="p-4 bg-white rounded shadow">
                <h2 className="text-xl font-bold mb-4">Bill Amount</h2>
                <p className="text-green-500 text-2xl font-bold mb-4">₹{gto}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block font-bold">
                      Select Payment Method
                    </label>
                    <div className="flex space-x-2">
                      {["cash", "card", "upi", "adjust", "advance"].map(
                        (method) => (
                          <button
                            key={method}
                            className={`p-2 rounded ${
                              paymentMethod === method
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200"
                            }`}
                            onClick={() => handlePaymentMethodSelect(method)}
                          >
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Conditional Input Fields */}
                  {paymentMethod === "cash" && (
                    <div>
                      <label>Cash Amount</label>
                      <input
                        type="number"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(Number(e.target.value))}
                        className="w-full p-2 rounded border"
                      />
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div>
                      <label>Card Amount</label>
                      <input
                        type="number"
                        value={cardDetails.cardAmount}
                        onChange={(e) =>
                          setCardDetails((prev) => ({
                            ...prev,
                            cardAmount: Number(e.target.value),
                          }))
                        }
                        className="w-full p-2 rounded border"
                      />
                      <label>Card Service Charge</label>
                      <input
                        type="number"
                        value={cardDetails.serviceCharge}
                        onChange={(e) =>
                          setCardDetails((prev) => ({
                            ...prev,
                            serviceCharge: Number(e.target.value),
                          }))
                        }
                        className="w-full p-2 rounded border mt-2"
                      />
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div>
                      <label>UPI Amount</label>
                      <input
                        type="number"
                        value={upiAmount}
                        onChange={(e) => setUpiAmount(Number(e.target.value))}
                        className="w-full p-2 rounded border"
                      />
                    </div>
                  )}

                  {paymentMethod === "adjust" && (
                    <div>
                      <label>Old Material Amount Adjust</label>
                      <input
                        type="number"
                        value={adjustAmount}
                        onChange={(e) =>
                          setAdjustAmount(Number(e.target.value))
                        }
                        className="w-full p-2 rounded border"
                      />
                    </div>
                  )}

                  {paymentMethod === "advance" && (
                    <div>
                      <label>Advance</label>
                      <input
                        type="number"
                        value={advanceAmount}
                        onChange={(e) =>
                          setAdvanceAmount(Number(e.target.value))
                        }
                        className="w-full p-2 rounded border"
                      />
                    </div>
                  )}

                  <div>
                    <p className="text-red-500 font-bold">
                      Remaining Amount: ₹{remainingAmount}
                    </p>
                  </div>

                  <div className="flex space-x-4 mt-4">
                    <button className="w-1/2 bg-gray-500 text-white p-2 rounded">
                      Back
                    </button>
                    <button
                      className="w-1/2 bg-green-500 text-white p-2 rounded"
                      onClick={handleCheckoutSubmit}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
