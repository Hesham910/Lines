import type { LocalText } from '@/lib/site';

export const pageNames: Record<string,LocalText> = {
  driver:['Drive with Lines','Mit Lines fahren','Conduire avec Lines'], partners:['Partner with Lines','Partner von Lines','Devenir partenaire Lines'], cities:['Swiss cities','Schweizer Städte','Villes suisses'], faq:['Help & FAQ','Hilfe & FAQ','Aide et FAQ'], support:['Support & contact','Support & Kontakt','Assistance et contact'], 'waitlist-thank-you':['Waitlist confirmation','Wartelisten-Bestätigung','Confirmation d’inscription'], 'waitlist-unsubscribe':['Manage your waitlist subscription','Wartelisten-Anmeldung verwalten','Gérer votre inscription'],
};
export const pageDescriptions: Record<string,LocalText> = {
  driver:['Drive with Lines in Switzerland. Check the requirements, how fares work and the weekly Monday payout schedule.','Fahre mit Lines in der Schweiz. Erfahre, welche Voraussetzungen gelten und wie Fahrpreise und Montagsauszahlungen funktionieren.','Conduisez avec Lines en Suisse. Découvrez les conditions, les tarifs et les versements chaque lundi.'],
  partners:['Book guest rides with Lines-trips. See the direct fare before booking and earn commission on completed trips.','Buche Gästefahrten mit Lines-trips. Sieh den Direktpreis vorab und verdiene Provision auf abgeschlossene Fahrten.','Réservez avec Lines-trips. Voyez le prix direct avant réservation et gagnez une commission sur les trajets terminés.'],
  cities:['Lines launches in every Swiss city from day one. Explore availability, ride classes and driver information for your city.','Lines startet in jeder Schweizer Stadt. Entdecke Fahrzeugklassen und Informationen für deine Stadt.','Lines démarre dans chaque ville suisse. Découvrez les catégories et les informations pour votre ville.'],
  faq:['Search questions about fares, scheduling, payouts, guest rides and safety on Lines.','Durchsuche Fragen zu Fahrpreisen, Vorbestellungen, Auszahlungen, Gästefahrten und Sicherheit.','Trouvez les réponses sur les tarifs, la planification, les versements, les clients et la sécurité.'],
  support:['Contact Lines about a ride, partnership, safety issue, press request or accessibility question.','Kontaktiere Lines zu Fahrten, Partnerschaften, Sicherheit, Presse oder Barrierefreiheit.','Contactez Lines pour un trajet, un partenariat, un problème de sécurité, la presse ou l’accessibilité.'],
};

export const driverRequirements: LocalText[] = [
  ['At least 21 years old and a valid driver’s licence.', 'Mindestens 21 Jahre alt und ein gültiger Führerausweis.', 'Au moins 21 ans et un permis de conduire valide.'],
  ['Professional passenger-transport permission where required by your canton.', 'Bewilligung für berufsmässigen Personentransport, wo dein Kanton sie verlangt.', 'Autorisation de transport professionnel de personnes si votre canton l’exige.'],
  ['Current vehicle registration and commercial passenger-transport insurance.', 'Aktuelle Fahrzeugpapiere und Versicherung für gewerblichen Personentransport.', 'Papiers du véhicule à jour et assurance de transport professionnel.'],
  ['A completed background check and applicable business registration.', 'Abgeschlossene Hintergrundprüfung und erforderliche Firmenregistrierung.', 'Vérification des antécédents et inscription de l’entreprise si applicable.'],
];
export const industryDetails = {
  hotel:['A ride to the airport, from the door of your hotel.','Vom Hoteleingang direkt zur Weiterreise.','Un trajet jusqu’à l’aéroport, depuis votre hôtel.'],
  hospital:['Non-emergency travel, subject to patient transport rules.','Alltagsfahrten ausserhalb von Notfällen, nach den Regeln für Patiententransport.','Trajets non urgents, sous réserve des règles de transport des patients.'],
  bank:['Arrange transport for client appointments.','Fahrten für Kundentermine organisieren.','Organisez les déplacements pour les rendez-vous.'],
  company:['Help visitors reach your office or event.','Hilf Gästen, dein Büro oder deinen Anlass zu erreichen.','Aidez vos visiteurs à rejoindre vos bureaux ou événements.'],
  practice:['Coordinate transport after an appointment.','Fahrten nach einem Termin koordinieren.','Coordonnez le transport après une consultation.'],
  care:['Request space for a rollator or wheelchair where available.','Frage bei Verfügbarkeit Platz für Rollator oder Rollstuhl an.','Demandez un espace pour un déambulateur ou un fauteuil selon disponibilité.'],
  restaurant:['Get your guests a ride home when dinner ends.','Buche deinen Gästen nach dem Essen die Heimfahrt.','Réservez un trajet de retour à vos clients après le repas.'],
  other:['Add a reliable pickup option for your guests.','Biete deinen Gästen eine verlässliche Abholmöglichkeit.','Proposez une option de prise en charge à vos clients.'],
} satisfies Record<string,LocalText>;
