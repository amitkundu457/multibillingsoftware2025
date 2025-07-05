"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import {
  FaBell,
  FaClipboardList,
  FaPhone,
  FaWhatsapp,
  FaSms,
  FaSyncAlt,
} from "react-icons/fa";

export default function ReminderBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("reminder");
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [showActions, setShowActions] = useState(null);
  const [smsLoading, setSmsLoading] = useState(false);

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
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}

    setLoading(true);
    try {
      const response = await axios.get(" https://api.equi.co.in/api/enquiry",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReminders(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  
  
  // Updated to accept phone parameter
  const handleSendSms = async (phone,reminder) => {
    setSmsLoading(true);


    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    // Ensure reminder is valid before proceeding
  if (!reminder || !reminder.id || !reminder.date) {
    console.error("Invalid reminder data:", reminder);
    alert("Error: Invalid reminder data.");
    setSmsLoading(false);
    return;
  }



  // Create follow-up payload dynamically
  const followUpPayload = {
    enquiry_id: reminder.id, // Ensure this field is correct
    //follow_up_date: reminder.date, // Ensure correct field name
    follow_up_date: new Date().toISOString().split("T")[0], // Set today's date

    notes: reminder.description || "", // Default to empty string
  };

  const ReminderPayload = {
    enquiry_id: reminder.id, // Ensure this field is correct
    //follow_up_date: reminder.date, // Ensure correct field name
    reminder_date: reminder.date,

    note: reminder.description || "", // Default to empty string
  };


    try {
      const response = await axios.post(
        " https://api.equi.co.in/api/enquerymessage",
        { phone } // Passing the specific phone number in the request body
      );
      const followUpResponse = await axios.post(
        "https://api.equi.co.in/api/reminder-follow-up/follow-up",followUpPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        });

        const RemindersResponse = await axios.post(
          "https://api.equi.co.in/api/reminder-follow-up/reminder",ReminderPayload,
          {
            headers: { Authorization: `Bearer ${token}` },
          });


      console.log("SMS response:", response.data);
      alert("SMS sent successfully!");
    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("Failed to send SMS.");
    } finally {
      setSmsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md border border-gray-300 rounded-lg p-4 shadow-md">
      {/* Header */}
      <div
        className="flex justify-between items-center border-b pb-3 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <FaBell className="text-green-500" />
          <span className="text-lg font-semibold">Reminder</span>
        </div>
        <div className="w-8 h-8 flex items-center justify-center bg-blue-400 text-white font-bold rounded-full">
          {reminders.length}
        </div>
      </div>

      <div
        className="flex justify-between items-center mt-3 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <FaClipboardList className="text-green-500" />
          <span className="text-lg font-semibold">Follow-up</span>
        </div>
        <div className="w-8 h-8 flex items-center justify-center bg-orange-400 text-white font-bold rounded-full">
          0
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`flex-1 text-center py-2 font-semibold ${
                  activeTab === "reminder"
                    ? "border-b-2 border-green-500 text-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("reminder")}
              >
                Reminder
              </button>
              <button
                className={`flex-1 text-center py-2 font-semibold ${
                  activeTab === "followup"
                    ? "border-b-2 border-green-500 text-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("followup")}
              >
                Follow-up
              </button>
            </div>

            {/* Close Button */}
            <div className="flex justify-between items-center border-b pb-2 mt-2">
              <h2 className="text-lg font-semibold">
                {activeTab === "reminder" ? "Reminders" : "Follow-ups"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-black"
              >
                ✖
              </button>
            </div>

            {/* Content Section */}
            <div className="mt-3">
              {loading ? (
                <p className="text-center py-4">Loading...</p>
              ) : activeTab === "reminder" ? (
                reminders.length > 0 ? (
                  reminders.map((reminder, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white shadow-md rounded-lg border mb-3 relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-semibold cursor-pointer">
                          {reminder.name}
                        </span>
                        <button
                          onClick={() =>
                            setShowActions(showActions === index ? null : index)
                          }
                          className="text-gray-500 hover:text-black"
                        >
                          ⋮
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm">{reminder.phone}</p>
                      <p className="text-gray-500 text-sm">
                        {reminder.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-500 text-sm">Date: {reminder.date}</p>
                        <span className="bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded">
                          {index + 1}
                        </span>
                      </div>

                      {/* Actions Menu */}
                      {showActions === index && (
                        <div className="absolute top-10 right-0 bg-white border shadow-lg rounded-lg p-3 flex gap-3">
                          <button
                            onClick={() => handleSendSms(reminder.phone,reminder)}
                            className="bg-green-500 text-white p-2 rounded-full"
                          >
                            {smsLoading ? "Sending..." : <FaPhone />}
                          </button>
                          <button className="bg-green-500 text-white p-2 rounded-full">
                            <FaWhatsapp />
                          </button>
                          <button className="bg-green-500 text-white p-2 rounded-full">
                            <FaSms />
                          </button>
                          <button className="bg-green-500 text-white p-2 rounded-full">
                            <FaSyncAlt />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No reminders found</p>
                )
              ) : (
                <p className="text-center text-gray-500">No follow-ups</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
