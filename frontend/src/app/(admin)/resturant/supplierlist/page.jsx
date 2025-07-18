 'use client';
import React, { useState, useEffect } from "react";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplierId, setCurrentSupplierId] = useState(null);

  // Fetch suppliers data on page load
  useEffect(() => {
    fetchSuppliers();
  }, []);

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







  const fetchSuppliers = async () => {
    
const token = getToken();
if (!token) {
  notifyTokenMissing();
  return;
}
    try {
      const response = await fetch(" http://127.0.0.1:8000/api/suppliers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSuppliers(data.suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // Create supplier
//   const createSupplier = async () => {
       
// const token = getToken();
// if (!token) {
//   notifyTokenMissing();
//   return;
// }
//     const supplierData = {
//       name: supplierName,
//       phone_number: phoneNumber,
//       address: address,
//       state: state,
//       city: city,
//       pincode: pincode,
//     };

//     try {
//       const response = await fetch(" http://127.0.0.1:8000/api/suppliers", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(supplierData),
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       });
//       const data = await response.json();
//       setSuppliers((prevSuppliers) => [...prevSuppliers, data.supplier]);
//       closeModal();
//     } catch (error) {
//       console.error("Error creating supplier:", error);
//     }
//   };
const createSupplier = async () => {
  const token = getToken();
  if (!token) {
    notifyTokenMissing();
    return;
  }

  const supplierData = {
    name: supplierName,
    phone_number: phoneNumber,
    address: address,
    state: state,
    city: city,
    pincode: pincode,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/api/suppliers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Combined into one headers object
      },
      body: JSON.stringify(supplierData),
    });

    const data = await response.json();
    setSuppliers((prevSuppliers) => [...prevSuppliers, data.supplier]);
    closeModal();
  } catch (error) {
    console.error("Error creating supplier:", error);
  }
};


  // Update supplier
  const updateSupplier = async () => {
    const updatedData = {
      name: supplierName,
      phone_number: phoneNumber,
      address: address,
      state: state,
      city: city,
      pincode: pincode,
    };

    try {
      const response = await fetch(
        ` http://127.0.0.1:8000/api/suppliers/${currentSupplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await response.json();
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === currentSupplierId ? data.supplier : supplier
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  // Delete supplier
  const deleteSupplier = async (id) => {
    try {
      await fetch(` http://127.0.0.1:8000/api/suppliers/${id}`, {
        method: "DELETE",
      });
      setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  // Open modal for creating or updating
  const openModal = (supplier = null) => {
    if (supplier) {
      setSupplierName(supplier.name);
      setPhoneNumber(supplier.phone_number);
      setAddress(supplier.address);
      setState(supplier.state);
      setCity(supplier.city);
      setPincode(supplier.pincode);
      setCurrentSupplierId(supplier.id);
    } else {
      setSupplierName("");
      setPhoneNumber("");
      setAddress("");
      setState("");
      setCity("");
      setPincode("");
      setCurrentSupplierId(null);
    }
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Supplier Management</h1>
      <button
        onClick={() => openModal()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
      >
        Add Supplier
      </button>

      {/* Supplier List */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Phone</th>
              <th className="px-4 py-2 border border-gray-300">Address</th>
              <th className="px-4 py-2 border border-gray-300">State</th>
              <th className="px-4 py-2 border border-gray-300">City</th>
              <th className="px-4 py-2 border border-gray-300">Pincode</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="px-4 py-2 border border-gray-300">{supplier.name}</td>
                <td className="px-4 py-2 border border-gray-300">{supplier.phone_number}</td>
                <td className="px-4 py-2 border border-gray-300">{supplier.address}</td>
                <td className="px-4 py-2 border border-gray-300">{supplier.state}</td>
                <td className="px-4 py-2 border border-gray-300">{supplier.city}</td>
                <td className="px-4 py-2 border border-gray-300">{supplier.pincode}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    onClick={() => openModal(supplier)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSupplier(supplier.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create or Update */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <span
              className="absolute top-2 right-2 text-2xl cursor-pointer"
              onClick={closeModal}
            >
              &times;
            </span>
            <h2 className="text-2xl font-semibold mb-4">
              {currentSupplierId ? "Update Supplier" : "Add Supplier"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (currentSupplierId) {
                  updateSupplier();
                } else {
                  createSupplier();
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {currentSupplierId ? "Update Supplier" : "Add Supplier"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPage;
