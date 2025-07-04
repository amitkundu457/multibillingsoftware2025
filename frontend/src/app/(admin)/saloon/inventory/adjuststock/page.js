"use client";

import dynamic from "next/dynamic";

const AdjustStock = dynamic(() => import("./AdjustStock"), {
  ssr: false,
});

export default function Page() {
  return <AdjustStock />;
}
