"use client";
import React, { useState, useEffect } from "react";
import { getBrands, baseImageURL } from "../../components/config";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Index() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrandsData = async () => {
      try {
        const response = await getBrands();
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrandsData();
  }, []);

  return (
    <div id="brands" className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h6 className="text-lg sm:text-xl text-gray-600">Customer Brands</h6>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
          Brands Who Trust BrizIndia
        </h1>
      </div>

      {/* Swiper Carousel */}
      <div className="max-w-7xl mx-auto">
        {brands.length > 0 ? (
          <Swiper
            spaceBetween={10}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: true,
            }}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            modules={[Autoplay]}
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <div className="flex items-center w-[70%] border border-r overflow-hidden justify-center  bg-white rounded-md   transition duration-300 ease-in-out">
                  <img
                    src={`${baseImageURL}${brand?.image}`}
                    alt={brand.name}
                    className=" w-auto object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">Loading brands...</p>
        )}
      </div>
    </div>
  );
}
