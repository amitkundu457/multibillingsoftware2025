"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "@/app/components/modal/page";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  baseImageURL,
} from "@/app/components/config";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Page = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]); // Replaced 'solutions' with 'products'
  const [message, setMessage] = useState("");

  // Fetch data from API
  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data); // Replaced 'solutions' with 'products'
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", imageFile);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("invert", formData.invert ? 1 : 0);

    try {
      const response = await createProduct(data);
      setMessage(response.data.message);
      setCreateModalOpen(false);
      setFormData({ title: "", description: "", invert: false });
      setImageFile(null);
      fetchProductsData();
      setProducts((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error("Error creating product:", error);
      setMessage("Failed to create product. Please try again.");
    }
  };

  const handleEdit = (product) => {
    setEditData(product);
    setFormData({
      title: product.title,
      description: product.description,
      invert: product.invert,
    });
    setEditModalOpen(true);
  };

  const updateProductData = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageFile) data.append("image", imageFile);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("invert", formData.invert ? 1 : 0);

    try {
      const response = await updateProduct(editData.id, data);
      setMessage(response.data.message);
      setEditModalOpen(false);
      fetchProductsData();
      setProducts((prev) =>
        prev.map((prod) =>
          prod?.id === editData.id ? { ...prod, ...response.data.data } : prod
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Failed to update product. Please try again.");
    }
  };

  const deleteProductData = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
      setMessage("Product deleted successfully.");
      fetchProductsData();
    } catch (error) {
      console.log("Error deleting product:", error);
      setMessage("Failed to delete product. Please try again.");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between px-3">
        <h1 className="text-xl font-semibold">Products</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/50 rounded flex items-center gap-1"
        >
          <FaPlus /> <span>Create New</span>
        </button>
      </div>
      <div className="py-4 text-left">
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              <th className="px-3 py-2 text-white bg-gray-700 rounded-l">#</th>
              <th className="px-3 py-2 text-white bg-gray-700">Image</th>
              <th className="px-3 py-2 text-white bg-gray-700">Title</th>
              <th className="px-3 py-2 text-white bg-gray-700">Description</th>
              <th className="px-3 py-2 text-white bg-gray-700 rounded-r">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product?.id} className="border-b border-gray-200">
                <td className="px-3 py-2 text-center">{index + 1}</td>
                <td className="px-3 py-2 text-center">
                  <img
                    src={`${baseImageURL}${product?.image}`}
                    alt="Product"
                    width="100"
                    height="auto"
                  />
                </td>
                <td className="px-3 py-2">{product?.title}</td>
                <td className="px-3 py-2">{product?.description}</td>
                <td className="px-3 py-2 text-center">
                  <button
                    className="mr-2 text-blue-500"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteProductData(product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message && (
        <div className="mt-4 font-semibold text-green-600">{message}</div>
      )}

      {/* Create New Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Product"
      >
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 text-sm font-semibold">
              Image File:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-semibold">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-semibold"
            >
              Description:
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData((prevData) => ({
                  ...prevData,
                  description: data,
                }));
              }}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 font-semibold text-white bg-green-500 rounded"
          >
            Submit
          </button>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Product"
      >
        <form onSubmit={updateProductData} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 text-sm font-semibold">
              Image File:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-semibold">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-semibold"
            >
              Description:
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData((prevData) => ({
                  ...prevData,
                  description: data,
                }));
              }}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 font-semibold text-white bg-green-500 rounded"
          >
            Update
          </button>
        </form>
      </Modal>
    </section>
  );
};

export default Page;
