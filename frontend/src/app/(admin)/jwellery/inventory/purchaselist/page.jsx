
"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Notyf } from "notyf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function PurchaseListTable() {
  const [purchase, setPurchase] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const notyf = new Notyf();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const token = getCookie("access_token");

  const fetchPurchaseData = useCallback(async () => {
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }
    try {
      const { data } = await axios.get("https://apibrize.brizindia.com/api/purchase", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchase(data?.purchase || []);
    } catch (error) {
      console.error("Purchase API Error:", error);
      notyf.error("Failed to fetch purchase data");
    }
  }, [token]);

  useEffect(() => {
    fetchPurchaseData();
  }, [fetchPurchaseData]);

  const isWithinDateRange = (dateString) => {
    const date = new Date(dateString);
    return (
      (!fromDate || date >= new Date(fromDate)) &&
      (!toDate || date <= new Date(toDate))
    );
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const filteredItems = getFilteredPurchaseItems();
  
    autoTable(doc, {
      head: [[
        "Product", "PCS", "Gross Wgt", "Net Wgt", "Rate", "Other Chg",
        "Disc", "Disc %", "GST", "Taxable", "Total GST", "Net Amt", "Date"
      ]],
      body: filteredItems.map((pItem) => [
        pItem.product_name || "N/A",
        pItem.pcs || "N/A",
        pItem.gwt || "0",
        pItem.nwt || "0",
        pItem.rate || "N/A",
        pItem.other_chg || "N/A",
        pItem.disc || "N/A",
        pItem.disc_percent || "N/A",
        pItem.gst || "N/A",
        pItem.taxable || "N/A",
        pItem.total_gst || "N/A",
        pItem.net_amount || "N/A",
        pItem.created_at
          ? new Date(pItem.created_at).toLocaleDateString()
          : "N/A",
      ]),
    });
  
    doc.save("purchase_list.pdf");
  };
  
  const handleDownloadExcel = () => {
    const filteredItems = getFilteredPurchaseItems();
  
    const worksheet = XLSX.utils.json_to_sheet(
      filteredItems.map((pItem) => ({
        Product: pItem.product_name || "N/A",
        PCS: pItem.pcs || "N/A",
        "Gross Wgt": pItem.gwt || "0",
        "Net Wgt": pItem.nwt || "0",
        Rate: pItem.rate || "N/A",
        "Other Chg": pItem.other_chg || "N/A",
        Disc: pItem.disc || "N/A",
        "Disc %": pItem.disc_percent || "N/A",
        GST: pItem.gst || "N/A",
        Taxable: pItem.taxable || "N/A",
        "Total GST": pItem.total_gst || "N/A",
        "Net Amt": pItem.net_amount || "N/A",
        Date: pItem.created_at
          ? new Date(pItem.created_at).toLocaleDateString()
          : "N/A",
      }))
    );
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseList");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "purchase_list.xlsx");
  };
  
  const getFilteredPurchaseItems = () => {
    return purchase.flatMap((item) =>
      item.purchase_items.filter((pItem) => isWithinDateRange(pItem.created_at))
    );
  };
  

  return (
    <div className="space-y-4">
        <h1 className="bg-green-500 h-[60px] text-center text-3xl flex justify-center   w-full">Purchase List</h1>
      {/* Date Filter UI */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button
          onClick={handleReset}
          className="bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300 mt-5"
        >
          Reset
        </button>
        <div className="flex gap-4" >
   <button
  onClick={handleDownloadPDF}
  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 mt-5"
>
  Download PDF
</button>

<button
  onClick={handleDownloadExcel}
  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 mt-5"
>
  Download Excel
</button>

   </div>
      </div>

  

      {/* Purchase Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border">Product</th>
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
              <th className="py-2 px-4 border">Net Amt</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchase.length > 0 ? (
              purchase.flatMap((item, index) =>
                item.purchase_items
                  .filter((pItem) => isWithinDateRange(pItem.created_at))
                  .map((pItem, pIndex) => (
                    <tr key={`${index}-${pIndex}`} className="hover:bg-gray-100">
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
                          ? new Date(pItem.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
              )
            ) : (
              <tr>
                <td colSpan="13" className="text-center py-4">
                  No Purchase Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
