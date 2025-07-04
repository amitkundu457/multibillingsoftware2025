import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { getSliders, baseImageURL } from "../../components/config";
import "./animated.css"; // Custom CSS for animations
// import RegistrationPage from "@/app/register/page";

// Initialize Swiper with required modules
// SwiperCore.use([Autoplay, Navigation, Pagination]);

export default function HeroSection({ scrollToSection, open, openModal }) {
  const [sliderData, setSliderData] = useState([]);
  const [email, setEmail] = useState("");
  const [activeIndex, setActiveIndex] = useState(0); // Track the active slide index
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [storedEmail, setStoredEmail] = useState(""); // Store email data
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
    setActiveIndex(swiper.activeIndex); // Update the active index on slide change
  };

  // const handleNavigation = () => {
  //   const otp = Math.floor(100000 + Math.random() * 900000);
  //   if(confirm("Your OTP is " + otp)){
  //     // (!isOpen)
  //     openModal()
  //   }
  // };
  const handleNavigation = async () => {
    if (email.trim() === "") {
      setError("Please enter your email or mobile number to proceed.");
      alert("Please enter your email or mobile number to proceed.");
      return;
    }
    setError(""); // Clear any previous error

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/formverivy",
        {
          email,
        }
      );

      // Store the email if successfully stored in the backend
      setStoredEmail(email);

      // Open modal to show confirmation
      setIsModalOpen(true);

      console.log(response.data.message); // Show success message (optional)
    } catch (error) {
      console.error("Error storing email:", error);
      setError("An error occurred while storing your email.");
    }
  };

  return (
    <Swiper
      // spaceBetween={50}
      // slidesPerView={1}
      // navigation
      // pagination={{ clickable: true }}
      // autoplay={{ delay: 1000 }}
      // loop={true}
      // onSlideChange={handleSlideChange} // Listen for slide change events
      className="h-screen "
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 552500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      // className="mySwiper"
    >
      {sliderData.map((slider, index) => (
        <SwiperSlide key={slider?.id}>
          <div className="flex items-center justify-center w-full h-screen bg-center bg-cover ">
            <Image
              src={
                slider.image
                  ? `${baseImageURL}${slider.image}`
                  : "/default-image.jpg"
              }
              alt="Slider Image"
              // width={100}
              // height={100}
              objectFit="cover"
              layout="fill"
              loader={({ src }) => src}
              // className="absolute z-0 object-cover w-full h-full"
            />

            <div className="p-4 absolute left-[10%] bottom-[45%]">
              <h1
                className={`mb-4 text-[13px] md:text-[15px] xl:text-[50px] font-bold text-white ${
                  activeIndex === index
                    ? " animateIn animated zoomIn duration-250"
                    : "opacity-0"
                }`}
              >
                {slider.title && slider.title !== "null"
                  ? slider.title
                  : "Default Title"}
              </h1>
              <p
                className={`mb-6 text-lg text-white ${
                  activeIndex === index ? "animate-slide-in" : "opacity-0"
                }`}
              >
                {slider.description && slider.description !== "null"
                  ? slider.description
                  : "Default Description"}
              </p>
              <div className="relative flex ">
                <input
                  type="text"
                  placeholder="Enter mobile / email"
                  className="p-4 px-4 border border-gray-300 rounded-l-full"
                  style={{ minWidth: "300px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="px-6 py-2 text-white transition bg-[#0C406F] rounded-r-full hover:bg-red-600"
                  onClick={handleNavigation}
                >
                  GET STARTED
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center absolute bottom-0 top-[45%] justify-center h-screen">
              {/* <p className="text-lg text-white">Scroll Down</p> */}
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
        <div className="fixed p-5 w-full h-screen top-0 left-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] overflow-hidden">
          <div className="w-2/3 h-full p-5 overflow-auto bg-white rounded-lg">
            <div className="relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute text-gray-500 top-2 right-5 hover:text-gray-700"
              >
                X
              </button>
              <h2 className="text-xl font-semibold text-black grid place-items-center text-[2rem]">
                New Registration Page
              </h2>
            </div>
            {/* <RegistrationPage /> */}
          </div>
        </div>
      )}
    </Swiper>
  );
}

// import React, { useRef, useState } from 'react';
// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

// // import './styles.css';

// // import required modules
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// export default function App() {
//   return (
//     <>
//       <Swiper
//         spaceBetween={30}
//         centeredSlides={true}
//         autoplay={{
//           delay: 2500,
//           disableOnInteraction: false,
//         }}
//         pagination={{
//           clickable: true,
//         }}
//         navigation={true}
//         modules={[Autoplay, Pagination, Navigation]}
//         className="mySwiper"
//       >
//         <SwiperSlide>Slide 1</SwiperSlide>
//         <SwiperSlide>Slide 2</SwiperSlide>
//         <SwiperSlide>Slide 3</SwiperSlide>
//         <SwiperSlide>Slide 4</SwiperSlide>
//         <SwiperSlide>Slide 5</SwiperSlide>
//         <SwiperSlide>Slide 6</SwiperSlide>
//         <SwiperSlide>Slide 7</SwiperSlide>
//         <SwiperSlide>Slide 8</SwiperSlide>
//         <SwiperSlide>Slide 9</SwiperSlide>
//       </Swiper>
//     </>
//   );
// }
