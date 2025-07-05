"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Login from "../login/page";
import useSWR from "swr";
// import { getLogo } from "@/app/components/config";
import { getLogo } from "../components/config";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Optional: for better icons, or replace with text/icons

const fetcher = async () => {
  const response = await getLogo();
  return response.data.logo_url;
};

const Navbar = ({ open }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isOpen, setisOpen] = useState(open || false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: logoUrl, error } = useSWR("logo", fetcher);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + 100;

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

  const handleMenuClick = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 50,
        behavior: "smooth",
      });
      setActiveSection(id);
      setMobileMenuOpen(false); // Close menu on click
    }
  };

  return (
    <nav
      className={`top-0 left-0 z-50 w-full px-8 transition-all duration-300 ${
        scrolled
          ? "bg-white fixed shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      {/* Login Modal */}
      {isOpen && (
        <div className="fixed p-5 w-full h-screen top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] overflow-hidden">
          <div className="h-full p-5 overflow-auto bg-white rounded-lg">
            <div className="relative">
              <button
                onClick={() => setisOpen(false)}
                className="absolute text-gray-500 top-2 right-5 hover:text-gray-700"
              >
                X
              </button>
              <Login />
            </div>
          </div>
        </div>
      )}

      {/* Navbar Content */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
          {logoUrl && (
            <img src={logoUrl} alt="Logo" width={80} height={100} />
          )}
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-[#172554] font-[500]">
          {[
            { label: "Features", id: "feature" },
            { label: "Solutions", id: "solutions" },
            { label: "Brands", id: "brands" },
            { label: "Clients", id: "clients" },
          ].map((item) => (
            <li key={item.id}>
              <a
                onClick={() => handleMenuClick(item.id)}
                className={`cursor-pointer hover:text-gray-300 ${
                  activeSection === item.id
                    ? "text-white bg-blue-950 p-2 rounded"
                    : ""
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/otplogin"
              className="px-4 py-2 text-white bg-blue-800 rounded hover:bg-blue-700"
            >
              LogIn
            </Link>
          </li>
        </ul>

        {/* Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-blue-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white p-4 rounded shadow-md">
          <ul className="flex flex-col space-y-4 text-[#172554] font-[500]">
            {[
              { label: "Features", id: "feature" },
              { label: "Solutions", id: "solutions" },
              { label: "Brands", id: "brands" },
              { label: "Clients", id: "clients" },
            ].map((item) => (
              <li key={item.id}>
                <a
                  onClick={() => handleMenuClick(item.id)}
                  className={`cursor-pointer hover:text-gray-500 ${
                    activeSection === item.id
                      ? "text-white bg-blue-950 p-2 rounded"
                      : ""
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/otplogin"
                className="px-4 py-2 text-white bg-blue-800 rounded hover:bg-blue-700 block text-center"
              >
                LogIn
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
