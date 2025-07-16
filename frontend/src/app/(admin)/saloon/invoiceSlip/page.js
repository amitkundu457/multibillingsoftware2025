"use client";

import { useEffect, useState } from "react";

import { getLogo } from "@/app/components/config";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import InvoiceSlip from "./index"
import axios from "axios";

const fetcher = async () => {
  const response = await getLogo();
  return response.data.logo_url;
};

const Page = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taxes, setTaxes] = useState([]);
  const { data: logoUrl, error } = useSWR("logo", fetcher);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");




  const getToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const notifyTokenMissing = () => {
    if (typeof window !== "undefined" && window.notyf) {
      window.notyf.error("Authentication token not found!");
    } else {
      console.error("Authentication token not found!");
    }
  };





  useEffect(() => {
    console.log("Component mounted. Fetching taxes...");
    fetchTaxes();
  }, []); // Fetch taxes only once on mount

  const fetchTaxes = async () => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}

    try {
      const response = await axios.get(" https://api.equi.co.in/api/tax",
        {
          headers: { Authorization: `Bearer ${token}` },
        }

      );
      console.log("Taxes API Response:", response);
      if (response.data && response.data.data) {
        setTaxes(response.data.data);
        console.log("Taxes set successfully:", response.data.data);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching taxes:", error.message || error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  };

  useEffect(() => {
    if (id) {
      const fetchInvoiceData = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            ` https://api.equi.co.in/api/printbill/${id}`
          );
          const data = await response.json();
          setInvoiceData(data);
        } catch (error) {
          console.error("Error fetching invoice data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchInvoiceData();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!invoiceData) {
    return <p>No data available.</p>;
  }

  return (
    <div className="max-w-[60rem] mx-auto bg-white p-6 shadow-md">
    
   
  
      {/* <InvoiceFooter taxes={taxes} data={invoiceData}  /> */}
      <InvoiceSlip
        data={invoiceData}
        logoUrl={logoUrl}
        orderId={id}
        taxes={taxes}
        datam={invoiceData}
        logoUrlm={logoUrl}
        date={invoiceData?.date}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
