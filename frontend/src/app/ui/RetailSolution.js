"use client";

import { useState, useEffect } from "react";
import { getSolutions } from "../components/config"; // Replace with your API call
import "aos/dist/aos.css"; // Import AOS styles
import AOS from "aos"; //
export const baseImageURL = " https://api.equi.co.in/";

export default function ReSolution() {
  const [solutions, setSolutions] = useState([]);

  // Fetch solutions from the API
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await getSolutions();
        setSolutions(response.data);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };

    fetchSolutions();
  }, []);

  // AOS animation initialization
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div
      id="solutions"
      className="flex items-center justify-center bg-gray-50 py-14"
    >
      <div className="container px-4 sm:px-6 mx-auto">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-xl font-semibold tracking-wide text-gray-500">
            Retail Tech
          </h2>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-800">
            Solutions
          </h1>
        </div>

        {solutions.map((solution) => {
          const imageUrl = `${baseImageURL}${solution.image || "default-image.jpg"}`;
          return (
            <div
              key={solution.id}
              data-aos="fade-up"
              className={`flex flex-col-reverse ${
                solution.invert ? "md:flex-row-reverse" : "md:flex-row"
              } items-center justify-between gap-8 mb-16`}
            >
              {/* Text Section */}
              <div className="w-full md:w-1/2 px-2 sm:px-4 space-y-4 text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
                  {solution.title}
                </h3>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {solution.description ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: solution.description,
                      }}
                    />
                  ) : (
                    "Description not available"
                  )}
                </div>
              </div>

              {/* Image Section */}
              <div className="w-full md:w-1/2 flex justify-center px-2 sm:px-4">
                <img
                  src={imageUrl}
                  alt={solution.title || "Solution Image"}
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
