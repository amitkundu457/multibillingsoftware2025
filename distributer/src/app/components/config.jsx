import apiClient from "@/app/lib/axios";

// const apiClient = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
// });

// console.log(apiClient.get('https://google.com'))

export const baseImageURL = "http://127.0.0.1:8000/";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
};

// Ecosystems API Endpoints
export const getEcosystems = () => apiClient.get("ecosystems");
export const createEcosystem = (data) => apiClient.post("ecosystems", data);
export const updateEcosystem = (id, data) =>
  apiClient.post(`ecosystems/update/${id}`, data);
export const deleteEcosystem = (id) => apiClient.delete(`ecosystems/${id}`);

// Solutions API Endpoints
export const getSolutions = () => apiClient.get("solutions");
export const createSolution = (data) => apiClient.post("solutions", data);
export const updateSolution = (id, data) =>
  apiClient.post(`solutions/update/2`, data);
export const deleteSolution = (id) => apiClient.delete(`solutions/${id}`);

// Brands API Endpoints
export const getBrands = () => apiClient.get("brands");
export const createBrand = (data) => apiClient.post("brands", data);
export const updateBrand = (id, data) =>
  apiClient.post(`brands/update/${id}`, data);
export const deleteBrand = (id) => apiClient.delete(`brands/${id}`);

// Products API Endpoints
export const getProducts = () => apiClient.get("products");
export const createProduct = (data) => apiClient.post("products", data);
export const updateProduct = (id, data) =>
  apiClient.post(`products/${id}`, data);
export const deleteProduct = (id) => apiClient.delete(`products/${id}`);

//tabs api
export const getTabs = () => apiClient.get("tabs");
export const createTabs = (data) => apiClient.post("tabs", data);
export const updateTabs = (id, data) =>
  apiClient.post(`tabs/update/${id}`, data);
export const deleteTabs = (id) => apiClient.delete(`tabs/${id}`);
//Services api
export const getServices = () => apiClient.get("services");
export const createServices = (data) => apiClient.post("services", data);
export const updateServices = (id, data) =>
  apiClient.post(`services/update/${id}`, data);
export const deleteServices = (id) => apiClient.delete(`services/${id}`);

//Slider api

export const getSliders = () => apiClient.get("sliders");
export const createSliders = (data) => apiClient.post("sliders", data);
export const updateSliders = (id, data) =>
  apiClient.post(`sliders/update/${id}`, data);
export const deleteSliders = (id) => apiClient.delete(`sliders/${id}`);

//salesService

export const getSalesServices = () => apiClient.get("salesassign");
export const createSalesServices = (data) =>
  apiClient.post("salesassign", data);
export const updateSalesServices = (id, data) =>
  apiClient.post(`salesassign/${id}`, data);
export const deleteSalesServices = (id) =>
  apiClient.delete(`salesassign/delete/${id}`);

export const getemployees = () => apiClient.get("employees");
export const creategetemployees = (data) => apiClient.post("salesassign", data);
export const updategetemployees = (id, data) =>
  apiClient.post(`salesassign/${id}`, data);
export const deletegetemployees = (id) =>
  apiClient.delete(`salesassign/delete/${id}`);

export const getSaleproduct = () => apiClient.get("sale-products");
export const creategetSaleproduct = (data) =>
  apiClient.post("sale-products", data);
export const updategetSaleproduct = (id, data) =>
  apiClient.post(`sale-products/${id}`, data);
export const deletegetSaleproduct = (id) =>
  apiClient.delete(`sale-products/${id}`);

export const getDistrubuters = () => apiClient.get("distrubuters");
export const createDistrubuter = (data) => apiClient.post("distrubuters", data);
export const updateDistrubuter = (id, data) =>
  apiClient.post(`distrubuters/${id}`, data);
export const deleteDistrubuter = (id) => apiClient.delete(`distrubuters/${id}`);

export const getCustomertype = () => apiClient.get("customerstype");
export const createCustomertype = (data) =>
  apiClient.post("customerstype", data);
export const updateCustomertype = (id, data) =>
  apiClient.post(`customerstype/${id}`, data);
export const deleteCustomertype = (id) =>
  apiClient.delete(`customerstype/${id}`);

export const customersubtypes = () => apiClient.get("customersubtypes");
export const createCustomersubtype = (data) =>
  apiClient.post("customersubtypes", data);
export const updateCustomersubtype = (id, data) =>
  apiClient.post(`customersubtypes/${id}`, data);
export const deleteCustomersubtype = (id) =>
  apiClient.delete(`customersubtypes/${id}`);

export const getCoin = () => apiClient.get("coin");
export const createCoin = (data) => apiClient.post("coin", data);
export const updateCoin = (id, data) => apiClient.post(`coin/${id}`, data);
export const deleteCoin = (id) => apiClient.delete(`coin/${id}`);
// export const displayCoin = () => {
 
//   const token = getCookie("access_token");
//   console.log(token);
  

//   if (!token) {
//     throw new Error("Access token not found");
//     console.log("no token");
    
//   }

//   return apiClient.get("coinid/", {
//     headers: {
//       Authorization: `Bearer ${token}` // Corrected syntax
//     }
//   });
// };



export const getProductService = () => {
  // Retrieve the access token from cookies
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("Access token is missing. Please log in.");
  }

  // Make the API call with the Authorization header
  return apiClient.get("product-services", {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};
export const createProductService = (data) =>
  {const token = getCookie("access_token");
  apiClient.post("product-services", data,{
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  })};
export const updateProductService = (id, data) =>
  apiClient.post(`product-services/${id}`, data);
export const deleteProductService = (id) => 
  apiClient.delete(`product-services/${id}`);

export const getphoneSearch = (phone) =>
  apiClient.get(`customers/search`, { params: { phone } });

export const getBillno = () => apiClient.get(`bill-no`);
// export const getBillno = () => apiClient.get(`/bill-no`, );

export const getStock = () => apiClient.get("stocks");
export const getcompany = () => apiClient.get("company");
export const getServiceGroup = () => apiClient.get("product-service-groups");
export const getType = () => apiClient.get("type");

export const StoreAccount = (data) => {
  const token = getCookie("access_token"); // Retrieve the token
  return apiClient.post(`accounts`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

export const getGraphview = () => {
  const token = getCookie("access_token"); // Retrieve the token

  return apiClient.get("graphview", {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

export const StoreAccountMaster = (data) => {
  const token = getCookie("access_token"); // Retrieve the token
  return apiClient.post(`account-masters`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

export const getAccountMaster = (data) => {
  const token = getCookie("access_token");
  return apiClient.get(`account-masters`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAccount = (data) => {
  const token = getCookie("access_token");
  return apiClient.get(`accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getAssigndistributer = (data) => {
  const token = getCookie("access_token");
  return apiClient.get(`distributer-assign`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const clientReport = ({ start_date, end_date }) => {
  const token = getCookie("access_token");
  return apiClient.get(`client-report`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      start_date, // Dynamically pass start_date
      end_date, // Dynamically pass end_date
    },
  });
};

export const UpdateAccount = (id, data) => {
  const token = getCookie("access_token"); // Retrieve the token
  return apiClient.post(`accounts/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

export const DeleteAccount = (id, data) => {
  const token = getCookie("access_token"); // Retrieve the token
  return apiClient.delete(`accounts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

export const getRate = (data) => apiClient.get("rate");
export const getLogo = (data) => apiClient.get("master");
export const getcreateogo = (data) => apiClient.post("master-update", data);
// export const getRate = (data) => apiClient.get('product-services');

export const createAccountGroup = (data) =>
  apiClient.post("account-groups", data);
export const getAccountGroup = () => apiClient.get("account-groups");

export const createNewStock = (data) => apiClient.post("stock", data);
export const destroyStock = (id) => apiClient.delete(`stock/${id}`);

export const getPurchase = () => apiClient.get("purchase");
export const createNewPurchase = (data) => apiClient.post("purchase", data);
export const updatePurchase = (id, data) =>
  apiClient.put(`purchase/${id}`, data);
export const deletePurchase = (id) => apiClient.delete(`purchase/${id}`);

export const getKarigari = () => apiClient.get("karigari");
export const createNewKarigari = (data) => apiClient.post("karigari", data);
export const getSingleKarigari = (id) => apiClient.get(`karigari/${id}`);
export const updateExistingKarigari = (id, data) => apiClient.put(`karigari/${id}`, data);
export const deleteKarigari = (id) => apiClient.delete(`karigari/${id}`);
export const displayCoin = () => {
  const token = getCookie("access_token");
  const headers = {
    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
  };
  return apiClient.get("coinid", { headers });
};
