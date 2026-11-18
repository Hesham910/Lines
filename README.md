# Lines — Switzerland

A Next.js App Router / PostgreSQL prototype for the public Lines launch. The pre-launch experience is functional: signups, consent records, duplicate handling, unsubscribe, support inquiries are persisted via Drizzle. The external Lines-trips product lives at https://lines-trips.com/home — this site links out to it and does not implement trips, credentials, dispatch, bank data or rates.

## Visual identity (this release)

- Brand green `#94C120` and accent orange `#EE7103` across the whole project (CSS tokens, logo, favicon, map artwork, screens).
- Dark mode is the only shipped look; the theme switch is removed from the navigation.
- Browser tab shows `Lines` on the home page (inner pages remain `Page | Lines`).
- Header logo renders at two thirds of its previous size.

## Hero

- Animated street-map scene (route dashes, moving traffic dots, pulsing stops) behind two holographic device cards (375:812, WebGL holo foil + pointer tilt + idle drift, adapted from the React Bits HoloCard).
- Device screens are swappable images: `public/media/app-hero-rider.png` and `app-hero-driver.png`.
- New "offer accepted" glass card between the devices (animated check + price).
- Removed from the hero: the payment-provider name, "Licensed drivers only", and the "Partner with Lines" link.

## Sections

- "Three ways to move." is a stacked-card scroll deck (each card pins and the next slides over it).
- Rider / driver features show two-line headings, icon point cards, and cascading 3D screenshot sliders (8 phone frames each, wheel/drag/click, edge fades into the page background).
- The partner feature and the /partners page share a landscape tablet slider (1440:812, 8 screens).
- Partner industry cards and the safety cards get a holographic foil tilt on hover (lazy WebGL — contexts are only alive while interacting).
- "Four steps to get going" is a scroll-driven timeline: an SVG track fills as you scroll, each step pairs copy with a tablet frame image (`public/media/step-partner-N.png`).
- "Every trip, every amount, in one place" pairs an illustrative account ledger with point cards.
- "Seven ways to ride." is a snap-scrolling rail of class cards (7 columns on wide screens).
- The cookie card uses glassmorphism; the waitlist dialog has full-width segmented audience tabs, a centered privacy link and more space around the submit button.
- Store buttons use the official Google Play (multicolor) and Apple glyphs.
- Section headings are sized down; the hero title is unchanged.

## Round-2 refinements

- Hero badge and section-title dots use the accent orange; the hero route is orange with fully visible pickup (person) and destination (flag) icons layered above the phones.
- Phone frames are 2px-stroke device outlines with a full-bleed screenshot; hovering them replays the Uiverse "Cyber Card" effect (5×5 tracker tilt, glare, glow, particles, corner brackets, scan line) in identity colours.
- Screenshot sliders auto-advance every 2s (no manual controls): the centred frame is upright and full colour, neighbours tilt out of the container corners in grayscale, a progress ring loops around the centred frame. Phone scale is 75% of the previous one; the partner slider keeps its size but uses the same mechanism and 1440:812 frames.
- Feature points render as stacked rows (borderless icon frame + title + one-line description) with the same cyber hover and z-raising.
- "Three ways to move." cards were rebuilt (numbered head, large icon frame, three fact chips, partner card carries a real "Partner with Lines" button into /partners).
- How-Lines-works points render as an animated numbered timeline; "Seven ways to ride." is hidden; the fare heading breaks onto two lines.
- Safety is a single sharp-cornered panel with hairline dividers, orange icons and a soft glow on hover (its link row was removed).
- The Swiss coverage map is now an interactive outline of Switzerland with all nine launch cities: picking a city (chips or dots) lights up its region; cities pages share the map and a scroll-driven "From pickup to arrival" timeline with a swapping phone frame. "Drive in your city" was removed.
- Language switching is a dropdown in the header and footer (no dialog). Footer status pill reads "Launching soon".
- FAQ search row keeps topic tabs on the same line (auto-spaced, end-aligned); all legal/policy link rows stack vertically; the pre-launch draft notice and the support "Service and escalation" card were removed; support inputs carry descriptive placeholders; the final banner pairs a two-line headline/description with a wider form.

## Round-3 refinements

- The hero "Partner with Lines" button moved into "Your guests ride. You earn." as its primary CTA (internal /partners); the hero keeps CTA + driver buttons.
- Hero route: pickup marker (brand lime) in the top-left corner, destination flag (orange) in the bottom-right on the primary-button baseline, both layered above the devices; the dashed orange route now runs behind the two phone screens.
- "Three ways to move." cards got an editorial rebuild: huge outlined index numeral, wide headline block, large dashed-inset icon tile, hairline fact-chip row and CTA bar, per-audience glow washes.
- The slider progress ring (loading-style icon) was removed entirely; feature rows now wrap descriptions onto two lines in slimmer cards, the feature title tints to the row's icon colour on hover, and the slider column takes the wider half.
- The How-Lines-works timeline animates when scrolled into view (line draws top-down, items stagger in).
- Safety section background lifts one subtle step above the page; its icon frames are sharp-cornered, stroke-free, and hover is a slow soft glow; store buttons get a soft 300ms hover with a small lift.

## Round-4 refinements

- Hero: content, phones and the OFFER ACCEPTED card sit slightly higher; the route now starts at the pickup marker's centre, the destination flag moved left/up (fully visible at 100% zoom) with a larger route-centred intersection dot below it; the whole route layer (markers, moving route, traffic dots) is hidden on mobile.
- Language menus: every option stays on one line and is always LTR.
- Trust strip icon frames are uniform 34×34 squares, matching the feature-row icons.
- "Three ways" cards: icon strokes removed in favour of soft audience glows; the three fact chips use a glass-morphism surface.
- Primary buttons hover to #6D9111 site-wide; in the partners section the policy link stays beside the primary button.
- How-Lines-works: every step number is stroked; a spotlight steps through the numbers every 5s (solid fill + coloured title + dimmed 60% path ahead), looping.
- Safety section uses the exact #010F07 background with more translucent icon frames.
- About Lines and Unsubscribe pages/links were removed entirely (footer, routes, sitemap).
- The waitlist dialog now truly centres the "How we protect your data" link under the primary button.
- Legal page sidebars: sticky, link list capped, never scrolls internally.
- Partners page: the eight guest segments merged into one sharp-cornered container with hairline dividers and square icon frames; "Every trip, every amount" was rebuilt as a single editorial ledger shell (balance hero + transaction rows + three protection cells).
- Responsive: phone frames keep 375:812 and tablet frames 1440:812 (scaled); stacked cards no longer pin over the intro on mobile; feature CTAs stack full/half width; the partner slider sits above its copy; FAQ "All questions" and "Send message" go full width.

## Round-5 refinements

- Destination flag raised and moved further left; the route now ends exactly at the centre of the intersection dot below the flag.
- All hero content sits closer to the navbar.
- Trust and point-row icon frames get flex:none, so the "Licensed professional drivers" frame can never be squeezed out of square (all frames 34x34).
- "Partner with Lines" stays on one line inside its button (flex:none + nowrap on feature CTAs).
- How-Lines-works numbers wait at 50% opacity and go solid at full visibility on their turn.
- The "Open Lines-trips" and "Partner Terms" links under "Four steps to get going" were removed.
- FAQ: "All questions" and "Still have a question? Talk to Lines" are centred under the list on desktop.
- The partner card CTA in "Three ways to move" now uses the same ghost text-link style as the other two cards.
- The scroll-down pinch/dim effect on the door cards now also runs on mobile.
- On mobile the "Partner Commission & Payouts" link takes the full row and never wraps.

## Partner funnel

- "Explore Lines-trips" buttons open https://lines-trips.com/home (external).
- The demo request button and the local Lines-trips preview page were removed; `/de/partners/portal` now 404s.
- No payment-provider brand names appear anywhere; payments copy says "trusted, secure payment gateway" in DE/FR/EN.

## Screens and media

Everything in `public/media/app-*.png`, `step-partner-*.png`, the hero pair, `zurich.webp`, `furka.webp` and `lines-social.png` is a generated placeholder. Replace any file with a real capture using the same name and aspect ratio (phone 750×1624, tablet 2880×1624) — no code changes needed.

## Startup and deployment

1. Set the environment from `.env.example`. The sandbox provides `DATABASE_URL`.
2. Apply the Drizzle schema (`npx drizzle-kit push` for this sandbox).
3. Build and deploy. The runtime healthcheck is `/api/health`; `/api/lines/count` verifies the waitlist schema and returns the real number of unique emails. Set `LINES_FRAME_PROTECTION=1` on the live domain to block iframe embedding.
4. Replace `public/logo/lines-dark.svg`, `public/logo/lines-light.svg` (128:40) and `public/favicon.svg` if the brand mark changes.

The public pages are statically generated in German (Swiss default), French and English; URL language is authoritative. Draft policy pages and confirmation pages are noindex. After Swiss legal review set `LINES_LEGAL_APPROVED=1` and rebuild.

## Email delivery and privacy

- The support endpoint targets **taxilinesapp@gmail.com** via Resend (`RESEND_API_KEY`, `LINES_EMAIL_FROM`). The visitor is Reply-To, never the sender. No key reaches the browser.
- Forms honestly say **saved** (not sent) when forwarding is not configured; pending messages stay in `lines_inquiries`. E1 goes out as soon as mail is configured.
- `src/lib/product-mail.ts` provides E2–E5 for trusted launch/app jobs only (no public endpoints). The launch message uses the external Lines-trips URL for partners and the store links for riders and drivers.
- Finish the production privacy checklist (controller roles, retention, provider agreements, jurisdiction) and set durable edge rate limits before public traffic.

## Analytics and conversion

- Basic Consent Mode: the GA4 tag (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) loads only after opt-in; ad storage stays denied. The site emits its own `page_view` (no query strings), `scroll_depth`, `audience_card_click`, `section_view`, `faq_open`, `city_page_view`, `waitlist_*`, `partner_register_start`, `app_store_click` and `deep_link_open` events without PII. Duplicated emails do not inflate conversions.

## Launch transition

`NEXT_PUBLIC_LINES_LAUNCH_AT` plus the four store URLs flip the site to the live state: header CTAs become store links, the waitlist dialog becomes a download panel with QR codes, and partner buttons point at Lines-trips.

## Counts and prices

All counts come from PostgreSQL only; no fake numbers. Prices shown on visuals are illustrative and labelled as examples.
