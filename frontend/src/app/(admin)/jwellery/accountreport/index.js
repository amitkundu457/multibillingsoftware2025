"use client";
import { Modal } from "react-responsive-modal";
import React, { useState, useRef, useEffect } from "react";
import { State, City } from "country-state-city";
import "react-responsive-modal/styles.css";
import { useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";

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
  getAccountType,
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
import toast from "react-hot-toast";

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
  const [accountType, setAccountType] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [transactionNumber, setTransactionNumber] = useState("");

  const [newAccountType, setNewAccountType] = useState("");
  const [newGroupType, setNewGroupType] = useState("");

  const [accountTypeModal, setAccountTypeModal] = useState(false);
  const [groupTypeModal, setGroupTypeModal] = useState(false);

  const [masterGroup, setMasterGroup] = useState(false);

  const selectedCountry = "IN"; // Set country to India (ISO code 'IN')
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Fetch states for India (country code 'IN')
  useEffect(() => {
    const statesList = State.getStatesOfCountry(selectedCountry).map(
      (state) => ({
        value: state.isoCode,
        label: state.name,
      })
    );
    console.log("stateList", statesList);
    setStates(statesList);
    setSelectedState(null); // Reset state selection when country changes
    setCities([]); // Clear cities when country changes
    setSelectedCity(null); // Reset city selection when country changes
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    console.log("selecte_County", selectedState);
    if (selectedState) {
      const citiesList = City.getCitiesOfState(
        selectedCountry,
        selectedState.value
      ).map((city) => ({
        value: city.name,
        label: city.name,
      }));
      console.log("citysList", citiesList);
      setCities(citiesList);
      setSelectedCity(null); // Reset city selection when state changes
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedState]);

  // Handle state selection
  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setValue("state", selectedOption ? selectedOption.label : ""); // Update form state
  };

  // Handle city selection
  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setValue("city", selectedOption ? selectedOption.label : ""); // Update form city
  };

  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      checkin_date: new Date().toISOString().split("T")[0],
      credit_customer_id: "",
      debit_customer_id: "",
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
    fetchAccountType();
  }, [modalType, setValue]);


  const applyFilters = useCallback(() => {
    const filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      entryDate.setHours(0, 0, 0, 0); // Normalize entry date to start of day
  
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      if (fromDate) fromDate.setHours(0, 0, 0, 0); // Normalize from date
  
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      if (toDate) toDate.setHours(23, 59, 59, 999); // Normalize to end of day
  
      const isWithinDateRange =
        (!fromDate || entryDate >= fromDate) &&
        (!toDate || entryDate <= toDate);
  
      const matchesFilter = entry.account_type === filter;
  
      return isWithinDateRange && matchesFilter;
    });
  
    setFilteredEntries(filtered);
  }, [entries, dateRange, filter]);
  
  useEffect(() => {
    applyFilters(); // ✅ Runs every time filter changes
  }, [dateRange, filter, entries, applyFilters]);
  useEffect(() => {
    if (modalType) {
      axios
        .get(`https://api.equi.co.in/api/last-transaction-number/${modalType}`)
        .then((response) => setTransactionNumber(response.data.transaction_no))
        .catch((error) =>
          console.error("Error fetching transaction number:", error)
        );
    }
  }, [modalType]);

  const fetchLastTransactionNumber = async (transactionType) => {
    try {
      const response = await fetch(
        `https://api.equi.co.in/api/last-transaction-number/${transactionType}`
      );
      const data = await response.json();
      return data.transaction_no; // Assuming API returns { transaction_no: "XXX" }
    } catch (error) {
      console.error("Error fetching transaction number:", error);
      return null;
    }
  };

  useEffect(() => {
    applyFilters();
  }, [dateRange, filter, entries, applyFilters]);

  const handleOpenModal = (type, entryData) => {
    setModalType(type); // Set the type (e.g., payment, receipt)
    setModalNumber(generateModalNumber(type)); // Generate the dynamic number

    setIsOpen(true); // Open the modal
    console.log("edit data",entryData);
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

  //store group type
  const groupTypeSubmit = async (e) => {
    e.preventDefault();
    const data = { name: newGroupType };
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    // console.log("data group type", data);
    try {
      const res = await axios.post(
        " https://api.equi.co.in/api/account-groups",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Account Group Created");
      fetchAccountGroup();
    } catch (error) {
      toast.error("Account Not Created Failed");
    }
  };

  //store account type
  const accountTypeSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    const data = { name: newAccountType };

    try {
      const response = await fetch(" https://api.equi.co.in/api/account-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Successfully submitted, close the modal and handle success
        alert("Account Type saved successfully!");
        setNewAccountType(""); // Clear the input field
        handleCloseAccountType(); // Close the modal

        // Optionally, refetch the account types after submission
        fetchAccountType(); // You can call a function passed as prop to re-fetch
      } else {
        alert("Failed to save Account Type");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleAccountType = () => {
    setAccountTypeModal(true);
  };
  const handleCloseAccountType = () => {
    setAccountTypeModal(false);
  };

  const handelGroupType = () => {
    setGroupTypeModal(true);
  };

  const handelCloaseGroupType = () => {
    setGroupTypeModal(false);
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
      const response = await getAccount(); // Fetch data from API
      setEntries(response.data);
      console.log("acmount reports", response);
      setFilteredEntries((prevFilteredEntries) => {
        // Preserve the previous filter if applied
        return prevFilteredEntries.length > 0
          ? response.data.filter((item) =>
              prevFilteredEntries.some((prev) => prev.id === item.id)
            )
          : response.data; // Otherwise, show all data
      });
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

  const fetchAccountType = async () => {
    try {
      const response = await getAccountType();
      setAccountType(response.data);
    } catch (error) {
      loading(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      let response;

      if (!editId) {
        // Fetch last transaction number only when creating a new record
        const newTransactionNo = await fetchLastTransactionNumber(
          data.transaction_type
        );
        // data.transaction_no = newTransactionNo; // Assign generated number
      }

      if (editId) {
        response = await UpdateAccount(editId, data);
        setSubmitStatus("Record updated successfully!");
        notyf.success("Data updated successfully!");
        setIsOpen(false); // Close the modal
    setModalType("");
      } else {
        response = await StoreAccount(data);
        console.log(response);
        setSubmitStatus("Record created successfully!");
        notyf.success("Data placed successfully!");
        setIsOpen(false); // Close the modal
    setModalType("");
      }

      reset();
      setEditId(null);
      fetchEntries();
    } catch (error) {
      console.error(error);
      setSubmitStatus("Failed to save record.");
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
      setIsOpen(false); // Close the modal
    setModalType("");
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

  const handleSubmitdata = async (event) => {
    event.preventDefault();

    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.status = isDebit ? 1 : 0;

    // Include selected state and city in the data
    if (selectedState) data.state = selectedState.value;
    if (selectedCity) data.city = selectedCity.value;

    try {
      const response = await axios.post(
        " https://api.equi.co.in/api/account-masters",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer YOUR_ACCESS_TOKEN",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Success:", response.data);
      event.target.reset();
    } catch (error) {
      console.error("Error:", error);
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
        setFilteredEntries((prevItems) =>
          prevItems.filter((item) => item.id !== id)
        );
      }
      fetchEntries();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const [modalNumber, setModalNumber] = useState("");

  const generateModalNumber = (type) => {
    // Define prefixes for different types
    const prefixMap = {
      receipt: "RCP",
      payment: "PAY",
      contra: "CON",
      journal: "JRN",
    };

    const prefix = prefixMap[type] || "GEN"; // Default to "GEN" if type not found

    // Fetch the last stored number (for demo, we're just incrementing manually)
    let lastNumber = 1; // Ideally, fetch from API or database
    return `${prefix}${String(lastNumber).padStart(2, "0")}`; // Format as Con01, Rec01, etc.
  };

  const paymentMethods = {
    1: "Cash",
    2: "UPI",
    3: "Card",
    4: "Net Banking",
    5: "NEFT",
    6: "Bank Transfer",
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
            className="mt-1  p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    {paymentMethods[entry.recive_id] ||
                      entry.debit_customer?.account_name ||
                      "N/A"}
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    {entry.credit_customer?.account_name || "N/A"}
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
                      {/* <button
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => handlePrint(entry.id)}
                      >
                        <FaPrint />
                      </button> */}
                      <button
                        className="text-gray-600 hover:text-green-600"
                        onClick={() => handleOpenModal("edit", entry)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="text-gray-600 hover:text-red-600"
                        onClick={() => handleDelete(entry.id)}
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
          {["receipt", "payment", "contra", "journal"].map((type) => (
            <li
              key={type}
              className="border-b p-2 hover:cursor-pointer hover:text-green-700"
              onClick={() => handleOpenModal(type)}
            >
              {type.toUpperCase()}
            </li>
          ))}
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
        <div className="bg-gray-100 min-h-screen flex justify-center items-center rounded-md">
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
                  Enter{" "}
                  {modalType
                    ? modalType.charAt(0).toUpperCase() +
                      modalType.slice(1) +
                      " No"
                    : "Entry No"}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={transactionNumber}
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
                  defaultValue={new Date().toLocaleDateString("en-CA")} // Format MM/DD/YYYY
                  min={new Date().toISOString().split("T")[0]} // Prevent past dates
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
                <label>Credit Account</label>
                  <select
                    name="credit_customer_id"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("credit_customer_id", {
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
                  {errors.credit_customer_id && (
                    <p className="text-red-500 text-sm">
                      {errors.credit_customer_id.message}
                    </p>
                  )}
                </div>
                <span className="text-green-500 font-bold">Cr.</span>

                {/* Add Account Button */}
                <div
                  className="grid place-items-center mt-3 cursor-pointer"
                  onClick={handleMaster}
                >
                  <FaUserPlus className="text-[2rem]" />
                </div>
              </div>

              {/* Account */}
              <div className="mb-4 flex space-x-3">
                {modalType === "contra" || modalType === "journal" ? (
                  <>
                    <div className="w-[80%]">
                      
                      <label>Debit Account</label>
                      <select
                        name="debit_customer_id"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("debit_customer_id", {
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
                      {errors.debit_customer_id && (
                        <p className="text-red-500 text-sm">
                          {errors.debit_customer_id.message}
                        </p>
                      )}
                    </div>
                    <span className="text-red-500 font-bold">Dt.</span>
                  </>
                ) : null}
              </div>

              {/* Payment Method */}
              {(modalType === "receipt" || modalType === "payment") && (
                <div className="mb-4">
                  <label>Debit Account</label>
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
                    <option value="3">Card</option>
                    <option value="4">Net Banking</option>
                    <option value="5">NEFT</option>
                    <option value="6">Bank Transfer</option>
                  </select>
                  {errors.recive_id && (
                    <p className="text-red-500 text-sm">
                      {errors.recive_id.message}
                    </p>
                  )}
                </div>
              )}

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
            <form onSubmit={handleSubmitdata}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="account_name"
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Type
                  </label>
                  <select
                    name="account_type_id"
                    className="flex-grow p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select account type</option>
                    {accountType.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>

                  <div
                    onClick={handleAccountType}
                    className="bg-green-600 h-[30px] w-[30px] rounded grid place-items-center text-white ml-2"
                  >
                    <FaPlus />
                  </div>
                </div> */}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    maxLength={15}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone No
                  </label>
                  <input
                    type="text"
                    name="phone"
                    maxLength={10}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Group
                  </label>
                  <select
                    name="account_group_id"
                    className="flex-1 w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Group</option>
                    {accountgroup.map((grp) => (
                      <option value={grp.id} key={grp.id}>
                        {grp.name}
                      </option>
                    ))}
                  </select>
                  <div
                    onClick={handelGroupType}
                    className="bg-green-600 h-[30px] w-[30px] rounded grid place-items-center text-white ml-2"
                  >
                    <FaPlus />
                  </div>
                </div>
                {/* <div onClick={handleGroup} className=" grid place-items-center">
                  <div className="bg-green-600 h-[30px] rounded grid place-items-center text-white  w-[30px]  ">
                    <FaPlus />
                  </div>
                </div> */}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    maxLength={250}
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select State
                  </label>
                  <Select
                    value={selectedState}
                    onChange={handleStateChange}
                    options={states}
                    placeholder="Select State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select City
                  </label>
                  <Select
                    value={selectedCity}
                    onChange={handleCityChange}
                    options={cities}
                    isDisabled={!selectedState}
                    placeholder="Select City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contact_person"
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Opening balance
                  </label>
                  <input
                    type="text"
                    name="blance"
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
                      name="status"
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
              Account Group
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

      {/* account type model */}

      <Modal open={accountTypeModal} onClose={handleCloseAccountType}>
        <div className="modal-content">
          <form onSubmit={accountTypeSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Account Type
              </label>
              <input
                type="text"
                placeholder="Enter Account Type"
                name="newAccountType"
                value={newAccountType}
                onChange={(e) => setNewAccountType(e.target.value)} // Update the state
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
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

      {/* group type model */}

      <Modal open={groupTypeModal} onClose={handelCloaseGroupType}>
        <div className="modal-content">
          <form onSubmit={groupTypeSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Group Type
              </label>
              <input
                type="text"
                placeholder="Enter Group Type"
                name="newGroupType"
                value={newGroupType}
                onChange={(e) => setNewGroupType(e.target.value)} // Update the state
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
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
    </div>
  );
};

export default AccountsEntries;
