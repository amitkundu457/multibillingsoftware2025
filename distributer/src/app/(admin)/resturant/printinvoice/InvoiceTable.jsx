const InvoiceTable = ({ data,logoUrl }) => {
  return (
    <div className="border-t border-l  relative  border-gray-800">
      {/* Table Header */}

      <div className="opacity-10 absolute bottom-4">
        <img
          src={logoUrl}
          className="w-[70rem]"
          alt=""
        />
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-red-100">
            <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
              SL No.
            </th>
            <th className="border-r text-[13px] text-[#333]  w-[9rem] font-medium border-gray-800 text-center p-2">
              Description
            </th>
            <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
              HSN
            </th>
            <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
              Net Wt. (Gm)
            </th>
            <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
              Gross Wt. (Gm)
            </th>
            <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
              Metal Value (₹)
            </th>
            <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
              Making Chg (₹)
            </th>
            <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
              Other Chg (₹)
            </th>
            <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
              Making Disc.
            </th>
            <th className="border-r text-[13px] text-[#333] font-medium border-gray-800 text-center p-2">
              Taxable Amount (₹)
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.details.map((invoice) => (
            <tr key={invoice.id}>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                {invoice.id}
              </td>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                {invoice.product_name}
              </td>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                {invoice.huid}
              </td>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                {invoice.net_weight}
              </td>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                {invoice.gross_weight}
              </td>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                {invoice.rate}
              </td>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                {invoice.making}
              </td>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                0
              </td>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
                {invoice.making_dsc}
              </td>
              <td className=" border-r font-medium text-[13px] border-gray-800 text-center p-2">
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
            <td className="border-r italic border-gray-800 text-right p-2">
              CGST @1.5%
            </td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className="border-r border-gray-800 text-center p-2">₹ 0.00</td>
          </tr>

          <tr>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className="border-r italic font-i border-gray-800 text-right p-2">
              SGST @1.5%
            </td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className=" border-r border-gray-800 text-center p-2"></td>
            <td className="border-r border-gray-800 text-center p-2">₹ 0.00</td>
          </tr>
          <tr>
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
            <td className="border-r border-gray-800 text-center p-2 font-bold">
              ₹ {data.total_price}
            </td>
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
