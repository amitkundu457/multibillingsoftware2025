"use client";

import { useState, useEffect } from "react";
import { getEcosystems, baseImageURL } from "../../components/config";

export default function Ecosystem() {
  const [ecosystemData, setEcosystemData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEcosystems = async () => {
      try {
        const response = await getEcosystems();
        console.log("API Response:", response.data);
        setEcosystemData(response.data);
      } catch (error) {
        console.error("Error fetching ecosystem data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEcosystems();
  }, []);

  return (
    <div
      id="clients"
      className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16 bg-[url('https://www.exclusife.com/newhome/images/ecosystem.png')] bg-cover bg-center"
    >
      {/* Title */}
      <div className="mb-12 text-center">
        {isLoading ? (
          <div className="mx-auto w-full max-w-2xl animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        ) : (
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 leading-snug">
            Connecting Over 8000+ Retailers Across 25+ Cities
          </h1>
        )}
      </div>

      {/* Ecosystem Circles or Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          ))
        ) : ecosystemData.length > 0 ? (
          ecosystemData.map((ecosystem) => (
            <div
              key={ecosystem.id}
              className="flex flex-col items-center text-center space-y-4 p-4 bg-white rounded-xl shadow-md w-full max-w-xs"
            >
              <img
                src={`${baseImageURL}${ecosystem.image}`}
                alt={ecosystem.name || "Ecosystem"}
                className="w-24 h-24 object-contain rounded-full"
              />
              <p className="text-gray-700 text-sm sm:text-base">
                {ecosystem.description || "No description available"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-red-500 col-span-full">
            Failed to load data. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
}
