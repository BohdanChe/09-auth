import { getNotes } from "@/lib/api";
import { Metadata } from "next";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "all" ? "all" : slug[0];
  const tagDisplay = tag.charAt(0).toUpperCase() + tag.slice(1);

  return {
    title: `${tagDisplay} Notes | Note Hub`,
    description: `View all ${tag} notes in your Note Hub collection.`,
    openGraph: {
      title: `${tagDisplay} Notes | Note Hub`,
      description: `View all ${tag} notes in your Note Hub collection.`,
      url: `https://notehub.example.com/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Note Hub",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;

  const tagNote = slug[0] === "all" ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tagNote],
    queryFn: () => getNotes("", 1, tagNote),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section>
        <NotesClient tag={tagNote} />
      </section>
    </HydrationBoundary>
  );
}
