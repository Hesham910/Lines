'use client';

// Timeline layout with an animated SVG track that fills as you scroll.
// Each step pairs its copy with a landscape tablet frame whose screenshot
// lives in /public/media and can be swapped freely.
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { tr, type Locale } from '@/lib/site';

export type TimelineItem = { title: string; text: string; image: string };

export function LaunchTimeline({ locale, items }: { locale: Locale; items: TimelineItem[] }) {
  const pathRef = useRef<SVGPathElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setProgress(1); return; }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const track = trackRef.current;
      const path = pathRef.current;
      if (!track || !path) return;
      const rect = track.getBoundingClientRect();
      const anchor = window.innerHeight * 0.72;
      const value = Math.max(0, Math.min(1, (anchor - rect.top) / Math.max(1, rect.height)));
      setProgress(value);
      const length = path.getTotalLength();
      path.style.strokeDashoffset = `${length * (1 - value)}`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    measure();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduce]);

  return <div className="timeline" ref={trackRef}>
    <svg className="timeline-track" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 0 V100" className="timeline-track-base" pathLength={100} />
      <path ref={pathRef} d="M2 0 V100" className="timeline-track-fill" pathLength={100} />
    </svg>
    <ol className="timeline-list">
      {items.map((item, index) => {
        const reached = reduce || progress >= (index / Math.max(1, items.length - 1)) - 0.02;
        return <li key={item.title} className={`timeline-item ${index % 2 ? 'timeline-item--flip' : ''}`} data-reached={reached ? '' : undefined}>
          <span className="timeline-node" aria-hidden="true"><i /></span>
          <div className="timeline-copy">
            <span className="mono timeline-step">{String(index + 1).padStart(2, '0')} / {tr(locale, ['Step', 'Schritt', 'Étape'])}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
          <figure className="tablet-frame" aria-hidden="true">
            <span className="tablet-notch" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt="" loading="lazy" decoding="async" draggable={false} />
          </figure>
        </li>;
      })}
    </ol>
  </div>;
}
