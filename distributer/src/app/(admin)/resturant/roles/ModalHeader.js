import React from "react";

const ModalHeader = ({ editingRole }) => {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-semibold">
                {editingRole ? "Edit Role" : "Create New Role"}
            </h2>
        </div>
    );
};

export default ModalHeader;
