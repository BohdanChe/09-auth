'use server';

import { redirect } from 'next/navigation';
import { createNote } from '@/lib/api/clientApi';
import { NewNote, NOTE_TAGS, type NoteTag } from '@/types/note';

export async function createNoteAction(formData: FormData) {
  const title = formData.get('title')?.toString() || '';
  const content = formData.get('content')?.toString() || '';
  const tagValue = formData.get('tag')?.toString();

  if (!title) {
    throw new Error('Title is required');
  }

  if (!tagValue || !NOTE_TAGS.includes(tagValue as NoteTag)) {
    throw new Error('Invalid tag');
  }

  if (NOTE_TAGS.includes(tagValue as NoteTag)) {
    const tag: NoteTag = tagValue as NoteTag;

    const newNote: NewNote = {
      title,
      content,
      tag,
    };

    await createNote(newNote);
  }

  redirect('/notes/filter/all');
}
