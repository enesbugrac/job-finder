import axios from "axios";
import { AuthResponse, LoginForm, RegisterForm } from "@/types";
import { useAuthStore } from "./store";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/api/auth/refresh", {
          refreshToken,
        });

        const { accessToken } = response.data;
        useAuthStore.getState().updateAccessToken(accessToken);
        localStorage.setItem("accessToken", accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token expired/invalid
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    login: (data: LoginForm) => axiosInstance.post<AuthResponse>("/auth/login", data),
    register: (data: RegisterForm) =>
      axiosInstance.post<AuthResponse>("/auth/register", data),
    refresh: (refreshToken: string) =>
      axiosInstance.post<AuthResponse>("/auth/refresh", { refreshToken }),
  },
  jobs: {
    getAll: async (params: any) => {
      const { accessToken } = useAuthStore.getState();
      return axios.get("/api/jobs", {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    getById: async (id: string) => {
      const { accessToken } = useAuthStore.getState();
      return axios.get(`/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    apply: async (id: string) => {
      const { accessToken } = useAuthStore.getState();
      return axios.post(`/api/jobs/${id}/apply`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    withdraw: async (id: string) => {
      const { accessToken } = useAuthStore.getState();
      return axios.post(`/api/jobs/${id}/withdraw`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
  },
};
