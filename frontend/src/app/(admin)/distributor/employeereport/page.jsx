"use client"

import { useState } from "react";

const EmployeeFilter = () => {
  // Sample Data
  const employeeData = [
    { id: 1, name: "John Doe", date: "2024-01-10", commission: 150 },
    { id: 2, name: "Jane Smith", date: "2024-01-15", commission: 200 },
    { id: 3, name: "Alice Brown", date: "2024-01-20", commission: 250 },
  ];

  // State Variables
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [filteredData, setFilteredData] = useState(employeeData);

  // Filter Logic
  const filterData = () => {
    const filtered = employeeData.filter((employee) => {
      const employeeDate = new Date(employee.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesDate =
        (!start || employeeDate >= start) && (!end || employeeDate <= end);

      const matchesName = employeeName
        ? employee.name.toLowerCase().includes(employeeName.toLowerCase())
        : true;

      return matchesDate && matchesName;
    });
    setFilteredData(filtered);
  };

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Filter</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block font-medium mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        {/* Employee Name */}
        <div>
          <label htmlFor="employeeName" className="block font-medium mb-1">
            Employee Name
          </label>
          <input
            type="text"
            id="employeeName"
            placeholder="Search by name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Button */}
      <div className="mb-6">
        <button
          onClick={filterData}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
        >
          Apply Filter
        </button>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Date</th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Commission
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-4 py-2 border border-gray-300">
                    {employee.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {employee.date}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${employee.commission}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-2 text-center text-gray-500 border border-gray-300"
                >
                  No matching data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeFilter;
