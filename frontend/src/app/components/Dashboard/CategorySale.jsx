

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
};

export default function CategorySale() {
  const [categoryCount, setCategoryCount] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie('access_token');

    if (!token) {
      if (typeof notyf !== 'undefined') {
        notyf.error('Authentication token not found!');
      } else {
        console.error('Authentication token not found!');
      }
      setLoading(false);
      return;
    }

    axios
      .get('http://127.0.0.1:8000/api/categoryrate', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const count = response.data.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {});
        setCategoryCount(count);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 bg-green-300 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-black mb-4">Category Sale (by count)</h2>

      {loading ? (
        <p className="text-purple-700">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-purple-300">
            <thead className="bg-purple-200">
              <tr>
                <th className="px-4 py-2 text-left border-b border-purple-300 text-purple-800">Category</th>
                <th className="px-4 py-2 text-left border-b border-purple-300 text-purple-800">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryCount).map(([category, count]) => (
                <tr key={category} className="bg-white even:bg-purple-50">
                  <td className="px-4 py-2 border-b border-purple-200">{category}</td>
                  <td className="px-4 py-2 border-b border-purple-200">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

