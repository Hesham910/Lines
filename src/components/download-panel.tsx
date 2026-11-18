'use client';

import { QRCodeSVG } from 'qrcode.react';
import { ArrowUpRight } from 'lucide-react';
import { AppleIcon, GooglePlayIcon } from './store-icons';
import { platforms, storeLinks, type AppAudience } from '@/lib/launch';
import { track } from '@/lib/analytics';
import { tr, type Locale } from '@/lib/site';

export function DownloadPanel({ locale, intent }: {locale:Locale;intent:AppAudience}) {
  return <div className="download-options">{platforms.map((platform)=>{
    const android=platform==='google_play';
    const Icon=android ? GooglePlayIcon : AppleIcon;
    const name=android ? 'Google Play' : 'App Store';
    const url=storeLinks[intent][platform];
    return <div key={platform}><QRCodeSVG className="download-qr" value={url} size={116} marginSize={4} title={`${name} · Lines`} /><a href={url} className="button secondary" onClick={()=>{track('app_store_click',{intent,platform,phase:'live',language:locale});track('deep_link_open',{intent,platform,language:locale});}}><Icon size={17} aria-hidden="true"/>{tr(locale,[`Open in ${name}`,`Im ${name} öffnen`,`Ouvrir sur ${name}`])}<ArrowUpRight size={15} aria-hidden="true"/></a></div>;
  })}</div>;
}
