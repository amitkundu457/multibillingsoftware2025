"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const InvoiceTable = ({ data, logoUrl, taxes, companyName }) => {
  console.log(data);
  const [printType, setPrintType] = useState("a4");

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
        "https://api.equi.co.in/api/masterlogobill",
        {
          headers: { Authorization: `Bearer ${token}` },
          
        }
      );
      console.log("API Response:", response.data);
      console.log("response of token",token)
console.log("response of logo",response)
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
      <div className="fixed top-16 right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-300">
        <label className="text-sm font-medium mb-1 block">
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
                className="w-full h-full object-contain"
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
              <p>Customer name : {data.users.name}</p>
              <p>Customer phone : {data.users.customers[0].phone}</p>

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
          <table className="w-full mt-4 border-collapse border border-gray-400 text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-2">SN</th>
                <th className="border border-gray-400 p-2">Item Name</th>
                <th className="border border-gray-400 p-2">Qty</th>
                <th className="border border-gray-400 p-2">Amount</th>
                <th className="border border-gray-400 p-2">gst</th>
                <th className="border border-gray-400 p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.saloon_details.map((invoice, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-400 p-2">
                    {index+1}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {invoice.product_name}
                  </td>
                  <td className="border border-gray-400 p-2">{invoice.qty}</td>
                  <td className="border border-gray-400 p-2">{invoice.rate}</td>
                  <td className="border border-gray-400 p-2">
                    {invoice.tax_rate}%
                  </td>
                  <td className="border border-gray-400 p-2">
                    {invoice.pro_total}
                  </td>
                </tr>
              ))}
              <tr>
                <td className=" border-gray-400 p-2"></td>
                <td className=" border-gray-400 p-2"></td>
                <td className=" border-gray-400 p-2"></td>

                <td className=" border-gray-400 p-2"></td>
                <td className=" border-gray-400 p-2"></td>
                <td className=" border-gray-400 p-2">
                  <p className="text-lg font-bold pl-16"></p>
                </td>
              </tr>
              
              <tr>
                <td className="border border-gray-400 p-2">Gross Total</td>
                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2"></td>

                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2">
                  <p className="text-xs pl-16">
                    ₹{totals.totalTaxabletttAmount}
                  </p>
                </td>
              </tr>
              {
                data.totalDiscount>0 &&(
                  <tr>
                  <td className="border border-gray-400 p-2">Discount</td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
  
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2">
                    <p className="text-xs pl-16">
                      -₹{data.totalDiscount}
                    </p>
                  </td>
                </tr>

                )
              }
              {
                data.membDiscount>0 && (
                  <tr>
                <td className="border border-gray-400 p-2"> Membership Disc:</td>
                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2 items-center">
              
                </td>

                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2">
                  <p className="text-xs  pl-16 ">
                  <div>-₹{((data.gross_total * data.membDiscount) / 100).toFixed(2)}</div>
                  </p>
                </td>
              </tr>

                )
              }

              {/* onsole.log(totals.totalTaxtttAmount);
  console.log(totals.totalTaxabletttAmount); */}
              {/* cgst and sgst */}
              {!isSameState && (
                <tr>
                  <td className="border border-gray-400 p-2">@igst</td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>

                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2">
                    <p className="text-xs pl-16">₹{(totals.totalTaxtttAmount).toFixed(2)}</p>
                  </td>
                </tr>
              )}

              {/* cgst and sgst  .toFixed(2)*/}

              {isSameState && (
                <>
                  <tr>
                    <td className="border border-gray-400 p-2">@cgst</td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2">
                      <p className="text-xs pl-16">
                        ₹{(totals.totalTaxtttAmount / 2).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-2">@sgst</td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2">
                      <p className="text-xs pl-16">
                        ₹{(totals.totalTaxtttAmount / 2).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                </>
              )}

              

              <tr>
                <td className="border border-gray-400 p-2"> Total:</td>
                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2 items-center">
                  {totals.totalqty}
                </td>

                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2">
                 <p className="text-xs pl-16">
  ₹{(
    (Number(totals?.totalTaxabletttAmount) || 0) +
    (Number(totals?.totalTaxtttAmount) || 0) -
    (Number(data?.totalDiscount) || 0)
  ).toFixed(2)}
</p>

                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div className="overflow-x-auto p-4">
            {isSameState && (
              <table className="min-w-full border border-gray-300 text-center text-xs">
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
                    <td className="p-2 border">{(totalTaxableAmount).toFixed(2)}</td>
                    <td className="p-2 border"></td>
                    <td className="p-2 border">{(totalCgstAmount).toFixed(2)}</td>
                    <td className="p-2 border"></td>
                    <td className="p-2 border">{(totalSgstAmount).toFixed(2)}</td>
                    <td className="p-2 border">{(totalTaxAmount).toFixed(2)}</td>
                  </tr>
                  {/* <tr className="font-bold border-t border-dashed text-lg">
                  <td className="p-4 text-left">Grand Total</td>
                  <td className="text-right p-4" colSpan="6">
                    ₹{(data.total_payment + totalTaxAmount).toFixed(2)}
                  </td>
                </tr> */}
                </tbody>
              </table>
            )}
            {/* isstate when true */}
            {!isSameState && (
              <table className="min-w-full border border-gray-300 text-center text-xs">
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
                  {/* <tr className="font-bold border-t border-dashed text-lg">
                  <td className="p-4 text-left">Grand Total</td>
                  <td className="text-right p-4" colSpan="6">
                    ₹{(data.total_payment + totalTaxAmount).toFixed(2)}
                  </td>
                </tr> */}
                </tbody>
              </table>
            )}
          </div>
          <p className="mt-4 text-center text-xs">THANK YOU FOR SHOPPING</p>
        </div>
      ) : printType == "thermal" ? (
        <div className="max-w-md mx-auto bg-white p-6 shadow-lg border rounded-lg">
          {/* logo */}
          {fetchedLogoUrl && (
            <div className=" mx-auto rounded-md w-20 h-10 mb-4">
              <img
                src={fetchedLogoUrl}
                alt="Company Logo"
                className="w-full rounded-sm h-full object-contain"
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
              <strong>Customer Name:</strong> {data.users.name}
            </p>
            <p>
              <strong>Mobile No:</strong> {data.users.customers[0].phone}
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
              <strong>Payment Mode:</strong> {data.saloon_payments[0].payment_method}
            </p>
          </div>
      
          <table className="w-full mt-4 border text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Service & Product</th>
                {/* <th className="text-left p-2">stylist</th> */}
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
              <div className="font-semibold border-t border-dashed mt-5 text-xs flex justify-between px-1">
                <div>Total Amount (Before Discount)</div>
                <div>₹{data.gross_total}</div>
              </div>
      
              {isSameState ? (
                <>
                  <div className="border-t border-dashed mt-2 text-xs flex justify-between px-1">
                    <div>CGST</div>
                    <div>₹{(totals.totalTaxtttAmount / 2).toFixed(2)}</div>
                  </div>
                  <div className="border-t border-dashed mt-2 text-xs flex justify-between px-1">
                    <div>SGST</div>
                    <div>₹{(totals.totalTaxtttAmount / 2).toFixed(2)}</div>
                  </div>
                </>
              ) : (
                <div className="border-t border-dashed mt-2 text-xs flex justify-between px-1">
                  <div>IGST</div>
                  <div>₹{(totals.totalTaxtttAmount).toFixed(2)}</div>
                </div>
              )}

{
  data.membDiscount>0 &&(
    <div className="text-xs border-t border-dashed mt-2 flex justify-between px-1 text-red-500">
    <div>Membership Discount (if applicable)</div>
    <div>-₹{((data.gross_total * data.membDiscount) / 100).toFixed(2)}</div>
  </div>

  )
}

      
            
              {
                data?.totalDiscount>0 &&(
                  <div className="text-xs border-t border-dashed mt-2 flex justify-between px-1 text-red-500">
                  <div>Discount: </div>
                  <div>-₹{data?.totalDiscount}</div>
                </div>
                )

              }
             
      
              <div className="font-semibold border-t border-dashed mt-5 text-xs flex justify-between px-1">
                <div>Net Amount</div>
                <div>
                  ₹
                  {(
                    Number(data.gross_total) + Number(totals.totalTaxtttAmount)- (Number(data?.totalDiscount) || 0)
                  ).toFixed(2)-((data.gross_total * data.membDiscount) / 100).toFixed(2)}
                </div>
              </div>
            </>
          )}
      
          <div className="mt-4 border-t pt-4">
            {/* Additional details if needed */}
          </div>
      
          <div className="max-w-md mx-auto bg-white p-4 shadow-lg border rounded-lg font-mono text-xs">
            {isSameState ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dashed">
                    <th className="text-left p-1">HSN/SAC</th>
                    <th className="text-right p-1">Taxable</th>
                    <th className="text-right p-1">CGST</th>
                    <th className="text-right p-1">SGST</th>
                    <th className="text-right p-1">Total Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {data.saloon_details.map((invoice, index) => {
                    const cgstAmount = (invoice.pro_total * (invoice.tax_rate / 2)) / 100;
                    const sgstAmount = (invoice.pro_total * (invoice.tax_rate / 2)) / 100;
                    const taxAmount = cgstAmount + sgstAmount;
      
                    totalCgstAmount += cgstAmount;
                    totalTaxableAmount += Number(invoice.pro_total);
                    totalSgstAmount += sgstAmount;
                    totalTaxAmount += taxAmount;
      
                    return (
                      <tr key={index} className="border-b border-dashed">
                        <td className="p-1">{invoice.hsn}</td>
                        <td className="text-right p-1">{invoice.pro_total}</td>
                        <td className="text-right p-1">{cgstAmount.toFixed(2)}</td>
                        <td className="text-right p-1">{sgstAmount.toFixed(2)}</td>
                        <td className="text-right p-1">{taxAmount.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold border-t border-dashed">
                    <td className="p-1">Total</td>
                    <td className="text-right p-1">{totalTaxableAmount.toFixed(2)}</td>
                    <td className="text-right p-1">{totalCgstAmount.toFixed(2)}</td>
                    <td className="text-right p-1">{totalSgstAmount.toFixed(2)}</td>
                    <td className="text-right p-1">{totalTaxAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dashed">
                    <th className="text-left p-1">HSN/SAC</th>
                    <th className="text-right p-1">Taxable</th>
                    <th className="text-right p-1">IGST Rate</th>
                    <th className="text-right p-1">IGST Amt</th>
                    <th className="text-right p-1">Total Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {data.saloon_details.map((invoice, index) => {
                    const igstAmount = (invoice.pro_total * invoice.tax_rate) / 100;
                    totalTaxableAmount += Number(invoice.pro_total);
                    totalTaxAmount += igstAmount;
      
                    return (
                      <tr key={index} className="border-b border-dashed">
                        <td className="p-1">{invoice.hsn}</td>
                        <td className="text-right p-1">{invoice.pro_total}</td>
                        <td className="text-right p-1">{invoice.tax_rate}%</td>
                        <td className="text-right p-1">{igstAmount.toFixed(2)}</td>
                        <td className="text-right p-1">{igstAmount.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold border-t border-dashed">
                    <td className="p-1">Total</td>
                    <td className="text-right p-1">{totalTaxableAmount.toFixed(2)}</td>
                    <td className="text-right p-1">-</td>
                    <td className="text-right p-1">{totalTaxAmount.toFixed(2)}</td>
                    <td className="text-right p-1">{totalTaxAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
      
          <p className="text-center text-sm font-semibold mt-4">
            ****THANK YOU. PLEASE VISIT AGAIN****
          </p>
        </div>
      ) : null}
      
    </div>
  );
};

export default InvoiceTable;
