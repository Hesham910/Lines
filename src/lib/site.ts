export const locales = ['de', 'fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';
export const audiences = ['rider', 'driver', 'partner'] as const;
export type Audience = (typeof audiences)[number];
export type LocalText = readonly [en: string, de: string, fr: string];
export const tr = (locale: Locale, value: LocalText): string => value[locale === 'en' ? 0 : locale === 'de' ? 1 : 2];
export const isLocale = (value: unknown): value is Locale => typeof value === 'string' && locales.some((locale) => locale === value);
export const isAudience = (value: unknown): value is Audience => typeof value === 'string' && audiences.some((intent) => intent === value);
export const href = (locale: Locale, path = '') => `/${locale}${path ? `/${path.replace(/^\//, '')}` : ''}`;
export const region: Record<Locale, string> = { de: 'de-CH', fr: 'fr-CH', en: 'en-CH' };
export const languageNames: Record<Locale, string> = { de: 'Deutsch (Schweiz)', fr: 'Français (Suisse)', en: 'English' };
export const audienceNames: Record<Audience, LocalText> = {
  rider: ['Rider', 'Fahrgast', 'Passager'], driver: ['Driver', 'Fahrer', 'Chauffeur'], partner: ['Partner', 'Partner', 'Partenaire'],
};
export const audienceActions: Record<Audience, LocalText> = {
  rider: ['Rider', 'Fahrgast', 'Passager'], driver: ['Driver', 'Fahrer', 'Chauffeur'], partner: ['Partner', 'Partner', 'Partenaire'],
};
export const waitlistLabels: Record<Audience, LocalText> = {
  rider: ['Join the rider waitlist', 'Auf die Fahrgast-Warteliste', 'Rejoindre la liste passagers'],
  driver: ['Join the driver waitlist', 'Auf die Fahrer-Warteliste', 'Rejoindre la liste chauffeurs'],
  partner: ['Join the partner waitlist', 'Auf die Partner-Warteliste', 'Rejoindre la liste partenaires'],
};
export const contactEmail = 'taxilinesapp@gmail.com';
export const consentVersion = '2026-01';
export const legalKeys = ['terms', 'partner-terms', 'privacy', 'cookies', 'commission-partners', 'fees-drivers', 'cancellation-compensation', 'fare-rules', 'safety-guidelines', 'complaints', 'insurance-liability', 'accessibility', 'waitlist-consent'] as const;
export type LegalKey = (typeof legalKeys)[number];
export const legalTitles: Record<LegalKey, LocalText> = {
  terms: ['Terms of Service', 'Nutzungsbedingungen', 'Conditions d’utilisation'], 'partner-terms': ['Partner Terms', 'Partnerbedingungen', 'Conditions partenaires'], privacy: ['Privacy Policy', 'Datenschutzerklärung', 'Politique de confidentialité'], cookies: ['Cookie Policy', 'Cookie-Richtlinie', 'Politique de cookies'], 'commission-partners': ['Partner Commission & Payouts', 'Partnerprovision & Auszahlungen', 'Commission et versements partenaires'], 'fees-drivers': ['Driver Fees & Payouts', 'Fahrergebühren & Auszahlungen', 'Frais et versements chauffeurs'], 'cancellation-compensation': ['Cancellation & Compensation', 'Stornierung & Entschädigung', 'Annulation et indemnisation'], 'fare-rules': ['Fare & Offer Rules', 'Tarif- und Angebotsregeln', 'Règles tarifaires et offres'], 'safety-guidelines': ['Safety & Community Guidelines', 'Sicherheit & Gemeinschaftsregeln', 'Sécurité et règles de la communauté'], complaints: ['Complaints & Disputes', 'Beschwerden & Streitfälle', 'Réclamations et litiges'], 'insurance-liability': ['Insurance & Liability', 'Versicherung & Haftung', 'Assurance et responsabilité'], accessibility: ['Accessibility', 'Barrierefreiheit', 'Accessibilité'], 'waitlist-consent': ['Waitlist & Consent Notice', 'Warteliste & Einwilligung', 'Liste d’attente et consentement'],
};

export const cities = [
  { slug: 'zurich', name: ['Zurich', 'Zürich', 'Zurich'], code: 'ZH', lat: 47.3769, lon: 8.5417, landmark: ['Zürich HB and the lakefront', 'Zürich HB und das Seeufer', 'la gare centrale et le bord du lac'] },
  { slug: 'geneva', name: ['Geneva', 'Genf', 'Genève'], code: 'GE', lat: 46.2044, lon: 6.1432, landmark: ['Cornavin and the international district', 'Cornavin und das internationale Viertel', 'Cornavin et le quartier international'] },
  { slug: 'basel', name: ['Basel', 'Basel', 'Bâle'], code: 'BS', lat: 47.5596, lon: 7.5886, landmark: ['Basel SBB and both sides of the Rhine', 'Basel SBB und beide Rheinufer', 'Bâle CFF et les deux rives du Rhin'] },
  { slug: 'bern', name: ['Bern', 'Bern', 'Berne'], code: 'BE', lat: 46.948, lon: 7.4474, landmark: ['the Old Town and Bern station', 'Altstadt und Bahnhof Bern', 'la vieille ville et la gare de Berne'] },
  { slug: 'lausanne', name: ['Lausanne', 'Lausanne', 'Lausanne'], code: 'VD', lat: 46.5197, lon: 6.6323, landmark: ['the station and Ouchy', 'Bahnhof und Ouchy', 'la gare et Ouchy'] },
  { slug: 'lucerne', name: ['Lucerne', 'Luzern', 'Lucerne'], code: 'LU', lat: 47.0502, lon: 8.3093, landmark: ['the central station and Lake Lucerne', 'Bahnhof und Vierwaldstättersee', 'la gare centrale et le lac des Quatre-Cantons'] },
  { slug: 'lugano', name: ['Lugano', 'Lugano', 'Lugano'], code: 'TI', lat: 46.0037, lon: 8.9511, landmark: ['the city centre and the lakeside', 'Zentrum und Seeufer', 'le centre et les rives du lac'] },
  { slug: 'winterthur', name: ['Winterthur', 'Winterthur', 'Winterthour'], code: 'ZH', lat: 47.4988, lon: 8.7241, landmark: ['the railway station and the old town', 'Bahnhof und Altstadt', 'la gare et la vieille ville'] },
  { slug: 'st-gallen', name: ['St. Gallen', 'St. Gallen', 'Saint-Gall'], code: 'SG', lat: 47.4245, lon: 9.3767, landmark: ['the Abbey District and the central station', 'Stiftsbezirk und Hauptbahnhof', 'le quartier abbatial et la gare centrale'] },
] as const satisfies ReadonlyArray<{ slug: string; name: LocalText; code: string; lat: number; lon: number; landmark: LocalText }>;
export type City = (typeof cities)[number];
export const publicPaths = ['', 'driver', 'partners', 'cities', 'faq', 'support', ...cities.map(({slug}) => `cities/${slug}`), ...legalKeys.map((key) => `legal/${key}`)];
export const auxiliaryPaths = ['waitlist-thank-you'];
export const nav = [
  { key: 'ride', section: 'ride', path: '', label: ['Ride', 'Mitfahren', 'Passagers'] },
  { key: 'drive', section: 'drive', path: 'driver', label: ['Drive', 'Fahren', 'Chauffeurs'] },
  { key: 'partners', section: 'partners', path: 'partners', label: ['Partners', 'Partner', 'Partenaires'] },
  { key: 'cities', section: '', path: 'cities', label: ['Cities', 'Städte', 'Villes'] },
  { key: 'faq', section: '', path: 'faq', label: ['FAQ', 'FAQ', 'FAQ'] },
  { key: 'support', section: '', path: 'support', label: ['Support', 'Hilfe', 'Assistance'] },
] as const;

function origin(value?: string) {
  try { return value ? new URL(value).origin : 'https://lines.ch'; } catch { return 'https://lines.ch'; }
}
export const siteOrigin = origin(process.env.NEXT_PUBLIC_SITE_URL);
export const partnerPortalUrl = 'https://lines-trips.com/home';
export const siteDescription: LocalText = [
  'Lines is Switzerland’s fairer way to move. Compare driver offers, ride with licensed professionals, or join Lines as a driver or partner.',
  'Lines macht Mobilität in der Schweiz fairer. Vergleiche Angebote, fahre mit lizenzierten Profis oder werde Fahrer oder Partner.',
  'Lines rend les trajets plus justes en Suisse. Comparez les offres de chauffeurs agréés ou rejoignez Lines comme chauffeur ou partenaire.',
];
export const industryNames: Record<string, LocalText> = {
  hotel: ['Hotels', 'Hotels', 'Hôtels'], hospital: ['Hospitals & clinics', 'Spitäler & Kliniken', 'Hôpitaux et cliniques'], bank: ['Banks', 'Banken', 'Banques'], company: ['Companies', 'Unternehmen', 'Entreprises'], practice: ['Medical practices', 'Arztpraxen', 'Cabinets médicaux'], care: ['Care homes', 'Pflegeheime', 'Maisons de soins'], restaurant: ['Restaurants', 'Restaurants', 'Restaurants'], other: ['Other', 'Andere', 'Autres'],
};
