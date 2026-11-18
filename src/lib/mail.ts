import 'server-only';
import { contactEmail, href, siteOrigin, tr, type Audience, type Locale } from '@/lib/site';

type Email = { to: string; subject: string; text: string; replyTo?: string; key: string; unsubscribe?: string };
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.LINES_EMAIL_FROM);

export async function sendEmail({ to, subject, text, replyTo, key, unsubscribe }: Email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LINES_EMAIL_FROM;
  if (!apiKey || !from) return false;
  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(8500),
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify({ from, to: [to], subject, text, reply_to: replyTo, headers: unsubscribe ? { 'List-Unsubscribe': `<${unsubscribe}>` } : undefined }),
    });
    if (!result.ok) console.warn('Lines mail provider response', result.status);
    return result.ok;
  } catch { console.warn('Lines mail provider unavailable'); return false; }
}

export function waitlistConfirmation({ email, locale, intent, unsubscribeToken, id }: { email: string; locale: Locale; intent: Audience; unsubscribeToken: string; id: string }) {
  const choices = `${siteOrigin}${href(locale, `waitlist-unsubscribe?token=${unsubscribeToken}`)}`;
  const note = {
    rider: tr(locale, ['Compare offers and decide what works for you.', 'Vergleiche Angebote und entscheide selbst, was passt.', 'Comparez les offres et choisissez celle qui vous convient.']),
    driver: tr(locale, ['Your service fee is visible upfront. Payouts are every Monday.', 'Du siehst die Gebühr vorab. Auszahlung jeden Montag.', 'Les frais sont affichés à l’avance. Versements chaque lundi.']),
    partner: tr(locale, ['Your commission is shown before booking. Payouts are scheduled for the 1st each month.', 'Du siehst die Provision vor jeder Buchung. Auszahlungen sind jeweils am 1. geplant.', 'La commission est affichée avant réservation. Les versements sont planifiés le 1er du mois.']),
  }[intent];
  const subject = tr(locale, ['You’re on the Lines list — your launch link is coming', 'Du bist auf der Lines-Liste – dein Link folgt zum Start', 'Vous êtes sur la liste Lines — votre lien arrivera au lancement']);
  const greeting = tr(locale, ['Hello', 'Hallo', 'Bonjour']);
  const name = email.split('@')[0].split(/[.+_]/)[0].slice(0, 48);
  const intro = tr(locale, ['Thanks for joining Lines. We’ll send your download or partner link when we launch across Switzerland.', 'Danke für deine Anmeldung. Zum schweizweiten Start senden wir dir den Download- oder Partnerlink.', 'Merci de vous être inscrit. Nous vous enverrons votre lien de téléchargement ou partenaire au lancement en Suisse.']);
  const text = `${greeting} ${name},\n\n${intro}\n\n${note}\n\nLines\n\n${tr(locale, ['Manage preferences / unsubscribe', 'Einstellungen / Abmelden', 'Préférences / Désinscription'])}: ${choices}\n${tr(locale, ['Waitlist notice', 'Hinweis zur Warteliste', 'Informations sur la liste'])}: ${siteOrigin}${href(locale,'legal/waitlist-consent')}`;
  return sendEmail({ to: email, subject, text, key: `waitlist-${id}`, unsubscribe: choices });
}

export function forwardInquiry({ id, name, email, kind, message }: { id: string; name: string; email: string; kind: string; message: string }) {
  return sendEmail({ to: contactEmail, replyTo: email, key: `inquiry-${id}`, subject: `Lines website · ${kind}`, text: `From: ${name}\nEmail: ${email}\nTopic: ${kind}\nReference: ${id}\n\n${message}` });
}
