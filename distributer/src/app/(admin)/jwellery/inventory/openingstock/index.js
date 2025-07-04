"use client";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft, FaPlus, FaRupeeSign, FaTimes } from "react-icons/fa";
import { useStock } from "@/app/hooks/stock";
function Page() {
  const [formData, setFormData] = useState({
    product_service_id: "",
    quantity: "",
    gross_weight: "",
    net_weight: "",
    rate: "",
    mrp: 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const { data, isLoading, createStock, deleteStock } = useStock();
  const handleDelete = async (id) => {
    await deleteStock(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("opening stoack 1")
    const validationErrors = await createStock(formData);
    console.log("validationErrors",validationErrors)
    if (validationErrors) {
      console.log("opening stoack 2")

      setErrors(validationErrors);
    } else {
      setFormData({
        product_service_id: "",
        quantity: "",
        gross_weight: "",
        net_weight: "",
        rate: "",
        mrp: 0,
      });
    }
  };
  return (
    <div className="absolute left-0 top-0 w-full bg-white h-full">
      <div className="w-full flex p-3 px-6 bg-green-500 text-white">
        <Link href="/dashboard" className="flex items-center text-sm gap-2">
          <FaArrowLeft />
        </Link>
        <p className="flex-1 text-center font-semibold">Opening Stock</p>
      </div>
      <form onSubmit={handleSubmit} className="flex p-4">
        <div className="flex flex-col gap-3 text-sm w-1/4 p-2">
          <label htmlFor="">Product</label>
          <select
            name="product_service_id"
            id=""
            value={formData.product_service_id}
            onChange={handleChange}
            className="form-input border border-gray-400 text-sm rounded"
          >
            <option value="">-- Select Option --</option>
            {!isLoading &&
              data.productServices &&
              data.productServices.map((prd, i) => (
                <option key={i} value={prd.id}>
                  {prd.name}
                </option>
              ))}
          </select>
          {errors.product_service_id && (
            <p className="text-sm text-red-500">
              {errors.product_service_id[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
          <label htmlFor="">Quantity</label>
          <input
            name="quantity"
            type="text"
            placeholder="Qty"
            className="form-input border border-gray-400 text-sm rounded"
            value={formData.quantity}
            onChange={handleChange}
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
          <label htmlFor="">Gross Wgt.</label>
          <input
            type="text"
            placeholder="gwt"
            className="form-input border border-gray-400 text-sm rounded"
            name="gross_weight"
            value={formData.gross_weight}
            onChange={handleChange}
          />
          {errors.gross_weight && (
            <p className="text-sm text-red-500">{errors.gross_weight[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
          <label htmlFor="">Net Wgt.</label>
          <input
            type="text"
            placeholder="nwt"
            className="form-input border border-gray-400 text-sm rounded"
            name="net_weight"
            value={formData.net_weight}
            onChange={handleChange}
          />
          {errors.net_weight && (
            <p className="text-sm text-red-500">{errors.net_weight[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
          <label htmlFor="">Rate.</label>
          <input
            type="text"
            placeholder="Rate"
            className="form-input border border-gray-400 text-sm rounded"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
          />
          {errors.rate && (
            <p className="text-sm text-red-500">{errors.rate[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 w-[10%] p-2 text-sm rounded">
          <label htmlFor="">MRP.</label>
          <input
            type="text"
            placeholder="MRP"
            className="form-input border border-gray-400 text-sm rounded"
            name="mrp"
            value={formData.mrp}
            onChange={handleChange}
          />
          {errors.mrp && (
            <p className="text-sm text-red-500">{errors.mrp[0]}</p>
          )}
        </div>
        <div className="flex items-start pt-9 gap-3 w-[10%] p-2 text-sm rounded">
          <button className="px-3 py-3 rounded bg-green-500 text-white">
            <FaPlus />
          </button>
        </div>
      </form>
      <div className="flex flex-col gap-1 p-2">
        {!isLoading &&
          data.stock
            ?.filter((st) => st.date == null) // Ensure only items with a non-null date are included
            .map((st, i) => (
              <div
                key={i}
                className="p-3 px-4 shadow-xl border border-gray-300 rounded space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h1>{st.product_service.name}</h1>
                  <button
                    type="button"
                    onClick={() => handleDelete(st.id)}
                    className="text-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    {st.quantity} | {st.gross_weight} | {st.net_weight}
                  </span>
                  <p className="flex items-center gap-1">
                    <FaRupeeSign className="text-green-500" />
                    <span>{st.mrp || 0}</span>
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default Page;
