

// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getBillno } from "@/app/components/config";

// const InvoiceHeader = ({ bisNumber, data, logoUrl, companyName }) => {
//   const [billNo, setBillNo] = useState("");
//   const [fetchedLogoUrl, setFetchedLogoUrl] = useState("");
//   const [fetchcoverimage, setcoverImage] = useState("");

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

//   const coverimagefetch = async () => {
//     const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }
//     try {
//       const response = await axios.get("https://api.equi.co.in/api/cover/upload", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const logoUrl = response?.data?.data?.cover;
//       if (logoUrl) {
//         setcoverImage(logoUrl);
//       } else {
//         console.error("Error: 'cover' key not found in response");
//       }
//     } catch (error) {
//       console.error("Error fetching cover image:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchNextBillNo = async () => {
//       try {
//         const response = await getBillno();
//         setBillNo(response?.data?.bill_no || "");
//       } catch (error) {
//         console.error("Error fetching bill number:", error);
//       }
//     };

//     const fetchLogoUrl = async () => {
//       const token = getToken();
//       if (!token) {
//         notifyTokenMissing();
//         return;
//       }
//       try {
//         const response = await axios.get("https://api.equi.co.in/api/masterlogobill", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const logoUrl = response?.data?.logo;
//         if (logoUrl) {
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

//   return (
//     <div className="border-t border-r border-l w-full border-gray-800">
//       {/* Top Banner Image */}
//       <div className="bg-red-200 w-full h-[100px] overflow-hidden">
//         <img
//           src={fetchcoverimage || ""}
//           alt="Cover image Logo"
//           className="w-full h-[100px] object-cover"
//         />
//       </div>

//       {/* Header Section */}
//       <div className="border border-black w-full p-4 flex items-start">
//         {/* Left Side - Company Info */}
//         <div className="w-2/3 pr-4 border-r border-black">
//           <div className="flex items-center space-x-4 border-b pb-2">
//             {fetchedLogoUrl && (
//               <img src={fetchedLogoUrl} alt="Company Logo" className="w-32 h-auto" />
//             )}
//             <div>
//               <h1 className="text-2xl font-bold text-red-600">
//                 {companyName?.user?.information?.business_name || "N/A"}
//               </h1>
//             </div>
//           </div>

//           {/* Address & Contact Info */}
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
//                 {companyName?.user?.information?.mobile_number || "N/A"}
//               </p>
//               <p className="text-sm">
//                 <span className="font-bold">GSTIN:</span>{" "}
//                 {companyName?.user?.information?.gst || "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Invoice Info */}
//         <div className="w-1/3 pl-4 mt-10 text-sm space-y-2">
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Invoice No.</span>
//             <span className="text-gray-900">{data?.billno || "N/A"}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">BIS No.</span>
//             <span className="text-gray-900">{bisNumber || "N/A"}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Bill No:</span>
//             <span className="text-gray-900">{data?.billcountnumber || "N/A"}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-bold text-gray-700">Invoice Date</span>
//             <span className="text-gray-900">{data?.date || "N/A"}</span>
//           </div>
//         </div>
//       </div>

//       {/* Middle Section - Customer Info */}
//       <div>
//         <div className="grid grid-cols-1 gap-4">
//           <div className="border-r border-gray-800 p-4">
//             <p className="font-bold">BILL TO:</p>
//             {data?.users?.customers?.map((customer) => (
//               <div key={customer?.id}>
//                 <p className="text-sm">
//                   <span className="font-bold">Name:</span>{" "}
//                   {data?.users?.name || "N/A"}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-bold">Phone:</span>{" "}
//                   {customer?.phone || "N/A"}
//                 </p>
//                 <p className="text-sm font-bold">
//                   Address:{" "}
//                   <span className="font-normal text-gray-700">
//                     {customer?.address || "N/A"}, {customer?.pincode || "N/A"},{" "}
//                     {customer?.state || "N/A"}, {customer?.country || "N/A"}
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
        "https://api.equi.co.in/api/cover/upload",
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
          "https://api.equi.co.in/api/masterlogobill",
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
          {/* <div className="bg-red-200 w-full h-[100px]  overflow-hidden">
        <img
          src={fetchcoverimage}
          alt="Cover image Logo"
          // className="w-full h-[20px] object-contain"
          className="w-full h-[100px] object-cover"
        />
      </div> */}

        {/* )
      } */}
      
      {/* Top Section */}
      <div className="border border-black w-full p-4 flex items-start">
        {/* Left Section */}

        <div className="w-2/3 pr-4 border-r border-black">
          {/* Header Section */}
          

         
          <div className="mt-4">
            {/* Address Section */}
            <div>
              <h1 className="text-xl font-bold text-red-600">
                {companyName?.user?.information?.business_name || "N/A"}
              </h1>
            </div>
            <p className="text-sm ">
              Address:{" "}
              <span className="font-normal text-gray-900">
                {companyName?.user?.information?.address_1 || "N/A"},{" "}
                {companyName?.user?.information?.pincode || "N/A"},{" "}
                {companyName?.user?.information?.state || "N/A"},{" "}
                {companyName?.user?.information?.country || "N/A"}
              </span>
            </p>

            {/* Additional Info */}
            <div className="mt-[0.5] space-y-1">
              <p className="text-sm ">
                <span className=""> Mobile:</span>{" "}
                <span className=" text-gray-900 ">
                  {companyName?.user?.information?.mobile_number || "N/A"}
                </span>
              </p>
              <p className="text-sm">
                <span className="">GSTIN:</span>{" "}
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
          <div className=" flex  justify-evenly  gap-5">
          <div className="flex flex-col ">
            <span className="font-bold text-gray-700">Invoice No.</span>
            <span className="text-gray-900">{data?.billno || "-"}</span>
          </div>

        

          <div className="flex flex-col">
            <span className="font-bold text-gray-700">Invoice Date</span>
            <span className="text-gray-900">{data?.date || "-"}</span>
          </div>
        </div>
          </div>
      </div>

      {/* Middle Section */}
      <div className=" ">
       

        <div className="grid grid-cols-1 gap-4">
          {/* Bill To Section */}
          <div className=" border-r border-l border-gray-800 p-4">
            <p className="font-bold">BILL TO:</p>
            {data.users.customers.map((customer) => (
              <div key={customer.id}>
                <p className="text-sm">
                  <span className=" font-bold">{data.users.name}</span> 
                </p>
                {/* <p className="text-sm">Address: {customer.address || "N/A"}</p> */}
                <p className="text-sm">
                  <span className="">Phone:</span>{" "}
                  {customer.phone || "N/A"}
                </p>
                {/* <p className="text-sm">GSTIN: {customer.gstin || "N/A"}</p> */}
                <p className="text-sm ">
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