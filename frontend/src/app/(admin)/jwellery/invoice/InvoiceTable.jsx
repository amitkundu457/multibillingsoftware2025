const InvoiceTable = () => {
    return (
        <div className="border-t border-l  relative  border-gray-800">
            {/* Table Header */}

            <div className="opacity-10 absolute bottom-4">
                <img src="https://i.imgur.com/w8dR0Ys.png" className="w-[70rem]" alt=""/>
            </div>
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-red-100">
                    <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">SL No.</th>
                    <th className="border-r text-[13px] text-[#333]  w-[9rem] font-medium border-gray-800 text-center p-2">Description</th>
                    <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">HSN</th>
                    <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">Net Wt. (Gm)</th>
                    <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">Gross Wt. (Gm)</th>
                    <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">Metal Value (₹)</th>
                    <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">Making Chg (₹)</th>
                    <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">Other Chg (₹)</th>
                    <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">Making Disc.</th>
                    <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">Taxable Amount (₹)</th>
                </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                <tr>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">1</td>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">Baby Bracelet</td>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">7113194</td>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">8</td>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">8</td>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">64,000</td>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">500</td>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">0</td>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">0</td>
                    <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">64,500</td>
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
                </tr>


                <tr>

                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className="border-r italic border-gray-800 text-right p-2">CGST @1.5%</td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className="border-r border-gray-800 text-center p-2">₹ 1,612.5</td>
                </tr>

                <tr>

                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className="border-r italic font-i border-gray-800 text-right p-2">SGST @1.5%</td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className="border-r border-gray-800 text-center p-2">₹ 1,612.5</td>
                </tr>
                <tr>

                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className="border-r italic border-gray-800 text-right p-2">Round Off</td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className="border-r border-gray-800 text-center p-2">₹ 0.00</td>
                </tr>
                {/*<tr>*/}
                {/*    <td colSpan="9" className="border border-gray-800 text-right p-2">Round Off</td>*/}
                {/*    <td className="border border-gray-800 text-center p-2">₹ 0.00</td>*/}
                {/*</tr>*/}
                <tr className="bg-red-100 p-[3rem]">
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className="border-r border-gray-800 text-right p-2 font-bold">
                        Total
                    </td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className=" border-r border-gray-800 text-center p-2"></td>
                    <td className="border-r border-gray-800 text-center p-2 font-bold">₹ 67,725</td>
                </tr>
                </tbody>

                {/*/!* Table Footer *!/*/}
                {/*<tfoot>*/}


                {/*</tfoot>*/}
            </table>
        </div>
    );
};

export default InvoiceTable;
