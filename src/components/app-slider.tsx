'use client';

// Auto-cycling device showcase. The centred frame stands upright and full
// colour; neighbours slide out of the container corners, tilted and
// desaturated. Every 2s a new frame enters while a progress ring runs
// around the centred one. Reduced motion keeps the first frame steady.
import { useEffect, useState } from 'react';

export type SliderItem = { src: string; alt: string };

const CYCLE = 2000;

export function AppSlider({ items, device = 'phone', label, className = '' }: {
  items: SliderItem[];
  device?: 'phone' | 'tablet';
  label?: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % items.length), CYCLE);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const n = items.length;
  return (
    <div className={`app-slider ${className}`.trim()} data-device={device} role="group" aria-label={label}>
      {items.map((item, index) => {
        let d = (index - active) % n;
        if (d < 0) d += n;
        if (d > n / 2) d -= n;
        const pos = d === 0 ? 'center' : d === 1 ? 'next' : d === -1 ? 'prev' : d === 2 ? 'next2' : d === -2 ? 'prev2' : 'far';
        return (
          <div key={item.src} className={`slider-card pos-${pos}`} data-in-view={d === 0 ? '' : undefined}>
            <span className="slider-frame">
              <span className="device-notch" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
