"use client";
import { useEffect, useState } from "react";
import CreateEditModal from "./CreateEditModal";
import DeleteModal from "./DeleteModal";
import {
  getSalesServices,
  createSalesServices,
  updateSalesServices,
  deleteSalesServices,
  getemployees,
  getSaleproduct
} from "@/app/components/config";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [saleproduct, setsaleProduct] = useState([]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchEmployee();
    fetchSaleProducts();
  }, []);

    const fetchProducts = async () => {
    try {
      setLoading(true);
      const response =await getSalesServices();
    //   const response =await getSalesServices();
    //   alert(response.data)
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployee=async ()=>{
    try {
        const response = await getemployees();
        
        setEmployees(response.data.employees);
    }catch (error){
        console.error("Error fetching employee:", error);
    }
  }

   const fetchSaleProducts=async ()=>{
    try {
        const response = await getSaleproduct();
        
        setsaleProduct(response.data);
    }catch (error){
        console.error("Error fetching employee:", error);
    }
  }


  const handleCreateEdit = async (data) => {
    try {
      if (data.id) {
        // Update existing product
        const response = await updateSalesServices(data.id, data);
        setProducts((prev) =>
          prev.map((item) => (item.id === data.id ? response.data : item))
        );
        fetchProducts();
      } else {
        // Create new product
        const response = await createSalesServices(data);
        setProducts((prev) => [...prev, response.data]);
        fetchProducts();
      }
      setShowCreateEditModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSalesServices(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-4 mx-auto">
   <div className="flex justify-between">
       <h1 className="mb-4 text-2xl font-bold">Sales Assign</h1>
      <button
        className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
        onClick={() => {
          setModalData(null);
          setShowCreateEditModal(true);
        }}
      >
        Add Sales assign
      </button>
   </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">User</th>
            <th className="px-4 py-2 border">Product</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Country</th>
            <th className="px-4 py-2 border">State</th>
            <th className="px-4 py-2 border">City</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-2 border">{product.id}</td>
              <td className="px-4 py-2 border">{product.user_id}</td>
              <td className="px-4 py-2 border">{product.product_id}</td>
              <td className="px-4 py-2 border">{product.amount}</td>
              <td className="px-4 py-2 border">{product.country}</td>
              <td className="px-4 py-2 border">{product.state}</td>
              <td className="px-4 py-2 border">{product.city}</td>
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
          saleproduct={saleproduct}
          employees={employees}
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
