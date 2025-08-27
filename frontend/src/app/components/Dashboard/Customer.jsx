import { useEffect, useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import axios from "axios";
import Link from 'next/link';
import useSWR from "swr";
 
export default function Customer({ label }) {
    const [customerCounts, setCustomerCounts] = useState({
    total: 0,
    walkIn: 0,
    qr: 0,
    socialMedia: 0,
  });

   const {
    data: user,
    isLoading,
    mutate,
  } = useSWR(`/auth/agme`, async () => {
    let res = await axios.get("/auth/agme", {
      headers: { Authorization: `Bearer ${cookies.access_token}` },
    });
    return res.data;
  });

  
  const roleToUrlMap = {
    admin: "admin",
    jwellery: "jwellery",
    distributor: "distributor",
    resturant: "resturant",
    saloon: "saloon",
  };

  const productUrl = roleToUrlMap[!isLoading && user?.roles?.[0]?.name] || "";
  console.log("pruddcturl2",productUrl);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/customer-visit-sources")
      .then((response) => {
        setCustomerCounts(response.data);
      })
      .catch((error) => console.error("Error fetching customer data:", error));
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-yellow-500 text-2xl">
            <BsPeopleFill />
          </div>
          <h2 className="text-lg font-semibold ml-2">
            {label ? label : "Customer"}
          </h2>
        </div>
        <div className="text-orange-600 text-3xl font-bold">
          {customerCounts.total}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-4 border-2 border-blue-500 rounded-lg p-10">
        <div >
          <Link href={`/${productUrl}/reports/customerreport`}  className="cursor-pointer  " > 
             <h3 className="text-sm text-gray-500 hover:text-green-500" >Walk-in</h3>
          <p className="text-purple-600 text-lg font-bold">
            {customerCounts.walkIn}
          </p>

          </Link>
         
        </div>
        <div>
          <Link href={`/${productUrl}/reports/customerreport`}  className="cursor-pointer  ">
          <h3 className="text-sm text-gray-500 hover:text-green-500">QR</h3>
          <p className="text-blue-600 text-lg font-bold">
            {customerCounts.qr}
          </p>
          </Link>
          
        </div>
        <div>
          <Link  href={`/${productUrl}/reports/customerreport`}  className="cursor-pointer  ">
           <h3 className="text-sm text-gray-500 hover:text-green-500">Social Media</h3>
          <p className="text-teal-600 text-lg font-bold">
            {customerCounts.socialMedia}
          </p>
          </Link>
         
        </div>
      </div>
    </div>
  );
}
