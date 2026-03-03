import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const about = cookieStore.get("localBio")?.value || "";
  return NextResponse.json({ about }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { about?: string };
    const about = (body.about || "").trim().slice(0, 500);

    const cookieStore = await cookies();
    cookieStore.set("localBio", about, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return NextResponse.json({ about }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to save about text" }, { status: 500 });
  }
}
