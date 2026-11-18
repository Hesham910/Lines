'use client';

// Vertical feature rows: icon frame (no stroke) beside the title, one-line
// description under it. Hovering a row replays the hero cyber effect —
// glare follows the pointer, the card tilts softly, brackets and a scan
// line light up — and the hovered row rises above its siblings.
import { Check } from 'lucide-react';
import { tr, type Locale, type LocalText } from '@/lib/site';

export function PointRows({ locale, points, icons, warm = false }: { locale: Locale; points: { title: LocalText; text: LocalText }[]; icons: (typeof Check)[]; warm?: boolean }) {
  function move(event: React.PointerEvent<HTMLLIElement>) {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    el.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
  }
  function reset(event: React.PointerEvent<HTMLLIElement>) {
    const el = event.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }
  return <ul className={`point-rows ${warm ? 'point-rows--warm' : ''}`}>
    {points.map((point, index) => {
      const Icon = icons[index % icons.length];
      return <li key={point.title[0]} onPointerMove={move} onPointerLeave={reset}>
        <div className="pr-inner">
          <span className="pr-icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
          <div className="pr-copy"><strong>{tr(locale, point.title)}</strong><p>{tr(locale, point.text)}</p></div>
          <span className="pr-fx" aria-hidden="true"><i className="pr-glare" /><i className="pr-c pr-c1" /><i className="pr-c pr-c2" /><i className="pr-c pr-c3" /><i className="pr-c pr-c4" /><i className="pr-scan" /></span>
        </div>
      </li>;
    })}
  </ul>;
}
