"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import CreateEditModal from "./createModel";
import DeleteModal from "./deleteModel";
import {
  getSaleproduct,
  creategetSaleproduct,
  deletegetSaleproduct,
  updategetSaleproduct,
} from "@/app/components/config";
// const apiUrl = " https://api.equi.co.in/api"; // Replace with your API URL

export default function SaleProducts() {
  const [products, setProducts] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getSaleproduct();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEdit = async (data) => {
    try {
      if (data.id) {
        // Update
        const response = await updategetSaleproduct(data.id, data);
        setProducts((prev) =>
          prev.map((item) => (item.id === data.id ? response.data : item))
        );
      } else {
        // Create
        const response = await creategetSaleproduct(data);
        setProducts((prev) => [...prev, response.data]);
      }
      setShowCreateEditModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletegetSaleproduct(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">Sale Products</h1>
        <button
          className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
          onClick={() => {
            setModalData(null);
            setShowCreateEditModal(true);
          }}
        >
          Add Product
        </button>
      </div>

      <table className="w-full border border-collapse border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-2 border">{product.id}</td>
              <td className="px-4 py-2 border">{product.name}</td>
              <td className="px-4 py-2 border">${product.amount}</td>
              <td className="px-4 py-2 border">
                <button
                  className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded"
                  onClick={() => {
                    setModalData(product);
                    setShowCreateEditModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 text-white bg-red-500 rounded"
                  onClick={() => {
                    setModalData(product);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateEditModal && (
        <CreateEditModal
          data={modalData}
          onClose={() => setShowCreateEditModal(false)}
          onSave={handleCreateEdit}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          data={modalData}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => handleDelete(modalData.id)}
        />
      )}
    </div>
  );
}
