// "use client";

// import { useEffect, useState } from "react";
// import InvoiceHeader from "./InvoiceHeader";
// import InvoiceTable from "./InvoiceTable";
// import InvoiceFooter from "./InvoiceFooter";
// import { getLogo, getMe, getLogoBill } from "@/app/components/config";
// import useSWR from "swr";
// import dynamic from "next/dynamic";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";

// const fetcher = async () => {
//   const response = await getLogo();
//   return response.data.logo_url;
// };

// const fetcherBill = async () => {
//   const response = await getLogoBill();
//   return response.data.logo_url;
// };

// const Page = () => {
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [taxes, setTaxes] = useState([]);
//   const { data: logoUrl, error } = useSWR("logo", fetcher);
//   const { data: logoBillUrl, error: logoBillError } = useSWR("logoBill", fetcherBill);
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");
//   const [companyName, setCompanyName] = useState([]);



//   const getToken = () => {
//     const cookie = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("access_token="));
//     return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
//   };

//   const notifyTokenMissing = () => {
//     if (typeof window !== "undefined" && window.notyf) {
//       window.notyf.error("Authentication token not found!");
//     } else {
//       console.error("Authentication token not found!");
//     }
//   };








//   useEffect(() => {
//     fetchCompanyDetails();
//     fetchTaxes();
//   }, []); // Fetch taxes only once on mount

//   const fetchTaxes = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {
//       const response = await axios.get(" https://api.equi.co.in/api/tax",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Taxes API Response:", response);
//       if (response.data && response.data.data) {
//         setTaxes(response.data.data);
//         console.log("Taxes set successfully:", response.data.data);
//       } else {
//         console.error("Unexpected API response format:", response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching taxes:", error.message || error);
//       if (error.response) {
//         console.error("Response data:", error.response.data);
//         console.error("Response status:", error.response.status);
//         console.error("Response headers:", error.response.headers);
//       }
//     }
//   };

//   const fetchCompanyDetails = async () => {
//     try {
//       const response = await getMe();
//       console.log("Company details fetched:", response);
//       if (response && response.data) {
//         setCompanyName(response.data);
//       } else {
//         console.log("Company name not found in the response");
//         setCompanyName("");
//       }
//     } catch (error) {
//       console.error("Error fetching company details:", error);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       const fetchInvoiceData = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.get(` https://api.equi.co.in/api/saloon-printbill/${id}`);
//           setInvoiceData(response.data);
//         } catch (error) {
//           console.error("Error fetching invoice data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchInvoiceData();
//     }
//   }, [id]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!invoiceData) {
//     return <p>No data available.</p>;
//   }

//   return (
//     <div className="max-w-[60rem] mx-auto bg-white p-6 shadow-md">
//       {/* <InvoiceHeader companyName={companyName} data={invoiceData} logoUrl={logoUrl} logoBillUrl={logoBillUrl} /> */}
//       <InvoiceTable companyName={companyName}  orderId={id} taxes={taxes} data={invoiceData} logoUrl={logoUrl} logoBillUrl={logoBillUrl} />
//       {/* <InvoiceFooter data={invoiceData} taxes={taxes} companyName={companyName} /> */}
//     </div>
//   );
// };

// export default dynamic(() => Promise.resolve(Page), { ssr: false });
"use client";

import { useEffect, useRef, useState } from "react";
import InvoiceTable from "./InvoiceTable";
import InvoiceFooter from "./InvoiceFooter";
import { getLogo, getMe, getLogoBill } from "@/app/components/config";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
const fetcher = async () => (await getLogo()).data.logo_url;
const fetcherBill = async () => (await getLogoBill()).data.logo_url;

const Page = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taxes, setTaxes] = useState([]);
  const [companyName, setCompanyName] = useState({});
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  
  const printRef = useRef(null);
  const { data: logoUrl } = useSWR("logo", fetcher);
  const { data: logoBillUrl } = useSWR("logoBill", fetcherBill);

  const tableRef = useRef(null);

  // const handlePrint = useReactToPrint({
  //   content: () => tableRef.current,
  //   documentTitle: `Invoice-${id}`,
  //   removeAfterPrint: true,
  // });

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                html, body {
                  width: 210mm;
                  height: 297mm;
                  font-size: 11px;
                  line-height: 1.5;
                  margin: 0;
                  padding: 10mm;
                  background: white;
                }

                .print-container {
                  width: 190mm;
                  margin: 0 auto;
                  page-break-after: always;
                }

                .logo-img {
                  width: 80px !important;
                  height: auto !important;
                }
  .center-logo-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                position: absolute;
                inset: 0;
              }

              .logo-imgs {
                width: 300px !important;
                height: auto !important;
              }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }

                th, td {
                  padding: 6px;
                  font-size: 10px;
                }

                h1, h2, h3 {
                  font-size: 14px;
                }
              }

              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getToken = () => {
    if (typeof document === "undefined") return null;
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
    const fetchCompanyDetails = async () => {
      try {
        const response = await getMe();
        setCompanyName(response?.data || {});
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    const fetchTaxes = async () => {
      const token = getToken();
      if (!token) {
        notifyTokenMissing();
        return;
      }
      try {
        const response = await axios.get("https://api.equi.co.in/api/tax", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaxes(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching taxes:", error);
      }
    };

    fetchCompanyDetails();
    fetchTaxes();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchInvoiceData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.equi.co.in/api/saloon-printbill/${id}`
        );
        setInvoiceData(response.data);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!invoiceData) return <p className="text-center">No data available.</p>;

  return (
    <div className="max-w-[60rem] mx-auto bg-white p-6 shadow-md">
      

      <div   ref={printRef}>
        <InvoiceTable
          companyName={companyName}
          orderId={id}
          taxes={taxes}
          data={invoiceData}
          logoUrl={logoUrl}
          logoBillUrl={logoBillUrl}
        />
        {/* <InvoiceFooter
         companyName={companyName}
         orderId={id}
         taxes={taxes}
         data={invoiceData}
         logoUrl={logoUrl}
         logoBillUrl={logoBillUrl}
        /> */}
      </div>
      <div className="text-center mb-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

// Disable SSR for this client-only component
export default dynamic(() => Promise.resolve(Page), { ssr: false });
