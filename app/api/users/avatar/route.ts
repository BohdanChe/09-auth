import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Avatar file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image must be smaller than 2MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = file.name.includes(".")
      ? file.name.split(".").pop()
      : file.type.split("/").pop() || "png";
    const fileName = `avatar-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, fileName), buffer);

    const avatarUrl = `/uploads/${fileName}`;
    const cookieStore = await cookies();
    cookieStore.set("localAvatar", avatarUrl, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return NextResponse.json({ avatar: avatarUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}
