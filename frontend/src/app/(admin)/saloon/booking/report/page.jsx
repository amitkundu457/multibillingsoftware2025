
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filters, setFilters] = useState({ fromDate: "", toDate: "", customerName: "" });
  const [showModal, setShowModal] = useState(false);
  const initialFormData = {
    id: null,
    entry_date: "",
    booking_no: "BKLI1",
    booking_date: "",
    booking_time: "",
    phone: "",
    customer_name: "",
    address: "",
    source: "",
    service:"",
    out_of_salon: false,
    rate: 0,
    discount: 0,
    total_price: 0,
    cash_payment: 0,
    card_payment: 0,
    upi_payment: 0,
    coupon_amount: 0,
   
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(" https://api.equi.co.in/api/bookings");
      setBookings(response.data);
      console.log("booking get api",response)
      setFilteredBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    applyFilters({ ...filters, [name]: value });
  };

  const applyFilters = (filterValues) => {
    let filtered = bookings.filter((b) => {
      return (
        (!filterValues.fromDate || b.booking_date >= filterValues.fromDate) &&
        (!filterValues.toDate || b.booking_date <= filterValues.toDate) &&
        (!filterValues.customerName || b.customer_name.toLowerCase().includes(filterValues.customerName.toLowerCase()))
      );
    });
    setFilteredBookings(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(` https://api.equi.co.in/api/bookings/${formData.id}`, formData);
      } else {
        const response = await axios.post(" https://api.equi.co.in/api/bookings", formData);
        setBookings([...bookings, response.data]);
        setFilteredBookings([...filteredBookings, response.data]);
      }
      setShowModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(` https://api.equi.co.in/api/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className="border p-2" />
        <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className="border p-2" />
        <input type="text" name="customerName" value={filters.customerName} onChange={handleFilterChange} placeholder="Customer Name" className="border p-2" />
      </div>
      <button onClick={() => { setFormData(initialFormData); setShowModal(true); }} className="bg-green-500 text-white p-3 rounded-full fixed bottom-10 right-10">+</button>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Booking No.</th>
            <th className="border p-2">Booking Date</th>
            <th className="border p-2">booking Time</th>
            <th className="border p-2">Entry date</th>
            {/* <th className="border p-2">booking Time</th> */}
            <th className="border p-2">Customer</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Service</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking.id} className="border">
              <td className="border p-2">{booking.booking_no}</td>
              <td className="border p-2">{booking.booking_date}</td>
              <td className="border p-2">{booking.booking_time}</td>
              <td className="border p-2">{booking.entry_date}</td>
        
              <td className="border p-2">{booking.customer_name}</td>
              <td className="border p-2">{booking.phone}</td>
              <td className="border p-2">{booking.rate}</td>
              <td className="border p-2">{booking.service}</td>
              <td className="border p-2">
                <button onClick={() => { setFormData(booking); setShowModal(true); }} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(booking.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={showModal} onClose={() => setShowModal(false)} center classNames={{ modal: "rounded-lg p-6 bg-white shadow-lg w-[600px]" }}>
  <form onSubmit={handleSubmit} className="p-6 bg-white space-y-4 grid grid-cols-2 gap-4">
    {/* {Object.keys(initialFormData).map((key) => (
      <div key={key} className="col-span-2 md:col-span-1">
        <label className="block text-gray-700 text-sm font-bold mb-1">{key.replace("_", " ").toUpperCase()}</label>
        <input
          type={typeof formData[key] === "number" ? "number" : "text"}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          placeholder={key.replace("_", " ").toUpperCase()}
          className="border px-4 py-2 w-full rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>
    ))} */}
   {Object.keys(initialFormData).map((key) => {
  if (key === "id" || key === "booking_no") return null;

  // Compute display label
  let label = key.replace("_", " ").toUpperCase();
  if (key === "rate") label = "Amount";

  // Determine input type
  let inputType = typeof formData[key] === "number" ? "number" : "text";
  if (label === "ENTRY DATE" || label === "BOOKING DATE") inputType = "date";
  if (label === "BOOKING TIME") inputType = "time";

  // Special fields that shouldn't be required
  const isOptionalField = ["ENTRY DATE", "BOOKING NO", "BOOKING DATE", "BOOKING TIME"].includes(label);

  // Handle OUT_OF_SALON logic
  let value = formData[key];
  if (key === "out_of_salon" && formData[key] === 1) return null
  return (
    <div key={key} className="col-span-2 md:col-span-1">
      <label className="block text-gray-700 text-sm font-bold mb-1">
        {label}
      </label>
      <input
        type={inputType}
        name={key}
        value={value}
        onChange={handleChange}
        placeholder={label}
        className="border px-4 py-2 w-full rounded-lg focus:ring focus:ring-blue-300"
        {...(!isOptionalField && { required: true })}
      />
    </div>
  );
})}


    <div className="col-span-2">
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition">Submit</button>
    </div>
  </form>
</Modal>

    </div>
  );
};

export default BookingPage;


 