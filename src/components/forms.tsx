'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Bell, Building2, CarFront, Check, CircleCheck, CornerUpRight, LoaderCircle, Mail, Route, Send, Share2 } from 'lucide-react';
import { audienceActions, audienceNames, audiences, contactEmail, href, industryNames, legalTitles, tr, type Audience, type Locale } from '@/lib/site';
import { track } from '@/lib/analytics';
import { useSite } from './site-context';

const genericError = ['Something didn’t go through. Check your connection and try again.', 'Das hat nicht geklappt. Prüfe deine Verbindung und versuche es erneut.', 'L’envoi a échoué. Vérifiez votre connexion et réessayez.'] as const;
const emailError = ['Enter a valid email address.', 'Gib eine gültige E-Mail-Adresse ein.', 'Saisissez une adresse e-mail valide.'] as const;
const consentError = ['Tick the consent box to continue.', 'Stimme zu, um fortzufahren.', 'Cochez la case de consentement pour continuer.'] as const;
const emailLabel = ['Email address', 'E-Mail-Adresse', 'Adresse e-mail'] as const;
const validEmail = (email: string) => /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/u.test(email);
const intentIcons = { rider:Route,driver:CarFront,partner:Building2 };

export async function postForm(action: string, payload: object) {
  const response = await fetch(`/api/lines/${action}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body:JSON.stringify(payload), signal:AbortSignal.timeout(16000) });
  return { ok:response.ok, data:await response.json() as { status: string; field?: string; confirmation?: boolean } };
}
export function makeReference() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map((value) => value.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

export function ShareButton({ locale, className = 'button secondary' }: { locale: Locale; className?: string }) {
  const [result, setResult] = useState('');
  const onShare = async () => {
    const url = `${window.location.origin}${href(locale)}`;
    try {
      if (navigator.share) { await navigator.share({title:'Lines',url}); return; }
      await navigator.clipboard.writeText(url);
      setResult(tr(locale,['Link copied','Link kopiert','Lien copié']));
    } catch { setResult(url); }
  };
  return <div className="share-control"><button className={className} type="button" onClick={onShare}><Share2 size={17} aria-hidden="true" />{tr(locale,['Share Lines','Lines teilen','Partager Lines'])}</button>{result && <span role="status" className="share-result">{result}</span>}</div>;
}

export function WaitlistForm({ initial = 'rider', source, city, inline = false, onDone, onResult }: { initial?: Audience; source: string; city?: string; inline?: boolean; onDone?: () => void; onResult?: (state:'joined'|'duplicate') => void }) {
  const { locale, waitlistJoined } = useSite();
  const router = useRouter();
  const id = useId();
  const [intent, setIntent] = useState<Audience>(initial);
  const [state, setState] = useState<'ready'|'loading'|'joined'|'duplicate'|'error'>('ready');
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [confirmation,setConfirmation] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const emailNode = useRef<HTMLInputElement>(null);
  const consentNode = useRef<HTMLInputElement>(null);
  useEffect(() => { if (state === 'joined' || state === 'duplicate') heading.current?.focus(); },[state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'loading') return;
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const consent = Boolean(data.get('consent'));
    if (!validEmail(email)) { setError({message:tr(locale,emailError),field:'email'}); emailNode.current?.focus(); return; }
    if (!consent) { setError({message:tr(locale,consentError),field:'consent'}); consentNode.current?.focus(); return; }
    setError(null); setState('loading');
    try {
      const result = await postForm('waitlist',{ email, consent, intent, source, city, locale, website:data.get('website') });
      if (!result.ok) {
        if (result.data.field === 'email') { setError({message:tr(locale,emailError),field:'email'}); setState('ready'); emailNode.current?.focus(); return; }
        throw new Error('submit');
      }
      waitlistJoined();
      if (result.data.status === 'joined') {
        track('waitlist_consent_given',{ intent, source, language:locale });
        track('waitlist_submit_success',{ intent, source, language:locale });
      }
      if (inline) { router.push(`${href(locale,'waitlist-thank-you')}?intent=${intent}&state=${result.data.status === 'duplicate' ? 'existing' : 'joined'}`); return; }
      const outcome = result.data.status === 'duplicate' ? 'duplicate' : 'joined';
      setConfirmation(Boolean(result.data.confirmation));
      setState(outcome); onResult?.(outcome);
    } catch {
      setError({message:tr(locale,genericError)}); setState('error');
      track('waitlist_submit_error',{intent,source,language:locale});
    }
  }

  if (state === 'joined' || state === 'duplicate') return <div className="form-success">
    <span className="icon-tile success-tile"><CircleCheck size={24} aria-hidden="true" /></span>
    <h3 ref={heading} tabIndex={-1}>{state === 'duplicate' ? tr(locale,['You’re already on the list.','Du stehst schon auf der Liste.','Vous êtes déjà sur la liste.']) : tr(locale,['You’re on the list!','Du bist auf der Liste!','Vous êtes sur la liste !'])}</h3>
    <p>{tr(locale,['You’re all set. We’ll email your link when Lines launches across Switzerland.','Alles bereit. Wir senden dir deinen Link zum schweizweiten Start.','Tout est prêt. Nous vous enverrons votre lien au lancement en Suisse.'])}</p>
    {confirmation && <p>{tr(locale,['Check your inbox for a confirmation.','Prüfe dein Postfach für die Bestätigung.','Vérifiez votre boîte de réception pour la confirmation.'])}</p>}
    <div className="button-row">{onDone && <button className="button primary" type="button" onClick={onDone}>{tr(locale,['Done','Fertig','Terminé'])}<Check size={17} aria-hidden="true" /></button>}<ShareButton locale={locale} /></div>
  </div>;

  return <form className={`waitlist-form ${inline ? 'form-inline' : ''}`} onSubmit={submit} noValidate aria-busy={state==='loading'}>
    <fieldset className="intent-pills"><legend className="sr-only">{tr(locale,['Choose your audience','Wähle deine Rolle','Choisissez votre profil'])}</legend>
      {audiences.map((item) => { const Icon = intentIcons[item]; return <label key={item}><input type="radio" name={`intent-${id}`} value={item} checked={intent===item} onChange={() => setIntent(item)} /><span><Icon size={15} aria-hidden="true" />{tr(locale,inline ? audienceNames[item] : audienceActions[item])}</span></label>; })}
    </fieldset>
    <div className="waitlist-input"><label className="field-label" htmlFor={`${id}-email`}>{tr(locale,emailLabel)}</label><div className="input-with-icon"><Mail size={17} aria-hidden="true" /><input id={`${id}-email`} name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={254} ref={emailNode} required aria-invalid={error?.field==='email' || undefined} aria-describedby={error ? `${id}-error` : undefined} onChange={() => { if (error?.field==='email') setError(null); }} /></div></div>
    <label className="honeypot" aria-hidden="true">Website <input type="text" autoComplete="off" name="website" tabIndex={-1} /></label>
    <label className="consent-line"><input name="consent" type="checkbox" required ref={consentNode} aria-invalid={error?.field==='consent' || undefined} aria-describedby={error ? `${id}-error` : undefined} onChange={() => { if (error?.field==='consent') setError(null); }} /><span>{tr(locale,['Send me the Lines launch email and rare product news. I can unsubscribe anytime.','Sende mir die Lines-Startmail und gelegentliche Neuigkeiten. Ich kann mich jederzeit abmelden.','Envoyez-moi le lien de lancement et de rares nouvelles. Je peux me désinscrire à tout moment.'])}{' '}<Link href={href(locale,'legal/waitlist-consent')} target="_blank" rel="noopener noreferrer">{tr(locale,legalTitles['waitlist-consent'])}</Link>.</span></label>
    {error && <p className="form-error" id={`${id}-error`} role="alert">{error.message}</p>}
    <button type="submit" className="button primary form-submit" disabled={state === 'loading'}>{state==='loading' ? tr(locale,['Sending…','Wird gesendet…','Envoi…']) : state==='error' ? tr(locale,['Try again','Erneut versuchen','Réessayer']) : inline ? tr(locale,['Join the waitlist','Auf die Warteliste','Rejoindre la liste']) : tr(locale,['Notify me at launch','Zum Start benachrichtigen','Me prévenir au lancement'])}{state==='loading' ? <LoaderCircle className="spin" size={17} aria-hidden="true" /> : inline ? <ArrowRight size={17} aria-hidden="true" /> : <Bell size={17} aria-hidden="true" />}</button>
  </form>;
}

const supportKinds = {general:['General question','Allgemeine Frage','Question générale'],ride:['Ride issue','Problem mit einer Fahrt','Problème de trajet'],partner:['Partner issue','Partneranfrage','Question partenaire'],safety:['Safety report','Sicherheitsmeldung','Signalement de sécurité'],press:['Press enquiry','Presseanfrage','Demande presse'],accessibility:['Accessibility','Barrierefreiheit','Accessibilité']} as const;
type Kind = keyof typeof supportKinds;

export function InquiryForm({ locale, initial = 'general' }: { locale: Locale; initial?: Kind }) {
  const [kind,setKind] = useState<Kind>(initial);
  const [state,setState] = useState<'ready'|'loading'|'saved'|'sent'|'error'>('ready');
  const [error,setError] = useState('');
  const reference = useRef('');
  const id = useId();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state==='loading') return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setError(''); setState('loading');
    reference.current ||= makeReference();
    try {
      const result = await postForm('support',{ ...data, locale, kind, reference:reference.current, consent:Boolean(data.consent) });
      if (!result.ok) {
        if (result.data.status === 'invalid') { setError(tr(locale,['Check the required details and try again.','Prüfe die Pflichtangaben und versuche es erneut.','Vérifiez les informations obligatoires puis réessayez.'])); setState('error'); return; }
        throw new Error('submit');
      }
      setState(result.data.status==='sent' ? 'sent' : 'saved');
      track('support_submit',{language:locale, topic:kind, delivery:result.data.status});
    } catch { setState('error'); setError(tr(locale,genericError)); }
  }
  if (state==='sent' || state==='saved') return <div className="form-success" role="status"><span className="icon-tile success-tile"><CircleCheck size={25} aria-hidden="true" /></span><h3>{state==='sent' ? tr(locale,['Thanks. Your message is on its way.','Danke. Deine Nachricht ist unterwegs.','Merci. Votre message est en route.']) : tr(locale,['Your message was saved.','Deine Nachricht wurde gespeichert.','Votre message a été enregistré.'])}</h3><p>{state==='sent' ? tr(locale,['We’ll reply to the email address you entered.','Wir antworten an die E-Mail-Adresse, die du angegeben hast.','Nous répondrons à l’adresse e-mail indiquée.']) : tr(locale,['Email delivery is not available right now. For a direct reply, email us at the address below.','Der E-Mail-Versand ist gerade nicht verfügbar. Schreib uns für eine direkte Antwort an die Adresse unten.','L’envoi d’e-mail est indisponible. Pour une réponse directe, écrivez-nous à l’adresse ci-dessous.'])}</p>{state==='saved' && <a className="text-link" href={`mailto:${contactEmail}`}>{contactEmail}<CornerUpRight size={16} aria-hidden="true" /></a>}</div>;
  return <form className="inquiry-form" onSubmit={submit} aria-busy={state==='loading'}>
    <label>{tr(locale,['What can we help with?','Wobei können wir helfen?','Comment pouvons-nous vous aider ?'])}<select name="topic" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>{Object.entries(supportKinds).map(([value,label]) => <option key={value} value={value}>{tr(locale,label)}</option>)}</select></label>
    {kind==='safety' && <p className="form-warning">{tr(locale,['In an emergency, call 112 or 144 for medical emergencies. Do not wait for this form.','Im Notfall ruf 112 an, bei medizinischen Notfällen 144. Warte nicht auf dieses Formular.','En cas d’urgence, appelez le 112, ou le 144 pour une urgence médicale. N’attendez pas ce formulaire.'])}</p>}
    <div className="fields-row"><label>{tr(locale,['Name','Name','Nom'])}<input name="name" autoComplete="name" placeholder={tr(locale,['e.g. Lena Steiner','z. B. Lena Steiner','p. ex. Lena Steiner'])} required minLength={2} maxLength={90} /></label><label>{tr(locale,emailLabel)}<input name="email" type="email" autoComplete="email" placeholder={tr(locale,['you@example.ch','du@example.ch','vous@exemple.ch'])} required maxLength={254} /></label></div>
    {kind==='ride' && <label>{tr(locale,['Trip ID','Fahrt-ID','Identifiant du trajet'])}<input name="trip" required maxLength={80} /></label>}
    {kind==='partner' && <label>{tr(locale,['Organisation email','E-Mail der Organisation','E-mail de l’organisation'])}<input type="email" name="organisationEmail" required maxLength={254} /></label>}
    <label>{tr(locale,['Your message','Deine Nachricht','Votre message'])}<textarea name="message" rows={5} required minLength={10} maxLength={4000} placeholder={tr(locale,['Describe what you need — e.g. a lost item after last night’s ride …','Beschreibe dein Anliegen – z. B. ein vergessener Gegenstand nach der letzten Fahrt …','Décrivez votre demande — p. ex. un objet oublié après votre trajet …'])} /></label>
    <label className="honeypot" aria-hidden="true">Website <input type="text" autoComplete="off" name="website" tabIndex={-1} /></label>
    <label className="consent-line"><input type="checkbox" name="consent" required /><span>{tr(locale,['Use my details to reply to this request.','Verwende meine Angaben für die Antwort auf diese Anfrage.','Utilisez mes données pour répondre à cette demande.'])}{' '}<Link href={href(locale,'legal/privacy')} target="_blank" rel="noopener noreferrer">{tr(locale,legalTitles.privacy)}</Link>.</span></label>
    {error && <p className="form-error" id={`${id}-error`} role="alert">{error}</p>}
    <button type="submit" className="button primary" disabled={state==='loading'}>{state==='loading' ? tr(locale,['Sending…','Wird gesendet…','Envoi…']) : tr(locale,['Send message','Nachricht senden','Envoyer le message'])}{state==='loading' ? <LoaderCircle className="spin" size={17} aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}</button>
  </form>;
}

export function Unsubscribe({ locale }: { locale: Locale }) {
  const [state,setState] = useState<'ready'|'loading'|'done'|'error'>('ready');
  const token = useSearchParams().get('token');
  const remove = async () => {
    if (!token) return;
    setState('loading');
    try { if (!(await postForm('unsubscribe',{token})).ok) throw new Error(); setState('done'); window.history.replaceState(null,'',window.location.pathname); } catch { setState('error'); }
  };
  return <div className="unsubscribe-box">{state==='done' ? <p role="status"><CircleCheck size={20} aria-hidden="true" />{tr(locale,['You’re unsubscribed from this list.','Du bist von dieser Liste abgemeldet.','Vous êtes désinscrit de cette liste.'])}</p> : <>{token && <button type="button" className="button primary" onClick={remove} disabled={state==='loading'}>{tr(locale,['Confirm unsubscribe','Abmeldung bestätigen','Confirmer la désinscription'])}</button>}{state==='error' && <p role="alert" className="form-error">{tr(locale,genericError)}</p>}<a className="text-link" href={`mailto:${contactEmail}?subject=Lines%20waitlist%20unsubscribe`}>{tr(locale,['Contact Lines about your subscription','Lines zur Anmeldung kontaktieren','Contacter Lines au sujet de votre inscription'])}<ArrowRight size={16} aria-hidden="true" /></a></>}</div>;
}
