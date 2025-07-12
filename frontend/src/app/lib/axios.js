import Axios from "axios";

const axios = Axios.create({
  baseURL: " http://127.0.0.1:8000/api/",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "multipart/form-data",
  },
});

export default axios;

// export const reporturl=`https://brizindia.com`
export const reporturl=`http://localhost:3000`