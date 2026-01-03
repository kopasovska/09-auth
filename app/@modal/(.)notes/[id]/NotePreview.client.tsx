'use client';

import Modal from '@/components/Modal/Modal';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import css from './NotePreview.module.css';
import { fetchNoteById } from '@/lib/api/clientApi';

const NotePreview = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const close = () => router.back();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;

  const date = new Date(note.createdAt);
  const formattedDate = date.toLocaleString('pl-PL');

  return (
    <Modal onClose={close}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <span className={css.detailsWrapper}>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.date}>Created at: {formattedDate}</p>
        </span>
      </div>
    </Modal>
  );
};

export default NotePreview;
