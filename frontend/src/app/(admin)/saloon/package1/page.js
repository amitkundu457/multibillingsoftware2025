// Fixes:
// 1. Added `fetchPackages` to the `useEffect` dependency array.
// 2. Escaped `"` in JSX using `&quot;`.

"use client";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import Subtypes from "./subtypes/page";
import Groupsd from "./group/page";
import CategoryPackage from "./category/page";

export default function Packages() {
  const [openModals, setOpenModal] = useState(null);
  const [packages, setPackages] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [taxtype, setTaxtype] = useState([]);
  const [namePacks, setnamePack] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [packageId, setPackageId] = useState(null);
  const [services, setServices] = useState([]);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      pa_name_id: "",
      type_id: "",
      category_id: "",
      subtype_id: "",
      price: "",
      hsn: "",
      tax_id: "",
      group_id: "",
      service_type_id: "",
      services: [],
    },
  });

  const packagePrice = watch("packagePrice", 0);
  const gstAmount = packagePrice * 0.18;
  const finalPrice = packagePrice + gstAmount;

  const [isSubtypeModalOpen, setIsSubtypeModalOpen] = useState(false);

  useEffect(() => {
    fetchPackages();
    fetchDropdownData();
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  const token = getCookie("access_token");

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/packages", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    setValue("price", finalPrice);
  }, [finalPrice, setValue]);

  const fetchDropdownData = async () => {
    try {
      const [namePack, typeRes, categoryRes, subtypeRes, taxRes, taxTypeRes, groupRes, serviceRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/packagename"),
        axios.get("http://127.0.0.1:8000/api/package-type"),
        axios.get("http://127.0.0.1:8000/api/package-category"),
        axios.get("http://127.0.0.1:8000/api/packagesubtypes"),
        axios.get("http://127.0.0.1:8000/api/taxf"),
        axios.get("http://127.0.0.1:8000/api/tax-type"),
        axios.get("http://127.0.0.1:8000/api/membership-groups"),
        axios.get("http://127.0.0.1:8000/api/packageservice-type"),
      ]);

      setnamePack(namePack.data);
      setTypes(typeRes.data);
      setCategories(categoryRes.data);
      setSubtypes(subtypeRes.data);
      setTaxes(taxRes.data);
      setTaxtype(taxTypeRes.data);
      setGroups(groupRes.data);
      setServiceTypes(serviceRes.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, services: services };
      if (data.id) {
        await axiosInstance.put(`/packages/${data.id}`, payload);
        toast.success("Package updated successfully");
      } else {
        const response = await axiosInstance.post("/packages", payload);
        if (response.status === 201) {
          const packagesId = response.data.id;
          setPackageId(packagesId);
          toast.success("Package added successfully");
          closeModal();
          fetchPackages();
        } else {
          toast.error("Failed to add package");
        }
      }
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
    }
  };

  const handleEdit = (pkg) => {
    Object.keys(pkg).forEach((key) => setValue(key, pkg[key]));
    openModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/packages/${id}`);
      toast.success("Package deleted successfully");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    reset();
  };
  const handleOpenModal = (modalType) => setOpenModal(modalType);
  const handleCloseModal = () => setOpenModal(null);
  const name = watch("name");

  const addService = () => {
    setServices([...services, { service_name: "", price: "", quantity: "" }]);
  };

  const updateService = (index, key, value) => {
    const updatedServices = [...services];
    updatedServices[index][key] = value;
    setServices(updatedServices);
    calculatePackagePrice(updatedServices);
  };

  const removeService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    calculatePackagePrice(updatedServices);
  };

  const calculatePackagePrice = (servicesList) => {
    const total = servicesList.reduce(
      (sum, service) => sum + (Number(service.price) || 0) * (Number(service.quantity) || 0),
      0
    );
    setValue("packagePrice", total);
  };

  const onSubmitServices = async () => {
    if (!packageId) {
      toast.error("Package ID is missing. Create a package first.");
      return;
    }

    const serviceData = {
      package_id: packageId,
      services: services,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/package-services-name", serviceData);
      if (response.status === 201) {
        toast.success("Services added successfully!");
      } else {
        toast.error("Failed to add services.");
      }
    } catch (error) {
      console.error("Error adding services:", error);
      toast.error("An error occurred while adding services.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Packages</h2>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Add Package
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {packages.length === 0 ? (
          <p className="text-center col-span-full text-gray-500 text-lg">
            No records found
          </p>
        ) : (
          packages.map((pkg) => (
            <div key={pkg.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
              <p><strong>Type:</strong> {pkg.type?.name || "N/A"}</p>
              <p><strong>Category:</strong> {pkg.category?.name || "N/A"}</p>
              <p><strong>Price:</strong> ₹{pkg.price}</p>
              <div className="flex justify-between mt-4">
                <button onClick={() => handleEdit(pkg)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(pkg.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
