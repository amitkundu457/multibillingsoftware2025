import React from "react";

const RoleNameInput = ({ roleName, setRoleName }) => {
    return (
        <div className="mb-4">
            <label htmlFor="roleName" className="block text-sm font-medium mb-2">
                Role Name
            </label>
            <input
                type="text"
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter Role Name"
                className="w-full border rounded p-2"
            />
        </div>
    );
};

export default RoleNameInput;
