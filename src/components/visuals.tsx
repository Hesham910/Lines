import Image from 'next/image';
import { Activity, CalendarDays, ChartNoAxesColumnIncreasing, Check, MapPin, Plus } from 'lucide-react';
import { tr, type Locale } from '@/lib/site';

export const sampleOffers = [
  { price:'24.50', rating:'4.9', eta:3, class:'Standard' },
  { price:'27.00', rating:'4.8', eta:5, class:'Comfort' },
  { price:'30.20', rating:'4.9', eta:4, class:'Premium' },
] as const;

export function EarningsChart({ uid = 'chart', warm = false }: {uid?:string;warm?:boolean}) {
  const tone = warm ? '#EE7103' : '#A6D632';
  return <svg viewBox="0 0 280 123" fill="none" preserveAspectRatio="none" className="earnings-chart" aria-hidden="true"><defs><linearGradient id={`${uid}-fill`} x1="0" x2="0" y1="0" y2="1" gradientUnits="objectBoundingBox"><stop stopColor={tone} stopOpacity=".29"/><stop offset="1" stopColor={tone} stopOpacity="0"/></linearGradient></defs><path d="M1 15H279M1 46H279M1 77H279M1 108H279" stroke="currentColor" strokeWidth=".7" strokeDasharray="3 4" opacity=".27"/><path d="M1 104C23 102 31 93 47 95s27 11 47-8 31-33 52-21 33 19 52-8 37-46 51-36 19 6 30-7V123H1Z" fill={`url(#${uid}-fill)`}/><path d="M1 104C23 102 31 93 47 95s27 11 47-8 31-33 52-21 33 19 52-8 37-46 51-36 19 6 30-7" stroke={tone} strokeWidth="2.4" strokeLinecap="round"/><circle cx="247" cy="21" r="6" fill={tone} fillOpacity=".28"/><circle cx="247" cy="21" r="2.5" fill={tone}/></svg>;
}

export function DriverEditorial({locale}: {locale:Locale}) {
  return <div className="driver-editorial" aria-hidden="true"><span className="editorial-label mono"><Activity size={14}/> {tr(locale,['DRIVER / WALLET','FAHRER / WALLET','CHAUFFEUR / PORTEFEUILLE'])}</span><div className="driver-dash"><div className="visual-card-top"><span className="icon-tile"><ChartNoAxesColumnIncreasing size={21}/></span><div><strong>{tr(locale,['Earnings overview','Verdienstübersicht','Aperçu des gains'])}</strong><small>{tr(locale,['Weekly view · preview','Wochenansicht · Vorschau','Vue hebdomadaire · aperçu'])}</small></div></div><EarningsChart uid="driver-earnings" warm /><div className="chart-days mono"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span></div></div><div className="monday-card"><span className="icon-tile"><CalendarDays size={22}/></span><div><small>{tr(locale,['NEXT PAYOUT','NÄCHSTE AUSZAHLUNG','PROCHAIN VERSEMENT'])}</small><strong>{tr(locale,['Monday','Montag','Lundi'])}</strong></div><span className="payout-check"><Check size={17}/></span></div></div>;
}

export function SwissVisual() {
  return <div className="swiss-visual" aria-hidden="true"><Image src="/media/furka.webp" alt="" fill sizes="(max-width: 840px) 94vw, 630px" className="swiss-photo"/><div className="swiss-photo-tint"/><span className="editorial-label mono"><Plus size={13}/> CH · 46.82° N</span><Image src="/media/switzerland.svg" width={630} height={400} alt="" className="swiss-map" unoptimized/><span className="map-coordinate mono">SWISS NETWORK <MapPin size={13}/></span></div>;
}
