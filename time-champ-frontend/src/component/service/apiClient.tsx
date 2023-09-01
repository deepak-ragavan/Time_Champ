import axios from "axios";

const BASE_URL = "http://192.168.3.112:8088"

export default axios.create({
  // Later read this URL from an environment variable
  baseURL: BASE_URL
});

export const axiosPrivate =  axios.create({
  // Later read this URL from an environment variable
  baseURL: BASE_URL
});