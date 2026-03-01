import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const api = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export async function POST() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    await api.post('auth/logout', null, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    const err = error as any;
    console.error('Logout error:', err?.response?.data);
    return NextResponse.json(
      { error: err?.message, response: err?.response?.data },
      { status: err?.status || 500 }
    );
  }
}
