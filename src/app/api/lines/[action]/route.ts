import { createHash } from 'node:crypto';
import { and, countDistinct, eq } from 'drizzle-orm';
import { db } from '@/db';
import { consentLog, inquiries, waitlist } from '@/db/schema';
import { cities, consentVersion, industryNames, isAudience, isLocale, siteOrigin } from '@/lib/site';
import { emailConfigured, forwardInquiry, waitlistConfirmation } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Args = { params: Promise<{ action: string }> };
const emailRx = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/u;
const uuidRx = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const pick = (body: Record<string, unknown>, key: string, max: number) => typeof body[key] === 'string' ? body[key].trim().slice(0, max) : '';
const json = (data: object, status = 200, cache = 'no-store') => Response.json(data, {status, headers: {'Cache-Control':cache}});
const invalid = (field: string) => json({ status:'invalid', field }, 422);

const rateBuckets = new Map<string, { count: number; expires: number }>();
function limited(request: Request, action: string) {
  const address = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim();
  if (!address) return false; // Set durable per-client limits at the production edge as well.
  const now = Date.now();
  if (rateBuckets.size >= 2048) for (const [key, item] of rateBuckets) { if (item.expires < now) rateBuckets.delete(key); }
  if (rateBuckets.size >= 4096) rateBuckets.clear();
  const key = createHash('sha256').update(`${action}:${address}`).digest('hex');
  let bucket = rateBuckets.get(key);
  if (!bucket || bucket.expires < now) { bucket = { count: 0, expires: now + 60_000 }; rateBuckets.set(key, bucket); }
  return ++bucket.count > (action === 'consent' ? 35 : 12);
}

export async function GET(_request: Request, { params }: Args) {
  if ((await params).action !== 'count') return json({status:'not_found'},404);
  try {
    const [{ total }] = await db.select({ total: countDistinct(waitlist.email) }).from(waitlist);
    return json({ total }, 200, 'public, max-age=25, s-maxage=30, stale-while-revalidate=60');
  } catch { return json({ status: 'temporarily_unavailable' }, 503); }
}

export async function POST(request: Request, { params }: Args) {
  const { action } = await params;
  if (!['waitlist','support','demo','consent','unsubscribe'].includes(action)) return json({status:'not_found'},404);
  const origin = request.headers.get('origin');
  const requestHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    if (origin && origin !== new URL(request.url).origin && origin !== siteOrigin && new URL(origin).host !== requestHost) return json({status:'forbidden'},403);
  } catch { return json({status:'forbidden'},403); }
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({status:'invalid'},415);
  if (Number(request.headers.get('content-length')) > 16_384) return json({status:'too_large'},413);
  const raw = await request.text();
  if (raw.length > 16_384) return json({status:'too_large'},413);
  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return invalid('form');
    body = parsed;
  } catch { return invalid('form'); }
  if (limited(request, action)) return json({status:'rate_limited'},429);
  if (pick(body, 'website', 256)) return invalid('form');

  try {
    if (action === 'unsubscribe') {
      const token = pick(body,'token',90);
      if (!uuidRx.test(token)) return invalid('token');
      await db.delete(waitlist).where(eq(waitlist.unsubscribeToken, token));
      return json({status:'unsubscribed'});
    }
    const locale = body.locale;
    if (!isLocale(locale)) return invalid('locale');
    if (action === 'consent') {
      const visitor = pick(body, 'visitor', 64);
      if (!uuidRx.test(visitor) || typeof body.analytics !== 'boolean' || typeof body.marketing !== 'boolean') return invalid('consent');
      await db.insert(consentLog).values({ visitor, locale, analytics:body.analytics, marketing:body.marketing, version:consentVersion });
      return json({status:'recorded'}, 201);
    }
    const email = pick(body, 'email', 300).toLowerCase();
    if (email.length > 254 || !emailRx.test(email)) return invalid('email');
    if (body.consent !== true) return invalid('consent');
    if (action === 'waitlist') {
      const intent = body.intent;
      if (!isAudience(intent)) return invalid('intent');
      const cityText = pick(body,'city',48);
      const city = cities.find((item) => item.slug === cityText)?.slug ?? null;
      const source = pick(body,'source',64).replace(/[^a-z_0-9-]/gi,'') || 'website';
      const [created] = await db.insert(waitlist).values({ email, intent, locale, city, source, consentVersion }).onConflictDoNothing({target:[waitlist.email,waitlist.intent]}).returning();
      const [entry] = created ? [created] : await db.select().from(waitlist).where(and(eq(waitlist.email,email),eq(waitlist.intent,intent))).limit(1);
      let confirmation = Boolean(entry?.confirmationSentAt);
      if (entry && !confirmation && emailConfigured()) {
        confirmation = await waitlistConfirmation({ ...entry, locale, intent });
        if (confirmation) await db.update(waitlist).set({confirmationSentAt:new Date()}).where(eq(waitlist.id,entry.id));
      }
      return json({status:created ? 'joined' : 'duplicate', confirmation}, created ? 201 : 200);
    }

    const reference = pick(body, 'reference', 90);
    if (!uuidRx.test(reference)) return invalid('form');
    const first = pick(body,'name',90), last = pick(body,'lastName',86);
    let message = pick(body,'message',4001);
    const topic = pick(body,'kind',32);
    if (first.length < 2) return invalid('name');
    if (message.length > 4000) return invalid('message');
    const kind = action === 'demo' ? 'partner demo' : topic;
    if (action === 'demo') {
      const phone = pick(body, 'phone', 50), org = pick(body, 'organisation', 180), type = pick(body, 'industry', 30), volume = pick(body, 'volume', 24);
      if (!last || !org || !Object.hasOwn(industryNames,type) || !/^[+\d() .-]{5,36}$/.test(phone)) return invalid('details');
      message = `Organisation: ${org}\nType: ${type}\nPhone: ${phone}\nExpected trips / month: ${volume || 'not supplied'}\n\n${message}`;
    } else {
      if (!['general','ride','partner','safety','press','accessibility'].includes(topic) || message.length < 10) return invalid('message');
      if (topic === 'ride') {
        const trip = pick(body,'trip',80);
        if (!trip) return invalid('trip');
        message = `Trip ID: ${trip}\n\n${message}`;
      }
      if (topic === 'partner') {
        const organisationEmail = pick(body, 'organisationEmail', 256);
        if (!emailRx.test(organisationEmail)) return invalid('organisationEmail');
        message = `Organisation email: ${organisationEmail}\n\n${message}`;
      }
    }
    const name = [first,last].filter(Boolean).join(' ');
    const [created] = await db.insert(inquiries).values({ reference, name, email, kind, locale, message }).onConflictDoNothing({target:inquiries.reference}).returning();
    const [entry] = created ? [created] : await db.select().from(inquiries).where(and(eq(inquiries.reference,reference),eq(inquiries.email,email))).limit(1);
    if (!entry) return invalid('form');
    if (entry.delivery === 'sent') return json({ status:'sent' });
    const delivered = emailConfigured() && await forwardInquiry(entry);
    await db.update(inquiries).set({ delivery:delivered ? 'sent' : 'pending' }).where(eq(inquiries.id,entry.id));
    return json({ status:delivered ? 'sent' : 'saved' }, created ? 201 : 200);
  } catch (error) {
    // Never put database parameters (emails or messages) into logs.
    console.error('Lines form could not be processed', action, error instanceof Error ? error.name : 'UnknownError');
    return json({status:'temporarily_unavailable'},503);
  }
}
