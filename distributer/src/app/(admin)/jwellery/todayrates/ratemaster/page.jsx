'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

 const Page = () => {
    const [data, setData] = useState({
        labelhere: "",
        rate: "",
        purity: "",
        makingpergm: "",
        makingprpercent: "",
        makingdiscpercent: "",
        makingdiscprice: ""
    });

    const handleInput = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/ratemaster', data)
            .then((response) => {
                alert("Data submitted successfully!");
                console.log(response);
            })
            .catch((error) => {
                alert("Failed to save data.");
                console.log(error.response?.data || error.message);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <header className="bg-orange-400 text-white text-center py-4 text-xl font-semibold">
                Rate Master
            </header>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
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
                            name="makingprpercent"
                            value={data.makingprpercent}
                            placeholder="Making percent"
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                        <input
                            onChange={handleInput}
                            type="number"
                            name="makingdiscprice"
                            value={data.makingdiscprice}
                            placeholder="Discount ₹"
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Save
                </button>
            </form>
        </div>
    );
}

export default Page;