"use client"
import React, { useState, useEffect } from "react";
import Loginpage from "./login";
import OtpLogin from "../otplogin/page";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Prevent blinking

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      router.replace("/dashboard"); // Use `replace` instead of `push` to prevent back navigation
    } else {
      setIsLoading(false); // Show login only if no token
    }
  }, [router]);

  const [loginMethod, setLoginMethod] = useState("otp");

  if (isLoading) {
    return null; // Prevent rendering during redirect check
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 to-purple-600 p-4">
      <div className= "  bg-white shadow-lg rounded-lg  flex flex-col sm:flex sm:flex-row w-full sm:max-w-4xl">
        {/* Left Side - Form */}
        <div className=" sm:w-1/2 w-full p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>
       

          {/* Conditionally Render Login Components */}
          <Loginpage />
        </div>

        {/* Right Side - Illustration */}
        <div className="sm:w-1/2 hidden sm:block w-full flex justify-center items-center p-8">
          <img
            src=" https://api.equi.co.in/undraw_thought-process_pavs.png"
            className="w-full"
            alt="Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
