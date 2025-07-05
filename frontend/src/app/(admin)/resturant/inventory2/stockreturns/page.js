'use client';

import { useEffect, useState } from 'react';

const StockReturnsTable = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch(' https://api.equi.co.in/api/stock-returns/')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const filteredData = data.filter(item => 
        item.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
        item.reference_no.includes(search)
    );

    return (
        <div className="overflow-x-auto p-4 bg-gray-100 min-h-screen">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Stock List</h2>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="border p-2 rounded shadow" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-blue-500 text-white text-left">
                        <th className="py-2 px-4 border">Purchase Date</th>
                        <th className="py-2 px-4 border">Reference No.</th>
                        <th className="py-2 px-4 border">Supplier Name</th>
                        <th className="py-2 px-4 border">Total</th>
                        <th className="py-2 px-4 border">Payment Type</th>
                        <th className="py-2 px-4 border">Payment Status</th>
                        <th className="py-2 px-4 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id} className="text-left border-b hover:bg-gray-100 transition">
                            <td className="py-2 px-4 border">{item.date}</td>
                            <td className="py-2 px-4 border">{item.reference_no}</td>
                            <td className="py-2 px-4 border">{item.supplier_name}</td>
                            <td className="py-2 px-4 border">{item.amount}</td>
                            <td className="py-2 px-4 border">{item.payment_type}</td>
                            <td className="py-2 px-4 border">
                                <span className={`px-2 py-1 rounded text-white ${item.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="py-2 px-4 border">
                                <button className="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600 transition">Action</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockReturnsTable;
