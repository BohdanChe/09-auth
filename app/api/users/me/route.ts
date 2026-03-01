import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const api = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export async function GET() {
  try {
    const cookieStore = await cookies();
    const res = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: unknown) {
    const err = error as { response?: { data: unknown } };
    console.error('User error:', err?.response?.data);
    return NextResponse.json(
      { error: (error as Error)?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();
    const res = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieStore.toString(),
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: unknown) {
    const err = error as { response?: { data: unknown } };
    console.error('Update user error:', err?.response?.data);
    return NextResponse.json(
      { error: (error as Error)?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
