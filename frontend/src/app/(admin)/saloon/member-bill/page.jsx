"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Modal from "react-responsive-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";
import Membershipbill from "./index";
import { FaPrint } from "react-icons/fa";
export default function MembershipSaleForm() {
  const [selectedSale, setSelectedSale] = useState(null);
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };
  const token = getCookie("access_token");
  const { register, handleSubmit, setValue, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [sales, setSales] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchPlans();
    fetchStylists();
    fetchSales();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = getCookie("access_token"); // Retrieve token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      };

      const { data } = await axios.get(
        " http://127.0.0.1:8000/api/customers",
        config
      );
      setCustomers(data);
    } catch (error) {
      notyf.error("Error fetching customers!");
      console.error("Error fetching customers:", error);
    }
  };

  const fetchPlans = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    };

    try {
      const { data } = await axios.get(
        " http://127.0.0.1:8000/api/membership-plans",
        config
      );
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const fetchStylists = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    };
    try {
      const { data } = await axios.get(" http://127.0.0.1:8000/api/stylists",config);
      setStylists(data);
    } catch (error) {
      console.error("Error fetching stylists:", error);
    }
  };

  const fetchSales = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    };
    try {
      const { data } = await axios.get(
        " http://127.0.0.1:8000/api/membership-sales",config
      );
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const handlePlanChange = (event) => {
    const planId = event.target.value;
    const selectedPlan = plans.find((plan) => plan.id == planId);
    setValue("amount", selectedPlan ? selectedPlan.fees : 0);
  };

  const onSubmit = async (formData) => {
    try {
      if (editId) {
        console.log("submit edit time",formData)
        await axios.put(
          ` http://127.0.0.1:8000/api/membership-sales/${editId}`,
          formData
        );
        toast.success("Membership Plan Updated!");
      } else {
        await axios.post(
          " http://127.0.0.1:8000/api/membership-sales",
          formData, {
            headers: { Authorization: `Bearer ${token}` },
          }
    
        );
        toast.success("Membership Plan Sold Successfully!");
      }
      reset();
      setEditId(null);
      setModalIsOpen(false);
      fetchSales();
    } catch (error) {
      toast.error("Error processing sale");
      console.error("Error:", error);
    }
  };

  const handleEdit = (sale) => {
    console.log("sales edit",sale)
    setEditId(sale.id);
    setValue("customer_id", sale.customer_id);
    setValue("plan_id", sale.plan_id);
    setValue("stylist_id", sale.stylist_id);
    setValue("payment_method", sale.payment_method);
    setValue("amount", sale.amount);
    setValue("sale_date", sale.sale_date);
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      try {
        await axios.delete(` http://127.0.0.1:8000/api/membership-sales/${id}`);
        toast.success("Membership Plan Deleted!");
        fetchSales();
      } catch (error) {
        toast.error("Error deleting sale");
        console.error("Error:", error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Membership Plan Sale
      </h2>

      <button
        onClick={() => {
          reset();
          setEditId(null);
          setModalIsOpen(true);
        }}
        className="mb-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
      >
        + New Sale
      </button>

      {/* Sales List */}
      <h3 className="text-lg font-semibold text-gray-700 mt-6">Sales List</h3>
      <ul className="mt-4 space-y-2">
        {sales.map((sale) => (
          <li
            onClick={() => setSelectedSale(sale)}
            key={sale.id}
            className="p-3 bg-gray-100 rounded-md flex justify-between"
          >
            <span>
              {sale.customer?.name || "No Customer"} -
              {sale.plan?.name || "No Plan"} -
              {sale.plan?.validity
                ? `${sale.plan.validity} days`
                : "No Validity"}
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() => handleEdit(sale)}
                className="text-blue-500 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(sale.id)}
                className="text-red-500"
              >
                Delete
              </button>
              <button className="text-red-500">
                <FaPrint />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Creating & Editing */}
      <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)} center>
        <h2 className="text-lg font-semibold text-gray-700">
          {editId ? "Edit Membership Plan" : "New Membership Plan"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Customer</label>
            <select
              {...register("customer_id")}
              className="w-full border-gray-300 rounded-lg p-2 mt-1"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Sale Date</label>
            <input
              type="date"
              {...register("sale_date")}
              className="w-full border-gray-300 rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Membership Plan</label>
            <select
              {...register("plan_id")}
              onChange={handlePlanChange}
              className="w-full border-gray-300 rounded-lg p-2 mt-1"
              required
            >
              <option value="">Select Plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - ${p.fees}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Stylist</label>
            <select
              {...register("stylist_id")}
              className="w-full border-gray-300 rounded-lg p-2 mt-1"
              required
            >
              <option value="">Select Stylist</option>
              {stylists.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Amount ($)</label>
            <input
              type="text"
              {...register("amount")}
              className="w-full border-gray-300 rounded-lg p-2 mt-1"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-700">Payment Method</label>
            <select
              {...register("payment_method")}
              className="w-full border-gray-300 rounded-lg p-2 mt-1"
              required
            >
              <option value="0">Cash</option>
              <option value="1">Card</option>
              <option value="2">UPI</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {editId
              ? "Update Membership Plan"
              : "Generate Membership Plan Invoice"}
          </button>
        </form>
      </Modal>

      {selectedSale && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <Membershipbill selectedSale={selectedSale} />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setSelectedSale(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
