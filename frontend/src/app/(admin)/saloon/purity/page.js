"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";

const Page = () => {
  const [name, setName] = useState("");
  const [purity, setPurity] = useState([]);
  const [editId, setEditId] = useState(null); // Store ID of the item being edited

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





  const fetchPurity = async () => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}

    const response = await axios.get(" https://api.equi.co.in/api/purity",
      {
        headers: { Authorization: `Bearer ${token}` },
      }

    );
    console.log(response);

    setPurity(response.data);
    if (response.status !== 200) {
      alert("failed to fetch purity");
    }
  };

  useEffect(() => {
    fetchPurity();
  }, []);

  const handlePostPurity = async () => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}

    const response = await axios.post( "https://api.equi.co.in/api/purity",
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response);
    if (response.status === 201) {
        setName("");
        

      alert(response.data.message);

      fetchPurity();
    } else {
      alert("Purity not  store!!");
    }
  };


  const handleDeletePurity = async  (id)=>{
    const response = await axios.delete(` https://api.equi.co.in/api/purity/${id}`);
    console.log(response);
    if(response.status===200){
        alert(response.data.message);
        fetchPurity();
    }
    else{
        alert("failed to delete data");

    }
}


 


  const handleEditPurity = (pur) => {
    setName(pur.name);  // Set input field with current purity name
    setEditId(pur.id);  // Store ID for updating
  };
  
  const handleUpdatePurity = async () => {
    if (!editId) return; // Prevent updating if no ID is set
  
    try {
      const response = await axios.post(` https://api.equi.co.in/api/purity/${editId}`, {
        name,
      });
  
      if (response.status === 200) {
        console.log(response);
        
        alert(response.data.message);
        setName("");  // Clear input field
        setEditId(null); // Reset edit mode
        fetchPurity(); // Refresh the list
      } else {
        alert("Failed to update purity");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Error updating purity");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full flex flex-col items-center">
    {/* Title */}
    <h1 className="text-xl font-bold text-gray-800 mb-4">Add Purity</h1>
  
    {/* Input Field */}
    <div className="w-full">
      <input
      value={name}
        placeholder="Enter purity"
        onChange={(e) => setName(e.target.value)}
        name="purity"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    {/* Buttons */}
    <div className="mt-4 w-full flex justify-center gap-4">
      <button
        onClick={editId ? handleUpdatePurity : handlePostPurity}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md"
      >
        {editId ? "Update Purity" : "Add Purity"}
      </button>
    </div>
  
    {/* Table for Displaying Purity Data */}
    <div className="mt-6 w-full overflow-auto">
      <table className="w-full border-collapse border overflow-y-auto border-gray-300 text-center rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Edit</th>
            <th className="border border-gray-300 px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {purity.map((pur) => (
            <tr className="hover:bg-gray-50  overflow-y-auto transition" key={pur.id}>
              <td className="border border-gray-300 px-4 py-2">{pur.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                 onClick={() => handleEditPurity(pur)}
                className="text-blue-500 hover:text-blue-700">
                  <MdEdit />
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="text-red-500 hover:text-red-700" onClick={()=>{handleDeletePurity(pur.id)}}>
                  <FaDeleteLeft />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default Page;
