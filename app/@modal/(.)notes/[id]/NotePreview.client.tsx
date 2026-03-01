"use client";
import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import { getSingleNote } from "@/lib/api";
import { Note } from "@/types/note";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

const NotePreviewClient = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note | null>({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(id),
    refetchOnMount: false,
  });

  const handleClickBack = () => {
    router.back();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !note) return <p>Some error..</p>;

  return (
    <Modal onClose={handleClickBack}>
      <div className={css.container}>
        <button className={css.backBtn} onClick={handleClickBack}>
          Back
        </button>
        <h2 className={css.header}>{note.title}</h2>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          Created at: {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
