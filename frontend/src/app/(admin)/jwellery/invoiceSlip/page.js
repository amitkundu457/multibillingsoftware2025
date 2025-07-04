
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { getLogo } from "@/app/components/config";
// import useSWR from "swr";
// import dynamic from "next/dynamic";
// import { useSearchParams } from "next/navigation";
// import InvoiceSlip from "./index";
// import axios from "axios";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const fetcher = async () => {
//   const response = await getLogo();
//   return response.data.logo_url;
// };

// const Page = () => {
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [taxes, setTaxes] = useState([]);
//   const { data: logoUrl } = useSWR("logo", fetcher);
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   const invoiceRef = useRef(null);

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
//     fetchTaxes();
//   }, []);

//   const fetchTaxes = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }

//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/tax", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.data?.data) {
//         setTaxes(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching taxes:", error);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       const fetchInvoiceData = async () => {
//         setLoading(true);
//         try {
//           const response = await fetch(`http://127.0.0.1:8000/api/printbill/${id}`);
//           const data = await response.json();
//           setInvoiceData(data);
//         } catch (error) {
//           console.error("Error fetching invoice data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchInvoiceData();
//     }
//   }, [id]);

//   const downloadPDF = async () => {
//     const element = invoiceRef.current;
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     const imgProps = pdf.getImageProperties(imgData);
//     const imgWidth = pageWidth * 0.9;
//     const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

//     const xOffset = (pageWidth - imgWidth) / 2;
//     let yOffset = 10;
//     let heightLeft = imgHeight;

//     pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft > 0) {
//       pdf.addPage();
//       yOffset = -heightLeft + 10;
//       pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     pdf.save(`OrderSlip-${id}.pdf`);
//   };

//   const handlePrint = () => {
//     if (!invoiceRef.current) return;
//     const content = invoiceRef.current.innerHTML;
//     const printWindow = window.open("", "_blank", "width=800,height=600");

//     if (printWindow) {
//       printWindow.document.open();
//       printWindow.document.write(`
//         <html>
//           <head>
//             <title>Order Slip</title>
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

//                 .center-logo-wrapper {
//                   display: flex;
//                   justify-content: center;
//                   align-items: center;
//                   height: 100%;
//                   position: absolute;
//                   inset: 0;
//                 }

//                 .logo-imgs {
//                   width: 100px !important;
//                   height: auto !important;
//                 }

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

//   if (loading) return <p>Loading...</p>;
//   if (!invoiceData) return <p>No data available.</p>;

//   return (  
//     // <div className="max-w-[60rem] mx-auto bg-white p-6 shadow-md">
//     <div className=" w-[210mm] min-w-full mx-auto bg-white p-6 shadow-md">
//       <div ref={invoiceRef} id="invoice-content">
//         <InvoiceSlip
//           data={invoiceData}
//           logoUrl={logoUrl}
//           orderId={id}
//           taxes={taxes}
//           datam={invoiceData}
//           logoUrlm={logoUrl}
//           date={invoiceData?.date}
//         />

//         <div className="flex justify-center mt-4 gap-4">
//           {/* <button
//             onClick={downloadPDF}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Download PDF
//           </button> */}
//           <button
//             onClick={handlePrint}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Print Slip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default dynamic(() => Promise.resolve(Page), { ssr: false });





"use client";

import { useEffect, useRef, useState } from "react";
import { getLogo } from "@/app/components/config";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import InvoiceSlip from "./index";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const fetcher = async () => {
  const response = await getLogo();
  return response.data.logo_url;
};

const Page = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taxes, setTaxes] = useState([]);
  const { data: logoUrl } = useSWR("logo", fetcher);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const invoiceRef = useRef(null);

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
    fetchTaxes();
  }, []);

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
      console.error("Error fetching taxes:", error);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchInvoiceData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/printbill/${id}`);
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

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth * 0.9;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    const xOffset = (pageWidth - imgWidth) / 2;
    let yOffset = 10;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      yOffset = -heightLeft + 10;
      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`OrderSlip-${id}.pdf`);
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const content = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
  
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Order Slip</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @page {
                size: A4;
                margin: 0;
              }
  
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
  
                .center-logo-wrapper {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                  position: absolute;
                  inset: 0;
                }
  
                .logo-imgs {
                  width: 100px !important;
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
            <div class="print-container">
              ${content}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (!invoiceData) return <p>No data available.</p>;

  return (  
    // <div className="max-w-[60rem] mx-auto bg-white p-6 shadow-md">
    // <div className=" w-[210mm] min-w-full mx-auto bg-white p-6 shadow-md">
    <div>
      <div ref={invoiceRef} id="invoice-content">
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
      <div className="flex justify-center mt-4 gap-4">
          
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Print Slip
          </button>
        </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
