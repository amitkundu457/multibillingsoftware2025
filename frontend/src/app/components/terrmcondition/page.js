'use client';
import React, { useEffect, useState } from 'react'
import Navbar from "../../ui/NavBar";
import FooterSection  from "../../ui/Fotter";
import axios from 'axios';

const Page = () => {
    const[terms ,setTerms] = useState([]);
    useEffect(()=>{
        axios.get('https://api.equi.co.in/api/terms-condition').then((response)=>{
            console.log(response.data);
            
            setTerms(response.data);

        })

    },[]);
  return (
    <div>
        <Navbar/>
        <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      {Array.isArray(terms) && terms.length > 0 ? (
        <div className="space-y-6">
          {terms.map((term) => (
            <div key={term.id} className="p-4 border rounded-lg shadow-md">
              {/* <h2 className="text-xl font-semibold mb-2">{term.name}</h2> */}
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: term.description }} // Render HTML safely
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No terms and conditions available.</p>
      )}
    </div>


        <FooterSection/>
    </div>
  )
}

export default Page