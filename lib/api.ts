import axios from "axios";
import { AuthResponse, JobParams, LoginForm, RegisterForm } from "@/types";
import { useAuthStore } from "./store";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        const response = await axios.post("/api/auth/refresh", {
          refreshToken,
        });

        const { accessToken } = response.data;
        useAuthStore.getState().updateAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
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
    getAll: async (params: JobParams) => {
      console.log("params", params);

      return axiosInstance.get("/jobs", {
        params: {
          page: params.page,
          perPage: params.perPage,
          ...(params.search && {
            "search[field]": params.search.field,
            "search[query]": params.search.query,
          }),
          "orderBy[field]": params.orderBy?.field,
          "orderBy[direction]": params.orderBy?.direction,
        },
      });
    },
    getById: async (id: string) => {
      return axiosInstance.get(`/jobs/${id}`);
    },
    apply: async (id: string) => {
      return axiosInstance.post(`/jobs/${id}/apply`, null);
    },
    withdraw: async (id: string) => {
      return axiosInstance.post(`/jobs/${id}/withdraw`, null);
    },
  },
};
