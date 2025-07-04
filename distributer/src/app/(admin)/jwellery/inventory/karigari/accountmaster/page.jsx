"use client";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AccountForm from "./model";
import { FaPrint } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import axios from "axios";

const Page = () => {
  const [data, setData] = useState([]);
  const [modelState, setModelState] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/account-masters").then((response) => {
      setData(response.data);
    });
  }, []);

  const closeModel = () => {
    setModelState(false);
  };

  const handleEdit = (item) => {
    setModelState(true);
    setSelectedItem(item);
  };

  const handleDeleteData = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/account-masters/${id}`)
      .then(() => {
        alert("data deleted  Succesfully");
        setData(data.filter((item) => item.id !== id));
      })
      .catch("Failed to delete data");
  };

  return (
    <div>
      <header className="bg-green-600 h-8 w-full flex justify-center items-center text-white">
        Account Entries
      </header>

      <table className="mt-8 w-full border-collapse border border-gray-300">
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2">ID</th>
          <th className="border border-gray-300 px-4 py-2">Account Name</th>
          <th className="border border-gray-300 px-4 py-2">GST IN</th>
          <th className="border border-gray-300 px-4 py-2">Phone</th>
          <th className="border border-gray-300 px-4 py-2">Account Group ID</th>
          <th className="border border-gray-300 px-4 py-2">State</th>
          <th className="border border-gray-300 px-4 py-2">City</th>
          <th className="border border-gray-300 px-4 py-2">Contact Person</th>
          <th className="border border-gray-300 px-4 py-2">Balance</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>

        {data.map((item, index) => {
          return (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-200`}
            >
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.account_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.gstin}</td>
              <td className="border border-gray-300 px-4 py-2">{item.phone}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.account_group_id}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.city}</td>
              <td className="border border-gray-300 px-4 py-2">{item.state}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.contact_person}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.blance}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.status}
              </td>
              <td className=" flex border border-gray-300 px-4 py-4 justify-between">
                <buttom>
                  <FaEdit
                    className="text-xl"
                    onClick={() => handleEdit(item)}
                  />
                </buttom>
                <buttom>
                  <MdDelete
                    className="text-2xl"
                    onClick={() => handleDeleteData(item.id)}
                  />
                </buttom>
              </td>
            </tr>
          );
        })}
      </table>

      <button
        onClick={() => setModelState(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        <FaPlus />
      </button>

      {modelState && (
        <AccountForm closeModel={closeModel} selectedItem={selectedItem} />
      )}
    </div>
  );
};

export default Page;
