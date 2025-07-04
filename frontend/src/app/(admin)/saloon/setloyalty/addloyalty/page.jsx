'use client';
import { useState } from "react";
import axios from 'axios';

const LoyaltyPointsSetup = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [conversionRate, setConversionRate] = useState("");
  const [conversionValue, setConversionValue] = useState("");
  const [minEarningPoint, setMinEarningPoint] = useState("");

  const handleSave = async ()=>{
  const data = {
    loyalty_balance: conversionRate,
    set_loyalty_points: conversionValue,
    min_invoice_bill_to_get_point: minEarningPoint,
    expiry: selectedDate,
  };

  try {
   const response = await axios.post(' http://127.0.0.1:8000/api/loyalty/',data);

    

    //const result = await response.json();
    
    if (response.status===201) {
      alert("Data saved successfully");
      console.log(response); // You can handle the result here
    } else {
      alert("Error: " + response.data);
    }
  } catch (error) {
    console.error("Error posting data:", error);
    alert("Something went wrong. Please try again later.");
  }

}

  
  return (
    <div className="flex  items-start justify-start min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4 text-gray-700">Loyalty  Rewards Points Setup</h1>
        
        {/* Loyalty Conversion */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <label className="font-medium text-gray-600">Loyalty Point Conversion:</label>
          <input 
            type="number" 
            className="border rounded-lg p-2 w-20 text-center"
            placeholder="1"
            value={conversionRate}
            onChange={(e) => setConversionRate(e.target.value)}
          />
          <span className="text-gray-500">=</span>
          <input 
            type="text" 
            className="border rounded-lg p-2 w-20 text-center"
            placeholder="₹1"
            value={conversionValue}
            onChange={(e) => setConversionValue(e.target.value)}
          />
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Minimum Value for Earning Points */}
        <div className="mb-4">
          <label className="block font-medium text-gray-600">Min Value of invoice for Earning Points:</label>
          <input 
            type="number" 
            className="border rounded-lg p-2 w-full mt-1"
            placeholder="Enter amount"
            value={minEarningPoint}
            onChange={(e) => setMinEarningPoint(e.target.value)}
          />
        </div>

        {/* Loyalty Date */}
        <div className="mb-4">
          <label className="block font-medium text-gray-600">Loyalty  expiry sDate:</label>
          <input
            type="date"
            className="border rounded-lg p-2 w-full mt-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && <p className="text-gray-500 mt-1">Selected Date: {selectedDate}</p>}
        </div>

        {/* Save Button */}
        <button  onClick={handleSave} className="w-1/2  bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600">
          Save
        </button>
      </div>
    </div>
  );
};

export default LoyaltyPointsSetup;
