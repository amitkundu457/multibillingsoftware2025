'use client'; // Only for app/ directory, skip this in pages/

import { useEffect, useState } from 'react';
import axios from 'axios';

const CoinSetting = () => {
  const [coinsPerOrder, setCoinsPerOrder] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCoinsPerOrder();
  }, []);

  const fetchCoinsPerOrder = async () => {
    try {
      const res = await axios.get('https://api.equi.co.in/api/get-coins-per-order');
      setCoinsPerOrder(res.data.coins_per_order || '');
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('https://api.equi.co.in/api/set-coins-per-order', {
        coins_per_order: parseInt(coinsPerOrder),
      });
      setMessage('Coins per order updated successfully!');
    } catch (error) {
      console.error('Error updating:', error);
      setMessage('Failed to update.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Set Coins Per Order</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium">Coins per Order</label>
        <input
          type="number"
          min="0"
          required
          value={coinsPerOrder}
          onChange={(e) => setCoinsPerOrder(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default CoinSetting;
