"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXls } from "react-icons/bs";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";

const ReviewListPage = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true); // ⬅️ Loading state

  //token
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const token = getCookie("access_token");
  if (!token) {
    console.log("token not found");
    // return <p className="text-red-500 p-4">Authentication token not found!</p>;
  }

  async function removeComplain(id) {
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;
    console.log("id remove", id);

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/complain-list/${id}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      console.log("Deleted successfully:", response.data);
      fetchData(); // this should be defined in outer scope
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/complain-list",
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      console.log("response", response.data);
      setData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const lowerQuery = searchQuery.toLowerCase();
    const itemDate = new Date(item.complain_created_at);
    const itemDateOnly = new Date(
      itemDate.getFullYear(),
      itemDate.getMonth(),
      itemDate.getDate()
    );

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const isInDateRange =
      (!start || itemDateOnly >= start) && (!end || itemDateOnly <= end);

    return (
      isInDateRange &&
      (item.complain_username?.toLowerCase().includes(lowerQuery) ||
        item.complain_email?.toLowerCase().includes(lowerQuery) ||
        item.complain_comment?.toLowerCase().includes(lowerQuery))
    );
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Complainer Name",
      "Complainer Email",
      "Complainer Details",
      "Rating",
      "Complainer Date",
    ];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const row = [
        index + 1,
        item.complain_username || "",
        item.complain_email || "",
        item.complain_comment || "",
        item.complain_rating || "",
        item.complain_created_at
          ? format(new Date(item.complain_created_at), "dd-MM-yyyy")
          : "",
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });

    doc.save("ComplaintsReport.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        "S.No": index + 1,
        "Complainer Name": item.complain_username || "",
        "Complainer Email": item.complain_email || "",
        "Complainer Details": item.complain_comment || "",
        Rating: item.complain_rating || "",
        "Complainer Date": item.complain_created_at
          ? format(new Date(item.complain_created_at), "dd-MM-yyyy")
          : "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ComplaintsReport");
    XLSX.writeFile(workbook, "ComplaintsReport.xlsx");
  };

  return (
    <div className="mt-6 ">
      {/* Header */}
      <div className="flex space-x-7 bg-gray-200 py-6 px-8 rounded-lg shadow-md">
        <p className="font-bold text-2xl text-gray-800">Complain List</p>
        <div>
          <button
            onClick={downloadPDF}
            className="mr-5 text-4xl text-red-500 hover:scale-110 transition"
          >
            <FaFilePdf />
          </button>
          <button
            onClick={downloadExcel}
            className="mr-5 text-4xl text-green-500 hover:scale-110 transition"
          >
            <BsFiletypeXls />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex items-center space-x-6 shadow-lg bg-white p-4 rounded-lg">
        <input
          type="date"
          className="w-56 h-12 border border-gray-300 rounded-lg text-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="w-56 h-12 border border-gray-300 rounded-lg text-lg"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600"
          onClick={() => {}}
        >
          Search
        </button>
        <button
          className="bg-red-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-red-600"
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
        >
          Reset
        </button>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by name, email, or complaint details..."
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table or Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-4 text-gray-600 text-lg">Loading data...</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full  text-left bg-white rounded-lg shadow-lg">
            <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-poppins">
              <tr>
                <th className="py-3 px-4 border-b">S.No</th>
                <th className="py-3 px-4 border-b">Complainer Name.</th>
                {/* <th className="py-3 px-4 border-b">Complainer Phone</th> */}
                <th className="py-3 px-4 border-b">Complainer Email</th>
                <th className="py-3 px-4 border-b">Complainer Details</th>
                <th className="py-3 px-4 border-b">Rating</th>
                <th className="py-3 px-4 border-b">Complainer Date</th>
                <th className="py-3 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{index + 1}</td>
                  <td className="py-3 px-4 border-b">
                    {item.complain_username}
                  </td>
                  <td className="py-3 px-4 border-b">{item.complain_email}</td>
                  <td className="py-3 px-4 border-b">
                    {item.complain_comment}
                  </td>
                  <td className="py-3 px-4 border-b">{item.complain_rating}</td>

                  <td className="py-3 px-4 border-b">
                    {item.complain_created_at
                      ? format(new Date(item.complain_created_at), "dd-MM-yyyy")
                      : ""}
                  </td>
                  <td>
                    <span
                      className="p-2 px-3 bg-cover h-[12px]  w-[30px] text-center rounded-md items-center border-b bg-red-700   text-white cursor-pointer hover:bg-red-800"
                      onClick={() => removeComplain(item.id)}
                    >
                      {" "}
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewListPage;
