"use client";
import { Modal } from "react-responsive-modal";
import React, { useState, useRef, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { useForm } from "react-hook-form";
import {
  StoreAccount,
  StoreAccountMaster,
  getAccountMaster,
  getAccount,
  createAccountGroup,
  getAccountGroup,
  UpdateAccount,
  DeleteAccount,
  deleteCoin,
} from "@/app/components/config";
import { useCallback } from "react";

import { FaUserPlus, FaPlus, FaPrint, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Notyf } from "notyf";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
const notyf = new Notyf();
import { useReactToPrint } from "react-to-print";
import PrintPdf from "./print";
// import { Notyf } from 'notyf';
import "notyf/notyf.min.css"; // Import Notyf CSS
const Modals = ({ account, onCloses, title, children }) => {
  const modalRef = useRef(null);

  const handleOutsideClick = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onCloses();
      }
    },
    [onCloses]
  );

  useEffect(() => {
    if (account) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [account, handleOutsideClick]);

  // if (!isOpen) return null;
  if (!account) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-end">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-[9rem]">
        {/*<h2 className="text-lg font-bold mb-4">{title}</h2>*/}
        {children}
        <div className="mt-4 text-right">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none"
            onClick={onCloses}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AccountsEntries = () => {
  const [entries, setEntries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [filter, setFilter] = useState("RECEIPT");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");
  const [accountmaster, setAccountMaster] = useState("");
  const [isDebit, setIsDebit] = useState(false);
  const [accountMasters, setAccountMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [accountgroup, setAccountGroup] = useState([]);

  const [masterGroup, setMasterGroup] = useState(false);

  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      checkin_date: "",
      customer_id: "",
      amount: 0,
      ref_no: "",
      narration: "",
      recive_id: "",
      account_type: "", // Initialize with an empty string
    },
  });
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handlePrint = (id) => {
    // Find the entry by id
    const entryToPrint = filteredEntries.find((entry) => entry.id === id);

    // If no entry is found, show an alert
    if (!entryToPrint) {
      alert("Please select an entry to print");
      return;
    }

    // Set the print mode to true
    setIsPrintMode(true);

    // Create a temporary container for the print content
    const printContainer = document.createElement("div");
    document.body.appendChild(printContainer);

    // Create a React root in the temporary container
    const root = createRoot(printContainer);

    // Render the PrintPdf component for the selected entry into the temporary container
    root.render(<PrintPdf entries={[entryToPrint]} />);

    // Trigger the print dialog after content is rendered
    setTimeout(() => {
      window.print(); // Trigger the print dialog

      // Clean up by removing the temporary container after printing
      document.body.removeChild(printContainer);
      setIsPrintMode(false); // Deactivate print mode
    }, 1000); // Delay to ensure the content is rendered before printing
  };

  const {
    register: registerSecond,
    handleSubmit: handleSubmitSecond,
    formState: { errors: errorsSecond },
  } = useForm();

  const {
    register: registerThree,
    handleSubmit: handleSubmitThree,
    formState: { errors: errorsThree },
  } = useForm();

  useEffect(() => {
    if (modalType) {
      setValue("account_type", modalType.toUpperCase()); // Update the field value
    }
    fetchAccountMasters();
    fetchEntries();
    fetchAccountGroup();
  }, [modalType, setValue]);

  const applyFilters = useCallback(() => {
    const filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;

      const isWithinDateRange =
        (!fromDate || entryDate >= fromDate) &&
        (!toDate || entryDate <= toDate);

      const matchesFilter = entry.account_type === filter;

      return isWithinDateRange && matchesFilter;
    });
    // Do something with the filtered entries if needed
  }, [entries, dateRange, filter]);

  useEffect(() => {
    applyFilters();
  }, [dateRange, filter, entries, applyFilters]);

  const handleOpenModal = (type, entryData) => {
    setModalType(type); // Set the type (e.g., payment, receipt)
    setIsOpen(true); // Open the modal
    if (entryData) {
      setEditId(entryData.id);
      populateFormData(entryData);
    } else {
      setEditId(null);
      reset(); // Reset the form for new entries
    }
  };

  const handleMaster = () => {
    setAccountMaster(true);
  };

  const handleGroup = () => {
    setMasterGroup(true);
  };
  const handleCloseGroup = () => {
    setMasterGroup(false);
  };

  const handleCloseModal = () => {
    setIsOpen(false); // Close the modal
    setModalType(""); // Reset modal type
  };

  const handleCloseMaster = () => {
    setAccountMaster(false);
  };

  const fetchEntries = async () => {
    try {
      const response = await getAccount(); // Replace with your API endpoint
      setEntries(response.data);
      console.log(response.data);
      setFilteredEntries(response.data); // Default filtered data
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const fetchAccountMasters = async () => {
    try {
      const response = await getAccountMaster();
      setAccountMasters(response.data);
      console.log(response.data);
      // setAccountMasters(data);
    } catch (error) {
      console.error("Error fetching account masters:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountGroup = async () => {
    try {
      const response = await getAccountGroup();
      setAccountGroup(response.data);
      console.log(response.data);
      // setAccountMasters(data);
    } catch (error) {
      console.error("Error fetching account masters:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      let response;

      if (editId) {
        // Update existing record
        response = await UpdateAccount(editId, data); // Replace with your API function for updates
        setSubmitStatus("Receipt updated successfully!");
        notyf.success("Data updated successfully!");
      } else {
        // Create new record
        response = await StoreAccount(data); // Replace with your API function for creation
        console.log(response);
        setSubmitStatus("Receipt created successfully!");
        notyf.success("Data placed successfully!");
      }

      reset(); // Reset the form after successful submission
      setEditId(null); // Clear edit ID for future creates
      fetchEntries(); // Refresh entries after update or create
    } catch (error) {
      console.error(error);
      setSubmitStatus("Failed to save receipt.");
      notyf.error("Failed to save data. Please try again.");
    }
  };

  const onmasterSubmit = async (data) => {
    try {
      // Send the data to the backend
      const response = await StoreAccountMaster(data);
      // console.log(StoreAccount);
      setSubmitStatus("Receipt created successfully!");
      notyf.success(`Data placed successfully!`);
      fetchAccountMasters();
      reset(); // Reset the form after successful submission
    } catch (error) {
      console.error(error);
      setSubmitStatus("Failed to create receipt.");
      notyf.error("Failed to place order. Please try again.");
    }
  };
  const populateFormData = (data) => {
    console.log("Populating form with data:", data);
    Object.keys(data).forEach((key) => {
      setValue(key, data[key] || ""); // Set value or default to empty
    });
  };

  const onmasterSubmitgroup = async (data) => {
    try {
      // Send the data to the backend
      const response = await createAccountGroup(data);
      console.log(response);
      setSubmitStatus("Receipt created successfully!");
      notyf.success(`Data placed successfully!`);
      fetchAccountGroup();
      reset(); // Reset the form after successful submission
    } catch (error) {
      console.error(error);
      setSubmitStatus("Failed to create receipt.");
      notyf.error("Failed to place order. Please try again.");
    }
  };

  const openModal = (title) => {
    setModalTitle(title);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTitle("");
  };

  const handleDelete = async (id) => {
    try {
      const response = await DeleteAccount(id);
      if (response.status === 200) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
      fetchEntries();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="  absolute top-0 right-0 left-0 bottom-0 bg-gray-100">
      {/* Hidden printable component */}
      {isPrintMode && selectedEntries.length > 0 && (
        <div id="print-mode">
          <PrintPdf
            entries={filteredEntries.filter((entry) =>
              selectedEntries.includes(entry.id)
            )}
          />
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-green-700 text-center p-3 text-white">
        {" "}
        Account Entries
      </div>
      <div className="flex items-center gap-4 mb-4 px-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From:
          </label>
          <input
            type="date"
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To:</label>
          <input
            type="date"
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filter:
          </label>
          <select
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="RECEIPT">RECEIPT</option>
            <option value="PAYMENT">PAYMENT</option>
            <option value="JOURNAL">JOURNAL</option>
            <option value="CONTRA">CONTRA</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg bg-white rounded-lg">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-orange-500">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wide border">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wide border">
                Voucher No
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wide border">
                Debit A/c
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wide border">
                Credit A/c
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wide border">
                Voucher Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wide border">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wide border">
                Narration
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wide border">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEntries.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-2 text-center text-sm text-gray-700"
                >
                  No entries found
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    {entry.rcp_no}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    {entry.recive_id === 0 ? "Cash" : "Online"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    {entry.accountmasters?.account_name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    {entry.account_type}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    {entry.amount}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    {entry.narration}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => handlePrint(entry.id)}
                      >
                        <FaPrint />
                      </button>
                      <button
                        className="text-gray-600 hover:text-green-600"
                        onClick={() => handleOpenModal("edit", entry)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="text-gray-600 hover:text-red-600"
                        onClick={handleDelete}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Button */}
      <button
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 focus:outline-none"
        onClick={() => openModal("Add Entry")}
      >
        +
      </button>

      {/* Modal */}
      <Modals account={isModalOpen} onCloses={closeModal} title={modalTitle}>
        {/*<p>This is the modal content for {modalTitle}.</p>*/}
        {/* Add dynamic form or content here */}
        <ul className="space-y-2">
          <li
            className="border-b p-2"
            onClick={() => handleOpenModal("receipt")}
          >
            RECIEPT
          </li>
          <li
            className="border-b p-2"
            onClick={() => handleOpenModal("payment")}
          >
            PAYMENT
          </li>
          <li
            className="border-b p-2"
            onClick={() => handleOpenModal("contra")}
          >
            CONTRA
          </li>
          <li
            className="border-b p-2"
            onClick={() => handleOpenModal("journal")}
          >
            JOURNAL
          </li>
          <li className="border-b p-2">REPORTS</li>
        </ul>
      </Modals>
      <Modal
        open={isOpen}
        onClose={handleCloseModal}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            {/* Modal Header */}
            <h2 className="text-xl font-semibold text-center mb-4">
              {modalType === "edit" ? "Edit Receipt" : "Create Receipt"}
            </h2>

            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Receipt No */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Receipt No
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value="RC6"
                  readOnly
                />
              </div>

              {/* Check-IN Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Check-IN Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("checkin_date", {
                    required: "Check-IN Date is required",
                  })}
                />
                {errors.checkin_date && (
                  <p className="text-red-500 text-sm">
                    {errors.checkin_date.message}
                  </p>
                )}
              </div>

              {/* Account */}
              <div className="mb-4 flex space-x-3">
                <div className="w-[80%]">
                  <select
                    name="customer_id"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("customer_id", {
                      required: "Account selection is required",
                    })}
                  >
                    <option value="">Search For Account</option>
                    {accountMasters.map((am) => (
                      <option key={am.id} value={am.id}>
                        {am.account_name}
                      </option>
                    ))}
                  </select>
                  {errors.customer_id && (
                    <p className="text-red-500 text-sm">
                      {errors.customer_id.message}
                    </p>
                  )}
                </div>

                {/* Add Account Button */}
                <div
                  className="grid place-items-center mt-3 cursor-pointer"
                  onClick={handleMaster}
                >
                  <FaUserPlus className="text-[2rem]" />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <select
                  name="recive_id"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("recive_id", {
                    required: "Payment method is required",
                  })}
                >
                  <option value="">Search For Account</option>
                  <option value="1">Cash</option>
                  <option value="2">UPI</option>
                </select>
                {errors.recive_id && (
                  <p className="text-red-500 text-sm">
                    {errors.recive_id.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 1, message: "Amount must be at least 1" },
                  })}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Ref No */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Ref No</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("ref_no")}
                />
              </div>

              {/* Narration */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Narration
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  {...register("narration")}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-[20%] bg-blue-500 text-white py-2 rounded shadow hover:bg-blue-600 focus:outline-none"
              >
                {modalType === "edit" ? "Update" : "Submit"}
              </button>

              {/* Submission Status */}
              {submitStatus && (
                <p className="text-center mt-4">{submitStatus}</p>
              )}
            </form>
          </div>
        </div>
      </Modal>

      {accountmaster && (
        <Modal open={accountmaster} onClose={handleCloseMaster} center>
          <div className="p-6 bg-white rounded-md shadow-md max-w-lg mx-auto">
            <h1 className="text-lg font-bold mb-4">Account Form</h1>
            <form onSubmit={handleSubmitSecond(onmasterSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    {...registerSecond("account_name", {
                      required: "Account Name is required",
                      maxLength: 255,
                    })}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.account_name && (
                    <span className="text-red-500 text-xs">
                      {errors.account_name.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    {...registerSecond("type", {
                      required: "Type is required",
                    })}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="SUPPLIER">SUPPLIER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    {...registerSecond("gstin", {
                      required: "GSTIN is required",
                      maxLength: 15,
                    })}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.gstin && (
                    <span className="text-red-500 text-xs">
                      {errors.gstin.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone No
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    {...registerSecond("phone", {
                      required: "Phone number is required",
                      pattern: /^\d{10}$/,
                    })}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                <div className="flex space-x-3">
                  <div className="w-[80%]">
                    <label className="block text-sm font-medium mb-1">
                      Select Group
                    </label>
                    <select
                      {...registerSecond("account_group_id", {
                        required: "Group is required",
                      })}
                      className="flex-1 w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Group</option>
                      {accountgroup.map((grp) => (
                        <option value={grp.id} key={grp.id}>
                          {grp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    onClick={handleGroup}
                    className=" grid place-items-center"
                  >
                    <div className="bg-green-600 h-[30px] rounded grid place-items-center text-white  w-[30px]  ">
                      <FaPlus />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <textarea
                    maxLength={250}
                    {...registerSecond("address")}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select City
                  </label>
                  <select
                    {...registerSecond("city", {
                      required: "City is required",
                    })}
                    className="flex-1 border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select City</option>
                    <option value="kolkata">Kolkata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select State
                  </label>
                  <select
                    {...registerSecond("state", {
                      required: "State is required",
                    })}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select State</option>
                    <option value="west bengal">West Bengal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    {...registerSecond("contact_person", {
                      required: "Contact person is required",
                      maxLength: 255,
                    })}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Opening
                  </label>
                  <input
                    type="text"
                    {...registerSecond("blance", {
                      required: "Balance is required",
                      pattern: /^[0-9]*$/,
                    })}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Is Debit?
                  </label>
                  <div className="flex items-center gap-2">
                    <span>No</span>
                    <input
                      type="checkbox"
                      {...registerSecond("status")}
                      checked={isDebit}
                      onChange={() => setIsDebit(!isDebit)}
                      className="toggle-checkbox"
                    />
                    <span>Yes</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      <Modal open={masterGroup} onClose={handleCloseGroup}>
        <form onSubmit={handleSubmitThree(onmasterSubmitgroup)}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Account Name
            </label>
            <input
              type="text"
              {...registerThree("name", {
                required: " Name is required",
                maxLength: 255,
              })}
              className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AccountsEntries;
