// components/DeleteModal.js
export default function DeleteModal({ data, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="p-6 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Delete Confirmation</h2>
        <p>Are you sure you want to delete {data.product_id}?</p>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 mr-2 text-white bg-gray-500 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-red-500 rounded"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
