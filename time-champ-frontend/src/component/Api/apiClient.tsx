import axios from "axios";

const BASE_URL = "http://localhost:8080"

export default axios.create({
  // Later read this URL from an environment variable
  baseURL: BASE_URL
});

export const axiosPrivate =  axios.create({
  // Later read this URL from an environment variable
  baseURL: BASE_URL
});