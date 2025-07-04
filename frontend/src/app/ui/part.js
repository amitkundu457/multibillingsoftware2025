"use client";
import React, { useEffect, useState } from "react";
import { getTabs, baseImageURL } from "../components/config";
import "aos/dist/aos.css"; // Import AOS styles
import AOS from "aos"; // Import AOS
const Features = () => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await getTabs();
        if (response.data && response.data.success) {
          setFeatures(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching features:", error);
      }
    };

    fetchFeatures();
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: false, // Whether animation should happen only once
      easing: "ease-in-out", // Default easing for animations
    });
  }, []); // Empty dependency array ensures AOS is initialized once
  return (
    <section id="feature" className="py-12 bg-gray-50">
      <div className="px-4 mx-auto text-center max-w-7xl">
        <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
          Features
        </h2>
        <h1 className="mt-2 mb-6 text-[39px] font-[600] text-[#333]">
          Check the Features
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature?.id}
               data-aos="fade-up"
              className="flex p-[3rem] items-center gap-4  text-left transition transform bg-white rounded-lg shadow-md hover:-translate-y-1"
            >
              <img
                src={`${baseImageURL}${feature.icon}`} // Use feature.icon if you want the icon
                alt={feature?.title || "Feature icon"}
                className="object-cover w-12 h-12"
              />
              <h3 className="text-lg font-semibold text-gray-700">
                {feature?.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
