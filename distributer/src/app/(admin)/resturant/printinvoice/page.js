"use client";

import { useEffect, useState } from "react";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceTable from "./InvoiceTable";
import InvoiceFooter from "./InvoiceFooter";
import { getLogo } from "@/app/components/config";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const fetcher = async () => {
  const response = await getLogo();
  return response.data.logo_url;
};

const Page = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: logoUrl, error } = useSWR("logo", fetcher);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  useEffect(() => {
    if (id) {
      const fetchInvoiceData = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/printbill/${id}`
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
      <InvoiceHeader data={invoiceData} logoUrl={logoUrl} />
      <InvoiceTable orderId={id} data={invoiceData} logoUrl={logoUrl} />
      <InvoiceFooter data={invoiceData} />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
