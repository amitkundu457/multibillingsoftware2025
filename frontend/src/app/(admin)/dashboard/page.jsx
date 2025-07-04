"use client";

import BalanceCard from "../../components/Dashboard/BalanceCard";
import Birthday_and_Aniversary from "../../components/Dashboard/Birthday_and_Aniversary";
import CategorySale from "../../components/Dashboard/CategorySale";
import Customer from "../../components/Dashboard/Customer";
import FootfallCard from "../../components/Dashboard/FootfallCard";
import RatesCard from "../../components/Dashboard/RatesCard";
import Reminder_And_FollowUp from "../../components/Dashboard/Reminder_And_FollowUp";
import Services_And_Complain from "../../components/Dashboard/Services_And_Complain";
import AdminDashboard from "../../components/admindashboard/page";
import useSWR from "swr";
// import axios from "@/app/lib/axios";
import axios from "../../lib/axios";
import { Fragment, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

function Dashboard() {
  const [cookies, setCookie, removeCookie] = useCookies();
  // Get the token from cookies on the client side

  const { data: user, isLoading } = useSWR(
    cookies.access_token ? `/auth/agme` : null, // Ensure this only runs when the token is available
    async () => {
      const res = await axios.get("/auth/agme", {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });
      return res.data;
    }
  );

  const roleToUrlMap = {
    admin: "jwellery",
    jwellery: "jwellery",
    distributor: "distributor",
    resturant: "resturant",
    saloon: "saloon",
  };

  const productUrl = roleToUrlMap[!isLoading && user?.roles?.[0]?.name] || "";
  console.log("productUrl test its", productUrl);

  function showMenuIn(roles) {
    const validRoleExists = roles.some(
      (role) => user?.roles?.[0]?.name === role
    );
    console.log("validRoleExists", validRoleExists);
    if (!isLoading && validRoleExists) {
      return true;
    }

    return false;
  }
  console.log("showMenuIn", showMenuIn(["jwellery", "resturant", "saloon"]));
  return (
    <Fragment>
      {showMenuIn(["jwellery", "resturant", "saloon"]) ? (
        <div className="sm:p-1  min-h-screen">
          <div className="sm:flex sm:flex-row flex flex-col sm:space-x-20">
            <main className="mt-6 grid grid-cols-1 gap-4 w-full sm:w-3/5">
              <BalanceCard />
              <Customer />
              <Birthday_and_Aniversary />
              <Reminder_And_FollowUp />
              <Services_And_Complain />
            </main>

            <div className="space-y-10 sm:w-2/5 w-full mt-5">
              <div>
                <FootfallCard />
              </div>
              {productUrl === "jwellery" && (
                <div>
                  <RatesCard />
                </div>
              )}
              {/* <div>
                <RatesCard />
              </div> */}
              {productUrl === "jwellery" && (
                <div>
                  <CategorySale />
                </div>
              )}
              {/* <div>
                <CategorySale />
              </div> */}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <AdminDashboard />
        </div>
      )}
    </Fragment>
  );
}

export default Dashboard;
