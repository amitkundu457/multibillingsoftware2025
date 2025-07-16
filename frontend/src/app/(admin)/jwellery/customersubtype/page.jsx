"use client";

import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus, FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

export const Model = ({ onClose, onSave, editData }) => {
  const [inputData, setInputData] = useState(
    editData || { name: "", type_id: "" }
  );

  const [customerType, setCustomerType] = useState([]);

  //fetch customer type data
const featchcustomber=async()=>{
    const token = getCookie("access_token");

  const newdata=await axios.get("https://api.equi.co.in/api/customerstype",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  ).then((response) => {
//     console.log(response.data?.data);
// const data=Array.isArray(response.data?.data) ? response.data : [response.data?.data];
    setCustomerType(response.data?.data);
  });
  console.log("newdata",newdata)

}

  useEffect(() => {
    featchcustomber();
  }, []);

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

    const apiCall = editData
      ? axios.post(
          ` https://api.equi.co.in/api/customersubtypes/${editData.id}`,
          inputData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      : axios.post(" https://api.equi.co.in/api/customersubtypes", inputData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

    apiCall
      .then((response) => {
        console.log("Success:", response);
        onSave();
        alert(editData ? "Data updated!" : "Data added!");
      })
      .catch((error) => {
        console.error("Error:", error.response || error.message);
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
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit  CustomerSub Type" : "Add CustomerSub Type"}
        </h2>
        <input
          name="name"
          type="text"
          value={inputData.name}
          onChange={handleData}
          placeholder="CustomerSub type"
          className="w-full p-2 border rounded-md mb-4"
        />

        <label htmlFor="type_id">Select Customer Type:</label>
        <select
          id="type_id"
          name="type_id"
          onChange={handleData}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="">select customer type</option>
          {customerType.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

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
  const [type, setCustomerSubTypeData] = useState([]);
  const [editData, setEditData] = useState(null);

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








  const fetchData = () => {
    const token = getToken();
    if (!token) {
      notifyTokenMissing();
      return;
    }
    axios
      .get(" https://api.equi.co.in/api/customersubtypes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }

      )
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        alert("Failed to fetch data");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      .split("=")[1];

    axios
      .delete(` https://api.equi.co.in/api/customersubtypes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Data deleted!");
        fetchData();
      })
      .catch(() => {
        alert("Failed to delete data");
      });
  };

  const onClose = () => {
    setShowModel(false);
    setEditData(null);
  };

  const onSave = () => {
    fetchData();
    onClose();
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {/* Button to trigger the modal */}
        <button
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md"
          onClick={() => setShowModel(true)}
        >
          <FaPlus className="inline mr-2" /> Add Customer Subtype
        </button>

        {/* Table to display data */}
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Customer Type
              </th>
              {/* <th className="px-4 py-2 text-left font-semibold text-gray-700">Type ID</th> */}
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.customer_type.name}</td>
                {/* <td className="px-4 py-2">{item.type_id}</td> */}
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded-md"
                    onClick={() => {
                      setEditData(item);
                      setShowModel(true);
                    }}
                  >
                    <FaUserEdit />
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                    onClick={() => handleDelete(item.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModel && (
        <Model onClose={onClose} onSave={onSave} editData={editData} />
      )}
    </>
  );
};

export default Page;
