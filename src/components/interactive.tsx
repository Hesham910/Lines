'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { ArrowRight, Building2, CarFront, Check, Clock3, LockKeyhole, MapPin, Plus, Route, Search, Star, UsersRound } from 'lucide-react';
import { steps } from '@/content/home';
import { type FaqCategory, type FaqItem } from '@/content/faq';
import { audienceNames, audiences, href, legalTitles, region, tr, type Audience, type Locale } from '@/lib/site';
import { track } from '@/lib/analytics';
import { sampleOffers } from './visuals';
import { useWaitlistCount } from './site-shell';
import { WaitlistButton } from './site-context';

const icons = {rider:Route,driver:CarFront,partner:Building2};
export function HowSteps({ locale, initial = 'rider' }: { locale: Locale; initial?: Audience }) {
  const id = useId();
  const [active,setActive] = useState<Audience>(initial);
  const reduce = useReducedMotion();
  const tabNodes = useRef<(HTMLButtonElement|null)[]>([]);
  const timelineRef = useRef<HTMLDivElement|null>(null);
  const [timelineLive,setTimelineLive] = useState(false);
  const [cycle,setCycle] = useState(0);
  useEffect(() => { setCycle(0); }, [active]);
  useEffect(() => {
    if (!timelineLive) return undefined;
    const timer = window.setInterval(() => setCycle((value) => (value + 1) % 5), 5000);
    return () => window.clearInterval(timer);
  }, [timelineLive]);
  useEffect(() => {
    const node = timelineRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') { setTimelineLive(true); return undefined; }
    const observer = new IntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) { setTimelineLive(true); observer.disconnect(); } }, { threshold:.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key==='ArrowLeft') next = (index + audiences.length - 1) % audiences.length;
    else if (event.key==='ArrowRight') next=(index+1)%audiences.length;
    else if (event.key==='Home') next=0;
    else if (event.key==='End') next=audiences.length-1;
    else return;
    event.preventDefault(); setActive(audiences[next]); tabNodes.current[next]?.focus();
  }
  return <div className="how-interactive" ref={timelineRef}><div className="segmented" role="tablist" aria-label={tr(locale,['Choose how you use Lines','So nutzt du Lines','Comment utiliser Lines'])}>{audiences.map((item,index) => { const Icon=icons[item]; return <button key={item} ref={(node) => { tabNodes.current[index]=node; }} type="button" role="tab" id={`${id}-${item}`} aria-selected={active===item} aria-controls={`${id}-panel-${item}`} tabIndex={active===item ? 0 : -1} onKeyDown={(event) => keyboard(event,index)} onClick={() => setActive(item)}><Icon size={17} aria-hidden="true"/>{tr(locale,audienceNames[item])}</button>; })}</div>
    {audiences.map((item)=><div key={item} id={`${id}-panel-${item}`} role="tabpanel" tabIndex={active===item?0:-1} aria-labelledby={`${id}-${item}`} hidden={active!==item}>{active===item && <m.div initial={false} animate={reduce ? undefined : {y:[4,0]}} transition={{duration:.25}}><ol className={`step-timeline ${timelineLive ? 'tl-live' : ''}`}>{steps[item].map((step,index) => <li key={step.title[0]} className={`${cycle===index ? 'step-on' : ''} ${index>=cycle ? 'st-dim' : ''}`} style={{animationDelay:`${index*80}ms`}}><span className="st-node mono" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div className="st-body"><strong>{tr(locale,step.title)}</strong><p>{tr(locale,step.text)}</p></div></li>)}</ol>{item==='rider' ? <WaitlistButton className="text-link" source="how_rider">{tr(locale,['Get launch access','Zum Start vormerken','Me prévenir du lancement'])}</WaitlistButton> : <Link className="text-link" href={href(locale,item==='driver'?'driver':'partners')}>{tr(locale,item==='driver'?['Driver requirements','Voraussetzungen für Fahrer','Conditions chauffeurs']:['Partner guide','Leitfaden für Partner','Guide partenaires'])}<ArrowRight size={17} aria-hidden="true"/></Link>}</m.div>}</div>)}
  </div>;
}

export function OfferComparison({locale}: {locale:Locale}) {
  const [selected,setSelected] = useState(0);
  const id = useId();
  const offered = sampleOffers[selected];
  return <div className="compare-board"><div className="compare-head"><span className="icon-tile"><Route size={21} aria-hidden="true"/></span><div><strong>Zürich HB <ArrowRight size={14} aria-hidden="true"/> Zürich Flughafen</strong><small>{tr(locale,['Illustrative offers · not real fares','Beispielangebote · keine realen Fahrpreise','Offres illustratives · pas de tarifs réels'])}</small></div></div><fieldset className="compare-list"><legend className="sr-only">{tr(locale,['Compare example offers','Beispielangebote vergleichen','Comparez les offres d’exemple'])}</legend>{sampleOffers.map((offer,index) => <label key={offer.class} className="compare-offer"><input type="radio" name={`example-${id}`} checked={selected===index} onChange={() => setSelected(index)}/><span className="compare-deco"><CarFront size={20} aria-hidden="true"/></span><span className="compare-class"><b>{offer.class}</b><small><Star size={13} aria-hidden="true"/>{offer.rating} <span>·</span><Clock3 size={13} aria-hidden="true"/>{offer.eta} min</small></span><span className="compare-price mono">CHF <b>{offer.price}</b></span><span className="compare-tick"><Check size={15} aria-hidden="true"/></span></label>)}</fieldset><div className="compare-foot" role="status"><LockKeyhole size={16} aria-hidden="true"/>{tr(locale,['Example selection','Beispiel ausgewählt','Exemple sélectionné'])}: <b>{offered.class} · CHF {offered.price}</b></div></div>;
}

const categories = {rider:audienceNames.rider,driver:audienceNames.driver,partner:audienceNames.partner,safety:['Safety & privacy','Sicherheit & Datenschutz','Sécurité et confidentialité']} as const;
export function FaqList({locale, items, compact = false, search = false}: {locale: Locale; items: FaqItem[]; compact?:boolean;search?:boolean}) {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState<FaqCategory|'all'>('all');
  const normal = (value: string) => value.toLocaleLowerCase(region[locale]).normalize('NFD').replace(/\p{Diacritic}/gu,'');
  const matches = items.filter((item) => (category==='all' || item.category===category) && (!query.trim() || normal(`${tr(locale,item.q)} ${tr(locale,item.a)}`).includes(normal(query.trim()))));
  return <div className="faq-module">{search && <div className="faq-filter"><label className="faq-search"><Search size={20} aria-hidden="true"/><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label={tr(locale,['Search frequently asked questions','Häufige Fragen durchsuchen','Rechercher dans les questions'])} placeholder={tr(locale,['Search questions…','Fragen durchsuchen …','Rechercher une question…'])}/></label><div className="faq-categories"><button type="button" aria-pressed={category==='all'} onClick={() => setCategory('all')}>{tr(locale,['All topics','Alle Themen','Tous les sujets'])}</button>{Object.entries(categories).map(([key,title]) => <button type="button" key={key} aria-pressed={category===key} onClick={() => setCategory(key as FaqCategory)}>{tr(locale,title)}</button>)}</div></div>}
    {!matches.length && <p className="subtle" role="status">{tr(locale,['No matching questions. Try a different term.','Keine passenden Fragen. Versuche einen anderen Begriff.','Aucune question trouvée. Essayez un autre terme.'])}</p>}
    <div className={`faq-list ${compact ? 'faq-compact' : ''}`}>{matches.map((item) => { const link = item.link; const legal = link && Object.hasOwn(legalTitles,link); return <details key={item.id} className="faq-item" onToggle={(event) => { if (event.currentTarget.open) track('faq_open',{faq_id:item.id,category:item.category,language:locale}); }}><summary><span>{tr(locale,item.q)}</span><span className="faq-plus"><Plus size={18} aria-hidden="true"/></span></summary><div className="faq-answer"><p>{tr(locale,item.a)}</p>{link && <Link className="text-link" href={href(locale,legal ? `legal/${link}` : link)}>{legal ? tr(locale,legalTitles[link as keyof typeof legalTitles]) : tr(locale,['Learn more','Mehr erfahren','En savoir plus'])}<ArrowRight size={15} aria-hidden="true"/></Link>}</div></details>; })}</div>
  </div>;
}

export function WaitlistProof({locale, hero = false}: {locale: Locale; hero?:boolean}) {
  if (!hero) return null;
  const count=useWaitlistCount();
  const amount=count && count > 0 ? new Intl.NumberFormat(region[locale]).format(count) : '';
  return amount ? <span className="hero-proof-item"><UsersRound size={15} aria-hidden="true"/>{amount} {tr(locale,['on the waitlist','auf der Warteliste','sur la liste'])}</span> : null;
}
