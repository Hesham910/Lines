'use client';

// City page timeline: as you scroll, the active step advances, the track
// fills, and the phone frame beside it swaps its screenshot with a fade.
import { useEffect, useRef, useState } from 'react';
import { steps } from '@/content/home';
import { riderScreens } from '@/content/screens';
import { tr, type Locale } from '@/lib/site';

export function CityTimeline({ locale }: { locale: Locale }) {
  const [idx, setIdx] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const items = steps.rider;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setIdx(Number((entry.target as HTMLElement).dataset.index ?? 0));
      }
    }, { rootMargin: '-44% 0px -44% 0px', threshold: 0 });
    itemRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const n = items.length;
  return <div className="city-tl">
    <div className="ct-track" aria-hidden="true">
      <span className="ct-base" />
      <span className="ct-fill" style={{ transform: `scaleY(${(idx + 1) / n})` }} />
    </div>
    <ol className="ct-list">
      {items.map((step, index) => <li key={step.title[0]} data-index={index} data-on={index <= idx ? '' : undefined} ref={(node) => { itemRefs.current[index] = node; }}>
        <span className="ct-node mono">{String(index + 1).padStart(2, '0')}</span>
        <div className="ct-copy"><strong>{tr(locale, step.title)}</strong><p>{tr(locale, step.text)}</p></div>
      </li>)}
    </ol>
    <figure className="ct-phone" aria-hidden="true">
      <span className="ct-notch" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={idx} src={riderScreens[idx % riderScreens.length].src} alt="" draggable={false} />
      <span className="ct-home" />
    </figure>
  </div>;
}
