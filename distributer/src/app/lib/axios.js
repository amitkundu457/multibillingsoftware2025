import Axios from "axios";

const axios = Axios.create({
  baseURL: " https://apibrize.brizindia.com/api/",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "multipart/form-data",
  },
});

export default axios;