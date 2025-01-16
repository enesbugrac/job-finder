import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthResponse } from "@/types";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (auth: AuthResponse) => void;
  updateAccessToken: (token: string) => void;
  addApplication: (jobId: string) => void;
  removeApplication: (jobId: string) => void;
  logout: () => void;
}

interface FilterState {
  filters: {
    search: {
      field: string;
      query: string;
    };
    orderBy: {
      field: string;
      direction: "asc" | "desc";
    };
    page: number;
    perPage: number;
  };
  setFilters: (filters: FilterState["filters"]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (auth) => {
        set({
          user: auth.user,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
        });
        Cookies.set("accessToken", auth.accessToken);
      },
      updateAccessToken: (token) => {
        set({ accessToken: token });
        Cookies.set("accessToken", token);
      },
      addApplication: (jobId) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                appliedJobs: [...(state.user.appliedJobs || []), jobId],
              }
            : null,
        })),
      removeApplication: (jobId) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                appliedJobs: (state.user.appliedJobs || []).filter((id) => id !== jobId),
              }
            : null,
        })),
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        Cookies.remove("accessToken");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export const useFilterStore = create<FilterState>((set) => ({
  filters: {
    search: {
      field: "name",
      query: "",
    },
    orderBy: {
      field: "createdAt",
      direction: "desc",
    },
    page: 1,
    perPage: 10,
  },
  setFilters: (filters) => set({ filters }),
}));
