"use client";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Notyf } from "notyf"; // Import Notyf
import "notyf/notyf.min.css";

export default function StockListTable() {
  const [selectedOption, setSelectedOption] = useState("Stock");
  const [stocks, setStocks] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const notyf = new Notyf();

  // Function to get the cookie token
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const token = getCookie("access_token");

  const fetchStockData = useCallback(async () => {
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }
    try {
      const { data } = await axios.get("https://api.equi.co.in/api/stocks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks(data?.stock || []);
    } catch (error) {
      console.error("Stock API Error:", error);
      notyf.error("Failed to fetch stock data");
    }
  }, [token]);

  const fetchPurchaseData = useCallback(async () => {
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }
    try {
      const { data } = await axios.get("https://api.equi.co.in/api/purchase", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchase(data?.purchase || []);
      setTotalPurchase(data?.purchase.length || 0);
    } catch (error) {
      console.error("Purchase API Error:", error);
      notyf.error("Failed to fetch purchase data");
    }
  }, [token]);

  useEffect(() => {
    fetchStockData();
    fetchPurchaseData();
  }, [fetchStockData, fetchPurchaseData]);

  const totalQuantity = stocks.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-2 p-3 rounded-sm bg-green-600 text-white">
        <h1 className="text-xl p-3">Stock List</h1>
        <div className="font-bold text-2xl">
          {selectedOption === "Stock" ? (
            <div>Total Stock = {totalQuantity}</div>
          ) : (
            <div>Total Purchase = {totalPurchase}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="Stock">Stock</option>
          <option value="Purchase">Purchase</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        {selectedOption === "Stock" ? (
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white text-left">
                <th className="py-2 px-4 border">Product Name</th>
                <th className="py-2 px-4 border">Quantity</th>
                <th className="py-2 px-4 border">Gross Weight</th>
                <th className="py-2 px-4 border">Net Weight</th>
                <th className="py-2 px-4 border">Rate</th>
                <th className="py-2 px-4 border">MRP</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {stocks.length > 0 ? (
                stocks.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 transition">
                    <td className="py-2 px-4 border">{item.product_service?.name || "N/A"}</td>
                    <td className="py-2 px-4 border">{item.quantity || "N/A"}</td>
                    <td className="py-2 px-4 border">{item.gross_weight || "0"}</td>
                    <td className="py-2 px-4 border">{item.net_weight || "0"}</td>
                    <td className="py-2 px-4 border">{item.rate || "N/A"}</td>
                    <td className="py-2 px-4 border">{item.mrp || "N/A"}</td>
                    <td className="py-2 px-4 border">
                      {item.product_service?.created_at
                        ? new Date(item.product_service.created_at).toISOString().split("T")[0]
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-2 px-4 border text-center">
                    No Stock Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white text-left">
                <th className="py-2 px-4 border">Product Name</th>
                <th className="py-2 px-4 border">PCS</th>
                <th className="py-2 px-4 border">Gross Wgt</th>
                <th className="py-2 px-4 border">Net Wgt</th>
                <th className="py-2 px-4 border">Rate</th>
                <th className="py-2 px-4 border">Other Chg</th>
                <th className="py-2 px-4 border">Disc</th>
                <th className="py-2 px-4 border">Disc %</th>
                <th className="py-2 px-4 border">GST</th>
                <th className="py-2 px-4 border">Taxable</th>
                <th className="py-2 px-4 border">Total GST</th>
                <th className="py-2 px-4 border">Net Amount</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchase.length > 0 ? (
                purchase.map((item, index) =>
                  item.purchase_items.map((pItem, pIndex) => (
                    <tr key={`${index}-${pIndex}`} className="border-b hover:bg-gray-100 transition">
                      <td className="py-2 px-4 border">{pItem.product_name || "N/A"}</td>
                      <td className="py-2 px-4 border">{pItem.pcs || "N/A"}</td>
                      <td className="py-2 px-4 border">{pItem.gwt || "0"}</td>
                      <td className="py-2 px-4 border">{pItem.nwt || "0"}</td>
                      <td className="py-2 px-4 border">{pItem.rate || "N/A"}</td>
                      <td className="py-2 px-4 border">{pItem.other_chg || "N/A"}</td>
                      <td className="py-2 px-4 border">{pItem.disc || "N/A"}</td>
                      <td className="py-2 px-4 border">{pItem.disc_percent || "N/A"}</td>
                      <td className="py-2 px-4 border">{pItem.gst || "N/A"}</td>
                      <td className="py-2 px-4 border">{pItem.taxable || "N/A"}</td>
                      <td className="py-2 px-4 border">{pItem.total_gst || "N/A"}</td>
                      <td className="py-2 px-4 border">{pItem.net_amount || "N/A"}</td>
                      <td className="py-2 px-4 border">
                        {pItem.created_at
                          ? new Date(pItem.created_at).toISOString().split("T")[0]
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="13" className="py-2 px-4 border text-center">
                    No Purchase Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
