"use client";
import Navbar from "../app/ui/NavBar";
import Herobanner from "./annother/herobanner/herobanner";
import ReSolution from "./ui/RetailSolution";
import Eco from "./annother/echo/index";
import Csolution from "./ui/customerEngagement";
import OmMarketing from "./ui/omniMarketting";
import Expan from "./ui/Expansion";
import SectionPart from "./ui/SectionPart";
import Part from "./ui/part";
import Product from "../app/ui/Product";
import Brand from "./annother/brands/index";
import FooterSection from "./ui/Fotter";
import { useState } from "react";

export default function Home() {
    const [open, setOpen] = useState(false)
      const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const scrollToSection = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  };
  return (
    <div className="relative w-full">
      {/* Navbar and Hero Section */}
      <Navbar open={open}/>
     

      {/* Main Content */}
      <div className="w-full">
      <Herobanner  openModal={openModal}   scrollToSection={scrollToSection}/>
        <Part />
        <ReSolution />
        {/* <Product /> */}
        <Brand />
        <Eco />
        {/* Uncomment the Carousel if needed */}
        {/* <Carausel /> */}
        <FooterSection scrollToTop={scrollToTop}/>
      </div>
    </div>
  );
}
