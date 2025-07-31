// import Image from "next/image"; // components/Footer.js
// // import ReactWhatsapp from 'react-whatsapp';
// import Link from "next/link";

// import React from "react";
// import { IoLogoWhatsapp } from "react-icons/io";
// const WhatsAppButton = () => {
//   const handleWhatsAppClick = () => {
//     const phoneNumber = "8826124790"; // Replace with your phone number
//     const message = encodeURIComponent("Hello, I need some help!"); // Predefined message
//     const url = `https://wa.me/${phoneNumber}?text=${message}`;
//     window.open(url, "_blank"); // Open WhatsApp in a new tab
//   };

//   return (
//     <button
//       onClick={handleWhatsAppClick}
//       style={{
//         backgroundColor: "#25D366",
//         color: "white",
//         border: "none",
//         borderRadius: "50%", // Circular button
//         padding: "15px",
//         cursor: "pointer",
//         position: "fixed",
//         bottom: "90px", // Distance from the bottom of the screen
//         right: "20px", // Distance from the right side of the screen
//         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: adds a shadow for better appearance
//         zIndex: 1000, // Ensure it appears on top of other elements
//       }}
//     >
//       <IoLogoWhatsapp className="text-[2rem]" />
//     </button>
//   );
// };

// // export default WhatsAppButton;

// export default function FooterSection({ scrollToTop }) {
//   return (
//     <footer className="text-sm" style={{ backgroundColor: "#343F51" }}>
//       <div className="max-w-6xl mx-auto px-6 p-[3rem] grid grid-cols-1 sm:grid-cols-3 gap-6">
//         <div>
//           <h3 className="font-semibold text-[22px] text-white mb-4">
//             PRODUCTS
//           </h3>
//           <ul className="space-y-2">
//             <li>
//               <Link href="/crm" className="text-white text-[16px] hover:underline">
//                 CRM
//               </Link>
//             </li>
//             <li>
//               <Link href="/marketing" className="text-white text-[16px] hover:underline">
//                 Marketing Automation
//               </Link>
//             </li>
//             <li>
//               <Link href="/sales" className="text-white text-[16px] hover:underline">
//                 Sales
//               </Link>
//             </li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="font-semibold text-[22px] mb-4 text-white">
//             SOLUTIONS
//           </h3>
//           <ul className="space-y-2">
//             <li>
//               <Link href="/generate-leads" className="text-white text-[16px] hover:underline">
//                 Generate Leads
//               </Link>
//             </li>
//             <li>
//               <Link href="/generate-sales" className="text-white text-[16px] hover:underline">
//                 Generate Sales
//               </Link>
//             </li>
//             <li>
//               <Link href="/control-cost" className="text-white text-[16px] hover:underline">
//                 Control Costs
//               </Link>
//             </li>
//             <li>
//               <Link href="/ring-fencing" className="text-white text-[16px] hover:underline">
//                 Ring-Fencing
//               </Link>
//             </li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="font-semibold text-[22px] text-white mb-4">SUPPORT</h3>
//           <ul className="space-y-2">
//             <li>
//               <Link href="/help-centre" className="text-white text-[16px] hover:underline">
//                 Help Centre
//               </Link>
//             </li>
//             <li>
//               <Link href="/contactsupport" className="text-white text-[16px] hover:underline">
//                 Contact Support
//               </Link>
//             </li>
//             <li>
//               <Link href="/about-brizIndia" className="text-white text-[16px] hover:underline">
//                 About BrizIndia
//               </Link>
//             </li>
//             <li>
//               <Link href="/careers" className="text-white text-[16px] hover:underline">
//                 Careers
//               </Link>
//             </li>
//             <li>
//         <Link href="/components/terrmcondition/">
//           <p className="text-white text-[16px] hover:underline">
//             Terms & Conditions
//           </p>
//         </Link>
//       </li>
//           </ul>
//         </div>

//         {/* New column for Logo */}
//         {/* <div className="flex items-center justify-center">
//         <Image
//   src="/images/logo-retain.jpeg"
//   alt="Customer Management"
//   width={100}
//   height={80}
// />
//         </div> */}
//       </div>

//       {/* Updated Powered by GOFRUGAL section with black background */}
//       <div className="bg-[#404c61] text-white mt-6 py-4 text-center">
//         {/* <p>
//           Powered by{" "}
//           <a href="#" className="text-white-600 hover:underline">
//             ECS
//           </a>
//           .
//         </p> */}
//         <p className="text-white-600 hover:underline font-bold">Copyright © 2025 Viraman Network Pvt Ltd. All Rights Reserved. </p>
//       </div>

//       <button
//         onClick={scrollToTop}
//         className="fixed p-3 text-white bg-blue-500 rounded-full shadow-md bottom-10 right-10 hover:bg-blue-600 focus:outline-none"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth="2"
//           stroke="currentColor"
//           className="w-6 h-6"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M5 15l7-7 7 7"
//           />
//         </svg>
//       </button>
//       {/* <ReactWhatsapp number="1-212-736-5000" message="Hello World!!!" /> */}
//       <WhatsAppButton />
//     </footer>
//   );
// }


import Image from "next/image"; // components/Footer.js
// import ReactWhatsapp from 'react-whatsapp';
import Link from "next/link";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";
const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "918826124790"; // Replace with your phone number
    const message =
      "Hello ,i would like to request a free demo of your software.";
    const encodedMessage = encodeURIComponent(message);
    const isMobile = /iPhone|Android/i.test(navigator.userAgent);
    const baseUrl = isMobile
      ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(baseUrl, "_blank"); // Open WhatsApp in a new tab
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
      <IoLogoWhatsapp className="text-[2rem]" />
    </button>
  );
};

// export default WhatsAppButton;

export default function FooterSection({ scrollToTop }) {
  return (
    <footer className="text-sm" style={{ backgroundColor: "#343F51" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div>
          <h3 className="font-semibold text-[22px] text-white mb-4">
            PRODUCTS
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/crm"
                className="text-white text-[16px] hover:underline"
              >
                CRM
              </Link>
            </li>
            <li>
              <Link
                href="/marketing"
                className="text-white text-[16px] hover:underline"
              >
                Marketing Automation
              </Link>
            </li>
            <li>
              <Link
                href="/sales"
                className="text-white text-[16px] hover:underline"
              >
                Sales
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-[22px] mb-4 text-white">
            SOLUTIONS
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/generate-leads"
                className="text-white text-[16px] hover:underline"
              >
                Generate Leads
              </Link>
            </li>
            <li>
              <Link
                href="/generate-sales"
                className="text-white text-[16px] hover:underline"
              >
                Generate Sales
              </Link>
            </li>
            <li>
              <Link
                href="/control-cost"
                className="text-white text-[16px] hover:underline"
              >
                Control Costs
              </Link>
            </li>
            <li>
              <Link
                href="/ring-fencing"
                className="text-white text-[16px] hover:underline"
              >
                Ring-Fencing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-[22px] text-white mb-4">
            SUPPORT & POLICY
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/help-centre"
                className="text-white text-[16px] hover:underline"
              >
                Help Centre
              </Link>
            </li>
            <li>
              <Link
                href="/contactsupport"
                className="text-white text-[16px] hover:underline"
              >
                Contact Support
              </Link>
            </li>
            <li>
              <Link
                href="/about-brizIndia"
                className="text-white text-[16px] hover:underline"
              >
                About BrizIndia
              </Link>
            </li>

            <li>
              <Link href="/components/terrmcondition/">
                <p className="text-white text-[16px] hover:underline">
                  Terms & Conditions
                </p>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-[22px] text-white mb-4">
            HELP & POLICY
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/privacypolicy"
                className="text-white text-[16px] hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/cancellationrefundpolicy"
                className="text-white text-[16px] hover:underline"
              >
                Cancellation & Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/shipping-and-delivery-policy"
                className="text-white text-[16px] hover:underline"
              >
                Shipping & Delivery Policy
              </Link>
            </li>
            <li>
              <Link
                href="/careers"
                className="text-white text-[16px] hover:underline"
              >
                Careers
              </Link>
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

      {/* Facebook insta */}


      <div className="flex justify-center gap-4 text-white  text-center">
       
      <Link href="https://www.facebook.com/share/19VNQFX4BH/" className=" text-4xl hover:text-green-300"><FaFacebookSquare  /></Link>
      <Link href="https://www.instagram.com/brizindia2024?igsh=MTQ5djEydGJ5dTM5bQ==" className=" text-4xl hover:text-green-700"><FaInstagramSquare /></Link>
      </div>

      {/* Updated Powered by GOFRUGAL section with black background */}
      <div className="bg-[#404c61] text-white mt-6 py-4 text-center">
        {/* <p>
          Powered by{" "}
          <a href="#" className="text-white-600 hover:underline">
            ECS
          </a>
          .
        </p> */}
        <p className="text-white-600 hover:underline font-bold">
          Copyright © 2025 Viraman Network Pvt Ltd. All Rights Reserved.{" "}
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
      {/* <ReactWhatsapp number="1-212-736-5000" message="Hello World!!!" /> */}
      <WhatsAppButton />
    </footer>
  );
}
