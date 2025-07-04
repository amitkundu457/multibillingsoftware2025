"use client";

import BalanceCard from "../../components/Dashboard/BalanceCard";
import Birthday_and_Aniversary from "../../components/Dashboard/Birthday_and_Aniversary";
import CategorySale from "../../components/Dashboard/CategorySale";
import Customer from "../../components/Dashboard/Customer";
import FootfallCard from "../../components/Dashboard/FootfallCard";
import RatesCard from "../../components/Dashboard/RatesCard";
import Reminder_And_FollowUp from "../../components/Dashboard/Reminder_And_FollowUp";
import Services_And_Complain from "../../components/Dashboard/Services_And_Complain";
import useSWR from "swr";
import axios from "@/app/lib/axios";
import { Fragment, useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import LineGraph from "./graph"

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

  return (
    <Fragment>
      <div className="flex flex-col gap-4">
        
        
      </div>
      <LineGraph/>
    </Fragment>
  );
}

export default Dashboard;
