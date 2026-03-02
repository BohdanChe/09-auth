import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api, ApiError } from '../../api';
import { logErrorResponse } from '../../_utils/utils';

export const dynamic = 'force-dynamic';

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
    if (isAxiosError(error)) {
      const err = error as ApiError;
      logErrorResponse(err?.response?.data);
      const status = err?.response?.status || 500;
      return NextResponse.json({ error: err.message, response: err?.response?.data }, { status });
    }

    console.error('User error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
    if (isAxiosError(error)) {
      const err = error as ApiError;
      logErrorResponse(err?.response?.data);
      const status = err?.response?.status || 500;
      return NextResponse.json({ error: err.message, response: err?.response?.data }, { status });
    }

    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
