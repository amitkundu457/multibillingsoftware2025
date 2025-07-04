"use client";
import React, { useState, useEffect } from "react";
import { getBrands, baseImageURL } from "../../components/config";

export default function Index() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrandsData = async () => {
      try {
        const response = await getBrands();
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrandsData();
  }, []);

  return (
    <div id="brands" className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h6 className="text-lg sm:text-xl text-gray-600">Customer Brands</h6>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
          Brands Who Trust BrizIndia
        </h1>
      </div>

      {/* Brand Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-10 items-center">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-center  bg-white rounded-md shadow-sm"
              >
                <img
                  src={`${baseImageURL}${brand?.image}`}
                  alt={brand.name}
                  className=" object-contain "
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Loading brands...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
