import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // 401 esperado (logout, middleware, auth check)
    if (status === 401) {
      toast.warning("Sessão expirada ou inválida!");
    }

    return Promise.reject(error);
  },
);
