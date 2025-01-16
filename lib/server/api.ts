import axios from "axios";
import { headers } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const serverAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const jobsApi = {
  getAll: async (searchParams?: URLSearchParams) => {
    const headersList = await headers();
    const token = headersList.get("authorization");

    if (!token) {
      throw new Error("No token provided");
    }

    return serverAxiosInstance.get("/jobs", {
      params: searchParams ? Object.fromEntries(searchParams) : undefined,
      headers: {
        Authorization: `Bearer ${token.replace("Bearer ", "")}`,
      },
    });
  },

  getById: async (id: string) => {
    const headersList = await headers();
    const token = headersList.get("authorization");

    if (!token) {
      throw new Error("No token provided");
    }

    return serverAxiosInstance.get(`/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token.replace("Bearer ", "")}`,
      },
    });
  },

  apply: async (id: string) => {
    const headersList = await headers();
    const token = headersList.get("authorization");

    if (!token) {
      throw new Error("No token provided");
    }

    return serverAxiosInstance.post(
      `/jobs/${id}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.replace("Bearer ", "")}`,
        },
      }
    );
  },

  withdraw: async (id: string) => {
    const headersList = await headers();
    const token = headersList.get("authorization");

    if (!token) {
      throw new Error("No token provided");
    }

    return serverAxiosInstance.post(
      `/jobs/${id}/withdraw`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.replace("Bearer ", "")}`,
        },
      }
    );
  },
};

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    return serverAxiosInstance.post("/login", data);
  },

  register: async (data: { email: string; password: string }) => {
    return serverAxiosInstance.post("/register", data);
  },
};

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return { error: "Unauthorized", status: 401 };
    }
    return {
      error: error.response?.data?.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
  return { error: "Internal server error", status: 500 };
};
