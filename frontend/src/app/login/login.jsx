"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdEyeOff } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
// import {}
import axios from "axios";
import {useCookies} from "react-cookie";
 export default function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const token = cookies.access_token;
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   console.log("Login form submitted");
  //   console.log("Email:", email);
  //   console.log("Password:", password);
  //
  //   try {
  //     const response = await axios.post(
  //       " http://127.0.0.1:8000/api/login",
  //       {
  //         email,
  //         password,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //
  //     console.log(
  //       "Login successful, received token:",
  //       response.data.access_token
  //     );
  //
  //     localStorage.setItem("access_token", response.data.access_token);
  //     router.push("/admin");
  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.message || "Invalid login credentials";
  //     setError(errorMessage);
  //     console.error("Login failed:", errorMessage);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");
    console.log("Email:", email);
    console.log("Password:", password);
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Login successful, received token:", response.data.access_token);
  
      // Store the token in a cookie
      const token = response.data.access_token;
      const maxAge = 60 * 60 * 24; // 1 day in seconds
      document.cookie = `access_token=${token}; path=/; secure; SameSite=Strict; max-age=${maxAge}`;
  
      router.push("/dashboard");
    } catch (err) {
      let errorMessage = "Invalid login credentials";
  
      // Check for a 403 response (Account not approved)
      if (err.response?.status === 403) {
        errorMessage = "Your account is not approved. Please contact support.";
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      }
  
      setError(errorMessage);
      console.error("Login failed:", errorMessage);
    }
  };
  

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-md p-8 bg-white rounded-lg ">
        {/* <h1 className="text-2xl font-semibold text-center text-purple-700">
          Login to Account
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Access the most powerful tool in the design and web industry
        </p> */}
        <form onSubmit={handleLogin} >
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700">
              E-mail Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-purple-300"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label>
            <input
              // type="password"
              type={showPassword ? "text":"password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-purple-300"
            />
            <button className=" text-[30px] absolute top-[30px] right-[10px]" type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? <IoEyeSharp className=""/>:<IoMdEyeOff/>}</button>
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <button
          
            type="submit"
            className="w-full py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Login
          </button>
        </form>
        <div className="flex space-x-2 mt-4">
<div>
<div className=" sm:text-xl text-xs ">If you are a Distributor: <a href="http://distributer.brizindia.com/" className="bg-green-500 p-1 text-xs sm:text-sm hover:text-gray-600 sm:p-2 text-white rounded">click here</a></div>

</div>
        </div>
       <div className="flex justify-between">
       <div className="mt-4 text-center">
          <a href="../components/forgotpassword" className="text-sm text-purple-500 hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="mt-4 text-center">
          <Link href="/otplogin" className="text-sm text-purple-500 hover:underline">
            Goto otp login
          </Link>
        </div>
       </div>
      </div>
    </div>
  );
}
