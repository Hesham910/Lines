'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { m, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUp, ArrowUpRight, Bell, Building2, CarFront, Check, ChevronDown, Cookie, Globe2, Menu, Route, ShieldCheck, X } from 'lucide-react';
import { audienceNames, consentVersion, href, languageNames, legalTitles, locales, nav, partnerPortalUrl, tr, type Audience, type LegalKey, type LocalText, type Locale } from '@/lib/site';
import { configureAnalytics, track, trackPage, type Choices } from '@/lib/analytics';
import { Brand } from './brand';
import { makeReference, postForm, WaitlistForm } from './forms';
import { MotionFeatures } from './motion-ui';
import { SiteContext, StoreButtons, WaitlistButton } from './site-context';
import { isLive, launchAt, launchConfigured, type AppAudience } from '@/lib/launch';

const DownloadPanel = dynamic(() => import('./download-panel').then((module) => module.DownloadPanel), { ssr:false });

const storageKey = `lines-cookies-${consentVersion}`;
const cookieLabel = ['Cookie settings','Cookie-Einstellungen','Préférences de cookies'] as const;
const joinLabel = ['Join the waitlist','Auf die Warteliste','Rejoindre la liste'] as const;
const languageLabel = ['Language & region','Sprache & Region','Langue et région'] as const;
const modalTitle = ['Almost there. Lines launches soon across Switzerland.','Bald geht’s los. Lines startet in der ganzen Schweiz.','Ça approche. Lines arrive dans toute la Suisse.'] as const;
const modalDescription = ['The apps are in final testing. Leave your email and we’ll send your link for Google Play or the App Store at launch.','Die Apps sind in der letzten Testphase. Hinterlasse deine E-Mail, um zum Start den Link für Google Play oder den App Store zu erhalten.','Les apps sont en phase finale de test. Laissez votre e-mail pour recevoir votre lien Google Play ou App Store au lancement.'] as const;

function restoreTheme() {
  // Dark is the only shipped look in this release.
  if (document.documentElement.dataset.theme !== 'dark') document.documentElement.dataset.theme = 'dark';
}

function rememberLocale(next: Locale) {
  document.cookie = `lines_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}

type Layer = { kind: 'waitlist'; intent: Audience; source: string; city?: string } | { kind:'download'; intent:AppAudience } | { kind: 'language'|'cookies'|'menu'|'exit' };

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [layer,setLayer] = useState<Layer | null>(null);
  const [retained,setRetained] = useState<Layer | null>(null);
  const [live,setLive] = useState(false);
  const [waitlistResult,setWaitlistResult] = useState<'joined'|'duplicate'|null>(null);
  const [barHidden,setBarHidden] = useState(false);
  const [consent,setConsent] = useState<Choices | null>(null);
  const [cookieReady,setCookieReady] = useState(false);
  const [condensed,setCondensed] = useState(false);
  const [sticky,setSticky] = useState(false);
  const [langOpen,setLangOpen] = useState(false);
  const [ctaVisible,setCtaVisible] = useState(false);
  const [activeSection,setActiveSection] = useState('');
  const focusReturn = useRef<HTMLElement | null>(null);
  const sectionPercent = useRef(0);
  const seenDepth = useRef(new Set<number>());
  const seenSections = useRef(new Set<string>());
  const root = href(locale);
  const isHome = pathname === root;
  const consentEnabled = Boolean(consent?.analytics);
  const opened = Boolean(layer);
  const shown = layer ?? retained;

  function open(next: Layer) {
    if (!layer) focusReturn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLayer(next);
    setRetained(next);
  }
  function openWaitlist(intent: Audience, source: string, city?: string) {
    if (live) {
      if (intent==='partner') {
        track('partner_register_start',{language:locale,source});
        window.location.assign(partnerPortalUrl);
      } else open({kind:'download',intent});
      return;
    }
    try { sessionStorage.setItem('lines-prompt-shown','yes'); } catch {}
    track('waitlist_modal_open',{intent,source,language:locale,...(city ? {city} : {})});
    setWaitlistResult(null);
    open({kind:'waitlist',intent,source,city});
  }
  function waitlistJoined() { try { sessionStorage.setItem('lines-joined','yes'); } catch {} window.dispatchEvent(new Event('lines-waitlist-changed')); }
  function dismissBar() { setBarHidden(true); try { sessionStorage.setItem('lines-launch-dismissed','yes'); } catch {} }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      restoreTheme();
      let stored: Choices | null = null;
      try {
        setBarHidden(sessionStorage.getItem('lines-launch-dismissed') === 'yes');
        const item = JSON.parse(localStorage.getItem(storageKey) ?? 'null') as Choices | null;
        if (item && typeof item.analytics === 'boolean' && typeof item.marketing === 'boolean' && typeof item.timestamp === 'number') stored = item;
      } catch {}
      setConsent(stored);
      if (!window.location.pathname.includes('waitlist-unsubscribe')) configureAnalytics(stored);
    });
    const timer = window.setTimeout(() => setCookieReady(true), 1150);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, []);

  // Next may reconcile the root html attributes when crossing a locale boundary.
  useLayoutEffect(() => { restoreTheme(); },[pathname]);

  useEffect(() => {
    if (!launchConfigured) return;
    let timeout = 0;
    function checkLaunch() {
      const now = Date.now();
      setLive(isLive(now));
      if (now < launchAt) timeout = window.setTimeout(checkLaunch,Math.min(launchAt-now+100,2_000_000_000));
    }
    const frame = requestAnimationFrame(checkLaunch);
    return () => { cancelAnimationFrame(frame); clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    if (consent) configureAnalytics(pathname.includes('waitlist-unsubscribe') ? null : consent);
    trackPage(pathname,locale);
  }, [locale, pathname, consent]);

  function saveConsent(analytics: boolean, marketing: boolean) {
    const choice = {analytics,marketing,timestamp:Date.now()};
    let visitor = makeReference();
    try {
      visitor = localStorage.getItem('lines-consent-id') || visitor;
      localStorage.setItem('lines-consent-id',visitor);
      localStorage.setItem(storageKey,JSON.stringify(choice));
    } catch {}
    void postForm('consent',{visitor,analytics,marketing,locale}).catch(() => {});
    configureAnalytics(pathname.includes('waitlist-unsubscribe') ? null : choice);
    setConsent(choice);
    setLayer(null);
  }

  useEffect(() => {
    seenDepth.current.clear(); seenSections.current.clear();
    sectionPercent.current = 0;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const percent = distance > 0 ? Math.min(100,Math.round(100 * y / distance)) : 0;
      sectionPercent.current = percent;
      if (!final) setCtaVisible(false);
      setCondensed(y > 34);
      setSticky(percent >= 15);
      if (isHome) {
        const section = ['partners','drive','ride'].find((id) => { const rect = document.getElementById(id)?.getBoundingClientRect(); return rect && rect.top < 205 && rect.bottom > 205; });
        setActiveSection(section ?? '');
      } else setActiveSection('');
      if (consentEnabled) for (const milestone of [25,50,75,100]) {
        if (percent >= milestone && !seenDepth.current.has(milestone)) { seenDepth.current.add(milestone); track('scroll_depth',{percent_scrolled:milestone,language:locale}); }
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const final = document.getElementById('final-cta');
    const observer = new IntersectionObserver((entries) => { for (const entry of entries) {
      if (entry.target === final) setCtaVisible(entry.isIntersecting);
      else if (entry.isIntersecting && consentEnabled && !seenSections.current.has(entry.target.id)) {
        seenSections.current.add(entry.target.id);
        track('section_view',{ section:entry.target.id, language:locale });
      }
    } }, { threshold: .13 });
    if (final) observer.observe(final);
    if (isHome) for (const id of ['ride','drive','partners']) { const element = document.getElementById(id); if (element) observer.observe(element); }
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll,{passive:true});
    onScroll();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll',onScroll); window.removeEventListener('resize',onScroll); };
  }, [locale,pathname,isHome,consentEnabled]);

  useEffect(() => {
    if (!isHome || opened || !consent || live) return;
    const onExit = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 0 || sectionPercent.current < 50 || !matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return;
      try {
        if (sessionStorage.getItem('lines-prompt-shown') || sessionStorage.getItem('lines-joined')) return;
        sessionStorage.setItem('lines-prompt-shown','yes');
        focusReturn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setLayer({kind:'exit'}); setRetained({kind:'exit'});
      } catch {}
    };
    document.addEventListener('mouseout',onExit);
    return () => document.removeEventListener('mouseout',onExit);
  }, [consent,isHome,opened,live]);

  const api = { locale, live, openWaitlist, waitlistJoined };
  function switchLocale(next: Locale) {
    const path = pathname.replace(/^\/(de|fr|en)(?=\/|$)/,`/${next}`);
    setLangOpen(false);
    setLayer(null);
    rememberLocale(next);
    if (next !== locale) router.push(`${path}${window.location.search}${window.location.hash}`);
  }
  const linkTarget = (item: typeof nav[number]) => item.section ? (isHome ? `#${item.section}` : `${root}#${item.section}`) : href(locale,item.path);
  const linkActive = (item: typeof nav[number]) => isHome ? activeSection === item.section && Boolean(item.section) : pathname === href(locale,item.path) && Boolean(item.path);
  useEffect(() => {
    if (!langOpen) return undefined;
    const close = (event: PointerEvent) => { if (!(event.target instanceof Element) || !event.target.closest('.lang-wrap')) setLangOpen(false); };
    const esc = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') setLangOpen(false); };
    document.addEventListener('pointerdown',close);
    document.addEventListener('keydown',esc);
    return () => { document.removeEventListener('pointerdown',close); document.removeEventListener('keydown',esc); };
  },[langOpen]);
  const isSheet = shown?.kind==='menu';
  const noSticky = pathname.includes('waitlist-') || pathname.includes('/legal/');
  const hasBanner = cookieReady && !consent && !pathname.includes('waitlist-unsubscribe');

  return <SiteContext.Provider value={api}><MotionFeatures>
    <a className="skip-link" href="#main">{tr(locale,['Skip to content','Zum Inhalt springen','Aller au contenu'])}</a>
    {!barHidden && <div className="launch-bar"><div className="container launch-inner"><span className="launch-dot" aria-hidden="true" /><span>{tr(locale,live ? ['Lines is live across Switzerland.','Lines ist in der ganzen Schweiz live.','Lines est disponible dans toute la Suisse.'] : ['Lines is launching across Switzerland.','Lines startet in der ganzen Schweiz.','Lines arrive dans toute la Suisse.'])}</span><button type="button" className="launch-link" onClick={() => openWaitlist('rider','announcement')}>{tr(locale,live ? ['Download now','Jetzt laden','Télécharger'] : ['Get launch access','Zum Start vormerken','Me prévenir du lancement'])}<ArrowUpRight size={13} aria-hidden="true" /></button><button type="button" className="icon-button launch-close" onClick={dismissBar} aria-label={tr(locale,['Dismiss announcement','Hinweis schliessen','Masquer l’annonce'])}><X size={15} aria-hidden="true" /></button></div></div>}
    <header className={`site-header ${condensed ? 'condensed' : ''}`}><div className="container nav-inner">
      <Brand locale={locale} />
      <nav className="desktop-nav" aria-label={tr(locale,['Main navigation','Hauptnavigation','Navigation principale'])}>{nav.map((item) => <Link key={item.key} href={linkTarget(item)} className={linkActive(item) ? 'active' : undefined} aria-current={linkActive(item) ? isHome ? 'location' : 'page' : undefined}>{tr(locale,item.label)}</Link>)}</nav>
      <div className="nav-actions"><div className="lang-wrap"><button type="button" className="language-button" onClick={() => setLangOpen((value) => !value)} aria-expanded={langOpen} aria-haspopup="menu" aria-label={tr(locale,languageLabel)}><Globe2 size={17} aria-hidden="true" /><span>{locale.toUpperCase()}</span><ChevronDown className={`language-chevron ${langOpen ? 'open' : ''}`} size={12} aria-hidden="true" /></button>{langOpen && <div className="lang-menu" role="menu">{locales.map((value) => <button key={value} type="button" role="menuitemradio" lang={value} aria-checked={value===locale} onClick={() => switchLocale(value)}><span className="mono">{value.toUpperCase()}</span>{languageNames[value]}{value===locale && <Check size={17} aria-hidden="true" />}</button>)}</div>}</div><div className="header-cta-slot">{live ? <><StoreButtons intent="rider" compact/><Link className="button primary header-cta" href={href(locale,'driver')}>{tr(locale,['Drive with Lines','Mit Lines fahren','Conduire avec Lines'])}</Link></> : <WaitlistButton className="button primary header-cta" source="header" arrow={false}>{tr(locale,joinLabel)}</WaitlistButton>}</div><button type="button" className="icon-button menu-trigger" aria-label={tr(locale,['Open menu','Menü öffnen','Ouvrir le menu'])} onClick={() => open({kind:'menu'})}><Menu size={23} aria-hidden="true" /></button></div>
    </div></header>
    {children}
    <Footer locale={locale} onCookies={() => open({kind:'cookies'})} />
    {sticky && !ctaVisible && !opened && !noSticky && <div className="mobile-dock" data-cookies={hasBanner}><button type="button" onClick={() => openWaitlist(pathname.endsWith('/driver') ? 'driver' : 'rider','mobile_dock')}><Bell size={17} aria-hidden="true" />{tr(locale,live ? ['Get the app','App holen','Obtenir l’app'] : ['Waitlist','Warteliste','Liste d’attente'])}</button><Link href={isHome ? '#drive' : href(locale,'driver')}><CarFront size={17} aria-hidden="true" />{tr(locale,['Drive','Fahren','Conduire'])}</Link><Link href={isHome ? '#partners' : href(locale,'partners')}><Building2 size={17} aria-hidden="true" />{tr(locale,audienceNames.partner)}</Link></div>}
    {hasBanner && !opened && <aside className="cookie-banner" aria-label={tr(locale,cookieLabel)}>
      <div className="cookie-heading"><Cookie size={17} aria-hidden="true" /><strong>{tr(locale,['Your cookie choices','Deine Cookie-Auswahl','Vos choix de cookies'])}</strong></div>
      <p>{tr(locale,['Essential cookies keep the site working. Optional cookies help us improve it. You choose.','Notwendige Cookies halten die Website am Laufen. Optionale helfen, sie zu verbessern. Du entscheidest.','Les cookies essentiels font fonctionner le site. Les optionnels nous aident à l’améliorer. À vous de choisir.'])}</p>
      <div className="cookie-actions"><button type="button" className="button primary" onClick={() => saveConsent(true,true)}>{tr(locale,['Accept all','Alle akzeptieren','Tout accepter'])}</button><button type="button" className="button secondary" onClick={() => saveConsent(false,false)}>{tr(locale,['Essential only','Nur notwendige','Essentiels seuls'])}</button></div>
      <div className="cookie-links"><button type="button" onClick={() => open({kind:'cookies'})}>{tr(locale,['Manage choices','Auswahl verwalten','Gérer les choix'])}</button><Link href={href(locale,'legal/cookies')}>{tr(locale,legalTitles.cookies)}</Link><Link href={href(locale,'legal/privacy')}>{tr(locale,['Privacy','Datenschutz','Confidentialité'])}</Link></div>
    </aside>}
    <Dialog.Root open={opened} onOpenChange={(value) => { if (!value) setLayer(null); }}>
      {shown && <Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content asChild onCloseAutoFocus={(event) => { event.preventDefault(); focusReturn.current?.focus({preventScroll:true}); }}>
        <m.div key={shown.kind} className={`dialog-panel ${isSheet ? 'dialog-sheet' : ''} ${shown.kind==='waitlist' ? 'waitlist-panel' : ''} ${shown.kind==='cookies' ? 'cookies-panel' : ''}`} initial={reduced ? false : { opacity:0, y:isSheet ? '32%' : '24%', scale:.94, filter:'blur(8px)' }} animate={{ opacity:1, y:0, scale:1, filter:'blur(0px)' }} transition={{type:'spring',bounce:0,duration:.44}}>
          <Dialog.Close className="icon-button dialog-close" aria-label={tr(locale,['Close dialog','Dialog schliessen','Fermer la fenêtre'])}><X size={21} aria-hidden="true" /></Dialog.Close>
          {shown.kind==='waitlist' && <><div className="dialog-brand"><Brand locale={locale} link={false} /><span className="pill mono"><span className="launch-dot" />{tr(locale,['Launching soon','Startet bald','Bientôt disponible'])}</span></div><Dialog.Title className={waitlistResult ? 'sr-only' : 'dialog-title'}>{waitlistResult ? tr(locale,['Waitlist confirmation','Wartelisten-Bestätigung','Confirmation d’inscription']) : tr(locale,modalTitle)}</Dialog.Title><Dialog.Description className={waitlistResult ? 'sr-only' : 'dialog-description'}>{waitlistResult ? tr(locale,['Your waitlist status','Dein Wartelistenstatus','Votre inscription']) : tr(locale,modalDescription)}</Dialog.Description><WaitlistForm initial={shown.intent} source={shown.source} city={shown.city} onResult={setWaitlistResult} onDone={() => setLayer(null)} /><Link className="dialog-privacy" href={href(locale,'legal/privacy')} target="_blank" rel="noopener noreferrer">{tr(locale,['How we protect your data','Wie wir deine Daten schützen','Comment nous protégeons vos données'])}<ArrowUpRight size={13} aria-hidden="true" /></Link></>}
          {shown.kind==='download' && <><div className="dialog-brand"><Brand locale={locale} link={false}/><span className="pill mono"><span className="launch-dot"/>{tr(locale,['Now live','Jetzt live','Disponible'])}</span></div><Dialog.Title className="dialog-title">{tr(locale,shown.intent==='driver' ? ['Get the Lines driver app','Hol dir die Lines Fahrer-App','Téléchargez l’app Lines Chauffeur'] : ['Get the Lines rider app','Hol dir die Lines Fahrgast-App','Téléchargez l’app Lines Passager'])}</Dialog.Title><Dialog.Description className="dialog-description">{tr(locale,['Open the store on your device or scan the QR code with your phone.','Öffne den Store auf deinem Gerät oder scanne den QR-Code mit dem Telefon.','Ouvrez le store sur votre appareil ou scannez le QR code avec votre téléphone.'])}</Dialog.Description><DownloadPanel locale={locale} intent={shown.intent}/></>}
          {shown.kind==='menu' && <><Dialog.Title className="dialog-title">{tr(locale,['Explore Lines','Lines entdecken','Découvrir Lines'])}</Dialog.Title><Dialog.Description className="sr-only">{tr(locale,['All sections and pages','Alle Abschnitte und Seiten','Toutes les rubriques et pages'])}</Dialog.Description><nav className="menu-list" aria-label={tr(locale,['Mobile navigation','Mobile Navigation','Navigation mobile'])}>{nav.map((item,index) => <Link key={item.key} href={linkTarget(item)} onClick={() => setLayer(null)}><span className="mono">0{index+1}</span>{tr(locale,item.label)}<ArrowRight size={20} aria-hidden="true"/></Link>)}</nav><WaitlistButton source="mobile_menu">{tr(locale,joinLabel)}</WaitlistButton></>}
          {shown.kind==='exit' && <><div className="icon-tile"><Bell aria-hidden="true" size={24}/></div><Dialog.Title className="dialog-title">{tr(locale,['Leaving already?','Schon auf dem Sprung?','Vous partez déjà ?'])}</Dialog.Title><Dialog.Description className="dialog-description">{tr(locale,['Get your launch link by email.','Erhalte deinen Startlink per E-Mail.','Recevez votre lien de lancement par e-mail.'])}</Dialog.Description><div className="button-row"><WaitlistButton source="exit_intent">{tr(locale,joinLabel)}</WaitlistButton><Dialog.Close className="button secondary">{tr(locale,['No thanks','Nein danke','Non merci'])}</Dialog.Close></div></>}
          {shown.kind==='cookies' && <CookiePreferences locale={locale} consent={consent} save={saveConsent} />}
        </m.div>
      </Dialog.Content></Dialog.Portal>}
    </Dialog.Root>
    </MotionFeatures></SiteContext.Provider>;
}

function CookiePreferences({ locale, consent, save }: {locale: Locale; consent: Choices | null; save:(a:boolean,m:boolean)=>void}) {
  const [analytics,setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing,setMarketing] = useState(consent?.marketing ?? false);
  return <><div className="icon-tile"><Cookie size={23} aria-hidden="true"/></div><Dialog.Title className="dialog-title">{tr(locale,cookieLabel)}</Dialog.Title><Dialog.Description className="dialog-description">{tr(locale,['Change your choices at any time. Optional tags stay off until you choose.','Du kannst deine Auswahl jederzeit ändern. Optionale Tags bleiben bis zur Zustimmung aus.','Modifiez vos choix à tout moment. Les balises optionnelles restent désactivées jusqu’à votre choix.'])}</Dialog.Description><div className="preference-list">
    <div><span>{tr(locale,['Essential','Notwendig','Essentiels'])}</span><small>{tr(locale,['Always on','Immer aktiv','Toujours actifs'])}</small></div>
    <label><span>{tr(locale,['Analytics','Analyse','Analyse'])}</span><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /></label>
    <label><span>Marketing</span><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /></label></div><button className="button primary" type="button" onClick={() => save(analytics,marketing)}>{tr(locale,['Save choices','Auswahl speichern','Enregistrer les choix'])}<Check size={16} aria-hidden="true"/></button></>;
}

function FooterLang({ locale }: { locale: Locale }) {
  const router = useNextRouter();
  const [open,setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event: PointerEvent) => { if (!(event.target instanceof Element) || !event.target.closest('.lang-wrap')) setOpen(false); };
    const esc = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown',close);
    document.addEventListener('keydown',esc);
    return () => { document.removeEventListener('pointerdown',close); document.removeEventListener('keydown',esc); };
  },[open]);
  function switchTo(next: Locale) {
    setOpen(false);
    const path = router ? window.location.pathname.replace(/^(de|fr|en)(?=\/|$)/,`/${next}`) : `/${next}`;
    rememberLocale(next);
    if (next !== locale) router?.push(`${path}${window.location.search}${window.location.hash}`);
  }
  return <div className="lang-wrap" ref={wrapRef}><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu"><Globe2 size={15} aria-hidden="true"/>{locale.toUpperCase()}</button>{open && <div className="lang-menu lang-menu--up" role="menu">{locales.map((value) => <button key={value} type="button" role="menuitemradio" lang={value} aria-checked={value===locale} onClick={() => switchTo(value)}><span className="mono">{value.toUpperCase()}</span>{languageNames[value]}{value===locale && <Check size={16} aria-hidden="true"/>}</button>)}</div>}</div>;
}

function Footer({locale,onCookies}: {locale:Locale;onCookies:()=>void}) {
  const year = new Date().getFullYear();
  const group: {title:LocalText; items: {label:LocalText; path:string}[]}[] = [
    {title:['Product','Produkt','Produit'],items:[{label:['For riders','Für Fahrgäste','Pour les passagers'],path:'#ride'},{label:['For drivers','Für Fahrer','Pour les chauffeurs'],path:'driver'},{label:['For partners','Für Partner','Pour les partenaires'],path:'partners'},{label:['Cities','Städte','Villes'],path:'cities'},{label:legalTitles['fare-rules'],path:'legal/fare-rules'}]},
    {title:['Company','Unternehmen','Entreprise'],items:[{label:['Contact','Kontakt','Contact'],path:'support#contact'},{label:legalTitles.accessibility,path:'legal/accessibility'}]},
    {title:['Support','Hilfe','Assistance'],items:[{label:['Help & FAQ','Hilfe & FAQ','Aide et FAQ'],path:'faq'},{label:['Support centre','Support-Center','Centre d’assistance'],path:'support'},{label:legalTitles['safety-guidelines'],path:'legal/safety-guidelines'},{label:legalTitles.complaints,path:'legal/complaints'}]},
    {title:['Legal','Rechtliches','Juridique'],items:(['terms','partner-terms','privacy','cookies','commission-partners','fees-drivers','cancellation-compensation','insurance-liability','waitlist-consent'] as LegalKey[]).map((key) => ({label:legalTitles[key],path:`legal/${key}`}))},
  ];
  return <footer className="site-footer"><div className="container"><div className="footer-grid"><div className="footer-brand"><Brand locale={locale} /><p>{tr(locale,['A fairer way to move.\nBuilt for Switzerland.','Fairer unterwegs.\nFür die ganze Schweiz.','Des trajets plus justes.\nPour toute la Suisse.'])}</p><span className="pill mono"><span className="launch-dot" />{tr(locale,['Launching soon','Startet bald','Lancement bientôt'])}</span></div>{group.map((item) => <nav key={item.title[0]} aria-label={tr(locale,item.title)}><h2>{tr(locale,item.title)}</h2>{item.items.map((entry) => <Link key={entry.path} href={entry.path.startsWith('#') ? `${href(locale)}${entry.path}` : href(locale,entry.path)}>{tr(locale,entry.label)}</Link>)}</nav>)}</div><div className="footer-bottom"><div><span>© {year} Lines</span><span><ShieldCheck size={14} aria-hidden="true"/> {tr(locale,['Secure payments · Swiss data protection','Sichere Zahlungen · Schweizer Datenschutz','Paiements sécurisés · Protection des données suisse'])}</span></div><div><FooterLang locale={locale} /><button type="button" onClick={onCookies}>{tr(locale,cookieLabel)}</button><a href="#main" className="icon-button back-top" aria-label={tr(locale,['Back to top','Nach oben','Retour en haut'])}><ArrowUp size={16} aria-hidden="true"/></a></div></div></div></footer>;
}

export function useWaitlistCount() {
  const [count,setCount] = useState<number | null>(null);
  const load = useCallback(async (fresh = false) => {
    try { const result = await fetch('/api/lines/count',fresh ? {cache:'no-store'} : undefined); if (result.ok) { const {total} = await result.json(); if (Number.isSafeInteger(total) && total >= 0) setCount(total); } } catch {}
  },[]);
  useEffect(() => {
    const refresh = () => void load(true);
    const frame = requestAnimationFrame(() => void load());
    window.addEventListener('lines-waitlist-changed',refresh);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('lines-waitlist-changed',refresh); };
  },[load]);
  return count;
}
