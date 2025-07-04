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

const Menu = () => {
  const router = useRouter();
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false); // State for submenu sale report
  const [isPurchaseReportOpen, setIsPurchaseReportOpen] = useState(false); // state for submenu purchase report
  const [isStockReportOpen, setIsStockReportOpen] = useState(false); // state for sub menu stock report
  const [isGSTReportOpen, setIsGSTReportOpen] = useState(false); // state for sub menu gst report
  const [isBarcodeReportOpen, setIsBarcodeReportOpen] = useState(false); // state for sub menu barcode

  return (
    <div className="fixed top-0 left-0 h-full w-28  bg-green-600 flex flex-col items-center py-6 space-y-6 shadow-lg overflow-y-auto">
      <ul className="flex flex-col items-center space-y-6">
        {/* Dashboard */}
        <li
          onClick={() => router.push("/page")}
          className="group flex flex-col items-center cursor-pointer"
          role="button"
        >
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <AiTwotoneDashboard />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            Dashboard
          </p>
        </li>

        {/* Daily Cash Summary */}
        <li
          onClick={() => router.push("../report/dailycashsummary/")}
          className="group flex flex-col items-center cursor-pointer"
          role="button"
        >
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <FaRupeeSign />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            Daily Cash
          </p>
        </li>

        {/* Sales Register */}
        <li
          onClick={() => router.push("../report/saleregister/")}
          className="group flex flex-col items-center cursor-pointer"
          role="button"
        >
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <FaCashRegister />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            Sales Register
          </p>
        </li>

        {/* Sales Report with Submenu */}
        <li className="w-full">
          <div
            onClick={() => setIsSalesReportOpen(!isSalesReportOpen)}
            className="group flex flex-col items-center cursor-pointer"
            role="button"
          >
            <button className="text-4xl text-black group-hover:text-yellow-300 transition">
              <AiOutlineBars />
            </button>
            <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
              Sales Report
            </p>
          </div>
          {isSalesReportOpen && (
            <ul className="mt-2 space-y-2">
              <li
                onClick={() => router.push("../report/salereport/productwise/")}
                className="group flex items-center cursor-pointer ml-8"
                role="button"
              >
                <p className="text-xs text-white group-hover:text-yellow-300 text-center">
                  Product Wise
                </p>
              </li>
              <li
                onClick={() =>
                  router.push("../report/salereport/categorywise/")
                }
                className="group flex items-center cursor-pointer ml-8"
                role="button"
              >
                <p className="text-xs text-white group-hover:text-yellow-300 text-center">
                  Category Wise
                </p>
              </li>
            </ul>
          )}
        </li>

        {/* Other Menu Item */}
        <li
          onClick={() => router.push("../report/agentsale/")}
          className="group flex flex-col items-center cursor-pointer"
          role="button"
        >
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <FaUserTie />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            Agent Sale
          </p>
        </li>

        {/* Purchase Report */}
        <li
          onClick={() => setIsPurchaseReportOpen(!isPurchaseReportOpen)}
          className="group flex flex-col items-center cursor-pointer"
          role="button"
        >
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <TiShoppingCart />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            Purchase Report
          </p>
        </li>
        {isPurchaseReportOpen && (
          <ul className="ml-8 mt-2 space-y-2">
            {/* Bill Wise */}
            <li
              onClick={() => router.push("../report/purchasereport/billwise")}
              className="group flex flex-row items-center cursor-pointer text-white text-sm hover:text-yellow-300 transition"
            >
              <span className="ml-2">• Bill Wise</span>
            </li>

            {/* Category Wise */}
            <li
              onClick={() =>
                router.push("../report/purchasereport/productwise")
              }
              className="group flex flex-row items-center cursor-pointer text-white text-sm hover:text-yellow-300 transition"
            >
              <span className="ml-2">• Product wise</span>
            </li>

            {/* Party Wise */}
            <li
              onClick={() => router.push("../report/purchasereport/partywise")}
              className="group flex flex-row items-center cursor-pointer text-white text-sm hover:text-yellow-300 transition"
            >
              <span className="ml-2">• Party Wise</span>
            </li>
          </ul>
        )}

        <li
          className="group flex flex-col items-center cursor-pointer"
          role="button"
        >
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <HiClipboardList />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            Item List
          </p>
        </li>

        {/* Stock Report */}
        <li
          onClick={() => setIsStockReportOpen(!isStockReportOpen)}
          className="group flex flex-col items-center cursor-pointer"
          role="button"
        >
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <BsBuildingFillLock />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            Stock Report
          </p>

          {/* Submenu */}
          {isStockReportOpen && (
            <ul className="mt-2 space-y-2 text-white">
              <li
                onClick={() =>
                  router.push("../report/stockreport/closingstock")
                }
                className="cursor-pointer text-sm hover:text-yellow-300 transition"
              >
                Closing Stock
              </li>
              <li
                onClick={() => {
                  router.push("../report/stockreport/stockregister");
                }}
                className="cursor-pointer text-sm hover:text-yellow-300 transition"
              >
                Stock Register
              </li>
            </ul>
          )}
        </li>

        {/* <li onClick={() => router.push("../report/ledger")} className="group flex flex-col items-center cursor-pointer" role="button">
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <CgCalculator />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            Ledger
          </p>
        </li> */}

        {/* GST Report */}
        <li
          onClick={() => setIsGSTReportOpen(!isGSTReportOpen)}
          className="group flex flex-col items-center cursor-pointer"
          role="button"
        >
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <LiaFileInvoiceDollarSolid />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            GST Report
          </p>
        </li>

        {/* Submenu for GST Report */}
        {isGSTReportOpen && (
          <ul className="ml-6 space-y-2">
            <li>
              <button
                onClick={() => router.push("../report/gstreports/gstreport")}
                className="text-sm text-white hover:text-yellow-300 transition"
              >
                GST Report
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("../report/gstreports/hsnreport")}
                className="text-sm text-white hover:text-yellow-300 transition"
              >
                HSN Report
              </button>
            </li>
          </ul>
        )}

        <li
          onClick={() => setIsBarcodeReportOpen(!isBarcodeReportOpen)}
          className="group flex flex-col items-center cursor-pointer"
          role="button"
        >
          <button className="text-4xl text-black group-hover:text-yellow-300 transition">
            <IoMdBarcode />
          </button>
          <p className="text-xs text-white mt-2 group-hover:text-yellow-300 text-center">
            Barcode
          </p>

          {/* Submenu */}
          {isBarcodeReportOpen && (
            <ul className="ml-6 space-y-2">
              <li
                onClick={() =>
                  router.push("../report/barcodereport/availabelist")
                }
                className="cursor-pointer text-sm text-white hover:text-yellow-300 transition"
              >
                Available Barcode List
              </li>
              <li
                onClick={() =>
                  router.push("../report/barcodereport/allbarcodelist")
                }
                className="cursor-pointer text-sm text-white hover:text-yellow-300 transition"
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
