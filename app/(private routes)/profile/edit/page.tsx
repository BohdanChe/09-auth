"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import css from "./page.module.css";
import Image from "next/image";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getMe(),
      fetch("/api/users/about", { cache: "no-store" }).then((res) =>
        res.json() as Promise<{ about?: string }>
      ),
    ]).then(([u, aboutResponse]) => {
      setUsername(u.username);
      setEmail(u.email);
      setAvatar(u.avatar);
      setAbout(aboutResponse.about || "");
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let nextAvatar = avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const uploadRes = await fetch("/api/users/avatar", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = (await uploadRes.json()) as { error?: string };
          throw new Error(errorData.error || "Failed to upload photo");
        }

        const uploadData = (await uploadRes.json()) as { avatar: string };
        nextAvatar = uploadData.avatar;
        setAvatar(nextAvatar);
      }

      const aboutRes = await fetch("/api/users/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ about }),
      });

      if (!aboutRes.ok) {
        const aboutError = (await aboutRes.json()) as { error?: string };
        throw new Error(aboutError.error || "Failed to save about text");
      }

      const updated = await updateMe({ username });
      setUser({ ...updated, avatar: nextAvatar });
      router.push("/profile");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to update profile";
      setError(message);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) return <p>Loading...</p>;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
          </div>

          <div className={css.usernameWrapper}>
            <label htmlFor="avatar">Photo:</label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className={css.input}
              onChange={handleAvatarChange}
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.usernameWrapper}>
            <label htmlFor="about">About me:</label>
            <textarea
              id="about"
              className={css.textarea}
              placeholder="Напишіть кілька речень про себе..."
              value={about}
              maxLength={500}
              onChange={(e) => setAbout(e.currentTarget.value)}
            />
          </div>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
