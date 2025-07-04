"use client";
import { usePathname } from "next/navigation";
import { MdCategory, MdEco, MdHome, MdPieChart } from "react-icons/md";
import LogoutModel from "../components/logout/page";
import { LuLogOut } from "react-icons/lu";
import {
  FaBell,
  FaTimes,
  FaStore,
  FaCube,
  FaList,
  FaTachometerAlt,
  FaCalculator,
  FaCubes,
  FaRupeeSign,
  FaReact,
  FaSlidersH,
  FaUserShield,
  FaUsers,
  FaCogs,
  FaBuilding,
  FaUserTie,
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
import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import AuthJs from "../components/withAuth";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import Menu from "../components/menu";
import useSWR from "swr";
import axios from "@/app/lib/axios";
import {getLogo} from "../components/config"
import {useCookies} from "react-cookie";
// import useSWR from 'swr';
const fetcher = async () => {
  const response = await getLogo();
  return response.data.logo_url; // Return the relevant data
};
function AdminLayout({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [isLogoutModel, setIsLogoutModel] = useState(false);
  const { data: logoUrl, error } = useSWR('logo', fetcher);
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
    admin: "jwellery",
    jwellery: "jwellery",
    distributor: "distributor",
    resturant: "resturant",
  };

  const productUrl = roleToUrlMap[!isLoading && user?.roles?.[0]?.name] || "";
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

  const menus = [
    {
      show: showMenuIn(["jwellery","resturant"]),
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
      ],
    },
    {
      show: showMenuIn(["distributor"]),
      title: "Sales",
      icon: FaRupeeSign,
      submenuItems: [
        {
          label: "Sales Person",
          href: `/${productUrl}/employees`,
          icon: FaPerson,
        },
        {
          label: "Sales Assign",
          href: `/${productUrl}/salesassign`,
          icon: FaPersonCircleCheck,
        },
        {
          label: "Report",
          href: `/${productUrl}/employeereport`,
          icon: TbReportSearch,
        },
      ],
    },

    {
      show: showMenuIn(["distributor"]),
      title: "Reports",
      icon: FaRupeeSign,
      submenuItems: [
        {
          label: "commision reports",
          href: `/${productUrl}/reports/commission`,
          icon: FaPerson,
        },
        {
          label: "customer reports",
          href: `/${productUrl}/reports/customer`,
          icon: FaPersonCircleCheck,
        },
      ],
    },

    {
      show: showMenuIn(["jwellery","resturant"]),
      title: "Inventory",
      icon: FaStore,
      submenuItems: [
        {
          label: "Opening Stock",
          href: `/${productUrl}/inventory/openingstock`,
          icon: FaCube,
        },
        {
          label: "Purchase",
          href: `/${productUrl}/inventory/purchase`,
          icon: FaList,
        },
        {
          label: "Karigari",
          href: `/${productUrl}/inventory/karigari`,
          icon: MdHome,
        },
        {
          label: "Stock Adj.",
          href: `/${productUrl}/employeereport`,
          icon: MdHome,
        },
      ],
    },
    {
      show: showMenuIn(["jwellery","resturant"]),
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
      show: showMenuIn(["jwellery","resturant"]),
      title: "Settings",
      icon: FaCogs,
      submenuItems: [
        {
          label: "General Settings",
          href: `/${productUrl}/master`,
          icon: FaChartSimple,
        },
        {
          label: "Sale setup",
          href: `/${productUrl}/saleproduct`,
          icon: FaScaleUnbalancedFlip,
        },
        {
          label: "User Settings",
          href: `/${productUrl}/settings/user`,
          icon: FaUsersGear,
        },
        {
          label: "Roles",
          href: `/${productUrl}/settings/user`,
          icon: FaUserTie,
        },
      ],
    },
  ];
  const handleLogoutClick = () => {
    setIsLogoutModel(true);
  };
  const navigateHandler = () => {
    router.push("/components/logout/page");
  };

  return (
    <Fragment>
      <Head>
        <title>Admin Panel</title>
        <meta name="description" content="Admin Section of the Application" />
      </Head>
      <div className="fixed inset-0 flex w-full h-screen text-black">
        <ProgressBar
          height="3px"
          color="#333333"
          options={{ showSpinner: false }}
          shallowRouting
        />
        <aside className="w-28 h-full flex flex-col bg-green-600 ">
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
          <ul className="p-4 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden">
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

            {showMenuIn(["jwellery","resturant"]) && (
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
            {/* Main Menu with Submenu */}
            {showMenuIn(["jwellery","resturant"]) && (
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
            {showMenuIn(["jwellery","resturant"]) && (
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
            {showMenuIn(["jwellery","resturant"]) && (
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
                {showMenuIn(["jwellery","resturant"]) && (
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
            {showMenuIn(["jwellery","resturant"]) && (
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
        className="flex items-center justify-between w-full gap-2 px-4 py-2.5 transition duration-300 rounded hover:shadow-lg hover:shadow-indigo-500/80 hover:bg-indigo-500 hover:text-white"
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
                      icon={menu.icon}
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
          <nav className="flex justify-between w-full px-8 py-3 bg-white">
            <div>
              <span className="font-medium">Dashboard</span>
            </div>
            <div>
              <button onClick={() => setNotif(true)}>
                <FaBell size={20} />
              </button>
              <button
                onClick={handleLogoutClick}
                className="ml-10 text-3xl text-gray-600 hover:text-red-500 transition duration-300"
              >
                <LuLogOut />
              </button>
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
