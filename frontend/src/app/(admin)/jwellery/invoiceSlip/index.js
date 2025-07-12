import React, { useEffect, useState } from "react";
import { toWords } from "number-to-words";
import { getMe } from "../../../components/config";
import axios from "axios";

const Invoice = ({ data, logoUrl, taxes = [], discount = 0 }) => {
  const [companyName, setCompanyName] = useState("");
  const [roles, setRoles] = useState([]);
  const [cgstPercentage, setCgstPercentage] = useState(null);

  const [buyerState, setbuyState] = useState("");
  const [sellerState, setSellerState] = useState("");
  console.log(data);
  console.log(("compnay form invoiceTable", companyName));


  //calcualtion 
  const words = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertToWords(num) {
    if (num === 0) return 'Zero';
  
    function numToWords(n, s) {
      let str = '';
      if (n > 19) {
        str += tens[Math.floor(n / 10)] + ' ' + words[n % 10];
      } else {
        str += words[n];
      }
  
      if (n !== 0) str += ' ' + s + ' ';
      return str;
    }
  
    let output = '';
    output += numToWords(Math.floor(num / 10000000), 'Crore');
    output += numToWords(Math.floor((num / 100000) % 100), 'Lakh');
    output += numToWords(Math.floor((num / 1000) % 100), 'Thousand');
    output += numToWords(Math.floor((num / 100) % 10), 'Hundred');
  
    if (num > 100 && num % 100 > 0) output += 'and ';
    output += numToWords(num % 100, '');
  
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
    setbuyState(data?.users?.customers[0]?.state?.trim().toLowerCase() || "");
  }, []);

  const totalTaxableValue = data.details.reduce(
    (sum, invoice) => sum + Number(invoice.pro_total),
    0
  );
  // const isSameState = buyerState && sellerState && buyerState === sellerState;
  const isSameState = buyerState === "" ? true : buyerState === sellerState;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalTaxAmount = 0;

  console.log("isSameState", isSameState);

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
  } else {
    totalIGST = data.details.reduce((sum, invoice) => {
      const igst = (invoice.pro_total * invoice.tax_rate) / 100;
      return sum + igst;
    }, 0);

    totalTaxAmount = Math.round(totalIGST);
  }

  const grossTotal = parseFloat(data.gross_total) || 0;
  const grandTotal = Math.round(data.total_price) || 0;

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getMe();
        console.log("Company details fetched:", response); // Log the API response to verify the data
        if (response && response.data) {
          setCompanyName(response.data); // Update state with the company name
          setSellerState(
            response?.data?.user?.information?.state?.trim().toLowerCase() || ""
          );
        } else {
          console.log("Company name not found in the response");
          setCompanyName(""); // Set default if name is not found
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const {
    billno = "__________",
    date = "__________",
    gross_total = "0.00",
    total_price = "0.00",
    id = "",
    users = { name: "__________", email: "__________" },
    details = [],
    adjustAmount,
    advanceAmount,
    depositeMaterial,
  } = data;
  console.log(
    "add the adjustment amount",
    Number(Number(adjustAmount) + Number(advanceAmount))
  );

  // const totalPrice = parseFloat(total_price) || 0;

  const taxess = taxes.map((tax) => ({
    name: tax.name || "Unnamed Tax",
    amount: parseFloat(tax.amount) || 0,
  }));

  //here logo of client
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");

  //logo here of client
  useEffect(() => {
    const fetchLogoUrl = async () => {
      const token = getToken();
      if (!token) {
        notifyTokenMissing();
        return;
      }
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/masterlogobill",
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

    fetchLogoUrl();
  }, []);

  // const discountedPrice = totalPrice - discount;
  // const grandTotal = discountedPrice + totalTax;
  // const roundedGrandTotal = Math.round(grandTotal * 100) / 100;

  // const totalPriceInWords = Number.isFinite(grandTotal)
  //   ? toWords(grandTotal)
  //   : "Invalid amount";

  const currentDate = new Date().toLocaleDateString(); // Get current date in a readable format

  return (
    // <div className="p-6 border mt-4 w-full border-gray-800 max-w-2xl mx-auto font-sans text-xs">
    <div className="p-6 border mt-4 w-full border-gray-800  mx-auto font-sans text-xs">

      {/* Branding Section */}
      <div className="mb-6 flex justify-between items-center">
        <div className="w-1/3">
          {/* <img src={logoUrl || ""} className="w-32 h-auto" alt="Company Logo" /> */}
          <img
            src={fetchedLogoUrl || ""}
            className="w-32 h-auto"
            alt="Company Logo"
          />
        </div>
        <div className="w-2/3 text-right">
          <h1 className="text-2xl font-bold text-red-700 font-poppins">
            {companyName.name} {/* Display the company name */}
          </h1>
          <h1 className="text-2xl font-bold text-red-700 font-poppins">
            {companyName?.roles?.[0].name} {/* Display the company name */}
          </h1>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          Order No: <span className="font-medium">{billno}</span>
        </div>

        {/* <div>
          Order no: <span className="font-medium">{id}</span>
        </div> */}
        <div>
          Date: <span className="font-medium">{date}</span>
        </div>
      </div>

      {/* Customer Section */}
      <div className="mb-6">
        <div className="flex justify-between">
          <div>
            <div className="font-semibold">
              {users.customers?.map((customer) => (
                <div key={customer.id}>
                  {/* <p className="text-sm">Customer Name: {customer.name}</p> */}
                  <p className="text-sm">Customer Name: {data.users.name}</p>
                  <p className="text-sm">Phone: {customer.phone || "N/A"}</p>
                  <p className="text-sm">
                    Email: {customer.email || "s1@gmail.com"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Ship to:</h2>
            <div className="font-semibold">
              {users.customers?.map((customer) => (
                <div key={customer.id}>
                  <p className="text-sm">
                    Address: {customer.address || "N/A"}
                    <br />
                    Pincode: {customer.pincode || "N/A"}
                    <br />
                    State: {customer.state || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border border-gray-800 border-collapse mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-800 px-4 py-2">S.No</th>
            <th className="border border-gray-800 px-4 py-2">Product Name</th>
            <th className="border border-gray-800 px-4 py-2">QTY</th>
            {/* <th className="border border-gray-800 px-4 py-2">UNIT</th> */}

            {/* <th className="border border-gray-800 px-4 py-2">UNIT PRICE</th> */}
            <th className="border border-gray-800 px-4 py-2">RATE</th>
            <th className="border border-gray-800 px-4 py-2">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {details.length > 0 ? (
            details.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-800 px-4 py-2 text-center">
                  {index + 1}
                </td>

                {/* <td className="border border-gray-800 px-4 py-2 text-center">
                  {item.unit || "1"}
                </td> */}
                <td className="border border-gray-800 px-4 py-2 text-left">
                  {item.product_name || "N/A"}
                  <br />
                  {item.description && item.description.trim() !== "" && (
                    <span className="text-[10px]">{item.description}</span>
                  )}

                  {item?.huid && (
                    <div className="leading-[7px] text-[10px]  ">
                      Huid: <span className=" text-[9px]">{item?.huid}</span>
                    </div>
                  )}
                  {"  "}
                  {item?.hallmark && (
                    <span className="leading-[7px] text-[10px]  ">
                      H.Mrk:{" "}
                      <span className=" text-[9px]">{item?.hallmark}</span>
                    </span>
                  )}
                </td>
                <td className="border border-gray-800 px-4 py-2 text-center">
                  {item.qty}
                </td>
                <td className="border border-gray-800 px-4 py-2 text-right">
                  {item.rate || "0.00"}
                </td>
                <td className="border border-gray-800 px-4 py-2 text-right">
                  {item.pro_total || "0.00"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="border border-gray-800 px-4 py-2 text-center"
              >
                No items available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="flex justify-between mb-6">
        <div>
          {isSameState && (
            <div className="flex  flex-col">
              <div>
                <span className="font-semibold text-lg">CGST:</span>
                <span className=" ml-2 text-sm">
                  {Number(totalCGST.toFixed(2))}
                </span>
              </div>
              <div>
                <span className="font-semibold text-lg">SGST:</span>
                <span className="ml-2 text-sm">
                  {Number(totalCGST.toFixed(2))}
                </span>
              </div>
            </div>
          )}
          {!isSameState && (
            <div className="flex flex-col">
              <div>
                <span className="font-semibold text-lg">IGST:</span>
                <span className="ml-2 text-sm">
                  {" "}
                  {Number(totalIGST).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* adustment and advance amount */}
          <div className="flex flex-col mt-2">
            {Number(depositeMaterial) > 0 && (
              <div>
                <span className="font-semibold text-sm">
                  Deposit Material(g):
                </span>
                <span className="ml-2 text-sm">
                  {Number(depositeMaterial).toFixed(2)}
                </span>
              </div>
            )}
            {Number(adjustAmount) > 0 && (
              <div>
                <span className="font-semibold text-sm">
                  Adjustment Amount:
                </span>
                <span className="ml-2 text-sm">
                  {Number(adjustAmount).toFixed(2)}
                </span>
              </div>
            )}
            {Number(advanceAmount) > 0 && (
              <div>
                <span className="font-semibold text-sm">Advance Amount:</span>
                <span className="ml-2 text-sm">
                  {Number(advanceAmount).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex justify-between">
            <span className="font-semibold">Gross Total:</span>
            <span>{grossTotal ? grossTotal : "0"}</span>
          </div>
          {/* <div className="flex justify-between mt-2">
            <span className="font-semibold">Discount:</span>
            <span>{discount.toFixed(2)}</span>
          </div> */}
          <div className="flex justify-between mt-2">
            <span className="font-semibold">Tax Amount:</span>
            <span>{totalTaxAmount ? totalTaxAmount : "0"}</span>
          </div>
          <div className="flex justify-between border-t border-gray-800 mt-2 pt-2">
            <span className="font-semibold">Total:</span>
            <span>{grandTotal ? grandTotal : "0"}</span>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-center text-xs mb-6">
        <div className="font-bold text-[14px]">
          Total Amount (in words):{" "}
          
          <span className="font-normal text-[13px]">{getAmountInWords(grandTotal)}</span>
        </div>
        {/* Thank You Section */}
        <div className="mt-6 font-semibold text-lg text-green-600">
          <p>THANK YOU</p>
          <p className="text-sm text-gray-500">
            We appreciate your trust and look forward to serving you again.
          </p>
        </div>

        {/* Authorized Signature & Date Section */}
        <div className="mt-8">
          <div className="flex justify-between">
            <div className="border-t border-gray-800 pt-4 w-1/2 text-center">
              <p className="font-semibold">Authorized Signature</p>
            </div>
            <div className="w-1/2 text-center">
              <p className="font-semibold">Date: {currentDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
