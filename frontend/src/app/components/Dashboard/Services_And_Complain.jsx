"use client";
import { FaThumbsUp } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Services_And_Complain({ label }) {
  const [todayDelivery, setTodayDelivery] = useState(0);
  const [totalComplain, setTotalComplain] = useState(0);
  const router = useRouter();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const token = getCookie("access_token");

  const countDelivery = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todaydelivery", {
        headers: { authorization: `Bearer ${token}` },
      });
      setTodayDelivery(response?.data);
    } catch (error) {
      console.error("Failed to fetch delivery count", error);
    }
  }, [token]);

  const countComplain = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/complain-list", {
        headers: { authorization: `Bearer ${token}` },
      });
      setTotalComplain(response?.data);
    } catch (error) {
      console.error("Failed to fetch complain count", error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }

    countDelivery();
    countComplain();
  }, [token, countDelivery, countComplain]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-yellow-500 text-2xl">
            <FaThumbsUp />
          </div>
          <h2 className="text-lg font-semibold ml-2">
            {label ? label : "Services & Complain"}
          </h2>
        </div>
      </div>

      <div className="mt-2  flex justify-between items-center sm:grid sm:grid-cols-3 sm:gap-4 border-2 border-blue-500 rounded-lg  p-4 sm:p-10">
        <div className=" flex flex-col ">
          <div className="text-purple-600 text-sm sm:text-lg sm:font-bold">Today Delivery</div>
          <div className="text-purple-600 text-sm sm:text-lg sm:font-bold">Total Complain</div>
        </div>

        {/* <div>
          <h3 className="text-sm text-gray-500"></h3>
          <p className="text-blue-600 text-lg font-bold"></p>
        </div> */}

        <div>
          <h3 className="text-teal-600  text-sm sm:text-lg sm:font-bold">
            {todayDelivery?.today_order_count > 0
              ? todayDelivery.today_order_count
              : "0"}
          </h3>
          <p className="text-teal-600  text-sm sm:text-lg sm:font-bold">
            {totalComplain?.count > 0 ? totalComplain.count : "0"}
          </p>
        </div>

        <div>
          <button
            onClick={() => router.push("/jwellery/reviewlists")}
            className="bg-red-600 hover:text-gray-300 transition-all duration-200 text-sm sm:text-lg sm:font-semibold cursor-pointer rounded-lg sm:p-2 p-1 text-center"
          >
            Complain List
          </button>
        </div>
      </div>
    </div>
  );
}
