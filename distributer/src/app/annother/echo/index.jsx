"use client";

import { useState, useEffect } from "react";
import { getEcosystems, baseImageURL } from "../../components/config";

export default function Ecosystem() {
  const [ecosystemData, setEcosystemData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ecosystem data
  useEffect(() => {
    const fetchEcosystems = async () => {
      try {
        const response = await getEcosystems();
        console.log("API Response:", response.data);
        setEcosystemData(response.data);
      } catch (error) {
        console.error("Error fetching ecosystem data:", error);
      } finally {
        setIsLoading(false); // Ensure loading stops
      }
    };

    fetchEcosystems();
  }, []);

  return (
    <div
      id="clients"
      className="bg-gray-50 py-16 px-6 sm:px-12 lg:px-20 bg-[url('https://www.exclusife.com/newhome/images/ecosystem.png')] bg-cover bg-center"
    >
      {/* Title Section */}
      <div className="mb-12 text-center">
        {isLoading ? (
          <div className="w-1/2 mx-auto mb-6 animate-pulse">
            <div className="w-3/4 h-6 mb-2 bg-gray-300 rounded-md"></div>
            <div className="w-1/2 h-8 mb-6 bg-gray-300 rounded-md"></div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-800">
              Connecting Over 8000+ Retailers Across 25+ Cities
            </h1>
          </>
        )}
      </div>

      {/* Circles Section */}
      <div className=" justify-items-center">
        {isLoading ? (
          // Skeleton Loader while loading
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center space-y-6">
              <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          ))
        ) : ecosystemData.length > 0 ? (
          ecosystemData.map((ecosystem) => (
            <div key={ecosystem.id} className="flex items-center space-x-4">
              {/* Image and Description in the same line */}
              <div className="">
                <img
                  src={`${baseImageURL}${ecosystem.image}`}
                  alt="Ecosystem"
                  className="w-full h-full object-cover rounded-lg s"
                />
              </div>
              <h1 className="text-lg text-gray-800">
                {ecosystem.description || "No description available"}
              </h1>
            </div>
          ))
        ) : (
          <p className="text-center text-red-500">
            Failed to load data. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
}
