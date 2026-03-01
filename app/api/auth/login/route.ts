import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { parse } from 'cookie';

const api = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/login', body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: Number(parsed['Max-Age']),
        };
        if (parsed.accessToken) cookieStore.set('accessToken', parsed.accessToken, options);
        if (parsed.refreshToken) cookieStore.set('refreshToken', parsed.refreshToken, options);
      }

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    const err = error as any;
    console.error('Login error:', err?.response?.data);
    return NextResponse.json(
      { error: err?.message, response: err?.response?.data },
      { status: err?.status || 500 }
    );
  }
}
