"use client";
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

//import { format } from "date-fns";

//date and time current
const now = new Date();
const todayDate = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
const currentTime = now.toTimeString().split(":").slice(0, 2).join(":"); // "HH:MM"

const Booking = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    entryDate: todayDate,
    bookingNo: "BKLjkjI1",
    bookingDate: todayDate,
    bookingTime: currentTime,
    phone: "",
    customerName: "",
    address: "",
    source: "",
    outOfSalon: false,
    rate: "",
    services: [],
    // additionalCharge: "0",
    //discount: "0",
    detail: "",
    payment: { cash: "", card: "", upi: "", coupon: "", couponAmount: "" },
  });
  const [bookings, setBookings] = useState([]);
  const [serviceList, setService] = useState([]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      payment: { ...prev.payment, [name]: value },
    }));
  };

  function generateBookingNo() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "BK";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  useEffect(() => {
    fetchService();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    const sanitizedData = {
      entry_date: formData.entryDate || null,
      booking_no: formData.generateBookingNo || null,
      booking_date: formData.bookingDate || null,
      booking_time: formData.bookingTime || null,
      phone: formData.phone || null,
      customer_name: formData.customerName || null,
      address: formData.address || null,
      source: formData.source || null,
      out_of_salon: formData.outOfSalon || false,
      service: formData.services || [],
      rate: Number(formData.rate) || 0,
      discount: Number(formData.discount) || 0,
      total_price: Number(formData.totalPrice) || 0,
      cash_payment: Number(formData.payment.cash) || 0,
      card_payment: Number(formData.payment.card) || 0,
      upi_payment: Number(formData.payment.upi) || 0,
      coupon_amount: Number(formData.payment.couponAmount) || 0,
      status: "jwellery billing",
      sms_credential_id: 1,
    };

    console.log("Submitting Data:", JSON.stringify(sanitizedData, null, 2));
    console.log("booking payload", sanitizedData);
    try {
      const response = await fetch(
        "  https://apibrize.brizindia.com/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sanitizedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error(errorData.error || "Failed to submit booking");
      }

      const data = await response.json();
      setBookings([...bookings, data]);

      setFormData({
        entryDate: "",
        bookingNo: "BK5LI1",
        bookingDate: "",
        bookingTime: "",
        phone: "",
        customerName: "",
        address: "",
        source: "",
        outOfSalon: false,
        rate: "",
        discount: "",
        totalPrice: "",
        services: [],
        payment: {
          cash: "0",
          card: "0",
          upi: "0",
          coupon: "",
          couponAmount: "0",
        },
      });

      alert("Booking submitted successfully!");
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert(error.message);
    }
  };
  async function fetchService() {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    const response = await axios.get(
      "  https://apibrize.brizindia.com/api/Saloon-service",

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setService(response?.data);
    console.log("saloon serive", response);
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex">
      <div className="w-3/4 pr-4">
        <div className="flex ">
          <a
            href="/saloon/booking/report"
            className=" flex justify-center mb-2 rounded-sm mx-auto p-3 bg-green-400"
          >
            Booking Report
          </a>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center bg-green-600 text-white p-2 rounded-md">
          Booking
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label htmlFor="">Booking no.</label>
              <input
                type="text"
                name="bookingNo"
                value={formData.bookingNo}
                onChange={handleChange}
                className="border px-4 py-2 w-full"
                required
              />
            </div>
            <div>
              <label>Entry Date</label>
              <input
                type="date"
                name="entryDate"
                value={formData.entryDate}
                onChange={handleChange}
                className="border px-4 py-2 w-full"
                required
              />
            </div>

            <div>
              <label>Booking Date</label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                className="border px-4 py-2 w-full"
                required
              />
            </div>

            <div>
              <label>Booking Time</label>
              <input
                type="time"
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleChange}
                className="border px-4 py-2 w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border px-4 py-2 w-full"
              required
            />
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Customer Name"
              className="border px-4 py-2 w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="border px-4 py-2 w-full"
              required
            />

            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="border px-4 py-2 w-full mt-2"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="border px-4 py-2 w-1/3"
              required
            >
              <option value="">Select Source</option>
              <option value="online">Online</option>
              <option value="walk-in">Walk-in</option>
            </select>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="outOfSalon"
                checked={formData.outOfSalon}
                onChange={handleChange}
                className="ml-2 w-6 h-6"
              />
              <span className="ml-2">Out of Salon</span>
            </div>
          </div>

          {/* <div className=" space-x-2">
            <label>Serive Lists</label>
            <select
            name="service"
             multiple
            value={formData.service ||  []}
            onChange={handleChange}
            className=" rounded-md"
            >
              <option value=''>Select Service</option>
              {
                serviceList.map((c)=>(
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))
              }
            </select>
          </div> */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Services
            </label>

            {/* Dropdown toggle button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              {formData.services.length > 0
                ? `${formData.services.length} selected`
                : "Choose services..."}
            </button>

            {/* Dropdown menu (shown when open) */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
                <div className="p-2 space-y-2">
                  {serviceList.map((service) => (
                    <div key={service.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={service.id}
                        checked={formData.services.includes(service.name)}
                        onChange={(e) => {
                          const { checked } = e.target;
                          setFormData((prev) => ({
                            ...prev,
                            services: checked
                              ? [...prev.services, service.name]
                              : prev.services.filter((s) => s !== service.name),
                          }));
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label
                        htmlFor={service.id}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {service.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Book Now
          </button>
        </form>
      </div>
      <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-center">
          Advance Payment By
        </h3>
        <input
          type="number"
          name="cash"
          value={formData.payment.cash}
          onChange={handlePaymentChange}
          placeholder="Cash"
          className="border px-4 py-2 w-full my-2"
        />
        <input
          type="number"
          name="card"
          value={formData.payment.card}
          onChange={handlePaymentChange}
          placeholder="Card"
          className="border px-4 py-2 w-full my-2"
        />
        <input
          type="number"
          name="upi"
          value={formData.payment.upi}
          onChange={handlePaymentChange}
          placeholder="UPI"
          className="border px-4 py-2 w-full my-2"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Checkout & Print
        </button>
      </div>
    </div>
  );
};

export default Booking;
