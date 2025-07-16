"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateRoleModal from "./createModal";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null); // Role to edit

  // Fetch roles from backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get(" https://api.equi.co.in/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Delete a role
  const handleDelete = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      await axios.delete(` https://api.equi.co.in/api/roles/${roleId}`);
      alert("Role deleted successfully!");
      fetchRoles(); // Refresh roles after deletion
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("An error occurred while deleting the role.");
    }
  };

  // Open modal for editing
  const handleEdit = (role) => {
    setEditingRole(role);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Roles Management</h2>
        <button
          onClick={() => {
            setEditingRole(null); // Reset editing role
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create New Role
        </button>
      </div>

      {/* Roles Table */}
      <div className="overflow-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Role Name</th>
              <th className="p-2 border">Permissions</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{role.name}</td>
                  <td className="p-2 border">
                    {role.permissions.map((perm) => (
                      <span
                        key={perm.id}
                        className="bg-teal-200 text-teal-800 rounded-full px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-teal-300"
                      >
                        {perm.name}
                      </span>
                    ))}
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-2 text-center">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Role Modal */}
      {isModalOpen && (
        <CreateRoleModal
          isOpen={isModalOpen}
          closeModal={() => setModalOpen(false)}
          fetchRoles={fetchRoles}
          editingRole={editingRole}
        />
      )}
    </div>
  );
};

export default Roles;
