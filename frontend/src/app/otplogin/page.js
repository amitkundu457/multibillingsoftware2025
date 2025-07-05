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
//       const response = await axios.post(" https://api.equi.co.in/api/send-otp", {
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
//       const response = await axios.post(" https://api.equi.co.in/api/verify-otp", {
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
//             src=" https://api.equi.co.in/undraw_thought-process_pavs.png"
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
  const router = useRouter();

  // Redirect to dashboard if already logged in
  // useEffect(() => {
  //   const token = Cookies.get("access_token");
  //   if (token) {
  //     router.replace("/dashboard");
  //   }
  // }, []);
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  // Handle sending OTP
  const sendOtp = async () => {
    if (phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://api.equi.co.in/api/send-otp", {
        phone,
      });

      toast.success(response.data.message);
      setStep(2); // Go to OTP step
    } catch (error) {
      toast.error("Failed to send OTP");
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
      const response = await axios.post("https://api.equi.co.in/api/verify-otp", {
        phone,
        otp,
      });

      // Set access token cookie
      Cookies.set("access_token", response.data.token, { expires: 7 });

      toast.success("Login successful");

      // Add slight delay to allow cookie to settle
      setTimeout(() => {
        router.replace("/dashboard");
      }, 300);
    } catch (error) {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 to-purple-600 p-4">
      <div className="bg-white rounded-lg flex w-full max-w-4xl shadow-lg">
        {/* Left - Form */}
        <div className="w-1/2 p-8">
          <div className="flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold text-center mb-4">
                {step === 1 ? "Enter Phone Number" : "Enter OTP"}
              </h2>

              {step === 1 ? (
                <>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                  />
                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                  />
                  <button
                    onClick={verifyOtp}
                    disabled={loading}
                    className="w-full bg-green-500 text-white p-2 mt-4 rounded-md hover:bg-green-600"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}

              <Link href="/login" className="block mt-4 text-center text-sm text-blue-600 hover:underline">
                Go to email login
              </Link>
            </div>
          </div>
        </div>

        {/* Right - Illustration */}
        <div className="w-1/2 flex justify-center items-center p-8">
          <img
            src="https://api.equi.co.in/undraw_thought-process_pavs.png"
            className="w-full"
            alt="Illustration"
          />
        </div>
      </div>
    </div>
  );
}
