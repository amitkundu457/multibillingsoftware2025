"use client";
import { usePathname } from "next/navigation";
import { MdCategory, MdEco, MdHome, MdPieChart } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import LogoutModel from "../components/logout/page";
import { AiTwotoneDashboard, AiOutlineBars } from "react-icons/ai";
import { RiDeviceRecoverFill } from "react-icons/ri";
import { CgQr } from "react-icons/cg";
import {
  FaRupeeSign,
  FaCashRegister,
  FaUserTie,
  FaClipboardList,
  FaQuestionCircle,
} from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { HiClipboardList } from "react-icons/hi";
import { BsBuildingFillLock } from "react-icons/bs";
import { CgCalculator } from "react-icons/cg";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { IoMdBarcode } from "react-icons/io";
import { FaBirthdayCake } from "react-icons/fa";
import { RiChatFollowUpFill } from "react-icons/ri";
import { IoRestaurant } from "react-icons/io5";

import {
  FaBell,
  FaTimes,
  FaStore,
  FaCube,
  FaList,
  FaTachometerAlt,
  FaCalculator,
  FaCubes,
  FaReact,
  FaSlidersH,
  FaUserShield,
  FaUsers,
  FaCogs,
  FaBuilding,
} from "react-icons/fa";
import { TbBrand4Chan } from "react-icons/tb";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import {
  FaChartSimple,
  FaPerson,
  FaPersonCircleCheck,
  FaScaleUnbalancedFlip,
  FaUsersGear,
} from "react-icons/fa6";
import { RiFileList3Fill } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import Head from "next/head";
import { Fragment, useState, useEffect, useRef } from "react";
import Link from "next/link";
import AuthJs from "../components/withAuth";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import Menu from "../components/menu";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCrossCircled } from "react-icons/rx";
import useSWR from "swr";
// import axios from "@/app/lib/axios";
import axios from "../lib/axios";
import { getLogo } from "../components/config";
import { useCookies } from "react-cookie";
// import useSWR from 'swr';
const fetcher = async () => {
  const response = await getLogo();
  return response.data.logo_url; // Return the relevant data
};

function AdminLayout({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [isLogoutModel, setIsLogoutModel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [logoUrl, setLogoUrl] = useState("");
  const { data: logoUrl, error } = useSWR("logo", fetcher);
  const {
    data: user,
    isLoading,
    mutate,
  } = useSWR(`/auth/agme`, async () => {
    let res = await axios.get("/auth/agme", {
      headers: { Authorization: `Bearer ${cookies.access_token}` },
    });
    return res.data;
  });

  const roleToUrlMap = {
    admin: "admin",
    jwellery: "jwellery",
    distributor: "distributor",
    resturant: "resturant",
    saloon: "saloon",
  };

  const productUrl = roleToUrlMap[!isLoading && user?.roles?.[0]?.name] || "";
  console.log("pruddcturl", productUrl);
  function showMenuIn(roles) {
    const validRoleExists = roles.some(
      (role) => user?.roles?.[0]?.name === role
    );

    if (!isLoading && validRoleExists) {
      return true;
    }

    return false;
  }

  const pathname = usePathname();
  const [notif, setNotif] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const submenuRef = useRef(null); // Added useRef for the submenu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setShowSubmenu(false); // Close the submenu if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menus = [
    {
      show: showMenuIn(["admin"]),
      title: "CMS",
      icon: FaUsers,
      submenuItems: [
        { label: "Solution", href: `/${productUrl}/solution`, icon: FaReact },
        {
          label: "EcoSystems",
          href: `/${productUrl}/ecosystems`,
          icon: MdEco,
        },
        { label: "Brands", href: `/${productUrl}/brands`, icon: TbBrand4Chan },
        {
          label: "Features",
          href: `/${productUrl}/features`,
          icon: FaSlidersH,
        },
        {
          label: "Sliders",
          href: `/${productUrl}/sliders`,
          icon: TfiLayoutSliderAlt,
        },
        {
          label: "crm",
          href: `/${productUrl}/crm-page`,
          icon: TfiLayoutSliderAlt,
        },
         {
          label: "Sales",
          href: `/${productUrl}/sales`,
          icon: TfiLayoutSliderAlt,
        },
          {
          label: "Marketing Automation",
          href: `/${productUrl}/marketing`,
          icon: TfiLayoutSliderAlt,
        },
        {
          label: "Generate Leads",
          href: `/${productUrl}/generate-leads`,
          icon: TfiLayoutSliderAlt,
        },
        {
          label: "Generate Sales",
          href: `/${productUrl}/generate-sales`,
          icon: TfiLayoutSliderAlt,
        },
        {
          label: "Control Costs",
          href: `/${productUrl}/control-costs`,
          icon: TfiLayoutSliderAlt,
        },
        {
          label: "Ring-Fencing",
          href: `/${productUrl}/ring-fencing`,
          icon: TfiLayoutSliderAlt,
        }, 
        {
          label: "Help Centre",
          href: `/${productUrl}/help-center`,
          icon: TfiLayoutSliderAlt,
        },
        {
          label: "Contact Support",
          href: `/${productUrl}/contact-support`,
          icon: TfiLayoutSliderAlt,
        },
        {
          label: "About BrizIndia",
          href: `/${productUrl}/about-brizIndia`,
          icon: TfiLayoutSliderAlt,
        },
         {
          label: "Privacy Policy",
          href: `/${productUrl}/privacy-policy`,
          icon: TfiLayoutSliderAlt,
        },
          {
          label: "Cancellation and Refund Policy",
          href: `/${productUrl}/cancelation-policy`,
          icon: TfiLayoutSliderAlt,
        }, 
        {
          label: "Shipping and Delivery Policy ",
          href: `/${productUrl}/shipping-policy`,
          icon: TfiLayoutSliderAlt,
        },
        {
          label: "Careers",
          href: `/${productUrl}/careers`,
          icon: TfiLayoutSliderAlt,
        },
      ],
    },
    {
      show: showMenuIn(["jwellery", "resturant", "distributor"]),
      title: "Sales",
      icon: FaRupeeSign,
      submenuItems: [
        {
          label: "Sales Person",
          href: `/${productUrl}/employees`,
          icon: FaPerson,
        },
        // {
        //   label: "Sales Assign",
        //   href: `/${productUrl}/salesassign`,
        //   icon: FaPersonCircleCheck,
        // },
        // {
        //   label: "Report",
        //   href: `/${productUrl}/employeereport`,
        //   icon: TbReportSearch,
        // },
      ],
    },

    {
      show: showMenuIn(["jwellery"]),
      title: "Reports",
      icon: FaRupeeSign,
      submenuItems: [
        // {
        //   label: "Dashboard",
        //   href: `/${productUrl}/reports/dashboard`,
        //   icon: AiTwotoneDashboard,
        // },
        {
          subItemLabel: "Sale Report",
          icon: "FaCashRegister",
          href: "", // Provide a valid href or leave it empty if it's not meant to navigate
          subItem: [
            {
              label: "Category Report",
              href: `/${productUrl}/reports/salereport/categorywise`,
              icon: AiTwotoneDashboard,
            },
            {
              label: "Product Report",
              href: `/${productUrl}/reports/salereport/productwise`,
              icon: AiTwotoneDashboard,
            },
          ],
        },

        // {
        //   label: "Purchase report",
        //   href: `/${productUrl}/reports/purchasereport`,
        //   icon: FaRupeeSign,

        // },
        {
          label: "Partial Reports",
          href: `/${productUrl}/partialreports`,
          icon: FaRupeeSign,
        },
        {
          label: "Daily Cash",
          href: `/${productUrl}/reports/dailycash`,
          icon: FaRupeeSign,
        },

        //remove change from report cards
        {
          label: "Product Report",
          href: `/${productUrl}/reports/productwise`,
          icon: AiTwotoneDashboard,
        },

        {
          label: "Party Report",
          href: `/${productUrl}/reports/partywise`,
          icon: AiTwotoneDashboard,
        },

        {
          label: "Bill Report",
          href: `/${productUrl}/reports/billwise`,
          icon: AiTwotoneDashboard,
        },
        {
          label: "Order Report",
          href: `/${productUrl}/partialorder`,
          icon: AiTwotoneDashboard,
        },

        // { label: "Daily Cash", href: `/${productUrl}/reports/dailycashsummary`, icon:  FaRupeeSign  },
        {
          label: "Sales Register",
          href: `/${productUrl}/reports/saleregister`,
          icon: FaCashRegister,
        },
        // { label: "Sales Report", href: `/${productUrl}/reports/salereport`, icon: AiOutlineBars  },
        {
          label: "Agent Sale",
          href: `/${productUrl}/reports/agentsale`,
          icon: FaUserTie,
        },
        // {
        //   label: "Purchase Report",
        //   href: `/${productUrl}/reports/purchasereport`,
        //   icon: TiShoppingCart,
        // },
        // {
        //   label: "Item List",
        //   href: `/${productUrl}/reports/itemlist`,
        //   icon: HiClipboardList,
        // },
        {
          label: "Stock Report",
          href: `/${productUrl}/reports/stockreport`,
          icon: BsBuildingFillLock,
        },
        // {
        //   label: "Ledger",
        //   href: `/${productUrl}/reports/ledger`,
        //   icon: CgCalculator,
        // },
        {
          label: "GST Report",
          href: `/${productUrl}/reports/gstreports`,
          icon: LiaFileInvoiceDollarSolid,
        },
        {
          label: "Customer Report",
          href: `/${productUrl}/reports/customerreport`,
          icon: LiaFileInvoiceDollarSolid,
        },
        // {
        //   label: "Barcode Report",
        //   href: `/${productUrl}/reports/barcodereport`,
        //   icon: IoMdBarcode,
        //   subItemLabel: "Barcode report", // Custom name for the button
        // subItem: [
        //   {
        //     label: "Barcode Report",
        //     href: `/${productUrl}/reports/barcodereport/allbarcodelist`,
        //     icon: AiTwotoneDashboard,
        //   },
        //   {
        //     label: "Available Report",
        //     href: `/${productUrl}/reports/barcodereport/availablelist`,
        //     icon: AiTwotoneDashboard,
        //   },
        // ],
        // },
      ],
    },

    // saloon reports
    {
      show: showMenuIn(["saloon"]),
      title: "Reports",
      icon: FaRupeeSign,
      submenuItems: [
        // {
        //   label: "Dashboard",
        //   href: `/${productUrl}/reports/dashboard`,
        //   icon: AiTwotoneDashboard,
        // },
        // {
        //   subItemLabel: "Sale Report",
        //   icon: "FaCashRegister",
        //   href: "", // Provide a valid href or leave it empty if it's not meant to navigate
        //   subItem: [
        //     {
        //       label: "Category Report",
        //       href: `/${productUrl}/reports/salereport/categorywise`,
        //       icon: AiTwotoneDashboard,
        //     },
        //   ],
        // },

        // {
        //   label: "Partial Reports",
        //   href: `/${productUrl}/partialreports`,
        //   icon: FaRupeeSign,

        // },

        {
          label: "Product Report",
          href: `/${productUrl}/reports/productwise`,
          icon: AiTwotoneDashboard,
        },
        {
          label: "Services report",
          href: `/${productUrl}/reports/servicewise`,
          icon: AiTwotoneDashboard,
        },
        {
          label: "Bill report",
          href: `/${productUrl}/reports/billreport`,
          icon: AiTwotoneDashboard,
        },

        {
          label: "Daily Cash",
          href: `/${productUrl}/reports/dailycash`,
          icon: FaRupeeSign,
        },

        //remove change from report cards
        // {
        //   label: "Service Report",
        //   href: `/${productUrl}/reports/productwise`,
        //   icon: AiTwotoneDashboard,
        // },

        // {
        //   label: "Party Report",
        //   href: `/${productUrl}/reports/partywise`,
        //   icon: AiTwotoneDashboard,
        // },

        {
          label: "Assign Package Reports",
          href: `/${productUrl}/reports/billwise`,
          icon: AiTwotoneDashboard,
        },

        {
          label: "Stock Report",
          href: `/${productUrl}/reports/stockreport`,
          icon: BsBuildingFillLock,
        },
        // {
        //   label: "Ledger",
        //   href: `/${productUrl}/reports/ledger`,
        //   icon: CgCalculator,
        // },
        {
          label: "GST Report",
          href: `/${productUrl}/reports/gstreports`,
          icon: LiaFileInvoiceDollarSolid,
        },
        {
          label: "Barcode Report",
          href: `/${productUrl}/reports/barcodereport`,
          icon: IoMdBarcode,
          subItemLabel: "Barcode report", // Custom name for the button
          // subItem: [
          //   {
          //     label: "Barcode Report",
          //     href: `/${productUrl}/reports/barcodereport/allbarcodelist`,
          //     icon: AiTwotoneDashboard,
          //   },
          //   {
          //     label: "Available Report",
          //     href: `/${productUrl}/reports/barcodereport/availablelist`,
          //     icon: AiTwotoneDashboard,
          //   },
          // ],
        },
        {
          label: "Product Expiry",
          href: `/${productUrl}/productExpiryReport`,
          icon: FaScaleUnbalancedFlip,
        },
        {
          label: "Membership Reports",
          href: `/${productUrl}/member-bill/report/`,
          icon: FaScaleUnbalancedFlip,
        },
      ],
    },

    //reports of resturant
    {
      show: showMenuIn(["resturant"]),
      title: "Reports",
      icon: FaRupeeSign,
      submenuItems: [
        // {
        //   // label: "GST Report",
        //   // href: `/${productUrl}/reports/barcodereport`,
        //   // icon: IoMdBarcode,
        //   subItemLabel: "GST Report", // Custom name for the button
        //   subItem: [
        //     {
        //       label: "GST On Parcel",
        //       href: `/${productUrl}/reports/gstreports`,
        //       icon: LiaFileInvoiceDollarSolid,
        //     },
        //     {
        //       label: "GST On Dine-In",
        //       href: `/${productUrl}/reports/gstOnDineIn`,
        //       icon: LiaFileInvoiceDollarSolid,
        //     },
        //   ],
        // },

        {
          label: "Product Report",
          href: `/${productUrl}/reports/productwise`,
          icon: AiTwotoneDashboard,
        },
        {
          label: "Services report",
          href: `/${productUrl}/reports/servicewise`,
          icon: AiTwotoneDashboard,
        },
        {
          label: "Dine-In Billing",
          href: `/${productUrl}/reports/kotbilling/billing`,
          icon: AiTwotoneDashboard,
        },
        {
          label: "Dine-In KOT",
          href: `/${productUrl}/reports/kotbilling/kot`,
          icon: AiTwotoneDashboard,
        },

        {
          label: "Parcel Billing",
          href: `/${productUrl}/reports/parcelbilling`,
          icon: AiTwotoneDashboard,
        },
        {
          label: "Parcel KOT",
          href: `/${productUrl}/reports/parcelbilling/kot`,
          icon: AiTwotoneDashboard,
        },

        // {
        //   label: "Daily Cash",
        //   href: `/${productUrl}/reports/dailycash`,
        //   icon: FaRupeeSign,
        // },

        {
          label: "Stock Report",
          href: `/${productUrl}/reports/stockreport`,
          icon: BsBuildingFillLock,
        },
        // {
        //   label: "Ledger",
        //   href: `/${productUrl}/reports/ledger`,
        //   icon: CgCalculator,
        // },

        {
          label: "GST On Parcel",
          href: `/${productUrl}/reports/gstreports`,
          icon: LiaFileInvoiceDollarSolid,
        },
        {
          label: "GST On Dine-In",
          href: `/${productUrl}/reports/gstOnDineIn`,
          icon: LiaFileInvoiceDollarSolid,
        },
        {
          label: "Barcode Report",
          href: `/${productUrl}/reports/barcodereport`,
          icon: IoMdBarcode,
          subItemLabel: "Barcode report", // Custom name for the button
        },
        {
          label: "Product Expiry",
          href: `/${productUrl}/productExpiryReport`,
          icon: FaScaleUnbalancedFlip,
        },
      ],
    },

    {
      show: showMenuIn(["saloon"]),
      title: "Membership",
      icon: FaCogs,
      submenuItems: [
        {
          label: " Assign Membership & Lists",
          href: `/${productUrl}/member-bill/`,
          icon: FaScaleUnbalancedFlip,
        },
        {
          label: "Create Membership",
          href: `/${productUrl}/membership`,
          icon: FaChartSimple,
        },
        // {
        //   label: " Membership ",
        //   href: `/${productUrl}/memberservice-rate/`,
        //   icon: FaChartSimple,
        // },
        {
          label: "Membership Group",
          href: `/${productUrl}/membership-group/`,
          icon: FaScaleUnbalancedFlip,
        },
      ],
    },
    {
      show: showMenuIn(["saloon"]),
      title: "Package",
      icon: FaCogs,
      submenuItems: [
        // {
        //   label: "Package",
        //   href: `/${productUrl}/package`,
        //   icon: FaScaleUnbalancedFlip,
        // },
        {
          label: "Check Package",
          href: `/${productUrl}/package/PackageUsageForm`,
          icon: FaChartSimple,
        },

        {
          label: "Create Package",
          href: `/${productUrl}/package/package-name`,
          icon: FaScaleUnbalancedFlip,
        },
        {
          label: "Assign Package",
          href: `/${productUrl}/package/job`,
          icon: FaScaleUnbalancedFlip,
        },
      ],
    },

    {
      show: showMenuIn(["jwellery"]),
      title: "Inventory",
      icon: FaStore,
      submenuItems: [
        {
          label: "Opening Stock",
          href: `/${productUrl}/inventory/openingstock`,
          icon: FaCube,
        },
        {
          label: "purchase",
          href: `/${productUrl}/inventory/purchase`,
          icon: FaCube,
        },
        {
          label: "Karigari",
          href: `/${productUrl}/inventory/karigari`,
          icon: MdHome,
        },
        {
          label: "Stock Adj.",
          href: `/${productUrl}/inventory/adjuststock`,
          icon: MdHome,
        },
        // {
        //   label: "Stock.",
        //   href: `/${productUrl}/inventory/stock`,
        //   icon: MdHome,
        // },
        {
          label: "Stock List.",
          href: `/${productUrl}/inventory/stocklist`,
          icon: MdHome,
        },
        {
          label: "Purchase Return.",
          href: `/${productUrl}/inventory/purchasereturn`,
          icon: MdHome,
        },
        {
          label: "Sales return.",
          href: `/${productUrl}/inventory/salereturns`,
          icon: MdHome,
        },
      ],
    },

    //inventory for saloon
    {
      show: showMenuIn(["saloon", "resturant"]),
      title: "Inventory",
      icon: FaStore,
      submenuItems: [
        {
          label: "Opening Stock",
          href: `/${productUrl}/inventory/openingstock`,
          icon: FaCube,
        },
        {
          label: "purchase",
          href: `/${productUrl}/inventory/purchase`,
          icon: FaCube,
        },

        // {
        //   label: "Stock.",
        //   href: `/${productUrl}/inventory/stock`,
        //   icon: MdHome,
        // },
        // {
        //   label: "Stock List.",
        //   href: `/${productUrl}/inventory/stocklist`,
        //   icon: MdHome,
        // },
        {
          label: "Purchase Return.",
          href: `/${productUrl}/inventory/purchasereturn`,
          icon: MdHome,
        },
        {
          label: "Sales return.",
          href: `/${productUrl}/inventory/salereturns`,
          icon: MdHome,
        },
      ],
    },

    {
      show: showMenuIn(["jwellery", "resturant", "saloon"]),
      title: "Barcodes",
      icon: FaCogs,
      submenuItems: [
        {
          label: "Generate barcode",
          href: `/${productUrl}/barcode`,
          icon: FaChartSimple,
        },
        {
          label: "Print barcode",
          href: `/${productUrl}/printlabel`,
          icon: FaScaleUnbalancedFlip,
        },
      ],
    },
    //new gst for admin side
    {
      show: showMenuIn(["admin"]),
      title: "GST",
      icon: FaCogs,
      submenuItems: [
        {
          label: "Taxes",
          href: `/jwellery/gst`,
          icon: FaScaleUnbalancedFlip,
        },
      ],
    },
    {
      show: showMenuIn(["jwellery", "resturant", "saloon"]),
      title: "Product ",
      icon: FaCubes,
      submenuItems: [
        {
          label: "Product",
          href: `/${productUrl}/productservice`,
          icon: FaUserShield,
        },
        { label: "Company", href: `/${productUrl}/company`, icon: FaBuilding },
        {
          label: "Product Type",
          href: `/${productUrl}/producttype`,
          icon: MdPieChart,
        },
        {
          label: "Product Category",
          href: `/${productUrl}/productgroup`,
          icon: MdCategory,
        },
      ],
    },
    {
      show: showMenuIn(["admin"]),
      title: "Settings",
      icon: FaCogs,
      submenuItems: [
        {
          label: "Logo",
          href: `/admin/logo`,
          icon: FaChartSimple,
        },
      ],
    },
     {
      show: showMenuIn(["admin"]),
      title: "QR Upload",
      icon: FaCogs,
      submenuItems: [
        {
          label: "QR Image Upload",
          href: `/admin/qrimage`,
          icon: CgQr,
        },
      ],
    },

    //admin recharge
    ,
     {
      show: showMenuIn(["admin"]),
      title: "Client Recharge",
      icon: FaCogs,
      submenuItems: [
        {
          label: "Client Recharge",
          href: `/admin/clientrecharge`,
          icon: CgQr,
        },
        {
          label: "Set coin",
          href: `/admin/settingcoin`,
          icon: CgQr,
        },
      ],
    },

    {
      show: showMenuIn(["jwellery", "saloon"]),
      title: "Settings",
      icon: FaCogs,
      submenuItems: [
        {
          label: "Billing Logo",
          href: `/${productUrl}/billLogo`,
          icon: FaChartSimple,
        },
        {
          label: "Sale setup",
          href: `/${productUrl}/saleproduct`,
          icon: FaScaleUnbalancedFlip,
        },
      ],
    },
    {
      show: showMenuIn(["jwellery", "resturant", "saloon"]),
      title: "CRM",
      icon: FaClipboardList,
      submenuItems: [
        {
          label: "enquiry",
          href: `/${productUrl}/enquiry`,
          icon: FaQuestionCircle,
        },
      ],
      submenuItems: [
        {
          label: "Today Birthday & Anniversary",
          href: `/${productUrl}/birthday`,
          icon: FaBirthdayCake,
        },
        {
          label: "Upcomming Birthday & Anniversary",
          href: `/${productUrl}/upcommingbirthday`,
          icon: FaBirthdayCake,
        },
        {
          label: "enquiry",
          href: `/${productUrl}/enquiry`,
          icon: FaQuestionCircle,
        },
        {
          label: "Follow-Up",
          href: `/${productUrl}/followup`,
          icon: RiChatFollowUpFill,
        },
        {
          label: "BBLC",
          href: `/${productUrl}/bblc`,
          icon: RiDeviceRecoverFill,
        },
      ],
    },
  ];

  const navigateHandler = () => {
    router.push("/components/logout/page");
  };
  const handleLogoutClick = () => {
    setIsLogoutModel(true);
  };

  return (
    <Fragment>
      <Head>
        <title>Admin Panel</title>
        <meta name="description" content="Admin Section of the Application" />
      </Head>
      <div className="fixed inset-0 flex w-full  h-screen text-black">
        <ProgressBar
          height="3px"
          color="#333333"
          options={{ showSpinner: false }}
          shallowRouting
        />
        <aside className="w-28 h-full  flex flex-col bg-green-600 ">
        {/* <aside
          className={`w-28 h-full fixed top-0 left-0 bg-green-600 flex flex-col z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex`}
        > */}
          <div className="flex items-center justify-center py-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Current Logo"
                className="w-20 h-auto rounded-lg mx-auto"
              />
            ) : (
              <p className="text-gray-500">No logo available</p>
            )}
          </div>
          <ul className="p-4 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden">
            <li>
              <Link
                href="/dashboard"
                className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 rounded hover:text-white ${
                  pathname === "/dashboard" ? "text-white" : ""
                }`}
              >
                <FaTachometerAlt size={25} />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>

            {showMenuIn(["jwellery", "resturant", "saloon"]) && (
              <li>
                <Link
                  href={`/${productUrl}/master`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/master` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Master</span>
                </Link>
              </li>
            )}

            {/* customber details here  */}

            {showMenuIn(["jwellery", "saloon", "resturant"]) && (
              <li>
                <Link
                  href={`/${productUrl}/customer`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/customer` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Customers</span>
                </Link>
              </li>
            )}

            {/* saloon */}

            {showMenuIn(["saloon"]) && (
              <li>
                <Link
                  href={`/${productUrl}/appointment`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/appointment`
                      ? " text-white"
                      : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Appointment</span>
                </Link>
              </li>
            )}

            {showMenuIn(["saloon"]) && (
              <li>
                <Link
                  href={`/${productUrl}/invoice`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/invoice` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Billing</span>
                </Link>
              </li>
            )}

            {showMenuIn(["resturant"]) && (
              <li>
                <Link
                  href={`/${productUrl}/kot`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/kot` ? " text-white" : ""
                  }`}
                >
                  <IoRestaurant size={28} />
                  <span className="font-medium">KOT</span>
                </Link>
              </li>
            )}

            {showMenuIn(["saloon"]) && (
              <li>
                <Link
                  href={`/${productUrl}/booking/newBooking`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/booking/newBooking`
                      ? " text-white"
                      : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Booking</span>
                </Link>
              </li>
            )}

            {/* {showMenuIn(["saloon"]) && (
              <li>
                <Link
                  href={`/${productUrl}/wallet`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/wallet` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Wallet</span>
                </Link>
              </li>
            )} */}

            {showMenuIn(["admin"]) && (
              <li>
                <Link
                  href={`/${productUrl}/client`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/client` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Clients</span>
                </Link>
              </li>
            )}
            {showMenuIn(["admin"]) && (
              <li>
                <Link
                  href={`/${productUrl}/reviewlink`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/reviewlink`
                      ? " text-white"
                      : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Review generate</span>
                </Link>
              </li>
            )}
            {showMenuIn(["admin"]) && (
              <li>
                <Link
                  href={`/${productUrl}/lastlogin`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/lastlogin` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Last Visit</span>
                </Link>
              </li>
            )}
            {/* ternms and conditions */}
            {showMenuIn(["admin"]) && (
              <li>
                <Link
                  href={`/${productUrl}/terms&conditions`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/lastlogin` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Terms Conditions</span>
                </Link>
              </li>
            )}

            {/* Main Menu with Submenu */}
            {showMenuIn(["jwellery"]) && (
              <li>
                <Link
                  href={`/${productUrl}/invoice`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/invoice` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Billing</span>
                </Link>
              </li>
            )}
            {showMenuIn(["jwellery", "resturant", "saloon"]) && (
              <li>
                <Link
                  href={`/${productUrl}/accountreport`}
                  className={`flex flex-col items-center gap-2 px-4 text-sm py-2.5 transition duration-300 rounded hover:text-white ${
                    pathname === `/${productUrl}/accountreport`
                      ? " text-white"
                      : ""
                  }`}
                >
                  <FaCalculator size={25} />
                  <span className="font-medium">Accounts</span>
                </Link>
              </li>
            )}
            {showMenuIn(["admin"]) && (
              <li>
                <Link
                  href={`/${productUrl}/coin`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/coin` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Coin</span>
                </Link>
              </li>
            )}

            {showMenuIn(["jwellery"]) && (
              <li>
                <Link
                  href={`/${productUrl}/orderslip`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/orderslip` ? " text-white" : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">OrderSlip</span>
                </Link>
              </li>
            )}

            {showMenuIn(["distributor"]) && (
              <li>
                <Link
                  href={`/${productUrl}/assignclient`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/assignclient`
                      ? " text-white"
                      : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium"> Assigned Client </span>
                </Link>
              </li>
            )}
            {showMenuIn(["admin"]) && (
              <li>
                <Link
                  href={`/${productUrl}/distributer`}
                  className={`flex flex-col items-center gap-1 px-4 text-sm py-2.5 transition duration-300 hover:text-white ${
                    pathname === `/${productUrl}/distributer`
                      ? " text-white"
                      : ""
                  }`}
                >
                  <RiFileList3Fill size={28} />
                  <span className="font-medium">Distributers</span>
                </Link>
              </li>
            )}
            <li>
              <div className="relative">
                {/* <button
                  onClick={() => setShowSubmenu(!showSubmenu)}
                  className="flex items-center justify-between w-full gap-2 px-4 py-2.5 transition duration-300 rounded  hover:text-white"
                >
                  <MdHome size={24} />
                  <span className="font-medium">Front Cms</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      showSubmenu ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button> */}
                {/* Submenu */}
                <ul className="space-y-1">
                  {menus.map((menu, index) => (
                    <Menu
                      key={index}
                      show={menu.show}
                      //   show={true}
                      title={menu.title}
                      icon={menu.icon ? menu.icon : ""}
                      submenuItems={menu.submenuItems}
                    />
                  ))}
                </ul>
              </div>
            </li>

            {/* Other menu items */}
          </ul>
        </aside>
        <main className="flex flex-col flex-1">
          <nav className="flex justify-between items-center w-full px-8 py-3 bg-white shadow-md">
            <div className="flex items-center">
              <span className="font-medium text-xl text-gray-800">
                {/* Dashboard */}
              </span>
            </div>

            {/* <div className="flex justify-items-end  sm:items-center sm:gap-6">
            

              <div>
                <button
                  onClick={handleLogoutClick}
                  className="ml-10 text-3xl text-gray-600 hover:text-red-500 transition duration-300"
                >
                  <LuLogOut />
                </button>
              </div>
              <div>
                <button
                  className="md:hidden p-3 text-white bg-green-600 fixed top-4 left-4 z-50 rounded"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? (
                    <GiHamburgerMenu size={20} />
                  ) : (
                    <RxCrossCircled size={20} />
                  )}
                </button>
              </div>
            </div> */}
            <div className="flex justify-end items-center gap-4 w-full">
              {/* Hamburger Menu (for small screens only) */}
              <div className="md:hidden">
                <button
                  className="p-3 text-gray-600 rounded"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? (
                    <RxCrossCircled size={35} />
                  ) : (
                    <GiHamburgerMenu size={35} />
                  )}
                </button>
              </div>
              {/* Logout Button */}
              <div>
                <button
                  onClick={handleLogoutClick}
                  className="text-3xl text-gray-600 hover:text-red-500 transition duration-300"
                >
                  <LuLogOut />
                </button>
              </div>

              
            </div>
          </nav>

          <div className="flex-1 p-4 overflow-y-auto">{children}</div>
        </main>

        <div
          className={`fixed inset-0 bg-black/30 w-full h-full backdrop-blur-sm transition-all duration-300 ${
            notif ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`absolute top-0 w-80 h-full bg-white flex flex-col transition-all duration-300 ${
              notif ? "right-0" : "-right-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-2">
              <h1 className="text-xl">Notifications</h1>
              <button onClick={() => setNotif(false)}>
                <FaTimes size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto"></div>
            <div className="flex items-center justify-center py-2">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-white bg-indigo-500 rounded">
                <FaBell size={16} />
                See All Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
      {isLogoutModel && <LogoutModel onClose={() => setIsLogoutModel(false)} />}
    </Fragment>
  );
}
export default AuthJs(AdminLayout);
