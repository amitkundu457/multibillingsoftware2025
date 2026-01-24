"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import CustomerModal from "./CustomerModal";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaCashRegister } from "react-icons/fa";
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(30);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  // ⭐ Debounced Search (1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterSearch(search);
      setPage(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  // ⭐ Fetch Customers API
  const fetchCustomers = async () => {
    try {
      const token = getCookie("access_token");

      const { data } = await axios.get(
        `https://apibrize.brizindia.com/api/customers/all?page=${page}&limit=${limit}&search=${filterSearch}&start_date=${startDate}&end_date=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCustomers(data.data);
      setTotalPages(data.last_page);
    } catch (error) {
      toast.error("Error fetching customers!");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, filterSearch, startDate, endDate]);

  // ⭐ Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Customer List", 14, 10);

    const tableData = customers.map((c) => [
      c.customer_name,
      c.phone,
      c.address,
      c.gstNo,
      c.state,
      c.country,
      c.remarke,
    ]);

    doc.autoTable({
      head: [["Name", "Phone", "Address", "GST", "State", "Country", "Remark"]],
      body: tableData,
    });

    doc.save("customers.pdf");
  };

  // ⭐ Reset Filters
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearch("");
    setFilterSearch("");
    setPage(1);
    fetchCustomers();
  };

  const openModal = (type, customer = null) => {
    setModalType(type);
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // ⭐ Delete Customer
  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;

    try {
      await axios.delete(`https://apibrize.brizindia.com/api/customers/${id}`);

      toast.success("Customer deleted!");
      fetchCustomers();
    } catch (error) {
      toast.error("Cannot delete — customer has orders.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={() => openModal("create")}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or phone..."
          className="px-3 py-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Start Date */}
        <input
          type="date"
          className="px-3 py-2 border rounded"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
        />

        {/* End Date */}
        <input
          type="date"
          className="px-3 py-2 border rounded"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
        />

        {/* PDF Download */}
        <button
          onClick={downloadPDF}
          className="px-4 py-2 text-white bg-green-600 rounded"
        >
          Download PDF
        </button>

        {/* Reset Button */}
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 text-white bg-gray-600 rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <table className="w-full border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">GST</th>
            <th className="p-2 border">State</th>
            <th className="p-2 border">Country</th>
            <th className="p-2 border">Remark</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="p-2 border">{c.customer_name}</td>
              <td className="p-2 border">{c.phone}</td>
              <td className="p-2 border">{c.address}</td>
              <td className="p-2 border">{c.gstNo}</td>
              <td className="p-2 border">{c.state}</td>
              <td className="p-2 border">{c.country}</td>
              <td className="p-2 border">{c.remarke}</td>
              <td className="p-2 border">
                <button
                  onClick={() => openModal("edit", c)}
                  className="px-2 py-1 text-white bg-yellow-500 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-2 py-1 ml-2 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-3">
        <button
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span className="px-3 py-1 bg-gray-200 rounded">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <CustomerModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        modalType={modalType}
        currentCustomer={currentCustomer}
        refreshData={fetchCustomers} // ⭐ Important
      />
    </div>
  );
};

export default Customers;
