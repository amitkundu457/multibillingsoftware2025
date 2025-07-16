"use client";

import { useEffect, useState } from "react";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceTable from "./InvoiceTable";
import InvoiceFooter from "./InvoiceFooter";
import { getLogo, getMe, getLogoBill } from "@/app/components/config";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const fetcher = async () => {
  const response = await getLogo();
  return response.data.logo_url;
};

const fetcherBill = async () => {
  const response = await getLogoBill();
  return response.data.logo_url;
};

const Page = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taxes, setTaxes] = useState([]);
  const { data: logoUrl, error } = useSWR("logo", fetcher);
  const { data: logoBillUrl, error: logoBillError } = useSWR("logoBill", fetcherBill);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [companyName, setCompanyName] = useState("");


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
    fetchCompanyDetails();
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

  const fetchCompanyDetails = async () => {
    try {
      const response = await getMe();
      console.log("Company details fetched:", response);
      if (response && response.data) {
        setCompanyName(response.data);
      } else {
        console.log("Company name not found in the response");
        setCompanyName("");
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchInvoiceData = async () => {
        setLoading(true);
        try {
          // not it; https://api.equi.co.in/api/saloon-printbill/${id}
          const response = await axios.get(`https://api.equi.co.in/api/kot/${id}/bill`);
          setInvoiceData(response.data);
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
      {/* <InvoiceHeader companyName={companyName} data={invoiceData} logoUrl={logoUrl} logoBillUrl={logoBillUrl} /> */}
      <InvoiceTable orderId={id} taxes={taxes} data={invoiceData} logoUrl={logoUrl} logoBillUrl={logoBillUrl} companyName={companyName} />
      {/* <InvoiceFooter data={invoiceData} taxes={taxes} companyName={companyName} /> */}
    </div>
  );     
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
