import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import RoleNameInput from "./RoleNameInput";
import PermissionsTable from "./permission";
import ModalHeader from "./ModalHeader";

const RoleModal = ({ isOpen, closeModal, editingRole }) => {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});

  // Fetch permissions when the modal opens
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/permission"
        );
        const permissionsData = response.data;

        // Initialize permissions state
        const initialPermissions = permissionsData.reduce((acc, permission) => {
          acc[permission.name] = false;
          return acc;
        }, {});

        setPermissions(permissionsData);
        setSelectedPermissions(initialPermissions);

        // If editing, fetch the role's details
        if (editingRole) {
          setRoleName(editingRole.name); // Set the role name directly from the editingRole prop
          const preselectedPermissions = { ...initialPermissions };
          editingRole.permissions.forEach((perm) => {
            preselectedPermissions[perm.name] = true;
          });
          setSelectedPermissions(preselectedPermissions);
        } else {
          setRoleName(""); // Reset role name if no editing
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isOpen) fetchPermissions();
  }, [isOpen, editingRole]);

  const handlePermissionChange = (permissionName) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionName]: !prev[permissionName],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName) {
      alert("Role Name is required!");
      return;
    }

    const selectedPermissionsArray = Object.keys(selectedPermissions).filter(
      (permissionName) => selectedPermissions[permissionName]
    );

    const roleData = {
      name: roleName,
      permissions: selectedPermissionsArray,
    };

    try {
      if (editingRole) {
        // Update existing role
        await axios.post(
          `http://127.0.0.1:8000/api/roles/${editingRole.id}`,
          roleData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        alert("Role updated successfully!");
      } else {
        // Create new role
        await axios.post("http://127.0.0.1:8000/api/roles", roleData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        alert("Role created successfully!");
      }

      setRoleName("");
      setSelectedPermissions({});
      closeModal(); // Close the modal
    } catch (error) {
      console.error("Error saving role:", error);
      alert("An error occurred while saving the role.");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      center
      classNames={{
        overlay: "customOverlay",
        modal: "customModal",
        closeButton: "customCloseButton",
      }}
    >
      <div className="mx-auto">
        <ModalHeader editingRole={editingRole} />
        <RoleNameInput roleName={roleName} setRoleName={setRoleName} />
        <PermissionsTable
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          handlePermissionChange={handlePermissionChange}
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editingRole ? "Update Role" : "Create Role"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RoleModal;
