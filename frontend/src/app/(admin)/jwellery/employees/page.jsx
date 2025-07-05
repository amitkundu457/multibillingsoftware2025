

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = getCookie("access_token");
    const res = await axios.get("https://api.equi.co.in/api/employees",
      {
        headers: { Authorization: `Bearer ${token}` },
      }

    );
    setEmployees(res.data.employees);
  };

  const onSubmit = async (data) => {
    console.log("employed update data",data);
    const token = getCookie("access_token");



    const formattedData = {
      ...data,
      phone: String(data.phone), // Convert phone to string
      address: String(data.address), // Convert address to string
      joining_date: data.joining_date ? data.joining_date : "", // Ensure it's a valid date
      dob: data.dob ? data.dob : "", // Ensure it's a valid date
      gender: data.gender || "", // Ensure it's a string value (male, female, other)
    };




    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (currentEmployee) {
        console.log("currentEmployeec",currentEmployee)
        await axios.post(
          `https://api.equi.co.in/api/employees/${currentEmployee.id}`,
          data,
          config
        );
        toast.success("Data updated successfully!");
      } else {
        await axios.post("https://api.equi.co.in/api/employees", formattedData, config);
        toast.success("Data created successfully!");
      }

      setModalOpen(false);
      setCurrentEmployee(null);
      fetchEmployees();
      reset();
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const errors = error.response.data.errors;
        Object.values(errors).forEach((err) => toast.error(err[0]));
      } else {
        toast.error("An unexpected error occurred!");
      }
    }
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    reset({
      name: employee.name || "",
      email: employee.email || "",
      password: "",
      phone: employee.employees?.phone || "",
      address: employee.employees?.address || "",
      joining_date: employee.employees?.joining_date || "",
      dob: employee.employees?.dob || "",
      gender: employee.employees?.gender || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://api.equi.co.in/api/employees/${id}`);
    toast.success("Data deleted successfully!");
    fetchEmployees();
  };

  return (
    <div className="p-4">
      <ToastContainer />
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
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="border px-4 py-2">{employee.name}</td>
              <td className="border px-4 py-2">{employee.email}</td>
              <td className="border px-4 py-2">{employee.employees?.phone}</td>
              <td className="border px-4 py-2">
                {employee.employees?.address}
              </td>
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

      <Modal
        classNames="rounded-md"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        center
      >
        <h2 className="text-lg font-bold mb-4">
          {currentEmployee ? "Edit Employee" : "Add Employee"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full border px-3 py-2 rounded"
          />

          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full border px-3 py-2 rounded"
          />

          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full border px-3 py-2 rounded"
            // required
          />

          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            placeholder="Phone"
            {...register("phone")}
            className="w-full border px-3 py-2 rounded"
          />

          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            placeholder="Address"
            {...register("address")}
            className="w-full border px-3 py-2 rounded"
          />

          <label className="block text-sm font-medium text-gray-700">
            Joining Date
          </label>
          <input
            type="date"
            {...register("joining_date")}
            className="w-full border px-3 py-2 rounded"
          />

          <label className="block text-sm font-medium text-gray-700">DOB</label>
          <input
            type="date"
            {...register("dob")}
            className="w-full border px-3 py-2 rounded"
          />

          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            {...register("gender")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Choose Gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

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
