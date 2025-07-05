"use client";
import React, { useState, useEffect } from "react";
import CustomerModal from "../customer/CustomerModal";
import { useMemo } from "react";

import Image from "next/image";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { LuRefreshCcw } from "react-icons/lu";
import { BsFillAwardFill } from "react-icons/bs";
import Customers from "../customer/index";
import { FaHome } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronRight } from "react-icons/bi";
import {
  displayCoin,
  getcompany,
  getBillno,
  getProductService,
  getemployees,
} from "@/app/components/config";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // Import Notyf CSS
import { IoIosSearch } from "react-icons/io";
import { VscReport } from "react-icons/vsc";
import { getphoneSearch, baseImageURL } from "@/app/components/config";
import Printbill from "./printbill";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

const notyf = new Notyf();

export function QuickCustomerRegister({ closeModal }) {
  return <></>;
}

export default function InvoicePage() {
  //ad customer data start

  const [isFormVisible, setFormVisible] = useState(false);

  const handleOpenModal = () => {
    setFormVisible(true); // Open modal
  };

  const handleCloseModal = () => {
    setFormVisible(false); // Close modal
  };

  // add customer data code end

  const [items, setItems] = useState([]);
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const [dateid, setDateid] = useState(today);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [billNo, setBillNo] = useState("");

  const [bill_inv, setbillinv] = useState("");
  const [salesman_id, setSalesmanId] = useState("");
  const [stylist_id, setStylistId] = useState("");

  const [addedProducts, setAddedProducts] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [coin, setItemscoin] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [redeemData, setRedeemData] = useState([]);
  const [company, setCompany] = useState([]);
  const [category, setCategory] = useState([]);
  const [making, setMaking] = useState(null);
  const [isDiscModalOpen, setDiscModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [hallmarksCharge, setHallMarksCharge] = useState(null);
  const [makingInRsCharge, setMakingInRsCharge] = useState(null);
  const [wastageCharges, setWastagesCharges] = useState(null);
  const [redeemPoint, setRedeemPoint] = useState(0);

  // const [dateid, setDateid] = useState("");
  const [grossTotal, setGrossTotal] = useState(null);
  const [discountTotal, setDiscountTotal] = useState(null);
  const [makingtotal, setMakingTotal] = useState(null);
  const [modalStep, setModalStep] = useState(1); // 1 for customer details, 2 for checkout
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loyaltyData, setLoyaltyData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Store selected category
  const [filteredItems, setFilteredItems] = useState(items); // Store filtered items
  const [finalGto, setFinalGto] = useState(null);

  const [reward, setReward] = useState(null);
  const [netWt, setNtWt] = useState(null);
  const [pcss, setPcs] = useState(null);

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    gstin: "",
  });
  const gto = grossTotal;
  console.log(gto);
  const [cashAmount, setCashAmount] = useState(null);
  //const [salesperson, setSalesperson] = useState([]);
  const [stylist, setStylist] = useState([]);
  const [total, setTotals] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    cardAmount: 0,
    serviceCharge: 0,
  });
  const [upiAmount, setUpiAmount] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(null);
  const [advanceAmount, setAdvanceAmount] = useState(null);
  const [couponNo, setCouponNo] = useState("");
  const [couponAmount, setCouponAmount] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [customerid, setCustomerId] = useState(false);
  const [productWiseTotals, setProductWiseTotals] = useState([]);

  const [remainingAmount, setRemainingAmount] = useState(gto);

  // if (remainingAmount <= 0) {
  //   alert("Payment complete! Remaining amount is ₹0.");
  // }

  // Dynamically calculate the total paid and remaining amount

  // Calculate "using loyalty points" only when gto or loyaltyData changes

  const usingLoyaltyPoints = useMemo(() => {
    if (!redeemData || redeemData.length === 0) return 0; // Prevent undefined error

    const availablePoints = redeemData[0]?.redeem_points || 0; // Ensure a safe fallback
    const calculatedPoints = (gto * loyaltyData.max_redeem) / 100;

    return calculatedPoints >= availablePoints
      ? availablePoints
      : calculatedPoints;
  }, [gto, loyaltyData, redeemData]);

  useEffect(() => {
    const totalPaid =
      cashAmount +
      cardDetails.cardAmount +
      cardDetails.serviceCharge +
      upiAmount +
      adjustAmount +
      advanceAmount;

    // Update remaining amount
    const newRemainingAmount = gto - totalPaid - usingLoyaltyPoints;

    setRemainingAmount(newRemainingAmount);
  }, [
    cashAmount,
    cardDetails.cardAmount,
    cardDetails.serviceCharge,
    upiAmount,
    adjustAmount,
    advanceAmount,
    gto,
  ]);
  // const remainingAmount =
  //   gto -
  //   (Number(cashAmount) +
  //     Number(cardDetails.cardAmount) +
  //     Number(cardDetails.serviceCharge) +
  //     Number(upiAmount) +
  //     Number(adjustAmount) +
  //     Number(advanceAmount));

  // Handle payment method selection

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);

    // We do not reset amounts completely; we only focus on the selected method
    switch (method) {
      case "cash":
        // Only change the active method
        setCashAmount((prev) => (prev === 0 ? gto : prev)); // Set to full amount if it's 0, else keep it
        break;
      case "card":
        // Only change the active method
        setCardDetails((prev) => ({
          ...prev,
          cardAmount: prev.cardAmount === 0 ? gto : prev.cardAmount,
        }));
        break;
      case "upi":
        // Only change the active method
        setUpiAmount((prev) => (prev === 0 ? gto : prev));
        break;
      case "adjust":
        // Only change the active method
        setAdjustAmount((prev) => (prev === 0 ? gto : prev));
        break;
      case "advance":
        // Only change the active method
        setAdvanceAmount((prev) => (prev === 0 ? gto : prev));
        break;
      default:
        // If no method selected, reset everything to 0
        setCashAmount(0);
        setCardDetails({ cardAmount: 0, serviceCharge: 0 });
        setUpiAmount(0);
        setAdjustAmount(0);
        setAdvanceAmount(0);
        break;
    }
  };

  // const handlePaymentMethodSelect = (method) => {
  //   setPaymentMethod(method);
  //   // Reset amounts for all other methods to 0
  //   setCashAmount(method === "cash" ? gto : 0);
  //   setCardDetails(
  //     method === "card"
  //       ? { cardAmount: gto, serviceCharge: 0 }
  //       : { cardAmount: 0, serviceCharge: 0 }
  //   );
  //   setUpiAmount(method === "upi" ? gto : 0);
  //   setAdjustAmount(method === "adjust" ? gto : 0);
  //   setAdvanceAmount(method === "advance" ? gto : 0);
  // };

  //selectcategory

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  const fetchCategory = async () => {
    const token = getCookie("access_token");
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }

    try {
      const response = await axios.get(" https://api.equi.co.in/api/type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // const fetchItemscompany = async () => {
  //   try {
  //     const response = await getcompany();
  //     setCompany(response.data);
  //   } catch (error) {
  //     console.error("Error fetching items:", error);
  //   }
  // };

  useEffect(() => {
    if (redeemData && redeemData.length > 0 && loyaltyData) {
      const updatedFinalGto = gto - (gto * loyaltyData.max_redeem) / 100;
      setFinalGto(updatedFinalGto);
    }
  }, [gto, loyaltyData, redeemData]);
  // Runs only when these dependencies change
  //loyalty point rewards setup and redeem setup

  useEffect(() => {
    axios
      .get(" https://api.equi.co.in/api/redeem-setup")
      .then((response) => {
        if (response.data.length > 0) {
          setLoyaltyData(response.data[0]); // Assuming you only need the first item
        } else {
          console.warn("No data received from API");
        }
      })
      .catch((error) => {
        alert("Error fetching data. Check console for details.");
        console.error("API Fetch Error:", error);
      });
  }, []);

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

  //get Redeem data

  useEffect(() => {
    if (customerDetails.id) {
      axios
        .get(
          ` https://api.equi.co.in/api/customer-redeem-point/${customerDetails.id}`
        )
        .then((response) => {
          if (response.data && Array.isArray(response.data)) {
            setRedeemData(response.data);
          } else {
            setRedeemData([]); // Set to empty array if no data
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [customerDetails.id]);

  //calculated Reward
  useEffect(() => {
    if (loyaltyData?.loyalty) {
      const calculatedReward =
        (grossTotal / loyaltyData.loyalty.loyalty_balance) *
        loyaltyData.loyalty.set_loyalty_points;
      setReward(calculatedReward);
    }
  }, [grossTotal, loyaltyData]);

  useEffect(() => {
    fetchItems();
    fetchItemsCoin();
    fetchNextBillNo();
    // fetchItemscompany();

    // fetchEmployees();
    fetchStylist();
  }, []);

  //set selected categoey
  useEffect(() => {
    if (selectedCategory) {
      const filtered = items.filter(
        (item) => item.company_id === selectedCategory
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [selectedCategory, items]);

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

  // const fetchEmployees = async () => {
  //   const res = await axios.get(" https://api.equi.co.in/api/employees");
  //   setSalesperson(res.data.employees);
  // };

  const fetchStylist = async () => {
    const res = await axios.get(" https://api.equi.co.in/api/stylists");
    setStylist(res.data);
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
      console.log(response.data);

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

    // ✅ Reset state variables
    setMaking(null);
    setTotals(null);
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
      tax_rate: selectedItem.tax_rate,
      hsn: selectedItem.hsn || "kamil",
      grossWeight: Number(formData.get("grossWeight")) || 0,
      netWeight: Number(formData.get("netWeight")) || 0,
      pcs: Number(formData.get("pcs")) || 1,
      // grm: formData.get("grm") ? Number(formData.get("grm")) : 0,
      //  grm: grm,
      // making: Number(formData.get("making")) || 0,
      making: making,
      discountPercent: Number(formData.get("discountPercent")) || 0,
      diamondWeight: Number(formData.get("diamondWeight")) || 0,
      diamondValue: Number(formData.get("diamondValue")) || 0,
      stoneWeight: Number(formData.get("stoneWeight")) || 0,
      stoneValue: Number(formData.get("stoneValue")) || 0,
      huid: formData.get("huid") || "",
      hallmark: formData.get("hallmark") || "",
      hallmarkCharge: formData.get("hallmarkCharge") || "",
      wastageCharge: formData.get("wastageCharge") || "",
      makingInRs: formData.get("makingInRs") || "",
      pro_total: 150,
    };

    setAddedProducts((prev) => [...prev, productDetails]);
    closeModal();
    calculateTotals([...addedProducts, productDetails]);

    event.target.reset();

    // ✅ Reset state variables
    setMaking(null);
    setTotals(null);
  };

  const calculateTotals = (products) => {
    let gross = 0;
    let discount = 0;
    let makingTotal = 0;
    const productWiseTotals = [];

    products.forEach((product) => {
      const goldValue = product.rate * product.netWeight;
      const makingChargePerGram = (product.rate * product.making) / 100; // Making charge per gram
      const totalMakingCharge = makingChargePerGram * product.netWeight;
      const hallmarkvalue = Number(product.hallmarkCharge) || 0;
      const wastageValue = Number(product.wastageCharge) || 0;
      const makingRsVAlue = Number(product.makingInRs) || 0;

      const RateTotal =
        (product.rate * product.netWeight + totalMakingCharge) * product.pcs +
        hallmarkvalue +
        wastageValue +
        makingRsVAlue;
      const productDiscount = product.discountPercent / 100;
      const AdjustedMaking = product.making - productDiscount;
      const StoneTotal = product.stoneWeight * product.stoneValue;
      const DiamondTotal = product.diamondWeight * product.diamondValue;

      const productTotal = RateTotal + StoneTotal + DiamondTotal;

      productWiseTotals.push({
        code: product.code,
        name: product.name,

        rateTotal: RateTotal.toFixed(2),
        adjustedMaking: AdjustedMaking.toFixed(2),
        diamondTotal: DiamondTotal.toFixed(2),
        stoneTotal: StoneTotal.toFixed(2),
        total: productTotal.toFixed(2),
      });

      gross += productTotal;
      discount += productDiscount;
      makingTotal += AdjustedMaking;
    });

    setGrossTotal(gross.toFixed(2));
    setDiscountTotal(discount.toFixed(2));
    setProductWiseTotals(productWiseTotals);
    setMakingTotal(makingTotal.toFixed(2));
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
      },
      upi: { upiAmount },
    };
    const paymentMethods = Object.keys(paymentDetails).map((method) => ({
      payment_method: method,
      price:
        paymentDetails[method].cashAmount ||
        paymentDetails[method].cardAmount ||
        paymentDetails[method].upiAmount ||
        0,
    }));
    console.log(paymentDetails);
    const paymentMethodDetails = paymentDetails[paymentMethod];

    if (!paymentMethodDetails) {
      notyf.error("Invalid payment method selected.");
      return;
    }
    const metalValue = addedProducts.reduce(
      (sum, _, i) => sum + (productWiseTotals[i]?.rateTotal || 0),
      0
    );
    const makingDsc = addedProducts.reduce(
      (sum, _, i) => sum + (productWiseTotals[i]?.adjustedMaking || 0),
      0
    );
    const TotalProductprice = addedProducts.reduce(
      (sum, _, i) => sum + (productWiseTotals[i]?.total || 0),
      0
    );
    const payload = {
      products: addedProducts.map((product, i) => ({
        name: product.name,
        code: product.code,
        tax_rate: product.tax_rate,
        hsn: product.hsn,
        grossWeight: product.grossWeight,
        netWeight: product.netWeight,
        making: product.making,
        rate: product.rate,
        stoneWeight: product.stoneWeight,
        stoneValue: product.stoneValue,
        huid: product.huid,
        hallmark: product.hallmark,
        hallmarkCharge: product.hallmarkCharge,
        wastageCharge: product.wastageCharge,
        makingInRs: product.makingInRs,
        metal_value: metalValue,
        making_dsc: makingDsc,
        // grm: product.grm,
        pro_total: productWiseTotals[i]?.total || 0,
      })),
      grossTotal,
      discountTotal,
      paymentMethods,
      dateid,
      bill_inv,
      salesman_id: null, // If undefined or null, set to null
      stylist_id: stylist_id ?? null, // If undefined or null, set to null

      customer_id: customerDetails.id,
      price: paymentMethods.reduce(
        (total, payment) => total + payment.price,
        0
      ), // Total payment price
    };
    console.log(payload);
    try {
      const response = await axios.post(
        " https://api.equi.co.in/api/order",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      notyf.success(`Order placed successfully!`);

      // Store redeem points only if reward is greater than 0
      if (reward > 0) {
        await storeRedeemPoints(customerDetails.id, reward, token);
      }

      fetchItemsCoin();

      // Reset state
      setAddedProducts([]);
      setGrossTotal(0);
      setDiscountTotal(0);
      closeCheckout();
      updateRedeemPoint(customerDetails.id, usingLoyaltyPoints, token);
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
    const printUrl = ` /jwellery/printinvoice?id=${orderId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };
  //update redeem point

  const updateRedeemPoint = async (customerId, points, token) => {
    if (!customerId) {
      console.error("Customer ID is required.");
      notyf.error("Customer ID is missing.");
      return;
    }

    if (points <= 0) {
      console.warn("No redeem points to add.");
      return; // Skip API call if points are zero or negative
    }

    try {
      const response = await axios.put(
        ` https://api.equi.co.in/api/customer-redeem-point/${customerId}`,
        { customer_id: customerId, redeem_points: points } // Ensure both values are sent
      );
    } catch (error) {
      console.error("Failed to store redeem points:", error);
      notyf.error("Failed to update reward points.");
    }
  };
  //store redeem point function

  const storeRedeemPoints = async (customerId, points, token) => {
    if (!customerId) {
      console.error("Customer ID is required.");
      notyf.error("Customer ID is missing.");
      return;
    }

    if (points <= 0) {
      console.warn("No reward points to add.");
      return; // Skip API call if points are zero or negative
    }

    try {
      const response = await axios.post(
        ` https://api.equi.co.in/api/customer-redeem-point/${customerId}`,
        { customer_id: customerId, redeem_points: points } // Ensure both values are sent
      );
    } catch (error) {
      console.error("Failed to store redeem points:", error);
      notyf.error("Failed to update reward points.");
    }
  };

  //calculated total
  const updateTotal = (
    makingPercentage,
    netWt,
    pcs,
    makingInRs,
    hallmarkCharge,
    wastageCharge
  ) => {
    const goldRate = selectedItem.rate; // Gold rate per gram
    const goldValue = netWt * goldRate; // Total gold price

    const makingChargePerGram = (goldRate * makingPercentage) / 100; // Making charge per gram
    const totalMakingCharge = makingChargePerGram * netWt; // Total making charge for total net weight

    const totalPrice =
      (goldValue + totalMakingCharge) * pcs +
      makingInRs +
      hallmarkCharge +
      wastageCharge; // Multiply by number of pieces

    setTotals(totalPrice);

    setGrossTotal(totalPrice);
  };

  return (
    <div className="flex flex-col h-full absolute top-0 overflow-auto  right-0 bottom-0 left-0 bg-white">
      <div className="bg-green-700 text-center p-3 text-white">
        Invoice
        {/* <button className="text-white text-lg">
          <span>&larr;</span>
        </button> */}
        {/* <span className="text-lg font-semibold">Invoice</span> */}
      </div>
      <div className="bg-white-700 text-white p-2 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <button className="text-white text-lg">
            <span>&larr;</span>
          </button>
          {/* <span className="text-lg font-semibold">Invoice</span> */}
        </div>

        {/* Middle Section */}
        <div className="bg-white p-3 shadow flex space-x-4 items-center text-black rounded-md">
          <Link
            href="/home"
            className="flex flex-col items-center text-blue-600"
          >
            <FaHome size={20} />
            <span className="text-xs">Home</span>
          </Link>
          <button className="flex flex-col items-center text-blue-600">
            <LuRefreshCcw size={20} />
            <span className="text-xs">Refresh</span>
          </button>
          <Link
            href="/jewellery/partialorder"
            className="flex flex-col items-center text-blue-600"
          >
            <VscReport size={20} />
            <span className="text-xs">Report</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <div className="text-white text-sm">
            {/* <div>
              Line: <span className="font-semibold">0</span>
            </div> */}
            {/* <div>
              Pcs: <span className="font-semibold">0</span>
            </div> */}
          </div>
          <button
            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => setDiscModalOpen(true)}
          >
            % Disc
          </button>
          <button className="bg-orange-500 text-white px-4 py-1 rounded flex items-center space-x-1">
            <span>Checkout</span>
            <BiChevronRight size={20} />
            <span>&#8377;0</span>
          </button>
          <button
            className="text-white"
            onClick={() => setConfirmModalOpen(true)}
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Discount Modal */}
        {isDiscModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={() => setDiscModalOpen(false)}
          >
            <div
              className="bg-white p-4 rounded shadow-lg w-96 text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="bg-green-600 text-white p-2 text-center">
                Additional Disc / Addon
              </h2>
              <div className="p-4">
                <label>Disc%</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded mb-2"
                  defaultValue="0"
                />
                <label>Disc (Rs)</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded mb-2"
                  defaultValue="0"
                />
                <label>Addition (Rs)</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded mb-2"
                  defaultValue="0"
                />
                <label>Addition Detail</label>
                <textarea className="w-full border p-2 rounded mb-4"></textarea>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded w-full"
                  onClick={() => setDiscModalOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {isConfirmModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={() => setConfirmModalOpen(false)}
          >
            <div
              className="bg-white p-4 rounded shadow-lg w-80 text-center text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setConfirmModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="flex flex-1">
        <div className="">
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 border rounded">
            {/* <select
              name="salesman_id"
              className="border rounded px-4 py-2"
              onChange={(e) => setSalesmanId(e.target.value)}
            >
              <option>Select salesman</option>
              {salesperson.map((sales) => (
                <option key={sales.id} value={sales.id}>
                  {sales.name}
                </option>
              ))} 
               <option value="0">INVOICE</option>
            </select> */}

            <select
              name="bill_inv"
              className="border rounded px-4 py-2"
              onChange={(e) => setbillinv(e.target.value)}
            >
              <option value="0"> TAX INVOICE</option>
              <option value="1">wallet invoice</option>
            </select>

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
                min={today} // Prevents selection of past dates
                onChange={(e) => {
                  console.log("Date Change:", e.target.value);
                  setDateid(e.target.value);
                }}
              />
            </div>

            {/* //stylist deopdwon */}
            <select
              name="stylist_id"
              id="stylist_id"
              className="border border-orange-500 bg-gray-100 text-gray-800 rounded-lg px-4 py-2 w-full  max-w-[200px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={(e) => setStylistId(e.target.value)}
            >
              <option value="" className="text-gray-500">
                Select Stylist
              </option>
              {stylist.map((stlst) => (
                <option key={stlst.id} value={stlst.id}>
                  {stlst.name}
                </option>
              ))}
            </select>

            {/* Category Dropdown */}

            <select
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-orange-500 bg-gray-100 text-gray-800 rounded-lg px-4 py-2 w-full max-w-[200px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="" className="text-gray-500">
                Select Category
              </option>
              {category.map((categry) => (
                <option key={categry.id} value={categry.id}>
                  {categry.name}
                </option>
              ))}
            </select>

            {/* <select
              name="caregory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option>Select Category</option>
              {company.map((categry) => (
                <option key={categry.id} value={categry.id}>
                  {categry.name}
                </option>
              ))}
            </select> */}

            {/* Search Item */}
            <div>
              <label className="font-medium">Search Item</label>
              <input
                type="text"
                placeholder="Search Item"
                className="border rounded px-4 py-2 ml-2"
              />
            </div>
            <div className="flex gap-4">
  {/* Product Checkbox - Orange */}
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
    />
    <span className="text-orange-600 font-medium">Product</span>
  </label>

  {/* Membership Checkbox - Blue */}
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-blue-600 font-medium">Membership</span>
  </label>

  {/* Package Checkbox - Green */}
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
    />
    <span className="text-green-600 font-medium">Package</span>
  </label>
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
              <span className="text-blue-950 text-lg font-bold">
                {" "}
                Total Coin
              </span>
              :{" "}
              <span className="text-orange-900 text-lg font-bold">{coin}</span>
            </span>
          </div>

          {/* //fetch product and  */}
          <div className="flex-1 grid grid-cols-7 gap-4 p-4 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.code}
                  className="border-blue-500 border h-[200px] rounded-lg p-4 flex flex-col items-center text-center cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  <p className="mt-2 text-sm font-bold">
                    {item.name || "No Type"}
                  </p>

                  <div className="w-full h-32 flex items-center justify-center text-gray-500">
                    {item.image ? (
                      <img
                        src={`${baseImageURL}/storage/${item.image}`}
                        alt={item.code}
                        width={100}
                        height={100}
                      />
                    ) : (
                      "No Image"
                    )}
                  </div>
                  <p className="text-gray-600">₹{item.rate || 0}</p>
                  <p className="text-gray-600">₹{item.tax_rate || 0}</p>
                </div>
              ))
            ) : (
              <p>No products found for this category</p>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-1/4 bg-gray-100 p-4 relative h-full">
          <div className="mb-16 overflow-y-auto h-[20rem]">
            {addedProducts.map((product, index) => (
              <div key={index} className="border p-2 rounded mb-2">
                <p className="font-bold">{product.name}</p>
                {/*<p>Code: {product.code}</p>*/}
                {/*<p className="text-sm">Gross Wgt: {product.grossWeight}</p>*/}
                <p className="text-[12px]">
                  Net Wgt: {product.netWeight} || Rate Total: ₹
                  {productWiseTotals[index]?.rateTotal}
                </p>
                {/*<p className="text-[12px]"></p>*/}
                <p className="text-[12px]">
                  Making :{/* (after Discount): ₹ */}
                  {productWiseTotals[index]?.adjustedMaking}%
                </p>
                <p className="text-[12px]">
                  Grm:
                  {product.netWeight}
                </p>
                <p className="text-[12px]">
                  Diamond Total: ₹{productWiseTotals[index]?.diamondTotal} ||
                  Stone Total: ₹{productWiseTotals[index]?.stoneTotal}
                </p>
                <p className="text-[12px]"></p>
                <p className="text-[12px]">
                  <strong>Total: ₹{productWiseTotals[index]?.total}</strong>
                </p>
              </div>
            ))}
            <div className="h-[16rem]"></div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-100">
            <div className="flex justify-between">
              <p>Gross Total:</p>
              <p>₹{grossTotal}</p>
            </div>

            {grossTotal >=
            loyaltyData?.loyalty?.min_invoice_bill_to_get_point ? (
              <div className="flex justify-between">
                <p className="text-green-400">Point Rewarded:</p>
                <BsFillAwardFill />
                <p className="text-green-400">{reward}</p>
              </div>
            ) : null}

            <div className="flex justify-between">
              <p>Discount:</p>
              <p>₹{discountTotal}</p>
            </div>
            <div className="flex justify-between font-bold">
              <p>Net Total:</p>
              <p>₹{grossTotal - discountTotal}</p>
            </div>
            {/*<div className="flex justify-between font-bold">*/}
            {/*    <p>Net Total:</p>*/}
            {/*    <p>₹{makingtotal}</p>*/}
            {/*</div>*/}
            <button
              className="w-full bg-green-500 text-white p-4 rounded mt-4 text-xl font-semibold"
              onClick={openCheckout}
            >
              Checkout
            </button>
          </div>
        </aside>
      </main>

      {/* Modal */}
      {selectedItem && (
        <Modal open={isOpen} onClose={() => closeModal()} center>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <h2 className="text-lg font-bold">{selectedItem.code}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Gross Wgt(grm)</label>
                <input
                  name="grossWeight"
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Net Wgt(grm)</label>
                <input
                  name="netWeight"
                  type="number"
                  className="w-full p-2 rounded border"
                  onChange={(e) => {
                    const newNetWeight = Number(e.target.value) || 0;
                    setNtWt(newNetWeight);
                    updateTotal(
                      making,
                      newNetWeight,
                      pcss,
                      makingInRsCharge,
                      hallmarksCharge,
                      wastageCharges
                    );
                  }}
                />
              </div>
              <div>
                <label>Rate</label>
                <input
                  name="rate"
                  value={selectedItem.rate}
                  type="number"
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Pcs</label>
                <input
                  name="pcs"
                  type="number"
                  defaultValue={0}
                  className="w-full p-2 rounded border"
                  onChange={(e) => {
                    const newPcs = Number(e.target.value) || 0;
                    setPcs(newPcs);
                    updateTotal(
                      making,
                      netWt,
                      newPcs,
                      makingInRsCharge,
                      hallmarksCharge,
                      wastageCharges
                    );
                  }}
                />
              </div>
              {/* <div>
                <label>GRM</label>
                <input
                  name="grm"
                  value={grm}
                  type="number"
                  onChange={(e) => {
                    const newGrm = Number(e.target.value) || 0;
                    setGrm(newGrm);
                    updateTotal(newGrm, making,netWt,pcss);
                  }}
                  // defaultValue={}
                  className="w-full p-2 rounded border"
                />
              </div> */}

              {/* <div className="flex items-center gap-2">
                <label className="w-32 font-bold">Total:</label>
                <input
                  name="total"
                  type="number"
                  value={total}
                  readOnly
                  className="border rounded p-2 w-full bg-gray-100 font-bold"
                />
              </div> */}
              <div>
                <label>Making in (%).</label>
                <input
                  name="making"
                  type="number"
                  value={making}
                  className="w-full p-2 rounded border"
                  onChange={(e) => {
                    const newMaking = Number(e.target.value);
                    setMaking(newMaking);
                    updateTotal(
                      newMaking,
                      netWt,
                      pcss,
                      makingInRsCharge,
                      hallmarksCharge,
                      wastageCharges
                    );
                  }}
                />
                {/* <span>making : {makingtotal}</span> */}
              </div>
              <div>
                <label>making in (Rs)-- per grm</label>
                <input
                  name="makingInRs"
                  type="number"
                  // value={makingInRs}
                  onChange={(e) => {
                    const newmakingInRs = Number(e.target.value) * netWt;
                    setMakingInRsCharge(newmakingInRs);
                    // setM;
                    updateTotal(
                      making,
                      netWt,
                      pcss,
                      newmakingInRs,
                      hallmarksCharge,
                      wastageCharges
                    );
                  }}
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
                <label>Diamond (Wgt)</label>
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
              <div>
                <label>Hallmark charge</label>
                <input
                  name="hallmarkCharge"
                  type="number"
                  onChange={(e) => {
                    const newhallmarkCharge = Number(e.target.value);
                    setHallMarksCharge(newhallmarkCharge);
                    updateTotal(
                      making,
                      netWt,
                      pcss,
                      makingInRsCharge,
                      newhallmarkCharge,
                      wastageCharges
                    );
                  }}
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>wastage charge</label>
                <input
                  name="wastageCharge"
                  type="number"
                  onChange={(e) => {
                    const newWastageCharge = Number(e.target.value);
                    setWastagesCharges(newWastageCharge);
                    updateTotal(
                      making,
                      netWt,
                      pcss,
                      makingInRsCharge,
                      hallmarksCharge,
                      newWastageCharge
                    );
                  }}
                  className="w-full p-2 rounded border"
                />
              </div>

              <div>
                <label>Other Charge</label>
                <input
                  name="wastageCharge"
                  type="number"
                  onChange={(e) => {
                    const newWastageCharge = Number(e.target.value);
                    setWastagesCharges(newWastageCharge);
                    updateTotal(
                      making,
                      netWt,
                      pcss,
                      makingInRsCharge,
                      hallmarksCharge,
                      newWastageCharge
                    );
                  }}
                  className="w-full p-2 rounded border"
                />
              </div>

              {/* <div className="flex items-center gap-2">
          <label className="w-32 font-bold">Total:</label>
          <input
          name="total"
            type="number"
            value={total}
           
            readOnly
            className="border rounded p-2 w-full bg-gray-100 font-bold"
          />
        </div> */}
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

                    {/* //customer register model */}
                    <button
                      type="button"
                      onClick={handleOpenModal}
                      className="bg-green-500 p-2 rounded-full text-white shadow-md hover:bg-green-600"
                    >
                      <FaPlus />
                    </button>
                    {/* Conditionally Render the QuickCustomerRegister Component */}
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
                <div className="bg-white shadow-md rounded-lg p-6">
                  {/* Available Loyalty Points */}
                  <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h1 className="text-lg font-semibold text-gray-700">
                      Available Loyalty Points:
                    </h1>
                    <p className="text-xl font-bold text-blue-600">
                      {redeemData && redeemData.length > 0
                        ? redeemData[0].redeem_points
                        : "Loading..."}
                    </p>
                  </div>

                  {/* Loyalty Discount Section */}
                  {gto >= loyaltyData.min_invcValue_needed_toStartRedemp ? (
                    <div className="flex justify-between items-center border-b pb-3 mb-3">
                      <h1 className="text-lg font-semibold text-gray-700">
                        Loyalty Discount Applied:
                      </h1>
                      <p className="text-xl font-bold text-green-600">
                        ₹{usingLoyaltyPoints}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-500 text-sm font-medium bg-red-100 p-2 rounded-md text-center">
                      Spend ₹
                      {loyaltyData.min_invcValue_needed_toStartRedemp - gto}{" "}
                      more to start redeeming points!
                    </p>
                  )}

                  {/* Final Payable Amount */}
                  <div className="flex justify-between items-center mt-4">
                    <h1 className="text-lg font-semibold text-gray-700">
                      Final Payable Amount:
                    </h1>
                    <p className="text-xl font-bold text-gray-900">
                      {redeemData && redeemData.length > 0
                        ? finalGto
                        : "Loading..."}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-bold">
                      Select Payment Method
                    </label>
                    <div className="flex space-x-2">
                      {["cash", "card", "upi"].map((method) => (
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
                      ))}
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

                  {/* {paymentMethod === "adjust" && (
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
                  )} */}

                  {/* {paymentMethod === "advance" && (
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
                  )} */}

                  <div>
                    <p className="text-red-500 font-bold">
                      Remaining Amount: ₹{remainingAmount}
                    </p>
                  </div>
                  {/* Total Payment Breakdown */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold">Payment Breakdown</h3>
                    <p>Cash: ₹{cashAmount}</p>
                    <p>
                      Card: ₹
                      {cardDetails.cardAmount + cardDetails.serviceCharge}
                    </p>
                    <p>UPI: ₹{upiAmount}</p>
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

      <CustomerModal
        isModalOpen={isFormVisible}
        closeModal={handleCloseModal}
        modalType="create"
      />
    </div>
  );
}
