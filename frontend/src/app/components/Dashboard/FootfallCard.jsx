"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";

export default function FootfallCard() {
  const [todayOrders, setTodayOrders] = useState(0);
  const [repeatCustomers, setRepeatCustomers] = useState(0);
  const [todayEnquiries, setTodayEnquiries] = useState(0);

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
  console.log("pruddcturl2", productUrl);

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
    fetchFootfallData();
  }, []);

  const fetchFootfallData = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      // Fetch today's orders & repeat customers
      const orderResponse = await axios.get(
        " https://apibrize.brizindia.com/api/orders/today",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodayOrders(orderResponse.data.today_orders);
      setRepeatCustomers(orderResponse.data.repeat_customers);

      // Fetch today's enquiries
      const enquiryResponse = await axios.get(
        " https://apibrize.brizindia.com/api/customerequires-count",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log('enquiryResponse',enquiryResponse)
      setTodayEnquiries(enquiryResponse?.data?.prospective_count_today);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-4 bg-purple-100 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold text-purple-800">
          Today Footfall
        </h2>
        <p>{todayOrders + repeatCustomers + todayEnquiries}</p>
      </div>

      <div className="flex justify-between mt-4">
        <div>
          <Link
            href={`/${productUrl}/reports/billreport`}
            className="cursor-pointer"
          >
            <h3 className="text-sm  hover:text-green-700">New Billing</h3>
            <p className="text-purple-600 text-lg font-bold">{todayOrders}</p>
          </Link>
        </div>
        <div>
          <Link
            href={`/${productUrl}/reports/customerreport`}
            className="cursor-pointer"
          >
            <h3 className="text-sm hover:text-green-700">Repeat Customer</h3>
            <p className="text-purple-600 text-lg font-bold">
              {repeatCustomers}
            </p>
          </Link>
        </div>
        <div>
          <Link href={`/${productUrl}/enquiry`} className="cursor-pointer">
            <h3 className="text-sm hover:text-green-700">Enquiry</h3>
            <p className="text-purple-600 text-lg font-bold">
              {todayEnquiries}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
