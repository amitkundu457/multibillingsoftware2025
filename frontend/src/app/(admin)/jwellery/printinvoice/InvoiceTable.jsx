

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toWords } from "number-to-words";
import { getMe } from "@/app/components/config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceTable = ({ data, logoUrl, taxes, companyName }) => {
  const [buyerState, setbuyState] = useState("");
  const [sellerState, setSellerState] = useState("");

  const words = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertToWords(num) {
    if (num === 0) return "Zero";

    function numToWords(n, s) {
      let str = "";
      if (n > 19) {
        str += tens[Math.floor(n / 10)] + " " + words[n % 10];
      } else {
        str += words[n];
      }

      if (n !== 0) str += " " + s + " ";
      return str;
    }

    let output = "";
    output += numToWords(Math.floor(num / 10000000), "Crore");
    output += numToWords(Math.floor((num / 100000) % 100), "Lakh");
    output += numToWords(Math.floor((num / 1000) % 100), "Thousand");
    output += numToWords(Math.floor((num / 100) % 10), "Hundred");

    if (num > 100 && num % 100 > 0) output += "and ";
    output += numToWords(num % 100, "");

    return output.trim();
  }

  const getAmountInWords = (amount) => {
    const rounded = Math.floor(amount);
    const capitalized = convertToWords(rounded);
    return `${capitalized} Only`;
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

  useEffect(() => {
    fetchCompanyDetails();
    setbuyState(data?.users?.customers[0]?.state?.trim().toLowerCase() || "");
    // setSellerState(companyName?.users?.information?.state?.toLowerCase() || "");
  }, []);
  console.log(data);
  console.log(("compnay form invoiceTable", companyName));
  console.log("setSellerState state", companyName?.users);

  const fetchCompanyDetails = async () => {
    try {
      const response = await getMe();
      console.log("Company details fetched:", response); // Log the API response to verify the data
      if (response && response.data) {
        // setCompanyName(response.data); // Update state with the company name
        setSellerState(
          response?.data?.user?.information?.state?.trim().toLowerCase() || ""
        );
        console.log(
          " response?.data?.user?.information?.state.toLowerCase()",
          response?.data?.user?.information?.state.toLowerCase()
        );
      } else {
        console.log("Company name not found in the response");
        // setCompanyName(""); // Set default if name is not found
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const totalTaxableValue = data.details.reduce(
    (sum, invoice) => sum + Number(invoice.pro_total),
    0
  );
  // const totalCGST = data.details.reduce(
  //   (sum, invoice) => sum + (invoice.pro_total * invoice.tax_rate) / 2 / 100,
  //   0
  // );
  // const totalSGST = data.details.reduce(
  //   (sum, invoice) => sum + (invoice.pro_total * invoice.tax_rate) / 2 / 100,
  //   0
  // );
  // const totalTaxAmount = totalCGST + totalSGST;
  // const isSameState = buyerState && sellerState && buyerState === sellerState;
  // const isSameState = buyerState === "" ? true : buyerState === sellerState;

  const isSameState = true;
  console.log("isSameState1", isSameState);
  console.log("buyerState2", buyerState);
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalTaxAmount = 0;
  let roundoff = 0;

  console.log("isSameState", isSameState);
  // console.log("isSameState", isSameState);
  console.log("buyerState", buyerState);
  console.log("sellerState", sellerState);

  if (isSameState) {
    totalCGST = data.details.reduce((sum, invoice) => {
      const cgst = (invoice.pro_total * invoice.tax_rate) / 2 / 100;
      return sum + cgst;
    }, 0);

    totalSGST = data.details.reduce((sum, invoice) => {
      const sgst = (invoice.pro_total * invoice.tax_rate) / 2 / 100;
      return sum + sgst;
    }, 0);

    totalTaxAmount = Math.round(totalCGST + totalSGST);
    //  roundoff  = totalCGST + totalSGST;
  } else {
    totalIGST = data.details.reduce((sum, invoice) => {
      const igst = (invoice.pro_total * invoice.tax_rate) / 100;
      return sum + igst;
    }, 0);

    totalTaxAmount = Math.round(totalIGST);
    // roundoff=totalCGST
  }

  let i = 0;
  let j = 1;
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");

  // Extract numeric tax rates from the data
  const taxRates = taxes.map((tax) => parseFloat(tax.amount));
  console.log("Tax Rates: ", taxRates); // [18, 12]

  // Function to fetch logo URL
  const fetchLogoUrl = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const response = await axios.get(
        " http://127.0.0.1:8000/api/masterlogobill",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API Responsejhgfghjk:", response.data);

      const logo = response.data.logo;
      if (logo) {
        console.log("Fetched Logo URL:", logo);
        setFetchedLogoUrl(logo);
      } else {
        console.error("Error: 'logo' key not found in response");
      }
    } catch (error) {
      console.error("Error fetching logo URL:", error);
    }
  };

  useEffect(() => {
    fetchLogoUrl();
  }, []); // Runs only on mount

  // Function to calculate tax for a single amount and percentage
  const calculateTax = (amount, taxPercentage) =>
    (amount * taxPercentage) / 100;

  // Calculate tax details for each rate
  const taxDetails = taxRates.map((rate) => ({
    rate,
    taxAmount: calculateTax(data.total_price, rate),
  }));

  console.log("Tax Details: ", taxDetails);
  console.log("Invoice Data:", data);
  let totalGstAmount = 0;

  // Calculate total price and total tax
  const totalPrice = parseFloat(data.gross_total) || 0;
  const totalTax = taxes.reduce((sum, tax) => {
    const taxRate = Number(tax.amount) || 0;
    return sum + (totalPrice * taxRate) / 100;
  }, 0);

  const roundedTotalTax = totalTax.toFixed(2);
  const grandTotal = parseFloat(data.total_price) || 0;
  // const grandTotal = totalPrice ;

  console.log("Base Total: ", totalPrice);
  console.log("Total Tax Amount: ", totalTax);
  console.log("Grand Total: ", grandTotal);
  roundoff = Number(totalPrice + totalTax).toFixed(2);
  // Function to round to two decimal places
  const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;
  const roundedGrandTotal = Math.round(grandTotal);

  //function for conver in word to letters
  // const getAmountInWords = (amount) => {
  //   const rounded = Math.floor(amount);
  //   const words = toWords(rounded);
  //   const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
  //   return `${capitalized} Only`;
  // };

  return (
    <div className="border-t w-full   relative  border-gray-800">
      {/* Table Header */}
      {/* <button
        onClick={downloadPDF}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download as PDF
      </button> */}
      {/* <div className="opacity-10 absolute text-xs bottom-[40%] left-[25%]"> */}
      {/* <div className="center-logo-wrapper opacity-10 bottom-[40%] left-[25%] absolute text-xs">
        {fetchedLogoUrl && (
          <img src={fetchedLogoUrl} alt="Logo"  className="logo-imgs  w-[80%]" />
        )}
      </div> */}
      <div className="center-logo-wrapper  absolute inset-0 flex justify-center items-center opacity-10">
        {fetchedLogoUrl && (
          <img
            src={fetchedLogoUrl}
            alt="Logo"
            className="logo-imgs  w-[300px] h-auto"
          />
        )}
      </div>
      <table className="w-full border border-gray-800  border-collapse">
        <thead>
          <tr className="bg-red-100 border-b border-gray-800">
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              SL No.
            </th>
            <th className="border-r text-xs text-[#333]  w-[9rem] font-medium border-gray-800 text-center ">
              Product Name
            </th>
            {/* <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              HSN
            </th> */}
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Net.Wt(g)
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              G.Wt(g)
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Qty
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Metal Rate(₹)
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Metal Cost(₹)
            </th>
            {/* Diamond (Carats) */}
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Dmd(ct)
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Dmd Rate
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Dmd Cost(₹)
            </th>
            {/* <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Mkg Chg (%)/Rs
            </th> */}
             <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Gst on mkg 
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Mkg Cost(₹)
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              All Chg(₹)
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Mkg Disc(%)
            </th>
            <th className="border-r text-xs text-[#333] font-medium border-gray-800 text-center ">
              Taxable Amt (₹)
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.details.map((invoice, index) => (
            <tr key={index} className="mb-2 border-b border-gray-800 ">
              <td className=" border-r  text-xs border-gray-800 text-center ">
                {index + 1}
              </td>
              <td className=" border-r  text-xs border-gray-800 text-center ">
                {invoice?.product_name}
                <br />
                <div className=" text-[10px] leading-[11px] ">
                  {invoice.description}
                </div>{" "}
                {invoice?.huid && (
                  <div className="leading-[7px] text-[10px]  ">
                    Huid: <span className=" text-[9px]">{invoice?.huid}</span>
                  </div>
                )}
                {"  "}
                {invoice?.hallmark && (
                  <span className="leading-[7px] text-[10px]  ">
                    H.Mrk:{" "}
                    <span className=" text-[9px]">{invoice?.hallmark}</span>
                  </span>
                )}
              </td>
              {/* <td className=" border-r  text-xs border-gray-800 text-center ">
                {invoice.hsn}
              </td> */}

              {/* {" "} */}
              <td className=" border-r text-xs border-gray-800 text-center ">
                {invoice.net_weight}{" "}
              </td>
              {/* <td className=" border-r  text-xs border-gray-800 text-center ">
                {invoice.gross_weight}
              </td> */}
              {Number(invoice.ad_wgt) > 0 ? (
                <td className="border-r text-xs border-gray-800 text-center">
                  {Number(invoice.gross_weight)}
                  <span className=" text-[9px]">
                    {" "}
                    (-Dep.Mat: {Number(invoice.ad_wgt)})
                  </span>
                </td>
              ) : (
                <td className="border-r text-xs border-gray-800 text-center">
                  {invoice.gross_weight}
                </td>
              )}
              <td className=" border-r  text-xs border-gray-800 text-center ">
                {invoice.qty}
              </td>
              {invoice.net_weight > 0 ? (
                <td className=" border-r  text-xs border-gray-800 text-center ">
                  {invoice.rate}
                </td>
              ) : (
                <td className=" border-r text-xs border-gray-800 text-center ">
                  0
                </td>
              )}
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                {(Number(invoice.rate) * Number(invoice.net_weight)).toFixed(2)}
              </td>
              <td className=" border-r  text-xs border-gray-800 text-center ">
                {invoice.diamondDetails}
              </td>
              <td className=" border-r  text-xs border-gray-800 text-center ">
                {invoice.diamondValue}
              </td>
              <td className="border-r text-xs border-gray-800 text-center">
                {(
                  Number(invoice.diamondValue) * Number(invoice.diamondDetails)
                ).toFixed(2)}
              </td>
              {/* <td className=" border-r  text-xs border-gray-800 text-center ">
                {(invoice.making || invoice.makingInRs) && (
                  <span>
                    {invoice.making ? `${Math.round(invoice.making)}%` : "0"}
                    <span>/</span>
                    {invoice.makingInRs ? `${invoice.makingInRs}` : "0"}
                  </span>
                )}
              </td> */}
              <td className="border-r text-xs border-gray-800 text-center">
  {invoice?.gstOnMaking}
</td>
              
               <td className=" border-r  text-xs border-gray-800 text-center ">
               {invoice?.mkg_chg_RS_P == null
                      ? "0"
                      : invoice?.mkg_chg_RS_P}
              </td>
              {/* <td className=" border-r text-xs border-gray-800 text-center ">
                {Number(invoice?.otherCharge) || 0 +invoice.hallmarkCharge || + invoice?.wastageCharge ||0}
              </td> */}
              <td className="border-r text-xs border-gray-800 text-center">
                {(Number(invoice?.otherCharge) || 0) +
                  (Number(invoice?.hallmarkCharge) || 0) +
                  (Number(invoice?.wastageCharge) || 0)}
              </td>
              {/* <td className="border-r  text-xs border-gray-800 text-center ">
                {(invoice.making_dsc != null ||
                  invoice.making_gst_percentage != null) && (
                  <span>
                    {invoice?.making_dsc != null
                      ? `${invoice.making_dsc}%`
                      : "0%"}
                    <span>/</span>
                    {invoice?.making_gst_percentage != null
                      ? `${invoice.making_gst_percentage}%`
                      : "0%"}
                  </span>
                )}
              </td> */}
              <td className="border-r  text-xs border-gray-800 text-center ">
              
                  <span>
                    {invoice?.making_dsc != null
                      ? `${invoice.making_dsc}%`
                      : "0%"}
                    
                  </span>
              
              </td>
              <td className=" border-r text-xs border-gray-800 text-center ">
                {invoice.pro_total}
              </td>
            </tr>
          ))}

          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>
          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
          </tr>

          {/* huid */}

          {/* {data.details.some((invoice) => invoice.huid > 0) && (
            <tr className="">
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r text-xs border-gray-800 text-center ">
                HUID <span className="text-xs ">(added)</span>
              </td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center "></td>
              {data.details.some((invoice) => invoice.huid > 0) && (
                <td className=" border-r border-gray-800 text-center">
                  {data.details.map((invoice, index) => (
                    <span className="text-xs" key={index}>
                      ₹{invoice.huid ? invoice.huid : ""}
                    </span>
                  ))}
                </td>
              )}
            </tr>
          )} */}

          {/* <tr>
            <td className=" border-r border-gray-800 text-center "></td>
            {data.details.some((invoice) => invoice.huid) && (
              <td className=" border-r text-xs border-gray-800 text-center ">
                HUID<span className=" text-xs">(added)</span>
              </td>
            )}

            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            {data.details.some((invoice) => invoice.huid > 0) && (
              <td className=" border-r border-gray-800 text-center">
                {data.details.map((invoice, index) => (
                  <span className="text-xs" key={index}>
                    ₹{invoice.huid ? invoice.huid : ""}
                  </span>
                ))}
              </td>
            )}
          </tr> */}

          {/* hallmark */}

          {/* {data.details.some((invoice) => invoice.hallmark > 0) && (
            <tr className="">
              <td className=" border-r border-gray-800 text-center"></td>
              <td className="border-r text-xs border-gray-800 text-center">
                HallMark <span className="text-xs ">(added)</span>
              </td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              {data.details.some((invoice) => invoice.huid > 0) && (
                <td className=" border-r border-gray-800 text-center ">
                  {data.details.map((invoice, index) => (
                    <span className="text-xs" key={index}>
                      ₹{invoice.hallmark ? invoice.hallmark : ""}
                    </span>
                  ))}
                </td>
              )}
            </tr>
          )} */}

          {/* <tr>
            <td className=" border-r border-gray-800 text-center "></td>
            {data.details.some((invoice) => invoice.hallmark > 0) && (
              <td className=" border-r text-xs border-gray-800 text-center ">
                HallMark<span className=" text-xs">(added)</span>
              </td>
            )}

            <td className=" border-r border-gray-800  text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>

            {data.details.some((invoice) => invoice.huid > 0) && (
              <td className=" border-r border-gray-800 text-center ">
                {data.details.map((invoice, index) => (
                  <span className="text-xs" key={index}>
                    ₹{invoice.hallmark ? invoice.hallmark : ""}
                  </span>
                ))}
              </td>
            )}
          </tr> */}
          <tr className="bg-red-100 p-[3rem]">
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className="border-r border-gray-800 text-center  font-semibold">
              Gross Total
            </td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className=" border-r border-gray-800 text-center p-1"></td>
            <td className="border-r border-gray-800 text-center  font-semibold">
              ₹{totalPrice}
            </td>
          </tr>

          {/* discoutn% ,discountrs ,addtionRs and description */}

          {data?.discountPercent > 0 && (
            <tr className="bg-red-100 p-[3rem]">
              <td className=" border-r border-gray-800 text-center"></td>
              <td className="border-r text-xs border-gray-800 text-center">
                Disc: ({data.discountPercent}%)
              </td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className=" border-r border-gray-800 text-center p-1"></td>
              <td className=" border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-xs text-center font-semibold">
                - ₹{((totalPrice * data.discountPercent) / 100).toFixed(2)}
              </td>
            </tr>
          )}

          {/* discount Rs */}
          {data?.discountRs > 0 && (
            <tr className="bg-red-100 p-[3rem]">
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r text-xs border-gray-800 text-center">
                Disc Rs
              </td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className=" border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className=" border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-xs text-center font-semibold">
                - ₹{parseFloat(data?.discountRs).toFixed(2)}
              </td>
            </tr>
          )}

          {/* additionRs */}
          {data?.additionRS > 0 && (
            <tr className="bg-red-100 p-[3rem] border  border-gray-800 border-collapse">
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r text-xs border-gray-800 text-center">
                Addition Rs
              </td>
              {/* <td className="border-r border-gray-800 text-center p-2"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td> */}
              <td
                className="border-t border-b border-r text-xs border-gray-800  font-semibold"
                colSpan={10}
              >
                {data?.additionDetail}
              </td>
              <td className="border-r border-gray-800 text-xs text-center font-semibold">
                + ₹{data?.additionRS}
              </td>
            </tr>
          )}

          {/* adjustment and adavanced */}
          {data?.minAdAmt > 0 && (
            <tr className="bg-red-100 p-[3rem]">
              <td className=" border-r border-gray-800 text-center"></td>
              <td className="border-r text-xs border-gray-800 text-center">
                Advance Rs
              </td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className=" border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-xs text-center font-semibold">
                - ₹{parseFloat(data?.minAdAmt).toFixed(2)}
              </td>
            </tr>
          )}

          {/* advance */}

          {data?.minAdjAmt > 0 && (
            <tr className="bg-red-100 p-[3rem]">
              <td className=" border-r border-gray-800 text-center"></td>
              <td className="border-r text-xs border-gray-800 text-center">
                Adjustment Rs
              </td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className=" border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-center p-1"></td>
              <td className="border-r border-gray-800 text-xs text-center font-semibold">
                - ₹{parseFloat(data?.minAdjAmt).toFixed(2)}
              </td>
            </tr>
          )}

          {/* {isSameState &&
            data.bill_inv !== 1 &&
            taxes.map((tax) => (
              <tr key={tax.id}>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className="border-r italic border-gray-800 text-right p-2">
                  {tax.name} @
                </td>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className=" border-r border-gray-800 text-center"></td>
                <td className="border-r border-gray-800 text-center p-2">
                  ₹ {totalCGST.toFixed(2)}
                </td>
              </tr>
            ))} */}
          {/* {isSameState && data.bill_inv !== 1 && ( */}
          {isSameState && (
            <>
              <tr>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r italic border-gray-800 text-center ">
                  CGST @
                </td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className=" border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center ">
                  ₹{((data?.totalTax || 0) / 2).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r italic border-gray-800 text-center ">
                  SGST @
                </td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center p-1"></td>
                <td className=" border-r border-gray-800 text-center p-1"></td>
                <td className="border-r border-gray-800 text-center ">
                  ₹{((data?.totalTax || 0) / 2).toFixed(2)}
                </td>
              </tr>
            </>
          )}
          {/* {!isSameState && data.bill_inv !== 1 && ( */}

          {!isSameState && (
            <tr>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className="border-r italic border-gray-800 text-center ">
                igst @
              </td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center p-2"></td>
              <td className="border-r border-gray-800 text-center ">
                ₹{(data?.totalTax).toFixed(2)}
              </td>
            </tr>
          )}

          {/* Total Tax Row */}
          {/* {data.bill_inv !== 1 && (
            <tr>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className="border-r italic border-gray-800 text-center p-1">
                Round Off
              </td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className=" border-r border-gray-800 text-center"></td>
              <td className="border-r border-gray-800 text-center  ">
                ₹
                {roundoff}
              </td>
            </tr>
          )} */}

          {/* <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className="border-r italic border-gray-800 text-right p-2">
              Round Off
            </td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className="border-r border-gray-800 text-center p-2">₹ {roundedGrandTotal}</td>
          </tr> */}
          {/*<tr>*/}
          {/*    <td colSpan="9" className="border border-gray-800 text-right p-2">Round Off</td>*/}
          {/*    <td className="border border-gray-800 text-center p-2">₹ 0.00</td>*/}
          {/*</tr>*/}
          {/*    {data.bill_inv !== 1 && ( */}
          {/* {data.bill_inv !== 1 && ( */}
          <tr className="bg-red-100 p-[3rem]">
            <td className=" border-r border-gray-800 text-center"></td>
            <td className="border-r border-gray-800 text-center p-1 font-bold">
              Total
            </td>
            <td className=" border-r border-gray-800 text-center"></td>
            <td className=" border-r border-gray-800 text-center"></td>
            <td className=" border-r border-gray-800 text-center"></td>
            <td className="border-r border-gray-800 text-center ">
              {data?.totalqty ? data?.totalqty : "0"}
            </td>

            <td className=" border-r border-gray-800 text-center"></td>
            <td className=" border-r border-gray-800 text-center"></td>
            <td className=" border-r border-gray-800 text-center"></td>
            <td className=" border-r border-gray-800 text-center"></td>
            <td className=" border-r border-gray-800 text-center"></td>
            <td className=" border-r border-gray-800 text-center"></td>
            <td className=" border-r border-gray-800 text-center"></td>
            <td className=" border-r border-gray-800 text-center"></td>
            {/* <td className="border-r border-gray-800 text-center p-2 font-bold">
                ₹{" "}
                {(
                  roundedGrandTotal -
                   Number(data?.minAdjAmt || 0) -
                  Number(data?.minAdAmt || 0)
                ).toFixed(2)}
              </td> */}
            <td className="border-r border-gray-800 text-center  font-bold">
              ₹
              {Math.round(
                roundedGrandTotal -
                  Number(data?.minAdjAmt || 0) -
                  Number(data?.minAdAmt || 0)
              )}
            </td>
          </tr>
          {/* )} */}
        </tbody>

        {/*/!* Table Footer *!/*/}
        {/*<tfoot>*/}

        {/*</tfoot>*/}
      </table>
      {/* calculation new table */}
      {/* 
      {isSameState && data.bill_inv !== 1 && ( */}
      {isSameState && (
        <div className="overflow-x-auto mt-7 text-xs">
          <table className="w-full border border-gray-300 text-xs text-gray-900">
            <thead className="bg-red-100 text-gray-700 uppercase text-center">
              <tr>
                <th className="border border-gray-300 px-1 py-2">HSN/SAC</th>
                <th className="border border-gray-300 px-1 py-2">
                  Taxable Value
                </th>
                <th colSpan="2" className="border border-gray-300 px-1 py-2">
                  CGST
                </th>
                <th colSpan="2" className="border border-gray-300 px-1 py-2">
                  SGST/UTGST
                </th>
                {/* new */}
                <th className="border border-gray-300 px-1 py-2">
                  Taxable Value
                </th>
                <th colSpan="2" className="border border-gray-300 px-1 py-2">
                  SGST/UTGST(Mkg)
                </th>
                <th colSpan="2" className="border border-gray-300 px-1 py-2">
                  CGST(Mkg)
                </th>

                <th className="border border-gray-300 px-1 py-2">
                  Total Tax Amount
                </th>
              </tr>
              <tr>
                <th className="border border-gray-300 px-1 py-2"></th>
                <th className="border border-gray-300 px-1 py-2">Gold</th>
                <th className="border border-gray-300 px-1 py-2">Rate</th>
                <th className="border border-gray-300 px-1 py-2">Amount</th>
                <th className="border border-gray-300 px-1 py-2">Rate</th>

                <th className="border border-gray-300 px-1 py-2">Amount</th>
                <th className="border border-gray-300 px-1 py-2">Making Chg</th>

                <th className="border border-gray-300 px-1 py-2">Rate</th>
                <th className="border border-gray-300 px-1 py-2">Amount</th>
                <th className="border border-gray-300 px-1 py-2">Rate</th>
                <th className="border border-gray-300 px-1 py-2">Amount</th>
                <th className="border border-gray-300 px-1 py-2"></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data.details.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="border border-gray-300 px-1 py-2">
                    {invoice.hsn}
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {/* {invoice.pro_total} */}
                    {invoice?.rate * invoice?.net_weight * invoice?.qty}
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {(invoice.tax_rate / 2).toFixed(2)}%
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {(invoice?.gstOnGold / 2).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {(invoice.tax_rate / 2).toFixed(2)}%
                  </td>
                  {/* new */}

                  <td className="border border-gray-300 px-1 py-2">
                    {(invoice?.gstOnGold / 2).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-1py-2">
                    {invoice?.mkg_chg_RS_P == null
                      ? "0"
                      : invoice?.mkg_chg_RS_P}
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {(invoice?.making_gst_percentage / 2).toFixed(2)}%
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {(invoice?.gstOnMaking / 2).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {(invoice?.making_gst_percentage / 2).toFixed(2)}%
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {(invoice?.gstOnMaking / 2).toFixed(2)}
                  </td>

                  <td className="border border-gray-300 px-1 py-2">
                    {/* {(
                      ((invoice.pro_total * invoice.tax_rate) / 200) *
                      2
                    ).toFixed(2)} */}
                    {Number(invoice?.gstOnGold) + Number(invoice?.gstOnMaking)}
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className=" bg-red-100">
                <td className="border border-gray-300 px-1 py-2 text-center">
                  Total
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {/* {totalTaxableValue.toFixed(2)} */}
                </td>
                <td className="border border-gray-300 px-1 py-2"></td>
                <td className="border border-gray-300 px-1 py-2">
                  {/* {totalCGST.toFixed(2)} */}
                </td>
                <td className="border border-gray-300 px-1 py-2"></td>
                <td className="border border-gray-300 px-1 py-2">
                  {/* {totalSGST.toFixed(2)} */}
                </td>
                {/* new */}
                <td className="border border-gray-300 px-1 py-2">
                  {/* {totalSGST.toFixed(2)} */}
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {/* {totalSGST.toFixed(2)} */}
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {/* {totalSGST.toFixed(2)} */}
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {/* {totalSGST.toFixed(2)} */}
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {/* {totalSGST.toFixed(2)} */}
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {/* {totalTaxAmount.toFixed(2)} */}
                  {(data?.totalTax).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {/* border border-gray-800 border-collapse */}
      {/* igst for table */}
      {/*  {!isSameState && data.bill_inv !== 1 && ( */}
      {!isSameState && (
        <div className="overflow-x-auto mt-7">
          <table className="w-full  border-gray-800 border-collapse text-xs text-gray-900">
            <thead className="bg-gray-200 text-gray-700 uppercase text-center">
              <tr className=" bg-red-100">
                <th className="border border-gray-300 px-1 py-2">HSN/SAC</th>
                <th className="border border-gray-300 px-1 py-2">
                  Taxable Value
                </th>
                <th colSpan="2" className="border border-gray-300 px-1 py-2">
                  IGST
                </th>
                <th colSpan="2" className="border border-gray-300 px-1 py-2">
                  Tax
                </th>
                {/* new add for making */}
                <th className="border border-gray-300 px-1 py-2">
                  Taxable Value
                </th>
                <th className="border border-gray-300 px-1 py-2">IGST</th>
                <th className="border border-gray-300 px-1 py-2">TAX</th>

                {/* <th colSpan="2" className="border border-gray-300 px-1 py-2">
                  SGST/UTGST
                </th> */}
                <th colSpan="4" className="border  border-gray-300 px-1 py-2">
                  Total Tax Amount
                </th>
              </tr>

              <tr className=" bg-red-100">
                <th className="border border-gray-300 px-1 py-2"></th>
                <th className="border border-gray-300 px-1 py-2">Gold </th>
                <th colSpan="2" className="border border-gray-300 px-1 py-2">
                  Rate
                </th>
                <th colSpan="2" className="border border-gray-300 px-1 py-2">
                  Amount
                </th>
                <th className="border border-gray-300 px-1 py-2">Making Chg</th>
                <th className="border border-gray-300 px-1 py-2">RATE</th>
                <th className="border border-gray-300 px-1 py-2">Amount</th>
                {/* <th className="border border-gray-300 px-1 py-2"></th> */}
                {/* <th className="border border-gray-300 px-1 py-2">Amount</th> */}
                <th colSpan="3" className="border border-gray-300 px-1 py-2">
                  Amount
                </th>
                {/* <th className="border border-gray-300 px-1 py-2">Rate</th>
                <th className="border border-gray-300 px-1 py-2">Amount</th> */}
                {/* <th className="border border-gray-300 px-1 py-2"></th> */}
              </tr>
            </thead>

            <tbody className="text-center">
              {data.details.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="border border-gray-300 px-1 py-2">
                    {invoice.hsn}
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {/* {invoice.pro_total} */}
                    {invoice?.rate * invoice?.net_weight * invoice?.qty}
                  </td>
                  <td colSpan="2" className="border border-gray-300 px-1 py-2">
                    {invoice?.tax_rate}%
                  </td>
                  <td colSpan="2" className="border border-gray-300 px-1 py-2">
                    {invoice?.gstOnGold}
                  </td>
                  <td colSpan="1" className="border border-gray-300 px-1 py-2">
                    {invoice?.mkg_chg_RS_P == null
                      ? "0"
                      : invoice?.mkg_chg_RS_P}
                  </td>
                  <td colSpan="1" className="border border-gray-300 px-1 py-2">
                    {invoice?.making_gst_percentage}%
                  </td>
                  <td colSpan="1" className="border border-gray-300 px-1 py-2">
                    {invoice?.gstOnMaking}
                  </td>
                  {/* <td className="border border-gray-300 px-4 py-2"></td> */}
                  <td colSpan="4" className="border border-gray-300 px-1 py-2">
                    {/* {((invoice.pro_total * invoice.tax_rate) / 100).toFixed(2)} */}
                    {Number(invoice?.gstOnGold) + Number(invoice?.gstOnMaking)}
                  </td>

                  {/* <td className="border border-gray-300 px-1 py-2">
                    {((invoice.pro_total * invoice.tax_rate) / 200).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-1 py-2">
                    {(
                      ((invoice.pro_total * invoice.tax_rate) / 200) *
                      2
                    ).toFixed(2)}
                  </td> */}
                </tr>
              ))}

              {/* Total Row */}
              <tr className="font-bold bg-red-100">
                <td className="border border-gray-300 px-1 py-2 text-center">
                  Total
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {totalTaxableValue.toFixed(2)}
                </td>
                <td
                  colSpan="3"
                  className="border border-gray-300 px-1 py-2"
                ></td>

                {/* <td className="border border-gray-300 px-1 py-2"></td> */}
                <td className="border border-gray-300 px-1 py-2"></td>
                <td className="border border-gray-300 px-1 py-2"></td>
                <td className="border border-gray-300 px-1 py-2"></td>
                <td className="border border-gray-300 px-1 py-2"></td>

                <td colSpan="4" className="border border-gray-300 px-1 py-2">
                  {/* {totalTaxAmount.toFixed(2)} */}
                  {(data?.totalTax).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* letter in words */}
      <table className="mt-7">
        <thead className="bg-red-100 text-gray-700 uppercase text-center"></thead>
        <tbody>
          <tr className=" bg-white pt-5 mt-4 mb-4">
            <span className="font-bold">Total Amount (in words):</span>
            {/* <span className="">{amountWithSuffix}</span> */}
            {/* {data.bill_inv !== 1 ? (
              <span className="">{getAmountInWords(roundedGrandTotal)}</span>
            ) : (
              <span className="">{getAmountInWords(totalPrice)}</span>
            )} */}
            <span className="">{getAmountInWords(roundedGrandTotal)}</span>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;



// editing 
// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toWords } from "number-to-words";
// import { getMe } from "@/app/components/config";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const InvoiceTable = ({ data, logoUrl, taxes, companyName }) => {
//   const [buyerState, setbuyState] = useState("");
//   const [sellerState, setSellerState] = useState("");

//   //token
//   const getToken = () => {
//     const cookie = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("access_token="));
//     return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
//   };

//   const notifyTokenMissing = () => {
//     if (typeof window !== "undefined" && window.notyf) {
//       window.notyf.error("Authentication token not found!");
//     } else {
//       console.error("Authentication token not found!");
//     }
//   };

//   useEffect(() => {
//     fetchCompanyDetails();
//     setbuyState(data?.users?.customers[0]?.state?.trim().toLowerCase() || "");
//     // setSellerState(companyName?.users?.information?.state?.toLowerCase() || "");
//   }, []);
//   console.log(data);
//   console.log(("compnay form invoiceTable", companyName));
//   console.log("setSellerState state", companyName?.users);

//   const fetchCompanyDetails = async () => {
//     try {
//       const response = await getMe();
//       console.log("Company details fetched:", response); // Log the API response to verify the data
//       if (response && response.data) {
//         // setCompanyName(response.data); // Update state with the company name
//         setSellerState(
//           response?.data?.user?.information?.state?.trim().toLowerCase() || ""
//         );
//         console.log(
//           " response?.data?.user?.information?.state.toLowerCase()",
//           response?.data?.user?.information?.state.toLowerCase()
//         );
//       } else {
//         console.log("Company name not found in the response");
//         // setCompanyName(""); // Set default if name is not found
//       }
//     } catch (error) {
//       console.error("Error fetching company details:", error);
//     }
//   };

//   const totalTaxableValue = data.details.reduce(
//     (sum, invoice) => sum + Number(invoice.pro_total),
//     0
//   );
//   // const totalCGST = data.details.reduce(
//   //   (sum, invoice) => sum + (invoice.pro_total * invoice.tax_rate) / 2 / 100,
//   //   0
//   // );
//   // const totalSGST = data.details.reduce(
//   //   (sum, invoice) => sum + (invoice.pro_total * invoice.tax_rate) / 2 / 100,
//   //   0
//   // );
//   // const totalTaxAmount = totalCGST + totalSGST;
//   // const isSameState = buyerState && sellerState && buyerState === sellerState;
//   const isSameState = buyerState === "" ? true : buyerState === sellerState;

//   console.log("isSameState1", isSameState);
//   console.log("buyerState2", buyerState);
//   let totalCGST = 0;
//   let totalSGST = 0;
//   let totalIGST = 0;
//   let totalTaxAmount = 0;
//   let roundoff = 0;

//   console.log("isSameState", isSameState);
//   // console.log("isSameState", isSameState);
//   console.log("buyerState", buyerState);
//   console.log("sellerState", sellerState);

//   if (isSameState) {
//     totalCGST = data.details.reduce((sum, invoice) => {
//       const cgst = (invoice.pro_total * invoice.tax_rate) / 2 / 100;
//       return sum + cgst;
//     }, 0);

//     totalSGST = data.details.reduce((sum, invoice) => {
//       const sgst = (invoice.pro_total * invoice.tax_rate) / 2 / 100;
//       return sum + sgst;
//     }, 0);

//     totalTaxAmount = Math.round(totalCGST + totalSGST);
//   //  roundoff  = totalCGST + totalSGST;
//   } else {
//     totalIGST = data.details.reduce((sum, invoice) => {
//       const igst = (invoice.pro_total * invoice.tax_rate) / 100;
//       return sum + igst;
//     }, 0);

//     totalTaxAmount = Math.round(totalIGST);
//     // roundoff=totalCGST
//   }

//   let i = 0;
//   let j = 1;
//   const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");

//   // Extract numeric tax rates from the data
//   const taxRates = taxes.map((tax) => parseFloat(tax.amount));
//   console.log("Tax Rates: ", taxRates); // [18, 12]

//   // Function to fetch logo URL
//   const fetchLogoUrl = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {
//       const response = await axios.get(
//         " http://127.0.0.1:8000/api/masterlogobill",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("API Responsejhgfghjk:", response.data);

//       const logo = response.data.logo;
//       if (logo) {
//         console.log("Fetched Logo URL:", logo);
//         setFetchedLogoUrl(logo);
//       } else {
//         console.error("Error: 'logo' key not found in response");
//       }
//     } catch (error) {
//       console.error("Error fetching logo URL:", error);
//     }
//   };

//   useEffect(() => {
//     fetchLogoUrl();
//   }, []); // Runs only on mount

//   // Function to calculate tax for a single amount and percentage
//   const calculateTax = (amount, taxPercentage) =>
//     (amount * taxPercentage) / 100;

//   // Calculate tax details for each rate
//   const taxDetails = taxRates.map((rate) => ({
//     rate,
//     taxAmount: calculateTax(data.total_price, rate),
//   }));

//   console.log("Tax Details: ", taxDetails);
//   console.log("Invoice Data:", data);
//   let totalGstAmount = 0;

//   // Calculate total price and total tax
//   const totalPrice = parseFloat(data.gross_total) || 0;
//   const totalTax = taxes.reduce((sum, tax) => {
//     const taxRate = Number(tax.amount) || 0;
//     return sum + (totalPrice * taxRate) / 100;
//   }, 0);

//   const roundedTotalTax = totalTax.toFixed(2);
//   const grandTotal = parseFloat(data.total_price) || 0;
//   // const grandTotal = totalPrice ;

//   console.log("Base Total: ", totalPrice);
//   console.log("Total Tax Amount: ", totalTax);
//   console.log("Grand Total: ", grandTotal);
//   roundoff=Number(totalPrice+totalTax).toFixed(2)
//   // Function to round to two decimal places
//   const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;
//   const roundedGrandTotal = Math.round(grandTotal);

//   //function for conver in word to letters
//   const getAmountInWords = (amount) => {
//     const rounded = Math.floor(amount);
//     const words = toWords(rounded);
//     const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
//     return `${capitalized} Only`;
//   };
//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     if (tableRef.current) {
//       autoTable(doc, { html: tableRef.current });
//       doc.save("my-table.pdf");
//     }
//   };
//   console.log("Rounded Grand Total: ", roundedGrandTotal);

//   return (
//     <div className="border-t w-full   relative  border-gray-800">
//       {/* Table Header */}
//       {/* <button
//         onClick={downloadPDF}
//         className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Download as PDF
//       </button> */}
//       <div className="opacity-10 absolute bottom-[40%] left-[25%]">
//         {fetchedLogoUrl && (
//           <img src={fetchedLogoUrl} alt="Logo" className="w-[80%]" />
//         )}
//       </div>
//       <table className="w-full border border-gray-800 border-collapse">
//         <thead>
//           <tr className="bg-red-100">
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               SL No.
//             </th>
//             <th className="border-r text-[13px] text-[#333]  w-[9rem] font-medium border-gray-800 text-center p-2">
//               Product Name
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               HSN
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               Net.Wt(g)
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               G.Wt(g)
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               Qty
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               Metal Val Rate(₹)
//             </th>
//             {/* Diamond (Carats) */}
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               Dmd(ct)
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               Dmd(Val)
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               Making Chg (%)/Rs
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               Other Chg (₹)
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               Making Disc(%)/Gst(%)
//             </th>
//             <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
//               Taxable Amt (₹)
//             </th>
//           </tr>
//         </thead>

//         {/* Table Body */}
//         <tbody>
//           {data.details.map((invoice, index) => (
//             <tr key={index}>
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {index + 1}
//               </td>
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center px-2">
//                 {invoice?.product_name}
//                 <br />
//                 <span className=" text-[10px]">{invoice.description}</span>
//               </td>

//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {invoice.hsn}
//               </td>
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {invoice.net_weight}
//               </td>
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {invoice.gross_weight}
//               </td>
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {invoice.qty}
//               </td>

//               {invoice.net_weight > 0 ? (
//                 <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                   {invoice.rate}
//                 </td>
//               ) : (
//                 <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                   0
//                 </td>
//               )}

//               {/* <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {invoice.rate}
//               </td> */}
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {invoice.diamondDetails}
//               </td>
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {invoice.diamondValue}
//               </td>
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {(invoice.making || invoice.makingInRs) && (
//                   <span>
//                     {invoice.making ? `${Math.round(invoice.making)}%` : "0"}
//                     <span>/</span>
//                     {invoice.makingInRs ? `${invoice.makingInRs}` : "0"}
//                   </span>
//                 )}
//               </td>
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {invoice?.otherCharge}
//               </td>
//               <td className="border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {(invoice.making_dsc != null ||
//                   invoice.making_gst_percentage != null) && (
//                   <span>
//                     {invoice?.making_dsc != null
//                       ? `${invoice.making_dsc}%`
//                       : "0%"}
//                     <span>/</span>
//                     {invoice?.making_gst_percentage != null
//                       ? `${invoice.making_gst_percentage}%`
//                       : "0%"}
//                   </span>
//                 )}
//               </td>
//               <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
//                 {invoice.pro_total}
//               </td>
//             </tr>
//           ))}

//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>
//           <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//           </tr>

//           {/* huid */}

//           {data.details.some((invoice) => invoice.huid > 0) && (
//             <tr className="">
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r text-xs border-gray-800 text-center ">
//                 HUID <span className="text-xs ">(added)</span>
//               </td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               {data.details.some((invoice) => invoice.huid > 0) && (
//                 <td className=" border-r border-gray-800 text-center">
//                   {data.details.map((invoice, index) => (
//                     <span className="text-xs" key={index}>
//                       ₹{invoice.huid ? invoice.huid : ""}
//                     </span>
//                   ))}
//                 </td>
//               )}
//             </tr>
//           )}

//           {/* <tr>
//             <td className=" border-r border-gray-800 text-center "></td>
//             {data.details.some((invoice) => invoice.huid) && (
//               <td className=" border-r text-xs border-gray-800 text-center ">
//                 HUID<span className=" text-xs">(added)</span>
//               </td>
//             )}

//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             {data.details.some((invoice) => invoice.huid > 0) && (
//               <td className=" border-r border-gray-800 text-center">
//                 {data.details.map((invoice, index) => (
//                   <span className="text-xs" key={index}>
//                     ₹{invoice.huid ? invoice.huid : ""}
//                   </span>
//                 ))}
//               </td>
//             )}
//           </tr> */}

//           {/* hallmark */}

//           {data.details.some((invoice) => invoice.hallmark > 0) && (
//             <tr className="">
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r text-xs border-gray-800 text-center">
//                 HallMark <span className="text-xs ">(added)</span>
//               </td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               {data.details.some((invoice) => invoice.huid > 0) && (
//                 <td className=" border-r border-gray-800 text-center ">
//                   {data.details.map((invoice, index) => (
//                     <span className="text-xs" key={index}>
//                       ₹{invoice.hallmark ? invoice.hallmark : ""}
//                     </span>
//                   ))}
//                 </td>
//               )}
//             </tr>
//           )}

//           {/* <tr>
//             <td className=" border-r border-gray-800 text-center "></td>
//             {data.details.some((invoice) => invoice.hallmark > 0) && (
//               <td className=" border-r text-xs border-gray-800 text-center ">
//                 HallMark<span className=" text-xs">(added)</span>
//               </td>
//             )}

//             <td className=" border-r border-gray-800  text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>

//             {data.details.some((invoice) => invoice.huid > 0) && (
//               <td className=" border-r border-gray-800 text-center ">
//                 {data.details.map((invoice, index) => (
//                   <span className="text-xs" key={index}>
//                     ₹{invoice.hallmark ? invoice.hallmark : ""}
//                   </span>
//                 ))}
//               </td>
//             )}
//           </tr> */}
//           <tr className="bg-red-100 p-[3rem]">
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className="border-r border-gray-800 text-right p-2 font-bold">
//               Gross Total
//             </td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className="border-r border-gray-800 text-center p-2 font-bold">
//               ₹{totalPrice}
//             </td>
//           </tr>

//           {/* discoutn% ,discountrs ,addtionRs and description */}

//           {data?.discountPercent > 0 && (
//             <tr className="bg-red-100 p-[3rem]">
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r text-xs border-gray-800 text-center">
//                 Disc: ({data.discountPercent}%)
//               </td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center p-2"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r border-gray-800 text-xs text-center font-semibold">
//                 - ₹{((totalPrice * data.discountPercent) / 100).toFixed(2)}
//               </td>
//             </tr>
//           )}

//           {/* discount Rs */}
//           {data?.discountRs > 0 && (
//             <tr className="bg-red-100 p-[3rem]">
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r text-xs border-gray-800 text-center">
//                 Disc Rs
//               </td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center p-2"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r border-gray-800 text-xs text-center font-semibold">
//                 - ₹{parseFloat(data?.discountRs).toFixed(2)}
//               </td>
//             </tr>
//           )}

//           {/* additionRs */}
//           {data?.additionRS > 0 && (
//             <tr className="bg-red-100 p-[3rem] border  border-gray-800 border-collapse">
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r text-xs border-gray-800 text-center">
//                 Addition Rs
//               </td>
//               {/* <td className="border-r border-gray-800 text-center p-2"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td> */}
//               <td
//                 className="border-t border-b border-r text-xs border-gray-800  font-semibold"
//                 colSpan={10}
//               >
//                 {data?.additionDetail}
//               </td>
//               <td className="border-r border-gray-800 text-xs text-center font-semibold">
//                 + ₹{data?.additionRS}
//               </td>
//             </tr>
//           )}

//           {/* adjustment and adavanced */}
//           {data?.minAdAmt > 0 && (
//             <tr className="bg-red-100 p-[3rem]">
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r text-xs border-gray-800 text-center">
//                 Advance Rs
//               </td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center p-2"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r border-gray-800 text-xs text-center font-semibold">
//                 - ₹{parseFloat(data?.minAdAmt).toFixed(2)}
//               </td>
//             </tr>
//           )}

//           {/* advance */}

//           {data?.minAdjAmt > 0 && (
//             <tr className="bg-red-100 p-[3rem]">
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r text-xs border-gray-800 text-center">
//                 Adjustment Rs
//               </td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center p-2"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r border-gray-800 text-xs text-center font-semibold">
//                 - ₹{parseFloat(data?.minAdjAmt).toFixed(2)}
//               </td>
//             </tr>
//           )}

//           {/* {isSameState &&
//             data.bill_inv !== 1 &&
//             taxes.map((tax) => (
//               <tr key={tax.id}>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className="border-r italic border-gray-800 text-right p-2">
//                   {tax.name} @
//                 </td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className="border-r border-gray-800 text-center p-2">
//                   ₹ {totalCGST.toFixed(2)}
//                 </td>
//               </tr>
//             ))} */}
//           {/* {isSameState && data.bill_inv !== 1 && ( */}
//           {isSameState && (
//             <>
//               <tr>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className="border-r italic border-gray-800 text-right p-2">
//                   CGST @
//                 </td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center p-2"></td>
//                 <td className="border-r border-gray-800 text-center p-2">
//                   ₹{totalCGST.toFixed(2)}
//                 </td>
//               </tr>
//               <tr>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className="border-r italic border-gray-800 text-right p-2">
//                   SGST @
//                 </td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center"></td>
//                 <td className=" border-r border-gray-800 text-center p-2"></td>
//                 <td className="border-r border-gray-800 text-center p-2">
//                   ₹{totalSGST.toFixed(2)}
//                 </td>
//               </tr>
//             </>
//           )}
//           {/* {!isSameState && data.bill_inv !== 1 && ( */}

//           {!isSameState && (
//             <tr>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r italic border-gray-800 text-right p-2">
//                 igst @
//               </td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center p-2"></td>
//               <td className="border-r border-gray-800 text-center p-2">
//                 ₹{totalIGST.toFixed(2)}
//               </td>
//             </tr>
//           )}

//           {/* Total Tax Row */}
//           {data.bill_inv !== 1 && (
//             <tr>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r italic border-gray-800 text-right p-2">
//                 Round Off
//               </td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className=" border-r border-gray-800 text-center"></td>
//               <td className="border-r border-gray-800 text-center p-2 ">
//                 ₹
//                 {roundoff}
//               </td>
//             </tr>
//           )}

//           {/* <tr>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className="border-r italic border-gray-800 text-right p-2">
//               Round Off
//             </td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             <td className="border-r border-gray-800 text-center p-2">₹ {roundedGrandTotal}</td>
//           </tr> */}
//           {/*<tr>*/}
//           {/*    <td colSpan="9" className="border border-gray-800 text-right p-2">Round Off</td>*/}
//           {/*    <td className="border border-gray-800 text-center p-2">₹ 0.00</td>*/}
//           {/*</tr>*/}
//           {/*    {data.bill_inv !== 1 && ( */}
//           {/* {data.bill_inv !== 1 && ( */}
//           <tr className="bg-red-100 p-[3rem]">
//             <td className=" border-r border-gray-800 text-center"></td>
//             <td className="border-r border-gray-800 text-right p-2 font-bold">
//               Total
//             </td>
//             <td className=" border-r border-gray-800 text-center"></td>
//             <td className=" border-r border-gray-800 text-center"></td>
//             <td className=" border-r border-gray-800 text-center"></td>
//             <td className="border-r border-gray-800 text-center p-2">
//               {data?.totalqty ? data?.totalqty : "0"}
//             </td>

//             <td className=" border-r border-gray-800 text-center"></td>
//             <td className=" border-r border-gray-800 text-center"></td>
//             <td className=" border-r border-gray-800 text-center"></td>
//             <td className=" border-r border-gray-800 text-center"></td>
//             <td className=" border-r border-gray-800 text-center"></td>
//             <td className=" border-r border-gray-800 text-center p-2"></td>
//             {/* <td className="border-r border-gray-800 text-center p-2 font-bold">
//                 ₹{" "}
//                 {(
//                   roundedGrandTotal -
//                    Number(data?.minAdjAmt || 0) -
//                   Number(data?.minAdAmt || 0)
//                 ).toFixed(2)}
//               </td> */}
//             <td className="border-r border-gray-800 text-center p-2 font-bold">
//               ₹{" "}
//               {Math.round(
//                 roundedGrandTotal -
//                   Number(data?.minAdjAmt || 0) -
//                   Number(data?.minAdAmt || 0)
//               )}
//             </td>
//           </tr>
//           {/* )} */}
//         </tbody>

//         {/*/!* Table Footer *!/*/}
//         {/*<tfoot>*/}

//         {/*</tfoot>*/}
//       </table>
//       {/* calculation new table */}
//       {/*
//       {isSameState && data.bill_inv !== 1 && ( */}
//       {isSameState && (
//         <div className="overflow-x-auto mt-7">
//           <table className="w-full border border-gray-300 text-sm text-gray-900">
//             <thead className="bg-red-100 text-gray-700 uppercase text-center">
//               <tr>
//                 <th className="border border-gray-300 px-4 py-2">HSN/SAC</th>
//                 <th className="border border-gray-300 px-4 py-2">
//                   Taxable Value
//                 </th>
//                 <th colSpan="2" className="border border-gray-300 px-4 py-2">
//                   CGST
//                 </th>
//                 <th colSpan="2" className="border border-gray-300 px-4 py-2">
//                   SGST/UTGST
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2">
//                   Total Tax Amount
//                 </th>
//               </tr>
//               <tr>
//                 <th className="border border-gray-300 px-4 py-2"></th>
//                 <th className="border border-gray-300 px-4 py-2"></th>
//                 <th className="border border-gray-300 px-4 py-2">Rate</th>
//                 <th className="border border-gray-300 px-4 py-2">Amount</th>
//                 <th className="border border-gray-300 px-4 py-2">Rate</th>
//                 <th className="border border-gray-300 px-4 py-2">Amount</th>
//                 <th className="border border-gray-300 px-4 py-2"></th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {data.details.map((invoice) => (
//                 <tr key={invoice.id}>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {invoice.hsn}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {invoice.pro_total}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {(invoice.tax_rate / 2).toFixed(2)}%
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {((invoice.pro_total * invoice.tax_rate) / 200).toFixed(2)}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {(invoice.tax_rate / 2).toFixed(2)}%
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {((invoice.pro_total * invoice.tax_rate) / 200).toFixed(2)}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {(
//                       ((invoice.pro_total * invoice.tax_rate) / 200) *
//                       2
//                     ).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}

//               {/* Total Row */}
//               <tr className="font-bold bg-red-100">
//                 <td className="border border-gray-300 px-4 py-2 text-right">
//                   Total
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {totalTaxableValue.toFixed(2)}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2"></td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {totalCGST.toFixed(2)}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2"></td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {totalSGST.toFixed(2)}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {totalTaxAmount.toFixed(2)}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//       {/* border border-gray-800 border-collapse */}
//       {/* igst for table */}
//       {/*  {!isSameState && data.bill_inv !== 1 && ( */}
//       {!isSameState && (
//         <div className="overflow-x-auto mt-7">
//           <table className="w-full  border-gray-800 border-collapse text-sm text-gray-900">
//             <thead className="bg-gray-200 text-gray-700 uppercase text-center">
//               <tr className=" bg-red-100">
//                 <th className="border border-gray-300 px-4 py-2">HSN/SAC</th>
//                 <th className="border border-gray-300 px-4 py-2">
//                   Taxable Value
//                 </th>
//                 <th colSpan="2" className="border border-gray-300 px-4 py-2">
//                   IGST
//                 </th>
//                 {/* <th colSpan="2" className="border border-gray-300 px-4 py-2">
//                   SGST/UTGST
//                 </th> */}
//                 <th colSpan="4" className="border  border-gray-300 px-4 py-2">
//                   Total Tax Amount
//                 </th>
//               </tr>
//               <tr className=" bg-red-100">
//                 <th className="border border-gray-300 px-4 py-2"></th>
//                 <th className="border border-gray-300 px-4 py-2"></th>
//                 <th colSpan="2" className="border border-gray-300 px-4 py-2">
//                   Rate
//                 </th>
//                 {/* <th className="border border-gray-300 px-4 py-2"></th> */}
//                 {/* <th className="border border-gray-300 px-4 py-2">Amount</th> */}
//                 <th colSpan="3" className="border border-gray-300 px-4 py-2">
//                   Amount
//                 </th>
//                 {/* <th className="border border-gray-300 px-4 py-2">Rate</th>
//                 <th className="border border-gray-300 px-4 py-2">Amount</th> */}
//                 {/* <th className="border border-gray-300 px-4 py-2"></th> */}
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {data.details.map((invoice) => (
//                 <tr key={invoice.id}>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {invoice.hsn}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {invoice.pro_total}
//                   </td>
//                   <td colSpan="2" className="border border-gray-300 px-4 py-2">
//                     {invoice.tax_rate}%
//                   </td>
//                   {/* <td className="border border-gray-300 px-4 py-2"></td> */}
//                   <td colSpan="4" className="border border-gray-300 px-4 py-2">
//                     {((invoice.pro_total * invoice.tax_rate) / 100).toFixed(2)}
//                   </td>

//                   {/* <td className="border border-gray-300 px-4 py-2">
//                     {((invoice.pro_total * invoice.tax_rate) / 200).toFixed(2)}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {(
//                       ((invoice.pro_total * invoice.tax_rate) / 200) *
//                       2
//                     ).toFixed(2)}
//                   </td> */}
//                 </tr>
//               ))}

//               {/* Total Row */}
//               <tr className="font-bold bg-red-100">
//                 <td className="border border-gray-300 px-4 py-2 text-right">
//                   Total
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {totalTaxableValue.toFixed(2)}
//                 </td>
//                 <td
//                   colSpan="2"
//                   className="border border-gray-300 px-4 py-2"
//                 ></td>

//                 {/* <td className="border border-gray-300 px-4 py-2"></td> */}

//                 <td colSpan="4" className="border border-gray-300 px-4 py-2">
//                   {totalTaxAmount.toFixed(2)}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* letter in words */}
//       <table className="mt-7">
//         <thead className="bg-red-100 text-gray-700 uppercase text-center"></thead>
//         <tbody>
//           <tr className=" bg-white pt-5 mt-4 mb-4">
//             <span className="font-bold">Total Amount (in words):</span>
//             {/* <span className="">{amountWithSuffix}</span> */}
//             {/* {data.bill_inv !== 1 ? (
//               <span className="">{getAmountInWords(roundedGrandTotal)}</span>
//             ) : (
//               <span className="">{getAmountInWords(totalPrice)}</span>
//             )} */}
//             <span className="">{getAmountInWords(roundedGrandTotal)}</span>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default InvoiceTable;