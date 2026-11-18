'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Audience, Locale } from '@/lib/site';
import { href, partnerPortalUrl, tr } from '@/lib/site';
import { track } from '@/lib/analytics';
import { platforms, storeLinks } from '@/lib/launch';
import { AppleIcon, GooglePlayIcon } from './store-icons';

export type SiteActions = { locale: Locale; live: boolean; openWaitlist: (intent: Audience, source: string, city?: string) => void; waitlistJoined: () => void };
export const SiteContext = createContext<SiteActions | null>(null);
export function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error('Missing Lines site shell');
  return site;
}

export function WaitlistButton({ children, intent = 'rider', source, city, className = 'button primary', arrow = true }: { children: ReactNode; intent?: Audience; source: string; city?: string; className?: string; arrow?: boolean }) {
  const { openWaitlist, locale, live } = useSite();
  const label = live ? tr(locale,intent==='driver' ? ['Open driver app','Fahrer-App öffnen','Ouvrir l’app chauffeur'] : intent==='partner' ? ['Partner with Lines','Partner werden','Devenir partenaire'] : ['Open rider app','Fahrgast-App öffnen','Ouvrir l’app passager']) : children;
  return <button type="button" className={className} onClick={() => openWaitlist(intent,source,city)}>{label}{arrow && <ArrowRight size={17} aria-hidden="true" />}</button>;
}

export function PartnerButton({ className = 'button primary' }: { className?: string }) {
  const { locale } = useSite();
  return <a className={className} href={partnerPortalUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('partner_register_start',{ language:locale,source:'partner_gateway' })}>{tr(locale,['Explore Lines-trips','Lines-trips ansehen','Découvrir Lines-trips'])}<ArrowUpRight size={17} aria-hidden="true" /></a>;
}

export function LaunchText({ before, after }: { before: ReactNode; after: ReactNode }) {
  const { live } = useSite();
  return live ? after : before;
}

export function StoreButtons({ intent, compact = false }: { intent: 'rider' | 'driver'; compact?: boolean }) {
  const { locale, openWaitlist, live } = useSite();
  return <div className={`store-buttons ${compact ? 'store-compact' : ''}`}>{platforms.map((platform) => {
    const android = platform === 'google_play';
    const Icon = android ? GooglePlayIcon : AppleIcon;
    const name = android ? 'Google Play' : 'App Store';
    const label = <><Icon size={21} /><span><small>{tr(locale,live ? ['Open in','Öffnen im','Ouvrir sur'] : ['Coming to','Bald im','Bientôt sur'])}</small><b>{name}</b></span></>;
    function log() { track('app_store_click',{ platform, intent, phase:live ? 'live' : 'prelaunch', language:locale }); }
    return live ? <a key={platform} className="store-button" href={storeLinks[intent][platform]} onClick={() => { log(); track('deep_link_open',{platform,intent,language:locale}); }}>{label}</a> : <button key={platform} className="store-button" type="button" onClick={() => { log(); openWaitlist(intent,`store_${platform}`); }}>{label}</button>;
  })}</div>;
}

export function AudienceJump({ children, intent, section, className }: { children: ReactNode; intent: Audience; section: string; className: string }) {
  const { locale } = useSite();
  return <a className={className} href={`#${section}`} onClick={() => track('audience_card_click',{intent,language:locale})}>{children}</a>;
}
