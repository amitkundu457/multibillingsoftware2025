"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {getMembershipplan,createMembershipplan,updateMembershipplan} from "../../../components/config"

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      const { data } = await getMembershipplan();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Open Modal for Create/Edit
  const openModal = (plan = null) => {
    setEditingPlan(plan);
    reset(plan || {});
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    reset();
  };

  // Handle Form Submit (Create or Edit)
  const onSubmit = async (data) => {
    try {
      if (editingPlan) {
       
        await  updateMembershipplan(editingPlan.id,data);
      } else {
        await createMembershipplan(data);
      }
      fetchPlans();
      closeModal();
    } catch (error) {
      console.error("Error saving plan", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(` http://127.0.0.1:8000/api/membership-plans/${id}`);
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
    <div className="flex justify-between">
    <h2 className="text-2xl font-bold mb-4">Membership Plans</h2>
      <button
        className="mb-4 bg-[#16A34A] text-white px-4 py-2 rounded "
        onClick={() => openModal()}
      >
        + 
      </button>
    </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="text-lg font-semibold">{plan.name} (₹{plan.fees})</p>
              <p className="text-sm text-gray-600">{plan.validity} months | {plan.discount}% discount</p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => openModal(plan)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(plan.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-2">{editingPlan ? "Edit Membership" : "Create Membership"}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register("name", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Code</label>
                <input
                  {...register("code", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Fees (₹)</label>
                <input
                  type="number"
                  {...register("fees", { required: true, min: 0 })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Validity (Months)</label>
                <input
                  type="number"
                  {...register("validity", { required: true, min: 1 })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Discount (%)</label>
                <input
                  type="number"
                  {...register("discount", { required: true, min: 0, max: 100 })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Remark</label>
                <textarea
                  {...register("remark")}
                  className="w-full border px-3 py-2 rounded"
                />
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
                  {editingPlan ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
