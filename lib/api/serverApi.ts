import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";
import { api } from "@/lib/api/api";

// server helpers - cookies may need to be forwarded via headers parameter
export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string,
  cookies?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  const res = await api.get<NotesResponse>(`/notes`, {
    params,
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res.data;
};

export const fetchNoteById = async (
  id: string,
  cookies?: string
): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res.data;
};

export const getMe = async (cookies?: string): Promise<User> => {
  const res = await api.get<User>("/users/me", {
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res.data;
};

export const checkSession = async (
  cookies?: string
): Promise<AxiosResponse<User> | null> => {
  const res = await api.get<User>("/auth/session", {
    headers: cookies ? { cookie: cookies } : undefined,
  });
  return res || null;
};
