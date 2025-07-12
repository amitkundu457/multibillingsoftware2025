'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import the React Icons
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TermsConditionPage = () => {
  const [termsConditions, setTermsConditions] = useState([]); // Array to store terms data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
  const [isEditMode, setIsEditMode] = useState(false); // If editing an existing term or adding a new one
  const [modalData, setModalData] = useState({ name: "", description: "" }); // Modal form data

  // Fetch all terms conditions from API
  const fetchTermsConditions = async () => {
    try {
      const response = await axios.get(" http://127.0.0.1:8000/api/terms-condition");
      setTermsConditions(response.data); // Assuming the data is under the 'data' key
    } catch (error) {
      console.error("Error fetching terms conditions:", error);
    }
  };

  useEffect(() => {
    fetchTermsConditions(); // Fetch terms conditions on component mount
  }, []);

  // Open modal for adding or editing term
  const openModal = (data = {}) => {
    setModalData({ name: "", description: "" }); // Reset modal data to empty strings
    setModalData(data); // Set modal data to the existing term if editing
    setIsEditMode(!!data.id); // Check if editing an existing term
    setIsModalOpen(true);
  };

  // Save term (either create or update)
  const handleSaveTerm = async () => {
    if (isEditMode && termsConditions.length==1 ) {
      // Update existing term
      try {
        await axios.put(` http://127.0.0.1:8000/api/terms-condition/${modalData.id}`, modalData);
        fetchTermsConditions();
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error updating term:", error);
      }
    } else  if(termsConditions.length==0){
      // Create new term
      try {
        await axios.post(" http://127.0.0.1:8000/api/terms-condition", modalData);
        fetchTermsConditions();
        setIsModalOpen(false);
      } catch (error) {
       
        console.error("Error adding term:", error);
      }
    }
     
     
  };

  // Delete term
  const handleDeleteTerm = async (id) => {
    try {
      await axios.delete(` http://127.0.0.1:8000/api/terms-condition/${id}`);
      fetchTermsConditions();
    } catch (error) {
      console.error("Error deleting term:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
     
      {termsConditions.length === 0 ? (
      <button
        onClick={() => openModal()}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add Term
      </button>
    ) : null}

      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(termsConditions) && termsConditions.length > 0 ? (
            termsConditions.map((term) => (
              <tr key={term.id} className="border-b">
                <td className="px-4 py-2">{term.name}</td>
                <td
                  className="px-4 py-2"
                  dangerouslySetInnerHTML={{ __html: term.description }} // Safely render HTML
                />
                <td className="px-4 py-2">
                  <button
                    onClick={() => openModal(term)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTerm(term.id)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No terms available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[768px] h-128">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Term" : "Add Term"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Term Name</label>
              <input
                type="text"
                placeholder="Enter Term Name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <div className="w-full max-w-4xl h-[400px] overflow-y-auto">
              <CKEditor
                editor={ClassicEditor}
                data={modalData.description}
                onReady={(editor) => {
                    // Apply inline styles if needed
                    editor.ui.view.editable.element.style.minHeight = "300px"; // Height in pixels
                    editor.ui.view.editable.element.style.width = "100%"; // Full width
                  }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setModalData({ ...modalData, description: data });
                }}
              />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSaveTerm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsConditionPage;
