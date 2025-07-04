"use client";
import React, { useState, useEffect } from "react";
import { getBrands, baseImageURL } from "../../components/config";

export default function Index() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrandsData = async () => {
      try {
        const response = await getBrands();
        console.log("API Response:", response);
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrandsData();
  }, []);

  return (
    <div id="brands" className="bg-white-50 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h6 className="text-[22px] text-gray-600">Customer Brands</h6>
        <h1 className="font-bold text-[3rem] text-gray-800">
          Brands Who Trust Retailjee
        </h1>
      </div>

      {/* Brand Grid */}
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand.id} className="image grid place-items-center">
                <img
                  src={`${baseImageURL}${brand?.image}`}
                  alt={brand.name}
                  className=" h-[80px] object-contain rounded-full"
                />
              </div>
            ))
          ) : (
            <p className="text-center col-span-4 text-gray-500">
              Loading brands...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
