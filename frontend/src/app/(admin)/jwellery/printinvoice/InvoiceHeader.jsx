
//this foe saloon

// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getBillno } from "@/app/components/config";

// const InvoiceHeader = ({ bisNumber, data, logoUrl, companyName }) => {
//   const [billNo, setBillNo] = useState("");
//   const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");
//   const [fetchcoverimage, setcoverImage] = useState("");

//   //token
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

//   //cover image
//   const coverimagefetch = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8000/api/cover/upload",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("API Response:", response.data);

//       const logoUrl = response?.data?.data?.cover;
//       if (logoUrl) {
//         console.log("Fetched Logo URL:", logoUrl);
//         setcoverImage(logoUrl);
//       } else {
//         console.error("Error: 'logo' key not found in response");
//       }
//     } catch (error) {
//       console.error("Error fetching logo URL:", error);
//     }
//   };

//   useEffect(() => {
//     console.log(" companyName", companyName);
//     const fetchNextBillNo = async () => {
//       try {
//         const response = await getBillno();
//         console.log(response.data);
//         setBillNo(response.data.bill_no);
//       } catch (error) {
//         console.error("Error fetching bill number:", error);
//       }
//     };

//     const fetchLogoUrl = async () => {
//       const token = getToken();
//       console.log("masterlogobill token check", token);
//       if (!token) {
//         notifyTokenMissing();
//         return;
//       }
//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/api/masterlogobill",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log("API Response:", response);

//         const logoUrl = response.data.logo;
//         if (logoUrl) {
//           console.log("Fetched Logo URL:", logoUrl);
//           setFetchedLogoUrl(logoUrl);
//         } else {
//           console.error("Error: 'logo' key not found in response");
//         }
//       } catch (error) {
//         console.error("Error fetching logo URL:", error);
//       }
//     };

//     fetchNextBillNo();
//     fetchLogoUrl();
//     coverimagefetch();
//   }, []);

//   console.log("aaa", data);
//   console.log(" companyName", companyName);

//   return (
//     <div className="border-t border-r border-l w-full border-gray-800 ">
//       {/* {
//         fetchedLogoUrl==null &&( */}
//           {/* <div className="bg-red-200 w-full h-[100px]  overflow-hidden">
//         <img
//           src={fetchcoverimage}
//           alt="Cover image Logo"
//           // className="w-full h-[20px] object-contain"
//           className="w-full h-[100px] object-cover"
//         />
//       </div> */}

//         {/* )
//       } */}
      
//       {/* Top Section */}
//       <div className="border border-black w-full p-4 flex items-start">
//         {/* Left Section */}

//         <div className="w-2/3 pr-4 border-r border-black">
//           {/* Header Section */}
          

         
//           <div className="mt-4">
//             {/* Address Section */}
//             <div>
//               <h1 className="text-xl font-bold text-red-600">
//                 {companyName?.user?.information?.business_name || "N/A"}
//               </h1>
//             </div>
//             <p className="text-sm ">
//               Address:{" "}
//               <span className="font-normal text-gray-900">
//                 {companyName?.user?.information?.address_1 || "N/A"},{" "}
//                 {companyName?.user?.information?.pincode || "N/A"},{" "}
//                 {companyName?.user?.information?.state || "N/A"},{" "}
//                 {companyName?.user?.information?.country || "N/A"}
//               </span>
//             </p>

//             {/* Additional Info */}
//             <div className="mt-[0.5] space-y-1">
//               <p className="text-sm ">
//                 <span className=""> Mobile:</span>{" "}
//                 <span className=" text-gray-900 ">
//                   {companyName?.user?.information?.mobile_number || "N/A"}
//                 </span>
//               </p>
//               <p className="text-sm">
//                 <span className="">GSTIN:</span>{" "}
//                 <span className=" text-gray-900 ">
//                   {companyName?.user?.information?.gst || "N/A"}
//                 </span>
//               </p>
//             </div>
//           </div>
//           {/* ))} */}
//         </div>

//         {/* Right Section */}
//         <div className="w-1/3 pl-4 mt-10 text-sm space-y-2">
//           <div className=" flex  justify-evenly  gap-5">
//           <div className="flex flex-col ">
//             <span className="font-bold text-gray-700">Invoice No.</span>
//             <span className="text-gray-900">{data?.billno || "-"}</span>
//           </div>

        

//           <div className="flex flex-col">
//             <span className="font-bold text-gray-700">Invoice Date</span>
//             <span className="text-gray-900">{data?.date || "-"}</span>
//           </div>
//         </div>
//           </div>
//       </div>

//       {/* Middle Section */}
//       <div className=" ">
       

//         <div className="grid grid-cols-1 gap-4">
//           {/* Bill To Section */}
//           <div className=" border-r border-l border-gray-800 p-4">
//             <p className="font-bold">BILL TO:</p>
//             {data.users.customers.map((customer) => (
//               <div key={customer.id}>
//                 <p className="text-sm">
//                   <span className=" font-bold">{data.users.name}</span> 
//                 </p>
//                 {/* <p className="text-sm">Address: {customer.address || "N/A"}</p> */}
//                 <p className="text-sm">
//                   <span className="">Phone:</span>{" "}
//                   {customer.phone || "N/A"}
//                 </p>
//                 {/* <p className="text-sm">GSTIN: {customer.gstin || "N/A"}</p> */}
//                 <p className="text-sm ">
//                   Address:{" "}
//                   <span className="font-normal text-gray-700">
//                     {customer?.address || "N/A"}, {customer?.pincode || "N/A"},{" "}
//                     {customer?.state || "N/A"}, {customer?.country || "N/A"}
//                   </span>
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Ship To Section */}
//           {/* <div className="p-4">
//             <p className="font-bold">SHIP TO:</p>
//             {data.users.customers.map((customer) => (
//               <div key={customer.id}>
//                 <p className="text-sm">Address: {customer.address || "N/A"}</p>
//                 <p className="text-sm">Pincode: {customer.pincode || "N/A"}</p>
//                 <p className="text-sm">State: {customer.state || "N/A"}</p>
//                 <p className="text-sm">Country: {customer.country || "N/A"}</p>
//               </div>
//             ))}
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceHeader;

// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getBillno } from "@/app/components/config";

// const InvoiceHeader = ({ bisNumber, data, logoUrl, companyName }) => {
//   const [billNo, setBillNo] = useState("");
//   const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");

//   useEffect(() => {
//     console.log(" companyName", companyName);
//     const fetchNextBillNo = async () => {
//       try {
//         const response = await getBillno();
//         console.log(response.data);
//         setBillNo(response.data.bill_no);
//       } catch (error) {
//         console.error("Error fetching bill number:", error);
//       }
//     };

//     // const fetchLogoUrl = async () => {
//     //   try {
//     //     const response = await axios.get(
//     //       "http://127.0.0.1:8000/api/masterlogobill"
//     //     );
//     //     console.log("API Response:", response.data);

//     //     const logoUrl = response.data.logo;
//     //     if (logoUrl) {
//     //       console.log("Fetched Logo URL:", logoUrl);
//     //       setFetchedLogoUrl(logoUrl);
//     //     } else {
//     //       console.error("Error: 'logo' key not found in response");
//     //     }
//     //   } catch (error) {
//     //     console.error("Error fetching logo URL:", error);
//     //   }
//     // };
//     const fetchLogoUrl = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/masterlogobill");
//         const logoUrl = response.data.logo;

//         if (logoUrl) {
//           console.log("Fetched Logo URL:", logoUrl);

//           // Convert image to base64
//           const imageBlob = await axios.get(logoUrl, {
//             responseType: "blob"
//           });

//           const reader = new FileReader();
//           reader.onloadend = () => {
//             setFetchedLogoUrl(reader.result); // this will be a base64 string
//           };
//           reader.onerror = (error) => {
//             console.error("Base64 conversion error:", error);
//           };
//           reader.readAsDataURL(imageBlob.data);
//         } else {
//           console.error("Error: 'logo' key not found in response");
//         }
//       } catch (error) {
//         console.error("Error fetching logo URL:", error);
//       }
//     };

//     fetchNextBillNo();
//     fetchLogoUrl();
//   }, []);

//   return (
//     <div className="border-t border-r border-l border-gray-800">
//       {/* Top Section */}
//       <div className="border border-black w-full p-4 flex items-start">
//         {/* Left Section */}
//         <div className="w-2/3 pr-4 border-r border-black">
//           {/* Header Section */}
//           <div className="flex items-center space-x-4 border-b pb-2">
//             <img
//               src={fetchedLogoUrl}
//               className="w-[20%]"
//               alt="Company Logo"
//               // crossOrigin="anonymous"
//             />
//             <div>
//               <h1 className="text-2xl font-bold text-red-600">
//                 {companyName?.user?.information?.business_name || "N/A"}
//               </h1>
//             </div>
//           </div>

//           {/* Company Address */}
//           <div className="mt-4">
//             <p className="text-sm font-bold">
//               Address:{" "}
//               <span className="font-normal text-gray-900">
//                 {companyName?.user?.information?.address_1 || "N/A"},{" "}
//                 {companyName?.user?.information?.pincode || "N/A"},{" "}
//                 {companyName?.user?.information?.state || "N/A"},{" "}
//                 {companyName?.user?.information?.country || "N/A"}
//               </span>
//             </p>

//             <div className="mt-2 space-y-1">
//               <p className="text-sm">
//                 <span className="font-bold">Mobile:</span>{" "}
//                 <span className="text-gray-900">
//                   {companyName?.user?.information?.mobile_number || "N/A"}
//                 </span>
//               </p>
//               <p className="text-sm">
//                 <span className="font-bold">GSTIN:</span>{" "}
//                 <span className="text-gray-900">
//                   {companyName?.user?.information?.gst || "N/A"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="w-1/3 pl-4 mt-10 text-sm space-y-2">
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Invoice No.</span>
//             <span className="text-gray-900">{data?.billno || "-"}</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">BIS No.</span>
//             <span className="text-gray-900">{bisNumber || "-"}</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Bill No:</span>
//             <span className="text-gray-900">
//               {data?.billcountnumber || "-"}
//             </span>
//           </div>

//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Invoice Date</span>
//             <span className="text-gray-900">{data?.date || "-"}</span>
//           </div>
//         </div>
//       </div>

//       {/* Middle Section */}
//       <div>
//         <div className="grid grid-cols-1 gap-4">
//           {/* Bill To Section */}
//           <div className="border-r border-gray-800 p-4">
//             <p className="font-bold">BILL TO:</p>
//             {data.users.customers.map((customer) => (
//               <div key={customer.id}>
//                 <p className="text-sm">
//                   <span className="font-bold">Name:</span> {data.users.name}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-bold">Phone:</span>{" "}
//                   {customer.phone || "N/A"}
//                 </p>
//                 <p className="text-sm font-bold">
//                   Address:{" "}
//                   <span className="font-normal text-gray-700">
//                     {customer?.address || "N/A"},{" "}
//                     {customer?.pincode || "N/A"},{" "}
//                     {customer?.state || "N/A"},{" "}
//                     {customer?.country || "N/A"}
//                   </span>
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceHeader;

// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getBillno } from "@/app/components/config";

// const InvoiceHeader = ({ bisNumber, data, logoUrl, companyName }) => {
//   const [billNo, setBillNo] = useState("");
//   const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");

//   useEffect(() => {
//     const fetchNextBillNo = async () => {
//       try {
//         const response = await getBillno();
//         setBillNo(response.data.bill_no);
//       } catch (error) {
//         console.error("Error fetching bill number:", error);
//       }
//     };

//     const fetchLogoUrl = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/masterlogobill");
//         const logoUrl = response.data.logo;

//         if (logoUrl) {
//           // Convert image to base64
//           const imageBlobResponse = await axios.get(logoUrl, {
//             responseType: "blob",
//           });

//           const reader = new FileReader();
//           reader.onloadend = () => {
//             setFetchedLogoUrl(reader.result); // Base64 image
//           };
//           reader.onerror = (error) => {
//             console.error("Base64 conversion error:", error);
//           };
//           reader.readAsDataURL(imageBlobResponse.data);
//         } else {
//           console.error("Error: 'logo' key not found in response");
//         }
//       } catch (error) {
//         console.error("Error fetching logo URL:", error);
//       }
//     };

//     fetchNextBillNo();
//     fetchLogoUrl();
//   }, []);

//   return (
//     <div className="border-t border-r border-l border-gray-800">
//       {/* Top Section */}
//       <div className="border border-black w-full p-4 flex items-start">
//         {/* Left Section */}
//         <div className="w-2/3 pr-4 border-r border-black">
//           {/* Header Section */}
//           <div className="flex items-center space-x-4 border-b pb-2">
//             {fetchedLogoUrl && (
//               <img
//                 src={fetchedLogoUrl}
//                 className="w-[20%]"
//                 alt="Company Logo"
//               />
//             )}
//             <div>
//               <h1 className="text-2xl font-bold text-red-600">
//                 {companyName?.user?.information?.business_name || "N/A"}
//               </h1>
//             </div>
//           </div>

//           {/* Company Address */}
//           <div className="mt-4">
//             <p className="text-sm font-bold">
//               Address:{" "}
//               <span className="font-normal text-gray-900">
//                 {companyName?.user?.information?.address_1 || "N/A"},{" "}
//                 {companyName?.user?.information?.pincode || "N/A"},{" "}
//                 {companyName?.user?.information?.state || "N/A"},{" "}
//                 {companyName?.user?.information?.country || "N/A"}
//               </span>
//             </p>

//             <div className="mt-2 space-y-1">
//               <p className="text-sm">
//                 <span className="font-bold">Mobile:</span>{" "}
//                 <span className="text-gray-900">
//                   {companyName?.user?.information?.mobile_number || "N/A"}
//                 </span>
//               </p>
//               <p className="text-sm">
//                 <span className="font-bold">GSTIN:</span>{" "}
//                 <span className="text-gray-900">
//                   {companyName?.user?.information?.gst || "N/A"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="w-1/3 pl-4 mt-10 text-sm space-y-2">
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Invoice No.</span>
//             <span className="text-gray-900">{data?.billno || "-"}</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">BIS No.</span>
//             <span className="text-gray-900">{bisNumber || "-"}</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Bill No:</span>
//             <span className="text-gray-900">
//               {data?.billcountnumber || "-"}
//             </span>
//           </div>

//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Invoice Date</span>
//             <span className="text-gray-900">{data?.date || "-"}</span>
//           </div>
//         </div>
//       </div>

//       {/* Middle Section */}
//       <div>
//         <div className="grid grid-cols-1 gap-4">
//           {/* Bill To Section */}
//           <div className="border-r border-gray-800 p-4">
//             <p className="font-bold">BILL TO:</p>
//             {data.users.customers.map((customer) => (
//               <div key={customer.id}>
//                 <p className="text-sm">
//                   <span className="font-bold">Name:</span> {data.users.name}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-bold">Phone:</span>{" "}
//                   {customer.phone || "N/A"}
//                 </p>
//                 <p className="text-sm font-bold">
//                   Address:{" "}
//                   <span className="font-normal text-gray-700">
//                     {customer?.address || "N/A"},{" "}
//                     {customer?.pincode || "N/A"},{" "}
//                     {customer?.state || "N/A"},{" "}
//                     {customer?.country || "N/A"}
//                   </span>
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceHeader;

// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getBillno } from "@/app/components/config";

// const InvoiceHeader = ({ bisNumber, data, logoUrl, companyName, onLogoReady }) => {
//   const [billNo, setBillNo] = useState("");
//   const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");
//   const [logoReady, setLogoReady] = useState(false); // added state

//   useEffect(() => {
//     const fetchNextBillNo = async () => {
//       try {
//         const response = await getBillno();
//         setBillNo(response.data.bill_no);
//       } catch (error) {
//         console.error("Error fetching bill number:", error);
//       }
//     };

//     const fetchLogoUrl = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/masterlogobill");
//         const logoUrl = response.data.logo;

//         if (logoUrl) {
//           const imageBlobResponse = await axios.get(logoUrl, {
//             responseType: "blob",
//           });

//           const reader = new FileReader();
//           reader.onloadend = () => {
//             setFetchedLogoUrl(reader.result);
//           };
//           reader.onerror = (error) => {
//             console.error("Base64 conversion error:", error);
//           };
//           reader.readAsDataURL(imageBlobResponse.data);
//         } else {
//           console.error("Error: 'logo' key not found in response");
//         }
//       } catch (error) {
//         console.error("Error fetching logo URL:", error);
//       }
//     };

//     fetchNextBillNo();
//     fetchLogoUrl();
//   }, []);

//   const handleImageLoad = () => {
//     setLogoReady(true);
//     if (onLogoReady) onLogoReady(true); // notify parent (optional)
//   };

//   return (
//     <div className="border-t border-r border-l border-gray-800">
//       {/* Top Section */}
//       <div className="border border-black w-full p-4 flex items-start">
//         {/* Left Section */}
//         <div className="w-2/3 pr-4 border-r border-black">
//           {/* Header Section */}
//           <div className="flex items-center space-x-4 border-b pb-2">
//             {fetchedLogoUrl && (
//               <img
//                 src={fetchedLogoUrl}
//                 className="w-[20%]"
//                 alt="Company Logo"
//                 onLoad={handleImageLoad} // added load handler
//               />
//             )}
//             <div>
//               <h1 className="text-2xl font-bold text-red-600">
//                 {companyName?.user?.information?.business_name || "N/A"}
//               </h1>
//             </div>
//           </div>

//           {/* Company Address */}
//           <div className="mt-4">
//             <p className="text-sm font-bold">
//               Address:{" "}
//               <span className="font-normal text-gray-900">
//                 {companyName?.user?.information?.address_1 || "N/A"},{" "}
//                 {companyName?.user?.information?.pincode || "N/A"},{" "}
//                 {companyName?.user?.information?.state || "N/A"},{" "}
//                 {companyName?.user?.information?.country || "N/A"}
//               </span>
//             </p>

//             <div className="mt-2 space-y-1">
//               <p className="text-sm">
//                 <span className="font-bold">Mobile:</span>{" "}
//                 <span className="text-gray-900">
//                   {companyName?.user?.information?.mobile_number || "N/A"}
//                 </span>
//               </p>
//               <p className="text-sm">
//                 <span className="font-bold">GSTIN:</span>{" "}
//                 <span className="text-gray-900">
//                   {companyName?.user?.information?.gst || "N/A"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="w-1/3 pl-4 mt-10 text-sm space-y-2">
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Invoice No.</span>
//             <span className="text-gray-900">{data?.billno || "-"}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">BIS No.</span>
//             <span className="text-gray-900">{bisNumber || "-"}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Bill No:</span>
//             <span className="text-gray-900">
//               {data?.billcountnumber || "-"}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Invoice Date</span>
//             <span className="text-gray-900">{data?.date || "-"}</span>
//           </div>
//         </div>
//       </div>

//       {/* Middle Section */}
//       <div>
//         <div className="grid grid-cols-1 gap-4">
//           <div className="border-r border-gray-800 p-4">
//             <p className="font-bold">BILL TO:</p>
//             {data.users.customers.map((customer) => (
//               <div key={customer.id}>
//                 <p className="text-sm">
//                   <span className="font-bold">Name:</span> {data.users.name}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-bold">Phone:</span>{" "}
//                   {customer.phone || "N/A"}
//                 </p>
//                 <p className="text-sm font-bold">
//                   Address:{" "}
//                   <span className="font-normal text-gray-700">
//                     {customer?.address || "N/A"},{" "}
//                     {customer?.pincode || "N/A"},{" "}
//                     {customer?.state || "N/A"},{" "}
//                     {customer?.country || "N/A"}
//                   </span>
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceHeader;


// cruurent goin for jewellery
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { getBillno } from "@/app/components/config";

const InvoiceHeader = ({ bisNumber, data, logoUrl, companyName }) => {
  const [billNo, setBillNo] = useState("");
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");
  const [fetchcoverimage, setcoverImage] = useState("");

  //token
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

  //cover image
  const coverimagefetch = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/cover/upload",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API Response:", response.data);

      const logoUrl = response?.data?.data?.cover;
      if (logoUrl) {
        console.log("Fetched Logo URL:", logoUrl);
        setcoverImage(logoUrl);
      } else {
        console.error("Error: 'logo' key not found in response");
      }
    } catch (error) {
      console.error("Error fetching logo URL:", error);
    }
  };

  useEffect(() => {
    console.log(" companyName", companyName);
    const fetchNextBillNo = async () => {
      try {
        const response = await getBillno();
        console.log(response.data);
        setBillNo(response.data.bill_no);
      } catch (error) {
        console.error("Error fetching bill number:", error);
      }
    };

    const fetchLogoUrl = async () => {
      const token = getToken();
      console.log("masterlogobill token check", token);
      if (!token) {
        notifyTokenMissing();
        return;
      }
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/masterlogobill",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API Response:", response);

        const logoUrl = response.data.logo;
        if (logoUrl) {
          console.log("Fetched Logo URL:", logoUrl);
          setFetchedLogoUrl(logoUrl);
        } else {
          console.error("Error: 'logo' key not found in response");
        }
      } catch (error) {
        console.error("Error fetching logo URL:", error);
      }
    };

    fetchNextBillNo();
    fetchLogoUrl();
    coverimagefetch();
  }, []);

  console.log("aaa", data);
  console.log(" companyName", companyName);

  return (
    <div className="border-t border-r border-l w-full border-gray-800 ">
      {/* {
        fetchedLogoUrl==null &&( */}
          <div className="bg-red-200 w-full h-[100px]  overflow-hidden">
        <img
          src={fetchcoverimage}
          alt="Cover image Logo"
          // className="w-full h-[20px] object-contain"
          className="w-full h-[100px] object-cover"
        />
      </div>

        {/* )
      } */}
      
      {/* Top Section */}
      <div className="border border-black w-full p-4 flex items-start">
        {/* Left Section */}

        <div className="w-2/3 pr-4 border-r border-black">
          {/* Header Section */}
          <div className="flex items-center space-x-4 border-b pb-2">
            {/* <img src={fetchedLogoUrl} className="w-[20%]" alt="Company Logo" /> */}
            {/* <img src={fetchedLogoUrl} className=" w-[40px] h-[40px] rounded-sm" alt="Company Logo" /> */}
            {
              fetchedLogoUrl!==null &&(
                <img
              src={fetchedLogoUrl}
              alt="Company Logo"
              className="logo-img w-32 h-auto"
            />
              )
            }
            <div>
              <h1 className="text-2xl font-bold text-red-600">
                {companyName?.user?.information?.business_name || "N/A"}
              </h1>
            </div>
          </div>

          {/* Customer Details */}
          {/* {data.users.customers.map((customer) => ( */}
          <div className="mt-4">
            {/* Address Section */}
            <p className="text-sm font-bold">
              Address:{" "}
              <span className="font-normal text-gray-900">
                {companyName?.user?.information?.address_1 || "N/A"},{" "}
                {companyName?.user?.information?.pincode || "N/A"},{" "}
                {companyName?.user?.information?.state || "N/A"},{" "}
                {companyName?.user?.information?.country || "N/A"}
              </span>
            </p>

            {/* Additional Info */}
            <div className="mt-2 space-y-1">
              <p className="text-sm ">
                <span className="font-bold"> Mobile:</span>{" "}
                <span className=" text-gray-900 ">
                  {companyName?.user?.information?.mobile_number || "N/A"}
                </span>
              </p>
              <p className="text-sm">
                <span className=" font-bold">GSTIN:</span>{" "}
                <span className=" text-gray-900 ">
                  {companyName?.user?.information?.gst || "N/A"}
                </span>
              </p>
            </div>
          </div>
          {/* ))} */}
        </div>

        {/* Right Section */}
        <div className="w-1/3 pl-4 mt-10 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Invoice No.</span>
            <span className="text-gray-900">{data?.billno || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-gray-700">BIS No.</span>
            <span className="text-gray-900">{bisNumber || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Bill No:</span>
            <span className="text-gray-900">
              {data?.billcountnumber || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Invoice Date</span>
            <span className="text-gray-900">{data?.date || "-"}</span>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className=" ">
        {/* <div className=" grid grid-cols-4 gap-6 border-b border-gray-800 p-4">
          <p className="text-sm">
            Invoice No: <span className="font-semibold">{data?.billno}</span>
          </p>
          <p className="text-sm">
            Invoice Date: <span className="font-semibold">{data.date}</span>
          </p>
          <p className="text-sm">
            BIS No: <span className="font-semibold">HM/C-5190067012</span>
          </p>
          <p className="text-sm">
            Gold Rate: <span className="font-semibold">₹8000.00</span>
          </p>
        </div> */}

        <div className="grid grid-cols-1 gap-4">
          {/* Bill To Section */}
          <div className="border-r border-gray-800 p-4">
            <p className="font-bold">BILL TO:</p>
            {data.users.customers.map((customer) => (
              <div key={customer.id}>
                <p className="text-sm">
                  <span className=" font-bold">Name:</span> {data.users.name}
                </p>
                {/* <p className="text-sm">Address: {customer.address || "N/A"}</p> */}
                <p className="text-sm">
                  <span className=" font-bold">Phone:</span>{" "}
                  {customer.phone || "N/A"}
                </p>
                {/* <p className="text-sm">GSTIN: {customer.gstin || "N/A"}</p> */}
                <p className="text-sm font-bold">
                  Address:{" "}
                  <span className="font-normal text-gray-700">
                    {customer?.address || "N/A"}, {customer?.pincode || "N/A"},{" "}
                    {customer?.state || "N/A"}, {customer?.country || "N/A"}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Ship To Section */}
          {/* <div className="p-4">
            <p className="font-bold">SHIP TO:</p>
            {data.users.customers.map((customer) => (
              <div key={customer.id}>
                <p className="text-sm">Address: {customer.address || "N/A"}</p>
                <p className="text-sm">Pincode: {customer.pincode || "N/A"}</p>
                <p className="text-sm">State: {customer.state || "N/A"}</p>
                <p className="text-sm">Country: {customer.country || "N/A"}</p>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;