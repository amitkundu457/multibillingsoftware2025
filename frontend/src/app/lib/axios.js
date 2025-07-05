import Axios from "axios";

const axios = Axios.create({
  baseURL: " https://api.equi.co.in/api/",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "multipart/form-data",
  },
});

export default axios;

// export const reporturl=`https://brizindia.com`
export const reporturl=`http://localhost:3000`