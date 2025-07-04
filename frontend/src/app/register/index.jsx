"use client";
import React, { useState, useEffect, useCallback } from "react";
import { GetCountries, GetCity, GetState } from "react-country-state-city"; // Use State and City instead of GetStates and GetCities
import "react-country-state-city/dist/react-country-state-city.css";
import { Country, State, City } from "country-state-city";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

import {
  CitySelect,
  CountrySelect,
  StateSelect,
  LanguageSelect,
  RegionSelect,
  PhonecodeSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { getProducts } from "../components/config";
import axios from "axios";
import { getDistrubuters } from "../components/config";
import toast from "react-hot-toast";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    email: "",
    firstName: "",
    lastName: "",
    businessName: "",
    address1: "",
    address2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
     category: "",
    product_id: "",
    dist_id: "",
    contant_person: "",
    termsAccepted: false,
    //roleClient: "",
    password: "",
    gst: "",
  });

  const notyf = new Notyf();

  // const [categories] = useState([
  //   "Select Category",
  //   "Jewellery",
  //   "Salon",
  //   "Restaurant",
  //   "Hotel",
  //   "Retail",
  //   "CRM app",
  // ]);
  const [errors, setErrors] = useState({});
  const [countryList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [stateid, setStateid] = useState(0);
  const [countryid, setCountryid] = useState(0);
  const [cityid, setCityid] = useState(0);
  const [region, setRegion] = useState("");
  const [phonecode, setPhoneCode] = useState("");
  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distributors, setDistributors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchDistributors();
  }, []);
  const fetchProducts = async () => {
    try {
      const data = await getProducts(); // Fetch the product data
      setProducts(data); // Set the data into state
      console.log(data);
    } catch (err) {
      setErrors("Failed to fetch products.");
    } finally {
      setLoading(false); // Hide the loading spinner
    }
  };
  console.log("aaabbcc", products);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(" http://127.0.0.1:8000/api/roles");
        console.log("API Response:", response); // Check the full response
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const fetchDistributors = useCallback(async () => {
    try {
      const response = await getDistrubuters();
      setDistributors(response.data);
      console.log("data", response.data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      notyf.error("Failed to load distributors.");
    }
  }, []); // No dependencies, so this function is memoized and won't change
  // Fetch all countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (formData.country) {
      const stateList = State.getStatesOfCountry(formData.country);
      setStates(stateList);
      setCities([]); // Reset cities when country changes
      setFormData((prevData) => ({
        ...prevData,
        state: "",
        city: "",
      }));
    }
  }, [formData.country]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (formData.state) {
      const cityList = City.getCitiesOfState(formData.country, formData.state);
      setCities(cityList);
      setFormData((prevData) => ({
        ...prevData,
        city: "",
      }));
    }
  }, [formData.state, formData.country]);

  // Handle input changes
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // Handle form submission
  const handleSubmitOn = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);

    // Form validation
    if (!formData.country || !formData.state || !formData.city) {
      setErrors({
        country: !formData.country ? "Country is required" : "",
        state: !formData.state ? "State is required" : "",
        city: !formData.city ? "City is required" : "",
      });
      return;
    }
    alert("Form submitted successfully!");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare the data to be sent
      const dataToSend = {
        mobile_number: formData.mobileNumber,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        business_name: formData.businessName,
        address_1: formData.address1,
        address_2: formData.address2,
        landmark: formData.landmark,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        product_id: formData.product_id,
        dist_id: formData.dist_id,
        contant_person: formData.contant_person,
        agreed_to_terms: formData.termsAccepted,
        category: formData.category,
        password: formData.password, // You should handle password input securely
        password_confirmation: "12345678", // Same as above
        gst: formData.gst,
        roleClient:formData.category
      };
      console.log(dataToSend);

      // Send the data to the Laravel backend
      axios
        .post(" http://127.0.0.1:8000/api/user-infos", dataToSend, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.success) {
            notyf.success("Registration have been successfully saved!");

            setTimeout(() => {
              window.location.reload();
            }, 1000);

            // Optionally reset the form or redirect the user
          } else {
            console.error("Error:", response.data);
            notyf.error(response.data);

            // Handle specific error messages from the backend
          }
        })
        .catch((error) => {
          console.error("Error:", error.response.data?.message);
          // notyf.error(error.response.data?.message);
          toast.error(error.response.data?.message);

        });
    }
  };
  const validateForm = () => {
    const formErrors = {};
    // if (!formData.mobileNumber) {
    //   formErrors.mobileNumber = "Mobile number is required.";
    // } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
    //   formErrors.mobileNumber = "Invalid mobile number.";
    // }

    if (!formData.email) {
      formErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Invalid email address.";
    }

    if (!formData.firstName) formErrors.firstName = "First name is required.";
    if (!formData.lastName) formErrors.lastName = "Last name is required.";
    if (!formData.businessName)
      formErrors.businessName = "Business name is required.";
    if (!formData.address1) formErrors.address1 = "Address 1 is required.";
    if (!formData.city) formErrors.city = "City is required.";
    if (!formData.state) formErrors.state = "State is required.";
    // if (!formData.category || formData.category === categories[0]) {
    //   formErrors.category = "Please select a valid category.";
    // }
    if (!formData.termsAccepted) {
      formErrors.termsAccepted = "You must accept the terms and conditions.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     alert("Form submitted successfully!");
  //   }
  // };

  // Fetch countries
  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    }); // Fetch countries directly
    // GetState(countryid).then((result) => {
    //   console.log(result);
    //   setStateList(result);
    // });
  }, [countryid]);

  function getState(id) {
    setCountryid(id);
    GetState(id).then((result) => {
      console.log(result);
      setStateList(result);
    });
  }

  // Fetch states when country changes
  // useEffect(() => {
  //   if (formData.country) {
  //     State.getStatesOfCountry(formData?.country) // Fetch states based on country
  //       .then((result) => {
  //         setStateList(result);
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           state: "", // Reset state when country changes
  //           city: "", // Reset city when country changes
  //         }));
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching states:", error);
  //       });
  //   }
  // }, [formData.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.state) {
      // GetCity(countryid, state.id).then((result) => {
      //   setCityList(result);
      // }); // Fetch cities based on country and state
    }
  }, [formData.state]);

  return (
    <form
      className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-2 pt-8">
        PERSONAL INFORMATION
      </h2>

      <div className="border-b-2 border-orange-500 mb-6"></div>
      {/* Personal Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Mobile Number <span className="text-red-500 text-xs">*</span>
          </label>
          <div className="flex">
            <span className="inline-block bg-gray-300 text-gray-700 text-xs py-2 px-3 border rounded-l-md">
              +91
            </span>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Mobile number"
              className="w-full border border-gray-300 rounded-r-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
            />
          </div>
          {errors.mobileNumber && (
            <p className="text-red-500 text-xs">{errors.mobileNumber}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email <span className="text-red-500 text-xs">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            First Name <span className="text-red-500 text-xs">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Last Name <span className="text-red-500 text-xs">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Category <span className="text-red-500 text-xs">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          >
            <option value="">Select a category</option>
            {roles
              ?.filter((role) => role.name !== "admin") // Exclude the "admin" role
              .map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Partner <span className="text-red-500 text-xs">*</span>
          </label>
          <select
            name="dist_id"
            value={formData.dist_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          >
            <option value="" disabled>
              Select a Partner
            </option>
            {distributors.map((category, index) => (
              <option key={index} value={category.user_id}>
                {category.userdist.name} ({category.phone})
              </option>
            ))}
          </select>
          {errors.product_id && (
            <p className="text-red-500 text-xs">{errors.product_id}</p>
          )}
        </div>
      </div>

      {/* Address Section */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2 pt-8">
        ADDRESS INFORMATION
      </h2>
      <div className="border-b-2 border-orange-500 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Business Name <span className="text-red-500 text-xs">*</span>
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Business name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
          {errors.businessName && (
            <p className="text-red-500 text-xs">{errors.businessName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Contact person Number{" "}
            <span className="text-red-500 text-xs">*</span>
          </label>
          <input
            type="text"
            name="contant_person"
            value={formData.contant_person}
            onChange={handleChange}
            placeholder="+918025"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
          {errors.contant_person && (
            <p className="text-red-500 text-xs">{errors.contant_person}</p>
          )}
        </div>

        {/* Address 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Address 1 <span className="text-red-500 text-xs">*</span>
          </label>
          <input
            type="text"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            placeholder="Address 1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
          {errors.address1 && (
            <p className="text-red-500 text-xs">{errors.address1}</p>
          )}
        </div>

        {/* Address 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Address 2
          </label>
          <input
            type="text"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            placeholder="Address 2"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Landmark */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Landmark
          </label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="Landmark"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            GST
          </label>
          <input
            type="text"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            placeholder="gst"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="">
          {/* Pincode */}
          <div className="mb-4">
            {/* <label className="block text-sm font-medium text-gray-600 mb-1 "> */}

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-md focus:ring focus:ring-blue-300 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-lg" />
                ) : (
                  <FaEye className="text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={(e) => {
              handleChange(e);
              setErrors((prevErrors) => ({ ...prevErrors, country: "" }));
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-xs">{errors.country}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={(e) => {
              handleChange(e);
              setErrors((prevErrors) => ({ ...prevErrors, state: "" }));
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-xs">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={(e) => {
              handleChange(e);
              setErrors((prevErrors) => ({ ...prevErrors, city: "" }));
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mt-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="text-blue-500"
          />
          <span className="ml-2 text-sm">
            I accept the{" "}
            <a href="/components/terrmcondition/" className="text-blue-500">
              terms and conditions
            </a>
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-red-500 text-xs">{errors.termsAccepted}</p>
        )}
      </div>

      <div className="mt-6 justify-end">
        <button
          type="submit"
          className="w-[20%] bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          Submit
        </button>
      </div>
    </form>
    // </form>
  );
};

export default RegistrationPage;
