import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const api = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { pathname } = request.nextUrl;
    const id = pathname.split('/').pop();

    const res = await api.get(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: unknown) {
    console.error('Get note error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { pathname } = request.nextUrl;
    const id = pathname.split('/').pop();

    const res = await api.delete(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: unknown) {
    console.error('Delete note error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
