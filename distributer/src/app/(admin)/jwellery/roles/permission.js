import React from "react";

const PermissionsTable = ({ permissions, selectedPermissions, handlePermissionChange }) => {
    return (
        <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Permissions</h3>
            <div className="overflow-auto">
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Permission</th>
                            <th className="p-2 border">Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map((permission) => (
                            <tr key={permission.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{permission.name}</td>
                                <td className="p-2 border text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions[permission.name] || false}
                                        onChange={() => handlePermissionChange(permission.name)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PermissionsTable;
