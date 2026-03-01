import axios from "axios";

// common axios instance used by client and server helpers
const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true, // allow cookies
});
