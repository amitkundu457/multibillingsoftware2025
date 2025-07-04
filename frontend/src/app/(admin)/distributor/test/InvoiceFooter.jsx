const InvoiceFooter = () => {
    return (
        <div className="border border-gray-300">
            {/* Total Amount in Words */}
            <div className="border-b border-gray-300 p-3 ">
                <span className="font-bold text-[14px]">Total Amount (in words)</span>: <span className="font-normal text-[13px]">Sixty-Seven Thousand Seven Hundred Twenty-Five Only</span>
            </div>

            {/* Payment Details Section */}
            <div className="flex  border-b border-gray-300">
                {/* Payment Details */}
                <div className="col-span-4 w-[35%] border-r border-gray-300 p-3">
                    <p className="font-bold text-[#333]">Payment Details:</p>
                    <p className="mt-2 text-[14px]">PAID BY CASH = ₹ 67,725</p>
                </div>

                {/* Terms and Conditions */}
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

                {/* Authorized Signature */}
                <div className="col-span-2 relative   w-[25%] p-3 text-center item-end">
                    <div className="absolute bottom-5">
                        <p className="font-bold text-[#333] text-[13px]">Authorised Signature for</p>
                        <p className="mt-2 font-bold text-[#333] text-[13px]">RETAILJI JEWELLERY</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceFooter