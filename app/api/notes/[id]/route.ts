import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api, ApiError } from '../../api';
import { logErrorResponse } from '../../_utils/utils';

export async function GET(request: NextRequest, context: { params: any }) {
  try {
    const cookieStore = await cookies();
    const params = context.params;
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const res = await api.get(`/notes/${id}`, {
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

    console.error('Get note error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: any }) {
  try {
    const cookieStore = await cookies();
    const params = context.params;
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const res = await api.delete(`/notes/${id}`, {
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

    console.error('Delete note error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
