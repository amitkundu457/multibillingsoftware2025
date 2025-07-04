"use client";
import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import useSwr from "swr";
import axios from "@/app/lib/axios";

function Page() {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("access_token");

  const { data: commission, isLoading } = useSwr("/auth/commissionreport", () =>
    axios
      .get("/auth/commissionreport", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.commission)
      .catch((err) => console.log(err))
  );

  console.log(commission);

  return (
    <div className="absolute left-0 top-0 w-full h-full">
      <div className="py-4 bg-green-500 flex items-center px-6 text-white">
        <Link href="/dashboard">
          <FaArrowLeft />
        </Link>
        <div className="flex-1 text-center text-sm font-medium">
          <h1>Commission Report</h1>
        </div>
      </div>
      <div className="w-full p-4">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-4 px-3 text-sm font-semibold bg-orange-400 text-white rounded-l">
                Client Name
              </th>
              <th className="py-4 px-3 text-sm font-semibold bg-orange-400 text-white">
                Purchase Date
              </th>
              <th className="py-4 px-3 text-sm font-semibold bg-orange-400 text-white">
                Total Amount
              </th>
              <th className="py-4 px-3 text-sm font-semibold bg-orange-400 text-white rounded-r">
                Commission
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              commission?.map((cm, i) => (
                <tr key={i}>
                  <td className="py-3 px-3 border-b">{cm.user?.name}</td>
                  <td className="py-3 px-3 border-b">
                    {new Date(cm.purchaseDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3 px-3 border-b">
                    &#8377; {cm.totalAmount}
                  </td>
                  <td className="py-3 px-3 border-b">
                    &#8377; {cm.commission}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
