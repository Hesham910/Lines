import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Landing } from '@/components/landing';
import { Subpage, cityTitle } from '@/components/subpages';
import { pageDescriptions, pageNames } from '@/content/pages';
import { homeFaq } from '@/content/faq';
import { auxiliaryPaths, cities, defaultLocale, href, isLocale, legalTitles, locales, publicPaths, region, siteDescription, siteOrigin, tr, type LegalKey } from '@/lib/site';

const routes = [...publicPaths,...auxiliaryPaths];
type Args = { params: Promise<{locale:string;slug?:string[]}> };
export function generateStaticParams() { return routes.map((item)=>({slug:item ? item.split('/') : [] })); }

export async function generateMetadata({params}:Args):Promise<Metadata> {
  const { locale, slug } = await params;
  const path = slug?.join('/') ?? '';
  if (!isLocale(locale) || !routes.includes(path)) return {title:'Lines',robots:{index:false,follow:false}};
  const isLegal = path.startsWith('legal/');
  const city = cities.find((entry)=>path===`cities/${entry.slug}`);
  const homeTitle = { absolute: 'Lines' };
  const title = isLegal ? tr(locale,legalTitles[path.split('/')[1] as LegalKey]) : city ? cityTitle(locale,city) : path ? tr(locale,pageNames[path]) : homeTitle;
  const name = city ? tr(locale,city.name) : '';
  const description = city ? tr(locale,[`Explore rides in ${name} with Lines. See ride classes, planned launch and local driver information.`,`Entdecke Lines in ${name}: Fahrzeugklassen, Start und Informationen für lokale Fahrer.`,`Découvrez Lines à ${name} : catégories, lancement et informations locales pour les chauffeurs.`]) : isLegal ? `${title} · Lines Switzerland` : tr(locale,pageDescriptions[path] ?? siteDescription);
  const image = {url:'/media/lines-social.png',width:1200,height:630,alt:'Lines — Switzerland'};
  const isPrivate = auxiliaryPaths.includes(path) || (isLegal && process.env.LINES_LEGAL_APPROVED !== '1');
  return { title,description,alternates:{canonical:href(locale,path),languages:{ ...Object.fromEntries(locales.map((code)=>[region[code],href(code,path)])), 'x-default':href(defaultLocale,path) }}, robots:{index:!isPrivate,follow:true}, openGraph:{type:'website',url:href(locale,path),siteName:'Lines',title,description,locale:region[locale].replace('-','_'),alternateLocale:locales.filter((code)=>code!==locale).map((code)=>region[code].replace('-','_')),images:[image]}, twitter:{card:'summary_large_image',title,description,images:[image.url]}, ...(path==='waitlist-unsubscribe' ? {referrer:'no-referrer'} : {}) };
}

export default async function SitePage({params}:Args) {
  const { locale, slug } = await params;
  const path = slug?.join('/') ?? '';
  if (!isLocale(locale) || !routes.includes(path)) notFound();
  const url = `${siteOrigin}${href(locale,path)}`;
  const city = cities.find((entry)=>path===`cities/${entry.slug}`);
  const schema = !path ? { '@context':'https://schema.org','@graph':[
    { '@type':'Organization', '@id':`${siteOrigin}/#lines`, name:'Lines', url:siteOrigin, logo:`${siteOrigin}/logo/lines-light.svg`, areaServed:{'@type':'Country', name:'Switzerland'} },
    { '@type':'WebSite', name:'Lines', url, inLanguage:region[locale], publisher:{'@id':`${siteOrigin}/#lines`} },
    { '@type':'FAQPage', inLanguage:region[locale], mainEntity:homeFaq.map((item)=>({ '@type':'Question',name:tr(locale,item.q),acceptedAnswer:{'@type':'Answer',text:tr(locale,item.a)} })) },
  ] } : city ? { '@context':'https://schema.org','@type':'Service',name:cityTitle(locale,city),url,inLanguage:region[locale],provider:{'@type':'Organization',name:'Lines'},areaServed:{'@type':'City',name:tr(locale,city.name),containedInPlace:{'@type':'Country',name:'Switzerland'}} } : null;
  return <>{schema && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>}{path ? <Subpage locale={locale} path={path}/> : <Landing locale={locale}/>}</>;
}
