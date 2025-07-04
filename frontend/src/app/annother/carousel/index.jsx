"use client";

// import { useState, useEffect, useRef } from "react";
// import { baseImageURL, getSliders } from "../../components/config"; // Assuming this is the function that fetches your slider data

// export default function GridCarousel() {
//   // State for storing slider data, initialized as an empty array
//   const [sliders, setSliders] = useState([]);
//   const [loading, setLoading] = useState(true); // Add loading state
//   const itemsPerPage = 3; // Number of images to display per view
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const sliderRef = useRef(null); // Ref for slider container
//   const startX = useRef(0); // Track mouse position for dragging
//   const isDragging = useRef(false); // Track whether dragging is active

//   useEffect(() => {
//     // Fetch sliders from the API or config
//     const fetchSliders = async () => {
//       try {
//         const response = await getSliders(); // Assuming this returns the slider data as an object
//         if (response && Array.isArray(response.data)) {
//           setSliders(response.data); // Access the 'data' property and save it to the state
//           setLoading(false); // Set loading to false once sliders are fetched
//         } else {
//           console.error("API response 'data' is not an array:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching sliders:", error);
//         setLoading(false); // Set loading to false if there's an error
//       }
//     };

//     fetchSliders();
//   }, []);

//   const totalPages = Math.ceil(sliders.length / itemsPerPage);

//   const nextSlide = () => {
//     if (currentIndex < totalPages - 1) {
//       setCurrentIndex((prevIndex) => prevIndex + 1);
//     }
//   };

//   const prevSlide = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prevIndex) => prevIndex - 1);
//     }
//   };

//   // Auto-slide logic
//   useEffect(() => {
//     if (!loading && sliders.length > 0) {
//       const interval = setInterval(() => {
//         if (currentIndex < totalPages - 1) {
//           nextSlide();
//         }
//       }, 4000); // Change slide every 4 seconds (more gentle transition)
//       return () => clearInterval(interval); // Clear interval on component unmount
//     }
//   }, [sliders, loading, currentIndex,nextSlide,totalPages]);

//   // Safely slice the sliders array to display the current batch of images
//   const currentSliders = sliders.slice(
//     currentIndex * itemsPerPage,
//     (currentIndex + 1) * itemsPerPage
//   );

//   // Handle drag start
//   const onDragStart = (e) => {
//     isDragging.current = true;
//     startX.current = e.clientX;
//   };

//   // Handle dragging the slider
//   const onDragMove = (e) => {
//     if (!isDragging.current) return;
//     const diff = e.clientX - startX.current;
//     const sliderWidth = sliderRef.current.offsetWidth;
//     const moveAmount = (diff / sliderWidth) * 100;
//     sliderRef.current.style.transform = `translateX(${moveAmount}%)`;
//   };

//   // Handle drag end and determine if the carousel should move
//   const onDragEnd = () => {
//     isDragging.current = false;
//     const sliderWidth = sliderRef.current.offsetWidth;
//     const movePercentage = Math.abs(sliderRef.current.style.transform.replace('translateX(', '').replace('%)', ''));
//     if (movePercentage > 50) {
//       if (sliderRef.current.style.transform.includes("-")) {
//         nextSlide();
//       } else {
//         prevSlide();
//       }
//     }
//     sliderRef.current.style.transform = `translateX(0%)`; // Reset slider position
//   };

//   // Reset to initial position when drag ends or user lets go
//   useEffect(() => {
//     const slider = sliderRef.current;

//     // Only add event listeners if sliderRef is not null
//     if (slider) {
//       slider.addEventListener("mousedown", onDragStart);
//       slider.addEventListener("mousemove", onDragMove);
//       slider.addEventListener("mouseup", onDragEnd);
//       slider.addEventListener("mouseleave", onDragEnd);

//       // Clean up event listeners
//       return () => {
//         slider.removeEventListener("mousedown", onDragStart);
//         slider.removeEventListener("mousemove", onDragMove);
//         slider.removeEventListener("mouseup", onDragEnd);
//         slider.removeEventListener("mouseleave", onDragEnd);
//       };
//     }
//   }, [onDragEnd]); // Empty dependency array to run this effect once when the component is mounted

//   if (loading) {
//     return (
//       <div className="relative w-full mx-auto py-8 overflow-hidden">
//         <p className="text-center text-xl">Loading...</p> {/* Display loading text */}
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full mx-auto py-8 overflow-hidden">
//       {/* Grid Container */}
//       <div
//         ref={sliderRef}
//         className="grid grid-cols-3 gap-6 transition-transform duration-700 ease-out"
//         style={{
//           transform: `translateX(-${currentIndex * 100}%)`, // Smooth transition with better easing
//         }}
//       >
//         {currentSliders.map((slider) => (
//           <div
//             key={slider.id}
//             className="relative flex items-center justify-center p-6 border rounded-2xl shadow-2xl overflow-hidden group transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
//           >
//             {/* Overlay Text (description on hover) */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
//             </div>

//             {/* Image */}
//             <img
//               src={`${baseImageURL}${slider.image}`}
//               className="h-60 w-full object-cover rounded-lg transform transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
//               alt=""
//             />
//           </div>
//         ))}
//       </div>

//       {/* Navigation Buttons */}
//       <button
//         onClick={prevSlide}
//         className="absolute top-1/2 left-4 -translate-y-1/2 bg-black text-white p-4 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:bg-gray-700"
//         disabled={currentIndex === 0} // Disable if at the first page
//       >
//         ❮
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute top-1/2 right-4 -translate-y-1/2 bg-black text-white p-4 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:bg-gray-700"
//         disabled={currentIndex === totalPages - 1} // Disable if at the last page
//       >
//         ❯
//       </button>
//     </div>
//   );
// }
import React from "react";

function GridCarousel() {
  return (
    <div className="App">
      <h1>Hello World!</h1>
    </div>
  );
}

export default GridCarousel;
