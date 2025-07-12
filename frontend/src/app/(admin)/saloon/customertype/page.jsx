"use client";
import React, { useEffect, useState } from "react";
import { FaPlus, FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

export const Model = ({ onClose, onSave }) => {
  const [inputData, setInputData] = useState({ name: "" });

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

    axios
      .post("http://127.0.0.1:8000/api/customerstype", inputData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        onSave(); // Trigger onSave callback
        alert("Data added successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
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
        <h2 className="text-xl font-bold mb-4">Add Customer Type</h2>
        <input
          name="name"
          type="text"
          value={inputData.name}
          onChange={handleData}
          placeholder="Customer Type"
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
  const [EditModelShow ,setEditModelShow]=useState(false)
  const [data, setData] = useState([]);
  const[editId ,setEditId]=useState();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const fetchData = () => {
   
    const token = getCookie("access_token");

    axios
      .get(" http://127.0.0.1:8000/api/customerstype",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onClose = () => {
    setShowModel(false);
    fetchData(); // Refresh data after closing the modal
  };

  const onCloseEdit = () => {
    setEditModelShow(false);
    fetchData(); // Refresh data after closing the modal
  };

  const handleEdit = (id) => {
    console.log("Edit ID:", id);
    setEditId(id)
    setEditModelShow(true)
    // Implement edit logic here  customerstype/{id}

    // console.log("id for Edit", id);
    // if (window.confirm("Are you sure you want to  Edit this record?")) {
    //   const token = getCookie("access_token");

    //   axios
    //     .post(`http://127.0.0.1:8000/api/customerstype/${id}`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then(() => {
    //       alert("Record  Edit successfully");
    //       fetchData(); // Refresh data after deletion
    //     })
    //     .catch((error) => {
    //       console.error("Error  Edit record:", error);
    //       alert("Failed to  Edit record");
    //     });
    // }
  };

  const handleDelete = (id) => {
    console.log("id for delete", id);
    if (window.confirm("Are you sure you want to delete this record?")) {
      const token = getCookie("access_token");

      axios
        .delete(` http://127.0.0.1:8000/api/customerstype/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert("Record deleted successfully");
          fetchData(); // Refresh data after deletion
        })
        .catch((error) => {
          console.error("Error deleting record:", error);
          alert("Failed to delete record");
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md"
        onClick={() => setShowModel(true)}
      >
        <FaPlus className="inline mr-2" /> Add Customer Type
      </button>

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Name
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded-md"
                    aria-label={`Edit ${item.name}`}
                  >
                    <FaUserEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                    aria-label={`Delete ${item.name}`}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="px-4 py-2 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModel && <Model onClose={onClose} onSave={onClose} />}
      {EditModelShow && <EditModel  onClose={onCloseEdit} onSave={onCloseEdit} id={editId} />}
    </div>
  );
};

export default Page;




// Edit Model types 


export const EditModel = ({ onClose, onSave, id ,selectedItem }) => {
  const [inputData, setInputData] = useState({ name: selectedItem?.name || "" });

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
    console.log("edit_id",id)
    console.log("input data",inputData)

    axios
      .post(`http://127.0.0.1:8000/api/customerstype/${id}`, inputData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        onSave();
        alert("Data updated successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update data");
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit Customer Type</h2>
        <input
          name="name"
          type="text"
          value={inputData.name}
          onChange={handleData}
          placeholder="Customer Type"
          className="w-full p-2 border rounded-md mb-4"
        />
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md" onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};
