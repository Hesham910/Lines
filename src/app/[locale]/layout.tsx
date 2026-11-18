import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '@fontsource-variable/manrope';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource-variable/noto-sans-arabic';
import '../globals.css';
import '../visuals.css';
import '../landing.css';
import '../pages.css';
import { defaultLocale, isLocale, locales, region, siteDescription, siteOrigin, tr } from '@/lib/site';
import { SiteShell } from '@/components/site-shell';

export function generateStaticParams() { return locales.map((locale)=>({locale})); }
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> {
  const { locale:value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  return { metadataBase:new URL(siteOrigin), title:{default:'Lines',template:'%s | Lines'}, description:tr(locale,siteDescription), applicationName:'Lines', icons:{icon:{url:'/favicon.svg',type:'image/svg+xml'}}, openGraph:{type:'website',siteName:'Lines',locale:region[locale].replace('-','_')}, twitter:{card:'summary_large_image'}, formatDetection:{telephone:false} };
}

export default async function LocalLayout({children,params}: {children:ReactNode;params:Promise<{locale:string}>}) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={region[locale]} data-theme="dark" suppressHydrationWarning><head/><body><SiteShell locale={locale}>{children}</SiteShell></body></html>;
}
