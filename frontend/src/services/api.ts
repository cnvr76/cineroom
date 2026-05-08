import type { IMediaBrief, IMediaFull, MediaType } from "./types/media.types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${message || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
};

export const api = {
  media: {
    list: (page: number = 1, mediaType: MediaType | "all" = "all") =>
      request<IMediaBrief[]>(`/media?page=${page}&mediaType=${mediaType}`),
    byId: (id: string, mediaType: MediaType) =>
      request<IMediaFull | undefined>(`/media/${mediaType}/${id}`),
    search: (query: string) =>
      request<IMediaFull[]>(`/media/search?q=${encodeURIComponent(query)}`),
    toggleSave: (id: string) =>
      request<IMediaBrief | undefined>(`/media/${id}/save`),
  },
};
