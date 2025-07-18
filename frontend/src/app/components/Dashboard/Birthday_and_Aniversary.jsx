import { useState, useEffect } from "react";
import { MdCelebration } from "react-icons/md";
import axios from "axios";

export default function Birthday_and_Aniversary({ label }) {
  const [customers, setCustomers] = useState([]);

  // Function to get token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const fetchCustomers = async () => {
    try {
      const token = getCookie("access_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await axios.get("http://127.0.0.1:8000/api/customers", config);
      
      console.log("Fetched Customers:", data); // Debugging log
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Count today's birthdays
  const todayBirthdays = customers.filter(customer => customer.dob === today).length;

  // Count today's anniversaries
  const todayAnniversaries = customers.filter(customer => customer.anniversary === today).length;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-yellow-500 text-2xl">
            <MdCelebration />
          </div>
          <h2 className="text-lg font-semibold ml-2">
            {label ? label : "Birthday & Anniversary"}
          </h2>
        </div>
      </div>
      <div className="mt-2 flex border-2 border-blue-500 rounded-lg p-10 justify-between">
        <div className="flex-col justify-between">
          <h3 className="text-sm text-gray-500">Today Birthday</h3>
          <p className="text-purple-600 text-lg font-bold">{todayBirthdays}</p>
        </div>

        <div>
          <h3 className="text-sm text-gray-500">Today Anniversary</h3>
          <p className="text-teal-600 text-lg font-bold">{todayAnniversaries}</p>
        </div>
      </div>
    </div>
  );
}
