// Example using axios
import axios from "axios";

const backendBaseUrl = import.meta.env.VITE_BACKEND_API_BASE_URL;
export const client = axios.create({
  baseURL: backendBaseUrl,
  timeout: 5000,
  headers: { "X-Custom-Header": "my-custom-value" },
});
