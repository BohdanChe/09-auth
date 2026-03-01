import type { Metadata } from "next";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Page Not Found | Note Hub",
  description: "The page you are looking for does not exist.",
  openGraph: {
    title: "Page Not Found | Note Hub",
    description: "The page you are looking for does not exist.",
    url: "https://notehub.example.com/not-found",
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

const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;
