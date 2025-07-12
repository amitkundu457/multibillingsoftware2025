"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const MembershipServiceRates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [serviceRates, setServiceRates] = useState([]);
  const [serviceGroup, setServiceGroup] = useState([]);
  const [groups, setGroups] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(""); // Track selected member
  const [formData, setFormData] = useState({
    id: "",
    group_id: "",
    service_type_id: "",
    service_type:"",
    membership_plan_id: "",
    service_rate: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serviceGroups, setServiceGroups] = useState([]);

  // Fetch service rates and groups
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [serviceRatesRes, groupsRes, serviceGroupsRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/membership-rate"),
        axios.get("http://127.0.0.1:8000/api/membershipidtype"),
        axios.get("http://127.0.0.1:8000/api/membership-groups"),
      ]);
  
      setServiceRates(serviceRatesRes.data);
      setGroups(groupsRes.data);
      setServiceGroups(serviceGroupsRes.data); // Assuming you have this state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  

  // Fetch membership plans when a member is selected
  const fetchPlans = async (memberId) => {
    if (!memberId) return;
    try {
      const response = await axios.get(` http://127.0.0.1:8000/api/membershipid/${memberId}`);
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching membership plans:", error);
    }
  };

  // Open Modal
  const openModal = (service = null) => {
    if (service) {
      setEditMode(true);
      setFormData(service);
      setSelectedMemberId(service.group_id); // Set selected member ID
      fetchPlans(service.group_id); // Fetch plans for existing service
    } else {
      setEditMode(false);
      setFormData({
        id: "",
        group_id: "",
        service_type: "",
        membership_plan_id: "",
        service_rate: "",
      });
      setPlans([]); // Reset plans
    }
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
    setPlans([]); // Reset plans
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
  
      // If a group is selected, update selectedMemberId and fetch plans
      if (name === "group_id") {
        setSelectedMemberId(value);
        fetchPlans(value); // Fetch plans based on selected group
      }
  
      // If a membership plan is selected, update service name and price
      if (name === "membership_plan_id") {
        const selectedPlan = plans.find(plan => plan.id === parseInt(value));
        if (selectedPlan) {
          updatedData = {
            ...updatedData,
            service_type: selectedPlan.name, // Update service name
            service_rate: selectedPlan.fees, // Update service rate
          };
        }
      }
  
      return updatedData;
    });
  };
  

  // Handle Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (editMode) {
        await axios.post(` http://127.0.0.1:8000/api/membership-service-rate/${formData.id}`, formData);
      } else {
        await axios.post(" http://127.0.0.1:8000/api/membership-rate", formData);
      }
      closeModal();
      fetchData();
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error saving data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Membership Service Rates</h2>

      {/* Add Button */}
      <button
        onClick={() => openModal()}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add New
      </button>
      
      {/* Table */}
      <table className="w-full border-collapse ">

        <thead className="border bg-[#16A34A] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Service Group
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Membership
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Service Type
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Rate
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700"></th>
          </tr>
        </thead>
        <tbody className="bg-slate-100">
  {serviceRates.map((service) => (
    <tr key={service.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
        {service.gname}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
        {service.mname}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
        {service.type_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
        ${service.fees}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 flex space-x-2">
        {/* Edit Button */}
        <button 
          onClick={() => openModal(service)} 
          className="bg-green-600 text-white px-3 py-1 rounded">
          Edit
        </button>

        {/* Delete Button */}
        <button 
          onClick={() => handleDelete(service.id)} 
          className="bg-red-600 text-white px-3 py-1 rounded">
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">{editMode ? "Edit Service Rate" : "Add Service Rate"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium">Service Group</label>
                <select
                  name="service_type_id"
                  value={formData.service_type_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Choose Service Group</option>
                  {serviceGroup.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                  
                </select>
                {errors.service_type && <p className="text-red-500">{errors.service_type}</p>}
              </div>
              <div>
                <label className="block font-medium">Select Membership </label>
                <select
                  name="group_id"
                  value={formData.group_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Choose Member</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.type_name}</option>
                  ))}
                </select>
                {errors.group_id && <p className="text-red-500">{errors.group_id}</p>}
              </div>

              {/* Membership Plan */}
              <div>
                <label className="block font-medium">Membership Plan</label>
                <select
                  name="membership_plan_id"
                  value={formData.membership_plan_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!selectedMemberId} // Disable if no member selected
                >
                  <option value="">Choose Plan</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name} - ${plan.fees}</option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
             

              {/* Service Rate */}
              <div>
                <label className="block font-medium">Service Name</label>
                <input
                  type="text"
                  name="service_rate"
                  value={formData.service_type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              </div>

              <div>
                <label className="block font-medium">Service Rate</label>
                <input
                  type="number"
                  name="service_rate"
                  value={formData.service_rate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {loading ? "Saving..." : editMode ? "Update" : "Create"}
                </button>
                <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipServiceRates;

