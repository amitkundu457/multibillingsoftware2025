'use client';
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import axios from 'axios';
import Model from '../../(admin)/jwellery/todayrates/model';

export default function RatesCard() {
  const [data, setData] = useState([]); // Store rates data
  const [modelState, setModelState] = useState(false); // Control modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for edit

  // Fetch rate data
  const fetchRateMasters = () => {
    axios.get('http://127.0.0.1:8000/api/ratemaster/')
      .then((response) => {
        // Ensure the data is an array before setting it
        setData(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        alert("Failed to fetch data");
        console.error("Error fetching rate masters:", error);
      });
  };

  useEffect(() => {
    fetchRateMasters();
  }, []);

  // Open the edit modal
  const handleEdit = (item) => {
    setSelectedItem(item);
    setModelState(true);
  };

  // Close the modal and refresh the data
  const closeModel = () => {
    setModelState(false);
    setSelectedItem(null);
    fetchRateMasters(); // Refresh the table after adding/updating
  };

  return (
    <div className="p-4 bg-orange-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-orange-800">Today Rates</h2>
      <ul className="mt-4">
        {/* Check if data is an array and contains items */}
        {Array.isArray(data) && data.length > 0 ? (
          data.map((rate, index) => (
            <li
              key={index}
              className="flex text-orange-600 border-b py-2 justify-between"
            >
              <div>
                <span>{rate.labelhere}</span>
                <br />
                <span>{rate.rate}</span>
              </div>
              <span>
                <IoIosArrowForward
                  onClick={() => handleEdit(rate)} // Pass the correct `rate` item
                  className="text-5xl cursor-pointer"
                />
              </span>
            </li>
          ))
        ) : (
          // Display "No data found" message if data is empty or not an array
          <li className="text-center text-orange-600 py-4">No data found</li>
        )}
      </ul>
      {modelState && (
        <Model 
          closeModal={closeModel} 
          selectedItem={selectedItem} // Pass the selected item for editing
        />
      )}
    </div>
  );
}
