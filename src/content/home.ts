import type { Audience, LocalText } from '@/lib/site';

type Point = { title: LocalText; text: LocalText };
export const hero = {
  badge: ['Launching soon · across Switzerland', 'Startet bald · in der ganzen Schweiz', 'Bientôt · dans toute la Suisse'],
  line1: ['Switzerland’s', 'Die Schweiz', 'La Suisse bouge'],
  line2: ['fairer way to move.', 'fährt fairer.', 'plus juste.'],
  body: ['Compare driver offers, pick the price that suits you, and ride with licensed professionals. From Zurich to Geneva, and every city in between.', 'Vergleiche Angebote, wähle den Preis, der für dich passt, und fahre mit lizenzierten Profis. Von Zürich bis Genf und überall dazwischen.', 'Comparez les offres, choisissez le prix qui vous convient et voyagez avec des professionnels agréés. De Zurich à Genève et partout entre les deux.'],
  cta: ['Get the app at launch', 'App zum Start erhalten', 'Recevoir l’app au lancement'],
  drive: ['Become a driver', 'Fahrer werden', 'Devenir chauffeur'],
  partner: ['Partner with Lines', 'Partner werden', 'Devenir partenaire'],
} satisfies Record<string, LocalText>;

export const trust = [
  { label: ['Licensed professional drivers', 'Lizenzierte Profifahrer', 'Chauffeurs professionnels agréés'], policy: 'insurance-liability' },
  { label: ['Upfront, agreed prices', 'Vereinbarte Preise vorab', 'Prix convenus à l’avance'], policy: 'fare-rules' },
  { label: ['24/7 in-app support', '24/7 Hilfe in der App', 'Assistance dans l’app 24 h/24'], policy: 'complaints' },
  { label: ['Secure payment gateway', 'Sicheres Zahlungsgateway', 'Passerelle de paiement sécurisée'], policy: 'privacy' },
] as const;
export const doors = [
  { intent: 'rider', section: 'ride', title: ['I need a ride.', 'Ich möchte mitfahren.', 'Je veux un trajet.'], text: ['Name your price, compare offers and choose your ride.', 'Nenne deinen Preis, vergleiche Angebote und entscheide selbst.', 'Proposez votre prix, comparez les offres et choisissez votre trajet.'] },
  { intent: 'driver', section: 'drive', title: ['I want to earn.', 'Ich möchte fahren.', 'Je veux conduire.'], text: ['Drive on your terms and see exactly what you earn.', 'Fahre zu deinen Bedingungen und sieh genau, was du verdienst.', 'Conduisez à vos conditions et voyez ce que vous gagnez.'] },
  { intent: 'partner', section: 'partners', title: ['I host guests.', 'Ich betreue Gäste.', 'Je reçois des clients.'], text: ['Book guest rides and earn on every completed trip.', 'Buche Gästefahrten und verdiene an jeder abgeschlossenen Fahrt.', 'Réservez pour vos clients et gagnez sur chaque trajet terminé.'] },
] as const;

export const rider = {
  heading: ['Choose your ride. Choose your price.', 'Deine Fahrt. Dein Preis.', 'Votre trajet. Votre prix.'] as LocalText,
  intro: ['Lines puts offers from professional drivers in front of you. You decide which one wins.', 'Lines zeigt dir Angebote von Profifahrern. Du entscheidest, welches zu dir passt.', 'Lines vous présente les offres de chauffeurs professionnels. À vous de choisir.'] as LocalText,
  points: [
    { title: ['Offer your price or compare', 'Preis nennen oder vergleichen', 'Proposez ou comparez'], text: ['See price, driver rating and arrival time on every offer.', 'Jedes Angebot zeigt Preis, Bewertung und Ankunftszeit.', 'Chaque offre indique le prix, la note et le délai d’arrivée.'] },
    { title: ['Seven ride classes', 'Sieben Fahrzeugklassen', 'Sept catégories'], text: ['Standard, Comfort, Premium, Taxi, Van for up to 7, Pet and Kids Seat.', 'Standard, Comfort, Premium, Taxi, Van für bis zu sieben Personen, Pet und Kids Seat.', 'Standard, Comfort, Premium, Taxi, Van jusqu’à sept personnes, Pet et Kids Seat.'] },
    { title: ['Plan ahead', 'Im Voraus planen', 'Prévoyez à l’avance'], text: ['Book from 1 hour ahead, with no upper limit. That includes airport trips.', 'Ab einer Stunde Vorlauf buchen, ohne Obergrenze. Auch zum Flughafen.', 'Réservez dès une heure à l’avance, sans limite supérieure, y compris pour l’aéroport.'] },
    { title: ['Waiting you can see', 'Sichtbare Wartezeit', 'Attente visible'], text: ['The first 5 minutes are free; the next 5 are charged with a live countdown.', 'Die ersten 5 Minuten sind gratis. Für die nächsten 5 siehst du den Countdown und die Gebühren.', 'Les 5 premières minutes sont gratuites. Les 5 suivantes sont payantes, avec un compte à rebours.'] },
    { title: ['Share your trip', 'Fahrt teilen', 'Partagez le trajet'], text: ['Trip code, optional PIN, live sharing, emergency button and driver blocking.', 'Fahrtcode, optionale PIN, Live-Teilen, Notfalltaste und Blockierfunktion.', 'Code de trajet, PIN facultatif, partage en direct, bouton d’urgence et blocage.'] },
    { title: ['Make every ride count', 'Punkte für jede Fahrt', 'Gagnez des points'], text: ['Collect points, redeem discounts and invite friends.', 'Sammle Punkte, löse Rabatte ein und lade Freunde ein.', 'Cumulez des points, utilisez des réductions et invitez vos proches.'] },
  ] satisfies Point[],
};
export const driver = {
  heading: ['Drive on your terms. Keep more of every fare.', 'Deine Bedingungen. Mehr von jeder Fahrt.', 'Conduisez à vos conditions. Gardez plus.'] as LocalText,
  intro: ['Set your own price per kilometre. Lines sets the service fee and shows it before you accept, not after you drive.', 'Lege deinen Preis pro Kilometer fest. Lines legt die Servicegebühr fest und zeigt sie dir vor der Annahme, nicht erst nach der Fahrt.', 'Fixez votre prix au kilomètre. Lines fixe les frais de service et les affiche avant l’acceptation, pas après le trajet.'] as LocalText,
  points: [
    { title: ['Only trips that work for you', 'Nur Fahrten, die zu dir passen', 'Les courses qui vous conviennent'], text: ['See the route and fare before accepting, then accept or skip without penalty.', 'Sieh Route und Fahrpreis vorab. Annehmen oder auslassen, ohne Strafe.', 'Voyez l’itinéraire et le prix avant d’accepter, ou passez sans pénalité.'] },
    { title: ['Fees in plain sight', 'Gebühren im Blick', 'Frais affichés clairement'], text: ['Your fee appears on each offer and receipt. Qualifying referrals can lower it.', 'Die Gebühr steht auf jedem Angebot und Beleg. Qualifizierte Empfehlungen können sie senken.', 'Les frais figurent sur chaque offre et reçu. Les parrainages éligibles peuvent les réduire.'] },
    { title: ['Paid every Monday', 'Auszahlung jeden Montag', 'Versement chaque lundi'], text: ['Weekly payouts go to your linked IBAN automatically through a trusted, secure payment gateway.', 'Wöchentliche Überweisungen gehen automatisch über ein vertrauenswürdiges, sicheres Zahlungsgateway an deine verknüpfte IBAN.', 'Les versements hebdomadaires arrivent automatiquement sur votre IBAN via une passerelle sécurisée et fiable.'] },
    { title: ['A fair place in line', 'Ein fairer Platz in der Warteschlange', 'Une file d’attente équitable'], text: ['See your live queue position at airports and stations.', 'Sieh deine Position an Flughäfen und Bahnhöfen in Echtzeit.', 'Voyez votre position en temps réel aux gares et aéroports.'] },
    { title: ['Know how your week is going', 'Deine Woche im Überblick', 'Votre semaine en un coup d’œil'], text: ['Daily and weekly stats, real road reports, and guaranteed dues on partner guest rides.', 'Tages- und Wochenstatistik, Verkehrsmeldungen und abgesicherte Ansprüche bei Gästefahrten.', 'Statistiques, alertes routières et garantie des montants dus sur les courses partenaires.'] },
    { title: ['Help with local requirements', 'Hilfe bei kantonalen Anforderungen', 'Aide pour les règles cantonales'], text: ['Get guidance on cantonal permits and applicable business registration.', 'Wir helfen bei kantonalen Bewilligungen und der nötigen Firmenregistrierung.', 'Obtenez des indications sur les permis cantonaux et l’inscription de l’entreprise.'] },
  ] satisfies Point[],
  note: ['21+, valid licence, professional passenger-transport permit where required, vehicle documents and background check.', 'Ab 21, gültiger Führerausweis, nötige Berufsbewilligung, Fahrzeugpapiere und Hintergrundprüfung.', 'Dès 21 ans, permis valide, autorisation professionnelle si requise, documents du véhicule et vérification.'] as LocalText,
};
export const partner = {
  heading: ['Your guests ride. You earn.', 'Deine Gäste fahren. Du verdienst.', 'Vos clients voyagent. Vous gagnez.'] as LocalText,
  intro: ['Book for your guests and earn commission on every completed ride at the rate configured for your account.', 'Buche für deine Gäste und erhalte auf jede abgeschlossene Fahrt die Provision, die für dein Konto gilt.', 'Réservez pour vos clients et touchez une commission sur chaque trajet terminé, au taux configuré pour votre compte.'] as LocalText,
  industries: ['For hotels, hospitals, banks, companies, practices, care homes, restaurants and any business that hosts guests.', 'Für Hotels, Spitäler, Banken, Unternehmen, Praxen, Pflegeheime, Restaurants und alle Betriebe mit Gästen.', 'Pour hôtels, hôpitaux, banques, entreprises, cabinets, maisons de soins, restaurants et autres lieux d’accueil.'] as LocalText,
  points: [
    { title: ['No app for your guest', 'Keine App für deine Gäste', 'Aucune app pour vos clients'], text: ['Book now or ahead. Guests pay their driver in cash.', 'Buche sofort oder im Voraus. Gäste zahlen beim Fahrer bar.', 'Réservez maintenant ou à l’avance. Le client paie le chauffeur en espèces.'] },
    { title: ['Know the fare before booking', 'Fahrpreis vor der Buchung sehen', 'Connaissez le prix avant de réserver'], text: ['See guest details, route, direct fare and your commission upfront. No price offers.', 'Sieh Gästedaten, Route, Direktpreis und Provision vorab. Keine Preisangebote.', 'Voyez les coordonnées, l’itinéraire, le prix direct et votre commission. Sans offres.'] },
    { title: ['Paid at the start of each month', 'Auszahlung zu Monatsbeginn', 'Versements en début de mois'], text: ['Scheduled on the 1st and completed within 3 business days through a trusted, secure payment gateway.', 'Am 1. geplant und über ein vertrauenswürdiges, sicheres Zahlungsgateway innerhalb von 3 Arbeitstagen ausgeführt.', 'Planifiés le 1er et effectués sous 3 jours ouvrables via une passerelle sécurisée et fiable.'] },
    { title: ['One place for every amount', 'Alle Beträge an einem Ort', 'Tous les montants au même endroit'], text: ['Track history, reports, guest debts and compensation. Driver dues are protected through your account.', 'Überblicke Fahrten, Berichte, Gästeschulden und Entschädigungen. Fahreransprüche sind über dein Konto abgesichert.', 'Suivez l’historique, les rapports, les dettes et les indemnisations. Votre compte garantit les montants dus au chauffeur.'] },
    { title: ['Practical guest preferences', 'Praktische Gästewünsche', 'Préférences utiles'], text: ['Request child seats, wheelchair access or a driver who speaks EN, DE, FR or AR.', 'Frage Kindersitze, Rollstuhlzugang oder Fahrer mit EN, DE, FR oder AR an.', 'Demandez un siège enfant, un accès fauteuil ou un chauffeur parlant EN, DE, FR ou AR.'] },
  ] satisfies Point[],
};

export const steps = {
  rider: [
    { title: ['Set your route', 'Route wählen', 'Définissez l’itinéraire'], text: ['Pick a ride class or name your own price in the app.', 'Wähle eine Fahrzeugklasse oder nenne deinen Preis in der App.', 'Choisissez une catégorie ou proposez votre prix dans l’app.'] },
    { title: ['Receive offers', 'Angebote erhalten', 'Recevez des offres'], text: ['Compare price, rating and arrival time from nearby drivers.', 'Vergleiche Preis, Bewertung und Ankunftszeit von Fahrern in der Nähe.', 'Comparez le prix, la note et l’arrivée des chauffeurs proches.'] },
    { title: ['Choose your driver', 'Fahrer auswählen', 'Choisissez votre chauffeur'], text: ['Your fare for the planned route is locked when you accept.', 'Der Preis der geplanten Route steht fest, wenn du annimmst.', 'Le prix du trajet prévu est fixé à l’acceptation.'] },
    { title: ['Track and share', 'Verfolgen und teilen', 'Suivez et partagez'], text: ['Share the trip live and get 5 free minutes at pickup.', 'Teile die Fahrt live und nutze 5 Gratisminuten beim Abholen.', 'Partagez le trajet en direct, avec 5 minutes gratuites au départ.'] },
    { title: ['Pay your way', 'So zahlen, wie es passt', 'Payez à votre façon'], text: ['Pay by card, wallet, Apple Pay or cash, then rate and tip.', 'Zahle per Karte, Wallet, Apple Pay oder bar. Bewerte die Fahrt und gib freiwillig Trinkgeld.', 'Payez par carte, portefeuille, Apple Pay ou en espèces, puis notez et donnez un pourboire.'] },
  ], driver: [
    { title: ['Register online', 'Online registrieren', 'Inscrivez-vous en ligne'], text: ['Submit your details, licence, vehicle documents and CHE registration where applicable.', 'Reiche deine Daten, Ausweis, Fahrzeugpapiere und gegebenenfalls CHE-Registrierung ein.', 'Fournissez vos coordonnées, permis, papiers du véhicule et inscription CHE si nécessaire.'] },
    { title: ['Get verified', 'Prüfung abwarten', 'Faites-vous vérifier'], text: ['The team reviews your documents. You can check your status in the app.', 'Das Team prüft deine Unterlagen. Den Status siehst du in der App.', 'L’équipe vérifie vos documents. Suivez le statut dans l’app.'] },
    { title: ['Set your terms', 'Bedingungen festlegen', 'Fixez vos conditions'], text: ['Choose your price per kilometre and your service areas.', 'Lege Kilometerpreis und Einsatzgebiete fest.', 'Choisissez votre prix au kilomètre et vos zones.'] },
    { title: ['See matching requests', 'Passende Anfragen sehen', 'Recevez les demandes'], text: ['Check the route and fare, then accept what works for you.', 'Prüfe Route und Fahrpreis und nimm an, was passt.', 'Vérifiez l’itinéraire et le prix, puis acceptez ce qui vous convient.'] },
    { title: ['Drive and get paid', 'Fahren und Geld erhalten', 'Conduisez et recevez vos gains'], text: ['Get paid every Monday to your linked IBAN through a trusted, secure payment gateway.', 'Erhalte deine Auszahlung jeden Montag über ein vertrauenswürdiges, sicheres Zahlungsgateway auf deine IBAN.', 'Recevez vos gains chaque lundi via une passerelle sécurisée et fiable sur votre IBAN.'] },
  ], partner: [
    { title: ['Create your partner account', 'Partnerkonto erstellen', 'Créez votre compte partenaire'], text: ['Use your organisation’s details on Lines-trips.', 'Nutze die Daten deines Betriebs auf Lines-trips.', 'Utilisez les coordonnées de votre organisation sur Lines-trips.'] },
    { title: ['Connect your bank account', 'Bankkonto verbinden', 'Reliez votre compte bancaire'], text: ['Set up secure payouts through our trusted payment gateway.', 'Richte sichere Auszahlungen über ein vertrauenswürdiges Zahlungsgateway ein.', 'Configurez des versements sécurisés via une passerelle fiable.'] },
    { title: ['Book for your guests', 'Für Gäste buchen', 'Réservez pour vos clients'], text: ['Book now or schedule. The direct fare is shown before confirmation.', 'Buche sofort oder später. Der Direktpreis erscheint vor der Bestätigung.', 'Réservez tout de suite ou plus tard. Le prix direct s’affiche avant confirmation.'] },
    { title: ['Earn commission', 'Provision verdienen', 'Touchez une commission'], text: ['Completed rides earn commission. Payouts are scheduled for the 1st each month.', 'Abgeschlossene Fahrten bringen Provision. Auszahlung jeweils am 1. geplant.', 'Les trajets terminés génèrent une commission, versée à partir du 1er de chaque mois.'] },
  ],
} satisfies Record<Audience, Point[]>;

export const rideClasses = [
  { name: 'Standard', text: ['Everyday trips at the base rate.', 'Alltagsfahrten zum Grundtarif.', 'Les trajets quotidiens au tarif de base.'] },
  { name: 'Comfort', text: ['More room, more quiet.', 'Mehr Platz, mehr Ruhe.', 'Plus d’espace, plus de calme.'] },
  { name: 'Premium', text: ['High-end cars for special occasions.', 'Gehobene Fahrzeuge für besondere Anlässe.', 'Des voitures haut de gamme pour les occasions.'] },
  { name: 'Taxi', text: ['The familiar city taxi.', 'Das vertraute Stadttaxi.', 'Le taxi de ville classique.'] },
  { name: 'Van', text: ['Up to 7 people and extra luggage.', 'Bis zu 7 Personen und zusätzliches Gepäck.', 'Jusqu’à 7 personnes et plus de bagages.'] },
  { name: 'Pet', text: ['Room for your four-legged friend.', 'Platz für deinen Vierbeiner.', 'Une place pour votre compagnon.'] },
  { name: 'Kids Seat', text: ['Certified child seats on request.', 'Zertifizierte Kindersitze auf Anfrage.', 'Sièges enfants homologués sur demande.'] },
] as const;
export const preferences = [
  ['Child seats · Maxi-Cosi / Römer', 'Kindersitz · Maxi-Cosi / Römer', 'Siège enfant · Maxi-Cosi / Römer'], ['Booster seats', 'Sitzerhöhung', 'Rehausseur'], ['Rollator & wheelchair on request', 'Rollator & Rollstuhl auf Anfrage', 'Déambulateur et fauteuil sur demande'], ['Non-smoking', 'Nichtraucher', 'Non-fumeur'], ['Driver language · EN / DE / FR / AR', 'Fahrersprache · EN / DE / FR / AR', 'Langue · EN / DE / FR / AR'],
] as const;
export const farePoints: LocalText[] = [
  ['The fare is locked for your planned route as soon as you accept.', 'Bei Annahme steht der Preis für deine geplante Route fest.', 'Le prix du trajet prévu est fixé dès l’acceptation.'],
  ['Offer caps are shown in the app. No surge multipliers.', 'Angebotsgrenzen stehen in der App. Keine Nachfrage-Multiplikatoren.', 'Les plafonds sont affichés dans l’app. Pas de multiplicateur de demande.'],
  ['Partner bookings are priced directly. No offers on either side.', 'Partnerbuchungen haben Direktpreise. Keine Angebote auf beiden Seiten.', 'Les réservations partenaires ont un prix direct, sans offre des deux côtés.'],
  ['After 5 free minutes, any paid waiting is shown live.', 'Nach 5 Gratisminuten wird bezahlte Wartezeit live angezeigt.', 'Après 5 minutes gratuites, l’attente payante s’affiche en direct.'],
  ['Every trip ends with an itemised receipt in CHF.', 'Jede Fahrt endet mit einem detaillierten Beleg in CHF.', 'Chaque trajet se termine par un reçu détaillé en CHF.'],
];
export const safety = [
  { title: ['Professionals only', 'Nur Profifahrer', 'Professionnels agréés'], text: ['We verify professional permits and vehicle papers before the first ride.', 'Wir prüfen Berufsbewilligungen und Fahrzeugpapiere vor der ersten Fahrt.', 'Nous vérifions les permis professionnels et les papiers du véhicule avant le premier trajet.'] },
  { title: ['Trip code & optional PIN', 'Fahrtcode & optionale PIN', 'Code trajet et PIN facultatif'], text: ['A private code confirms the right car and guest. A PIN adds a pickup check.', 'Ein privater Code bestätigt Auto und Gast. Eine PIN ergänzt die Abholprüfung.', 'Un code privé confirme le véhicule et le passager. Un PIN ajoute un contrôle.'] },
  { title: ['Live trip sharing', 'Fahrt live teilen', 'Partage en direct'], text: ['Share your route in real time with someone you trust.', 'Teile deine Route in Echtzeit mit einer Person deines Vertrauens.', 'Partagez votre itinéraire en temps réel avec un proche.'] },
  { title: ['Swiss emergency services', 'Schweizer Notruf', 'Urgences suisses'], text: ['Emergency: 112. For a medical emergency in Switzerland, call 144.', 'Notruf: 112. Bei einem medizinischen Notfall in der Schweiz: 144.', 'Urgences : 112. En cas d’urgence médicale en Suisse, appelez le 144.'] },
  { title: ['Two-way blocking', 'Gegenseitiges Blockieren', 'Blocage dans les deux sens'], text: ['Riders and drivers can block each other from future matches.', 'Fahrgäste und Fahrer können erneute Vermittlungen verhindern.', 'Passagers et chauffeurs peuvent bloquer de futures mises en relation.'] },
  { title: ['Driver road reports', 'Verkehrsmeldungen', 'Alertes routières'], text: ['Drivers can flag accidents, closures and hazards to the community.', 'Fahrer melden Unfälle, Sperrungen und Gefahren an die Community.', 'Les chauffeurs signalent accidents, fermetures et dangers à la communauté.'] },
] satisfies Point[];
