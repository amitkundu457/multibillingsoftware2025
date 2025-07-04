 'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';



const Model = ({ closeModal, selectedItem }) => {
    const [data, setData] = useState({
        labelhere: "",
        rate: "",
        purity: "",
        makingpergm: "",
        makingdiscpercent: "",
     });

    // Pre-fill form fields if `selectedItem` is provided (for editing)
    useEffect(() => {
        if (selectedItem) {
            setData(selectedItem);
        }
    }, [selectedItem]);

    //tpken 
    const getToken = () => {
        const cookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
      };
    
      const notifyTokenMissing = () => {
        if (typeof window !== "undefined" && window.notyf) {
          window.notyf.error("Authentication token not found!");
        } else {
          console.error("Authentication token not found!");
        }
      };
    
    
    const token = getToken();
        if (!token) {
          notifyTokenMissing();
          return;
        }
    
    
    
    

    const handleInput = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        const token = getToken();
        if (!token) {
          notifyTokenMissing();
          return;
        }

        const url = " http://127.0.0.1:8000/api/ratemaster";
        const method = selectedItem ? axios.put : axios.post; // Determine POST or PUT
        const endpoint = selectedItem ? `${url}/${selectedItem.id}` : url; // Add ID for PUT requests

        method(endpoint, data,
            {
                headers: { Authorization: `Bearer ${token}` },
              }

        )
            .then((response) => {
                alert(selectedItem ? "Data updated successfully!" : "Data submitted successfully!");
                console.log(response);
                closeModal(); // Close modal on success
            })
            .catch((error) => {
                alert("Failed to save data.");
                console.error(error.response?.data || error.message);
            });
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full sm:w-96 p-6 rounded-lg shadow-md relative">
                <header className="bg-orange-400 text-white text-center py-4 text-xl font-semibold mb-4">
                    {selectedItem ? "Edit Rate Master" : "Add Rate Master"}
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            onChange={handleInput}
                            type="text"
                            name="labelhere"
                            value={data.labelhere}
                            placeholder="Label"
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                onChange={handleInput}
                                type="number"
                                name="rate"
                                value={data.rate}
                                placeholder="Rate"
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        <div>
                            <input
                                onChange={handleInput}
                                type="number"
                                name="purity"
                                value={data.purity}
                                placeholder="Purity"
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                onChange={handleInput}
                                type="number"
                                name="makingpergm"
                                value={data.makingpergm}
                                placeholder="Making per gram"
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <input
                                onChange={handleInput}
                                type="number"
                                name="makingdiscpercent"
                                value={data.makingdiscpercent}
                                placeholder="Discount %"
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        {/* <div>
                            <input
                                onChange={handleInput}
                                type="number"
                                name="makingprpercent"
                                value={data.makingprpercent}
                                placeholder="Making percent"
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       
                        {/* <div>
                            <input
                                onChange={handleInput}
                                type="number"
                                name="makingdiscprice"
                                value={data.makingdiscprice}
                                placeholder="Discount ₹"
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div> */}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {selectedItem ? "Update" : "Save"}
                    </button>
                </form>

                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
                >
                    ×
                </button>
            </div>
        </div>
    );
};



export default Model;
