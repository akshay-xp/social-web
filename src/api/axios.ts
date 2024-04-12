import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_REST_BASE_URL,
});

export const privateApi = axios.create({
  baseURL: import.meta.env.VITE_REST_BASE_URL,
  withCredentials: true,
});
