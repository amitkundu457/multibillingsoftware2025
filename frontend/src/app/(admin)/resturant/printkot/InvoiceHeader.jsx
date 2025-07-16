"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { getBillno } from "@/app/components/config";

const InvoiceHeader = ({ data, logoUrl, companyName }) => {
  const [billNo, setBillNo] = useState("");
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");

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




  useEffect(() => {
    const fetchNextBillNo = async () => {
      try {
        const response = await getBillno();
        console.log(response.data);
        setBillNo(response.data.bill_no);
      } catch (error) {
        console.error("Error fetching bill number:", error);
      }
    };

    const fetchLogoUrl = async () => {
      const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
      try {
        const response = await axios.get(
          " https://api.equi.co.in/api/masterlogobill",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API Response:", response.data);

        const logoUrl = response.data.logo;
        if (logoUrl) {
          console.log("Fetched Logo URL:", logoUrl);
          setFetchedLogoUrl(logoUrl);
        } else {
          console.error("Error: 'logo' key not found in response");
        }
      } catch (error) {
        console.error("Error fetching logo URL:", error);
      }
    };

    fetchNextBillNo();
    fetchLogoUrl();
  }, []);

  console.log("aaa", data);

  return (
    <div className="border-t border-r border-l border-gray-800 ">
      {/* Top Section */}
      <div className="border border-black w-full p-4 flex items-start">
        {/* Left Section */}
        <div className="w-2/3 pr-4 border-r border-black">
          {/* Header Section */}
          <div className="flex items-center space-x-4 border-b pb-2">
            <img src={fetchedLogoUrl} className="w-[35%]" alt="Company Logo" />
            <div>
              <h1 className="text-2xl font-bold text-red-600">
                {data.users.name}
              </h1>
            </div>
          </div>

          {/* Customer Details */}
          {data.users.customers.map((customer) => (
            <div key={customer.id} className="mt-4">
              {/* Address Section */}
              <p className="text-sm font-bold">
                Address:{" "}
                <span className="font-normal text-gray-700">
                  {customer.address || "N/A"}, {customer.pincode || "N/A"},{" "}
                  {customer.state || "N/A"}, {customer.country || "N/A"}
                </span>
              </p>

              {/* Additional Info */}
              <div className="mt-2 space-y-1">
                <p className="text-sm font-bold">
                  GSTIN:{" "}
                  <span className="font-extrabold">
                    {customer.gstin || "N/A"}
                  </span>
                </p>
                <p className="text-sm font-bold">
                  Mobile:{" "}
                  <span className="font-extrabold">
                    {customer.phone || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="w-1/3 pl-4 text-sm">
          <div className="flex justify-between font-bold">
            <span>Invoice No.</span>
            {/* <span className="font-normal">{data.invoice.number}</span> */}
            {data?.billno}
          </div>
          <div className="flex justify-between font-bold mt-1">
            <span>Invoice Date</span>
            {data?.date}
            {/* <span className="font-normal">{data.invoice.date}</span> */}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className=" ">
        {/* <div className=" grid grid-cols-4 gap-6 border-b border-gray-800 p-4">
          <p className="text-sm">
            Invoice No: <span className="font-semibold">{data?.billno}</span>
          </p>
          <p className="text-sm">
            Invoice Date: <span className="font-semibold">{data.date}</span>
          </p>
          <p className="text-sm">
            BIS No: <span className="font-semibold">HM/C-5190067012</span>
          </p>
          <p className="text-sm">
            Gold Rate: <span className="font-semibold">₹8000.00</span>
          </p>
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          {/* Bill To Section */}
          <div className="border-r border-gray-800 p-4">
            <p className="font-bold">BILL TO:</p>
            {data.users.customers.map((customer) => (
              <div key={customer.id}>
                <p className="text-sm">Name: {data.users.name}</p>
                <p className="text-sm">Address: {customer.address || "N/A"}</p>
                <p className="text-sm">Phone: {customer.phone || "N/A"}</p>
                <p className="text-sm">GSTIN: {customer.gstin || "N/A"}</p>
              </div>
            ))}
          </div>

          {/* Ship To Section */}
          <div className="p-4">
            <p className="font-bold">SHIP TO:</p>
            {data.users.customers.map((customer) => (
              <div key={customer.id}>
                <p className="text-sm">Address: {customer.address || "N/A"}</p>
                <p className="text-sm">Pincode: {customer.pincode || "N/A"}</p>
                <p className="text-sm">State: {customer.state || "N/A"}</p>
                <p className="text-sm">Country: {customer.country || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
