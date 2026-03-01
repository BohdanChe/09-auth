"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { getNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import EmptyState from "@/components/EmptyState/EmptyState";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 300);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    updateSearchQuery(newValue);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["notes", searchQuery, page, tag],
    queryFn: () => getNotes(searchQuery, page, tag),
    placeholderData: (oldData) => oldData,
  });

  const currentTotalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleInputChange} />

        {currentTotalPages > 1 && (
          <Pagination
            totalPages={currentTotalPages}
            page={page}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isLoading && <p>Loading...</p>}

      {data && !isLoading && data.notes.length === 0 && (
        <EmptyState message="No notes found." />
      )}
    </div>
  );
}
