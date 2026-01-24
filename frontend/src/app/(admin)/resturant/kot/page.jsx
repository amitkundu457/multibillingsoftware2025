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
import { MdTableBar } from "react-icons/md";
import { MdOutlineTableBar } from "react-icons/md"; // Material Icons (restaurant-specific)
import { LuRefreshCcw } from "react-icons/lu";

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
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
      <p className="text-xl font-semibold">{name}</p>
      <p className="text-lg text-green-600">₹{price}</p>
      <p className="text-sm text-gray-500">Quantity: {quantity}</p>
      <div className="flex items-center mt-2 space-x-2">
        <button
          onClick={onDecrease}
          className="text-lg font-semibold text-blue-500"
        ></button>
        <span className="text-xl font-bold">{quantity}</span>
        <button
          onClick={onIncrease}
          className="text-lg font-semibold text-blue-500"
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
  const [grandTotalOfFamily, setGrandTotalOfFamily] = useState(0);
  const [paymentInputsOfFamily, setPaymentInputsOfFamily] = useState([]);
  const paymentOptionsOfFamily = ["Cash", "UPI", "Card", "Others"];

  const [parcelOrderDetails, setParcelOrderDetails] = useState(null);
  const [itemsCategory, setItemsCategory] = useState([]);

  const [paymentInputs, setPaymentInputs] = useState([]);
  const paymentOptions = ["Cash", "UPI", "Card", "Others"];

  //this for parcel billing as loylaty
  const [parcelStages, setParcelStages] = useState([]);
  const [selectedParcelStage, setSelectedParcelStage] = useState(null);
  const [parcelAppliedCashback, setParcelAppliedCashback] = useState(0);
  const [parcelPayableAmount, setParcelPayableAmount] = useState(0);

  //for loylaty state
  const [bookingData, setBookingData] = useState(null);
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);

  const [appliedCashback, setAppliedCashback] = useState(0);

  const payableAmountOfFamily = Math.max(
    grandTotalOfFamily - appliedCashback,
    0
  );
  const updatePaymentInput = (index, field, value) => {
    const updated = [...paymentInputs];
    updated[index][field] = value;
    setPaymentInputs(updated);
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

  // const handleParcelSearchOrder = async () => {
  //   const token = getCookie("access_token");

  //   if (!parcelOrderId) {
  //     alert("Please enter the parcel order ID");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       ` https://apibrize.brizindia.com/api/parcel-order/${parcelOrderId}/grand-total`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("data parcel", data);
  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to fetch bill.");
  //     }

  //     setParcelOrderDetails(data.data);
  //     setParcelStages(data.data.stage || []);

  //     const grandTotal = Number(data.data.grand_total || 0);
  //     setParcelPayableAmount(grandTotal);

  //     setParcelOrderDetails(data); // Save API response in state
  //   } catch (error) {
  //     console.error("Error fetching parcel order bill:", error);
  //     alert("Failed to fetch parcel order bill. Please check the Order ID.");
  //   }
  // };

  const handleParcelSearchOrder = async () => {
    const token = getCookie("access_token");

    if (!parcelOrderId) {
      alert("Please enter the parcel order ID");
      return;
    }

    try {
      const response = await fetch(
        `https://apibrize.brizindia.com/api/parcel-order/${parcelOrderId}/grand-total`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("parcel api response", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bill.");
      }

      // ✅ CORRECT STRUCTURE
      setParcelOrderDetails(data); // full response
      setParcelStages(data.stage || []); // loyalty stages

      const grandTotal = Number(data.grand_total || 0);
      setParcelPayableAmount(grandTotal);
      setParcelAppliedCashback(0);
      setSelectedParcelStage(null);
    } catch (error) {
      console.error("Error fetching parcel order bill:", error);
      alert("Failed to fetch parcel order bill. Please check the Order ID.");
    }
  };

  const parcelRedeemPoints =
    parcelOrderDetails?.order?.user?.redeem_points?.redeem_points || 0;

  const accessibleParcelStages = parcelStages.filter(
    (stage) => parcelRedeemPoints >= stage.loyalty_balance
  );
  // useEffect(() => {
  //   if (!parcelOrderDetails) {
  //     setParcelPayableAmount(0);
  //     setRemainingAmount(0);
  //   }
  // }, [parcelOrderDetails]);

  const handleParcelStageToggle = (stage) => {
    if (selectedParcelStage?.id === stage.id) {
      setSelectedParcelStage(null);
      setParcelAppliedCashback(0);
      setParcelPayableAmount(parcelOrderDetails.grand_total);
    } else {
      setSelectedParcelStage(stage);
      setParcelAppliedCashback(stage.cashback);

      const payable = Math.max(
        parcelOrderDetails.grand_total - stage.cashback,
        0
      );
      setParcelPayableAmount(payable);
    }
  };

  // const submitParcelPayment = async () => {
  //   const token = getCookie("access_token");

  //   if (!parcelOrderId) {
  //     alert("Parcel Order ID is missing.");
  //     return;
  //   }

  //   // if (
  //   //   !paymentInputs.length ||
  //   //   paymentInputs.some((p) => !p.mode || !p.amount)
  //   // ) {
  //   //   alert("Please fill in all payment fields correctly.");
  //   //   return;
  //   // }

  //   try {
  //     const response = await fetch(
  //       ` https://apibrize.brizindia.com/api/parcel-payments`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           order_id: parcelOrderId,
  //           payments: paymentInputs.map((payment) => ({
  //             payment_mode: payment.mode,
  //             amount: parseFloat(payment.amount),
  //           })),
  //         }),
  //       }
  //     );
  //     console.log("response", response);
  //     alert("✅ Payment submitted successfully!");

  //     const result = await response.json();

  //     if (response.status == 200) {
  //       setParcelOrderId(""); // Clear parcel order ID
  //       setPaymentInputs([]); // Clear payment inputs
  //       setParcelOrderDetails(null); // Clear order details
  //       GenerateParcelBillFunction();
  //       setIsParcelBillModalOpen(false);
  //       // Optionally reset state
  //     } else if (response.status === 409) {
  //       alert("⚠️ Payment is already completed for this order.");
  //     } else if (response.status === 422) {
  //       alert(
  //         result.error ||
  //           "⚠️ Payment validation failed. Please check amounts and methods."
  //       );
  //     } else {
  //       alert(result.message || "❌ Payment submission failed.");
  //     }
  //   } catch (error) {
  //     console.error("Payment submission error:", error);
  //     alert("❌ An error occurred while submitting the payment.");
  //   }
  // };
  const submitParcelPayment = async () => {
    const token = getCookie("access_token");

    if (!parcelOrderId) {
      alert("Parcel Order ID is missing.");
      return;
    }

    // ✅ Loyalty selected or not
    const isUsingLoyalty = !!selectedParcelStage;

    try {
      const payload = {
        order_id: parcelOrderId,

        // 🔹 Payments (can be empty)
        payments: paymentInputs.map((payment) => ({
          payment_mode: payment.mode,
          amount: Number(payment.amount || 0),
        })),
        customer_id:
          parcelOrderDetails?.order?.user?.redeem_points?.customer_id ||
          parcelOrderDetails?.order?.customer_id,

        // 🔹 Loyalty fields (IMPORTANT CHANGE)
        usingLoyaltyPoints: isUsingLoyalty
          ? Number(selectedParcelStage?.loyalty_balance) // 👈 THIS
          : 0,

        new_used_loyalty_stage: isUsingLoyalty
          ? selectedParcelStage?.category // or category if backend wants
          : null,

        new_loyalty_cashback: isUsingLoyalty
          ? Number(parcelAppliedCashback || selectedParcelStage?.cashback || 0)
          : 0,
        parceltotalAmount: parcelPayableAmount || 0,
        rupyaPoints: selectedParcelStage?.set_loyalty_points || 0,
      };

      console.log("📦 Parcel Payment Payload:", payload);

      const response = await fetch(
        "https://apibrize.brizindia.com/api/parcel-payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        alert("✅ Payment submitted successfully!");

        // 🔄 Reset
        setParcelOrderId("");
        setPaymentInputs([]);
        setParcelOrderDetails(null);
        setSelectedParcelStage(null);
        setParcelAppliedCashback(0);
        setIsParcelBillModalOpen(false);

        GenerateParcelBillFunction();
      } else if (response.status === 409) {
        alert("⚠️ Payment is already completed for this order.");
      } else if (response.status === 422) {
        alert(result?.error || "⚠️ Validation failed.");
      } else {
        alert(result?.message || "❌ Payment submission failed.");
      }
    } catch (error) {
      console.error("❌ Payment submission error:", error);
      alert("❌ An error occurred while submitting the payment.");
    }
  };

  // Calculate total paid
  const totalPaid = paymentInputs.reduce((sum, input) => {
    const amt = parseFloat(input.amount);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  // Get grand total from parcelOrderDetails
  // const grandTotal = parseFloat(parcelOrderDetails?.grand_total || 0);
  const grandTotal = parseFloat(parcelPayableAmount || 0);

  // Remaining amount
  const remainingAmount = grandTotal - totalPaid;

  // from here start family bokoking

  useEffect(() => {
    const token = getCookie("access_token");
    if (familyBookingId) {
      fetch(
        ` https://apibrize.brizindia.com/api/family-booking-grand-total/${familyBookingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.grand_total) {
            setGrandTotalOfFamily(data.grand_total);

            setBookingData(data?.Booking);
            setStages(data?.$stage || []);
          } else {
            setGrandTotalOfFamily(0);
            setBookingData(null);
            setStages([]);
          }
        })
        .catch(() => setGrandTotalOfFamily(0));
    }
  }, [familyBookingId]);

  const updatePaymentInputOfFamily = (index, field, value) => {
    const updated = [...paymentInputsOfFamily];
    updated[index][field] = value;
    setPaymentInputsOfFamily(updated);
  };
  const redeemPoints = bookingData?.user?.redeem_points?.redeem_points || 0;
  // const accessibleStages = stages.filter(
  //   (s) => s.loyalty_balance >= redeemPoints
  // );

  const accessibleStages = stages.filter(
    (stage) => redeemPoints > stage.loyalty_balance
  );

  console.log("accessibleStages", accessibleStages);
  console.log("selectedStage", selectedStage);
  console.log("redeemPoints", redeemPoints);
  console.log("stages", stages);

  const totalPaidOfFamily = paymentInputsOfFamily.reduce(
    (sum, input) => sum + parseFloat(input.amount || 0),
    0
  );
  // const remainingOfFamily = Math.max(grandTotalOfFamily - totalPaidOfFamily, 0);
  const remainingOfFamily = Math.max(
    payableAmountOfFamily - totalPaidOfFamily,
    0
  );

  const submitFamilyBookingPayment = async () => {
    const token = getCookie("access_token");

    try {
      const payload = {
        family_booking_id: familyBookingId,
        payments: paymentInputsOfFamily.map((input) => ({
          payment_method: input.mode, // Map mode to match backend validation
          amount: parseFloat(input.amount),
        })),

        // loyalty redemption fields new add
        usingLoyaltyPoints: selectedStage?.loyalty_balance || null,
        new_used_loyalty_stage: selectedStage?.category || null,
        new_loyalty_cashback: appliedCashback,
        totalOfFamilyamount: grandTotalOfFamily || 0,
        rupyaPoints: selectedStage?.set_loyalty_points || 0,
      };
      console.log("Family Booking Payment Payload:", payload);
      const response = await axios.post(
        " https://apibrize.brizindia.com/api/family-booking-payments", // Replace with your real API route
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // If using JWT
          },
        }
      );

      console.log("Payment stored:", response.data);
      alert("Payment saved successfully!");
      setfamilyBookingId(""); // Reset family booking ID
      setPaymentInputsOfFamily([]); // Reset payment inputs
      setGrandTotalOfFamily(0); // Reset grand total
      GenerateBillFunction();
      setIsBillModalOpen(false); // close modal
    } catch (error) {
      console.error(
        "Error saving payment:",
        error.response?.data || error.message
      );

      // 🔴 Check if payment is already completed
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data?.message === "Payment already completed."
      ) {
        alert("✅ Payment has already been completed.");
      } else if (
        error.response &&
        error.response.data?.error === "Payment exceeds the bill amount."
      ) {
        alert("❌ Payment exceeds the bill amount.");
      } else {
        alert("❌ Failed to save payment.");
      }
    }
  };

  //

  const handleAddTable = async () => {
    const token = getCookie("access_token");

    if (!newTableNo.trim()) return;

    try {
      const res = await fetch(
        " https://apibrize.brizindia.com/api/kot-tables",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ table_no: newTableNo.trim() }),
        }
      );

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

  // Fetch data from API  https://apibrize.brizindia.com/api/product-and-service

  useEffect(() => {
    const token = getCookie("access_token");
    axios
      // .get("  https://apibrize.brizindia.com/api/product-services",{headers: {
      .get("  https://apibrize.brizindia.com/api/product-and-service", {
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
      const res = await axios.get(
        " https://apibrize.brizindia.com/api/kot-tables",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  //     const response =  await axios.post(' https://apibrize.brizindia.com/api/kot-orders',payload,{
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

  const handleStageToggle = (stage) => {
    // agar wahi stage already selected hai → unselect
    if (selectedStage?.id === stage.id) {
      setSelectedStage(null);
      setAppliedCashback(0);
    } else {
      // new stage select
      setSelectedStage(stage);
      setAppliedCashback(stage.cashback || 0);
    }

    // payment reset (IMPORTANT)
    setPaymentInputsOfFamily([]);
  };

  const orderProducts = async () => {
    const token = getCookie("access_token");
    console.log("product_id", selectedProduct);
    const payload = {
      table_no: selectedTable,

      items: selectedProduct.map((item) => ({
        product_id: item.id,
        product_price: item.rate,
        quantity: item.quantity,
        tax_rate: item.tax_rate,
      })),
    };

    try {
      const response = await axios.post(
        " https://apibrize.brizindia.com/api/kot-orders",
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

  const closeParcelModal = () => {
    setIsParcelBillModalOpen(false);
    setParcelOrderId("");
    setPaymentInputs([]); // Reset payment inputs
    setParcelOrderDetails(null); // Reset order details
  };

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between w-full bg-green-600 h-9">
        <div className="items-center mt-1 text-xl text-white">KOT</div>
      </header>

      {/* Category & Item Selection */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <select
          name="category"
          id="category"
          className="p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {itemsCategory.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {/* <MdOutlineRefresh
          size={24}
          className="text-blue-500 transition-transform cursor-pointer hover:rotate-90"
          title="Refresh"
        /> */}

        <button
          onClick={() => setIsParcelBillModalOpen(true)}
          className="px-4 py-2 text-white bg-green-600 rounded-lg shadow hover:bg-blue-700"
        >
          parcel order Bill
        </button>
        <button
          onClick={() => setIsBillModalOpen(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
        >
          Generate Bill
        </button>

        {/* <button
        className="px-4 py-2 text-white bg-blue-600 rounded"
        onClick={() => setShowModal(true)}
      >
        Book Table
      </button> */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setOpenDropdown((prev) => !prev)}
            className="px-4 py-2 text-white bg-blue-600 rounded"
          >
            Take Order ▾
          </button>

          {openDropdown && (
            <div className="absolute right-0 z-10 w-40 mt-2 bg-white border rounded shadow-md">
              <button
                onClick={() => {
                  setShowModal(true);
                  setOpenDropdown(false);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-blue-100"
              >
                Dine-in
              </button>
              <button
                onClick={() => {
                  setShowParcelModal(true);
                  setOpenDropdown(false);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-blue-100"
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
          <h2 className="flex items-center justify-end mb-4 text-2xl font-semibold text-gray-800">
            {/* Choose a Table */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 mr-2 font-semibold text-white transition bg-blue-600 rounded-md shadow hover:bg-blue-700"
            >
              Add Table
            </button>
            <div
              onClick={() => {
                window.location.reload();
              }}
              className="flex flex-col items-center text-blue-600 cursor-pointer"
            >
              <LuRefreshCcw size={20} />
              <span className="text-xs">Refresh</span>
            </div>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {tables.map((table) =>
              table && table.table_no ? (
                <button
                  key={table.id}
                  className={`relative flex flex-col items-center justify-center w-32 h-32 rounded-2xl shadow-lg font-semibold transition-all duration-300
        ${
          selectedTable === table.table_no
            ? "bg-gradient-to-br from-red-500 to-red-700 text-white scale-105"
            : table.status === "booked"
            ? "bg-gradient-to-br from-red-500 to-red-700 text-white"
            : table.status === "available"
            ? "bg-gradient-to-br from-green-400 to-green-600 text-white hover:scale-105"
            : "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white hover:scale-105"
        }`}
                >
                  {/* Table Icon */}
                  <MdOutlineTableBar
                    size={42}
                    className="mb-2 drop-shadow-lg"
                  />

                  {/* Table Number */}
                  <span className="text-lg tracking-wide">
                    {table.table_no}
                  </span>
                </button>
              ) : null
            )}
          </div>
        </div>
      </div>

      {isLogoutModel && <LogoutModel onClose={() => setIsLogoutModel(false)} />}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="p-6 bg-white shadow-lg rounded-xl w-96">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              Add New Table
            </h3>
            <input
              type="text"
              placeholder="Enter table number (e.g., T10)"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTableNo}
              onChange={(e) => setNewTableNo(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-800 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTable}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {isBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
            {/* 🔁 Loyalty Section */}
            {bookingData && stages.length > 0 && (
              <div className="p-3 mb-4 border border-green-300 rounded-md bg-green-50">
                <h4 className="mb-2 text-sm font-semibold text-green-700">
                  Redeem Loyalty Points
                </h4>

                {accessibleStages.length === 0 && (
                  <p className="text-xs text-red-600">
                    Not enough loyalty points for any stage
                  </p>
                )}

                {/* {accessibleStages.map((stage) => (
                  <label
                    key={stage.id}
                    className="flex items-center justify-between p-2 mb-2 bg-white border rounded cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {stage.category.replace("_", " ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        Required: {stage.loyalty_balance} pts
                      </p>
                      <p className="text-xs text-green-600">
                        Cashback: ₹{stage.cashback}
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="loyalty_stage"
                      checked={selectedStage?.id === stage.id}
                      onChange={() => setSelectedStage(stage)}
                    />
                  </label>
                ))} */}
                {/* 🔁 Loyalty Cashback Section */}
                {accessibleStages.length > 0 && (
                  <div className="p-3 mb-4 border border-green-300 rounded bg-green-50">
                    <h4 className="mb-2 text-sm font-semibold text-green-700">
                      Apply Loyalty Cashback
                    </h4>

                    {accessibleStages.map((stage) => (
                      <label
                        key={stage.id}
                        className="flex items-center justify-between p-2 mb-2 bg-white border rounded cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {stage.category.replace("_", " ")}
                          </p>
                          <p className="text-xs text-gray-500">
                            Required Points: {stage.loyalty_balance}
                          </p>
                          <p className="text-xs text-green-600">
                            Cashback: ₹{stage.cashback}
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={selectedStage?.id === stage.id}
                          onChange={() => handleStageToggle(stage)}
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <h2 className="mb-4 text-lg font-semibold">
              Enter Family Booking No.
            </h2>

            <input
              type="text"
              placeholder="Booking number"
              value={familyBookingId}
              onChange={(e) => setfamilyBookingId(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {grandTotalOfFamily > 0 && (
              <>
                <div className="mb-2 text-sm text-center">
                  <p>Bill Amount: ₹{grandTotalOfFamily.toFixed(2)}</p>

                  {appliedCashback > 0 && (
                    <p className="text-green-700">
                      Loyalty Cashback: -₹{appliedCashback}
                    </p>
                  )}

                  <p className="font-semibold">
                    Payable Amount: ₹{payableAmountOfFamily.toFixed(2)}
                  </p>
                </div>

                <div className="mb-4 text-sm text-center text-gray-700">
                  Remaining: ₹{remainingOfFamily.toFixed(2)}
                </div>

                {/* Payment Method Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {paymentOptionsOfFamily.map(
                    (method) =>
                      !paymentInputsOfFamily.some(
                        (input) => input.mode === method
                      ) && (
                        <button
                          key={method}
                          onClick={() =>
                            setPaymentInputsOfFamily((prev) => [
                              ...prev,
                              { mode: method, amount: "" },
                            ])
                          }
                          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-blue-500 hover:text-white"
                        >
                          {method}
                        </button>
                      )
                  )}
                </div>

                {/* Payment Input Fields */}
                {paymentInputsOfFamily.map((input, index) => {
                  const totalEntered = paymentInputsOfFamily.reduce(
                    (sum, item, i) =>
                      sum + (i === index ? 0 : parseFloat(item.amount || 0)),
                    0
                  );

                  // const grandTotal = parseFloat(grandTotalOfFamily || 0);
                  // const maxAllowed = Math.max(grandTotal - totalEntered, 0);
                  const grandTotal = parseFloat(payableAmountOfFamily || 0);
                  const maxAllowed = Math.max(grandTotal - totalEntered, 0);

                  return (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <span className="w-1/2 font-medium">{input.mode}</span>
                      <input
                        type="number"
                        placeholder="Amount"
                        min={0}
                        max={maxAllowed}
                        value={input.amount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          if (value <= maxAllowed) {
                            updatePaymentInputOfFamily(index, "amount", value);
                          }
                        }}
                        className="w-1/2 p-2 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  );
                })}
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsBillModalOpen(false);
                  setfamilyBookingId(""); // reset booking id
                  setGrandTotalOfFamily(0); // reset grand total
                  setPaymentInputsOfFamily([]); // reset payment inputs
                }}
                className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={submitFamilyBookingPayment}
                disabled={remainingOfFamily > 0}
                className={`px-4 py-2 rounded text-white ${
                  remainingOfFamily > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isaparcelBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl space-y-5"> */}
          <div
            className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl space-y-5
                max-h-[85vh] overflow-y-auto"
          >
            {/* <h2 className="text-xl font-bold text-red-800">
              Loylaty Not Found{" "}
            </h2> */}

            {parcelOrderDetails &&
              accessibleParcelStages.length > 0 &&
              selectedParcelStage === null && (
                <div className="p-3 mb-4 border border-green-300 rounded bg-green-50">
                  <h4 className="mb-2 text-sm font-semibold text-green-700">
                    Redeem Loyalty Cashback
                  </h4>

                  {accessibleParcelStages.map((stage) => (
                    <label
                      key={stage.id}
                      className="flex items-center justify-between p-2 mb-2 bg-white border rounded cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {stage.category.replace("_", " ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          Required Points: {stage.loyalty_balance}
                        </p>
                        <p className="text-xs text-green-600">
                          Cashback: ₹{stage.cashback}
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={selectedParcelStage?.id === stage.id}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleParcelStageToggle(stage)}
                      />
                    </label>
                  ))}
                </div>
              )}

            <h2 className="text-xl font-bold text-gray-800">
              Enter Parcel Order No.
            </h2>

            <input
              type="text"
              placeholder="Parcel Order ID"
              value={parcelOrderId}
              onChange={(e) => setParcelOrderId(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleParcelSearchOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition"
            >
              Search
            </button>

            {/* {parcelOrderDetails && (
              <div className="text-lg font-semibold text-center text-green-700">
                Bill Amount: ₹{parcelOrderDetails.grand_total}
              </div>
            )} */}

            {parcelOrderDetails && (
              <div className="mb-2 text-sm text-center">
                <p>Bill Amount: ₹{parcelOrderDetails.grand_total}</p>

                {parcelAppliedCashback > 0 && (
                  <p className="text-green-700">
                    Loyalty Cashback: -₹{parcelAppliedCashback}
                  </p>
                )}

                <p className="font-semibold">
                  Payable Amount: ₹{parcelPayableAmount}
                </p>
              </div>
            )}

            <div>
              <h3 className="mb-2 font-semibold text-gray-700">
                Select Payment Methods
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {paymentOptions.map(
                  (method) =>
                    !paymentInputs.some((input) => input.mode === method) && (
                      <button
                        key={method}
                        onClick={() =>
                          setPaymentInputs((prev) => [
                            ...prev,
                            { mode: method, amount: "" },
                          ])
                        }
                        className="bg-gray-200 hover:bg-orange-500 hover:text-white text-sm font-medium py-1.5 px-3 rounded-md"
                      >
                        {method}
                      </button>
                    )
                )}
              </div>

              {paymentInputs.map((input, index) => {
                const totalEnteredAmount = paymentInputs.reduce(
                  (sum, p, i) =>
                    sum + (i === index ? 0 : parseFloat(p.amount || 0)),
                  0
                );

                const grandTotal = parseFloat(
                  parcelOrderDetails?.grand_total || 0
                );
                const maxAllowed = Math.max(grandTotal - totalEnteredAmount, 0);

                return (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span className="w-1/2 font-medium">{input.mode}</span>
                    <input
                      type="number"
                      placeholder="Amount"
                      min={0}
                      max={maxAllowed}
                      value={input.amount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value <= maxAllowed) {
                          updatePaymentInput(index, "amount", value);
                        }
                      }}
                      className="w-1/2 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                );
              })}
            </div>

            {/* Remaining Amount Display */}
            <div className="mt-3 text-sm font-semibold text-right text-blue-600">
              Remaining: ₹{remainingAmount.toFixed(2)}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => closeParcelModal()}
                className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitParcelPayment}
                disabled={remainingAmount > 0}
                className={`px-5 py-2 rounded-md text-white ${
                  remainingAmount > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Submit
              </button>

              {/* <button
                onClick={GenerateParcelBillFunction}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Submit
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
