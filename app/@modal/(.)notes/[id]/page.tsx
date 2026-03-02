import { fetchNoteById as getSingleNote } from "@/lib/api/serverApi";
import { headers } from "next/headers";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotePreviewClient from "./NotePreview.client";

interface NotesPreviewProps {
  params: Promise<{ id: string }>;
}
const NotesPreview = async ({ params }: NotesPreviewProps) => {
  const { id } = await params;

  const queryClient = new QueryClient();
  const cookieHeader = headers().get("cookie") || undefined;

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(id, cookieHeader),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
};

export default NotesPreview;
