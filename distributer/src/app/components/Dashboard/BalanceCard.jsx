"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { displayCoin } from "../config";
export default function BalanceCard({ label }) {
  const [itemcoin, setItemscoin] = useState(0); // State for coin balance
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);

  const fetchItemsCoin = async () => {
    try {
      setLoading(true);
      const response = await displayCoin(); // Assume this function is defined elsewhere
      console.log(response.data.total_coins);
      setItemscoin(response.data.total_coins);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemsCoin(); // Fetch coins when the component is mounted
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-yellow-500 text-2xl">💰</div>
          <h2 className="text-lg font-semibold ml-2">
            {label ? label : "Balance"}
          </h2>
        </div>
        <div className="flex space-x-2">
          <div className="text-orange-600 text-3xl font-bold">
            {loading ? "Loading..." : itemcoin}
          </div>
          <Link href="/recharge" className="bg-blue-600 p-2 rounded text-white">
            Recharge
          </Link>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-4 border-2 border-blue-500 rounded-lg p-10">
        <div>
          <h3 className="text-sm text-gray-500">Total Invoice</h3>
          <p className="text-purple-600 text-lg font-bold">82</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">This Month</h3>
          <p className="text-blue-600 text-lg font-bold">10</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Last Recharge Date</h3>
          <p className="text-teal-600 text-lg font-bold">24/09/24</p>
        </div>
      </div>
    </div>
  );
}
