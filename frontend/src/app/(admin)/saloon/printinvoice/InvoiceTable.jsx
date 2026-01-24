"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const InvoiceTable = ({ data, logoUrl, taxes, companyName, termCondition }) => {
  console.log(data);
  const [printType, setPrintType] = useState("thermal");

  //busysate and seller state
  const [buyState, setBuyState] = useState("");
  const [sellerState, setSellerState] = useState("");

  useEffect(() => {
    if (companyName?.user_information?.state) {
      setSellerState(companyName.user_information.state);
    }

    if (data?.users?.customers?.[0]?.state) {
      setBuyState(data.users.customers[0].state);
    }
  }, [companyName, data]);

  console.log("buystate", buyState);
  console.log("seller state", sellerState);
  console.log("compnay or clinet details", companyName);

  //copy from jwel
  const isSameState = buyState === "" ? true : buyState === sellerState;
  console.log("saloon isSameState", isSameState);
  console.log("saloon data invoice print", data);
  // console.log("isSameState1", isSameState);
  // console.log("buyerState2", buyerState);
  // let totalCGST = 0;
  // let totalSGST = 0;
  // let totalIGST = 0;
  // let totalTaxAmount = 0;
  // let roundoff = 0;

  // console.log("isSameState", isSameState);
  // // console.log("isSameState", isSameState);
  // console.log("buyerState", buyerState);
  // console.log("sellerState", sellerState);

  // if (isSameState) {
  //   totalCGST = data.details.reduce((sum, invoice) => {
  //     const cgst = (invoice.pro_total * invoice.tax_rate) / 2 / 100;
  //     return sum + cgst;
  //   }, 0);

  //   totalSGST = data.details.reduce((sum, invoice) => {
  //     const sgst = (invoice.pro_total * invoice.tax_rate) / 2 / 100;
  //     return sum + sgst;
  //   }, 0);

  //   totalTaxAmount = Math.round(totalCGST + totalSGST);
  // //  roundoff  = totalCGST + totalSGST;
  // } else {
  //   totalIGST = data.details.reduce((sum, invoice) => {
  //     const igst = (invoice.pro_total * invoice.tax_rate) / 100;
  //     return sum + igst;
  //   }, 0);

  //   totalTaxAmount = Math.round(totalIGST);
  //   // roundoff=totalCGST
  // }

  const totals = data.saloon_details.reduce(
    (acc, invoice) => {
      const cgstAmount = (invoice.pro_total * (invoice.tax_rate / 2)) / 100;
      const sgstAmount = (invoice.pro_total * (invoice.tax_rate / 2)) / 100;
      const taxAmount = cgstAmount + sgstAmount;

      acc.totalCgstttAmount += cgstAmount;
      acc.totalSgstttAmount += sgstAmount;
      acc.totalTaxtttAmount += taxAmount;
      acc.totalTaxabletttAmount += Number(invoice.pro_total);
      acc.totalqty += Number(invoice.qty);

      return acc;
    },
    {
      totalCgstttAmount: 0,
      totalSgstttAmount: 0,
      totalTaxtttAmount: 0,
      totalTaxabletttAmount: 0,
      totalqty: 0,
    }
  );

  // Example usage:
  console.log(totals.totalCgstttAmount);
  console.log(totals.totalSgstttAmount);
  console.log(totals.totalTaxtttAmount);
  console.log(totals.totalTaxabletttAmount);
  console.log(totals.totalqty);

  let totalCgstAmount = 0;
  let totalTaxableAmount = 0;
  let totalSgstAmount = 0;
  let totalTaxAmount = 0;

  const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");

  // Extract numeric tax rates from the data
  const taxRates = taxes.map((tax) => parseFloat(tax.amount));
  console.log("Tax Rates: ", taxRates); // [18, 12]

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

  // Function to fetch logo URL
  const fetchLogoUrl = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const response = await axios.get(
        " https://apibrize.brizindia.com/api/masterlogobill",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API Response:", response.data);
      console.log("response of token", token);
      console.log("response of logo", response);
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

  return (
    <div>
      <div className="fixed p-3 bg-white border border-gray-300 rounded-lg shadow-lg top-16 right-4">
        <label className="block mb-1 text-sm font-medium">
          Select Print Type:
        </label>
        <select
          value={printType}
          onChange={(e) => setPrintType(e.target.value)}
          className="w-40 p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="a4">A4</option>
          <option value="thermal">Thermal</option>
        </select>

        {printType && (
          <p className="mt-2 text-sm font-semibold text-gray-700">
            Selected: {printType.toUpperCase()}
          </p>
        )}
      </div>
      {/* format */}
      {printType == "a4" ? (
        <div className="w-[210mm] h-[297mm] bg-white p-10 shadow-lg mx-auto border border-gray-300">
          {/* logo */}
          {fetchedLogoUrl && (
            <div className="w-20 h-10 mb-4">
              <img
                src={fetchedLogoUrl}
                alt="Company Logo"
                className="object-contain w-full h-full"
              />
            </div>
          )}
          {/* Header */}
          {/* <div className="text-center">
            <h1 className="text-2xl font-bold">
              {companyName.user_information?.business_name}
            </h1> */}
          {/* <h2 className="text-xl font-semibold">Hyper Drive Beauty Salon</h2> */}
          {/* <p className="text-sm">
              {companyName.user_information?.address_1},{" "}
              {companyName.user_information?.address_2} ,
              {companyName.user_information?.pincode}
            </p>
            <p className="text-sm">
              {" "}
              {companyName.user_information?.mobile_number}
            </p>
            <hr className="my-2 border-gray-400" />
          </div> */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {companyName.user_information?.business_name}
            </h1>

            <p className="text-sm">
              {companyName.user_information?.address_1},{" "}
              {companyName.user_information?.address_2} ,
              {companyName.user_information?.pincode}
            </p>
            <p className="text-sm">
              {" "}
              {companyName.user_information?.mobile_number}
            </p>
            <hr className="my-2 border-gray-400" />
          </div>

          {/* Invoice Details  table*/}
          <div className="flex justify-between text-sm">
            <div>
              <p>Customer name : {data.users?.name}</p>
              <p>Customer phone : {data.users?.customers[0].phone}</p>

              <p>Payment Type: {data.saloon_payments[0].payment_method}</p>
            </div>
            <div className="text-right">
              <p>
                Date: {new Date(data.created_at).toISOString().split("T")[0]}
              </p>
              <p>Bill No: {data.billno}</p>
            </div>
          </div>

          {/* Table Header */}
          <table className="w-full mt-4 text-xs border border-collapse border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-400">SN</th>
                <th className="p-2 border border-gray-400">Item Name</th>
                <th className="p-2 border border-gray-400">Qty</th>
                <th className="p-2 border border-gray-400">Amount</th>
                <th className="p-2 border border-gray-400">gst</th>
                <th className="p-2 border border-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.saloon_details.map((invoice, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border border-gray-400">{index + 1}</td>
                  <td className="p-2 border border-gray-400">
                    {invoice.product_name}
                  </td>
                  <td className="p-2 border border-gray-400">{invoice.qty}</td>
                  <td className="p-2 border border-gray-400">{invoice.rate}</td>
                  <td className="p-2 border border-gray-400">
                    {invoice.tax_rate}%
                  </td>
                  <td className="p-2 border border-gray-400">
                    {invoice.pro_total}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-2 border-gray-400 "></td>
                <td className="p-2 border-gray-400 "></td>
                <td className="p-2 border-gray-400 "></td>

                <td className="p-2 border-gray-400 "></td>
                <td className="p-2 border-gray-400 "></td>
                <td className="p-2 border-gray-400 ">
                  <p className="pl-16 text-lg font-bold"></p>
                </td>
              </tr>

              <tr>
                <td className="p-2 border border-gray-400">Gross Total</td>
                <td className="p-2 border border-gray-400"></td>
                <td className="p-2 border border-gray-400"></td>

                <td className="p-2 border border-gray-400"></td>
                <td className="p-2 border border-gray-400"></td>
                <td className="p-2 border border-gray-400">
                  <p className="pl-16 text-xs">
                    ₹{totals.totalTaxabletttAmount}
                  </p>
                </td>
              </tr>
              {data.totalDiscount > 0 && (
                <tr>
                  <td className="p-2 border border-gray-400">Discount</td>
                  <td className="p-2 border border-gray-400"></td>
                  <td className="p-2 border border-gray-400"></td>

                  <td className="p-2 border border-gray-400"></td>
                  <td className="p-2 border border-gray-400"></td>
                  <td className="p-2 border border-gray-400">
                    <p className="pl-16 text-xs">-₹{data.totalDiscount}</p>
                  </td>
                </tr>
              )}
              {data.membDiscount > 0 && (
                <tr>
                  <td className="p-2 border border-gray-400">
                    {" "}
                    Membership Disc:
                  </td>
                  <td className="p-2 border border-gray-400"></td>
                  <td className="items-center p-2 border border-gray-400"></td>

                  <td className="p-2 border border-gray-400"></td>
                  <td className="p-2 border border-gray-400"></td>
                  <td className="p-2 border border-gray-400">
                    <p className="pl-16 text-xs ">
                      <div>
                        -₹
                        {((data.gross_total * data.membDiscount) / 100).toFixed(
                          2
                        )}
                      </div>
                    </p>
                  </td>
                </tr>
              )}

              {/* onsole.log(totals.totalTaxtttAmount);
  console.log(totals.totalTaxabletttAmount); */}
              {/* cgst and sgst */}
              {!isSameState && (
                <tr>
                  <td className="p-2 border border-gray-400">@igst</td>
                  <td className="p-2 border border-gray-400"></td>
                  <td className="p-2 border border-gray-400"></td>

                  <td className="p-2 border border-gray-400"></td>
                  <td className="p-2 border border-gray-400"></td>
                  <td className="p-2 border border-gray-400">
                    <p className="pl-16 text-xs">
                      ₹{totals.totalTaxtttAmount.toFixed(2)}
                    </p>
                  </td>
                </tr>
              )}

              {/* cgst and sgst  .toFixed(2)*/}

              {isSameState && (
                <>
                  <tr>
                    <td className="p-2 border border-gray-400">@cgst</td>
                    <td className="p-2 border border-gray-400"></td>
                    <td className="p-2 border border-gray-400"></td>
                    <td className="p-2 border border-gray-400"></td>
                    <td className="p-2 border border-gray-400"></td>
                    <td className="p-2 border border-gray-400">
                      <p className="pl-16 text-xs">
                        ₹{(totals.totalTaxtttAmount / 2).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-400">@sgst</td>
                    <td className="p-2 border border-gray-400"></td>
                    <td className="p-2 border border-gray-400"></td>
                    <td className="p-2 border border-gray-400"></td>
                    <td className="p-2 border border-gray-400"></td>
                    <td className="p-2 border border-gray-400">
                      <p className="pl-16 text-xs">
                        ₹{(totals.totalTaxtttAmount / 2).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <td className="p-2 border border-gray-400"> Total:</td>
                <td className="p-2 border border-gray-400"></td>
                <td className="items-center p-2 border border-gray-400">
                  {totals.totalqty}
                </td>

                <td className="p-2 border border-gray-400"></td>
                <td className="p-2 border border-gray-400"></td>
                <td className="p-2 border border-gray-400">
                  <p className="pl-16 text-xs">
                    ₹
                    {(
                      (Number(totals?.totalTaxabletttAmount) || 0) +
                      (Number(totals?.totalTaxtttAmount) || 0) -
                      Number(data?.new_loyalty_cashback) -
                      (Number(data?.totalDiscount) || 0)
                    ).toFixed(2)}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}

          <div className="p-4 overflow-x-auto">
            {isSameState && (
              <table className="min-w-full text-xs text-center border border-gray-300">
                <thead className="bg-gray-200">
                  <tr className="border-b">
                    <th className="p-2 border">HSN/SAC</th>
                    <th className="p-2 border">Taxable Value</th>
                    <th className="p-2 border">CGST Rate</th>
                    <th className="p-2 border">CGST Amount</th>
                    <th className="p-2 border">SGST/UTGST Rate</th>
                    <th className="p-2 border">SGST/UTGST Amount</th>
                    <th className="p-2 border">Total Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.saloon_details.map((invoice, index) => {
                    const cgstAmount =
                      (invoice.pro_total * (invoice.tax_rate / 2)) / 100;
                    const sgstAmount =
                      (invoice.pro_total * (invoice.tax_rate / 2)) / 100;
                    const taxAmount = cgstAmount + sgstAmount;

                    totalCgstAmount += cgstAmount;
                    totalTaxableAmount += Number(invoice.pro_total);
                    totalSgstAmount += sgstAmount;
                    totalTaxAmount += taxAmount;

                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2 border">{invoice.hsn}</td>
                        <td className="p-2 border">{invoice.pro_total}</td>
                        <td className="p-2 border">{invoice.tax_rate / 2}%</td>
                        <td className="p-2 border">{cgstAmount.toFixed(2)}</td>
                        <td className="p-2 border">{invoice.tax_rate / 2}%</td>
                        <td className="p-2 border">{sgstAmount.toFixed(2)}</td>
                        <td className="p-2 border">{taxAmount}</td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold bg-gray-100">
                    <td className="p-2 border">Total</td>
                    <td className="p-2 border">
                      {totalTaxableAmount.toFixed(2)}
                    </td>
                    <td className="p-2 border"></td>
                    <td className="p-2 border">{totalCgstAmount.toFixed(2)}</td>
                    <td className="p-2 border"></td>
                    <td className="p-2 border">{totalSgstAmount.toFixed(2)}</td>
                    <td className="p-2 border">{totalTaxAmount.toFixed(2)}</td>
                  </tr>
                  {/* <tr className="text-lg font-bold border-t border-dashed">
                  <td className="p-4 text-left">Grand Total</td>
                  <td className="p-4 text-right" colSpan="6">
                    ₹{(data.total_payment + totalTaxAmount).toFixed(2)}
                  </td>
                </tr> */}
                </tbody>
              </table>
            )}

            {/* isstate when true */}
            {!isSameState && (
              <table className="min-w-full text-xs text-center border border-gray-300">
                <thead className="bg-gray-200">
                  <tr className="border-b">
                    <th className="p-2 border">HSN/SAC</th>
                    <th className="p-2 border">Taxable Value</th>
                    <th className="p-2 border">IGST Rate</th>
                    <th className="p-2 border">IGST Amount</th>
                    {/* <th className="p-2 border">SGST/UTGST Rate</th>
                  <th className="p-2 border">SGST/UTGST Amount</th> */}
                    <th className="p-2 border">Total Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.saloon_details.map((invoice, index) => {
                    const cgstAmount =
                      (invoice.pro_total * invoice.tax_rate) / 100;
                    const sgstAmount =
                      (invoice.pro_total * invoice.tax_rate) / 100;
                    const taxAmount = cgstAmount;

                    totalCgstAmount += cgstAmount;
                    totalTaxableAmount += Number(invoice.pro_total);
                    totalSgstAmount += sgstAmount;
                    totalTaxAmount += taxAmount;

                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2 border">{invoice.hsn}</td>
                        <td className="p-2 border">{invoice.pro_total}</td>
                        <td className="p-2 border">{invoice.tax_rate}%</td>
                        <td className="p-2 border">{cgstAmount.toFixed(2)}</td>
                        {/* <td className="p-2 border">{invoice.tax_rate / 2}</td>
                      <td className="p-2 border">{sgstAmount.toFixed(2)}</td> */}
                        <td className="p-2 border">{taxAmount}</td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold bg-gray-100">
                    <td className="p-2 border">Total</td>
                    <td className="p-2 border">{totalTaxableAmount}</td>
                    <td className="p-2 border"></td>
                    <td className="p-2 border">{totalCgstAmount}</td>
                    {/* <td className="p-2 border"></td> */}
                    {/* <td className="p-2 border">{totalSgstAmount}</td> */}
                    <td className="p-2 border">{totalTaxAmount}</td>
                  </tr>
                  {/* <tr className="text-lg font-bold border-t border-dashed">
                  <td className="p-4 text-left">Grand Total</td>
                  <td className="p-4 text-right" colSpan="6">
                    ₹{(data.total_payment + totalTaxAmount).toFixed(2)}
                  </td>
                </tr> */}
                </tbody>
              </table>
            )}
          </div>

          <div className="space-y-2">
            {data.saloon_payments.map((type, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-800 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">
                  {type.payment_method}
                </span>
                <span className="font-semibold text-gray-600">
                  ₹{type.price}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 mt-6 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">
              Terms & Conditions
            </h2>
            <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
              {termCondition.map((term, index) =>
                term.content
                  .split(".")
                  .map((sentence, i) => sentence.trim())
                  .filter(Boolean)
                  .map((sentence, i) => (
                    <li key={`${index}-${i}`}>{sentence}.</li>
                  ))
              )}
            </ul>
          </div>

          <p className="mt-4 text-xs text-center">THANK YOU FOR SHOPPING</p>
        </div>
      ) : printType == "thermal" ? (
        <div className="max-w-md p-6 mx-auto bg-white border rounded-lg shadow-lg">
          {/* logo */}
          {fetchedLogoUrl && (
            <div className="w-20 h-10 mx-auto mb-4 rounded-md ">
              <img
                src={fetchedLogoUrl}
                alt="Company Logo"
                className="object-contain w-full h-full rounded-sm"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold text-center">
            {companyName.user_information?.business_name}
          </h1>
          <p className="text-sm text-center">
            {companyName.user_information?.address_1}
          </p>
          <p className="text-sm text-center">
            {companyName.user_information?.address_2},{" "}
            {companyName.user_information?.city},{" "}
            {companyName.user_information?.pincode}
          </p>
          <p className="text-sm text-center">
            {companyName.user_information?.country},{" "}
            {companyName.user_information?.state}
          </p>
          <p className="text-sm text-center">
            Contact: {companyName.user_information?.mobile_number}
          </p>
          <p className="text-sm text-center">
            GST No: {companyName.user_information?.gst}
          </p>

          <div className="mt-4 text-sm">
            <p>
              <strong>Customer Name:</strong> {data.users?.name}
            </p>
            <p>
              <strong>Mobile No:</strong> {data.users?.customers[0].phone}
            </p>
            <p>
              <strong>Invoice No:</strong> {data.billno}
            </p>
            <p>
              <strong>Invoice Date:</strong>{" "}
              {new Date(data.created_at).toISOString().split("T")[0]}
            </p>
            <p>
              <strong>Total Balance:</strong> {data.gross_total}
            </p>
            <p>
              <strong>Payment Mode:</strong>{" "}
              {data.saloon_payments[0].payment_method}
            </p>
          </div>

          <table className="w-full mt-4 text-xs border">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Service & Product</th>
                {/* <th className="p-2 text-left">stylist</th> */}
                <th className="p-2">Amount</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.saloon_details.map((invoice) => (
                <tr className="border-b" key={invoice.id}>
                  <td className="p-2">{invoice.product_name}</td>
                  {/* <td className="p-2">stylist1</td> */}
                  <td className="p-2">{invoice.rate}</td>
                  <td className="p-2">{invoice.qty}</td>
                  <td className="p-2">{invoice.pro_total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.saloon_details.length > 0 && (
            <>
              <div className="flex justify-between px-1 mt-5 text-xs font-semibold border-t border-dashed">
                <div>Total Amount (Before Discount)</div>
                <div>₹{data.gross_total}</div>
              </div>

              {isSameState ? (
                <>
                  <div className="flex justify-between px-1 mt-2 text-xs border-t border-dashed">
                    <div>CGST</div>
                    <div>₹{(totals.totalTaxtttAmount / 2).toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between px-1 mt-2 text-xs border-t border-dashed">
                    <div>SGST</div>
                    <div>₹{(totals.totalTaxtttAmount / 2).toFixed(2)}</div>
                  </div>
                </>
              ) : (
                <div className="flex justify-between px-1 mt-2 text-xs border-t border-dashed">
                  <div>IGST</div>
                  <div>₹{totals.totalTaxtttAmount.toFixed(2)}</div>
                </div>
              )}

              {data.membDiscount > 0 && (
                <div className="flex justify-between px-1 mt-2 text-xs text-red-500 border-t border-dashed">
                  <div>Membership Discount (if applicable)</div>
                  <div>
                    -₹
                    {((data.gross_total * data.membDiscount) / 100).toFixed(2)}
                  </div>
                </div>
              )}

              {data?.totalDiscount > 0 && (
                <div className="flex justify-between px-1 mt-2 text-xs text-red-500 border-t border-dashed">
                  <div>Discount: </div>
                  <div>-₹{data?.totalDiscount}</div>
                </div>
              )}

              {data?.new_loyalty_cashback > 0 && (
                <div className="flex justify-between px-1 mt-2 text-xs text-red-500 border-t border-dashed">
                  <div>Loyalty Cashback:-₹{data?.new_loyalty_cashback}</div>
                </div>
              )}

              <div className="flex justify-between px-1 mt-5 text-xs font-semibold border-t border-dashed">
                <div>Net Amount</div>
                <div>
                  ₹
                  {(
                    Number(data.gross_total) +
                    Number(totals.totalTaxtttAmount) -
                    Number(data?.new_loyalty_cashback) -
                    (Number(data?.totalDiscount) || 0)
                  ).toFixed(2) -
                    ((data.gross_total * data.membDiscount) / 100).toFixed(2)}
                </div>
              </div>
              <div className="grid gap-3 mt-4"></div>
            </>
          )}

          <div className="pt-4 mt-4 border-t">
            {/* Additional details if needed */}
          </div>

          <div className="max-w-md p-4 mx-auto font-mono text-xs bg-white border rounded-lg shadow-lg">
            {isSameState ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dashed">
                    <th className="p-1 text-left">HSN/SAC</th>
                    <th className="p-1 text-right">Taxable</th>
                    <th className="p-1 text-right">CGST</th>
                    <th className="p-1 text-right">SGST</th>
                    <th className="p-1 text-right">Total Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {data.saloon_details.map((invoice, index) => {
                    const cgstAmount =
                      (invoice.pro_total * (invoice.tax_rate / 2)) / 100;
                    const sgstAmount =
                      (invoice.pro_total * (invoice.tax_rate / 2)) / 100;
                    const taxAmount = cgstAmount + sgstAmount;

                    totalCgstAmount += cgstAmount;
                    totalTaxableAmount += Number(invoice.pro_total);
                    totalSgstAmount += sgstAmount;
                    totalTaxAmount += taxAmount;

                    return (
                      <tr key={index} className="border-b border-dashed">
                        <td className="p-1">{invoice.hsn}</td>
                        <td className="p-1 text-right">{invoice.pro_total}</td>
                        <td className="p-1 text-right">
                          {cgstAmount.toFixed(2)}
                        </td>
                        <td className="p-1 text-right">
                          {sgstAmount.toFixed(2)}
                        </td>
                        <td className="p-1 text-right">
                          {taxAmount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold border-t border-dashed">
                    <td className="p-1">Total</td>
                    <td className="p-1 text-right">
                      {totalTaxableAmount.toFixed(2)}
                    </td>
                    <td className="p-1 text-right">
                      {totalCgstAmount.toFixed(2)}
                    </td>
                    <td className="p-1 text-right">
                      {totalSgstAmount.toFixed(2)}
                    </td>
                    <td className="p-1 text-right">
                      {totalTaxAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dashed">
                    <th className="p-1 text-left">HSN/SAC</th>
                    <th className="p-1 text-right">Taxable</th>
                    <th className="p-1 text-right">IGST Rate</th>
                    <th className="p-1 text-right">IGST Amt</th>
                    <th className="p-1 text-right">Total Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {data.saloon_details.map((invoice, index) => {
                    const igstAmount =
                      (invoice.pro_total * invoice.tax_rate) / 100;
                    totalTaxableAmount += Number(invoice.pro_total);
                    totalTaxAmount += igstAmount;

                    return (
                      <tr key={index} className="border-b border-dashed">
                        <td className="p-1">{invoice.hsn}</td>
                        <td className="p-1 text-right">{invoice.pro_total}</td>
                        <td className="p-1 text-right">{invoice.tax_rate}%</td>
                        <td className="p-1 text-right">
                          {igstAmount.toFixed(2)}
                        </td>
                        <td className="p-1 text-right">
                          {igstAmount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold border-t border-dashed">
                    <td className="p-1">Total</td>
                    <td className="p-1 text-right">
                      {totalTaxableAmount.toFixed(2)}
                    </td>
                    <td className="p-1 text-right">-</td>
                    <td className="p-1 text-right">
                      {totalTaxAmount.toFixed(2)}
                    </td>
                    <td className="p-1 text-right">
                      {totalTaxAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          <div className="space-y-2">
            {data.saloon_payments.map((type, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-800 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">
                  {type.payment_method}
                </span>

                <span className="font-semibold text-gray-600">
                  ₹{type.price}
                </span>
              </div>
            ))}
          </div>
          {/* <div className="p-4 mt-6 border border-gray-300 rounded-lg bg-gray-50">
  <h2 className="mb-3 text-lg font-semibold text-gray-800">Terms & Conditions</h2>
 <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
  {termCondition.flatMap((term, index) => 
    term.content
      .split('.')
      .map((sentence) => sentence.trim())
      .filter(Boolean) // remove empty strings
      .map((sentence, i) => (
        <li key={`${index}-${i}`}>{sentence}.</li>
      ))
  )}
</ul>


</div> */}

          <p className="mt-4 text-sm font-semibold text-center">
            ****THANK YOU. PLEASE VISIT AGAIN****
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default InvoiceTable;
