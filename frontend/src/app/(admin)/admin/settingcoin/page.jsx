'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SetCoinsPerOrder = () => {
  const [coins, setCoins] = useState('');
  const [currentCoins, setCurrentCoins] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch current setting
  useEffect(() => {
    axios.get('https://api.equi.co.in/api/get-coins-per-order')
      .then(res => {
        if (res.data && res.data.coins_per_order !== undefined) {
          setCurrentCoins(res.data.coins_per_order);
        }
      })
      .catch(err => console.error('Error fetching current coin value', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('https://api.equi.co.in/api/set-coins-per-order', {
        coins_per_order: parseInt(coins),
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setMessage(res.data.message || 'Coins updated.');
      setCurrentCoins(parseInt(coins));
      setCoins('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Update failed.';
      setMessage('Error: ' + errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Set Coins Per Order</h2>

      {currentCoins !== null && (
        <p className="mb-4 text-gray-700">
          Current Setting: <strong>{currentCoins} coins</strong> per order
        </p>
      )}

      {message && (
        <p className="mb-4 text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">New Coins Per Order</label>
          <input
            type="number"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
            min={0}
            placeholder="Enter coins"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default SetCoinsPerOrder;
