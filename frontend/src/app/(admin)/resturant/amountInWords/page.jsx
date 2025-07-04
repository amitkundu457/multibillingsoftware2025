'use client';

import React from 'react';
import num2words from 'num2words';

function formatIndianNumber(num) {
  return num.toLocaleString('en-IN');
}

const AmountInWords = ({ amount }) => {
  // Correct function name: num2words
  const words = num2words(amount, { lang: 'en-IN' });
  const capitalizedWords = words.charAt(0).toUpperCase() + words.slice(1);

  return (
    <div className="p-4 text-base font-medium">
      <p>
        <span className="font-semibold">Amount:</span> ₹{formatIndianNumber(amount)}
      </p>
      <p>
        <span className="font-semibold">In Words:</span> {capitalizedWords} Only
      </p>
    </div>
  );
};
export default AmountInWords;
