"use client";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}
export default function Modal({ onClose, children }: ModalProps) {
  const router = useRouter();

  onClose = () => router.back();
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button type="button" className={css.closeBtn} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

// "use client";

// import { useRouter } from "next/navigation";

// type Props = {
//   children: React.ReactNode;
//   onClose: () => void;
// };

// const Modal = ({ children }: Props) => {
//   const router = useRouter();

//   const close = () => router.back();

//   return (
//     <div>
//       <div>
//         {children}
//         <button onClick={close}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default Modal;
