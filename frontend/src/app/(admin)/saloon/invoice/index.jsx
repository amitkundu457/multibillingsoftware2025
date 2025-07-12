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

import { FaCheckSquare } from "react-icons/fa";
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
import toast from "react-hot-toast";
import { CiSquareCheck } from "react-icons/ci";

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
  const [membDiscount, setMembDiscount] = useState("");

  const [billNo, setBillNo] = useState("");

  const [bill_inv, setbillinv] = useState("");
  const [salesman_id, setSalesmanId] = useState("");
  const [stylist_id, setStylistId] = useState("");
  const [printStatus_id, setPrintStatus_id] = useState("");
  const [printStatus, setPrintStatus] = useState([]);
  const [rate, setRate] = useState(0);

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
  const [allProducts, setAllProducts] = useState([]);
  // const [dateid, setDateid] = useState("");
  const [grossTotal, setGrossTotal] = useState(null);
  const [totaltax, setTotalTax] = useState(null);
  const [discountTotal, setDiscountTotal] = useState(null);
  const [makingtotal, setMakingTotal] = useState(null);
  const [modalStep, setModalStep] = useState(1); // 1 for customer details, 2 for checkout
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loyaltyData, setLoyaltyData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Store selected category
  const [filteredItems, setFilteredItems] = useState(items); // Store filtered items
  const [finalGto, setFinalGto] = useState(null);
  const [disTotalMamerAmount, setDisTotalMamerAmount] = useState(0);
  const [dataFilter, setData] = useState([]);
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [reward, setReward] = useState(null);
  const [netWt, setNtWt] = useState(null);
  const [pcss, setPcs] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [gtoAfterMemshipDisc, setGtoAfterMemshipDisc] = useState(null);
  const [filterType, setFilterType] = useState("All"); // All | Product | Service

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    gstin: "",
  });

  // const gto = grossTotal-disTotalMamerAmount;
  let gto = Number(grossTotal) + Number(totaltax);
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
  const [checked, setChecked] = useState(false);
  const [pakageChecked, setPakageChecked] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [pakageList, setPakageList] = useState([]);

  const [remainingAmount, setRemainingAmount] = useState(gto);
  const [memershipDiscunt, setMemberShipDiscount] = useState(null);

  console.log("overallDiscount", overallDiscount);
  const overallDiscountAmount = (gto * overallDiscount) / 100;
  console.log("overallDiscountAmount", overallDiscountAmount);
  gto = gto - overallDiscountAmount;
  console.log("gto after overall discount", gto);

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

  //filter data of product and service
  const fetchData = async (type) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      // setLoading(true);

      // let url = `http://127.0.0.1:8000/api/product-service-saloon`;
      let url = `http://127.0.0.1:8000/api/product-service-saloon`;

      if (type !== "All") {
        url += `?pro_ser_type=${type}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
      console.log("prodcut and serveice", response);
      // setData(response.data);
    } catch (error) {
      console.error("Error fetching product/service data:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filterType);
  }, [filterType]);

  useEffect(() => {
    const totalPaid =
      cashAmount +
      cardDetails.cardAmount +
      cardDetails.serviceCharge +
      upiAmount +
      adjustAmount +
      advanceAmount;

    let isMembershipValid = false;

    if (memberships.length > 0) {
      const today = new Date();

      for (const membership of memberships) {
        const saleDate = new Date(membership?.sale_date);
        const expiryDate = new Date(saleDate);
        expiryDate.setDate(
          saleDate.getDate() + (membership?.plan?.validity || 0)
        );

        if (expiryDate >= today) {
          isMembershipValid = true;
          break; // Stop at first valid membership
        }
      }
    }

    // Determine the correct GTO value based on membership validity
    const effectiveGto = isMembershipValid ? gtoAfterMemshipDisc : gto;

    // Update remaining amount
    // const newRemainingAmount = effectiveGto - totalPaid - usingLoyaltyPoints;

    // const newRemainingAmount = effectiveGto - totalPaid-disTotalMamerAmount;
    const newRemainingAmount = effectiveGto - totalPaid;
    setRemainingAmount(newRemainingAmount);
  }, [
    cashAmount,
    cardDetails.cardAmount,
    cardDetails.serviceCharge,
    upiAmount,
    adjustAmount,
    advanceAmount,
    gto,
    gtoAfterMemshipDisc,
    memberships,
    memershipDiscunt,
    // disTotalMamerAmount
    // usingLoyaltyPoints,
  ]);

  const fetchMemberShipSaleById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        ` http://127.0.0.1:8000/api/memberships/${id}`
      );

      console.log("memership  Response:", response.data);
      console.log("memer");
      // setMemberShipDiscount()
      memeberShipDiscountfunction(Number(response?.data[0].plan?.discount));
      setMemberships(response.data || []); // Ensure state is updated correctly
    } catch (error) {
      console.error("Error fetching membership sale:", error);
      setMemberships([]); // Prevent undefined state
    } finally {
      setLoading(false);
    }
  };

  //
  const fetchPackageById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/packagesassign/${id}`
      );

      console.log("fetchPackageById:", response.data);

      // setMemberShipDiscount()
      // memeberShipDiscountfunction(Number(response?.data[0].plan?.discount));
      setPakageList(response?.data?.data || []); // Ensure state is updated correctly
    } catch (error) {
      console.error("Error fetching membership sale:", error);
      setPakageList([]); // Prevent undefined state
    } finally {
      setLoading(false);
    }
  };

  //functio for discoutn memer
  function memeberShipDiscountfunction(num) {
    const discount = (Number(gto) * num) / 100;
    setDisTotalMamerAmount(discount);
    console.log(disTotalMamerAmount);
  }
  // Checkbox change handler
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    console.log("check and on checked ");
    if (isChecked) {
      fetchMemberShipSaleById(customerDetails.id); // Pass the correct ID here
    } else {
      setMemberships([]); // Reset memberships list
    }
  };

  //pakage function check box
  // handleCheckboxChangePakage

  const handleCheckboxChangePakage = (e) => {
    const isChecked = e.target.checked;
    setPakageChecked(isChecked);
    console.log("check and on checked ", isChecked);
    if (isChecked) {
      fetchPackageById(customerDetails.id); // Pass the correct ID here
    } else {
      // setMemberships([]); // Reset memberships list
    }
  };

  useEffect(() => {
    if (memberships.length > 0) {
      console.log("memberships list", memberships);

      // Loop through each membership
      for (const membership of memberships) {
        const saleDate = new Date(membership.sale_date);
        const expiryDate = new Date(saleDate);
        expiryDate.setDate(
          saleDate.getDate() + (membership.plan?.validity || 0)
        );

        const today = new Date();
        const daysLeft = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysLeft > 0) {
          console.log("Valid membership found with days left:", daysLeft);
          setMembDiscount(membership.plan?.discount || 0);
          return; // Stop after the first valid membership
        }
      }

      // If no valid memberships found
      console.log("No valid memberships found");
      setMembDiscount(0);
    }
  }, [memberships]);

  useEffect(() => {
    if (memberships.length > 0 && membDiscount) {
      console.log("membDiscount", membDiscount);
      setGtoAfterMemshipDisc(gto - (gto * membDiscount) / 100);
      console.log(
        "gto - (gto * membDiscount) / 100",
        gto - (gto * membDiscount) / 100
      );
    }
  }, [memberships, membDiscount]);

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
      const response = await axios.get(" http://127.0.0.1:8000/api/type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
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

  //get Redeem data

  useEffect(() => {
    if (customerDetails.id) {
      axios
        .get(
          ` http://127.0.0.1:8000/api/customer-redeem-point/${customerDetails.id}`
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

  const fetchBarCodeData = async () => {
    try {
      const token = getCookie("access_token");
      const response = await axios.get("http://127.0.0.1:8000/api/barcodes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllProducts(response.data);
      return response.data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching barcode data:", error);
    }
  };



  useEffect(() => {
    fetchItems();
    fetchItemsCoin();
    fetchNextBillNo();
    // fetchItemscompany();
    fetchBarCodeData();
    // fetchEmployees();
    fetchStylist();
    fetchPrintStatus();
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
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      // const response = await getProductService();
      const response = await axios.get(
        "http://127.0.0.1:8000/api/product-and-service",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("invoice product list", response);
      // setItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const fetchEmployees = async () => {
  //   const res = await axios.get(" http://127.0.0.1:8000/api/employees");
  //   setSalesperson(res.data.employees);
  // };

  const fetchStylist = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    const res = await axios.get(" http://127.0.0.1:8000/api/stylists", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStylist(res.data);
  };

  const fetchPrintStatus = async () => {
    const res = await axios.get(" http://127.0.0.1:8000/api/print-status");
    console.log("API Response:", res.data); // Debugging
    setPrintStatus(Array.isArray(res.data) ? res.data : []); // Ensure it's an array

    //setPrintStatus(res.data);
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
    const matchingProduct=items.find((p)=>p.id==item.id)
    console.log("matching   prodcuts",matchingProduct);
    if(matchingProduct?.current_stock>0){
      setSelectedItem(item);
      setIsOpen(true);
    }
    else{
      toast.error("Out Of Stock This Products")

    }
   
    console.log("items", item);
    
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
    console.log("fromate data handele submit", formData);
    const productDetails = {
      code: selectedItem.code,
      type: selectedItem.type,
      name: selectedItem.name,
      rate: selectedItem.rate || 0,
      tax_rate: selectedItem.tax_rate,
      hsn: selectedItem.hsn || "",
      pcss: Number(formData.get("pcss")) || 1,
      product_id:selectedItem.id,

      
      discountPercent: Number(formData.get("discountPercent")) || 0,
      pro_total: 150,
    };
    setPcs(null);
    console.log("productdetails", productDetails);

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
    let totalTax = 0;
    const productWiseTotals = [];
    console.log("products for calculation", products);
    products.forEach((product) => {
      console.log("product fro barcode", product);
      const RateTotal = product.rate * product.pcss;

      const productTotal = RateTotal;
      const taxAmount = (product.tax_rate / 100) * productTotal;
      totalTax += taxAmount;
      console.log("taxAmount", taxAmount);

      productWiseTotals.push({
        code: product.code,
        name: product.name,

        rateTotal: RateTotal.toFixed(2),
        total: productTotal.toFixed(2),
      });

      gross += productTotal;
    });

    setGrossTotal(gross.toFixed(2));
    setTotalTax(totalTax.toFixed(2));
    setDiscountTotal(discount.toFixed(2));
    setProductWiseTotals(productWiseTotals);
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
    console.log("addedProducts", addedProducts);
    if (!customerDetails?.id) {
      notyf.error(
        "Please ensure customer details are complete before proceeding."
      );
      return;
    }

    if (addedProducts.length === 0) {
      toast.error("No products added to the order.");

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
        product_id:product.product_id,
        rate: product.rate,
        // qty: pcss,
        qty: product.pcss,
        pro_total: productWiseTotals[i]?.total || 0,
      })),
      grossTotal,
      // discountTotal,
      paymentMethods,
      dateid,
      bill_inv: 1,
      salesman_id: null, // If undefined or null, set to null
      membDiscount: membDiscount,
      // usingLoyaltyPoints,
      discountTotal: overallDiscount,

      stylist_id: stylist_id ?? null, // If undefined or null, set to null
      printStatus_id: printStatus_id ?? null,

      stylist_id: 1, // If undefined or null, set to null
      totalDiscount: Math.round(overallDiscountAmount),
      customer_id: customerDetails.id,
      totaltax: totaltax,
      // Total payment price
    };
    console.log(payload);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/saloon-order", // Removed the space
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Store redeem points only if reward is greater than 0
      // if (reward > 0) {
      //   await storeRedeemPoints(customerDetails.id, reward, token);
      // }

      fetchItemsCoin();

      // Reset state
      setAddedProducts([]);
      setGrossTotal(0);
      setDiscountTotal(0);
      setOverallDiscount(0);
      setTotalTax(0);
      closeCheckout();
      // updateRedeemPoint(customerDetails.id, usingLoyaltyPoints, token);
      // Show confirmation dialog for printing the bill
      // const printConfirmation = window.confirm("Do you want to print the bill?");
      const printConfirmation = window.confirm(
        "Do you want to print the bill?"
      );
      if (printConfirmation) {
        Printbill(response.data.order_id, response.data.bill_inv); // Call the direct print function
      }
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
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
    const printUrl = ` /saloon/printinvoice?id=${orderId}`;

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
        ` http://127.0.0.1:8000/api/customer-redeem-point/${customerId}`,
        { customer_id: customerId, redeem_points: points } // Ensure both values are sent
      );
    } catch (error) {
      console.error("Failed to store redeem points:", error);
      notyf.error("Failed to update reward points.");
    }
  };
  //store redeem point function

  // const storeRedeemPoints = async (customerId, points, token) => {
  //   if (!customerId) {
  //     console.error("Customer ID is required.");
  //     notyf.error("Customer ID is missing.");
  //     return;
  //   }

  //   if (points <= 0) {
  //     console.warn("No reward points to add.");
  //     return; // Skip API call if points are zero or negative
  //   }

  //   try {
  //     const response = await axios.post(
  //       ` http://127.0.0.1:8000/api/customer-redeem-point/${customerId}`,
  //       { customer_id: customerId, redeem_points: points } // Ensure both values are sent
  //     );
  //   } catch (error) {
  //     console.error("Failed to store redeem points:", error);
  //     notyf.error("Failed to update reward points.");
  //   }
  // };

  //calculated total
  const updateTotal = (rate, pcss) => {
    const totalPrice = rate * pcss;

    setTotals(totalPrice);

    setGrossTotal(totalPrice);
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
     

      if (foundItem) {
        console.log(foundItem.basic_rate);
        // setSelectedItem(foundItem);
        setPcs(Number(foundItem.pcs) || 1);
        
        setIsOpen(true); // <-- open modal with new data
      } else {
        alert("Product with this barcode not found");
      }
      setBarcode("");

    } catch (error) {
      console.error("Error searching barcode:", error);
    }
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
            href="/dashboard"
            className="flex flex-col items-center text-blue-600"
          >
            <FaHome size={20} />
            <span className="text-xs">Home</span>
          </Link>
          <button className="flex flex-col items-center text-blue-600">
            <LuRefreshCcw shCcw size={20} />
            <span className="text-xs">Refresh</span>
          </button>
          <Link
            href="/saloon/package/PackageUsageForm"
            className="flex flex-col items-center text-blue-600"
          >
            <FaCheckSquare size={20} />
            <span className="text-xs">Package</span>
          </Link>

          {/* <Link
            //  href="/saloon/partialorder"
            className="flex flex-col items-center text-blue-600"
          >
            <VscReport size={20} />
            <span className="text-xs">Report</span>
          </Link> */}
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
          {/* <button className="bg-orange-500 text-white px-4 py-1 rounded flex items-center space-x-1">
            <span>Checkout</span>
            <BiChevronRight size={20} />
            <span>&#8377;0</span>
          </button> */}
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
                Overall Discount
              </h2>
              <div className="p-4">
                <label>Disc%</label>
                <input
                  type="text"
                  value={overallDiscount}
                  onChange={(e) => setOverallDiscount(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  defaultValue="0"
                />
                {/* <label>Disc (Rs)</label>
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
                <textarea className="w-full border p-2 rounded mb-4"></textarea> */}
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

            {/* print frrmat */}

            <select
              name="prstatus_id"
              id="status_id"
              className="border border-orange-500 bg-gray-100 text-gray-800 rounded-lg px-4 py-2 w-full  max-w-[200px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={(e) => setPrintStatus_id(e.target.value)}
            >
              <option value="" className="text-gray-500">
                Select Billig format
              </option>
              {Array.isArray(printStatus) &&
                printStatus.map((stlst) => (
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
              className="border px-10 border-orange-500 bg-gray-100 text-gray-800 rounded-lg  py-2 w-full max-w-[200px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
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

            {/* filter of data and product */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-orange-500 bg-gray-100 text-gray-800 rounded-lg px-4 py-2 w-full max-w-[200px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Product">Product</option>
                <option value="Service">Service</option>
              </select>
            </div>
            {/* <div className="flex gap-4"> */}
            {/* Product Checkbox - Orange */}
            {/* <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-orange-600 font-medium">Product</span>
              </label> */}

            {/* Membership Checkbox - Blue */}
            {/* <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-blue-600 font-medium">Membership</span>
              </label> */}

            {/* Package Checkbox - Green */}
            {/* <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-green-600 font-medium">Package</span>
              </label> */}
            {/* </div> */}

            {/* Barcode Toggle */}
            {/* <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Barcode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-red-500 peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div> */}
            {/* <span>
              <span className="text-blue-950 text-lg font-bold">
                {" "}
                Total Coin
              </span>
              :{" "}
              <span className="text-orange-900 text-lg font-bold">{coin}</span>
            </span> */}
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
                  <p className="text-gray-600">GST {item.tax_rate || 0}%</p>
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
                  Rate Total: ₹{productWiseTotals[index]?.rateTotal}
                </p>
                {/*<p className="text-[12px]"></p>*/}
                {/* <p className="text-[12px]">
                  Making :(after Discount): ₹
                  {productWiseTotals[index]?.adjustedMaking}%
                </p>
                <p className="text-[12px]">
                  Grm:
                  {product.netWeight}
                </p>
                <p className="text-[12px]">
                  Diamond Total: ₹{productWiseTotals[index]?.diamondTotal} ||
                  Stone Total: ₹{productWiseTotals[index]?.stoneTotal}
                </p> */}
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

            {/* {grossTotal >=
            loyaltyData?.loyalty?.min_invoice_bill_to_get_point ? (
              <div className="flex justify-between">
                <p className="text-green-400">Point Rewarded:</p>
                <BsFillAwardFill />
                <p className="text-green-400">{reward}</p>
              </div>
            ) : null} */}

            <div className="flex justify-between">
              <p>Discount:</p>
              <p>₹{overallDiscountAmount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Total Tax :</p>
              <p>₹{totaltax}</p>
            </div>
            <div className="flex justify-between font-bold">
              <p>Net Total:</p>
              <p>₹{gto}</p>
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
          <form onSubmit={handleFormSubmit} className="space-y-4 rounded-md">
            <h2 className="text-lg font-bold">{selectedItem.name}</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Enter Barcode number"
                className="w-full p-2 border border-red-500 bg-red-100 rounded outline-none focus:border-red-700"
              />

              <button
                type="button"
                onClick={handleSearchBarCode}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Search
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <label>Quantity</label>
                <input
                  name="pcss"
                  type="number"
                  value={pcss}
                  className="w-full p-2 rounded border"
                  onChange={(e) => {
                    const newPcs = Number(e.target.value) || 0;
                    setPcs(newPcs);
                    updateTotal(rate, newPcs); // ✅ use rate from state
                  }}
                />
              </div>

              {/* <div>
                <label>Disc %</label>
                <input
                  name="discountPercent"
                  type="number"
                  className="w-full p-2 rounded border"
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
                <div className="flex gap-4 ">
                  {/* Product Checkbox - Orange */}

                  {/* Membership Checkbox - Blue */}
                  <label className="flex items-center space-x-2 mr-12">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-blue-600 font-medium">
                      Membership
                    </span>
                  </label>

                  {/* Package Checkbox - Green */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={pakageChecked}
                      onChange={handleCheckboxChangePakage}
                      className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-green-600 font-medium">Package</span>
                  </label>
                </div>
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
                  {loading && <p>Loading memberships...</p>}

                  {memberships && memberships.length >= 0 ? (
                    <ul className="mt-4 p-4 border rounded-lg bg-gray-100 shadow-md">
                      {memberships.map((membership) => {
                        const saleDate = new Date(membership.sale_date);
                        const expiryDate = new Date(saleDate);
                        expiryDate.setDate(
                          saleDate.getDate() + membership.plan?.validity
                        ); // Add validity to sale date

                        const today = new Date();
                        const daysLeft = Math.max(
                          0,
                          Math.ceil(
                            (expiryDate - today) / (1000 * 60 * 60 * 24)
                          )
                        ); // Calculate remaining days

                        return (
                          <li
                            key={membership.id}
                            className="p-4 border-b last:border-none bg-white rounded-lg shadow-sm mb-3"
                          >
                            <h3 className="text-lg font-semibold text-green-600 mb-2">
                              {membership.plan?.name}
                            </h3>
                            <p className="text-gray-700">
                              <strong className="text-gray-900">
                                {" "}
                                Plan Price:
                              </strong>{" "}
                              ₹{membership.plan?.fees}
                            </p>
                            <p className="text-gray-700">
                              <strong className="text-gray-900">
                                purchase date:
                              </strong>{" "}
                              {membership.sale_date}
                            </p>
                            <p
                              className={`text-gray-700 ${
                                daysLeft === 0 ? "text-red-500 font-bold" : ""
                              }`}
                            >
                              <strong className="text-gray-900">
                                Expires In:
                              </strong>{" "}
                              {daysLeft === 0 ? "Expired!" : `${daysLeft} days`}
                            </p>

                            <p className="text-gray-700">
                              <strong className="text-gray-900">
                                Discount:
                              </strong>{" "}
                              ₹{membership.plan?.discount}%
                            </p>
                            <p className="text-gray-700">
                              <strong className="text-gray-900">
                                Stylist:
                              </strong>{" "}
                              {membership.stylist?.name}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-red-500 font-semibold text-center mt-2">
                      No memberships found.
                    </p>
                  )}

                  {/* pakageList */}
                  {loading && <p>Loading Package List...</p>}

                  {pakageList && pakageList.length >= 0 ? (
                    <ul className="mt-4 p-4 border rounded-lg bg-gray-100 shadow-md">
                      {pakageList.map((membership) => {
                        // const saleDate = new Date(membership.sale_date);
                        // const expiryDate = new Date(saleDate);
                        // expiryDate.setDate(
                        //   saleDate.getDate() + membership.plan?.validity
                        // ); // Add validity to sale date

                        // const today = new Date();
                        // const daysLeft = Math.max(
                        //   0,
                        //   Math.ceil(
                        //     (expiryDate - today) / (1000 * 60 * 60 * 24)
                        //   )
                        // ); // Calculate remaining days

                        return (
                          <li
                            key={membership.id}
                            className="p-4 border-b last:border-none bg-white rounded-lg shadow-sm mb-3"
                          >
                            <h3 className="text-lg font-semibold text-green-600 mb-2">
                              {membership.package_name}
                            </h3>
                            <p className="text-gray-700">
                              <strong className="text-gray-900">
                                {" "}
                                Package Booking:
                              </strong>{" "}
                              ₹{membership.package_booking}
                            </p>
                            <p className="text-gray-700">
                              <strong className="text-gray-900">
                                Package No:
                              </strong>{" "}
                              {membership?.package_no}
                            </p>
                            {/* <p
            className={`text-gray-700 ${
              daysLeft === 0 ? "text-red-500 font-bold" : ""
            }`}
          >
            <strong className="text-gray-900">
              Expires In:
            </strong>{" "}
            {daysLeft === 0 ? "Expired!" : `${daysLeft} days`}
          </p> */}
                            <p className="text-gray-700">
                              <strong className="text-gray-900">
                                Actual Amount:
                              </strong>{" "}
                              ₹{membership?.package_amount}
                            </p>

                            <p className="text-gray-700">
                              <strong className="text-gray-900">
                                Service Amount:
                              </strong>{" "}
                              ₹{membership?.service_amount}
                            </p>
                            {/* <p className="text-gray-700">
            <strong className="text-gray-900">
              Stylist:
            </strong>{" "}
            {membership.stylist?.name}
          </p> */}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-red-500 font-semibold text-center mt-2">
                      No Package found.
                    </p>
                  )}

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
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      memberships.length > 0 && membDiscount > 0
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`}
                  >
                    {memberships.length > 0 && membDiscount > 0
                      ? "Bill Amount (After Membership Discount)"
                      : "Bill Amount"}
                  </h2>

                  <p
                    className={`text-3xl font-extrabold ${
                      memberships.length > 0 && membDiscount > 0
                        ? "text-blue-500"
                        : "text-green-600"
                    }`}
                  >
                    ₹
                    {memberships.length > 0 && membDiscount > 0
                      ? gtoAfterMemshipDisc
                      : gto}
                  </p>
                </div>

                {/* <div className="bg-white shadow-md rounded-lg p-6"> */}
                {/* Available Loyalty Points */}
                {/* <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h1 className="text-lg font-semibold text-gray-700">
                      Available Loyalty Points:
                    </h1>
                    <p className="text-xl font-bold text-blue-600">
                      {redeemData && redeemData.length > 0
                        ? redeemData[0].redeem_points
                        : "Loading..."}
                    </p>
                  </div> */}

                {/* Loyalty Discount Section */}
                {/* {gto >= loyaltyData.min_invcValue_needed_toStartRedemp ? (
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
                  )} */}

                {/* Final Payable Amount */}
                {/* <div className="flex justify-between items-center mt-4">
                    <h1 className="text-lg font-semibold text-gray-700">
                      Final Payable Amount:
                    </h1>
                    <p className="text-xl font-bold text-gray-900">
                      {redeemData && redeemData.length > 0
                        ? finalGto
                        : "Loading..."}
                    </p>
                  </div> */}
                {/* </div> */}
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
                      Remaining Amount: ₹{remainingAmount.toFixed(2)}
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
