import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Import axios
import useSWR from "swr";
import Link from "next/link";
import { useCookies } from "react-cookie";

import { IoMdNotificationsOff } from "react-icons/io";

export default function Reminder_And_FollowUp({ label }) {
    const [loading, setLoading] = useState(true); // Loading state
      const [cookies, setCookie, removeCookie] = useCookies();
    


  const [count, setCount] = useState({
    today_reminders: 0,
    today_followups: 0,
  });


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


  useEffect(() => {
    async function fetchCounts() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/reminder-follow-up/today-counts"
        );
        setCount(response.data);
      } catch (error) {
        console.error("Error fetching reminder & follow-up counts:", error);
      }
    }

    fetchCounts();
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-yellow-500 text-2xl">
            <IoMdNotificationsOff />
          </div>
          <h2 className="text-lg font-semibold ml-2">
            {label ? label : "Reminder & FollowUp"}
          </h2>
        </div>
      </div>

      {/* Counts Section */}
      <div className="mt-2 border-2 border-blue-500 rounded-lg p-5">
        {/* Today Reminder */}
        <div className="flex justify-between mb-2">
          <Link href={`/${productUrl}/followup`} className="cursor-pointer  ">
            <h3 className="text-gray-600 text- font-bold   hover:text-green-500">Today Reminder</h3>
          <p className="text-blue-600 text-lg font-bold">
            {count.today_reminders}
          </p>
          
          </Link>
        
        </div>

        {/* Today Follow-up */}
        <div className="flex justify-between">
          <Link href={`/${productUrl}/followup/`}>
           <h3 className="text-purple-600 text-lg font-bold  hover:text-green-500">Today Follow-up</h3>
          <p className="text-teal-600 text-lg font-bold">
          {count.today_follow_ups || 0}
          </p>
          </Link>
         
        </div>
      </div>
    </div>
  );
}
