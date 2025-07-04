 "use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
  

 

export const Model = ({ onClose, onSave }) => {
  const [inputData, setInputData] = useState({name:""});

  const handleData = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getCookie("access_token");
    

    console.log(token);
    
    axios
      .post(
        "http://127.0.0.1:8000/api/customerstypes",
        inputData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
            "Content-Type": "application/json", // Ensure the content type is JSON
          },
        }
      )
      .then((response) => {
        console.log(response);
        onSave(); 
        alert("added data!!")// Trigger onSave callback to close the modal
      })
      .catch((error) => {
        console.log("Error:", error);
        alert("Failed to save data");
      });
  };
  

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Add User</h2>
        <input
          name="name"
          type="text"
          value={inputData.fname}
          onChange={handleData}
          placeholder="Customer type"
          className="w-full p-2 border rounded-md mb-4"
        />
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};




 
const Page = () => {
  const [showModel, setShowModel] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/customerstypes')
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        alert("Failed to fetch data");
      });
  }, []);

  const onClose = () => {
    setShowModel(false);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {/* Button to trigger the modal */}
        <button
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md"
          onClick={() => setShowModel(true)}
        >
          <FaPlus className="inline mr-2" /> Add User
        </button>

        {/* Table to display data */}
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded-md">
                    <FaUserEdit />
                  </button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded-md">
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModel && <Model onClose={onClose} />}
    </>
  );
};

export default Page;
