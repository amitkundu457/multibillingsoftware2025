"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/employees");
    setEmployees(res.data.employees);
  };

  const onSubmit = async (data) => {
    if (currentEmployee) {
      // Update existing employee
      await axios.post(
        `http://127.0.0.1:8000/api/employees/${currentEmployee.id}`,
        data
      );
    } else {
      // Create new employee
      await axios.post("http://127.0.0.1:8000/api/employees", data);
    }
    setModalOpen(false);
    setCurrentEmployee(null);
    fetchEmployees();
    reset();
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    reset({
      name: employee.name || "",
      email: employee.email || "",
      password: "",
      phone: employee.phone || "",
      address: employee.address || "",
      joining_date: employee.joining_date || "",
      dob: employee.dob || "",
      gender: employee.gender || "",
      department: employee.department || "",
      designation: employee.designation || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/employees/delete/${id}`);
    fetchEmployees();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Sales Person</h1>
        <button
          onClick={() => {
            setCurrentEmployee(null);
            reset();
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Employee
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="border px-4 py-2">{employee.user_id}</td>
              <td className="border px-4 py-2">{employee.phone}</td>
              <td className="border px-4 py-2">{employee.address}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(employee)}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} center>
        <h2 className="text-lg font-bold mb-4">
          {currentEmployee ? "Edit Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Phone"
            {...register("phone")}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            {...register("address")}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="date"
            {...register("joining_date")}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="date"
            {...register("dob")}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Gender"
            {...register("gender")}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Department"
            {...register("department")}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Designation"
            {...register("designation")}
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
