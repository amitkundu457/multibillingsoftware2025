'use client';

import React, { useEffect, useState } from 'react';
import { FaUsers, FaTruck } from "react-icons/fa";
import axios from 'axios';

const AdminDashboard = () => {
    const[distCount,setDistCount] = useState([]);
    const[clientCount,setCleintCount] = useState([]);


    useEffect(()=>{
        // fetch distributer count

        axios.get(' http://127.0.0.1:8000/api/distrubuters/count').then((response)=>{
            setDistCount(response.data);

           

        }).catch((error)=>{
            alert("failed to load distributer count");
            console.log(error);
            

        })

         //fetch client count
         axios.get(' http://127.0.0.1:8000/api/user-infos/count').then((response)=>{
            setCleintCount(response.data);

                
         }).catch((error)=>{
            alert("failed to fetch clients Data");
            console.log(error);
            

         })



    },[])
  return (
    <div className="flex justify-start gap-6 p-6">
      {/* Total Clients Card */}
      <div className="border border-blue-300 bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-2xl shadow-xl h-56 w-72 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <FaUsers className="text-white h-10 w-10" /> {/* Client Icon */}
          <h1 className="text-lg font-semibold text-white">Total Clients</h1>
        </div>
        <p className="text-4xl font-extrabold text-white">{clientCount}</p>
      </div>

      {/* Total Distributors Card */}
      <div className="border border-green-300 bg-gradient-to-r from-green-500 to-teal-600 p-8 rounded-2xl shadow-xl h-56 w-72 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <FaTruck className="text-white h-10 w-10" /> {/* Distributor Icon */}
          <h1 className="text-lg font-semibold text-white">Total Distributors</h1>
        </div>
        <p className="text-4xl font-extrabold text-white">{distCount}</p>
      </div>
    </div>
  
  
  
  )
}

export default AdminDashboard;