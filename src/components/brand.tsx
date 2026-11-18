import Link from 'next/link';
import { href, type Locale } from '@/lib/site';

export function Brand({ locale, className = '', link = true, onDark = false }: { locale: Locale; className?: string; link?: boolean; onDark?: boolean }) {
  const artwork = <span className={`brand-art ${onDark ? 'brand-on-dark' : ''} ${className}`}>
    {/* Artwork is shared by the header, footer and every overlay. No duplicate inline mark. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="brand-dark" src="/logo/lines-dark.svg" alt="Lines" width="128" height="40" decoding="async" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="brand-light" src="/logo/lines-light.svg" alt="Lines" width="128" height="40" decoding="async" />
  </span>;
  return link ? <Link className="brand-link" href={href(locale)}>{artwork}</Link> : artwork;
}
