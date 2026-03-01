import type { Note, NewNote } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "@/lib/api/api";

/*
 * Client-side API helpers. These can be called from React components.
 */

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  const res = await api.get<NotesResponse>("/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const res = await api.post<Note>("/notes", note);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};

// auth / user
export const register = async (
  email: string,
  password: string
): Promise<User> => {
  const res = await api.post<User>("/auth/register", { email, password });
  return res.data;
};

export const login = async (
  email: string,
  password: string
): Promise<User> => {
  const res = await api.post<User>("/auth/login", { email, password });
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const res = await api.get<User>("/auth/session");
  return res.data || null;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

export const updateMe = async (data: Partial<User>): Promise<User> => {
  const res = await api.patch<User>("/users/me", data);
  return res.data;
};
