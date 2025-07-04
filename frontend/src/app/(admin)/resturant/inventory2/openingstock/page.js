"use client";

import dynamic from "next/dynamic";

const OpeningStock = dynamic(() => import("./index"), {
  ssr: false,
});

export default function Page() {
  return <OpeningStock />;
}
