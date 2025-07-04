// pages/jwellery/accountreportpdf/[id].js

import React from "react";

const Receipt = ({ params }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 border relative border-gray-300 shadow-lg bg-white">
      <div className="text-center">
        <h2 className="text-xl font-bold">RETAILJI JEWELLERY</h2>
        <p className="text-sm">KOLKATA, KOLKATA</p>
      </div>
      <img
        src="https://i.imgur.com/w8dR0Ys.png"
        alt="RetailJi Logo"
        className="mx-auto h-16 absolute top-4"
      />

      {/* Receipt content... */}

      <div className="opacity-10 absolute bottom-4">
        <img
          src="https://i.imgur.com/w8dR0Ys.png"
          className="w-[70rem]"
          alt=""
        />
      </div>
      {/* Table and footer content... */}
    </div>
  );
};

// The generateStaticParams function ensures Next.js knows what dynamic paths to pre-render at build time
export function generateStaticParams() {
  // Example: You can dynamically fetch IDs from an API or database here
  const paramsArray = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    // Add any other dynamic IDs that need to be pre-rendered
  ];

  return paramsArray.map((param) => ({
    params: param, // Make sure to pass it as an object with `params` key
  }));
}

export default Receipt;
