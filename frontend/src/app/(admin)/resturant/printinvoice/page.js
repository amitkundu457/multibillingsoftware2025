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


  



  

  
  return (
    <div className="max-w-[60rem] mx-auto bg-white p-6 shadow-md">
      {/* <InvoiceHeader companyName={companyName} data={invoiceData} logoUrl={logoUrl} logoBillUrl={logoBillUrl} /> */}
      <InvoiceTable table_no={id} taxes={taxes} data={invoiceData} logoUrl={logoUrl} logoBillUrl={logoBillUrl} companyName={companyName} />
      {/* <InvoiceFooter data={invoiceData} taxes={taxes} companyName={companyName} /> */}
    </div>
  );
};


export default dynamic(() => Promise.resolve(Page), { ssr: false });
