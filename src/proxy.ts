import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale } from '@/lib/site';

export function proxy(request: NextRequest) {
  const selected = request.cookies.get('lines_locale')?.value;
  const url = request.nextUrl.clone();
  url.pathname = `/${isLocale(selected) ? selected : defaultLocale}`;
  const response = NextResponse.redirect(url,307);
  response.headers.set('Cache-Control','private, no-store');
  return response;
}
export const config = { matcher:['/'] };
