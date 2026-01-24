"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import { Notyf } from "notyf";
import { useForm } from "react-hook-form";
import "react-responsive-modal/styles.css";
import "notyf/notyf.min.css"; // Import Notyf styles
import { Country, State, City } from "country-state-city";
import { GetCountries, GetCity, GetState } from "react-country-state-city";
import toast from "react-hot-toast";
import { getphoneSearch } from "../../../../app/components/config";

const CustomerModal = ({
  isModalOpen,
  closeModal,
  modalType,
  currentCustomer,
  // customerTypeData,
  // customerSubTypeData,
}) => {
  const [loading, setLoading] = useState(false);
  // const[customerType, setCustomerType] = useState([])
  // const[customerSubType, setCustomerSubType] = useState([])
  const [customerTypeData, setCustomerTypeData] = useState([]);
  const [customerSubTypeData, setCustomerSubTypeData] = useState([]);
  const [smsModal, setSmsModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState(null); // holds added customer data
  const [customerData, setCustomerData] = useState(null);
  const [refreshPhone, setRefreshPhone] = useState(false);
  // const[CustomerEnquiry ,setEnuiry]=useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedStage, setSelectedStage] = useState("");
  const [amount, setAmount] = useState("");
  // const [loading, setLoading] = useState(false);
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

  const defaultValues = {
    name: "",
    phone: "",
    gstNo: "",
    dob: "",
    anniversary: "",
    email: "",
    gender: "",
    address: "",
    pincode: "",
    state: "",
    country: "",
    city: "",
    visit_source: "",
    customerTypeData: "",
    customerSubTypeData: "",
    customerEnquiry: "customer",
    remarke: "",
  };

  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     name: "",
  //     phone: "",
  //     dob: "",
  //     anniversary: "",
  //     email: "",
  //     gender: "",
  //     address: "",
  //     pincode: "",
  //     state: "",
  //     country: "",
  //     city: "",
  //     visit_source: "",
  //     // customerType: "",
  //     // customerSubType: "",
  //     customerTypeData: "",
  //     customerSubTypeData: "",
  //     customerEnquiry: "customer",
  //     remarke: "",

  //     // customer_sub_type:customerTypeData,

  //     // customer_type
  //   },
  // });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const notyf = new Notyf(); // Initialize Notyf for notifications

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Load countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry);
      setStates(stateList);
      setCities([]); // Clear cities
      setValue("state", "");
      setValue("city", "");
    }
  }, [selectedCountry, setValue]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    axios
      .get(" https://apibrize.brizindia.com/api/customerstype", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCustomerTypeData(res.data.data);
      })
      .catch(() => {
        alert("Failed to fetch customer types");
      });

    axios
      .get(" https://apibrize.brizindia.com/api/customersubtypes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCustomerSubTypeData(res.data);
      })
      .catch(() => {
        alert("Failed to fetch customer sub-types");
      });
  }, []);

  // useEffect(() => {
  //   if (modalType === "edit" && currentCustomer) {
  //     reset(currentCustomer);
  //     setCustomerData(currentCustomer); // preload customer data
  //   } else {
  //     reset(); // clear form
  //     setCustomerData(null); // clear fetched customer data
  //   }
  // }, [modalType, currentCustomer, reset]);

  useEffect(() => {
    if (modalType === "edit" && currentCustomer) {
      reset({
        ...defaultValues,
        ...currentCustomer,
      });
      setCustomerData(currentCustomer);
    } else {
      reset(defaultValues);
      setCustomerData(null);
    }
  }, [modalType, currentCustomer, reset]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const onSubmit = async (data) => {
    try {
      console.log("data customber type", data);
      setLoading(true);
      console.log("data.....", data);
      console.log("data.customerType", data.customerType);
      const token = getCookie("access_token"); // Retrieve token

      // const payload = {
      //   ...data,
      // };
      const payload = {
        ...data,
        customer_type: data.customerType, // Mapping to backend's expected field
        customer_sub_type: data.customerSubType || null, // Ensure the sub type is sent as null if not provided
      };
      console.log("payload", payload);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
          "Content-Type": "application/json",
        },
      };

      const dataToSend = {
        ...payload, // all your form data
        ...(customerData?.customer_id && {
          customer_id: customerData.customer_id,
        }), // only add customer_id if it exists
      };

      if (modalType === "create") {
        try {
          const res = await axios.post(
            " https://apibrize.brizindia.com/api/customers",
            dataToSend,
            config
          );

          closeModal();
          setSmsModal(true);
          setNewCustomer(res.data.customer?.phone || res.data[1]?.phone); // adjust based on your backend
          toast.success("Customer created successfully!");
          reset();
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong!");
        }
      } else if (modalType === "edit") {
        await axios.post(
          `  https://apibrize.brizindia.com/api/customers/${currentCustomer.id}`,
          payload,
          config
        );
        toast.success("Customer updated successfully!");
      }

      closeModal();
      setLoading(false);
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data.message || "This number already exists.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }

      setLoading(false);
    }
  };

  const handleSendSms = async () => {
    try {
      await axios.post(
        " https://apibrize.brizindia.com/api/send-customer-sms",
        {
          phone: newCustomer,
          status: "Registered Customer",
          sms_credential_id: 1,
        }
      );
      setSmsModal(false);
      // alert("SMS sent successfully");
    } catch (err) {
      alert("SMS failed to send");
      console.error(err);
    }
    // Close modal
  };

  const phone = watch("phone");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (phone && phone.length >= 10 && modalType === "create") {
        getphoneSearch(phone)
          .then((res) => {
            if (res?.data) {
              const customer = res.data;
              setCustomerData(customer);

              // fill fields only in create mode
              setValue("name", customer.name);
              setValue("address", customer.address);
              setValue("email", customer.email);
              setValue("phone", customer.phone);
              setValue("dob", customer.dob);
              setValue("anniversary", customer.anniversary);
              setValue("gender", customer.gender);
              setValue("pincode", customer.pincode);
              setValue("gstNo", customer.gstNo);
              setValue("state", customer.state);
              setValue("country", customer.country);
              setValue("remarke", customer.remarke);
              setValue("customerTypeData", customer.customer_type);
              setValue("customerSubTypeData", customer.customer_sub_type);
              setValue("customerEnquiry", customer.customerEnquiry);
            }
          })
          .catch(() => {
            console.log("Customer not found.");
          });
      }
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [phone, refreshPhone, setValue, modalType]);

  return (
    <>
      <Modal open={isModalOpen} onClose={closeModal} center>
        <div className="p-6 w-[800px]">
          <h2 className="mb-4 text-2xl font-bold">
            {modalType === "create" ? "Add Customerss" : "Edit Customer"}
          </h2>
          {/* Loyalty Info (Only when customer found via phone search) */}

          {customerData?.loyalty?.length > 0 && (
            <div className="p-4 mb-4 border border-green-300 rounded-md bg-green-50">
              <h3 className="mb-2 text-sm font-semibold text-green-700">
                Loyalty Details
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Total Loyalty Points</span>
                  <p className="font-semibold text-gray-800">
                    {customerData?.loyalty[0]?.redeem_points}
                  </p>
                </div>
              </div>

              {customerData?.stage?.length > 0 &&
                (() => {
                  const redeemPoints = customerData?.loyalty[0]?.redeem_points;

                  const sortedStages = [...customerData?.stage].sort(
                    (a, b) => a.loyalty_balance - b.loyalty_balance
                  );

                  const unlockedStages = sortedStages?.filter(
                    (s) => redeemPoints >= s.loyalty_balance
                  );

                  const currentStage = unlockedStages.at(-1);

                  return (
                    <>
                      <p className="mb-2 text-xs font-semibold text-green-700">
                        🎯 Stage Progress
                      </p>

                      <div className="space-y-2">
                        {sortedStages.map((stage, index) => {
                          const unlocked =
                            redeemPoints >= stage?.loyalty_balance;

                          return (
                            <div
                              key={stage.id}
                              className={`flex items-center justify-between p-3 rounded-md border
                    ${
                      unlocked
                        ? "bg-green-600 text-white border-green-700"
                        : "bg-white text-gray-500 border-gray-300"
                    }`}
                            >
                              <div>
                                <p className="text-sm font-semibold capitalize">
                                  {index + 1}.{" "}
                                  {stage.category.replace("_", " ")}
                                </p>
                                <p className="text-xs">
                                  Required: {stage.loyalty_balance} pts
                                </p>
                              </div>

                              <div className="text-xs text-right">
                                <p>🎁 Redeem Amount ₹{stage.cashback}</p>
                                <p>⭐ {stage.set_loyalty_points} ₹ per Point</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {currentStage && (
                        <p className="mt-3 text-xs font-semibold text-green-700">
                          ✅ Customer eligible up to{" "}
                          <span className="uppercase">
                            {currentStage.category.replace("_", " ")}
                          </span>
                        </p>
                      )}
                    </>
                  );
                })()}
            </div>
          )}
          {/* ---------- REDEEM SECTION ---------- */}
          {/* {customerData?.stage?.length > 0 && (
            <div className="p-4 mt-5 bg-white border border-green-300 rounded-md">
              <h4 className="mb-3 text-sm font-semibold text-green-700">
                🔁 Redeem / Add Loyalty Points
              </h4>

              {(() => {
                const redeemPoints = customerData.loyalty[0].redeem_points;

                const accessibleStages = customerData.stage.filter(
                  (stage) => redeemPoints >= stage.loyalty_balance
                );

                const cashback = accessibleStages?.cashback ?? 0;
                const isAmountValid = amount && Number(amount) >= cashback;

                return (
                  <>
                   
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                     
                      <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        className="p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="">Select Stage</option>
                        {accessibleStages.map((stage) => (
                          <option key={stage.category} value={stage.category}>
                            {stage.category.replace("_", " ").toUpperCase()}
                          </option>
                        ))}
                      </select>

                     
                      <input
                        type="number"
                        placeholder="Enter Amount ₹"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                      />

                      {selectedStage && amount && !isAmountValid && (
                        <p className="mt-1 text-xs text-red-600">
                          ⚠ Amount must be ≥ ₹{cashback}
                        </p>
                      )}

                      
                      <button
                        // disabled={!selectedStage || !amount || loading}
                        disabled={
                          !selectedStage || !amount || !isAmountValid || loading
                        }
                        onClick={async () => {
                          try {
                            setLoading(true);
                            const token = getCookie("access_token");

                            await axios.post(
                              "https://apibrize.brizindia.com/api/loyalty/redeem-stage",
                              {
                                customer_id:
                                  customerData.loyalty[0].customer_id,
                                stage_category: selectedStage,
                                amount: amount,
                              },
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );

                            alert("Loyalty points updated successfully ✅");

                            setSelectedStage("");
                            setAmount("");
                          } catch (err) {
                            alert("Something went wrong ❌");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Apply"}
                      </button>
                    </div>

                    
                    <p className="mt-2 text-xs text-gray-500">
                      ℹ Loyalty balance will be adjusted based on selected stage
                      & amount.
                    </p>
                  </>
                );
              })()}
            </div>
          )} */}

          {customerData?.stage?.length > 0 && (
            <div className="p-4 mt-5 bg-white border border-green-300 rounded-md">
              <h4 className="mb-3 text-sm font-semibold text-green-700">
                🔁 Redeem / Add Loyalty Points
              </h4>

              {(() => {
                const redeemPoints = customerData?.loyalty[0]?.redeem_points;

                // Stages user can access
                const accessibleStages = customerData?.stage?.filter(
                  (stage) => redeemPoints >= stage?.loyalty_balance
                );

                // ✅ Selected stage object
                const selectedStageData = accessibleStages.find(
                  (stage) => stage.category === selectedStage
                );

                // ✅ Cashback of selected stage
                const cashback = selectedStageData?.cashback ?? 0;

                // ✅ Amount validation
                const isAmountValid =
                  selectedStage && amount && Number(amount) >= Number(cashback);

                return (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {/* STAGE DROPDOWN */}
                      <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        className="p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="">Select Stage</option>
                        {accessibleStages.map((stage) => (
                          <option key={stage.category} value={stage.category}>
                            {stage.category.replace("_", " ").toUpperCase()}
                          </option>
                        ))}
                      </select>

                      {/* AMOUNT INPUT */}
                      <div>
                        <input
                          type="number"
                          placeholder="Enter Amount ₹"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                        />

                        {/* ❌ Validation Message */}
                        {selectedStage && amount && !isAmountValid && (
                          <p className="mt-1 text-xs text-red-600">
                            ⚠ Amount must be greater than or equal to ₹
                            {cashback}
                          </p>
                        )}
                      </div>

                      {/* APPLY BUTTON */}
                      <button
                        disabled={
                          !selectedStage || !amount || !isAmountValid || loading
                        }
                        onClick={async () => {
                          try {
                            setLoading(true);
                            const token = getCookie("access_token");

                            await axios.post(
                              "https://apibrize.brizindia.com/api/loyalty/redeem-stage",
                              {
                                customer_id:
                                  customerData.loyalty[0].customer_id,
                                stage_category: selectedStage,
                                amount: amount,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );

                            alert("Loyalty points updated successfully ✅");
                            setSelectedStage("");
                            setAmount("");
                            setRefreshPhone((refreshPhone) => !refreshPhone);
                          } catch (err) {
                            alert("Something went wrong ❌");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Apply"}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      ℹ Loyalty balance will be adjusted based on selected stage
                      & amount.
                    </p>
                  </>
                );
              })()}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex justify-between w-full">
                <div className="w-[48%]">
                  <label className="block text-gray-700">Customer Name</label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-[48%]">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    {...register("phone")}
                    type="text"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* <div className="flex space-x-3">
            <div className="w-[300px]">
              <label className="block text-gray-700">Phone</label>
              <input
                {...register("phone")}
                type="text"
                required
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div> */}

            {/* type ,subtype anniversary */}

            {/* {rateMaster.map((rates) => (
                    <option key={rates.id} value={rates.id}>
                      {rates.labelhere} &mdash; ({rates.rate})
                    </option>
                  ))} */}

            {/* customerTypeData:"",
      customerSubTypeData:"" */}
            <div className="flex space-x-3">
              <div className="w-full">
                <label className="block text-gray-700">Customer Type</label>
                <select
                  {...register("customerTypeData")}
                  className="w-full p-2 border"
                >
                  <option value="">Select Customer Type</option>
                  {customerTypeData?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className="block text-gray-700">Customer Sub Type</label>
                <select
                  {...register("customerSubTypeData")}
                  className="w-full p-2 border"
                >
                  <option value="">Select Customer Sub Type</option>
                  {customerSubTypeData?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="w-full">
                <label className="block text-gray-700">DOB</label>
                <input
                  type="date"
                  {...register("dob")}
                  className="w-full p-2 border"
                />
              </div>
              <div className="w-full">
                <label className="block text-gray-700">Anniversary</label>
                <input
                  type="date"
                  {...register("anniversary")}
                  className="w-full p-2 border"
                />
              </div>
            </div>

            {/* Gender Field CustomerEnquiry */}
            <div className="flex justify-between w-full space-x-2">
              <div className="w-full ">
                <label className="block text-gray-700">Gender</label>
                <select
                  {...register("gender")}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="customerEnquiry text-gray-700">
                  Purpose of Visit
                </label>
                {/* Select purpose for customer visiting the shop */}
                <select
                  id="customerEnquiry"
                  defaultValue="customer"
                  {...register("customerEnquiry")}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="customer">Customer</option>
                  <option value="prospective">Prospect</option>
                </select>
              </div>
            </div>

            {/* Other form fields */}
            <div className="flex space-x-3">
              <div className="w-full">
                <label className="block text-gray-700">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* sate */}
            <div className="flex space-x-3">
              <div className="w-full">
                <label className="block text-gray-700">Address</label>
                <input
                  {...register("address")}
                  type="text"
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <div className="w-full">
                <label className="block text-gray-700">Pincode</label>
                <input
                  {...register("pincode")}
                  type="text"
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="w-full">
                <label className="block text-gray-700">Gst No</label>
                <input
                  {...register("gstNo")}
                  type="text"
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">State</label>
              <input
                {...register("state")}
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <div className="w-full">
              <label className="block text-gray-700">Country</label>
              <input
                {...register("country")}
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div> */}

            <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
              {/* Country Field */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Country <span className="text-red-500"></span>
                </label>
                <select
                  {...register("country")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-xs text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* State Field */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  State <span className="text-red-500"></span>
                </label>
                <select
                  {...register("state")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-red-500">{errors.state.message}</p>
                )}
              </div>
            </div>

            {/* remakr here  */}
            <div className="w-full mr-2">
              <label htmlFor="remark" className="block mb-1 font-medium">
                Remark<span className="text-red-500"></span>
              </label>
              <input
                id="remarke"
                {...register("remarke")}
                type="text"
                placeholder="Mention remark..."
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md ${
                loading ? "bg-gray-400" : "bg-blue-500"
              }`}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : modalType === "create"
                ? "Add Customer"
                : "Update Customer"}
            </button>
          </form>
        </div>
      </Modal>
      {/* Modal to confirm SMS */}
      {smsModal && newCustomer && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/40">
          <div className="bg-white p-6 rounded shadow-md w-[300px]">
            <p className="mb-4">
              Do you want to send an SMS to <strong>{newCustomer}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSendSms}
                className="px-4 py-2 text-white bg-green-500 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setSmsModal(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerModal;
