import { create } from 'zustand';
import { NewNote } from '../api/api';
import { NoteTag } from '@/types/note';
import { persist } from 'zustand/middleware';

interface NoteDraftStore {
  draft: NewNote;
  setDraft: (note: NewNote) => void;
  clearDraft: () => void;
}

const initialDraft: NewNote = {
  title: '',
  content: '',
  tag: NoteTag.Todo,
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
