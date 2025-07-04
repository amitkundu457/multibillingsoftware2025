"use client"; // Add this to indicate it's a Client Component

import dynamic from "next/dynamic";

const DistributorComponent = dynamic(() => import("./index"), {
  ssr: false, // Now works because the component is client-side
});

export default function Page() {
  return <DistributorComponent />;
}
