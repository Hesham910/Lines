'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { href, tr, type Locale } from '@/lib/site';
import { InquiryForm, ShareButton } from './forms';
import { PartnerButton } from './site-context';

export function SupportForm({locale}: {locale:Locale}) {
  const topic = useSearchParams().get('topic');
  const initial = topic === 'safety' || topic === 'ride' || topic === 'partner' || topic === 'press' || topic==='accessibility' ? topic : 'general';
  return <InquiryForm key={initial} locale={locale} initial={initial}/>;
}

export function ThanksCopy({locale}: {locale:Locale}) {
  const query = useSearchParams();
  const partner = query.get('intent')==='partner';
  const existing = query.get('state')==='existing';
  return <div className="thanks-copy"><span className="icon-tile"><CircleCheck size={23} aria-hidden="true"/></span><p>{existing ? tr(locale,['This email was already on the list for that audience. No need to sign up again.','Diese E-Mail war bereits für diese Rolle eingetragen. Keine erneute Anmeldung nötig.','Cet e-mail figure déjà sur la liste de ce profil. Pas besoin de se réinscrire.']) : tr(locale,['Thanks for signing up. We’ll send your launch link by email when Lines goes live across Switzerland.','Danke für deine Anmeldung. Zum schweizweiten Start schicken wir dir den passenden Link per E-Mail.','Merci pour votre inscription. Nous enverrons votre lien par e-mail au lancement suisse.'])}</p><div className="button-row"><ShareButton locale={locale}/>{partner ? <PartnerButton/> : <Link className="text-link" href={href(locale,'legal/fare-rules')}>{tr(locale,['See how fares work','Tarifregeln ansehen','Comprendre les tarifs'])}<ArrowRight size={16} aria-hidden="true"/></Link>}</div></div>;
}
