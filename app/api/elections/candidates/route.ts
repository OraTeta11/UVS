import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('[API] /api/elections/candidates GET (catch-all)', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  });
  return NextResponse.json({ error: 'This endpoint should not be called' }, { status: 400 });
} 