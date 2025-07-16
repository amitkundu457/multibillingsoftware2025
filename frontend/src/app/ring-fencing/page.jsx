"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../ui/NavBar";
import FooterSection from "../ui/Fotter";

export default function Home({ type = "Ring-Fencing" }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    axios
      .get(`https://api.equi.co.in/api/frontend-settings/${type}`)
      .then((res) => {
        setContent(res.data.description);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load content", err);
        setLoading(false);
      });
  }, [type]);

  // Capitalize type text
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <Navbar open={open} />

      {/* Barma Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {capitalizedType}
          </h2>
          <p className="text-base md:text-lg font-medium text-white/80 mt-2">
            Home / {type}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10 mb-12">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ) : content ? (
          <div
            className="prose prose-indigo max-w-none prose-lg text-gray-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-center text-gray-500 font-medium">
            No content found.
          </p>
        )}
      </div>

      {/* Footer */}
      <FooterSection scrollToTop={scrollToTop} />
    </div>
  );
}
