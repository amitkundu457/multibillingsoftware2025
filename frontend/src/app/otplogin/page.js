// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function OtpLogin() {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState(1); // Step 1: Enter phone, Step 2: Enter OTP
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Redirect to dashboard if access token is available
//   useEffect(() => {
//     const token = Cookies.get("access_token"); // Correctly using Cookies.get()
//     if (token) {
//       router.push("/dashboard"); // Redirect to dashboard if token exists
//     }
//   }, []);

//   // Handle sending OTP
//   const sendOtp = async () => {
//     if (phone.length !== 10) {
//       toast.error("Enter a valid 10-digit phone number");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post("  http://127.0.0.1:8000/api/send-otp", {
//         phone,
//       });

//       toast.success(response.data.message);
//       setStep(2); // Move to OTP input step
//     } catch (error) {
//       toast.error("Failed to send OTP");
//     }
//     setLoading(false);
//   };

//   // Handle OTP verification
//   const verifyOtp = async () => {
//     if (otp.length !== 6) {
//       toast.error("Enter a valid 6-digit OTP");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post("  http://127.0.0.1:8000/api/verify-otp", {
//         phone,
//         otp,
//       });

//       // Set the token in cookies with an expiration time of 7 days
//       Cookies.set("access_token", response.data.token, { expires: 7 });

//       toast.success("Login successful");

//       // Get the router instance and redirect to dashboard
//       router.push("/dashboard"); // Redirect to dashboard after successful login
//     } catch (error) {
//       toast.error("Invalid or expired OTP");
//     }
//     setLoading(false);
//   };

//   return (
  


// <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 to-purple-600 p-4">
//       <div className="bg-white  rounded-lg flex w-full max-w-4xl">
//         {/* Left Side - Form */}
//         <div className="w-1/2 p-8">
//         <div className="flex items-center justify-center ">
//       <div className="bg-white p-6 rounded-lg  w-96">
//         <h2 className="text-xl font-bold text-center mb-4">
//           {step === 1 ? "Enter Phone Number" : "Enter OTP"}
//         </h2>

//         {step === 1 ? (
//           <>
//             <input
//               type="text"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="Phone Number"
//               className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
//             />
//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600"
//             >
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         ) : (
//           <>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
//             />
//             <button
//               onClick={verifyOtp}
//               disabled={loading}
//               className="w-full bg-green-500 text-white p-2 mt-4 rounded-md hover:bg-green-600"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}

       
//       </div>
      
//     </div>
//     <Link href="/login" className="mt-4 ml-4">Goto email login</Link>
//         </div>

//         {/* Right Side - Illustration */}
//         <div className="w-1/2 flex justify-center items-center p-8">
//           <img
//             src="  http://127.0.0.1:8000/undraw_thought-process_pavs.png"
//             className="w-full"
//             alt="Illustration"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OtpLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter phone, Step 2: Enter OTP
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      router.push("/dashboard");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  // Handle sending OTP
  const sendOtp = async () => {
    if (phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/send-otp", {
        phone,
      });

      toast.success(response.data.message);
      setStep(2); // Go to OTP step
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
        phone,
        otp,
      });

      // Set access token cookie
      Cookies.set("access_token", response.data.token, { expires: 7 });
      toast.success("Login successful");
      
      // Force a full page reload to reset the application state
      window.location.href = "/dashboard";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Invalid or expired OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (step === 1) {
        sendOtp();
      } else {
        verifyOtp();
      }
    }
  };

  if (!authChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 to-purple-600">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 to-purple-600 p-4">
      <div className="bg-white rounded-lg flex flex-col md:flex-row w-full max-w-4xl shadow-lg overflow-hidden">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md">
              <h1 className="text-2xl font-bold text-center text-purple-700 mb-2">
                Welcome Back
              </h1>
              <p className="text-center text-gray-600 mb-8">
                {step === 1 
                  ? "Enter your phone number to receive an OTP" 
                  : "Enter the OTP sent to your phone"
                }
              </p>
              
              <h2 className="text-xl font-bold text-center mb-6">
                {step === 1 ? "Phone Verification" : "OTP Verification"}
              </h2>

              {step === 1 ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      onKeyPress={handleKeyPress}
                      placeholder="10-digit phone number"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={sendOtp}
                    disabled={loading || phone.length !== 10}
                    className={`w-full p-3 mt-2 rounded-md font-semibold ${
                      loading || phone.length !== 10
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter 6-digit OTP"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={verifyOtp}
                    disabled={loading || otp.length !== 6}
                    className={`w-full p-3 mt-2 rounded-md font-semibold ${
                      loading || otp.length !== 6
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                  
                  <div className="text-center mt-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Change phone number
                    </button>
                  </div>
                  
                  <div className="text-center mt-2">
                    <button 
                      onClick={sendOtp}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                </>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link 
                  href="/login" 
                  className="block text-center text-sm text-purple-600 hover:underline"
                >
                  Go to email login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Illustration Section */}
       
       
      </div>
    </div>
  );
}