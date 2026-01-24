"use client";
import React, { useState } from "react";
import { AiTwotoneDashboard, AiOutlineBars } from "react-icons/ai";
import { FaRupeeSign, FaCashRegister, FaUserTie } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { HiClipboardList } from "react-icons/hi";
import { BsBuildingFillLock } from "react-icons/bs";
import { CgCalculator } from "react-icons/cg";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { IoMdBarcode } from "react-icons/io";
import { useRouter } from "next/navigation";
// import { FaCashRegister } from "react-icons/fa";
const Menu = () => {
  const router = useRouter();
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false); // State for submenu sale report
  const [isPurchaseReportOpen, setIsPurchaseReportOpen] = useState(false); // state for submenu purchase report
  const [isStockReportOpen, setIsStockReportOpen] = useState(false); // state for sub menu stock report
  const [isGSTReportOpen, setIsGSTReportOpen] = useState(false); // state for sub menu gst report
  const [isBarcodeReportOpen, setIsBarcodeReportOpen] = useState(false); // state for sub menu barcode

  return (
    <div className="fixed top-0 left-0 flex flex-col items-center h-full py-6 space-y-6 overflow-y-auto bg-green-600 shadow-lg w-28">
      <ul className="flex flex-col items-center space-y-6">
        {/* Dashboard */}
        <li
          onClick={() => router.push("/page")}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
        >
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <AiTwotoneDashboard />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            Dashboard
          </p>
        </li>

        {/* Daily Cash Summary */}
        <li
          onClick={() => router.push("../report/dailycashsummary/")}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
        >
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <FaRupeeSign />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            Daily Cash
          </p>
        </li>

        {/* Sales Register */}
        <li
          onClick={() => router.push("../report/saleregister/")}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
        >
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <FaCashRegister />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            Sales Register
          </p>
        </li>

        {/* Sales Report with Submenu */}
        <li className="w-full">
          <div
            onClick={() => setIsSalesReportOpen(!isSalesReportOpen)}
            className="flex flex-col items-center cursor-pointer group"
            role="button"
          >
            <button className="text-4xl text-black transition group-hover:text-yellow-300">
              <AiOutlineBars />
            </button>
            <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
              Sales Report
            </p>
          </div>
          {isSalesReportOpen && (
            <ul className="mt-2 space-y-2">
              <li
                onClick={() => router.push("../report/salereport/productwise/")}
                className="flex items-center ml-8 cursor-pointer group"
                role="button"
              >
                <p className="text-xs text-center text-white group-hover:text-yellow-300">
                  Product Wise
                </p>
              </li>
              <li
                onClick={() =>
                  router.push("../report/salereport/categorywise/")
                }
                className="flex items-center ml-8 cursor-pointer group"
                role="button"
              >
                <p className="text-xs text-center text-white group-hover:text-yellow-300">
                  Category Wise
                </p>
              </li>
            </ul>
          )}
        </li>

        {/* Other Menu Item */}
        <li
          onClick={() => router.push("../report/agentsale/")}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
        >
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <FaUserTie />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            Agent Sale
          </p>
        </li>

        {/* Purchase Report */}
        <li
          onClick={() => setIsPurchaseReportOpen(!isPurchaseReportOpen)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
        >
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <TiShoppingCart />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            Purchase Report
          </p>
        </li>
        {isPurchaseReportOpen && (
          <ul className="mt-2 ml-8 space-y-2">
            {/* Bill Wise */}
            <li
              onClick={() => router.push("../report/purchasereport/billwise")}
              className="flex flex-row items-center text-sm text-white transition cursor-pointer group hover:text-yellow-300"
            >
              <span className="ml-2">• Bill Wise</span>
            </li>

            {/* Category Wise */}
            <li
              onClick={() =>
                router.push("../report/purchasereport/productwise")
              }
              className="flex flex-row items-center text-sm text-white transition cursor-pointer group hover:text-yellow-300"
            >
              <span className="ml-2">• Product wise</span>
            </li>

            {/* Party Wise */}
            <li
              onClick={() => router.push("../report/purchasereport/partywise")}
              className="flex flex-row items-center text-sm text-white transition cursor-pointer group hover:text-yellow-300"
            >
              <span className="ml-2">• Party Wise</span>
            </li>
          </ul>
        )}

        <li
          className="flex flex-col items-center cursor-pointer group"
          role="button"
        >
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <HiClipboardList />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            Item List
          </p>
        </li>

        {/* Stock Report */}
        <li
          onClick={() => setIsStockReportOpen(!isStockReportOpen)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
        >
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <BsBuildingFillLock />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            Stock Report
          </p>

          {/* Submenu */}
          {isStockReportOpen && (
            <ul className="mt-2 space-y-2 text-white">
              <li
                onClick={() =>
                  router.push("../report/stockreport/closingstock")
                }
                className="text-sm transition cursor-pointer hover:text-yellow-300"
              >
                Closing Stock
              </li>
              <li
                onClick={() => {
                  router.push("../report/stockreport/stockregister");
                }}
                className="text-sm transition cursor-pointer hover:text-yellow-300"
              >
                Stock Register
              </li>
            </ul>
          )}
        </li>

        {/* <li onClick={() => router.push("../report/ledger")} className="flex flex-col items-center cursor-pointer group" role="button">
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <CgCalculator />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            Ledger
          </p>
        </li> */}

        {/* GST Report */}
        <li
          onClick={() => setIsGSTReportOpen(!isGSTReportOpen)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
        >
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <LiaFileInvoiceDollarSolid />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            GST Report
          </p>
        </li>

        {/* Submenu for GST Report */}
        {isGSTReportOpen && (
          <ul className="ml-6 space-y-2">
            <li>
              <button
                onClick={() => router.push("../report/gstreports/gstreport")}
                className="text-sm text-white transition hover:text-yellow-300"
              >
                GST Report
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("../report/gstreports/hsnreport")}
                className="text-sm text-white transition hover:text-yellow-300"
              >
                HSN Report
              </button>
            </li>
          </ul>
        )}

        <li
          onClick={() => setIsBarcodeReportOpen(!isBarcodeReportOpen)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
        >
          <button className="text-4xl text-black transition group-hover:text-yellow-300">
            <IoMdBarcode />
          </button>
          <p className="mt-2 text-xs text-center text-white group-hover:text-yellow-300">
            Barcode
          </p>

          {/* Submenu */}
          {isBarcodeReportOpen && (
            <ul className="ml-6 space-y-2">
              <li
                onClick={() =>
                  router.push("../report/barcodereport/availabelist")
                }
                className="text-sm text-white transition cursor-pointer hover:text-yellow-300"
              >
                Available Barcode List
              </li>
              <li
                onClick={() =>
                  router.push("../report/barcodereport/allbarcodelist")
                }
                className="text-sm text-white transition cursor-pointer hover:text-yellow-300"
              >
                All Barcode List
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Menu;
