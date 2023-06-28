import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.has('code') ? searchParams.get('code') : null;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_AUTH_URL,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
