"use client";
import Link from "next/link";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { usePurchase } from "@/app/hooks/purchase";

function Page() {
  const { data, isLoading } = usePurchase();
  console.log(data);
  return (
    <div className="absolute left-0 top-0 w-full bg-white h-full">
      <div className="w-full flex p-3 px-6 bg-green-500 text-white">
        <p className="flex-1 text-center font-semibold">Purchase Report</p>
        <Link
          href="/admin/inventory/purchase"
          className="flex items-center text-sm gap-2"
        >
          <FaTimes />
        </Link>
      </div>
      <div className="flex flex-wrap px-6 py-1">
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Start Date</label>
          <input type="date" className="form-input text-sm rounded" />
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">End Date</label>
          <input type="date" className="form-input text-sm rounded" />
        </div>
        <div className="flex items-end p-2 w-1/5">
          <button className="text-sm bg-green-500 text-white py-2 px-6 rounded">
            Show
          </button>
        </div>
      </div>
      <div className="w-full p-3">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="font-medium bg-pink-300 px-3 py-3 rounded-l">
                Date
              </th>
              <th className="font-medium bg-pink-300 px-3 py-3">Voucher No.</th>
              <th className="font-medium bg-pink-300 px-3 py-3">Bill No.</th>
              <th className="font-medium bg-pink-300 px-3 py-3">Party Name</th>
              <th className="font-medium bg-pink-300 px-3 py-3">Bill Amount</th>
              <th className="font-medium bg-pink-300 px-3 py-3">
                Payment Mode
              </th>
              <th className="font-medium bg-pink-300 px-3 py-3">Days</th>
              <th className="font-medium bg-pink-300 px-3 py-3 rounded-r">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              data.purchase.map((pr, i) => (
                <tr key={i}>
                  <td className="px-3 py-3">
                    {new Date(pr.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">{pr.voucher_no}</td>
                  <td className="px-3 py-3">{pr.bill_no}</td>
                  <td className="px-3 py-3">{pr.user?.name || ""}</td>
                  <td className="px-3 py-3">
                    &#8377;{" "}
                    {pr.purchase_items
                      .reduce((sum, item) => sum + parseInt(item.net_amount), 0)
                      .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3">{pr.payment_mode}</td>
                  <td className="px-3 py-3">{pr.credit_days || 0}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500">
                        <FaEdit />
                      </button>
                      <button className="text-red-500">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-3 py-3 bg-green-500">Total</td>
              <td className="px-3 py-3 bg-green-500"></td>
              <td className="px-3 py-3 bg-green-500"></td>
              <td className="px-3 py-3 bg-green-500"></td>
              <td className="px-3 py-3 bg-green-500">0</td>
              <td className="px-3 py-3 bg-green-500"></td>
              <td className="px-3 py-3 bg-green-500"></td>
              <td className="px-3 py-3 bg-green-500"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Page;
