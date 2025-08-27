"use client";
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import "react-responsive-modal/styles.css";

const ServiceCell = ({ serviceString }) => {
  const services = serviceString?.split(",") || [];
  const [showAll, setShowAll] = useState(false);

  if (!serviceString) return <td className="px-4 py-2 text-sm text-gray-800">n/a</td>;

  return (
    <td className="px-4 py-2 text-sm text-gray-800">
      {showAll ? (
        <>
          {services.join(", ")}{" "}
          <button onClick={() => setShowAll(false)} className="text-blue-500 underline text-xs">
            show less
          </button>
        </>
      ) : (
        <>
          {services[0]}
          {services.length > 1 && (
            <>
              {" "}
              ...{" "}
              <button onClick={() => setShowAll(true)} className="text-blue-500 underline text-xs">
                more
              </button>
            </>
          )}
        </>
      )}
    </td>
  );
};

const AppointmentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [servicelist, setService] = useState([]);
  const [stylist, setStylist] = useState([]);
  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_time: "",
    name: "",
    phone: "",
    services: [],
    gender: "",
    stylist: "",
  });
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  //time and date
  const now = new Date();
  const todayDate = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const currentTime = now.toTimeString().split(":").slice(0, 2).join(":"); // "HH:MM"
  // Open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointmentId(null);
    setFormData({
      appointment_date: todayDate,
      appointment_time: currentTime,
      name: "",
      phone: "",
      services: [],
      gender: "",
      stylist: "",
    });
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

  // Fetch appointments from the API
  const fetchAppointments = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const response = await axios.get(
        "  http://127.0.0.1:8000/api/appointments",

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  async function fetchService() {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    const response = await axios.get(
      "  http://127.0.0.1:8000/api/Saloon-service",

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setService(response?.data);
    console.log("saloon serive", response);
  }

  //stylist
  async function fetchStylist() {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    const response = await axios.get(
      "  http://127.0.0.1:8000/api/stylists",

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setStylist(response?.data);
    console.log("stylist", response);
    // setService(response?.data);
    // console.log("saloon serive",response);
  }

  // Create new appointment
  const handleCreateAppointment = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    console.log("payload", formData);
    try {
      await axios.post(
        "  http://127.0.0.1:8000/api/appointments",
        formData,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
      closeModal();
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  // Edit appointment (set form data to the selected appointment)
  const handleEditAppointment = (appointment) => {
    setFormData({
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      name: appointment.name,
      phone: appointment.phone,
      services: appointment.services,
      gender: appointment.gender,
      stylist: appointment.stylist,
    });
    setEditingAppointmentId(appointment.id);
    openModal();
  };

  // Update an existing appointment
  const handleUpdateAppointment = async () => {
    console.log("update appoinemtn", formData);
    try {
      await axios.post(
        `  http://127.0.0.1:8000/api/appointments/${editingAppointmentId}`,
        formData
      );
      fetchAppointments();
      closeModal();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  // Delete an appointment
  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(`  http://127.0.0.1:8000/api/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAppointmentId) {
      handleUpdateAppointment();
    } else {
      handleCreateAppointment();
    }
  };

  // UseEffect to fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
    fetchService();
    fetchStylist();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-green-600 shadow-md">
        <button className="text-3xl text-white hover:scale-105 transition-transform">
          <FaArrowLeft />
        </button>
        <p className="text-lg font-bold text-white">Appointment</p>
        <button
          onClick={openModal}
          className="text-2xl text-green-700 hover:text-white hover:bg-green-600 transition-colors transform bg-white rounded-xl p-3 shadow-lg hover:scale-110 focus:outline-none"
        >
          <FaPlus />
        </button>
      </nav>

      {/* Search Bar */}
      <div className="flex justify-start space-x-2 p-2 bg-gray-100 rounded-lg shadow-md max-w-xs mx-auto">
        <input
          type="text"
          placeholder="Days list"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-4">
        <table className="min-w-full table-auto bg-gray-50 shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-md font-medium text-gray-700">
                Appointment Date
              </th>
              <th className="px-4 py-2 text-left text-md font-medium text-gray-700">
                Time
              </th>
              <th className="px-4 py-2 text-left text-md font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 text-left text-md font-medium text-gray-700">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-md font-medium text-gray-700">
                Service
              </th>
              <th className="px-4 py-2 text-left text-md font-medium text-gray-700">
                StyleList
              </th>
              <th className="px-4 py-2 text-left text-md font-medium text-gray-700">
                Gender
              </th>
              <th className="px-4 py-2 text-left text-md font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-t">
                <td className="px-4 py-2 text-sm text-gray-800">
                  {appointment.appointment_date}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {appointment.appointment_time}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {appointment.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {appointment.phone}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  <ServiceCell serviceString={appointment.service} />
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {appointment.stylist ? appointment.stylist : "NA"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {appointment.gender}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  <button
                    onClick={() => handleEditAppointment(appointment)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className="text-red-500 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create / Edit Appointment */}
      <Modal open={isModalOpen} onClose={closeModal} center>
        <div className="w-96">
          <h2 className="text-2xl font-semibold mb-4">
            {editingAppointmentId ? "Edit Appointment" : "Add Appointment"}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Appointment Date
              </label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

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
                    {servicelist.map((service) => (
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
                                : prev.services.filter(
                                    (s) => s !== service.name
                                  ),
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

            <div className="flex flex-col mt-4">
              <label className=" text-gray-500">Stylist</label>
              <select
                name="stylist"
                value={formData.stylist}
                onChange={handleChange}
                className=" rounded-md  border-gray-400 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">select StyleList</option>
                {stylist.map((c) => (
                  <option value={c.name} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
              >
                {editingAppointmentId ? "Update" : "Add"} Appointment
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentPage;
