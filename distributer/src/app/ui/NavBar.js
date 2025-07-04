import { useState, useEffect } from "react";
import Image from "next/image";
// import Register from "@/app/register/page";
import Login from "../login/page";
import useSWR from "swr";
import {getLogo} from "@/app/components/config"
const fetcher = async () => {
  const response = await getLogo();
  return response.data.logo_url; // Return the relevant data
};
const Navbar = ({open}) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  // const [isOpen, setisOpen] = useState(false);
    const [isOpen, setisOpen] = useState(open || false)
    const { data: logoUrl, error } = useSWR('logo', fetcher);
  // Track scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Update active section based on scroll position
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + 100; // Offset for better visibility

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(section.getAttribute("id"));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scrolling when menu items are clicked
  const handleMenuClick = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 50, // Offset to account for sticky navbar
        behavior: "smooth",
      });
      setActiveSection(id); // Update active section on click
    }
  };

  return (
    <nav
      className={` top-0 left-0 z-50 w-full px-8 py-[1.5rem] transition-all duration-300 ${
        scrolled
          ? "bg-[#fff] fixed top-0 left-0 z-50 bg-opacity-80 shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      {isOpen && (
        <div className="fixed p-5 w-full h-screen top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] overflow-hidden">
          <div className="w-2/3 h-full p-5 overflow-auto bg-white rounded-lg">
            <div className="relative">
              <button
                onClick={() => setisOpen(false)}
                className="absolute text-gray-500 top-2 right-5 hover:text-gray-700"
              >
                X
              </button>
              {/* <h2 className="text-xl font-semibold text-black grid place-items-center text-[2rem]">New Registration Page</h2> */}
            </div>
            <Login />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt="Customer Management"
            width={80}
            height={100}
          />
        </div>
        {/* Navigation Links */}
        <ul className="flex space-x-6 text-[#172554] font-[500]">
          {[
            { label: "Features", id: "feature" },
            { label: "Solutions", id: "solutions" },
            // { label: "Products", id: "products" },
            { label: "Brands", id: "brands" },
            { label: "Clients", id: "clients" },
          ].map((item) => (
            <li key={item.id}>
              <a
                onClick={() => handleMenuClick(item.id)}
                className={`cursor-pointer hover:text-gray-300 ${
                  activeSection === item.id ? "text-[#fff] bg-blue-950 p-2" : ""
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              onClick={() => setisOpen(true)}
              className="px-4 py-2 text-white bg-blue-800 rounded hover:bg-blue-700"
            >
              SignIn
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
