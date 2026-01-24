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
  const [searchItem, setSearchItem] = useState("");

  const [addedProducts, setAddedProducts] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [coin, setItemscoin] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [redeemData, setRedeemData] = useState([]);
  const [company, setCompany] = useState([]);
  const [category, setCategory] = useState([]);
  const [making, setMaking] = useState(null);
  const [isDiscModalOpen, setDiscModalOpen] = useState(false);
  const [isRSModalOpen, setIsRSModalOpen] = useState(false);
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
  const [rupeeOverAllsDiscount, setRupeesOverAllDiscount] = useState(0);
  const [reward, setReward] = useState(null);
  const [netWt, setNtWt] = useState(null);
  const [pcss, setPcs] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [gtoAfterMemshipDisc, setGtoAfterMemshipDisc] = useState(null);
  const [filterType, setFilterType] = useState("All"); // All | Product | Service

  //customer seting
  const [customerFound, setCustomerFound] = useState(false);
  //loylaty point here
  // Customer loyalty total points
  const [newRedeemPoints, setNewRedeemPoints] = useState(0);

  // Loyalty stages list (stage_one, stage_two, stage_three)
  const [newStages, setNewStages] = useState([]);

  // Selected loyalty stage (only one allowed)
  const [newSelectedStage, setNewSelectedStage] = useState(null);

  // Cashback amount applied from loyalty stage
  const [newLoyaltyDiscount, setNewLoyaltyDiscount] = useState(0);

  const [rupyapoints, setRupyaPoints] = useState(0);

  // const handleNewStageSelect = (stage) => {
  //   setNewSelectedStage(stage);
  //   setNewLoyaltyDiscount(stage.cashback);
  // };

  useEffect(() => {
    if (phoneNumber.length === 10) {
      fetchCustomerByPhone();
    }
  }, [phoneNumber]);

  const handleNewStageSelect = (stage) => {
    // Agar same stage dubara click hua → UNSELECT
    if (newSelectedStage?.id === stage.id) {
      setNewSelectedStage(null);
      setNewLoyaltyDiscount(0);
      setRupyaPoints(0);
      return;
    }
    console.log("stage select", stage);
    // Naya stage select
    setNewSelectedStage(stage);
    setNewLoyaltyDiscount(stage.cashback);
    setRupyaPoints(stage?.set_loyalty_points);
  };

  // const [customerDetails, setCustomerDetails] = useState({
  //   name: "",
  //   address: "",
  //   gstin: "",
  // });

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    gstin: "",
    email: "",
    gender: "",
    dob: "",
    anniversary: "",
    // city: "",
    // state: "",
    // country: "IN",
    // pincode: "",
    // remarke: "",
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
  const [showBarcodeNumber, setShowBarcodeNumber] = useState(false);

  const [remainingAmount, setRemainingAmount] = useState(gto);
  const [memershipDiscunt, setMemberShipDiscount] = useState(null);

  let overallDiscountAmount = 0;

  if (overallDiscount == 0) {
    overallDiscountAmount = Number(rupeeOverAllsDiscount);

    gto = gto - rupeeOverAllsDiscount;
  } else {
    overallDiscountAmount = (gto * overallDiscount) / 100;
    gto = gto - overallDiscountAmount;
  }

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
  useEffect(() => {
    axios
      .get("  https://apibrize.brizindia.com/api/redeem-setup")
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

  //filter data of product and service
  const fetchData = async (type) => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      // setLoading(true);

      // let url = ` https://apibrize.brizindia.com/api/product-service-saloon`;
      let url = ` https://apibrize.brizindia.com/api/product-service-saloon`;

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
    newLoyaltyDiscount,
    // disTotalMamerAmount
    // usingLoyaltyPoints,
  ]);

  const fetchMemberShipSaleById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `  https://apibrize.brizindia.com/api/memberships/${id}`
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
        ` https://apibrize.brizindia.com/api/packagesassign/${id}`
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

  // useEffect(() => {
  //   if (memberships.length > 0 && membDiscount) {
  //     console.log("membDiscount", membDiscount);
  //     setGtoAfterMemshipDisc(gto - (gto * membDiscount) / 100);
  //     console.log(
  //       "gto - (gto * membDiscount) / 100",
  //       gto - (gto * membDiscount) / 100
  //     );
  //   }
  // }, [memberships, membDiscount]);

  useEffect(() => {
    let amount = gto;

    // 1️⃣ Membership discount (%)
    if (memberships.length > 0 && membDiscount > 0) {
      amount = amount - (amount * membDiscount) / 100;
    }

    // 2️⃣ Loyalty cashback (₹)
    if (newLoyaltyDiscount > 0) {
      amount = amount - newLoyaltyDiscount;
    }

    // 3️⃣ Safety: negative na ho
    setGtoAfterMemshipDisc(Math.max(0, amount));
  }, [gto, memberships, membDiscount]);

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
      const response = await axios.get(
        " https://apibrize.brizindia.com/api/product-service-groups",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // const handleSearch = async () => {
  //   try {
  //     const response = await getphoneSearch(phoneNumber);
  //     console.log("phone search response", response);
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

  // const handleSearch = async () => {
  //   try {
  //     const response = await getphoneSearch(phoneNumber);
  //     const customer = response.data;

  // setCustomerDetails({
  // name: customer.name || "",
  // id: customer.id || "",
  // address: customer.address || "",
  // gstin: customer.gstNo || "",
  // });

  // setNewRedeemPoints(customer.loyalty?.[0]?.redeem_points || 0);
  // setNewStages(customer.stage || []);
  //   } catch (error) {
  //     alert("Customer not found");
  //   }
  // };

  const emptyCustomer = {
    id: "",
    name: "",
    address: "",
    gstin: "",
    email: "",
    gender: "",
    dob: "",
    anniversary: "",
  };

  const fetchCustomerByPhone = async () => {
    try {
      setLoading(true);
      const token = getCookie("access_token");
      const res = await getphoneSearch(phoneNumber);
      // const res = await axios.get(
      //   `https://apibrize.brizindia.com/api/customers?phone=${phoneNumber}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      const customer = res.data;
      setNewRedeemPoints(customer.loyalty?.[0]?.redeem_points || 0);
      setNewStages(customer.stage || []);
      console.log("custormer fetch", res.data);
      if (res.data) {
        setCustomerDetails({
          name: res.data.name || "",
          address: res.data.address || "",
          gstin: res.data.gstNo || "",
          email: res.data.email || "",
          gender: res.data.gender || "",
          dob: res.data.dob || "",
          id: customer.id || "",
          anniversary: res.data.anniversary || "",
          // city: res.data.city || "",
          // state: res.data.state || "",
          // country: res.data.country || "IN",
          // pincode: res.data.pincode || "",
          // remarke: res.data.remarke || "",
        });

        setCustomerFound(true);
      }
    } catch (error) {
      // ❌ customer nahi mila → manual entry
      setCustomerFound(false);
      setCustomerDetails(emptyCustomer);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    const token = getCookie("access_token");

    const payload = {
      phone: phoneNumber,
      name: customerDetails.name,
      address: customerDetails.address,
      gstNo: customerDetails.gstin,
      email: customerDetails.email,
      gender: customerDetails.gender,
      dob: customerDetails.dob,
      anniversary: customerDetails.anniversary,
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
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("create customer", res);
    setCustomerDetails((prev) => ({
      ...prev,
      id: res.data.customer.user_id, // ✅ users.id (MOST IMPORTANT)
      name: res.data.user.name || "",
      address: res.data.customer.address || "",
      gstin: res.data.customer.gstNo || "",
    }));

    // setCustomerDetails(res.data.customer);
    console.log("create customer response", res);
    setCustomerFound(true);
  };

  //get Redeem data

  // useEffect(() => {
  //   if (customerDetails.id) {
  //     axios
  //       .get(
  //         `  https://apibrize.brizindia.com/api/customer-redeem-point/${customerDetails.id}`
  //       )
  //       .then((response) => {
  //         if (response.data && Array.isArray(response.data)) {
  //           setRedeemData(response.data);
  //           console.log("redeem data", response.data);
  //         } else {
  //           setRedeemData([]); // Set to empty array if no data
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, [customerDetails.id]);

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
  console.log("items data", redeemData);
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
  }, [selectedCategory, items, barcode]);

  const fetchItems = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      // const response = await getProductService();
      const response = await axios.get(
        " https://apibrize.brizindia.com/api/product-and-service",
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

  useEffect(() => {
    const selectedSearchItem = items.filter((item) =>
      item.name.toLowerCase().includes(searchItem.toLowerCase())
    );
    setFilteredItems(selectedSearchItem);
  }, [searchItem]);

  // const fetchEmployees = async () => {
  //   const res = await axios.get("  https://apibrize.brizindia.com/api/employees");
  //   setSalesperson(res.data.employees);
  // };

  const fetchStylist = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    const res = await axios.get(
      "  https://apibrize.brizindia.com/api/stylists",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setStylist(res.data);
  };

  const fetchPrintStatus = async () => {
    const res = await axios.get(
      "  https://apibrize.brizindia.com/api/print-status"
    );
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
    const matchingProduct = items.find((p) => p.id == item.id);
    console.log("matching   prodcuts", matchingProduct);

    if (
      item.pro_ser_type === "Product" &&
      matchingProduct?.current_stock <= 0
    ) {
      toast.error("Out of Stock: This product is currently unavailable");
      return;
    } else {
      setSelectedItem(item);
      setIsOpen(true);
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
    setBarcode("");
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
      product_id: selectedItem.id,

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
    // if (!customerDetails?.id) {
    //   notyf.error(
    //     "Please ensure customer details are complete before proceeding."
    //   );
    //   return;
    // }

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
        product_id: product.product_id,
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
      //loylate code

      new_used_loyalty_stage: newSelectedStage?.category || null,
      usingLoyaltyPoints: newSelectedStage?.loyalty_balance || 0,
      new_loyalty_cashback: newLoyaltyDiscount,
      rupyapoints: rupyapoints,
    };
    console.log(payload);
    try {
      const response = await axios.post(
        " https://apibrize.brizindia.com/api/saloon-order", // Removed the space
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
      setRupeesOverAllDiscount(0);
      setTotalTax(0);
      closeCheckout();
      setCustomerDetails(emptyCustomer);
      setPhoneNumber("");
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
    console.log("customerId, points", customerId, points);
    if (points <= 0) {
      console.warn("No redeem points to add.");
      return; // Skip API call if points are zero or negative
    }

    try {
      const response = await axios.put(
        `  https://apibrize.brizindia.com/api/customer-redeem-point/${customerId}`,
        { customer_id: customerId, redeem_points: points } // Ensure both values are sent
      );
      console.log("customer_id", response);
    } catch (error) {
      console.error("Failed to store redeem points:", error);
      notyf.error("Failed to update reward points.");
    }
  };

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

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col h-full overflow-auto bg-white">
      <div className="p-3 text-center text-white bg-green-700">
        Invoice
        {/* <button className="text-lg text-white">
          <span>&larr;</span>
        </button> */}
        {/* <span className="text-lg font-semibold">Invoice</span> */}
      </div>
      <div className="flex items-center justify-between p-2 text-white bg-white-700">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <button className="text-lg text-white">
            <span>&larr;</span>
          </button>
          {/* <span className="text-lg font-semibold">Invoice</span> */}
        </div>

        {/* Middle Section */}
        <div className="flex items-center p-3 space-x-4 text-black bg-white rounded-md shadow">
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

          <Link
            href="/saloon/reports/billreport/"
            className="flex flex-col items-center text-blue-600"
          >
            <VscReport size={20} />
            <span className="text-xs">Report</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <div className="text-sm text-white">
            {/* <div>
              Line: <span className="font-semibold">0</span>
            </div> */}
            {/* <div>
              Pcs: <span className="font-semibold">0</span>
            </div> */}
          </div>
          <button
            className="px-2 py-1 text-sm text-white bg-green-500 rounded"
            onClick={() => setDiscModalOpen(true)}
          >
            % Disc
          </button>
          <button
            className="px-2 py-1 text-sm text-white bg-green-500 rounded"
            onClick={() => setIsRSModalOpen(true)}
          >
            ₹ Disc
          </button>
          {/* <button className="flex items-center px-4 py-1 space-x-1 text-white bg-orange-500 rounded">
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
              className="p-4 text-black bg-white rounded shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="p-2 text-center text-white bg-green-600">
                Overall Discount %
              </h2>
              <div className="p-4">
                <label>Disc%</label>
                <input
                  type="text"
                  value={overallDiscount}
                  onChange={(e) => setOverallDiscount(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                  defaultValue="0"
                />

                <button
                  className="w-full px-4 py-2 text-white bg-green-500 rounded"
                  onClick={() => setDiscModalOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
        {isRSModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={() => setDiscModalOpen(false)}
          >
            <div
              className="p-4 text-black bg-white rounded shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="p-2 text-center text-white bg-green-600">
                Rupees Overall Discount
              </h2>
              <div className="p-4">
                <label>₹ disc.</label>
                <input
                  type="text"
                  value={rupeeOverAllsDiscount}
                  onChange={(e) => setRupeesOverAllDiscount(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                  defaultValue="0"
                />
                {/* <label>Disc (Rs)</label>
                <input
                  type="text"
                  className="w-full p-2 mb-2 border rounded"
                  defaultValue="0"
                />
                <label>Addition (Rs)</label>
                <input
                  type="text"
                  className="w-full p-2 mb-2 border rounded"
                  defaultValue="0"
                />
                <label>Addition Detail</label>
                <textarea className="w-full p-2 mb-4 border rounded"></textarea> */}
                <button
                  className="w-full px-4 py-2 text-white bg-green-500 rounded"
                  onClick={() => setIsRSModalOpen(false)}
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
              className="p-4 text-center text-black bg-white rounded shadow-lg w-80"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 text-lg font-semibold">Are you sure?</h2>
              <div className="flex justify-center space-x-4">
                <button
                  className="px-4 py-2 text-white bg-red-500 rounded"
                  onClick={() => setConfirmModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-white bg-green-500 rounded">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="flex flex-1">
        <div className="">
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white border rounded">
            <select
              name="bill_inv"
              className="px-4 py-2 border rounded"
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
              className="px-4 py-2 border rounded"
            />

            {/* Date Picker */}
            <div className="flex items-center px-4 py-2 border rounded">
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
              className="px-4 py-2 border rounded"
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
                value={searchItem}
                placeholder="Search Item"
                onChange={(e) => {
                  setSearchItem(e.target.value);
                }}
                className="px-4 py-2 ml-2 border rounded"
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
            {/* <span>
              <span className="text-lg font-bold text-blue-950">
                {" "}
                Total Coin
              </span>
              :{" "}
              <span className="text-lg font-bold text-orange-900">{coin}</span>
            </span> */}
          </div>

          {/* //fetch product and  */}
          <div className="grid flex-1 grid-cols-7 gap-4 p-4 overflow-y-auto">
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

                  <div className="flex items-center justify-center w-full h-32 text-gray-500">
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
        <aside className="relative w-1/4 h-full p-4 bg-gray-100">
          <div className="mb-16 overflow-y-auto h-[20rem]">
            {addedProducts.map((product, index) => (
              <div key={index} className="p-2 mb-2 border rounded">
                <p className="font-bold">{product.name}</p>
                {/*<p>Code: {product.code}</p>*/}
                {/*<p className="text-sm">Gross Wgt: {product.grossWeight}</p>*/}
                <p className="text-[12px]">
                  Rate Total: ₹{productWiseTotals[index]?.rateTotal}
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
              className="w-full p-4 mt-4 text-xl font-semibold text-white bg-green-500 rounded"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Rate</label>
                <input
                  name="rate"
                  value={selectedItem.rate}
                  type="number"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label>Quantity</label>
                <input
                  name="pcss"
                  type="number"
                  value={pcss}
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
                />
              </div> */}
            </div>
            <button
              type="submit"
              className="w-full p-2 mt-4 text-white bg-green-500 rounded"
              onClick={() => setBarcode("")}
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
              <div className="flex flex-col items-center justify-center">
                <div className="flex gap-4 ">
                  {/* Product Checkbox - Orange */}

                  {/* Membership Checkbox - Blue */}
                  <label className="flex items-center mr-12 space-x-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-blue-600">
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
                    <span className="font-medium text-green-600">Package</span>
                  </label>
                </div>
                {customerFound && (
                  <span className="text-sm text-green-600">
                    Existing Customer
                  </span>
                )}

                <form
                  className="w-full p-4 space-y-4 bg-white rounded-md shadow-md"
                  onSubmit={handleNextStep}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={phoneNumber}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setPhoneNumber(value);
                      }}
                      placeholder="Phone Number"
                      className="flex-1 p-4 text-sm border border-green-500 rounded-md"
                    />

                    <button
                      type="button"
                      onClick={handleOpenModal}
                      className="p-3 text-white bg-green-500 rounded-full hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>

                  {/* Customer Status */}
                  {customerFound !== null && (
                    <p
                      className={`text-sm font-semibold ${
                        customerFound ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {customerFound ? "Existing Customer" : "New Customer"}
                    </p>
                  )}

                  {/* Name & ID */}
                  <div className="flex space-x-2">
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
                      className="flex-1 p-4 text-sm border border-green-500 rounded-md"
                    />
                  </div>

                  {/* Email */}
                  <input
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) =>
                      setCustomerDetails((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Email"
                    className="w-full p-4 text-sm border border-green-500 rounded-md"
                  />

                  {/* Gender */}
                  <select
                    value={customerDetails.gender}
                    onChange={(e) =>
                      setCustomerDetails((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-full p-4 text-sm border border-green-500 rounded-md"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>

                  <div className="flex space-x-4">
                    {/* DOB */}
                    <div className="flex-1">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={customerDetails.dob}
                        onChange={(e) =>
                          setCustomerDetails((prev) => ({
                            ...prev,
                            dob: e.target.value,
                          }))
                        }
                        className="w-full p-4 text-sm border border-green-500 rounded-md focus:ring focus:ring-green-300"
                      />
                    </div>

                    {/* Anniversary */}
                    <div className="flex-1">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Anniversary Date
                      </label>
                      <input
                        type="date"
                        value={customerDetails.anniversary}
                        onChange={(e) =>
                          setCustomerDetails((prev) => ({
                            ...prev,
                            anniversary: e.target.value,
                          }))
                        }
                        className="w-full p-4 text-sm border border-green-500 rounded-md focus:ring focus:ring-green-300"
                      />
                    </div>
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
                    rows={2}
                    className="w-full p-3 text-sm border border-green-500 rounded-md"
                  />

                  {/* GSTIN */}
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
                    className="w-full p-4 text-sm border border-green-500 rounded-md"
                  />

                  {loading && <p>Loading memberships...</p>}

                  {memberships && memberships.length >= 0 ? (
                    <ul className="p-4 mt-4 bg-gray-100 border rounded-lg shadow-md">
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
                            className="p-4 mb-3 bg-white border-b rounded-lg shadow-sm last:border-none"
                          >
                            <h3 className="mb-2 text-lg font-semibold text-green-600">
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
                    <p className="mt-2 font-semibold text-center text-red-500">
                      No memberships found.
                    </p>
                  )}

                  {/* pakageList */}
                  {loading && <p>Loading Package List...</p>}

                  {pakageList && pakageList.length >= 0 ? (
                    <ul className="p-4 mt-4 bg-gray-100 border rounded-lg shadow-md">
                      {pakageList.map((membership) => {
                        return (
                          <li
                            key={membership.id}
                            className="p-4 mb-3 bg-white border-b rounded-lg shadow-sm last:border-none"
                          >
                            <h3 className="mb-2 text-lg font-semibold text-green-600">
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
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-2 font-semibold text-center text-red-500">
                      No Package found.
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={closeCheckout}
                      className="px-4 py-2 text-white bg-green-500 rounded-md shadow-md hover:bg-green-600"
                    >
                      Cancel
                    </button>
                    {/* <button
                      type="submit"
                      className="px-4 py-2 text-white bg-green-500 rounded-md shadow-md hover:bg-green-600"
                    >
                      Next
                    </button> */}
                    <button
                      type="button"
                      onClick={
                        customerFound ? handleNextStep : handleCreateCustomer
                      }
                      className="px-4 py-2 text-white bg-green-500 rounded-md shadow-md hover:bg-green-600"
                    >
                      {customerFound ? "Next" : "Save Customer"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          {modalStep === 2 && (
            <>
              <div className="p-4 bg-white rounded shadow">
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
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

                  {/* add news ui */}
                  <div className="mt-4 space-y-3">
                    <div className="p-4 mt-4 rounded bg-blue-50">
                      <p className="font-semibold text-blue-700">
                        Available Loyalty Points: {newRedeemPoints}
                      </p>
                    </div>

                    <h3 className="text-lg font-bold">Redeem Loyalty</h3>

                    {newStages.map((stage) => {
                      const eligible = newRedeemPoints >= stage.loyalty_balance;

                      return (
                        <div
                          key={stage.id}
                          className={`flex justify-between items-center p-3 border rounded 
        ${eligible ? "bg-green-50" : "bg-gray-100 opacity-60"}`}
                        >
                          <div>
                            <p className="font-semibold capitalize">
                              {stage.category.replace("_", " ")}
                            </p>
                            <p className="text-sm">
                              Required Points: {stage.loyalty_balance}
                            </p>
                            <p className="text-sm text-green-700">
                              Cashback: ₹{stage.cashback}
                            </p>
                          </div>

                          <input
                            type="checkbox"
                            disabled={!eligible}
                            checked={newSelectedStage?.id === stage.id}
                            onChange={() => handleNewStageSelect(stage)}
                            className="w-5 h-5"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {newSelectedStage && (
                    <div className="p-3 mt-4 bg-green-100 rounded">
                      <p className="font-semibold text-green-800">
                        Loyalty Applied: {newSelectedStage.category}
                      </p>
                      <p>Cashback: ₹{newLoyaltyDiscount}</p>
                    </div>
                  )}

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
                        className="w-full p-2 border rounded"
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
                        className="w-full p-2 border rounded"
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
                        className="w-full p-2 mt-2 border rounded"
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
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-red-500">
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

                  <div className="flex mt-4 space-x-4">
                    <button className="w-1/2 p-2 text-white bg-gray-500 rounded">
                      Back
                    </button>
                    <button
                      className="w-1/2 p-2 text-white bg-green-500 rounded"
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
