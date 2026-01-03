import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common[
  'Authorization'
] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

interface FetchNotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string,
): Promise<FetchNotesHttpResponse> => {
  const response = await axios.get<FetchNotesHttpResponse>('/notes', {
    params: {
      search,
      tag,
      page,
      perPage: 12,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: Note['id']): Promise<Note> => {
  const { data } = await axios.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await axios.post<Note>('/notes', newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};
