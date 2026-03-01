import { ReactNode } from "react";
import css from "./layoutNotes.module.css";


interface Props {
  children: ReactNode;
  sidebar: ReactNode;
}
const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
};

export default NotesLayout;
