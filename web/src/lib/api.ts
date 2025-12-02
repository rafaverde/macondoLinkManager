import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const code = error.code;

      if (status === 401) {
        console.warn("Sessão expirada ou inválida!");
      }
    }
    return Promise.reject(error);
  },
);
