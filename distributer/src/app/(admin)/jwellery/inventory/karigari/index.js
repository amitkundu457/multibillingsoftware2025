"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaChevronRight,
  FaEdit,
  FaPlus,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useKarigari } from "@/app/hooks/karigari";

function Page() {
  const [dropdown, setDropdown] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Call the useKarigari hook directly here to fetch data
  const { data: karigariData, isLoading: loading, deleteOldKarigari } = useKarigari();

  // Update state when the data is available
  useEffect(() => {
    if (karigariData) {
      setData(karigariData);
      setIsLoading(loading);
    }
  }, [karigariData, loading]);
  if (typeof window === "undefined") {
    return null; // Skip rendering on the server
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure want to delete?')) {
      await deleteOldKarigari(id);
    }
  }
  return (
    <div className="absolute left-0 top-0 w-full bg-white h-full">
      <div className="w-full flex p-3 px-6 bg-green-500 text-white">
        <p className="flex-1 text-center font-semibold">Karigari Entry</p>
        <Link href="/admin" className="flex items-center text-sm gap-2">
          <FaTimes />
        </Link>
      </div>
      <div className="flex px-6 py-1">
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Start Date</label>
          <input type="date" className="form-input text-sm rounded" />
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">End Date</label>
          <input type="date" className="form-input text-sm rounded" />
        </div>
        <div className="flex flex-col w-1/5 gap-2 p-2 text-sm">
          <label htmlFor="">Type</label>
          <select name="" id="" className="form-select text-sm rounded">
            <option value="">All</option>
            <option value="issue">Issue</option>
            <option value="receive">Receive</option>
          </select>
        </div>
        <div className="flex items-end p-2 w-1/5">
          <button className="text-sm bg-green-500 text-white py-2 px-6 rounded">
            Show
          </button>
        </div>
        <div className="flex items-end p-2 flex-1 justify-end relative">
          <button
            onClick={() => setDropdown(!dropdown)}
            className="text-sm bg-green-500 text-white py-4 px-4 rounded-full"
          >
            <FaPlus size={18} />
          </button>
          <ul
            className={`p-2 rounded absolute top-full bg-white shadow-lg shadow-black/20 w-44 right-0 ${dropdown ? "block" : "hidden"
              }`}
          >
            <li>
              <Link
                href="/jwellery/inventory/karigari/issue"
                className="text-sm text-zinc-700 flex justify-between items-center p-2"
              >
                <span>Issue</span>
                <FaChevronRight />
              </Link>
            </li>
            <li>
              <Link
                href="/jwellery/inventory/karigari/receive"
                className="text-sm text-zinc-700 flex justify-between items-center p-2"
              >
                <span>Received</span>
                <FaChevronRight />
              </Link>
            </li>
          </ul>
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
              <th className="font-medium bg-pink-300 px-3 py-3">Type</th>
              <th className="font-medium bg-pink-300 px-3 py-3">Party Name</th>
              <th className="font-medium bg-pink-300 px-3 py-3">
                Total Weight
              </th>
              <th className="font-medium bg-pink-300 px-3 py-3">Days</th>
              <th className="font-medium bg-pink-300 px-3 py-3 rounded-r">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              data?.karigaries?.map((kgi) => (
                <tr key={kgi.id}>
                  <td className="px-3 py-3">
                    {new Date(kgi.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-3 py-3">{kgi.voucher_no}</td>
                  <td className="px-3 py-3 uppercase">{kgi.type}</td>
                  <td className="px-3 py-3"></td>
                  <td className="px-3 py-3">00</td>
                  <td className="px-3 py-3">00</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-4 items-center">
                      <Link
                        href={kgi.type === 'issue' ? `/jwellery/inventory/karigari/issue/?id=${kgi.id}` : `/jwellery/inventory/karigari/receive/?id=${kgi.id}`}
                        className="text-blue-500"
                      >
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(kgi.id)} className="text-red-500">
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
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Page;
