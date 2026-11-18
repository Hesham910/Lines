import type { MetadataRoute } from 'next';
import { defaultLocale, href, locales, publicPaths, region, siteOrigin } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.filter((path)=>!path.startsWith('legal/') || process.env.LINES_LEGAL_APPROVED==='1').flatMap((path)=>{
    const languages={...Object.fromEntries(locales.map((locale)=>[region[locale],`${siteOrigin}${href(locale,path)}`])), 'x-default':`${siteOrigin}${href(defaultLocale,path)}`};
    return locales.map((locale)=>({url:`${siteOrigin}${href(locale,path)}`,changeFrequency:path ? 'monthly' : 'weekly', priority:path ? .75 : 1,alternates:{languages}}));
  });
}
