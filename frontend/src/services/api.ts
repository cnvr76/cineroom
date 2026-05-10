import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { IMediaBrief, IMediaFull, MediaType } from "./types/media.types";
import { authService } from "./authService";
import type {
  ChangeMeFormData,
  ChangeUserFormData,
  IUser,
  IUserFull,
} from "./types/user.types";
import type { LoginFormData, SignupFormData } from "./types/auth.types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const request = async <T>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const { data } = await apiClient.request<T>({ url: path, ...config });
    return data;
  } catch (error) {
    const e = error as AxiosError<{ message?: string }>;
    const status = e.response?.status ?? "??";
    const message = e.response?.data?.message ?? e.message ?? "Request failed";
    throw new Error(`HTTP ${status}: ${message}`);
  }
};

export const api = {
  media: {
    list: (page: number = 1, mediaType: MediaType | "all" = "all") =>
      request<IMediaBrief[]>(`/media?page=${page}&type=${mediaType}`),
    byId: (id: string, mediaType: MediaType) =>
      request<IMediaFull | undefined>(`/media/${mediaType}/${id}`),
    search: (query: string) =>
      request<IMediaFull[]>(`/media/search?q=${encodeURIComponent(query)}`),
    markFavorite: (id: string) =>
      request<{ saved: boolean }>(`/media/${id}/save`, { method: "POST" }),
    unmarkFavorite: (id: string) =>
      request<{ saved: boolean }>(`/media/${id}/save`, { method: "DELETE" }),
    favorites: {
      list: (page: number = 1, mediaType: MediaType | "all" = "all") =>
        request<IMediaBrief[]>(
          `/media/me/favorites?page=${page}&type=${mediaType}`,
        ),
      search: (query: string) =>
        request<IMediaFull[]>(
          `/media/me/favorites/search?q=${encodeURIComponent(query)}`,
        ),
    },
  },

  auth: {
    login: (data: LoginFormData) =>
      request<{ access_token: string }>("/auth/login", {
        method: "POST",
        data,
      }),
    signup: (data: SignupFormData) =>
      request<IUser>("/auth/signup", { method: "POST", data }),
  },

  user: {
    list: () => request<IUserFull[]>("/users"),
    me: () => request<IUserFull>("/users/me"),
    updateMe: (data: ChangeMeFormData) =>
      request<IUserFull>("/users/me", { method: "PATCH", data }),
    updateUser: (userId: string, data: ChangeUserFormData) =>
      request<IUserFull>(`/users/${userId}`, { method: "PATCH", data }),
  },
};
