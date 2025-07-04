import React from 'react';
import { toWords } from 'number-to-words';

const InvoiceFooter = ({ data, taxes,companyName }) => {
    // Ensure `data.total_price` is a valid number
    const totalPrice = parseFloat(data.total_price) || 0;

    // Ensure all tax amounts are parsed as numbers and handle invalid values
    const taxess = taxes?.map((tax) => parseFloat(tax.amount)) || [];
    console.log("Tax Rates: ", taxess);
    console.log("jhgf",companyName)

    // Calculate total tax
    const totalTax = taxess.reduce((sum, rate) => {
        const taxAmount = (totalPrice * rate) / 100 || 0;
        return sum + taxAmount;
    }, 0);

    // Calculate grand total
    const grandTotal = totalPrice + totalTax;
    const roundedGrandTotal = Math.round(grandTotal * 100) / 100;

    console.log("Total Price: ", totalPrice);
    console.log("Grand Total: ", grandTotal);
    console.log("Rounded Grand Total: ", roundedGrandTotal);

    // Convert the total to words only if it's a valid finite number
    const totalPriceInWords = Number.isFinite(roundedGrandTotal)
        ? toWords(roundedGrandTotal)
        : "Invalid amount";

    return (
        <div className="border border-gray-300">
            {/* Total Amount in Words */}
            <div className="border-b border-gray-300 p-3 ">
                <span className="font-bold text-[14px]">Total Amount (in words)</span>:{" "}
                <span className="font-normal text-[13px]">
                    {totalPriceInWords.charAt(0).toUpperCase() + totalPriceInWords.slice(1)} Only
                </span>
            </div>

            {/* Payment Details Section */}
            <div className="flex border-b border-gray-300">
                <div className="col-span-4 w-[35%] border-r border-gray-300 p-3">
                    <p className="font-bold text-[#333]">Payment Details:</p>
                    <p className="mt-2 text-[14px]">PAID AMOUNT = ₹ {data.total_payment}</p>
                    <p className="mt-2 text-[14px]">DUE AMOUNT = ₹ {data.due_payment}</p>
                </div>

                <div className="col-span-6 w-[50%] border-r border-gray-300 p-3">
                    <p className="font-bold text-[#333]">Terms and Conditions</p>
                    <ul className="mt-2 list-disc list-inside text-[13px]">
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
                    </ul>
                </div>

                <div className="col-span-2 relative w-[25%] p-3 text-center item-end">
                    <div className="absolute bottom-5">
                        <p className="font-bold text-[#333] text-[13px]">
                            Authorised Signature for
                        </p>
                        {/* <p className="mt-2 font-bold text-[#333] text-[13px]">{companyName?.roles?.[0].name}</p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceFooter;
