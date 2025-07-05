"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function MembershipSales() {
  const [sales, setSales] = useState([]);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    membership_plan: "all",
    status: "",
  });
  const [plans, setPlans] = useState([]);


  //token 
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
    fetchPlans();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters]); // Re-fetch data when filters change

  const fetchData = async () => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}
    try {
      const response = await axios.get(" https://api.equi.co.in/api/membership-sales-report", {
        params: {
          from: filters.from || undefined,
          to: filters.to || undefined,
          membership_plan: filters.membership_plan !== "all" ? filters.membership_plan : undefined,
          status: filters.status || undefined,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const salesData = response.data.map((sale) => {
        const saleDate = dayjs(sale.sale_date);
        const validity = sale.plan?.validity || 0;
        const expiryDate = saleDate.add(validity, "day").format("YYYY-MM-DD");

        return {
          ...sale,
          expiry_date: expiryDate,
          status: dayjs().isBefore(expiryDate) ? "Active" : "Expired",
        };
      });

      setSales(salesData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

//   const fetchPlans = async () => {
    
// const token = getToken();
// if (!token) {
//   notifyTokenMissing();
//   return;
// }
//     try {
//       const response = await axios.get(" https://api.equi.co.in/api/membership-plans",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       );
//       setPlans(response.data);
//     } catch (error) {
//       console.error("Error fetching membership plans:", error);
//     }
//   };
const fetchPlans = async () => {
  const token = getToken();
  if (!token) {
    notifyTokenMissing();
    return;
  }

  try {
    const response = await axios.get("https://api.equi.co.in/api/membership-plans", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPlans(response.data);
  } catch (error) {
    console.error("Error fetching membership plans:", error);
  }
};

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Membership Sales Report</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <select
          name="membership_plan"
          value={filters.membership_plan}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="all">All Plans</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Plan</th>
            <th className="p-2 border">Sale Date</th>
            <th className="p-2 border">Expiry Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Stylist</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">No records found</td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr key={sale.id} className="border-b">
                <td className="p-2 border">{sale.customer?.name || "N/A"}</td>
                <td className="p-2 border">{sale.plan?.name || "N/A"}</td>
                <td className="p-2 border">{sale.sale_date}</td>
                <td className="p-2 border">{sale.expiry_date}</td>
                <td className={`p-2 border ${sale.status === "Expired" ? "text-red-500" : "text-green-500"}`}>
                  {sale.status}
                </td>
                <td className="p-2 border">{sale.stylist?.name || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
