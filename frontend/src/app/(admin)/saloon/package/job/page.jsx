"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getphoneSearch } from "@/app/components/config";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import "react-responsive-modal/styles.css"; // Import default styles
import BookingModal from "./package";
import { Notyf } from "notyf";
import Printbill from "../../../jwellery/invoice/printbill";

import "notyf/notyf.min.css"; // Import Notyf CSS
export default function JobForm() {
  const notyf = new Notyf();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const [mode, setMode] = useState("new"); // "new" or "modify
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]); // Store API data
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);

  const [additionalCharge, setAdditionalCharge] = useState(0);
  const [numOfServices, setNumOfServices] = useState(1);
  const [finalTotal, setFinalTotal] = useState(0);

  // const selectedServices = watch("service", []);

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    id: "",
    address: "",
    gstin: "",
  });


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


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posCode, setPosCode] = useState("");
  const package_no = packageData.map((data) => data.package_no).join(", ");

  const totalGrossAmount = selectedServices.reduce(
    (sum, service) =>
      sum +
      (Number(service.price) || 0) +
      (Number(service.additional_charge) || 0),
    0
  );

  useEffect(() => {
    setValue("gross_amount", totalGrossAmount);
  }, [totalGrossAmount, setValue]); // Runs whenever totalGrossAmount changes

  const payload = {
    package_number: package_no,
    customer_id: customerDetails.id,
    price: totalGrossAmount,
    services: selectedServices,
  };

  const onSubmitPackage = async (data) => {
    // setPosCode(data.posCode); // Store POS Code for modal display
    // setIsModalOpen(true); // Open modal
    //reset(); // Clear all form fields

    const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}

    const package_no = packageData.length > 0 ? packageData[0].package_no : "";

    const paymentPayload = {
      package_no: package_no, // Assigning the variable
      paid_amount: totalGrossAmount
    };
    const orderResponse = await axios.post(
      "https://api.equi.co.in/api/order-packages",
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const paymentResponse = await axios.post(
      "https://api.equi.co.in/api/update-payment",
      paymentPayload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(orderResponse);
    console.log(paymentResponse);

    if (orderResponse.status === 201 && paymentResponse.status===200) {
      notyf.success(` package Order placed successfully!`);

      const orderId = orderResponse.data.id;
      // Show confirmation dialog for printing the bill
      // const printConfirmation = window.confirm("Do you want to print the bill?");
      const printConfirmation = window.confirm(
        "Do you want to print the bill?"
      );
      if (printConfirmation) {
        Printbill(orderId, orderResponse.data.bill_inv); // Call the direct print function
      }

     
      




    } else {
      notyf.error("package  not Booked !!");
    }

   
  };

  const Printbill = (orderId, billInv) => {
    if (!orderId) {
      console.error("Order ID is required for printing.");
      return;
    }

    console.log("Order ID:", orderId);
    console.log("Bill Invoice Flag:", billInv);

    // Determine the correct URL based on billInv value
    const printUrl = `/saloon/printPackageInvoice?id=${orderId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };

  const handleSearch = async () => {
    try {
      const response = await getphoneSearch(phoneNumber);
      const customer = response.data;
      console.log(customer);

      if (customer) {
        setCustomerDetails({
          name: customer.name || "",
          id: customer.id || "",
          address: customer.address || "",
          gstin: customer.gstin || "",
        });

        // Set the form values dynamically
        setValue("name", customer.name || "");
        setValue("custCode", customer.phone || "");
        setValue("mobile", customer.phone || "");
      } else {
        alert("Customer not found");
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      alert("Customer not found");
    }
  };

  //add service
  const handleAddService = () => {
    if (!selectedService) return;

    const service = packageData[0]?.services.find(
      (s) => s.service_name === selectedService
    );

    if (!service) return;

    const subtotal =
      parseFloat(service.price) * numOfServices +
      parseFloat(additionalCharge || 0);

    setSelectedServices([
      ...selectedServices,
      {
        id: service.id,
        service_name: selectedService,
        price: service.price,
        quantity: numOfServices,
        additional_charge: additionalCharge,
        selectedStylist: selectedStylist,
        subtotal: subtotal,
      },
    ]);

    // Reset fields
    setSelectedService("");
    setAdditionalCharge("");
    setNumOfServices(1);
  };

  const handleRemoveService = (id) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== id));
  };

  //handle service select
  const handleServiceSelect = (serviceName) => {
    setSelectedService(serviceName); // Only one service is allowed at a time
  };

  useEffect(() => {
    if (!selectedService) {
      setFinalTotal(0);
      return;
    }

    const service = services.find((s) => s.service_name === selectedService);
    const servicePrice = service ? parseFloat(service.price) : 0;
    const additionalChargeValue = parseFloat(additionalCharge) || 0;
    const numOfServicesValue = parseInt(numOfServices) || 1; // Default to 1 if empty

    setFinalTotal(servicePrice * numOfServicesValue + additionalChargeValue);
  }, [selectedService, additionalCharge, numOfServices, services]);

  //fetch stylist
  const fetchStylists = async () => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}

    const response = await axios.get("https://api.equi.co.in/api/stylists",
      {
        headers: { Authorization: `Bearer ${token}` },
      }

    );
    setStylists(response.data);
  };

  useEffect(() => {
    fetchStylists();
  }, []);

  //fetch assign package by customer
  const handleCheckboxChange = async (event) => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}

    const checked = event.target.checked;
    setIsChecked(checked);

    try {
      const response = await axios.get(
        `https://api.equi.co.in/api/packagesassign/${customerDetails.id}?enabled=${checked}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
  
      );
      setPackageData(response.data.data);
      setServices(response.data.data[0].services);
      console.log(customerDetails.id);
      if (response) {
        console.log(response);
      }

      alert(response.data.message);
    } catch (error) {
      console.error("Error:", error);

      console.log(customerDetails.id);

      alert("Failed to fetch special package details.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Assign Package</h2>
      {packageData?.length > 0 && (
  <div className="absolute top-12 right-6 bg-white shadow-lg p-4 rounded-lg w-68">
    {/* Mapping through packageData */}
    {packageData.map((data, index) => (
      <div key={index} className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-md">
        <p className="text-gray-700 font-semibold text-sm">
          <span className="font-bold">Package Id:</span> {data.package_id}
        </p>
        <p className="text-gray-700 font-semibold text-sm">
          <span className="font-bold">Package No:</span> {data.package_no}
        </p>

       
        <p className="text-green-700 font-semibold text-sm">
          <span className="font-bold">Package Amount:</span> ₹{data.package_amount}
        </p>
        <p className="text-blue-700 font-semibold text-sm">
          <span className="font-bold">Service Amount:</span> ₹{data.service_amount}
        </p>
        <p className="text-green-700 font-semibold text-sm">
          <span className="font-bold">Remaining Amount:</span> ₹{data.remaining_amount}
        </p>
        <p className="text-yellow-700 font-semibold text-sm">
          <span className="font-bold">Expiry Date:</span> {data.package_expiry}
        </p>
       
        {/* <p className="text-red-700 font-semibold text-sm">
          <span className="font-bold">Balance Amount:</span> ₹
          {data.remaining_amount - totalGrossAmount}
        </p> */}
      </div>
    ))}
  </div>
)}



      {/* Phone Number Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="p-2 border rounded-md"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Search
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitPackage)}>
        {/* POS Code */}
        <div className="grid grid-cols-6 gap-4">
          {/* <div>
            <label className="block text-sm font-medium">POS Code</label>
            <input
              type="text"
              {...register("posCode", { required: "POS Code is required" })}
              className="w-full p-2 border rounded-md"
            />
            {errors.posCode && (
              <p className="text-red-500 text-sm">{errors.posCode.message}</p>
            )}
          </div> */}

          {/* Customer Code */}
          {/* <div>
            <label className="block text-sm font-medium">Mem. Card No.</label>
            <input
              type="text"
              {...register("custCode", {
                required: "Customer Code is required",
              })}
              className="w-full p-2 border rounded-md"
            />
            {errors.custCode && (
              <p className="text-red-500 text-sm">{errors.custCode.message}</p>
            )}
          </div> */}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium">Mobile No</label>
            <input
              type="text"
              {...register("mobile", { required: "Mobile No is required" })}
              className="w-full p-2 border rounded-md"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile.message}</p>
            )}
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="mt-4 flex gap-2 col-span-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Book Package
            </button>
            <button
              type="reset"
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="splPackage"
              className="text-orange-900 font-semibold"
            >
              Spl. Package
            </label>
            <input
              type="checkbox"
              id="splPackage"
              className="w-5 h-5 accent-blue-600 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>

        <div className="mt-4 bg-white p-4 rounded shadow">
          <p className="border p-3 w-1/4 rounded-xl mb-2 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold shadow-lg">
            Package No: {packageData.map((data) => data.package_no).join(", ")}
          </p>
          {/* <table className="w-full border">
            <thead className="bg-yellow-300">
              <tr>
                <th>Service</th>
                <th> Additional Charge</th>
                <th>No. of Service</th>
                <th>Subtotal</th>
                <th>Staff</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {packageData.map((data) => (
                <tr key={data.id}>
                  <td>
                    <div className="border p-2 w-full rounded-lg">
                      <select
                        {...register("service")}
                        value={selectedService}
                        onChange={(e) => handleServiceSelect(e.target.value)}
                        className="border p-2 w-full rounded-lg bg-white cursor-pointer"
                      >
                        <option value="">Select a Service</option>
                        {data.services.map((service) => (
                          <option key={service.id} value={service.service_name}>
                            {service.service_name} - ₹{service.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td>
                    <input
                      {...register("price")}
                      value={additionalCharge}
                      onChange={(e) => {
                        setAdditionalCharge(e.target.value);
                      }}
                      className="border p-2 w-full"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register("quantity")}
                      value={numOfServices}
                      onChange={(e) => setNumOfServices(e.target.value)}
                      className="border p-2 w-full"
                    />
                  </td>
                  <td>
                    <input
                      {...register("subtotal")}
                      value={
                        selectedService
                          ? packageData[0]?.services.find(
                              (s) => s.service_name === selectedService
                            )?.price *
                              numOfServices +
                            parseFloat(additionalCharge || 0)
                          : 0
                      }
                      className="border p-2 w-full"
                    />
                  </td>
                  <td>
                    <select
                      {...register("staff")}
                      value={selectedStylist}
                      onChange={(e) => {
                        setSelectedStylist(e.target.value);
                      }}
                      className="border p-2 w-full"
                    >
                      <option value="">select stylists</option>
                      {stylists.map((data) => (
                        <option key={data.id} value={data.name}>
                          {" "}
                          {data.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                    type="button"
                      onClick={handleAddService}
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
         
          {selectedServices.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Selected Services
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 shadow-md rounded-lg">
                  <thead className="bg-green-500 text-white">
                    <tr className="text-left">
                      <th className="p-3 border">Service</th>
                      <th className="p-3 border">Price</th>
                      <th className="p-3 border">Additional Charge</th>
                      <th className="p-3 border">Quantity</th>
                      <th className="p-3 border">Subtotal</th>
                      <th className="p-3 border">Stylist</th>
                      <th className="p-3 border">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {selectedServices.map((service, index) => (
                      <tr
                        key={service.id || index}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="p-3 border">{service.service_name}</td>
                        <td className="p-3 border">₹{service.price}</td>
                        <td className="p-3 border">
                          ₹{service.additional_charge}
                        </td>
                        <td className="p-3 border">{service.quantity}</td>
                        <td className="p-3 border">₹{service.subtotal}</td>
                        <td className="p-3 border">
                          {service.selectedStylist}
                        </td>
                        <td className="p-3 border">
                          <button
                            onClick={() => handleRemoveService(service.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        {/* <div className="mt-4 bg-white p-4 rounded shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Gross Amount</label>
              <input
                {...register("gross_amount")}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">Discount</label>
              <input {...register("discount")} className="border p-2 w-full" />
            </div>
            <div>
              <label className="block text-gray-700">Net Amount</label>
              <input
                {...register("net_amount")}
                className="border p-2 w-full"
              />
            </div>
          </div>
        </div> */}

        {/* Submit Button */}
        {/* <button
        type="submit"
          onClick={handleSubmit(onSubmitPackage)}
          className="mt-4 bg-green-500 text-white p-2 rounded"
        >
          order package
        </button> */}
      </form>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
        <BookingModal customer_id={customerDetails.id} />
      </Modal>
    </div>
  );
}
