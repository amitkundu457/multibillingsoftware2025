export default function DeleteModal({ data, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-4 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl font-bold">Delete Product</h2>
        <p>Are you sure you want to delete &quot;{data.name}&quot;?</p>
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
