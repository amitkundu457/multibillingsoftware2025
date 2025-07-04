"use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

export const Model = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close the modal when the background is clicked
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-xl font-bold mb-4">Add Group</h2>
        <input
          type="text"
          placeholder="Group name"
          className="w-full p-2 border rounded-md mb-4"
        />
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            onClick={onClose} // Close the modal when "Cancel" is clicked
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const AccountForm = ({ closeModel, selectedItem }) => {
  const [showModel, setShowModel] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [accountmasterdata, setaccountmasterdata] = useState({
    account_name: "",
    gstin: "",
    phone: "",
    account_group_id: "",
    city: "",
    state: "",
    contact_person: "",
    blance: "",
    status: false,
  });

  useEffect(() => {
    if (selectedItem) {
      setaccountmasterdata(selectedItem);
    }

   
  }, [selectedItem]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/customerstypes")
      .then((response) => {
        setCustomer(response.data);
      })
      .catch(() => {
        alert("failed to load customer name");
      });
  }, []);

  const handleData = (e) => {
    setaccountmasterdata({
      ...accountmasterdata,
      [e.target.name]: e.target.value,
    });
  };

  const submitAccountData = () => {
    if (selectedItem) {
      axios
        .put(
          `http://127.0.0.1:8000/api/account-masters/${selectedItem.id}`,
          accountmasterdata
        )
        .then(() => {
          alert("data updated succesfully");
          closeModel();
        })
        .catch(() => {
          alert("Failed to update data, try again");
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/account-masters", accountmasterdata)
        .then(() => {
          alert("Data submitted successfully!");
          setaccountmasterdata({
            account_name: "",
            gstin: "",
            phone: "",
            account_group_id: "",
            city: "",
            state: "",
            contact_person: "",
            blance: "",
            status: false,
          });
        })
        .catch(() => alert("Failed to submit data, try again"));
    }
  };
  const cancelFormModel = () => {
    closeModel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-green-600 p-4">
          <button className="text-white">
            <FaArrowLeft className="text-2xl" />
          </button>
          <h2 className="text-white text-lg font-semibold">Account Master</h2>
          <button onClick={cancelFormModel} className="text-white">
            <ImCross className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="account_name"
              value={accountmasterdata.account_name}
              onChange={handleData}
              type="text"
              placeholder="Account Name"
              className="border border-gray-300 p-2 rounded w-full"
            />
            <select
              name="account_group_id"
              value={accountmasterdata.account_group_id}
              onChange={handleData}
              className="border border-gray-300 p-2 rounded w-full"
            >
              <option value="" disabled>
                Select Group
              </option>
              {customer.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
            </select>

            <input
              name="gstin"
              value={accountmasterdata.gstin}
              onChange={handleData}
              type="text"
              placeholder="GSTIN"
              className="border border-gray-300 p-2 rounded w-full"
            />
            <input
              name="phone"
              value={accountmasterdata.phone}
              onChange={handleData}
              type="text"
              placeholder="Phone No"
              className="border border-gray-300 p-2 rounded w-full"
            />
            <select
              name="city"
              value={accountmasterdata.city}
              onChange={handleData}
              className="border border-gray-300 p-2 rounded w-full"
            >
              <option value="">Select City</option>
              <option value="kolkata">Kolkata</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="pune">Pune</option>
            </select>
            <input
              name="state"
              value={accountmasterdata.state}
              onChange={handleData}
              type="text"
              placeholder="State"
              className="border border-gray-300 p-2 rounded w-full"
            />
            <input
              name="contact_person"
              value={accountmasterdata.contact_person}
              onChange={handleData}
              type="text"
              placeholder="Contact Person"
              className="border border-gray-300 p-2 rounded w-full"
            />
            <input
              name="blance"
              value={accountmasterdata.blance}
              onChange={handleData}
              type="text"
              placeholder="Balance"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          <div className="mt-4 flex items-center">
            <label className="mr-2 text-gray-700">Is Active?</label>
            <input
              name="status"
              type="checkbox"
              checked={accountmasterdata.status}
              onChange={() =>
                setaccountmasterdata({
                  ...accountmasterdata,
                  status: !accountmasterdata.status,
                })
              }
              className="form-checkbox h-5 w-5 text-green-600"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={submitAccountData}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
