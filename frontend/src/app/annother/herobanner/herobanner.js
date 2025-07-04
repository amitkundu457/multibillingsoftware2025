"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { getSliders, baseImageURL } from "../../components/config";
import "./animated.css";
// import RegistrationPage from "@/app/register/index";
import RegistrationPage from "../../register/index";

export default function HeroSection({ scrollToSection }) {
  const [sliderData, setSliderData] = useState([]);
  const [email, setEmail] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [storedEmail, setStoredEmail] = useState("");

  useEffect(() => {
    async function fetchSliderData() {
      try {
        const response = await getSliders();
        if (response && Array.isArray(response.data)) {
          setSliderData(response.data);
        } else {
          console.error("Error: Response data is not an array", response);
        }
      } catch (error) {
        console.error("Error fetching slider data:", error);
      }
    }

    fetchSliderData();
  }, []);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleNavigation = async () => {
    if (email.trim() === "") {
      setError("Please enter your email or mobile number to proceed.");
      alert("Please enter your email or mobile number to proceed.");
      return;
    }
    setError("");
    try {
      const response = await axios.post(
        " http://127.0.0.1:8000/api/formverivy",
        {
          email,
        }
      );
      setStoredEmail(email);
      setIsModalOpen(true);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error storing email:", error);
      setError("An error occurred while storing your email.");
    }
  };

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      onSlideChange={handleSlideChange}
      className="h-screen"
    >
      {sliderData.map((slider, index) => (
        <SwiperSlide key={slider?.id}>
          <div className="relative flex items-center justify-center w-full h-screen bg-center bg-cover">
            <Image
              src={
                slider.image
                  ? `${baseImageURL}${slider.image}`
                  : "/default-image.jpg"
              }
              alt="Slider"
              layout="fill"
              objectFit="cover"
              priority
              loader={({ src }) => src}
            />

            <div className="p-4 absolute left-[5%] bottom-[20%] sm:bottom-[30%] md:left-[10%] max-w-[90%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[40%] xl:max-w-[35%]">
              <h1
                className={`mb-4 text-[1.2rem] sm:text-[1.5rem] md:text-[2rem] xl:text-[3rem] font-bold text-white ${
                  activeIndex === index
                    ? "animateIn animated zoomIn duration-250"
                    : "opacity-0"
                }`}
              >
                {slider.title && slider.title !== "null"
                  ? slider.title
                  : "Default Title"}
              </h1>
              <p
                className={`mb-6 text-sm sm:text-base md:text-lg text-white ${
                  activeIndex === index ? "animate-slide-in" : "opacity-0"
                }`}
              >
                {slider.description && slider.description !== "null"
                  ? slider.description
                  : "Default Description"}
              </p>
              <div className="relative flex flex-col sm:flex-row w-full max-w-md">
                <input
                  type="text"
                  placeholder="Enter mobile / email"
                  className="p-3 sm:p-4 border border-gray-300 text-black outline-none
             text-center rounded-t-full sm:rounded-tl-full sm:rounded-bl-full
             sm:rounded-tr-none sm:rounded-br-none"
                  style={{ minWidth: "250px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  className="px-4 sm:px-6 py-2 sm:py-3 text-white bg-[#0C406F] transition
               rounded-b-full sm:rounded-tr-full sm:rounded-br-full sm:rounded-tl-none sm:rounded-bl-none"
                  onClick={handleNavigation}
                >
                  GET STARTED
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center absolute top-[80%] sm:top-[85%] justify-center w-full">
              <svg
                onClick={scrollToSection}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-8 h-8 mt-4 text-white cursor-pointer animate-bounce"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </SwiperSlide>
      ))}

      {isModalOpen && (
        <div className="fixed p-5 w-full h-screen top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
          <div className="w-full max-w-3xl h-[90%] bg-white rounded-lg overflow-auto relative p-5">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-5 text-gray-600 hover:text-black text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-center mb-4 text-[#0C406F]">
              New Registration Page
            </h2>
            <RegistrationPage />
          </div>
        </div>
      )}
    </Swiper>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import Image from "next/image";
// import axios from "axios";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { getSliders, baseImageURL } from "../../components/config";
// import "./animated.css";
// import RegistrationPage from "../../register/index";

// export default function HeroSection({ scrollToSection }) {
//   const [sliderData, setSliderData] = useState([]);
//   const [email, setEmail] = useState("");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [error, setError] = useState("");
//   const [storedEmail, setStoredEmail] = useState("");

//   useEffect(() => {
//     async function fetchSliderData() {
//       try {
//         const response = await getSliders();
//         if (response && Array.isArray(response.data)) {
//           setSliderData(response.data);
//         } else {
//           console.error("Slider data is not an array:", response);
//         }
//       } catch (err) {
//         console.error("Error fetching sliders:", err);
//       }
//     }

//     fetchSliderData();
//   }, []);

//   const handleSlideChange = (swiper) => {
//     setActiveIndex(swiper.activeIndex);
//   };

//   const handleNavigation = async () => {
//     if (email.trim() === "") {
//       setError("Please enter your email or mobile number to proceed.");
//       alert("Please enter your email or mobile number to proceed.");
//       return;
//     }

//     setError("");
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/formverivy",
//         {
//           email,
//         }
//       );

//       setStoredEmail(email);
//       setIsModalOpen(true);
//       console.log(response.data.message);
//     } catch (err) {
//       console.error("Error storing email:", err);
//       setError("An error occurred while submitting your email.");
//     }
//   };

//   return (
//     <Swiper
//       spaceBetween={30}
//       centeredSlides={true}
//       autoplay={{ delay: 5000, disableOnInteraction: false }}
//       pagination={{ clickable: true }}
//       navigation={true}
//       modules={[Autoplay, Pagination, Navigation]}
//       onSlideChange={handleSlideChange}
//       className="sm:h-screen w-full h-fit bg-red-600"
//     >
//       {sliderData.map((slider, index) => (
//         <SwiperSlide key={slider.id || index}>
//           <div className="relative w-full h-screen">
//             {/* <Image
//               src={slider.image ? `${baseImageURL}${slider.image}` : "/default-image.jpg"}
//               alt="Slider Image"
//               layout="fill"
//               objectFit="cover"
//               priority
//               loader={({ src }) => src}
//               className="z-0 object-cover"
//             /> */}
//             <Image
//               src={
//                 slider.image
//                   ? `${baseImageURL}${slider.image}`
//                   : "/default-image.jpg"
//               }
//               // alt="Slider Image"
//               // layout="fill"
//               // objectFit="contain"
//               //  objectFit="cover"
//               // className="z-0 object-contain w-full"
//               //  className="z-0 object-cover"
//                alt="Slider Image"
//   layout="fill"
//   className="z-0 object-contain sm:object-cover"
//             />

//             {/* Text & Input Overlay */}
//             <div className="z-10 absolute left-[5%] bottom-[20%] sm:bottom-[30%] md:left-[10%] max-w-[90%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[40%] xl:max-w-[35%] p-4">
//               <h1
//                 className={`mb-4 text-[1.2rem] sm:text-[1.5rem] md:text-[2rem] xl:text-[3rem] font-bold text-white ${
//                   activeIndex === index
//                     ? "animateIn animated zoomIn duration-250"
//                     : "opacity-0"
//                 }`}
//               >
//                 {slider.title && slider.title !== "null"
//                   ? slider.title
//                   : "Default Title"}
//               </h1>

//               <p
//                 className={`mb-6 text-sm sm:text-base md:text-lg text-white ${
//                   activeIndex === index ? "animate-slide-in" : "opacity-0"
//                 }`}
//               >
//                 {slider.description && slider.description !== "null"
//                   ? slider.description
//                   : "Default Description"}
//               </p>

//               <div className="relative flex flex-col sm:flex-row w-full max-w-md">
//                 <input
//                   type="text"
//                   placeholder="Enter mobile / email"
//                   className="p-3 sm:p-4 border border-gray-300 text-black outline-none text-center rounded-t-full sm:rounded-tl-full sm:rounded-bl-full sm:rounded-tr-none sm:rounded-br-none"
//                   style={{ minWidth: "250px" }}
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />

//                 <button
//                   className="px-4 sm:px-6 py-2 sm:py-3 text-white bg-[#0C406F] transition rounded-b-full sm:rounded-tr-full sm:rounded-br-full sm:rounded-tl-none sm:rounded-bl-none"
//                   onClick={handleNavigation}
//                 >
//                   GET STARTED
//                 </button>
//               </div>
//             </div>

//             {/* Scroll Down Arrow */}
//             <div className="z-10 flex flex-col items-center absolute top-[80%] sm:top-[85%] justify-center w-full">
//               <svg
//                 onClick={scrollToSection}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="2"
//                 stroke="currentColor"
//                 className="w-8 h-8 mt-4 text-white cursor-pointer animate-bounce"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>
//           </div>
//         </SwiperSlide>
//       ))}

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed p-5 w-full h-screen top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
//           <div className="w-full max-w-3xl h-[90%] bg-white rounded-lg overflow-auto relative p-5">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-5 text-gray-600 hover:text-black text-2xl font-bold"
//             >
//               &times;
//             </button>
//             <h2 className="text-2xl font-semibold text-center mb-4 text-[#0C406F]">
//               New Registration Page
//             </h2>
//             <RegistrationPage />
//           </div>
//         </div>
//       )}
//     </Swiper>
//   );
// }
