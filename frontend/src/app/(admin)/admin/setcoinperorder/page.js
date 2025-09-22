  'use client'; // Only for app/ directory, skip this in pages/
  
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  
  const CoinSetting = () => {
    const [coinsPerOrder, setCoinsPerOrder] = useState('');
        const [coinsPerOrderList, setCoinsPerOrderList] = useState([]);

    const [clientId, setClientId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error,setError] = useState('');
  
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
      return null;
    };
     
  
    useEffect(() => {
      fetchCoinsPerOrder();
    }, []);
  
    const fetchCoinsPerOrder = async () => {
            const token = getCookie("access_token");
  
      try {
        const res = await axios.get('https://apibrize.brizindia.com/api/get-coins-per-order',{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCoinsPerOrderList(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };
  
    const handleSubmit = async (e) => {
            const token = getCookie("access_token");
  
      e.preventDefault();
      setLoading(true);
      setMessage('');
      try {
        await axios.post(
    "https://apibrize.brizindia.com/api/set-coins-per-order",
    { coins_per_order: parseInt(coinsPerOrder, 10),
      client_id:clientId
     },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
        setMessage("Coins per order updated successfully!");
        fetchCoinsPerOrder();
      }  catch (error) {
        console.error('Error updating:', error);
        setError('Failed to update.');
      }
      setLoading(false);
    };
  
    const handleEdit  = (data)=>{
      setClientId(data.created_by);
      setCoinsPerOrder(data.coins_per_order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Set Coins Per Order</h2>
        <form onSubmit={handleSubmit}>
          <select
          value={clientId}
          onChange={(e)=>setClientId(e.target.value)}
          required
          >
           <option value = "">Select Client</option>
            <option value = "1">Jwellery</option>
              <option value="2">Saloon</option>
            <option value="3">Restaurant</option>

          </select>
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
        {error && <p className='mt-2 text-red-600'>{error}</p>}

        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
  <thead>
    <tr className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
      <th className="px-4 py-2 text-left font-semibold">Client Name</th>
      <th className="px-4 py-2 text-left font-semibold">Coin</th>
      <th className="px-4 py-2 text-left font-semibold">Edit</th>
    </tr>
  </thead>
  <tbody>
    {coinsPerOrderList.map((data, index) => {
      const clientNames = {
        1: "Jewellery",
        2: "Salon",
        3: "Restaurant",
      };
    return(  <tr
        key={index}
        className="border-t border-gray-200 hover:bg-yellow-50 transition-colors"
      >
        <td className="px-4 py-2">{clientNames[data.created_by]}</td>
        <td className="px-4 py-2">{data.coins_per_order}</td>
        <td  onClick={()=>handleEdit(data)} className="px-4 py-2 text-blue-600 cursor-pointer hover:underline">
          Edit
        </td>
      </tr>
 ) })}
  </tbody>
</table>

      </div>
    );
  };
  
  export default CoinSetting;
  