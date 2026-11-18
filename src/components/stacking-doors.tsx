'use client';

// "Three ways to move." as stacked, pinning cards with an editorial layout:
// a huge outlined index numeral, wide headline block, a large audience
// tile on the right, three fact chips on a hairline footer row and the
// call to action (partner carries a real button into /partners).
import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Building2, CarFront, Check, Route } from 'lucide-react';
import { doors, hero } from '@/content/home';
import { href, tr, waitlistLabels, type Locale, type LocalText } from '@/lib/site';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { WaitlistButton } from './site-context';

const doorIcons = [Route, CarFront, Building2];
const roleNames: Record<string, LocalText> = {
  rider: ['Rider', 'Fahrgast', 'Passager'],
  driver: ['Driver', 'Fahrer', 'Chauffeur'],
  partner: ['Partner', 'Partner', 'Partenaire'],
};
const doorPoints: LocalText[][] = [
  [['Name your price, compare offers', 'Nenne deinen Preis, vergleiche', 'Proposez ou comparez'],
   ['Book from 1 hour ahead', 'Ab 1 Stunde Vorlauf', 'Dès 1 heure à l’avance'],
   ['Upfront, agreed prices', 'Vereinbarte Preise vorab', 'Prix convenus à l’avance']],
  [['See earnings before the ride', 'Verdienst vor der Fahrt sehen', 'Gains visibles avant la course'],
   ['Weekly payouts on Mondays', 'Auszahlung jeden Montag', 'Versements le lundi'],
   ['Fair queue zones', 'Faire Wartezonen', 'Files équitables']],
  [['Guest rides in a few taps', 'Gästefahrten in wenigen Schritten', 'Courses clients en quelques gestes'],
   ['Commission shown upfront', 'Provision vorab sichtbar', 'Commission affichée avant'],
   ['Monthly payouts', 'Monatliche Auszahlung', 'Versements mensuels']],
];

export function StackingDoors({ locale }: { locale: Locale }) {
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const slots = slotRefs.current;
      for (let i = 0; i < slots.length - 1; i++) {
        const card = cardRefs.current[i];
        const next = slots[i + 1];
        if (!card || !next) continue;
        const nextRect = next.getBoundingClientRect();
        const offset = Math.max(0, Math.min(1, 1 - nextRect.top / Math.max(1, window.innerHeight * 0.9)));
        card.style.transform = `scale(${1 - offset * 0.07}) translateY(${-offset * 14}px)`;
        card.style.filter = `brightness(${1 - offset * 0.28})`;
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div className="stack-deck">
    {doors.map((item, index) => {
      const Icon = doorIcons[index];
      return <div key={item.intent} className="stack-slot" ref={(node) => { slotRefs.current[index] = node; }}>
        <div className={`stack-card stack-${item.intent}`} ref={(node) => { cardRefs.current[index] = node; }}>
          <a
            className="stack-jump"
            href={`#${item.section}`}
            onClick={() => track('audience_card_click', { intent: item.intent, language: locale })}
            aria-label={tr(locale, item.title)}
          >
            <span className="stack-num mono" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div className="stack-copy">
              <span className="stack-kicker mono">0{index + 1} / {tr(locale, roleNames[item.intent])}</span>
              <h3>{tr(locale, item.title)}</h3>
              <p>{tr(locale, item.text)}</p>
            </div>
            <div className="stack-visual" aria-hidden="true"><Icon strokeWidth={1.4} /></div>
          </a>
          <div className="stack-foot">
            <ul className="stack-points">
              {doorPoints[index].map((point) => <li key={point[0]}><Check size={13} aria-hidden="true" />{tr(locale, point)}</li>)}
            </ul>
          </div>
          <div className="stack-bottom">
            {item.intent === 'partner'
              ? <Link className="text-link" href={href(locale, 'partners')}>{tr(locale, hero.partner)}<ArrowUpRight size={17} aria-hidden="true" /></Link>
              : <WaitlistButton intent={item.intent} source="audience_card" className="text-link">{tr(locale, waitlistLabels[item.intent])}</WaitlistButton>}
            <span className="stack-hint mono"><ArrowDown size={13} aria-hidden="true" /></span>
          </div>
        </div>
      </div>;
    })}
  </div>;
}
