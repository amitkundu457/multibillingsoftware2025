// "use client";

// import { useEffect, useState, useRef } from "react";
// import InvoiceHeader from "./InvoiceHeader";
// import InvoiceTable from "./InvoiceTable";
// import InvoiceFooter from "./InvoiceFooter";
// import { getLogo, getMe, getLogoBill } from "@/app/components/config";
// import useSWR from "swr";
// import dynamic from "next/dynamic";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const Page = () => {
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [BISNumber, setBisNumber] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [taxes, setTaxes] = useState([]);
//   const { data: logoUrl } = useSWR("logo", getLogo);
//   const { data: logoBillUrl } = useSWR("logoBill", getLogoBill);
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");
//   const [companyName, setCompanyName] = useState("");
//   const printRef = useRef(null);

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

//   const handleDownloadPDF = async () => {
//     if (!printRef.current) return;
//     try {
//       const canvas = await html2canvas(printRef.current, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         windowWidth: 794, // A4 width in pixels @ 96 DPI
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`invoice_${id || "download"}.pdf`);
//     } catch (error) {
//       console.error("Failed to generate PDF:", error);
//     }
//   };

//   const handlePrint = () => {
//     if (!printRef.current) return;
//     const content = printRef.current.innerHTML;
//     const printWindow = window.open("", "_blank", "width=800,height=600");

//     if (printWindow) {
//       printWindow.document.open();
//       printWindow.document.write(`
//         <html>
//           <head>
//             <title>Invoice</title>
//             <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//             <style>
//               @media print {
//                 html, body {
//                   width: 210mm;
//                   height: 297mm;
//                   font-size: 11px;
//                   line-height: 1.5;
//                   margin: 0;
//                   padding: 10mm;
//                   background: white;
//                 }

//                 .print-container {
//                   width: 190mm;
//                   margin: 0 auto;
//                   page-break-after: always;
//                 }

//                 .logo-img {
//                   width: 80px !important;
//                   height: auto !important;
//                 }
//   .center-logo-wrapper {
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 height: 100%;
//                 position: absolute;
//                 inset: 0;
//               }

//               .logo-imgs {
//                 width: 300px !important;
//                 height: auto !important;
//               }
//                 table {
//                   width: 100%;
//                   border-collapse: collapse;
//                 }

//                 th, td {
//                   padding: 6px;
//                   font-size: 10px;
//                 }

//                 h1, h2, h3 {
//                   font-size: 14px;
//                 }
//               }

//               body {
//                 font-family: Arial, sans-serif;
//                 padding: 20px;
//               }
//             </style>
//           </head>
//           <body onload="window.print(); window.close();">
//             ${content}
//           </body>
//         </html>
//       `);
//       printWindow.document.close();
//     }
//   };

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     const fetchBis = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/api/bis-number-get", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBisNumber(res.data.bis_number);
//       } catch (error) {
//         console.error("Error fetching BIS number:", error);
//       }
//     };
//     fetchBis();
//   }, []);

//   useEffect(() => {
//     const fetchTaxes = async () => {
//       const token = getToken();
//       if (!token) {
//         notifyTokenMissing();
//         return;
//       }
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/tax", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data?.data) {
//           setTaxes(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching taxes:", error.message || error);
//       }
//     };

//     const fetchCompanyDetails = async () => {
//       try {
//         const response = await getMe();
//         if (response?.data) {
//           setCompanyName(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching company details:", error);
//       }
//     };

//     fetchCompanyDetails();
//     fetchTaxes();
//   }, []);

//   useEffect(() => {
//     if (!id) return;
//     const fetchInvoiceData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `http://127.0.0.1:8000/api/printbill/${id}`
//         );
//         setInvoiceData(response.data);
//       } catch (error) {
//         console.error("Error fetching invoice data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInvoiceData();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (!invoiceData) return <p>No invoice data available.</p>;

//   return (
//     <div className="p-4">
//       <div
//         ref={printRef}
//         className="print-container w-[210mm] min-w-full mx-auto bg-white px-[10mm] py-[15mm] shadow-md text-[11px] leading-[1.5]"
//       >
//         <InvoiceHeader
//           bisNumber={BISNumber}
//           companyName={companyName}
//           data={invoiceData}
//           logoUrl={logoUrl}
//           logoBillUrl={logoBillUrl}
//         />
//         <InvoiceTable
//           orderId={id}
//           taxes={taxes}
//           companyName={companyName}
//           data={invoiceData}
//           logoUrl={logoUrl}
//           logoBillUrl={logoBillUrl}
//         />
//         <InvoiceFooter
//           data={invoiceData}
//           taxes={taxes}
//           companyName={companyName}
//         />
//       </div>

//       <div className="text-center mt-6 flex justify-center gap-4">
//         {/* <button
//           onClick={handleDownloadPDF}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Download Invoice as PDF
//         </button> */}
//         <button
//           onClick={handlePrint}
//           className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
//         >
//           Print Invoice
//         </button>
//       </div>
//     </div>
//   );
// };

// export default dynamic(() => Promise.resolve(Page), { ssr: false });

"use client";

import { useEffect, useState, useRef } from "react";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceTable from "./InvoiceTable";
import InvoiceFooter from "./InvoiceFooter";
import { getLogo, getMe, getLogoBill } from "@/app/components/config";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Page = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [BISNumber, setBisNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taxes, setTaxes] = useState([]);
  const { data: logoUrl } = useSWR("logo", getLogo);
  const { data: logoBillUrl } = useSWR("logoBill", getLogoBill);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [companyName, setCompanyName] = useState("");
  const printRef = useRef(null);

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

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        windowWidth: 794, // A4 width in pixels @ 96 DPI
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${id || "download"}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
           
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
              html, body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
  }

  .print-container {
    width: 210mm;
    height: 297mm;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
  }

  body {
     font-family: Arial, sans-serif;
                padding: 5px;
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

  useEffect(() => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    const fetchBis = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/bis-number-get",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBisNumber(res.data.bis_number);
      } catch (error) {
        console.error("Error fetching BIS number:", error);
      }
    };
    fetchBis();
  }, []);

  useEffect(() => {
    const fetchTaxes = async () => {
      const token = getToken();
      if (!token) {
        notifyTokenMissing();
        return;
      }
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/tax", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.data) {
          setTaxes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching taxes:", error.message || error);
      }
    };

    const fetchCompanyDetails = async () => {
      try {
        const response = await getMe();
        if (response?.data) {
          setCompanyName(response.data);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
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
          `http://127.0.0.1:8000/api/printbill/${id}`
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

  if (loading) return <p>Loading...</p>;
  if (!invoiceData) return <p>No invoice data available.</p>;

  return (
    <div className=" print:p-0">
      <div
        ref={printRef}
        className="print-container h-[297mm]  w-[210mm] print:w-[210mm] print:m-0 min-w-full mx-auto bg-white  text-[11px] leading-[1.5]"
      >
      {/* <div
  ref={printRef}
  className="print-container w-[210mm] h-[297mm] bg-white text-[11px] leading-[1.5] print:w-[210mm] print:h-[297mm] print:m-0 print:p-0 print:shadow-none"
> */}
        <InvoiceHeader
          bisNumber={BISNumber}
          companyName={companyName}
          data={invoiceData}
          logoUrl={logoUrl}
          logoBillUrl={logoBillUrl}
        />
        <InvoiceTable
          orderId={id}
          taxes={taxes}
          companyName={companyName}
          data={invoiceData}
          logoUrl={logoUrl}
          logoBillUrl={logoBillUrl}
        />
        <InvoiceFooter
          data={invoiceData}
          taxes={taxes}
          companyName={companyName}
        />
      </div>

      <div className="text-center mt-6 flex justify-center gap-4">
        {/* <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Download Invoice as PDF
        </button> */}
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
