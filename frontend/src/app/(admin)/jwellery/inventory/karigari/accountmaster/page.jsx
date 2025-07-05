// "use client";
// import React, { useEffect, useState } from "react";
// import { FaPlus } from "react-icons/fa";
// import AccountForm from "./model";
// import { FaPrint } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { FaEdit } from "react-icons/fa";

// import axios from "axios";

// const Page = () => {

//   const [data, setData] = useState([]);
//   const [modelState, setModelState] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);


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


// const token = getToken();
//     if (!token) {
//       notifyTokenMissing();
//       return;
//     }





//     useEffect(() => {
      
//       fetchData();
//     }, []);
//     const fetchData = async () => {
//       const token = getToken();
  
//       if (!token) {
//         notifyTokenMissing();
//         return;
//       }
  
//       try {
//         const response = await axios.get(
//           "https://api.equi.co.in/api/account-masters",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setData(response.data);
//       } catch (error) {
//         console.error("Failed to fetch account masters:", error);
//         // Optionally: show error to user
//       }
//     };
  
    

//   const closeModel = () => {
//     setModelState(false);
//   };

//   const handleEdit = (item) => {
//     setModelState(true);
//     setSelectedItem(item);
//   };

//   const handleDeleteData = (id) => {
//     axios
//       .delete(`https://api.equi.co.in/api/account-masters/${id}`)
//       .then(() => {
//         fetchData();
//         alert("data deleted  Succesfully");
//         setData(data.filter((item) => item.id !== id));
//       })
//       .catch("Failed to delete data");
//   };

//   return (
//     <div>
//       <header className="bg-green-600 h-8 w-full flex justify-center items-center text-white">
//         Account Entries
//       </header>

//       <table className="mt-8 w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 px-4 py-2">Sr No:</th>
//             <th className="border border-gray-300 px-4 py-2">Account Name</th>
//             <th className="border border-gray-300 px-4 py-2">GST IN</th>
//             <th className="border border-gray-300 px-4 py-2">Phone</th>
//             <th className="border border-gray-300 px-4 py-2">
//               Account Group ID
//             </th>
//             <th className="border border-gray-300 px-4 py-2">State</th>
//             <th className="border border-gray-300 px-4 py-2">City</th>
//             <th className="border border-gray-300 px-4 py-2">Contact Person</th>
//             <th className="border border-gray-300 px-4 py-2">Balance</th>
//             <th className="border border-gray-300 px-4 py-2">Status</th>
//             <th className="border border-gray-300 px-4 py-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr
//               key={index}
//               className={`${
//                 index % 2 === 0 ? "bg-white" : "bg-gray-50"
//               } hover:bg-gray-200`}
//             >
//               <td className="border border-gray-300 px-4 py-2">{index+1}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {item.account_name}
//               </td>
//               <td className="border border-gray-300 px-4 py-2">{item.gstin}</td>
//               <td className="border border-gray-300 px-4 py-2">{item.phone}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {item.account_group_id}
//               </td>
//               <td className="border border-gray-300 px-4 py-2">{item.city}</td>
//               <td className="border border-gray-300 px-4 py-2">{item.state}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {item.contact_person}
//               </td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {item.blance}
//               </td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {item.status}
//               </td>
//               <td className="flex border border-gray-300 px-4 py-4 justify-between">
//                 <button>
//                   <FaEdit
//                     className="text-xl"
//                     onClick={() => handleEdit(item)}
//                   />
//                 </button>
//                 <button>
//                   <MdDelete
//                     className="text-2xl"
//                     onClick={() => handleDeleteData(item.id)}
//                   />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button
//         onClick={() => setModelState(true)}
//         className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
//       >
//         <FaPlus />
//       </button>

//       {modelState && (
//         <AccountForm closeModel={closeModel}  fetchData={ fetchData()} selectedItem={selectedItem} />
//       )}
//     </div>
//   );
// };

// export default Page;

"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaPrint, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import AccountForm from "./model";

const Page = () => {
  const [data, setData] = useState([]);
  const [modelState, setModelState] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }

    try {
      const response = await axios.get("https://api.equi.co.in/api/account-masters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch account masters:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closeModel = () => {
    setModelState(false);
    setSelectedItem(null);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModelState(true);
  };

  const handleDeleteData = async (id) => {
    try {
      await axios.delete(`https://api.equi.co.in/api/account-masters/${id}`);
      alert("Data deleted successfully");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete data:", error);
    }
  };

  return (
    <div>
      <header className="bg-green-600 h-8 w-full flex justify-center items-center text-white">
        Account Entries
      </header>

      <table className="mt-8 w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {[
              "Sr No",
              "Account Name",
              "GST IN",
              "Phone",
              // "Account Group ID",
              "State",
              "City",
              "Contact Person",
              "Balance",
              "Status",
              "Action",
            ].map((heading, idx) => (
              <th key={idx} className="border border-gray-300 px-4 py-2">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-200`}
            >
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{item.account_name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.gstin}</td>
              <td className="border border-gray-300 px-4 py-2">{item.phone}</td>
              {/* <td className="border border-gray-300 px-4 py-2">{item.account_group_id}</td> */}
              <td className="border border-gray-300 px-4 py-2">{item.state}</td>
              <td className="border border-gray-300 px-4 py-2">{item.city}</td>
              <td className="border border-gray-300 px-4 py-2">{item.contact_person}</td>
              <td className="border border-gray-300 px-4 py-2">{item.blance}</td>
              <td className="border border-gray-300 px-4 py-2">{item.status}</td>
              <td className="flex border border-gray-300 px-4 py-2 justify-around">
                <button onClick={() => handleEdit(item)}>
                  <FaEdit className="text-xl text-blue-600 hover:text-blue-800" />
                </button>
                <button onClick={() => handleDeleteData(item.id)}>
                  <MdDelete className="text-2xl text-red-600 hover:text-red-800" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => setModelState(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        <FaPlus />
      </button>

      {modelState && (
        <AccountForm
          closeModel={closeModel}
          fetchData={fetchData}
          selectedItem={selectedItem}
        />
      )}
    </div>
  );
};

export default Page;
