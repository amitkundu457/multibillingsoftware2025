"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import ReactSelect from "react-select";

import { getAssigndistributer } from "../../../components/config";

const Client = () => {
  const [users, setUsers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    const fetchClients = async () => {
      const response = await getAssigndistributer();
      //   const data = await response.json();
      console.log(response.data);
      setUsers(response.data || []);
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchDistributors = async () => {
      const response = await fetch(
        " https://api.equi.co.in/api/distributors/search"
      );
      const data = await response.json();
      setDistributors(data.data);
    };
    fetchDistributors();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        " https://api.equi.co.in/api/assign-client",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        alert("Client assigned to distributor successfully!");
        reset(); // Reset form state
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error assigning client:", error);
      alert("An error occurred while assigning the client.");
    } finally {
      setModalOpen(false); // Close modal
    }
  };

  return (
    <div>
      <div className="grid place-items-center bg-[#04A24C] text-white p-3">
        Assign Client
      </div>
      <table className="table-auto w-full border-collapse border border-[#F0B171]">
        <thead className="bg-[#F0B171]">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Mobile</th>
            <th className="border px-4 py-2">Product</th>
          </tr>
        </thead>
        <tbody>
          {users.length !== 0 &&
            users?.map((user, index) => (
              <tr key={user.id}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>{" "}
                {/* Serial number */}
                <td className="border px-4 py-2 text-center">{user.cname}</td>
                <td className="border px-4 py-2 text-center">{user.cemail}</td>
                <td className="border px-4 py-2 text-center">
                  {user.mobile_number}
                </td>
                <td className="border px-4 py-2 text-center">
                  {user.pname ?? "N/A"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* <Modal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  center
  classNames={{
    overlay: "customOverlay",
    modal: "customModal",
  }}
>
  <div className="p-4">
    <h2 className="text-xl font-bold mb-4">Assign Distributor</h2>
    {selectedClient && (
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>
          Assigning <strong>{selectedClient.first_name} {selectedClient.last_name}</strong> to a distributor.
        </p>
        <input
          type="text"
          {...register("client_id", { required: true })}
          hidden
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Distributor:
          </label>
          <ReactSelect
            options={distributors.map((dist) => ({
              value: dist.id,
              label: `${dist.user.name} (${dist.phone})`,
            }))}
            placeholder="Select a distributor"
            onChange={(selectedOption) =>
              setValue("distributor_id", selectedOption ? selectedOption.value : "")
            }
            className="mb-4"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Assign
        </button>
      </form>
    )}
  </div>
</Modal> */}
    </div>
  );
};

export default Client;
