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
        "https://api.equi.co.in/api/formverivy",
        { email }
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
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onSlideChange={handleSlideChange}
          className="w-full md:h-screen"
      >
        {sliderData.map((slider, index) => (
         <SwiperSlide key={slider?.id} >
  <div className="relative w-full h-[30vh] md:h-[85vh] sm:h-screen overflow-hidden">
    {/* Background Image */}
  <Image
  src={
    slider.image
      ? `${baseImageURL}${slider.image}`
      : "/default-image.jpg"
  }
  alt="Slider"
  fill
  priority
  className="object-cover w-full h-full"
/>

    {/* Overlay Content */}
    <div className="absolute top-[15%] left-[5%] md:left-[10%] text-gray-600  md:text-white max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[45%] xl:max-w-[35%] p-4">
      <h1
        className={`mb-4 text-[1.2rem] sm:text-[1.5rem] md:text-[2rem] xl:text-[3rem] font-bold ${
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
        className={`mb-6 text-sm sm:text-base md:text-lg ${
          activeIndex === index ? "animate-slide-in" : "opacity-0"
        }`}
      >
        {slider.description && slider.description !== "null"
          ? slider.description
          : "Default Description"}
      </p>

      {/* Desktop Form */}
      <div className="hidden sm:block  p-3 rounded-xl w-full max-w-md">
        <div className="flex">
          <input
            type="text"
            placeholder="Enter mobile / email"
            className="p-3 border border-gray-300 text-black outline-none rounded-l-full w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="px-6 py-3 text-white bg-[#0C406F] rounded-r-full"
            onClick={handleNavigation}
          >
            GET STARTED
          </button>
        </div>
      </div>
    </div>

    {/* Scroll Icon */}
    <div className="absolute bottom-6 flex justify-center w-full">
      <svg
        onClick={scrollToSection}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-8 h-8 mt-4 text-white cursor-pointer animate-bounce"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</SwiperSlide>

        ))}
      </Swiper>

      {/* Mobile Form - shown below the Swiper */}
      <div className="block sm:hidden px-4 py-6 bg-white">
        <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Enter mobile / email"
            className="p-3 border border-gray-300 text-black outline-none rounded-full w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="px-6 py-3 text-white bg-[#0C406F] rounded-full w-full"
            onClick={handleNavigation}
          >
            GET STARTED
          </button>
        </div>
      </div>

      {/* Modal */}
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
    </>
  );
}
