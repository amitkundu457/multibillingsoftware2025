"use client";
import { useEffect, useState } from "react";
import axios from "axios";
// import VendorForm from "./VendorForm";
// import VendorForm from "../components/VendorForm";
import VendorForm from "../../../components/VendorForm";
export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  const fetchVendors = async () => {
    const token = getCookie("access_token");

    try {
      const res = await axios.get(
        "https://apibrize.brizindia.com/api/vendors",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("edit buttom clicked", res);
      setVendors(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  };

  const deleteVendor = async (id) => {
    const token = getCookie("access_token");

    if (!confirm("Are you sure want to delete?")) return;

    try {
      await axios.delete(
        `https://apibrize.brizindia.com/api/vendor/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="mb-5 text-2xl font-bold">All Vendors</h1>

      {/* <VendorForm
        refresh={fetchVendors}
        editData={editData}
        clearEdit={() => setEditData(null)}
      /> */}

      <VendorForm
        isEdit={!!editData}
        editData={editData}
        refresh={fetchVendors}
        clearEdit={() => setEditData(null)}
      />

      <div className="mt-10">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>

                <th className="p-2 border">Business</th>
                <th className="p-2 border">City</th>
                <th className="p-2 border">State</th>

                <th className="p-2 border">GST</th>

                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="p-2 border">{vendor.id}</td>
                  <td className="p-2 border">{vendor.vendor_name}</td>
                  <td className="p-2 border">{vendor.category}</td>
                  <td className="p-2 border">{vendor.email}</td>
                  <td className="p-2 border">{vendor.phone}</td>

                  <td className="p-2 border">
                    {vendor.user?.information?.business_name || "-"}
                  </td>

                  <td className="p-2 border">
                    {vendor.user?.information?.city || "-"}
                  </td>
                  <td className="p-2 border">
                    {vendor?.user?.information?.state || "-"}
                  </td>

                  <td className="p-2 border">
                    {vendor.user?.information?.gst || "-"}
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      {/* <button
                        onClick={() => setEditData(vendor)}
                        className="px-3 py-1 text-white bg-yellow-500 rounded"
                      >
                        Edit
                      </button> */}
                      <button
                        onClick={() => deleteVendor(vendor.id)}
                        className="px-3 py-1 text-white bg-red-600 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
