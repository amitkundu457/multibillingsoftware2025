"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { 
  getMembershipGroup, 
  createMembershipGroup, 
  updateMembershipGroup, 
  deleteMembershipGroup 
} from "../../../components/config";

export default function MembershipPlansGroup() {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchGroups = async () => {
    try {
      const { data } = await getMembershipGroup();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const openModal = (group = null) => {
    setEditingGroup(group);
    reset(group || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (!data.name) {
      toast.error("Name field is required!");
      return;
    }
  
    const saveGroup = async () => {
      if (editingGroup) {
        return await updateMembershipGroup(editingGroup.id, data);
      } else {
        return await createMembershipGroup(data);
      }
    };
  
    toast.promise(
        
      saveGroup(),
      {
        pending: "Saving...",
        success: "Membership group saved successfully!",
        error: "Error saving group. Try again!",
      }
    ).then(() => {
      fetchGroups(); // Refresh the list after saving
      closeModal(); // Close modal after successful save
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteMembershipGroup(id);
      toast.success("Membership group deleted successfully!");
      fetchGroups();
    } catch (error) {
      toast.error("Error deleting group");
      console.error("Error deleting group", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4"> Service Groups</h2>
        <button
          className="mb-4 bg-[#16A34A] text-white px-4 py-2 rounded"
          onClick={() => openModal()}
        >
          + Add Group
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="text-lg font-semibold">{group.name}</p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => openModal(group)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(group.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-2">
              {editingGroup ? "Edit Membership Group" : "Create Membership Group"}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register("name", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.name && <p className="text-red-500 text-sm">Name is required!</p>}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingGroup ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
