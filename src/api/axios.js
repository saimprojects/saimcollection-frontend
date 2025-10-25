import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          const { data } = await axios.post(
            `${BASE_URL}/auth/token/refresh/`,
            { refresh }
          );
          localStorage.setItem("access", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch (e) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
