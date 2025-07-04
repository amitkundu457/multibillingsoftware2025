import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Import axios
import { IoMdNotificationsOff } from "react-icons/io";

export default function Reminder_And_FollowUp({ label }) {
  const [count, setCount] = useState({
    today_reminders: 0,
    today_followups: 0,
  });

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
          <h3 className="text-gray-600 text-lg font-bold">Today Reminder</h3>
          <p className="text-blue-600 text-lg font-bold">
            {count.today_reminders}
          </p>
        </div>

        {/* Today Follow-up */}
        <div className="flex justify-between">
          <h3 className="text-purple-600 text-lg font-bold">Today Follow-up</h3>
          <p className="text-teal-600 text-lg font-bold">
          {count.today_follow_ups || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
