"use client"; // Add this to indicate it's a Client Component

import dynamic from "next/dynamic";

const Customers = dynamic(() => import("./index"), {
  ssr: false, // Now works because the component is client-side
});

export default function Page() {
  return <Customers />;
}

// "use client"; // ✅ Add this line to mark it as a Client Component

// import Customers from "./index"; // ✅ Import directly without dynamic

// export default function Page() {
//   return <Customers />;
// }
