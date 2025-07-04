// components/CreateEditModal.js
import { useState } from "react";

export default function CreateEditModal({ data, onClose, onSave,employees,saleproduct }) {
  const [formData, setFormData] = useState(
    data || {
      user_id: "",
      product_id: "",
      amount: "",
      country: "",
      state: "",
      city: "",
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="p-6 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-xl font-bold">{data ? "Edit" : "Create"} Product</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700">Sales Person</label>
            <select   
              onChange={handleChange}
              className="w-full p-2 border"
              required>
                <option value="">Select Sales Person</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
  
            </select>
            {/* <input
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full p-2 border"
              required
            /> */}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Product ID</label>

            <select className="w-full p-2 border" onChange={handleChange} required   >
            {
              saleproduct.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
               
               
                          {/* </select>
            <input
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="w-full p-2 border"
              required
            /> */}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">State</label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 mr-2 text-white bg-gray-500 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
