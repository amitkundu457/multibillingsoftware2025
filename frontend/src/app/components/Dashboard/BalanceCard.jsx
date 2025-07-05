 "use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { displayCoin } from "../config";
import RechargeUI from "../../(admin)/recharge/page";
import axios from 'axios';
import useSWR from "swr";
import { useCookies } from "react-cookie";

import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

export default function BalanceCard({ label }) {

  const [itemcoin, setItemscoin] = useState(0); // State for coin balance
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for balance 0
  const [rechargeModel, setRechargeModel] = useState(false); // Modal for recharge UI
  const [totalOrder, setTotalOrder] = useState(0);
  const [thisMonthOrder, setThisMonthOrder] = useState(0);
  const [lastRecharge,setLastRecharge] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies();
  //add for dynamic url
  const {
    data: user,
    isLoading,
    mutate,
  } = useSWR(`/auth/agme`, async () => {
    let res = await axios.get("/auth/agme", {
      headers: { Authorization: `Bearer ${cookies.access_token}` },
    });
    return res.data;
  });

  
  const roleToUrlMap = {
    admin: "admin",
    jwellery: "jwellery",
    distributor: "distributor",
    resturant: "resturant",
    saloon: "saloon",
  };

  const productUrl = roleToUrlMap[!isLoading && user?.roles?.[0]?.name] || "";
  console.log("pruddcturl2",productUrl);






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






  const fetchItemsCoin = async () => {
    try {
      setLoading(true);
      const response = await displayCoin(); // Assume this function is defined elsewhere
      console.log(response.data.total_coins);
      setItemscoin(response.data.total_coins);
      setLastRecharge(response.data.last_recharge_date);


      if (response.data.total_coins === 0) {
        setIsModalOpen(true); // Open balance warning modal
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const fetchOrderCount = async () =>{
  //  const response = await axios.get('https://api.equi.co.in/api/order');
  //  setTotalOrder(response.data.total_orders);
  //  setThisMonthOrder(response.data.this_month_orders);

  // }
  // orderinvoice

  const fetchOrderCount = async () =>{
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    const response = await axios.get('https://api.equi.co.in/api/orderinvoice',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTotalOrder(response.data.total_orders);
    setThisMonthOrder(response.data.this_month_orders);
 
   }
  


  useEffect(() => {
    fetchItemsCoin(); // Fetch coins when the component is mounted
    fetchOrderCount();
   }, []);

  // Handle the "Recharge" button click
  const handleRechargeClick = () => {
    if (itemcoin === 0) {
      setIsModalOpen(false); // Close the balance warning modal
      setRechargeModel(true); // Open the recharge UI modal
    } else {
      // Handle any other logic if coins are not 0
      console.log("Coins are sufficient, continue using the app");
    }
  };

  return (
    <div className={`relative p-4 bg-white shadow-md rounded-lg border border-gray-200 ${itemcoin === 0 ? "pointer-events-none opacity-50" : ""}`}>
      
      {/* Modal for Recharge Alert */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        center 
        showCloseIcon={false} 
        closeOnOverlayClick={false} // Prevent modal from closing when clicking outside
      >
        <h2 className="text-xl font-semibold text-red-600">Low Balance!</h2>
        <p className="text-gray-700">You have 0 coins. Please recharge to continue.</p>
        <div className="mt-4">
          <button
            onClick={handleRechargeClick}
            className="bg-blue-600 p-2 rounded text-white"
          >
            Recharge
          </button>
        </div>
      </Modal>

      {/* Modal for Recharge UI */}
      <Modal
        open={rechargeModel}
        onClose={() => setRechargeModel(false)}
        center
        showCloseIcon={false}
        closeOnOverlayClick={false} // Prevent modal from closing when clicking outside
      >
        <RechargeUI />
      </Modal>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-yellow-500 text-2xl">💰</div>
          <h2 className="text-lg font-semibold ml-2">{label ? label : "Balance"}</h2>
        </div>
        <div className="flex space-x-2">
          <div className="text-orange-600 text-3xl font-bold">
            {loading ? "Loading..." : itemcoin}
            <Link 
          href="/recharge" 
          className="bg-blue-600 p-2 rounded text-white"
        >
          Recharge
        </Link> 
          </div>
        </div>
      </div>
{/* ///jwellery/reports/billwise/ */}
      <div className="mt-2 grid grid-cols-3 gap-4 border-2 border-blue-500 rounded-lg p-10">
        <div>
         <a href={`/${productUrl}/reports/billwise`} className="cursor-pointer  " >
         <h3 className="text-sm text-gray-500 hover:text-green-700">Total Invoice</h3>
         <p className="text-purple-600 text-lg font-bold ">{totalOrder}</p>
         </a>
        </div>
        <div>
        <a href={`/${productUrl}/reports/billwise`} className="cursor-pointer  " >
        <h3 className="text-sm text-gray-500 hover:text-green-700">This Month</h3>
          <p className="text-blue-600 text-lg font-bold">{thisMonthOrder}</p>
        </a>
          
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Last Recharge Date</h3>
          <p className="text-teal-600 text-lg font-bold">{lastRecharge}</p>
        </div>
      </div>
    </div>
  );
}
