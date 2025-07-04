"use client";
import React, { useState, useEffect } from "react";

import { useMemo } from "react";
import { toast } from "react-hot-toast";

import Image from "next/image";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { LuRefreshCcw } from "react-icons/lu";
import { BsFillAwardFill } from "react-icons/bs";

import { FaHome } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import CustomerForm from "./CustomerForm";

import {
  displayCoin,
  getcompany,
  getServiceGroup,
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
  //customer modal

  //ad customer data start

  const [isFormVisible, setFormVisible] = useState(false);

  const handleOpenModal = () => {
    setFormVisible(true); // Open modal
  };

  const handleCloseModal = () => {
    setFormVisible(false); // Close modal
  };

  //refresh button add state
  const [refreshKey, setRefreshKey] = useState(0);
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
  const [barcode, setBarcode] = useState("");
  const [productList, setProductList] = useState([]);
  const [checkRender, setCheckRender] = useState(false);
  const [selectTax, setTax] = useState("");
  const [additionDetail, setAdditionDetail] = useState("");
  //total qanty
  const [totalqty, setTotalQty] = useState(null);
  const [totalGstCount, setTotalGstCount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const [productDetails, setProductDetails] = useState({
    grossWeight: "",
    netWeight: "",
    pcs: "",
    makingInRs: "",
    making: "",
    hallmark: "",
    hallmarkCharge: "",
    wastageCharge: "",
    otherCharge: "",
    stoneValue: "",
    stoneDetails: "",
    diamondValue: "",
    diamondDetails: "",
    making_dsc: "",
    making_gst_percentage: "",
    huid: "",
    // quantity: "",
    qty: "",
    description: "",
    ad_wgt: "",
  });

  const [isEditable, setIsEditable] = useState(true);

  const handleSearchBarCode = async () => {
    if (!barcode.trim()) {
      setError("Please enter a barcode or fill details manually.");
      setIsEditable(true);
      return;
    }

    const foundProduct = allProducts.find((p) => p.barcode_no === barcode);
    console.log("barcode all ", foundProduct);

    if (foundProduct) {
      // Auto-fill details if found
      setProductDetails((prevDetails) => ({
        ...prevDetails, // Preserve existing values
        grossWeight: foundProduct.gwt || "",
        netWeight: foundProduct.nwt || "",
        ad_wgt: foundProduct.ad_wgt || "",
        pcs: foundProduct.pcs || "",
        makingInRs: foundProduct.making_in_rs || "",
        making: foundProduct.making_in_percent || "",
        hallmark: foundProduct.hallmark || "",
        hallmarkCharge: foundProduct.hallmark_charge || "",
        wastageCharge: foundProduct.wastage_charge || "",
        otherCharge: foundProduct.other_charge || "",
        stoneValue: foundProduct.stone_value || "",
        stoneDetails: foundProduct.stone_details || "",
        diamondValue: foundProduct.diamond_value || "",
        diamondDetails: foundProduct.diamond_details || "",
        making_dsc: foundProduct.making_dsc || "",
        making_gst_percentage: foundProduct.making_gst_percentage || "",
        huid: foundProduct.huid || "",
        // qty: foundProduct.qty || "",
        qty: foundProduct.pcs || "",
        description: foundProduct.description || "",
      }));

      setIsEditable(false);
      setError("");
    } else {
      // Allow manual entry if not found
      setProductDetails({
        grossWeight: "",
        netWeight: "",
        ad_wgt: "",
        pcs: "",
        making_in_rs: "",
        making: "",
        hallmark: "",
        hallmarkCharge: "",
        wastageCharge: "",
        otherCharge: "",
        stoneValue: "",
        stoneDetails: "",
        diamondValue: "",
        diamondDetails: "",
        making_dsc: "",
        making_gst_percentage: "",
        product_id: "",
        huid: "",
        qty: "",
        otherCharges: "",
        description: "",
      });
      setIsEditable(true);
      setError("Product not found. Enter details manually.");
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]); // Store all product data

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [billNo, setBillNo] = useState("");

  const [bill_inv, setbillinv] = useState("0");
  const [salesman_id, setSalesmanId] = useState("");
  const [allProductsGstAmount, setAllProductsGstAmount] = useState(null);

  const [addedProducts, setAddedProducts] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [coin, setItemscoin] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [redeemData, setRedeemData] = useState([]);
  const [company, setCompany] = useState([]);
  const [making, setMaking] = useState(null);
  const [qty, setQty] = useState(null);
  const [isDiscModalOpen, setDiscModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [hallmarksCharge, setHallMarksCharge] = useState(null);
  const [makingInRsCharge, setMakingInRsCharge] = useState(null);
  const [wastageCharges, setWastagesCharges] = useState(null);
  const [otherCharges, setOtherCharges] = useState(null);
  const [isBarcodeEnabled, setIsBarcodeEnabled] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [advanceMoney, setAdvanceMoney] = useState(0);

  const [redeemPoint, setRedeemPoint] = useState(0);

  // const [dateid, setDateid] = useState("");
  const [grossTotal, setGrossTotal] = useState(null);
  const [makingtotal, setMakingTotal] = useState(null);
  const [modalStep, setModalStep] = useState(1); // 1 for customer details, 2 for checkout
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderSearchId, SetOrderSearchId] = useState("");
  const [loyaltyData, setLoyaltyData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Store selected category
  const [filteredItems, setFilteredItems] = useState(items); // Store filtered items
  const [finalGto, setFinalGto] = useState(null);

  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountRs, setDiscountRs] = useState(0);
  const [addition, setAddition] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0); // this updates summary

  const [reward, setReward] = useState(null);
  const [netWt, setNtWt] = useState(null);
  const [ad_wgt, setAd_wgt] = useState(null);
  const [pcss, setPcs] = useState(null);

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    gstin: "",
  });

  const [orderDetails, setOrderDetails] = useState({
    OrderId: "",
    AdjustAmount: "",
    AdvanceAmount: "",
  });
  // const gto = grossTotal+allProductsGstAmount;

  // const gto = Number(grossTotal) + Number(allProductsGstAmount);
  const gto = Math.round(
    Number(grossTotal) +
      Number(totalGstCount) -
      Number(discountTotal) +
      Number(addition)
  );

  console.log("got", gto);
  console.log("allProductsGstAmount", allProductsGstAmount);
  const [cashAmount, setCashAmount] = useState(null);
  const [salesperson, setSalesperson] = useState([]);
  const [total, setTotals] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    cardAmount: 0,
    serviceCharge: 0,
  });
  const [upiAmount, setUpiAmount] = useState(null);
  const [payAdvance, SetpayAdvance] = useState(null);
  const [otherAmount, setOtherAmount] = useState(null);
  const [advanceAmount, setAdvanceAmount] = useState(null);
  const [couponNo, setCouponNo] = useState("");
  const [couponAmount, setCouponAmount] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [customerid, setCustomerId] = useState(false);
  const [productWiseTotals, setProductWiseTotals] = useState([]);

  const [remainingAmount, setRemainingAmount] = useState(gto);
  const [billcounts, setBillCount] = useState(0);

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
      payAdvance +
      otherAmount +
      Number(adjustAmount) +
      Number(advanceMoney) +
      advanceAmount;

    // Update remaining amount
    // const newRemainingAmount = gto - totalPaid - usingLoyaltyPoints;
    const newRemainingAmount = gto - totalPaid;

    setRemainingAmount(newRemainingAmount);
  }, [
    cashAmount,
    cardDetails.cardAmount,
    cardDetails.serviceCharge,
    upiAmount,
    payAdvance,
    otherAmount,
    advanceAmount,
    gto,
    refreshKey,
    adjustAmount,
    advanceMoney,
  ]);
  // const remainingAmount =
  //   gto -
  //   (Number(cashAmount) +
  //     Number(cardDetails.cardAmount) +
  //     Number(cardDetails.serviceCharge) +
  //     Number(upiAmount) +
  //     Number(adjustAmount) +
  //     Number(advanceAmount));

  //refresh function
  const handleRefresh = () => {
    console.log("refresh is not working");
    setRefreshKey((prev) => prev + 1); // trigger useEffect again
  };
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
      case "advance":
        // Only change the active method
        SetpayAdvance((prev) => (prev === 0 ? gto : prev));
        break;
      case "others":
        // Only change the active method
        setOtherAmount((prev) => (prev === 0 ? gto : prev));
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
        SetpayAdvance(0);
        setOtherAmount(0);
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
  const fetchItemscompany = async () => {
    try {
      const response = await getServiceGroup();
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
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
  const BillCount = async () => {
    try {
      const token = getCookie("access_token");
      const response = await axios.get(
        "http://127.0.0.1:8000/api/billcountnumber",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // setBillCount( response?.data?.total);
      setBillCount(response.data?.bill_count || 0);
      console.log("ordercount", response);
      return response.total; // Return the fetched data
    } catch (error) {
      toast.error("Error fetching order count data:");
      console.error("Error fetching barcode data:", error);
    }
  };
  //  {billCount?.bill_count ?? "Loading..."}

  useEffect(() => {
    // if (redeemData && redeemData.length > 0 && loyaltyData) {
    //   // const updatedFinalGto = gto - (gto * loyaltyData.max_redeem) / 100;
    //   const updatedFinalGto = gto;
    //   setFinalGto(updatedFinalGto);
    // }

    // const updatedFinalGto = gto - (gto * loyaltyData.max_redeem) / 100;
    const updatedFinalGto = gto;
    setFinalGto(updatedFinalGto);
  }, [gto, loyaltyData, redeemData]);

  const fetchProductsList = async () => {
    try {
      let token = getCookie("access_token"); // ✅ Declare token properly
      console.log("token", token);

      const response = await axios.get(
        "http://127.0.0.1:8000/api/stockDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("response", response.data);
      setProductList(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchProductsList();
    BillCount();
  }, []); // ✅ Ensure correct useEffect dependency array

  // Runs only when these dependencies change
  //loyalty point rewards setup and redeem setup

  useEffect(() => {
    axios
      .get(" http://127.0.0.1:8000/api/redeem-setup")
      .then((response) => {
        if (response.data.length > 0) {
          setLoyaltyData(response.data[0]); // Assuming you only need the first item
        } else {
          console.warn("No data received from API");
        }
      })
      .catch((error) => {
        // alert("Error fetching data. Check console for details.");
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

  const handleSearchOrder = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/orders/search?billno=${orderSearchId}`
      );
      console.log("orderDetails", res);
      const orderDetailsData = res.data?.data[0];
      setAdjustAmount(orderDetailsData?.adjustAmount);
      setAdvanceMoney(orderDetailsData?.advanceAmount);
      setOrderDetails({
        AdjustAmount: orderDetailsData.adjustAmount || "",
        AdvanceAmount: orderDetailsData.advanceAmount || "",
        depositeMaterial: orderDetailsData.depositeMaterial || "",
      });
      console.log("orderDetails1", orderDetails);
      toast.success("Order details fetched successfully");
    } catch (error) {
      toast.error("Error fetching order details");
    }
  };

  console.log("adjustAmount", adjustAmount);
  console.log("adjustAmount", advanceMoney);

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
    fetchItemscompany();
    fetchBarCodeData();

    fetchEmployees();
  }, []);

  //set selected categoey
  useEffect(() => {
    if (selectedCategory) {
      console.log("items when selected category", items);
      const filtered = items.filter(
        (item) => item.group_id === selectedCategory
      );
      console.log("selected category ", filtered);
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
      console.log("list of product-items", items);
    }
  }, [selectedCategory, items]);

  const fetchItems = async () => {
    try {
      const response = await getProductService();
      console.log("getProductService response", response);
      setItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    const token = getCookie("access_token");
    const res = await axios.get(" http://127.0.0.1:8000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSalesperson(res.data.employees);
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
    setCheckRender(!checkRender);
    const matchingProduct = productList.find(
      (product) => product.id === item.id
    );
    setTax(matchingProduct?.tax_rate);
    console.log("matchingProduct", matchingProduct);
    console.log("taxSelected", selectTax);
    if (matchingProduct?.available_quantity === null) {
      toast.error("Please create the stock this Product...");
    } else if (matchingProduct?.available_quantity > 0) {
      setSelectedItem(item);
      setIsOpen(true);
      console.log(matchingProduct);
    } else {
      toast.error("Product is not available in stock.");
    }
    console.log("items", item);
    console.log("prudctsLIst", productList);
    // setSelectedItem(item);
    // setIsOpen(true);
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

  //remove from this fucntion
  const handleRemoveProduct = (index) => {
    const updatedProducts = [...addedProducts];
    updatedProducts.splice(index, 1); // Remove one item at given index
    setAddedProducts(updatedProducts);

    // Recalculate totals after removal
    calculateTotals(updatedProducts);
  };

  // let totalquantity=0;
  // setTotalQty pcs
  //   const handleFormSubmit = (event) => {
  //     let currentGstAmount = 0;

  //     // setTotalQty pcs

  //     event.preventDefault();
  //     const formData = new FormData(event.target);

  //     // ad_wgt and netwight
  //     const ad_wgt = Number(formData.get("ad_wgt")) || 0;
  //     let netWeight = Number(formData.get("netWeight")) || 0;

  //     // Subtract ad_wgt only if > 0 and <= netWeight
  //     if (ad_wgt > 0 && ad_wgt <= netWeight) {
  //       netWeight -= ad_wgt;
  //     }

  //     const productDetails = {
  //       code: selectedItem.code,
  //       type: selectedItem.type,
  //       name: selectedItem.name,
  //       rate: selectedItem.rate || 0,
  //       tax_rate: selectedItem.tax_rate,
  //       hsn: selectedItem.hsn || "",
  //       product_id: selectedItem.id || "",

  //       // qty:Number(formData.get("qty"))|| "",
  //       qty: Number(formData.get("pcs")) || "",
  //       grossWeight: Number(formData.get("grossWeight")) || 0,
  //       description: formData.get("description") || "",
  //       // netWeight: Number(formData.get("netWeight")) || 0,
  //       // ad_wgt:Number(formData.get("ad_wgt")) || 0,
  //       netWeight: netWeight, // Adjusted if ad_wgt is valid
  //       ad_wgt: ad_wgt,
  //       pcs: Number(formData.get("pcs")) || 1,
  //       // grm: formData.get("grm") ? Number(formData.get("grm")) : 0,
  //       //  grm: grm,
  //       // making: Number(formData.get("making")) || 0,
  //       // making: making,
  //       making: Number(formData.get("making")) || 0,
  //       discountPercent: discountPercent || 0,
  //       discountRs: discountRs || 0,
  //       addition: addition || 0,

  //       diamondWeight: Number(formData.get("diamondWeight")) || 0,
  //       diamondValue: Number(formData.get("diamondValue")) || 0,
  //       stoneWeight: Number(formData.get("stoneWeight")) || 0,
  //       stoneValue: Number(formData.get("stoneValue")) || 0,
  //       huid: formData.get("huid") || "",
  //       hallmark: formData.get("hallmark") || "",
  //       hallmarkCharge: formData.get("hallmarkCharge") || "",
  //       wastageCharge: formData.get("wastageCharge") || "",
  //       otherCharge: formData.get("otherCharge") || "",
  //       makingInRs: formData.get("makingInRs") || "",
  //       pro_total: "",
  //       making_dsc: formData.get("making_dsc") || "",
  //       making_gst_percentage: formData.get("making_gst_percentage") || "",
  //     };

  //     console.log("productDetails....", productDetails);

  //     // setAddedProducts((prev) => [...prev, productDetails]);
  //     // closeModal();
  //     // calculateTotals([...addedProducts, productDetails]);
  //     const newAddedProducts = [...addedProducts, productDetails];
  //     console.log("newaddProducts",newAddedProducts);
  // setAddedProducts(newAddedProducts);
  // calculateTotals(newAddedProducts);
  // closeModal();

  //     event.target.reset();

  //     // ✅ Reset state variables
  //     setMaking(null);
  //     setTotals(null);
  //   };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const ad_wgt = Number(formData.get("ad_wgt")) || 0;
    let netWeight = Number(formData.get("netWeight")) || 0;

    if (ad_wgt > 0 && ad_wgt <= netWeight) {
      netWeight -= ad_wgt;
    }

    const productDetails = {
      code: selectedItem.code,
      type: selectedItem.type,
      name: selectedItem.name,
      rate: selectedItem.rate || 0,
      tax_rate: selectedItem.tax_rate,
      hsn: selectedItem.hsn || "",
      product_id: selectedItem.id || "",
      qty: Number(formData.get("pcs")) || 1,
      grossWeight: Number(formData.get("grossWeight")) || 0,
      description: formData.get("description") || "",
      netWeight,
      ad_wgt,
      pcs: Number(formData.get("pcs")) || 1,
      making: Number(formData.get("making")) || 0,
      discountPercent: discountPercent || 0,
      discountRs: discountRs || 0,
      addition: addition || 0,
      diamondWeight: Number(formData.get("diamondWeight")) || 0,
      diamondValue: Number(formData.get("diamondValue")) || 0,
      stoneWeight: Number(formData.get("stoneWeight")) || 0,
      stoneValue: Number(formData.get("stoneValue")) || 0,
      huid: formData.get("huid") || "",
      hallmark: formData.get("hallmark") || "",
      hallmarkCharge: formData.get("hallmarkCharge") || "",
      wastageCharge: formData.get("wastageCharge") || "",
      otherCharge: formData.get("otherCharge") || "",
      makingInRs: formData.get("makingInRs") || "",
      pro_total: "",
      making_dsc: formData.get("making_dsc") || "",
      making_gst_percentage: formData.get("making_gst_percentage") || "",
    };

    const updated = [...addedProducts, productDetails];
    setAddedProducts(updated);
    calculateTotals(updated);
    closeModal();
    event.target.reset();
    setMaking(null);
    setTotals(null);
  };

  // let totalgstCount = 0;
  // let totalquantity = 0;
  let newGstCount = 0;
  let newTotalQty = 0;
  // const calculateTotals = (products) => {
  //   let gross = 0;
  //   let discount = 0;
  //   let makingTotal = 0;
  //   const productWiseTotals = [];

  //   products.forEach((product) => {
  //     const goldValue = product.rate * product.netWeight;
  //     const hallmarkvalue = Number(product.hallmark) || 0;
  //     const hallmarkCharge = Number(product.hallmarkCharge) || 0;
  //     const wastageValue = Number(product.wastageCharge) || 0;
  //     const otherCharge = Number(product.otherCharge) || 0;
  //     const huid = Number(product.huid) || 0;

  //     const makingChargePerGram = (product.rate * product.making) / 100; // Making charge per gram(%)
  //     console.log("makingChargePerGram", makingChargePerGram);
  //     const totalMakingCharge =
  //       makingChargePerGram * product.grossWeight * product.pcs; // Total making charge for  all product
  //     console.log("totalMakingCharge", totalMakingCharge);
  //     const makingRsVAlue =
  //       Number(product.makingInRs) * product.grossWeight * product.pcs || 0;
  //     let totalMakingChargeInRsPercentage = 0; // Total making charge for  all product
  //     let totalGstOnMakingCharge = 0; // Total making charge for  all product

  //     //makingchage and makingRs on deposite gold(it wokring on one pices of golde)
  //     const makingChargePerGramOnDepositMetal =
  //       (product.rate * product.making) / 100;
  //     console.log(
  //       "makingChargePerGramOnDepositMetal",
  //       makingChargePerGramOnDepositMetal
  //     );
  //     const totalMakingChargeOnDepositMetal =
  //       makingChargePerGramOnDepositMetal * product.ad_wgt;
  //     console.log(
  //       "totalMakingChargeOnDepositMetal",
  //       totalMakingChargeOnDepositMetal
  //     );
  //     const makingRsVAlueOnDepositMetal =
  //       Number(product.makingInRs) * product.ad_wgt || 0;
  //     console.log(
  //       "totalMakingChargeOnDepositMetal",
  //       totalMakingChargeOnDepositMetal
  //     );
  //     console.log("makingRsVAlueOnDepositMetal", makingRsVAlueOnDepositMetal);
  //     let totalMakingChargeInRsPercentageOnDepositMetal = 0; // Total making charge for  all product
  //     let totalGstOnMakingChargeOnDepositMetal = 0; // Total making charge for  all product

  //     if (product.ad_wgt && product.ad_wgt > 0) {
  //       console.log("product.ad_wgt", product.ad_wgt);
  //       if (
  //         totalMakingChargeOnDepositMetal !== 0 ||
  //         makingRsVAlueOnDepositMetal !== 0
  //       ) {
  //         if (product.making_gst_percentage) {
  //           totalGstOnMakingChargeOnDepositMetal =
  //             ((totalMakingChargeOnDepositMetal + makingRsVAlueOnDepositMetal) *
  //               product.making_gst_percentage) /
  //             100;

  //           console.log(
  //             "totalGstOnMakingChargeOnDepositMetal",
  //             totalGstOnMakingChargeOnDepositMetal
  //           );
  //         }
  //         if (product.making_dsc) {
  //           const discount_onMakingCharage =
  //             ((totalMakingChargeOnDepositMetal + makingRsVAlueOnDepositMetal) *
  //               product.making_dsc) /
  //             100;
  //           console.log("discount_onMakingCharage", discount_onMakingCharage);
  //           totalMakingChargeInRsPercentageOnDepositMetal =
  //             totalMakingChargeOnDepositMetal +
  //             makingRsVAlueOnDepositMetal -
  //             discount_onMakingCharage;
  //           console.log(
  //             "totalMakingChargeInRsPercentage",
  //             totalMakingChargeInRsPercentageOnDepositMetal
  //           );
  //         } else {
  //           totalMakingChargeInRsPercentageOnDepositMetal =
  //             totalMakingChargeOnDepositMetal + makingRsVAlueOnDepositMetal;
  //           console.log(
  //             "totalMakingChargeInRsPercentage",
  //             totalMakingChargeInRsPercentageOnDepositMetal
  //           );
  //         }
  //       }
  //     }

  //     if (totalMakingCharge !== 0 || makingRsVAlue !== 0) {
  //       console.log("totalMakingCharge alreday wokring");
  //       // if (product.making_gst_percentage) {
  //       //   totalGstOnMakingCharge =
  //       //     ((totalMakingCharge + makingRsVAlue) *
  //       //       product.making_gst_percentage) /
  //       //     100;

  //       //   console.log("totalGstOnMakingCharge", totalGstOnMakingCharge);
  //       // }
  //       if (product.making_dsc) {
  //         const discount_onMakingCharage =
  //           ((totalMakingCharge + makingRsVAlue) * product.making_dsc) / 100;
  //         console.log("discount_onMakingCharage", discount_onMakingCharage);
  //         totalMakingChargeInRsPercentage =
  //           totalMakingCharge + makingRsVAlue - discount_onMakingCharage;

  //         //add here for gst on making charge or RS after discount
  //         totalGstOnMakingCharge =
  //           (totalMakingChargeInRsPercentage * product.making_gst_percentage) /
  //           100;
  //         console.log(
  //           "totalMakingChargeInRsPercentage",
  //           totalMakingChargeInRsPercentage
  //         );
  //       } else {
  //         totalMakingChargeInRsPercentage = totalMakingCharge + makingRsVAlue;
  //         totalGstOnMakingCharge =
  //           (totalMakingChargeInRsPercentage * product.making_gst_percentage) /
  //           100;
  //         console.log(
  //           "totalMakingChargeInRsPercentage",
  //           totalMakingChargeInRsPercentage
  //         );
  //       }
  //     }

  //     const RateTotal =
  //       product.rate * product.netWeight * product.pcs +
  //       wastageValue +
  //       hallmarkCharge +
  //       otherCharge +
  //       totalMakingChargeInRsPercentage;
  //     //  totalMakingChargeInRsPercentageOnDepositMetal
  //     // totalGstOnMakingChargeOnDepositMetal;
  //     console.log("RateTotal", RateTotal);

  //     const productDiscount = product.discountPercent / 100;
  //     const AdjustedMaking = product.making - productDiscount;

  //     const StoneTotal = product.stoneWeight * product.stoneValue;
  //     const DiamondTotal = product.diamondWeight * product.diamondValue;
  //     const gstonGold =
  //       (product.rate * product.netWeight * product.pcs * product.tax_rate) /
  //       100;
  //     console.log("gst on gold", gstonGold);
  //     const productTotal = RateTotal + StoneTotal + DiamondTotal;
  //     console.log("Product Total Rate", productTotal);
  //     //blow line use to calculate the only gst  over all product
  //     // totalgstCount += (productTotal * product.tax_rate) / 100;
  //     totalgstCount += gstonGold + totalGstOnMakingCharge;
  //     console.log("totalgstCount", totalgstCount);
  //     totalquantity += product?.pcs;
  //     console.log("totalquantity", totalquantity);
  //     console.log("gstongolde", gstonGold);
  //     console.log("mkgcharage", totalMakingChargeInRsPercentage);
  //     console.log("gstmkgchgr", totalGstOnMakingCharge);
  //     productWiseTotals.push({
  //       code: product.code,
  //       name: product.name,

  //       rateTotal: RateTotal.toFixed(2),
  //       adjustedMaking: AdjustedMaking.toFixed(2),
  //       diamondTotal: DiamondTotal.toFixed(2),
  //       stoneTotal: StoneTotal.toFixed(2),
  //       gstOnGold: gstonGold.toFixed(2),
  //       mkg_chg_RS_P: totalMakingChargeInRsPercentage.toFixed(2),

  //       gstOnMaking: totalGstOnMakingCharge.toFixed(2),
  //       total: productTotal.toFixed(2),
  //     });

  //     gross += productTotal;
  //     discount += productDiscount;
  //     makingTotal += AdjustedMaking;
  //   });

  //   setGrossTotal(gross.toFixed(2));
  //   setDiscountTotal(discount.toFixed(2));
  //   setProductWiseTotals(productWiseTotals);
  //   setMakingTotal(makingTotal.toFixed(2));
  //   setAllProductsGstAmount(totalgstCount.toFixed(2));
  //   setTotalQty(totalquantity);
  // };

  const calculateTotals = (products) => {
    let gross = 0;
    let discount = 0;
    let makingTotal = 0;
    let newGstCount = 0;
    let newTotalQty = 0;
    const productWiseTotals = [];

    products.forEach((product) => {
      const goldValue = product.rate * product.netWeight;
      const hallmarkCharge = Number(product.hallmarkCharge) || 0;
      const wastageValue = Number(product.wastageCharge) || 0;
      const otherCharge = Number(product.otherCharge) || 0;

      const makingChargePerGram = (product.rate * product.making) / 100;
      const totalMakingCharge =
        makingChargePerGram * product.grossWeight * product.pcs;
      const makingRsValue =
        Number(product.makingInRs) * product.grossWeight * product.pcs || 0;

      const makingChargePerGramDeposit = (product.rate * product.making) / 100;
      const totalMakingChargeDeposit =
        makingChargePerGramDeposit * product.ad_wgt;
      const makingRsDeposit = Number(product.makingInRs) * product.ad_wgt || 0;

      let gstOnMaking = 0;
      let gstOnMakingDeposit = 0;
      let makingTotalRs = 0;
      let makingTotalRsDeposit = 0;

      // Apply discount and GST logic
      if (product.ad_wgt > 0) {
        const totalBeforeDisc = totalMakingChargeDeposit + makingRsDeposit;
        if (product.making_dsc) {
          const discount = (totalBeforeDisc * product.making_dsc) / 100;
          makingTotalRsDeposit = totalBeforeDisc - discount;
        } else {
          makingTotalRsDeposit = totalBeforeDisc;
        }

        if (product.making_gst_percentage) {
          gstOnMakingDeposit =
            (makingTotalRsDeposit * product.making_gst_percentage) / 100;
        }
      }

      if (totalMakingCharge !== 0 || makingRsValue !== 0) {
        const totalBeforeDisc = totalMakingCharge + makingRsValue;
        if (product.making_dsc) {
          const discount = (totalBeforeDisc * product.making_dsc) / 100;
          makingTotalRs = totalBeforeDisc - discount;
        } else {
          makingTotalRs = totalBeforeDisc;
        }

        if (product.making_gst_percentage) {
          gstOnMaking = (makingTotalRs * product.making_gst_percentage) / 100;
        }
      }

      const rateTotal =
        product.rate * product.netWeight * product.pcs +
        wastageValue +
        hallmarkCharge +
        otherCharge +
        makingTotalRs;

      const productDiscount = product.discountPercent / 100;
      const AdjustedMaking = product.making - productDiscount;

      const stoneTotal = product.stoneWeight * product.stoneValue;
      const diamondTotal = product.diamondWeight * product.diamondValue;

      const gstOnGold =
        (product.rate * product.netWeight * product.pcs * product.tax_rate) /
        100;

      const productTotal = rateTotal + stoneTotal + diamondTotal;

     
      newGstCount += gstOnGold + gstOnMaking;
      console.log("gstongold", gstOnGold);
      console.log("gstOnMaking", gstOnMaking);
      console.log("gstOnMakingDeposit", gstOnMakingDeposit);
      console.log("newGstCount", newGstCount);
      newTotalQty += product.pcs;

      productWiseTotals.push({
        code: product.code,
        name: product.name,
        rateTotal: rateTotal.toFixed(2),
        adjustedMaking: AdjustedMaking.toFixed(2),
        diamondTotal: diamondTotal.toFixed(2),
        stoneTotal: stoneTotal.toFixed(2),
        gstOnGold: gstOnGold.toFixed(2),
        mkg_chg_RS_P: makingTotalRs.toFixed(2),
        gstOnMaking: gstOnMaking.toFixed(2),
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
    setTotalGstCount(newGstCount.toFixed(2));
    setTotalQuantity(newTotalQty);
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
      advance: { payAdvance },
      others: { otherAmount },
    };
    const paymentMethods = Object.keys(paymentDetails).map((method) => ({
      payment_method: method,
      price:
        paymentDetails[method].cashAmount ||
        paymentDetails[method].cardAmount ||
        paymentDetails[method].upiAmount ||
        paymentDetails[method].payAdvance ||
        paymentDetails[method].otherAmount ||
        0,
    }));
    console.log(paymentDetails);
    const paymentMethodDetails = paymentDetails[paymentMethod];

    if (!paymentMethodDetails) {
      notyf.error("Invalid payment method selected.");
      return;
    }
    //i commenet it
    // const metalValue = addedProducts.reduce(
    //   (sum, _, i) => sum + (productWiseTotals[i]?.rateTotal || 0),
    //   0
    // );
    const makingDsc = addedProducts.reduce(
      (sum, _, i) => sum + (productWiseTotals[i]?.adjustedMaking || 0),
      0
    );
    const TotalProductprice = addedProducts.reduce(
      (sum, _, i) => sum + (productWiseTotals[i]?.total || 0),
      0
    );
    console.log("productwise toal", productWiseTotals);
    const payload = {
      products: addedProducts.map((product, i) => ({
        name: product.name,
        code: product.code,
        tax_rate: product.tax_rate,
        hsn: product.hsn,
        grossWeight: product.grossWeight,
        description: product.description,
        netWeight: product.netWeight,
        ad_wgt: product.ad_wgt,
        making: product.making,
        rate: product.rate,
        stoneWeight: product.stoneWeight,
        stoneValue: product.stoneValue,
        huid: product.huid,
        hallmark: product.hallmark,
        hallmarkCharge: product.hallmarkCharge,
        wastageCharge: product.wastageCharge,
        otherCharge: product.otherCharge,
        makingInRs: product.makingInRs,
        // metal_value: metalValue,
        making_dsc: product.making_dsc,
        making_gst_percentage: product.making_gst_percentage,
        product_id: product.product_id,
        diamondDetails: product.diamondWeight,
        diamondValue: product.diamondValue,
        // qty: product.qty,
        qty: product.pcs,
        // grm: product.grm,
        pro_total: productWiseTotals[i]?.total || 0,
        gstOnGold: productWiseTotals[i]?.gstOnGold || 0,
        gstOnMaking: productWiseTotals[i]?.gstOnMaking || 0,
        mkg_chg_RS_P: productWiseTotals[i]?.mkg_chg_RS_P || 0,
      })),
      grossTotal,
      totalTax: Math.round(Number(totalGstCount)),
      discountTotal,
      paymentMethods,
      dateid,
      bill_inv,
      salesman_id: salesman_id,
      totalqty,
      // totalsetTotalQty(totalquantity)
      // let totalquantity=0;
      // setTotalQty pcs

      customer_id: customerDetails.id,
      order_slip: 0,
      price: paymentMethods.reduce(
        (total, payment) => total + payment.price,
        0
      ), // Total payment price
      // discount data added
      discountPercent: discountPercent || 0,
      discountRs: discountRs || 0,
      additionRs: addition || 0,
      additionDetail: additionDetail || "",
      minAdjAmt: Number(adjustAmount) || 0,
      minAdAmt: Number(advanceMoney) || 0,
    };
    console.log("payload", payload);
    try {
      const response = await axios.post(
        " http://127.0.0.1:8000/api/order",
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
      setTotalGstCount(0);
      // setAllProductsGstAmount(0);
      setAddition(0);

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
        ` http://127.0.0.1:8000/api/customer-redeem-point/${customerId}`,
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
        ` http://127.0.0.1:8000/api/customer-redeem-point/${customerId}`,
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

  const discontHandler = () => {
    let percentDiscount = (grossTotal * discountPercent) / 100;
    let totalDiscount = percentDiscount + discountRs;
    setDiscountTotal(totalDiscount < 0 ? 0 : totalDiscount);
    setAddition(addition < 0 ? 0 : addition);
    setDiscModalOpen(false);
    console.log("addtion invoice", addition);
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
          {/* <button
            className="flex flex-col items-center text-blue-600"
            onClick={handleRefresh}
          >
            <LuRefreshCcw size={20} />
            <span className="text-xs">Refresh</span>
          </button> */}
          <div
            onClick={() => {
              window.location.reload();
            }}
            className="flex flex-col items-center text-blue-600 cursor-pointer"
          >
            <LuRefreshCcw size={20} />
            <span className="text-xs">Refresh</span>
          </div>

          <Link
            href="/jwellery/reports/billwise/"
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
            className="bg-green-500 text-white px-4 py-1 rounded flex items-center space-x-1"
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
            className="text-black hidden"
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
                  type="number"
                  className="w-full border p-2 rounded mb-2"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                />
                <label>Disc (Rs)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded mb-2"
                  value={discountRs}
                  onChange={(e) => setDiscountRs(Number(e.target.value))}
                />
                <label>Addition (Rs)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded mb-2"
                  value={addition}
                  onChange={(e) => setAddition(Number(e.target.value))}
                />

                {/* <label>Addition Detail</label>
                <textarea className="w-full border p-2 rounded mb-4"></textarea> */}

                <label>Addition Detail</label>
                <textarea
                  className="w-full border p-2 rounded mb-4"
                  value={additionDetail}
                  onChange={(e) => setAdditionDetail(e.target.value)}
                />

                <button
                  className="bg-green-500 text-white px-4 py-2 rounded w-full"
                  // onClick={() => {
                  //   let percentDiscount = (grossTotal * discountPercent) / 100;
                  //   let totalDiscount = percentDiscount + discountRs - addition;
                  //   setDiscountTotal(totalDiscount < 0 ? 0 : totalDiscount);
                  //   setDiscModalOpen(false);
                  //   console.log("addtion invoice", addition);
                  //
                  // }}
                  onClick={discontHandler}
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
            <select
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
              {/* <option value="0">INVOICE</option> */}
            </select>

            <select
              name="bill_inv"
              className="border rounded px-4 py-2"
              onChange={(e) => setbillinv(e.target.value)}
            >
              <option value="0"> TAX INVOICE</option>
              <option value="1">ESTIMATE</option>
            </select>

            {/* Bill Number */}
            {/* <input
              type="text"
              placeholder="Bill No"
              value={billNo}
              className="border rounded px-4 py-2"
            /> */}
            <div className="border border-black  rounded px-4 py-2 ml-2">
              <label>Bill No:/{billcounts.bill_count}</label>
              {/* {billCount?.bill_count ?? "Loading..."} */}
            </div>

            {/* Date Picker */}
            <div className="flex items-center border rounded px-4 py-2">
              <input
                type="date"
                name="date"
                value={dateid}
                min={today} // Prevents selection of past dates
                onChange={(e) => {
                  const rawDate = e.target.value; // YYYY-MM-DD format
                  const formattedDate = rawDate.split("-").reverse().join("-"); // Convert to DD-MM-YYYY
                  console.log("Formatted Date:", formattedDate);
                  setDateid(formattedDate);
                }}
              />
            </div>

            {/* Category Dropdown */}
            <select
              name="caregory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">Select Category</option>
              {company.map((categry) => (
                <option key={categry.id} value={categry.id}>
                  {categry.name}
                </option>
              ))}
            </select>

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
                <input
                  type="checkbox"
                  checked={isBarcodeEnabled}
                  onChange={() => setIsBarcodeEnabled(!isBarcodeEnabled)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-red-500 peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
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
                  className="border border-blue-500 h-[200px] rounded-lg p-2 flex flex-col items-center text-center cursor-pointer overflow-hidden"
                  onClick={() => openModal(item)}
                >
                  {/* Image */}
                  <div className="w-full flex justify-center items-center h-[80px]">
                    {item.image ? (
                      <img
                        src={`${baseImageURL}/storage/${item.image}`}
                        alt={item.code}
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  {/* Name */}
                  <p className="mt-1 text-sm font-semibold truncate w-full">
                    {item.name || "No Type"}
                  </p>

                  {/* Rate and Tax */}
                  <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                    <p>₹{item.rate || 0}</p>
                    <p>₹{item.tax_rate || 0}</p>
                  </div>
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
                {product.name && <p className="font-bold">{product.name}</p>}

                {product.description && (
                  <p className="text-[15px] font-semibold">
                    Description: {product.description}
                  </p>
                )}
                {product.netWeight > 0 && (
                  <p className="text-[12px]">Net Wgt: {product.netWeight}</p>
                )}
                {product.ad_wgt > 0 && (
                  <p className="text-[12px]">
                    Adjustment Wgt: {product.ad_wgt}
                  </p>
                )}
                {product.grossWeight > 0 && (
                  <p className="text-[12px]">G Wgt: {product.grossWeight}</p>
                )}
                {product.qty > 0 && (
                  <p className="text-[12px]">Qty: {product.qty}</p>
                )}
                {product.rate > 0 && (
                  <p className="text-[12px]">Rate: {product.rate}</p>
                )}
                {product.makingInRs > 0 && (
                  <p className="text-[12px]">
                    makingInRs: {product.makingInRs}
                  </p>
                )}
                {product.making > 0 && (
                  <p className="text-[12px]">Making%: {product.making}</p>
                )}
                {product.diamondValue > 0 && (
                  <p className="text-[12px]">
                    DiamondValue: {product.diamondValue}
                  </p>
                )}
                {product.diamondWeight > 0 && (
                  <p className="text-[12px]">
                    Diamond(Carats): {product.diamondWeight}
                  </p>
                )}
                {product.making_gst_percentage > 0 && (
                  <p className="text-[12px]">
                    Gst% On Making: {product.making_gst_percentage}
                  </p>
                )}
                {product.stoneValue > 0 && (
                  <p className="text-[12px]">
                    stone Value: {product.stoneValue}
                  </p>
                )}

                {product.stoneWeight > 0 && (
                  <p className="text-[12px]">
                    Stone Wgt: {product.stoneWeight}
                  </p>
                )}
                {product.huid > 0 && (
                  <p className="text-[12px]">Huid: {product.huid}</p>
                )}

                {product.hallmark > 0 && (
                  <p className="text-[12px]">Hallmark: {product.hallmark}</p>
                )}
                {product.hallmarkCharge > 0 && (
                  <p className="text-[12px]">
                    HallmarkCharge: {product.hallmarkCharge}
                  </p>
                )}
                {product.wastageCharge > 0 && (
                  <p className="text-[12px]">
                    WastageCharge: {product.wastageCharge}
                  </p>
                )}

                {product.otherCharge > 0 && (
                  <p className="text-[12px]">
                    OtherCharge: {product.otherCharge}
                  </p>
                )}

                <p className="text-[12px]">
                  <strong>Total: ₹{productWiseTotals[index]?.total}</strong>
                </p>

                <button
                  className="mt-1 text-red-600 underline"
                  onClick={() => handleRemoveProduct(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="h-[16rem]"></div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-100">
            <div className="flex justify-between">
              <p>Gross Total:</p>
              <p>₹{grossTotal}</p>
            </div>
            <div className="flex justify-between">
              <p>Total Tax:</p>
              {/* <p>₹{allProductsGstAmount}</p> */}
              <p>{totalGstCount}</p>
            </div>

            {/* 


  {grossTotal >=
            loyaltyData?.loyalty?.min_invoice_bill_to_get_point ? (
              <div className="flex justify-between">
                <p className="text-green-400">Point Rewarded:</p>
                <BsFillAwardFill />
                <p className="text-green-400">{reward}</p>
              </div>
            ) : null}


*/}

            <div className="flex justify-between">
              <p>Discount:</p>
              <p>₹{discountTotal}</p>
            </div>
            <div>
              <p>Total GST: ₹{totalGstCount}</p>
            </div>
            {addition > 0 && (
              <div className="flex justify-between">
                <p>AddtionRs:</p>
                <p>₹{addition}</p>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <p>Net Total:</p>
              {/* const gto = Number(grossTotal) + Number(allProductsGstAmount); */}
              <p>
                ₹
                {(
                  Number(grossTotal) +
                  Number(addition) +
                  Number(totalGstCount) -
                  Number(discountTotal)
                ).toFixed(2)}
              </p>
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
            <h2 className="text-lg font-bold">{selectedItem.name}</h2>

            {isBarcodeEnabled && (
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
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Gross Wgt(grm)</label>
                {/* <input
                  name="grossWeight"
                  type="number"
                   step="0.001"
                   pattern="^\d+(\.\d{0,3})?$" // optional validation
                  value={productDetails.grossWeight}
                  
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      grossWeight: e.target.value, // ✅ update the correct key
                    })
                  }
                  readOnly={!isEditable}
                  className="w-full p-2 rounded border"
                /> */}

                <input
                  name="grossWeight"
                  type="text" // use text to get full control over input
                  value={productDetails.grossWeight}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Allow only numbers with up to 3 decimal places
                    const regex = /^\d*\.?\d{0,3}$/;

                    if (value === "" || regex.test(value)) {
                      setProductDetails({
                        ...productDetails,
                        grossWeight: value,
                      });
                    }
                  }}
                  readOnly={!isEditable}
                  className="w-full p-2 rounded border"
                />
                {/* product id pass(dont touch below) */}

                <input
                  name="grossWeight"
                  type="number"
                  value={selectedItem.id}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      grossWeight: e.target.value,
                    })
                  }
                  readOnly={!isEditable}
                  className="w-full p-2 rounded border hidden"
                />

                {/* add quntiy */}
                {/* <input
                  name="qty"
                  type="number"
                  value={selectedItem.qty}
                  placeholder="Add Quntity"
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      qty: e.target.value,
                    })
                  }
                  // readOnly={!isEditable}

                  className="w-full p-2 rounded border"
                /> */}
              </div>
              <div>
                <label>Net Wgt(grm)</label>
                <input
                  name="netWeight"
                  type="number"
                  // readOnly
                  value={productDetails.netWeight}
                  className="w-full p-2 rounded border"
                  onChange={(e) => {
                    const newNetWeight = Number(e.target.value) || 0;

                    const regex = /^\d*\.?\d{0,3}$/;
                    if (e.target.value === "" || regex.test(e.target.value)) {
                      setProductDetails({
                        ...productDetails,
                        netWeight: e.target.value,
                      });
                    }
                    setNtWt(newNetWeight);
                    updateTotal(
                      making,
                      newNetWeight,
                      pcss,
                      makingInRsCharge,
                      hallmarksCharge,
                      wastageCharges
                    );
                    // setProductDetails({
                    //   ...productDetails,
                    //   netWeight: e.target.value,
                    // });
                  }}
                />
              </div>

              {/* ad_wgt */}
              <div>
                <label>Deposit Material(grm)</label>
                <input
                  name="ad_wgt"
                  type="number"
                  // readOnly
                  value={productDetails.ad_wgt}
                  className="w-full p-2 rounded border"
                  onChange={(e) => {
                    const ad_wgt = Number(e.target.value) || 0;
                    setAd_wgt(ad_wgt);
                    updateTotal(
                      making,
                      ad_wgt,
                      pcss,
                      makingInRsCharge,
                      hallmarksCharge,
                      wastageCharges
                    );
                    setProductDetails({
                      ...productDetails,
                      ad_wgt: e.target.value,
                    });
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
                  onWheel={(e) => e.target.blur()}
                  defaultValue={0}
                  value={productDetails.pcs}
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
                    setProductDetails({
                      ...productDetails,
                      pcs: e.target.value,
                    });
                  }}
                />
              </div>
              {/* descrition inpute */}
              <div>
                <label>Description</label>
                <input
                  name="description"
                  type="text"
                  onWheel={(e) => e.target.blur()}
                  defaultValue={0}
                  value={productDetails.description}
                  className="w-full p-2 rounded border"
                  placeholder="Product Description"
                  onChange={(e) => {
                    // const newPcs = Number(e.target.value) || 0;
                    // setPcs(newPcs);

                    setProductDetails({
                      ...productDetails,
                      description: e.target.value,
                    });
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
                  value={productDetails.making}
                  className="w-full p-2 rounded border"
                  onWheel={(e) => e.target.blur()}
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
                    setProductDetails({
                      ...productDetails,
                      making: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <label>making in (Rs)-- per grm</label>
                <input
                  name="makingInRs"
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  // value={makingInRs}
                  value={productDetails.makingInRs}
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
                    setProductDetails({
                      ...productDetails,
                      makingInRs: e.target.value,
                    });
                  }}
                  className="w-full p-2 rounded border"
                />
              </div>

              {/* <div>
                <label>Making in (%)</label>
                <input
                  name="making"
                  type="number"
                  value={productDetails.making}
                  className="w-full p-2 rounded border"
                  onChange={(e) => {
                    const newMaking = Number(e.target.value);

                    setMaking(newMaking);
                    updateTotal(
                      newMaking,
                      netWt,
                      pcss,
                      0, // Rs becomes 0
                      hallmarksCharge,
                      wastageCharges
                    );

                    setProductDetails({
                      ...productDetails,
                      making: e.target.value,
                      makingInRs: "", // clear Rs field
                    });

                    setMakingInRsCharge(0); // clear Rs charge
                  }}
                />
              </div>

              <div>
                <label>Making in (Rs) -- per grm</label>
                <input
                  name="makingInRs"
                  type="number"
                  value={productDetails.makingInRs}
                  onChange={(e) => {
                    const value = e.target.value;
                    const newmakingInRs = Number(value) * netWt;

                    setMakingInRsCharge(newmakingInRs);
                    updateTotal(
                      0, // % becomes 0
                      netWt,
                      pcss,
                      newmakingInRs,
                      hallmarksCharge,
                      wastageCharges
                    );

                    setProductDetails({
                      ...productDetails,
                      makingInRs: value,
                      making: "", // clear % field
                    });

                    setMaking(0); // clear % value
                  }}
                  className="w-full p-2 rounded border"
                />
              </div> */}

              <div>
                <label>Disc %</label>
                <input
                  name="making_dsc"
                  type="number"
                  value={productDetails.making_dsc}
                  className="w-full p-2 rounded border"
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => {
                    setProductDetails({
                      ...productDetails,
                      making_dsc: e.target.value,
                    });
                  }}
                />
              </div>
              {/* gst on making charage */}
              <div>
                <label>GST% On Making Charage</label>
                <input
                  name="making_gst_percentage"
                  type="number"
                  value={productDetails.making_gst_percentage}
                  className="w-full p-2 rounded border"
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => {
                    setProductDetails({
                      ...productDetails,
                      making_gst_percentage: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <label>Diamond (Carats)</label>
                {/* <input
                  name="diamondWeight"
                  value={productDetails.diamondDetails}
                  type="number"
                  className="w-full p-2 rounded border"
                /> */}
                <input
                  name="diamondWeight"
                  value={productDetails.diamondDetails}
                  onWheel={(e) => e.target.blur()}
                  type="number"
                  step="0.001"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers with up to 3 decimal places
                    if (/^\d*\.?\d{0,3}$/.test(value)) {
                      setProductDetails({
                        ...productDetails,
                        diamondDetails: value,
                      });
                    }
                  }}
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Diamond Value</label>
                {/* <input
                  name="diamondValue"
                  value={productDetails.diamondValue}
                  type="number"
                  className="w-full p-2 rounded border"
                /> */}
                <input
                  name="diamondValue"
                  onWheel={(e) => e.target.blur()}
                  value={productDetails.diamondValue || ""}
                  type="number"
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      diamondValue: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Stone Wgt</label>
                {/* <input
                  name="stoneWeight"
                  type="number"
                  value={productDetails.stoneDetails}
                  className="w-full p-2 rounded border"
                /> */}
                <input
                  name="stoneWeight"
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  value={productDetails.stoneDetails || ""}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      stoneDetails: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Stone Value</label>
                {/* <input
                  name="stoneValue"
                  value={productDetails.stoneValue}
                  type="number"
                  className="w-full p-2 rounded border"
                /> */}

                <input
                  name="stoneValue"
                  onWheel={(e) => e.target.blur()}
                  value={productDetails.stoneValue || ""}
                  type="number"
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      stoneValue: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>HUID</label>
                {/* <input
                  name="huid"
                  type="text"
                  value={productDetails.huid}
                  className="w-full p-2 rounded border"
                /> */}

                <input
                  name="huid"
                  type="text"
                  value={productDetails.huid || ""}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      huid: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Hallmark</label>
                {/* <input
                  name="hallmark"
                  value={productDetails.hallmark}
                  type="text"
                  className="w-full p-2 rounded border"
                /> */}
                <input
                  name="hallmark"
                  value={productDetails.hallmark || ""}
                  type="text"
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      hallmark: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>Hallmark charge</label>
                <input
                  name="hallmarkCharge"
                  value={productDetails.hallmarkCharge}
                  onWheel={(e) => e.target.blur()}
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
                    setProductDetails({
                      ...productDetails,
                      hallmarkCharge: e.target.value, // ✅ update the input value in state
                    });
                  }}
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label>wastage charge</label>
                {/* <input
                  name="wastageCharge"
                  value={productDetails.wastageCharge}
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
                /> */}
                <input
                  name="wastageCharge"
                  value={productDetails.wastageCharge || ""}
                  type="number"
                  onWheel={(e) => e.target.blur()}
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
                    setProductDetails({
                      ...productDetails,
                      wastageCharge: e.target.value, // ✅ keeps input editable
                    });
                  }}
                  className="w-full p-2 rounded border"
                />
              </div>

              <div>
                <label>Other Charge</label>
                {/* <input
                  name="otherCharge"
                  value={productDetails.otherCharge}
                  type="number"
                  onChange={(e) => {
                    const newOtherCharges = Number(e.target.value);
                    setOtherCharges(newOtherCharges);
                    updateTotal(
                      making,
                      netWt,
                      pcss,
                      makingInRsCharge,
                      hallmarksCharge,
                      wastageCharges,
                      newOtherCharges
                    );
                  }}
                  className="w-full p-2 rounded border"
                /> */}
                {/* <input
                  name="otherCharge"
                  value={productDetails.otherCharge || ""}
                  type="number"
                  onChange={(e) => {
                    const newOtherCharges = Number(e.target.value);
                    setOtherCharges(newOtherCharges);
                    updateTotal(
                      making,
                      netWt,
                      pcss,
                      makingInRsCharge,
                      hallmarksCharge,
                      wastageCharges,
                      newOtherCharges
                    );
                    setProductDetails({
                      ...productDetails,
                      otherCharge: e.target.value, // ✅ Keep the input value updated
                    });
                  }}
                  className="w-full p-2 rounded border"
                /> */}

                <input
                  name="otherCharge"
                  value={productDetails.otherCharge ?? ""}
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => {
                    const newOtherCharges = Number(e.target.value);
                    setOtherCharges(newOtherCharges);
                    updateTotal(
                      making,
                      netWt,
                      pcss,
                      makingInRsCharge,
                      hallmarksCharge,
                      wastageCharges,
                      newOtherCharges
                    );
                    setProductDetails({
                      ...productDetails,
                      otherCharge: newOtherCharges, // store as number for consistency
                    });
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
              <div className="flex flex-col justify-center items-center rounded-sm">
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
                      placeholder="Customer ID"
                      className="flex-1 hidden border border-green-500 rounded-md p-4 text-sm focus:ring focus:ring-green-300 focus:outline-none"
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

                  {/* Order Details check on orderID */}

                  <div className="flex items-center space-x-2">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="adjustAmount"
                    >
                      Order No:
                    </label>
                    <input
                      type="text"
                      value={orderSearchId}
                      onChange={(e) => SetOrderSearchId(e.target.value)}
                      placeholder="Type Order No: then press enter"
                      className="flex-1 border border-green-500 rounded-md p-4 text-sm focus:ring focus:ring-green-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSearchOrder}
                      className="bg-green-500 p-2 rounded-full text-white shadow-md hover:bg-green-600"
                    >
                      <IoIosSearch />
                    </button>
                  </div>

                  {/* order details get after api got */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label
                        className="block text-xs font-medium text-gray-700 mb-1"
                        htmlFor="adjustAmount"
                      >
                        Deposit Material Amt
                      </label>
                      <input
                        id="adjustAmount"
                        type="text"
                        readOnly
                        value={orderDetails.AdjustAmount || "0"}
                        onChange={(e) =>
                          setOrderDetails((prev) => ({
                            ...prev,
                            AdjustAmount: e.target.value,
                          }))
                        }
                        // placeholder="Enter Adjust Amount"
                        className="w-full border items-center border-green-500 rounded-md p-4 text-xs focus:ring focus:ring-green-300 focus:outline-none"
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        className="block text-xs font-medium text-gray-700 mb-1"
                        htmlFor="advanceAmount"
                      >
                        Advance Amt
                      </label>
                      <input
                        id="advanceAmount"
                        type="text"
                        readOnly
                        value={orderDetails.AdvanceAmount || "0"}
                        onChange={(e) =>
                          setOrderDetails((prev) => ({
                            ...prev,
                            AdvanceAmount: e.target.value,
                          }))
                        }
                        // placeholder="Enter Advance Amount"
                        className="w-full border items-center border-green-500 rounded-md p-4 text-xs focus:ring focus:ring-green-300 focus:outline-none"
                      />
                    </div>
                    {orderDetails.depositeMaterial && (
                      <div className="flex flex-col">
                        <div className="block text-xs font-medium text-gray-700 mb-1">
                          Deposit Material(g)
                        </div>
                        <div className="w-full border border-green-500 items-center rounded-md p-4 text-xs focus:ring focus:ring-green-300 focus:outline-none">
                          {orderDetails?.depositeMaterial}
                        </div>
                      </div>
                    )}
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
                <div className="bg-white  rounded-lg p-6">
                  {/* Available Loyalty Points */}
                  <div className="flex justify-between items-center border-b pb-3 mb-3 hidden">
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
                  {/* {gto >= loyaltyData.min_invcValue_needed_toStartRedemp ? (
                    <div className=" hidden flex justify-between items-center border-b pb-3 mb-3">
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

                  <div className="flex justify-between items-center mt-4"></div>
                  {advanceMoney > 0 && (
                    <div className="flex justify-between items-center mt-4">
                      <h1 className="text-lg font-semibold text-gray-700">
                        Advance Amount:
                      </h1>
                      <p className="text-lg font-bold text-gray-900">
                        {/* {redeemData && redeemData.length > 0
                        ? finalGto.toFixed(2)
                        : "Loading..."} */}
                        {advanceMoney}
                      </p>
                    </div>
                  )}

                  {adjustAmount > 0 && (
                    <div className="flex justify-between items-center mt-4">
                      <h1 className="text-lg font-semibold text-gray-700">
                        Adjust Amount:
                      </h1>
                      <p className="text-lg font-bold text-gray-900">
                        {/* {redeemData && redeemData.length > 0
                        ? finalGto.toFixed(2)
                        : "Loading..."} */}
                        {adjustAmount}
                      </p>
                    </div>
                  )}
                </div>
                {/* Final Payable Amount */}
                <div className="flex justify-between items-center mt-2 mb-4">
                  <h1 className="text-lg font-=bold text-black">
                    Final Payable Amount:
                  </h1>
                  <p className="text-lg font-bold text-black">
                    {/* {redeemData && redeemData.length > 0
                        ? finalGto.toFixed(2)
                        : "Loading..."} */}
                    {/* {finalGto.toFixed(2)} */}
                    {/*  {finalGto-Number(advanceMoney) - Number(adjustAmount)} */}
                    {Math.round(
                      gto - Number(advanceMoney) - Number(adjustAmount)
                    )}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-bold">
                      Select Payment Method
                    </label>
                    <div className="flex space-x-2">
                      {["cash", "card", "upi", "advance", "others"].map(
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
                        onWheel={(e) => e.target.blur()}
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
                        onWheel={(e) => e.target.blur()}
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
                        onWheel={(e) => e.target.blur()}
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
                        onWheel={(e) => e.target.blur()}
                        value={upiAmount}
                        onChange={(e) => setUpiAmount(Number(e.target.value))}
                        className="w-full p-2 rounded border"
                      />
                    </div>
                  )}

                  {paymentMethod === "advance" && (
                    <div>
                      <label>UPI Amount</label>
                      <input
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        value={payAdvance}
                        onChange={(e) => SetpayAdvance(Number(e.target.value))}
                        className="w-full p-2 rounded border"
                      />
                    </div>
                  )}

                  {paymentMethod === "others" && (
                    <div>
                      <label>Other method</label>
                      <input
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        value={otherAmount}
                        onChange={(e) => setOtherAmount(Number(e.target.value))}
                        className="w-full p-2 rounded border"
                      />
                    </div>
                  )}

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
                    {/* <p className="text-red-500 font-bold">
                      Remaining Amount: ₹{remainingAmount}
                    </p> */}
                    <p className="text-red-500 font-bold">
                      Remaining Amount: ₹{Number(remainingAmount).toFixed(3)}
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
                    <p>Others: ₹{cashAmount}</p>
                  </div>

                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => {
                        setModalStep(1);
                      }}
                      className="w-1/2 bg-gray-500 text-white p-2 rounded"
                    >
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

      {/* <Modal
        open={isFormVisible}
        onClose={handleCloseModal}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
        modalType="create"
      >
       
        <CustomerModal
   open={isFormVisible}
   onClose={handleCloseModal}
        />
        hello
      </Modal> */}

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

      {/* <Customers/> */}
    </div>
  );
}
