"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function BookingModal({customer_id}) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, getValues,watch } = useForm();
  const [mode, setMode] = useState("new"); // "new" or "modify"
  const [nextNumber, setNextNumber] = useState({});
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNumber();
    fetchPackages();
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

  const fetchNumber = () => {
    axios.get(" http://127.0.0.1:8000/api/packagesnext-numbers")
      .then(res => {
        setNextNumber(res.data);
        setValue("packageNo", res.data.package_no || "");
        setValue("receiptNo", res.data.receipt_no || "");
      })
      .catch(err => console.log(err));
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get(" http://127.0.0.1:8000/api/packagename", {
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

  // Fetch package details by package number when modifying
  const fetchPackageByNumber = async () => {
    const packageNo = getValues("packageNo");
    if (!packageNo) {
      alert("Please enter a Package No");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(` http://127.0.0.1:8000/api/packagesassn/${packageNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const packageData = response.data;
      if (packageData) {
        // Populate form fields with fetched package data
        Object.keys(packageData).forEach((key) => {
          setValue(key, packageData[key]);
        });
      } else {
        alert("Package not found!");
      }
    } catch (error) {
      console.error("Error fetching package:", error);
      alert("Failed to fetch package details");
    } finally {
      setLoading(false);
    }
  };

  // Handle mode change
  const handleModeChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
    
    if (selectedMode === "new") {
      reset();
      fetchNumber();
    }
  };


  const Printbill = (orderId, billInv) => {
    if (!orderId) {
      console.error("Order ID is required for printing.");
      return;
    }

    console.log("Order ID:", orderId);
    console.log("Bill Invoice Flag:", billInv);

    // Determine the correct URL based on billInv value
    const printUrl = ` /saloon/printpackage?id=${orderId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };

  // Handle form submission
  const onSubmit = (data) => {
    const apiUrl = mode === "new" 
      ? " http://127.0.0.1:8000/api/packagesassign" 
      : ` http://127.0.0.1:8000/api/packageupdate/${data.packageNo}`;
alert(data.packageNo)
    const method = mode === "new" ? axios.post : axios.post;

    method(apiUrl, data)
      .then((res) => {
        const packageAssignId = res.data.data.customer_id; // Ensure backend returns this
       // alert(mode === "new" ? "New package saved!" : "Package updated successfully!");
       const printConfirmation = window.confirm(
        "Do you want to print the bill?"
      );

      if (printConfirmation) {
        Printbill(packageAssignId, res.data.bill_inv); // Call the direct print function
      }

        reset();
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Failed to save  or print package . Please try again.");
      });
  };

  const selectedPackageId = watch("package_id"); // Watch selected package


   // Auto-fill service amount when a package is selected
   useEffect(() => {
    const selectedPackage = packages.find((pkg) => pkg.id === Number(selectedPackageId));
    setValue("serviceAmount", selectedPackage ? selectedPackage.price || "" : "");
  }, [selectedPackageId, packages, setValue]);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <h2 className="text-lg font-bold">Customer Account</h2>

        {/* Mode Selection */}
        <div className="flex gap-4">
          <label>
            <input type="radio" value="new" checked={mode === "new"} onChange={handleModeChange} />
            New
          </label>
          <label>
            <input type="radio" value="modify" checked={mode === "modify"} onChange={handleModeChange} />
            Modify
          </label>
        </div>

        {/* Package No Input & Search Button in Modify Mode */}
        <div>
          <label>Package No</label>
          <div className="flex gap-2">
            <input
              type="text"
              {...register("packageNo", { required: "Package No is required" })}
              className="w-full p-2 border rounded-md"
              disabled={mode === "new"}
            />
            {mode === "modify" && (
              <button
                type="button"
                onClick={fetchPackageByNumber}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            )}
          </div>
          {errors.packageNo && <p className="text-red-500">{errors.packageNo.message}</p>}
        </div>

        {/* Receipt No */}
        <div>
          <label>Receipt No</label>
          <input
            type="text"
            {...register("receiptNo", { required: "Receipt No is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.receiptNo && <p className="text-red-500">{errors.receiptNo.message}</p>}
        </div>

        {/* Package Selection */}
        <div>
          <label>Package</label>
          <select {...register("package_id", { required: "Choose a package" })} className="w-full p-2 border rounded-md">
            <option value="">Choose package</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </select>
          {errors.package_id && <p className="text-red-500">{errors.package_id.message}</p>}
        </div>

         {/* Service Amount - Auto-filled */}
      <div>
        <label>Service Amount</label>
        <input
          type="number"
          {...register("serviceAmount")}
          className="w-full p-2 border rounded-md bg-gray-100"
          readOnly
        />
      </div>

        {/* Other Form Fields */}
        {[
          { name: "packageAmount", label: "Package Amount", type: "number" },
          { name: "receiptAmount", label: "Recipet Amount", type: "number" },
          // { name: "serviceAmount", label: "Service Amount", type: "number" },
          { name: "paidAmount", label: "Paid Amount", type: "number" },
          { name: "balanceAmount", label: "Balance Amount", type: "number" },
          { name: "remainingAmount", label: "Remaining Amount", type: "number" },
          { name: "paymentDate", label: "Payment  Date", type: "date" },
          { name: "packageBooking", label: "Package  Booking", type: "date" },
          { name: "packageExpiry", label: "Package  Expiry", type: "date" },
        //   { name: "settlementMode", label: "Package  Expiry", type: "date" },
        ].map((field) => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type}
              {...register(field.name, { required: `${field.label} is required` })}
              className="w-full p-2 border rounded-md"
            />
            {errors[field.name] && <p className="text-red-500">{errors[field.name].message}</p>}
          </div>
        ))}

<div>
          <label>Settlement </label>
          <select {...register("settlementMode", { required: "Choose a package" })} className="w-full p-2 border rounded-md">
            <option value="">Choose settlement mode</option>
            <option value="0">Cash</option>
            <option value="1">Debit</option>
         
          </select>
          {errors.package_id && <p className="text-red-500">{errors.package_id.message}</p>}
        </div>

        <div>
          <label>Payment Status </label>
          <select {...register("paymentStatus", { required: "Choose a package" })} className="w-full p-2 border rounded-md">
            <option value="">Choose Status</option>
            <option value="0">Paid</option>
            <option value="1">Unpaid</option>
         
          </select>
          {errors.package_id && <p className="text-red-500">{errors.package_id.message}</p>}
        </div>

        <div>
          <label>Package Status </label>
          <select {...register("packageStatus", { required: "Choose a package" })} className="w-full p-2 border rounded-md">
            <option value="">Choose Status</option>
            <option value="0">Complete</option>
            <option value="1">Unpaid</option>
         
          </select>
          {errors.package_id && <p className="text-red-500">{errors.package_id.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
            {mode === "new" ? "Save & Print" : "Modify & Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
