// import React from "react";
// import { toWords } from "number-to-words";

// const InvoiceFooter = ({ data, taxes,companyName }) => {
//     // Ensure `data.total_price` is a valid number

//     console.log("footer table",data);
//     const totalPrice = parseFloat(data.total_price) || 0;
//     const totalTaxableValue = data.details.reduce(
//         (sum, invoice) => sum + Number(invoice.pro_total),
//         0
//       );
//       const totalCGST = data.details.reduce(
//         (sum, invoice) => sum + (invoice.pro_total * (invoice.tax_rate/2)) / 100,
//         0
//       );
//       const totalSGST = data.details.reduce(
//         (sum, invoice) => sum + (invoice.pro_total * (invoice.tax_rate/2)) / 100,
//         0
//       );
//       const totalTaxAmount = totalCGST + totalSGST;
//     //   const totalPrice = parseFloat(data.total_price) || 0;
//     // Ensure all tax amounts are parsed as numbers and handle invalid values
//     const taxess = taxes?.map((tax) => parseFloat(tax.amount)) || [];
//     console.log("Tax Rates: ", taxess);
//     console.log("jhgf",companyName)

//   // Calculate total tax
//   const totalTax = taxess.reduce((sum, rate) => {
//     const taxAmount = (totalPrice * rate) / 100 || 0;
//     return sum + taxAmount;
//   }, 0);

//   // Calculate grand total
//   const grandTotal = totalTaxAmount + totalPrice;
//   const roundedGrandTotal = Math.round(grandTotal * 100) / 100;

//   console.log("Total Price: ", totalPrice);
//   console.log("Grand Total: ", grandTotal);
//   console.log("Rounded Grand Total: ", roundedGrandTotal);

//   // Convert the total to words only if it's a valid finite number
//   const totalPriceInWords = Number.isFinite(roundedGrandTotal)
//     ? toWords(roundedGrandTotal)
//     : "Invalid amount";

//   return (
//     <div className=" w-full border border-gray-300">
//       {/* Total Amount in Words */}
//       {/* <div className="border-b border-gray-300 p-3 ">
//         <span className="font-bold text-[14px]">Total Amount (in words)</span>:{" "}
//         <span className="font-normal text-[13px]">
//           {totalPriceInWords.charAt(0).toUpperCase() +
//             totalPriceInWords.slice(1)}{" "}
//           Only
//         </span>
//       </div> */}

//       {/* Payment Details Section */}
//       <div className="flex border-b border-gray-300">
//         <div className="col-span-4 w-[35%] border-r border-gray-300 p-3">
//           <p className="font-bold text-[#333]">Payment Details:</p>
//           {/* <p className="mt-2 text-[14px]">
//             PAID AMOUNT = ₹ {Number(data.total_payment).toFixed(2)}
//           </p> */}
//           {/* <p className="mt-2 text-[14px]">DUE AMOUNT = ₹ {Number(data.due_payment).toFixed(2)}</p> */}
//           <p className="mt-2 text-sm font-medium text-gray-700">Payment Mode</p>
//           <ul className="ml-4 list-disc text-sm text-gray-600">
//             {data.payments.map((payment, index) => (
//               <li key={index}>
//                 <span className="font-semibold capitalize">
//                   {payment.payment_method}
//                 </span>
//                 : ₹{payment.price}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="col-span-6 w-[50%] border-r border-gray-300 p-3">
//           <p className="font-bold text-[#333]">Terms and Conditions</p>
//           <ul className="mt-2 list-disc list-inside text-[13px]">
//             <li>The Price is inclusive of all other charges.</li>
//             <li>All jewellery items are breakable, please handle with care.</li>
//             <li>
//               No gold deduction is made in case of exchange of our 22/22 K or
//               18/18 K ornament with a new ornament.
//             </li>
//             <li>Weight checked & material received in good condition.</li>
//             <li>
//               Certified that the particulars given above are true and correct.
//             </li>
//           </ul>
//         </div>

//         <div className="col-span-2 relative w-[25%] p-3 text-center item-end">
//           <div className="absolute bottom-5">
//             <p className="font-bold text-[#333] text-[13px]">
//               Authorised Signature for
//             </p>
//             <p className="mt-2 font-bold text-[#333] text-[13px]">
//               {companyName?.roles?.[0].name}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceFooter;

import React from "react";
import { toWords } from "number-to-words";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const InvoiceFooter = ({ data, taxes, companyName }) => {
  const [content, setContent] = useState("");
  const [termId, setTermId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Ensure `data.total_price` is a valid number
  useEffect(() => {
    fetchTerms();
  }, []);
  console.log("footer table", data);
  const totalPrice = parseFloat(data.total_price) || 0;
  const totalTaxableValue = data.details.reduce(
    (sum, invoice) => sum + Number(invoice.pro_total),
    0
  );
  const totalCGST = data.details.reduce(
    (sum, invoice) => sum + (invoice.pro_total * (invoice.tax_rate / 2)) / 100,
    0
  );
  const totalSGST = data.details.reduce(
    (sum, invoice) => sum + (invoice.pro_total * (invoice.tax_rate / 2)) / 100,
    0
  );
  const totalTaxAmount = totalCGST + totalSGST;
  //   const totalPrice = parseFloat(data.total_price) || 0;
  // Ensure all tax amounts are parsed as numbers and handle invalid values
  const taxess = taxes?.map((tax) => parseFloat(tax.amount)) || [];
  console.log("Tax Rates: ", taxess);
  console.log("jhgf", companyName);

  // Calculate total tax
  const totalTax = taxess.reduce((sum, rate) => {
    const taxAmount = (totalPrice * rate) / 100 || 0;
    return sum + taxAmount;
  }, 0);

  // Calculate grand total
  const grandTotal = totalTaxAmount + totalPrice;
  const roundedGrandTotal = Math.round(grandTotal * 100) / 100;

  console.log("Total Price: ", totalPrice);
  console.log("Grand Total: ", grandTotal);
  console.log("Rounded Grand Total: ", roundedGrandTotal);
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

  const fetchTerms = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      const res = await axios.get(
        "https://api.equi.co.in/api/terms-condition-invoice",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.length > 0) {
        setContent(res.data[0].content);
        setTermId(res.data[0].id);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("❌ Failed to load terms.");
    }
  };

  // Convert the total to words only if it's a valid finite number
  const totalPriceInWords = Number.isFinite(roundedGrandTotal)
    ? toWords(roundedGrandTotal)
    : "Invalid amount";

  return (
    <div className=" w-full justify-between border text-xs border-gray-300">
      {/* Total Amount in Words */}
      {/* <div className="border-b border-gray-300 p-3 ">
        <span className="font-bold text-[14px]">Total Amount (in words)</span>:{" "}
        <span className="font-normal text-[13px]">
          {totalPriceInWords.charAt(0).toUpperCase() +
            totalPriceInWords.slice(1)}{" "}
          Only
        </span>
      </div> */}

      {/* Payment Details Section */}
      <div className="flex border-b border-gray-300">
        <div className="col-span-4  border-r border-gray-300 p-3">
          <p className="text-xs font-semibold text-[#333]">Payment Details:</p>
          {/* <p className="mt-2 text-[14px]">
            PAID AMOUNT = ₹ {Number(data.total_payment).toFixed(2)}
          </p> */}
          {/* <p className="mt-2 text-[14px]">DUE AMOUNT = ₹ {Number(data.due_payment).toFixed(2)}</p> */}
          <p className="mt-2 text-xs font-medium text-gray-700">Payment Mode</p>
          <ul className="ml-4 list-disc text-xs text-gray-600">
            {data.payments.map((payment, index) => (
              <li key={index}>
                <span className=" capitalize">{payment.payment_method}</span>: ₹
                {payment.price}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-6  border-r border-gray-300 p-3">
          <p className="text-sm text-[#333]">#Terms and Conditions</p>
          {/* <ul className="mt-2 list-disc list-inside text-xs">
            <li>The Price is inclusive of all other charges.</li>
            <li>All jewellery items are breakable, please handle with care.</li>
            <li>
              No gold deduction is made in case of exchange of our 22/22 K or
              18/18 K ornament with a new ornament.
            </li>
            <li>Weight checked & material received in good condition.</li>
            <li>
              Certified that the particulars given above are true and correct.
            </li>
            <li>
             <b>O</b>:Other Charge , <b>H</b>:Hallmark charge , <b>W</b>:Wastage charge
            </li>
          </ul> */}

          <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
            {content
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line, index) => (
                <li key={index}>{line.replace(/^•\s*/, "")}</li>
              ))}
          </ul>
        </div>

        <div className="col-span-2  flex mx-auto justify-center  p-3 text-center">
          <div className=" flex justify-center ">Authorised Signature</div>
          {/* <div className="absolute bottom-5 flex  mx-auto justify-center items-center">
            <p className=" text-[#333] text-xs">
            Authorised Signature
            </p> */}
          {/* <p className="mt-2  text-[#333] text-xs">
              {companyName?.roles?.[0].name}
            </p> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
