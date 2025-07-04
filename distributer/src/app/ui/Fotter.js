import Image from 'next/image';// components/Footer.js
// import ReactWhatsapp from 'react-whatsapp';

import React from 'react';
import { IoLogoWhatsapp } from "react-icons/io";
const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "1234567890"; // Replace with your phone number
    const message = encodeURIComponent("Hello, I need some help!"); // Predefined message
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank"); // Open WhatsApp in a new tab
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      style={{
        backgroundColor: "#25D366",
        color: "white",
        border: "none",
        borderRadius: "50%", // Circular button
        padding: "15px",
        cursor: "pointer",
        position: "fixed",
        bottom: "90px", // Distance from the bottom of the screen
        right: "20px", // Distance from the right side of the screen
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: adds a shadow for better appearance
        zIndex: 1000, // Ensure it appears on top of other elements
      }}
    >
     <IoLogoWhatsapp className='text-[2rem]'/>
    </button>
  );
  
};

// export default WhatsAppButton;

export default function FooterSection({scrollToTop}) {
  return (
    <footer className="text-sm" style={{ backgroundColor: "#343F51" }}>
      <div className="max-w-6xl mx-auto px-6 p-[3rem] grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold text-[22px] text-white mb-4">PRODUCTS</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                CRM
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                Marketing Automation
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                Sales
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-[22px] mb-4 text-white">SOLUTIONS</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                Generate Leads
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                Generate Sales
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                Control Costs
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                Ring-Fencing
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-[22px] text-white mb-4">SUPPORT</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                Help Centre
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                Contact Support
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                About Exclusife
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-[16px] hover:underline">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* New column for Logo */}
        {/* <div className="flex items-center justify-center">
        <Image
  src="/images/logo-retain.jpeg"
  alt="Customer Management"
  width={100} 
  height={80} 
/>
        </div> */}
      </div>

      {/* Updated Powered by GOFRUGAL section with black background */}
      <div className="bg-[#404c61] text-white mt-6 py-4 text-center">
        <p>
          Powered by{" "}
          <a href="#" className="text-white-600 hover:underline">
            ECS
          </a>
          .
        </p>
      </div>

      <button
      onClick={scrollToTop}
      className="fixed p-3 text-white bg-blue-500 rounded-full shadow-md bottom-10 right-10 hover:bg-blue-600 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
    {/* <ReactWhatsapp number="1-212-736-5000" message="Hello World!!!" /> */}
    <WhatsAppButton />
    </footer>
  );
}
