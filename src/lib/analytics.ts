import type { Locale } from '@/lib/site';

export type Choices = { analytics: boolean; marketing: boolean; timestamp: number };
type Params = Record<string, string | number | boolean>;
type TagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
const tag = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const id = tag && /^G-[A-Z0-9]+$/.test(tag) ? tag : undefined;
let allowed = false;
let initialized = false;
let latestPath = '';

export function configureAnalytics(choices: Choices | null) {
  if (!id || typeof window === 'undefined') return;
  const win = window as TagWindow;
  allowed = Boolean(choices?.analytics);
  Object.assign(win, { [`ga-disable-${id}`]: !allowed });
  if (!allowed) {
    win.gtag?.('consent','update',{ analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied' });
    latestPath = '';
    return;
  }
  if (!initialized) {
    win.dataLayer ??= [];
    // gtag consumes array-like Arguments objects in order.
    win.gtag = function () { win.dataLayer!.push(arguments); };
    win.gtag('consent','default',{ analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied' });
  }
  // Marketing consent is stored but no advertising tag is integrated in this prototype.
  win.gtag?.('consent','update',{ analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied' });
  if (initialized) return;
  initialized = true;
  win.gtag?.('js', new Date());
  win.gtag?.('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.async = true;
  document.head.appendChild(script);
}

export function track(event: string, params: Params = {}) {
  if (allowed && typeof window !== 'undefined' && !window.location.pathname.includes('waitlist-unsubscribe')) (window as TagWindow).gtag?.('event',event,params);
}

export function trackPage(path: string, locale: Locale) {
  if (!allowed || latestPath === path || path.includes('waitlist-unsubscribe')) return;
  latestPath = path;
  const city = path.match(/\/cities\/([a-z-]+)\/?$/)?.[1];
  track('page_view',{ page_location: `${window.location.origin}${path}`, language:locale, device: matchMedia('(max-width: 720px)').matches ? 'mobile' : 'desktop', ...(city ? {city} : {}) });
  if (city) track('city_page_view',{ city, language:locale });
}
