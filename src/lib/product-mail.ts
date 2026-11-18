import 'server-only';
import { isLive, storeLinks } from './launch';
import { sendEmail } from './mail';
import { href, partnerPortalUrl, siteOrigin, tr, type Audience, type Locale } from './site';

type ProductNotice = { id:string; to:string; locale:Locale } & (
  { kind:'launch'; intent:Audience; unsubscribeToken:string } |
  { kind:'partner-welcome'; payoutSetupUrl:string } |
  { kind:'driver-received'; city?:string; missingDocuments:readonly string[] } |
  { kind:'driver-approved' }
);

const urlFor = (locale:Locale,path:string) => `${siteOrigin}${href(locale,path)}`;
const appLinks = (intent:'rider'|'driver') => `Google Play: ${storeLinks[intent].google_play}\nApp Store: ${storeLinks[intent].app_store}`;
function secureUrl(value:string) { const url=new URL(value); if(url.protocol!=='https:') throw new Error('Expected a secure portal link'); return url.href; }

// Called by a trusted launch job or an authenticated app/portal integration, never by anonymous traffic.
export function sendProductNotice(event:ProductNotice) {
  const {locale,id,to,kind}=event;
  const t=(copy:Parameters<typeof tr>[1])=>tr(locale,copy);
  let subject:string;
  let body:string;
  let unsubscribe:string|undefined;
  if (kind==='launch') {
    if (!isLive(Date.now())) throw new Error('The configured launch is not active');
    subject=t(['Lines is live across Switzerland — your link is here','Lines ist schweizweit live – hier ist dein Link','Lines est disponible en Suisse — voici votre lien']);
    const next = event.intent==='rider' ? t(['Set your route, compare offers and book your first ride.','Wähle die Route, vergleiche Angebote und buche deine erste Fahrt.','Choisissez votre itinéraire, comparez les offres et réservez.']) : event.intent==='driver' ? t(['Complete your documents and set your service areas before going online.','Vervollständige deine Unterlagen und Einsatzgebiete, bevor du online gehst.','Complétez vos documents et vos zones avant de vous connecter.']) : t(['Set up your partner account to book the first guest ride.','Richte dein Partnerkonto für die erste Gästefahrt ein.','Configurez votre compte pour réserver le premier trajet client.']);
    unsubscribe=urlFor(locale,`waitlist-unsubscribe?token=${encodeURIComponent(event.unsubscribeToken)}`);
    body=`${next}\n\n${event.intent==='partner' ? partnerPortalUrl : appLinks(event.intent)}\n\n${t(['Terms','Bedingungen','Conditions'])}: ${urlFor(locale,'legal/terms')}\n${t(['Privacy','Datenschutz','Confidentialité'])}: ${urlFor(locale,'legal/privacy')}\n${t(['Unsubscribe','Abmelden','Se désinscrire'])}: ${unsubscribe}`;
  } else if (kind==='partner-welcome') {
    subject=t(['Welcome to Lines-trips — set up your first payout','Willkommen bei Lines-trips – richte deine Auszahlung ein','Bienvenue sur Lines-trips — configurez vos versements']);
    body=`${t(['Verify your organisation, connect your bank account, then book your first guest ride. Your account-specific commission is shown before booking. Payouts are scheduled on the 1st and completed within 3 business days.','Verifiziere deinen Betrieb, verbinde dein Bankkonto und buche deine erste Gästefahrt. Die Provision deines Kontos steht vor der Buchung. Auszahlung am 1. geplant, innert 3 Arbeitstagen ausgeführt.','Vérifiez l’organisation, reliez votre compte bancaire et réservez. La commission de votre compte s’affiche avant réservation. Versements planifiés le 1er et effectués sous 3 jours ouvrables.'])}\n\n${secureUrl(event.payoutSetupUrl)}\n${urlFor(locale,'partners')}\n${urlFor(locale,'legal/commission-partners')}`;
  } else if (kind==='driver-received') {
    subject=t(['Your Lines driver application is in','Deine Lines-Fahrerbewerbung ist da','Votre candidature Lines est reçue']);
    const missing=event.missingDocuments.map((line)=>`- ${line.replace(/[\r\n]+/g,' ').slice(0,200)}`).join('\n');
    const zurich=event.city==='zurich' ? t(['Check the Zurich limousine badge and applicable CHE registration.','Prüfe die Zürcher Limousinenplakette und die nötige CHE-Registrierung.','Vérifiez la vignette de Zurich et l’inscription CHE applicable.']) : '';
    body=`${t(['We review your licence, professional permit, vehicle documents and insurance. Check your status in the app.','Wir prüfen Führerausweis, Berufsbewilligung, Fahrzeugpapiere und Versicherung. Den Status siehst du in der App.','Nous vérifions permis, autorisation professionnelle, papiers et assurance. Suivez le statut dans l’app.'])}\n\n${missing ? `${t(['Still needed','Noch benötigt','Documents manquants'])}:\n${missing}\n\n` : ''}${zurich}\n${urlFor(locale,'driver#requirements')}`;
  } else {
    subject=t(['You’re verified — set your price and go online','Du bist verifiziert – Preis festlegen und online gehen','Vous êtes vérifié — fixez votre prix et connectez-vous']);
    body=`${t(['Set your price per kilometre and service areas. Weekly payouts go out on Monday through a trusted, secure payment gateway, and qualifying referrals may reduce the fee shown on every offer.','Lege Kilometerpreis und Einsatzgebiete fest. Auszahlungen über ein vertrauenswürdiges, sicheres Zahlungsgateway erfolgen montags. Qualifizierte Empfehlungen können die angezeigte Gebühr senken.','Fixez le prix au kilomètre et vos zones. Le versement arrive le lundi via une passerelle sécurisée et fiable ; les parrainages éligibles peuvent réduire les frais affichés.'])}\n\n${isLive(Date.now()) ? appLinks('driver') : t(['We’ll share the app link at launch.','Der App-Link folgt zum Start.','Le lien de l’app suivra au lancement.'])}\n${urlFor(locale,'legal/fees-drivers')}`;
  }
  return sendEmail({to,subject,text:`${body}\n\n${t(['Need help?','Brauchst du Hilfe?','Besoin d’aide ?'])} ${urlFor(locale,'support')}`,key:`${kind}-${id}`,unsubscribe});
}
