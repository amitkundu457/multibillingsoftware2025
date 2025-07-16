

// 'use client';

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ClientRoleAndCoinPurchase = () => {
//   const [data, setData] = useState([]);
//   const [selectedRole, setSelectedRole] = useState('jwellery');

//   const [form, setForm] = useState({
//     id: '',
//     amount: '',
//   });
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     axios
//       .get('https://api.equi.co.in/api/clinet')
//       .then((res) => {
//         setData(res.data);
//         if (res.data.length > 0) {
//           setSelectedRole(res.data[0].role);
//         }
//       })
//       .catch((err) => {
//         console.error('Error fetching data:', err);
//       });
//   }, []);

//   const selectedUsers = data.find((item) => item.role === selectedRole)?.users || [];

//   const handleRoleChange = (role) => {
//     setSelectedRole(role);
//   };

//   const handleInputChange = (e) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     try {
//       const res = await axios.post(
//         'https://api.equi.co.in/api/coinpurchase-admin',
//         {
//           id: parseInt(form.id),
//           amount: parseFloat(form.amount),
//         },
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       setMessage(res.data.message || 'Purchase successful!');
//       setForm({ id: '', amount: '' });
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Submission failed.';
//       setMessage('Error: ' + errorMsg);
//     }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-12">
//       {/* Role-wise User Section */}
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Recharges Client wise</h2>

//         {/* Role Switch Buttons */}
//         <div className="flex flex-wrap gap-3 mb-6">
//           {data.map((item) => (
//             <button
//               key={item.role}
//               onClick={() => handleRoleChange(item.role)}
//               className={`px-4 py-2 rounded-full border ${
//                 selectedRole === item.role
//                   ? 'bg-green-500 text-white border-green-500'
//                   : 'bg-white text-blue-600 border-blue-600'
//               }`}
//             >
//               {item.role}
//             </button>
//           ))}
//         </div>

//         {/* Users Table */}
//         <div className="overflow-x-auto shadow rounded bg-white">
//           <table className="w-full text-left border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 border">#</th>
//                 <th className="p-3 border">Recharge ID</th>
//                 <th className="p-3 border">Name</th>
//                 <th className="p-3 border">Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedUsers.length > 0 ? (
//                 selectedUsers.map((user, index) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="p-3 border">{index + 1}</td>
//                     <td className="p-3 border">{user.id}</td>
//                     <td className="p-3 border">{user.name}</td>
//                     <td className="p-3 border">{user.email}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="p-3 border text-center">
//                     No users found for this role.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Coin Purchase Section */}
//       <div className="max-w-md p-6 bg-white rounded shadow mx-auto">
//         <h2 className="text-lg font-bold mb-4">Recharge Now</h2>

//         {message && <p className="mb-4 text-green-600">{message}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block font-medium mb-1">Rechage ID</label>
//             <input
//               type="number"
//               name="id"
//               value={form.id}
//               onChange={handleInputChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//               placeholder="Enter User ID"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1">Amount</label>
//             <input
//               type="number"
//               name="amount"
//               value={form.amount}
//               onChange={handleInputChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//               placeholder="Enter Amount"
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ClientRoleAndCoinPurchase;



'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientRoleAndCoinPurchase = () => {
  const [data, setData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('jwellery');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [form, setForm] = useState({
    id: '',
    amount: '',
  });
  const [message, setMessage] = useState('');

  // Fetch data on load
  useEffect(() => {
    axios
      .get('https://api.equi.co.in/api/clinet')
      .then((res) => {
        setData(res.data);
        if (res.data.length > 0) {
          setSelectedRole(res.data[0].role);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle coin purchase form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post(
        'https://api.equi.co.in/api/coinpurchase-admin',
        {
          id: parseInt(form.id),
          amount: parseFloat(form.amount),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setMessage(res.data.message || 'Purchase successful!');
      setForm({ id: '', amount: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Submission failed.';
      setMessage('Error: ' + errorMsg);
    }
  };

  // Handle role change
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setCurrentPage(1); // reset to page 1 when role changes
  };

  // Get users of selected role
  const selectedUsers = data.find((item) => item.role === selectedRole)?.users || [];

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = selectedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(selectedUsers.length / usersPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      {/* Role-wise User Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recharges Client Wise</h2>

        {/* Role Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {data.map((item) => (
            <button
              key={item.role}
              onClick={() => handleRoleChange(item.role)}
              className={`px-4 py-2 rounded-full border ${
                selectedRole === item.role
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-blue-600 border-blue-600'
              }`}
            >
              {item.role}
            </button>
          ))}
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto shadow rounded bg-white">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Recharge ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{indexOfFirstUser + index + 1}</td>
                    <td className="p-3 border">{user.id}</td>
                    <td className="p-3 border">{user.name}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">
                      {
                        user.status==null?<span className='text-red-700'>Pending</span>:<span className='text-green-500'>Approved</span>
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 border text-center">
                    No users found for this role.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => goToPage(idx + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === idx + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Coin Purchase Section */}
      <div className="max-w-md p-6 bg-white rounded shadow mx-auto">
        <h2 className="text-lg font-bold mb-4">Recharge Now</h2>

        {message && <p className="mb-4 text-green-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Recharge ID</label>
            <input
              type="number"
              name="id"
              value={form.id}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter User ID"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter Amount"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientRoleAndCoinPurchase;
