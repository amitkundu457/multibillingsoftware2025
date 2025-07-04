"use client";

import { useState, useEffect } from "react";
import { getSolutions } from "../components/config"; // Replace with your API call
import "aos/dist/aos.css"; // Import AOS styles
import AOS from "aos"; //
export const baseImageURL = "http://127.0.0.1:8000/";

export default function ReSolution() {
  const [solutions, setSolutions] = useState([]);

  // Fetch solutions from the API
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await getSolutions(); // Fetch solutions from API
        setSolutions(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };

    fetchSolutions();
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: false, // Whether animation should happen only once
      easing: "ease-in-out", // Default easing for animations
    });
  }, []); // Empty dependency array ensures AOS is initialized once
  return (
    <div
      id="solutions"
      className="flex items-center justify-center bg-gray-50 py-14"
    >
      <div className="container px-6 mx-auto">
        {/* Heading Section */}
        <div className="mb-12 text-center">
          <h2 className="text-xl font-semibold tracking-wide text-gray-500">
            Retail Tech
          </h2>
          <h1 className="mt-4 text-4xl font-bold text-gray-800">Solutions</h1>
        </div>

        {solutions.map((solution) => {
          console.log(
            `${baseImageURL}${solution.image || "default-image.jpg"}`,
            solution
          );

          return (
            <div
              key={solution.id}
              data-aos="fade-up"
              className={`md:flex md:items-center md:space-x-8 space-y-6 md:space-y-0 justify-between px-7 mb-12 ${
                solution.invert ? "flex-row-reverse" : ""
              }`}
            >
              <div className="flex justify-center md:w-1/2 px-7">
                <img
                  src={`${baseImageURL}${
                    solution.image || "default-image.jpg"
                  }`} // Fallback for missing images
                  alt={solution.title || "Solution Image"}
                  className="rounded-lg shadow-md"
                />
              </div>

              {/* Text Section */}
              <div className="md:w-1/2 space-y-6 mt-[-3rem]">
                <div className="flex items-center justify-between space-x-4">
                  <h3 className="text-[3rem] font-semibold text-gray-800">
                    {solution.title}
                  </h3>
                  {/* <img
                    src="https://www.exclusife.com/newhome/images/logo-icon.png" // Replace with your logo path
                    alt="Logo"
                    className="w-24 h-auto"
                  /> */}
                </div>

                {/* Display Description */}
                <div>
                  <p className="text-gray-600">
                    {solution.description ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: solution.description,
                        }}
                      />
                    ) : (
                      "Description not available"
                    )}
                  </p>
                </div>

                {/* Button */}
                {/* <button
                  className="px-6 py-2 mt-4 text-gray-700 transition bg-white border border-gray-400 rounded-full hover:bg-blue-500 hover:text-white" */}
                {/* onClick={() => alert(`Solution selected: ${solution.title}`)}
                > */}
                {/* <span className="mr-2">→</span> Read More! */}
                {/* </button> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
