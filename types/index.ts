export interface User {
  id: string;
  email: string;
  name: string;
  profileImage: string;
  appliedJobs: string[];
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  user: User;
}

export interface Job {
  id: string;
  companyName: string;
  description: string;
  name: string;
  createdAt: string;
  location: string;
  salary: number;
  keywords: string[];
}

export interface JobsResponse {
  data: Job[];
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
}

export interface ApplicationResponse {
  message: string;
}

export interface JobFilters {
  page?: number;
  perPage?: number;
  searchField?: string;
  searchQuery?: string;
  orderByField?: string;
  orderByDirection?: "asc" | "desc";
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  name: string;
}

export interface JobResponse {
  data: Job;
}
