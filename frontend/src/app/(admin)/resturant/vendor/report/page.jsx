"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/* ---------------- STATUS BADGE ---------------- */
function StatusBadge({ status }) {
  const map = {
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status?.toUpperCase()}
    </span>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function InventoryRequestReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchReport = async () => {
      try {
        const token = getCookie("access_token");

        const res = await axios.get(
          "https://apibrize.brizindia.com/api/restro/inventory-request-report",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: source.token,
          }
        );

        if (isMounted) {
          setRows(res.data || []);
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Failed to load report", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
      source.cancel("Component unmounted");
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Inventory Request Report</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left border">Vendor</th>
                <th className="px-3 py-2 text-left border">Product</th>
                <th className="px-3 py-2 text-left border">Requested</th>
                <th className="px-3 py-2 text-left border">Approved</th>
                <th className="px-3 py-2 text-center border">Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{row.vendor}</td>
                    <td className="px-3 py-2 border">{row.product}</td>
                    <td className="px-3 py-2 font-medium border">
                      {row.requested}
                    </td>
                    <td className="px-3 py-2 font-medium border">
                      {row.approved || "—"}
                    </td>
                    <td className="px-3 py-2 text-center border">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
