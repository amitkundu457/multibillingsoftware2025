"use client";
import React from "react";
import Link from "next/link";

import useSWR from "swr";
import axios from "@/app/lib/axios";

const MasterMenu = () => {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop().split(";").shift());
        }
        return null;
    };
    const token = getCookie("access_token");
    // Fetch user data
    const { data: user, isLoading } = useSWR(`/auth/agme`, async () => {
        try {
            const res = await axios.get("/auth/agme", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    });

    // Role-to-URL mapping
    const roleToUrlMap = {
        admin: "admin",
        jwellery: "jwellery",
        distributor: "distributor",
        resturant: "resturant",
    };

    const productUrl = roleToUrlMap[!isLoading && user?.roles?.[0]?.name] || "";

    // Function to show menu items based on roles
    function showMenuIn(roles) {
        const validRoleExists = roles.some(
            (role) => user?.roles?.[0]?.name === role
        );
        return !isLoading && validRoleExists;
    }

    // Menu items with visibility conditions
    const menuItems = [
        {
            show: showMenuIn(["distributor"]),
            name: "Users",
            count: 0,
            link: "/users",
        },
        {
            show: showMenuIn(["distributor"]),
            name: "Salesman",
            count: 6,
            link: `/${productUrl}/employees`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Brands",
            count: 5,
            link: `/${productUrl}/company`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Product Group",
            count: 16,
            link: `/${productUrl}/productgroup`,
        },
        {
            show: showMenuIn(["jwellery",]),
            name: "Bill Count",
            count: 14,
            link: `/${productUrl}/billcount`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Product Type",
            count: 16,
            link: `/${productUrl}/producttype`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Products/Services",
            count: 93,
            link: `/${productUrl}/productservice`,
        },
        // {
        //     show: showMenuIn(["jwellery", "resturant"]),
        //     name: "Web Category/Headers",
        //     count: 0,
        //     link: `/${productUrl}/web-category`,
        // },t&cInvoice
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Ledgers/Account Master",
            count: 29,
            link: `/${productUrl}/inventory/karigari/accountmaster`,
        },

        {
            show: showMenuIn(["jwellery"]),
            name: "t&c Invoice",
            count: 29,
            link: `/${productUrl}/t&cInvoice`,
        },
        // {
        //     show: showMenuIn(["jwellery", "resturant"]),
        //     name: "Production Setting",
        //     count: 0,
        //     link: `/${productUrl}/production-setting`,
        // },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Taxes",
            count: 4,
            link: `/${productUrl}/gst`,
        },
        //  {
        //     show: showMenuIn(["jwellery", "resturant"]),
        //     name: "Customer",
        //     count: 4,
        //     link: `/${productUrl}/customer/`,
        // },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Customer Types",
            count: 4,
            link: `/${productUrl}/customertype`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Account Group ",
            count: 4,
            link: `/${productUrl}/accountgroup`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Sub Customers ",
            count: 4,
            link: `/${productUrl}/customersubtype`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Item Type ",
            count: 4,
            link: `/${productUrl}/rate/`,
        },
         {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Rate Master ",
            count: 4,
            link: `/${productUrl}/todayrates/ratemaster`,
        },


         
        {
            show: showMenuIn(["admin"]),
            name: "Terms and Conditions",
            count: 4,
            link: `/${productUrl}/terms&conditions`,
        },
         
        // {
        //     show: showMenuIn(["jwellery", "resturant"]),
        //     name: "Orders ",
        //     count: 4,
        //     link: `/${productUrl}/partialorder`,
        // },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Purity ",
            count: 4,
            link: `/${productUrl}/purity`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "General setting ",
            count: 4,
            link: `/${productUrl}/billLogo`,
        },
        {
            show: showMenuIn(["jwellery"]),
            name: "Cover Image",
            count: 4,
            link: `/${productUrl}/coverupload`,
        },

        // add some for sms
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Sms Setting",
            count: 4,
            link: `/${productUrl}/smssetting`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Sms Credential",
            count: 4,
            link: `/${productUrl}/smscredential`,
        },

        





        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Karigar Entry",
            count: 4,
            link: `/${productUrl}/karigarentry`,
        },
        // supplierlist
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "Sales Man Entry",
            count: 4,
            link: `/${productUrl}/employees`,
        },
        {
            show: showMenuIn(["jwellery", "resturant"]),
            name: "supplier Entry",
            count: 4,
            link: `/${productUrl}/supplierlist`,
        },
    ];

    return (
        <div className="bg-gray-100 absolute left-0 right-0 bottom-0 top-0 ">
            <div className="bg-green-500 text-white text-center py-3 text-xl font-bold rounded">
                Master Menu
            </div>
            <div className="mt-6 sm:space-y-4 sm:px-[28rem] overflow-y-auto sm:h-[33rem]">
                {menuItems
                    .filter((item) => item.show) // Only render items with `show` set to true
                    .map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white border-2 border-green-500 rounded-lg p-1 shadow hover:shadow-lg"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-500 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold">
                                    {item.count}
                                </div>
                                <div className="text-[14px] font-medium">{item.name}</div>
                            </div>
                            <Link href={item.link}>
                <span className="bg-green-500 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold">
                  +
                </span>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default MasterMenu;
