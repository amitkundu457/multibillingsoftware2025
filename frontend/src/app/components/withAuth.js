// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const withAuth = (WrappedComponent) => {
//   return (props) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isClient, setIsClient] = useState(false); // To check if it's running on the client side
//     const router = useRouter();

//     useEffect(() => {
//       setIsClient(true); // Mark as client-side once mounted
//     }, []);

//     useEffect(() => {
//       // Only run authentication checks in the client-side environment
//       if (isClient) {
//         const token = localStorage.getItem('access_token'); // Get the JWT token from localStorage
//         if (!token) {
//           router.push('/login'); // Redirect to login if no token
//         } else {
//           // Optionally, verify token here or decode it to check its validity.
//           setIsAuthenticated(true);
//         }
//       }
//     }, [isClient, router]); // Runs after client-side mount

//     if (!isClient) {
//       return <p>Loading...</p>; // You can show a loading indicator while waiting for the client-side mount
//     }

//     if (!isAuthenticated) {
//       return <p>Loading...</p>; // Optional: loading message while redirecting to login
//     }

//     return <WrappedComponent {...props} />;
//   };
// };

// export default withAuth;


// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
//
// const withAuth = (WrappedComponent) => {
//   const AuthHOC = (props) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isClient, setIsClient] = useState(false); // To check if it's running on the client side
//     const router = useRouter();
//
//     useEffect(() => {
//       setIsClient(true); // Mark as client-side once mounted
//     }, []);
//
//     useEffect(() => {
//       // Only run authentication checks in the client-side environment
//       if (isClient) {
//         const token = localStorage.getItem('access_token'); // Get the JWT token from localStorage
//         if (!token) {
//           router.push('/login'); // Redirect to login if no token
//         } else {
//           // Optionally, verify token here or decode it to check its validity.
//           setIsAuthenticated(true);
//         }
//       }
//     }, [isClient, router]); // Runs after client-side mount
//
//     if (!isClient) {
//       return <p>Loading...</p>; // You can show a loading indicator while waiting for the client-side mount
//     }
//
//     if (!isAuthenticated) {
//       return <p>Loading...</p>; // Optional: loading message while redirecting to login
//     }
//
//     return <WrappedComponent {...props} />;
//   };
//
//   // Assign a display name to the HOC for debugging purposes
//   AuthHOC.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
//
//   return AuthHOC;
// };
//
// export default withAuth;
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {useCookies} from "react-cookie";

const withAuth = (WrappedComponent) => {
  const AuthHOC = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isClient, setIsClient] = useState(false); // To check if it's running on the client side
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies();
    // Utility function to get a cookie value by name

    useEffect(() => {
      setIsClient(true); // Mark as client-side once mounted
    }, []);

    useEffect(() => {
      // Only run authentication checks in the client-side environment
      if (isClient) {
        const token = cookies.access_token; // Get the JWT token from cookies
        if (!token) {
          router.push("/login"); // Redirect to login if no token
        } else {
          // Optionally, verify token here or decode it to check its validity.
          setIsAuthenticated(true);
        }
      }
    }, [isClient, router,cookies]); // Runs after client-side mount

    if (!isClient) {
      return <div className="fixed top-0 right-0 bottom-0 left-0 grid place-items-center">
        <div className="loader"></div>
      </div>; // You can show a loading indicator while waiting for the client-side mount
    }

    if (!isAuthenticated) {
      return <div className="fixed top-0 right-0 bottom-0 left-0 grid place-items-center">
        <div className="loader"></div>
      </div>; // Optional: loading message while redirecting to login
    }

    return <WrappedComponent {...props} />;
  };

  // Assign a display name to the HOC for debugging purposes
  AuthHOC.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthHOC;
};

export default withAuth;
