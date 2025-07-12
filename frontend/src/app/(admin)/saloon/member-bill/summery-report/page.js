"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";

export default function MembershipSummary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(" http://127.0.0.1:8000/api/membership-sales-summery-report");
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Membership Plan Summary Report", 14, 10);
    
    const tableColumn = ["S.No", "Membership Name", "Validity (Months)", "Fees", "Discount (%)", "Sold", "Active", "Expired"];
    const tableRows = summary.map((plan, index) => [
      index + 1,
      plan.membership_name,
      plan.validity,
      plan.fees,
      plan.discount,
      plan.sold,
      plan.active,
      plan.expired
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("Membership_Summary_Report.pdf");
  };

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(summary);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Summary");

    writeFile(workbook, "Membership_Summary_Report.xlsx");
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Membership Plan Summary Report</h2>

      <div className="flex gap-4 mb-4">
        <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded">Export PDF</button>
        <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded">Export Excel</button>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">S.No</th>
            <th className="p-2 border">Membership Name</th>
            <th className="p-2 border">Validity</th>
            <th className="p-2 border">Fees</th>
            <th className="p-2 border">Discount (%)</th>
            <th className="p-2 border">Sold</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Expired</th>
          </tr>
        </thead>
        <tbody>
          {summary.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4">No records found</td>
            </tr>
          ) : (
            summary.map((plan, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{plan.membership_name}</td>
                <td className="p-2 border">{plan.validity} Months</td>
                <td className="p-2 border">{plan.fees}</td>
                <td className="p-2 border">{plan.discount}%</td>
                <td className="p-2 border">{plan.sold}</td>
                <td className="p-2 border text-green-500">{plan.active}</td>
                <td className="p-2 border text-red-500">{plan.expired}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
