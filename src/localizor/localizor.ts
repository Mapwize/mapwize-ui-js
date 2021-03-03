export interface Locale {
  code: string
  name: string
}

export const lang_available_locale = (): Locale[] => {
  return [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pt', name: 'Português' },
  ]
}

export const lang_search_global = (language: string): string => {
  return translations[language].lang_search_global()
}

export const lang_search_venue = (language: string, title: string) => {
  return translations[language].lang_search_venue(title)
}

export const lang_entering_venue = (language: string, title: string) => {
  return translations[language].lang_entering_venue(title)
}

export const lang_search_no_results = (language: string) => {
  return translations[language].lang_search_no_results()
}

export const lang_choose_starting_point = (language: string) => {
  return translations[language].lang_choose_starting_point()
}

export const lang_choose_destination = (language: string) => {
  return translations[language].lang_choose_destination()
}

export const lang_on_floor = (language: string, floor: string) => {
  return translations[language].lang_on_floor(floor)
}

export const lang_floor = (language: string, floor: string) => {
  return translations[language].lang_floor(floor)
}

export const lang_coordinates = (language: string) => {
  return translations[language].lang_coordinates()
}

export const lang_current_location = (language: string) => {
  return translations[language].lang_current_location()
}

export const lang_use_current_location = (language: string) => {
  return translations[language].lang_use_current_location()
}

export const lang_empty_title = (language: string) => {
  return translations[language].lang_empty_title()
}

export const lang_menu = (language: string) => {
  return translations[language].lang_menu()
}

export const lang_back = (language: string) => {
  return translations[language].lang_back()
}

export const lang_direction = (language: string) => {
  return translations[language].lang_direction()
}

export const lang_information = (language: string) => {
  return translations[language].lang_information()
}

export const lang_zoom_out = (language: string) => {
  return translations[language].lang_zoom_out()
}

export const lang_zoom_in = (language: string) => {
  return translations[language].lang_zoom_in()
}

export const lang_reset_north = (language: string) => {
  return translations[language].lang_reset_north()
}

export const lang_use_ctrl = (language: string) => {
  return translations[language].lang_use_ctrl()
}

export const lang_change_language = (language: string) => {
  return translations[language].lang_change_language()
}

export const lang_change_universe = (language: string) => {
  return translations[language].lang_change_universe()
}

export const lang_call = (language: string) => {
  return translations[language].lang_call()
}

export const lang_website = (language: string) => {
  return translations[language].lang_website()
}

export const lang_share = (language: string) => {
  return translations[language].lang_share()
}

export const lang_outdoor = (language: string) => {
  return translations[language].lang_outdoor()
}

export const lang_website_not_available = (language: string) => {
  return translations[language].lang_website_not_available()
}

export const lang_phone_not_available = (language: string) => {
  return translations[language].lang_phone_not_available()
}

export const lang_capacity_not_available = (language: string) => {
  return translations[language].lang_capacity_not_available()
}

export const lang_opening_hours_not_available = (language: string) => {
  return translations[language].lang_opening_hours_not_available()
}

export const lang_schedule_not_available = (language: string) => {
  return translations[language].lang_schedule_not_available()
}

export const lang_currently_available = (language: string) => {
  return translations[language].lang_currently_available()
}

export const lang_currently_occupied = (language: string) => {
  return translations[language].lang_currently_occupied()
}

export const lang_monday = (language: string) => {
  return translations[language].lang_monday()
}

export const lang_tuesday = (language: string) => {
  return translations[language].lang_tuesday()
}

export const lang_wednesday = (language: string) => {
  return translations[language].lang_wednesday()
}

export const lang_thursday = (language: string) => {
  return translations[language].lang_thursday()
}

export const lang_friday = (language: string) => {
  return translations[language].lang_friday()
}

export const lang_saturday = (language: string) => {
  return translations[language].lang_saturday()
}

export const lang_sunday = (language: string) => {
  return translations[language].lang_sunday()
}

export const lang_open_24_7 = (language: string) => {
  return translations[language].lang_open_24_7()
}

export const lang_close_24_7 = (language: string) => {
  return translations[language].lang_close_24_7()
}

export const lang_close_open_at = (language: string, time: string) => {
  return translations[language].lang_close_open_at(time)
}

export const lang_close_open_tomorrow = (language: string, time: string) => {
  return translations[language].lang_close_open_tomorrow(time)
}

export const lang_close_open = (language: string, day: string, time: string) => {
  return translations[language].lang_close_open(day, time)
}

export const lang_open_close_at = (language: string, time: string) => {
  return translations[language].lang_open_close_at(time)
}

export const lang_open_close_tomorrow = (language: string, time: string) => {
  return translations[language].lang_open_close_tomorrow(time)
}

export const lang_open_close = (language: string, day: string, time: string) => {
  return translations[language].lang_open_close(day, time)
}

export const lang_open_all_day = (language: string) => {
  return translations[language].lang_open_all_day()
}

export const lang_closed = (language: string) => {
  return translations[language].lang_closed()
}

export const lang_floor_controller = (language: string) => {
  return translations[language].lang_floor_controller()
}

export const lang_start = (language: string) => {
  return translations[language].lang_start()
}

export const lang_destination = (language: string) => {
  return translations[language].lang_destination()
}

export const lang_clipboard = (language: string) => {
  return translations[language].lang_clipboard()
}

export const lang_details = (language: string) => {
  return translations[language].lang_details()
}

export const lang_overview = (language: string) => {
  return translations[language].lang_overview()
}

const translations: { [key: string]: { [key: string]: any } } = {
  en: {
    lang_search_global: () => `Search a venue...`,
    lang_search_venue: (title: string) => `Search in ${title}`,
    lang_entering_venue: (title: string) => `Entering in ${title}`,
    lang_search_no_results: () => `Sorry, we can't find any results`,
    lang_choose_starting_point: () => `Search a starting point, or click on the map...`,
    lang_choose_destination: () => `Search a destination, or click on the map...`,
    lang_on_floor: (floor: string) => `On floor ${floor}`,
    lang_floor: (floor: string) => `Floor ${floor}`,
    lang_coordinates: () => `Coordinates`,
    lang_current_location: () => `Current location`,
    lang_use_current_location: () => `Use my current location`,
    lang_empty_title: () => `Empty title`,
    lang_menu: () => `Menu`,
    lang_back: () => `Back`,
    lang_direction: () => `Direction`,
    lang_information: () => `Information`,
    lang_zoom_out: () => `Zoom out`,
    lang_zoom_in: () => `Zoom in`,
    lang_reset_north: () => `Reset north`,
    lang_use_ctrl: () => `Use ctrl+drag to rotate the map`,
    lang_change_language: () => `Change venue language`,
    lang_change_universe: () => `Change venue universe`,
    lang_call: () => `Call`,
    lang_website: () => `Website`,
    lang_share: () => `Share`,
    lang_outdoor: () => `Outdoor`,
    lang_website_not_available: () => `Website not available`,
    lang_phone_not_available: () => `Phone not available`,
    lang_capacity_not_available: () => `Capacity not available`,
    lang_opening_hours_not_available: () => `Opening hours not available`,
    lang_schedule_not_available: () => `Schedule not available`,
    lang_currently_available: () => `Currently available`,
    lang_currently_occupied: () => `Currently occupied`,
    lang_monday: () => `Monday`,
    lang_tuesday: () => `Tuesday`,
    lang_wednesday: () => `Wednesday`,
    lang_thursday: () => `Thursday`,
    lang_friday: () => `Friday`,
    lang_saturday: () => `Saturday`,
    lang_sunday: () => `Sunday`,
    lang_open_24_7: () => `Open 24/7`,
    lang_close_24_7: () => `Close 24/7`,
    lang_close_open_at: (time: string) => `Closed - opens at ${time}`,
    lang_close_open_tomorrow: (time: string) => `Closed - opens tomorrow at ${time}`,
    lang_close_open: (day: string, time: string) => `Closed - opens ${day} at ${time}`,
    lang_open_close_at: (time: string) => `Open - closes at ${time}`,
    lang_open_close_tomorrow: (time: string) => `Open - closes tomorrow at ${time}`,
    lang_open_close: (day: string, time: string) => `Open - closes ${day} at ${time}`,
    lang_open_all_day: () => `Open all day`,
    lang_closed: () => `Closed`,
    lang_floor_controller: () => `Select a floor`,
    lang_start: () => `Start`,
    lang_destination: () => `Destination`,
    lang_clipboard: () => `The share link has been copied to the clipboard`,
    lang_details: () => `Details`,
    lang_overview: () => `Overview`,
  },
  de: {
    lang_search_global: () => `Einen Ort suchen...`,
    lang_search_venue: (title: string) => `Suchen in ${title}`,
    lang_entering_venue: (title: string) => `Betreten ${title}`,
    lang_search_no_results: () => `Entschuldigung, Kein Resultat gefunden`,
    lang_choose_starting_point: () => `Wählen Sie den Startpunkt oder klicken Sie auf die Karte...`,
    lang_choose_destination: () => `Wählen Sie die Bestimmung, oder klicken Sie auf die Karte...`,
    lang_on_floor: (floor: string) => `Am Stock ${floor}`,
    lang_floor: (floor: string) => `Stock ${floor}`,
    lang_coordinates: () => `Koordinaten`,
    lang_current_location: () => `Aktueller Standort`,
    lang_use_current_location: () => `Nutzt mein aktuellen Standort`,
    lang_empty_title: () => `Leere Titel`,
    lang_menu: () => `Menü`,
    lang_back: () => `Zurück`,
    lang_direction: () => `Richtungen`,
    lang_information: () => `Information`,
    lang_zoom_out: () => `Verkleinern`,
    lang_zoom_in: () => `Vergrößern`,
    lang_reset_north: () => `Nach Norden ausrichten`,
    lang_use_ctrl: () => `Nutzen Sie die Tasten Strg + Bewegen um die Karte auszurichten`,
    lang_change_language: () => `Sprache des Veranstaltungsortes ändern`,
    lang_change_universe: () => `Universum des Veranstaltungsortes ändern`,
    lang_call: () => `Anruf`,
    lang_website: () => `Website`,
    lang_share: () => `Teilen`,
    lang_outdoor: () => `Freiraum`,
    lang_website_not_available: () => `Website nicht verfügbar`,
    lang_phone_not_available: () => `Telefonnummer nicht verfügbar`,
    lang_capacity_not_available: () => `Capacität nicht verfügbar`,
    lang_opening_hours_not_available: () => `Öffnungszeiten nicht verfügbar`,
    lang_schedule_not_available: () => `Planung night verfügbar`,
    lang_currently_available: () => `Momentan verfügbar`,
    lang_currently_occupied: () => `Momentan besetzt`,
    lang_monday: () => `Montag`,
    lang_tuesday: () => `Dienstag`,
    lang_wednesday: () => `Mittwoch`,
    lang_thursday: () => `Donnerstag`,
    lang_friday: () => `Freitag`,
    lang_saturday: () => `Samstag`,
    lang_sunday: () => `Sonnertag`,
    lang_open_24_7: () => `Geöffnet 24/7`,
    lang_close_24_7: () => `Geschlossen 24/7`,
    lang_close_open_at: (time: string) => `Geschlossen - Geöffnet um ${time} Uhr`,
    lang_close_open_tomorrow: (time: string) => `Geschlossen - Geöffnet Morgen um ${time} Uhr`,
    lang_close_open: (day: string, time: string) => `Geschlossen - Geöffnet ${day} um ${time} Uhr`,
    lang_open_close_at: (time: string) => `Geöffnet - Geschlossen um ${time} Uhr`,
    lang_open_close_tomorrow: (time: string) => `Geöffnet - Geschlossen Morgen um  ${time} Uhr`,
    lang_open_close: (day: string, time: string) => `Geöffnet - Geschlossen ${day} um ${time} Uhr`,
    lang_open_all_day: () => `Ganztägig geöffnet`,
    lang_closed: () => `Geschlossen`,
    lang_floor_controller: () => `Eine Etage wählen`,
    lang_start: () => `Start`,
    lang_destination: () => `Bestimmung`,
    lang_clipboard: () => `Der Freigabelink wurde in die Zwischenablage kopiert`,
    lang_details: () => `Details`,
    lang_overview: () => `Übersicht`,
  },
  fr: {
    lang_search_global: () => `Rechercher un lieu...`,
    lang_search_venue: (title: string) => `Rechercher dans ${title}`,
    lang_entering_venue: (title: string) => `Chargement de ${title}`,
    lang_search_no_results: () => `Désolé, aucun résultat trouvé`,
    lang_choose_starting_point: () => `Rerchercher le point de départ`,
    lang_choose_destination: () => `Rechercher la destination`,
    lang_on_floor: (floor: string) => `A l'étage ${floor}`,
    lang_floor: (floor: string) => `Etage ${floor}`,
    lang_coordinates: () => `Coordonnées`,
    lang_current_location: () => `Position actuelle`,
    lang_use_current_location: () => `Utiliser ma position actuelle`,
    lang_empty_title: () => `Titre vide`,
    lang_menu: () => `Menu`,
    lang_back: () => `Retour`,
    lang_direction: () => `Direction`,
    lang_information: () => `Information`,
    lang_zoom_out: () => `Dézoomer`,
    lang_zoom_in: () => `Zoomer`,
    lang_reset_north: () => `Orienter au nord`,
    lang_use_ctrl: () => `Utiliser ctrl+déplacer pour tourner la carte`,
    lang_change_language: () => `Changer la langue du lieu`,
    lang_change_universe: () => `Changer l'univers du lieu`,
    lang_call: () => `Appeler`,
    lang_website: () => `Site internet`,
    lang_share: () => `Partager`,
    lang_outdoor: () => `Dehors`,
    lang_website_not_available: () => `Site internet non disponible`,
    lang_phone_not_available: () => `Téléphone non disponible`,
    lang_capacity_not_available: () => `Capacité non disponible`,
    lang_opening_hours_not_available: () => `Heures d'ouverture non disponibles`,
    lang_schedule_not_available: () => `Emploi du temps non disponible`,
    lang_currently_available: () => `Actuellement libre`,
    lang_currently_occupied: () => `Actuellement occupé`,
    lang_monday: () => `Lundi`,
    lang_tuesday: () => `Mardi`,
    lang_wednesday: () => `Mercredi`,
    lang_thursday: () => `Jeudi`,
    lang_friday: () => `Vendredi`,
    lang_saturday: () => `Samedi`,
    lang_sunday: () => `Dimanche`,
    lang_open_24_7: () => `Ouvert 24/7`,
    lang_close_24_7: () => `Fermé 24/7`,
    lang_close_open_at: (time: string) => `Fermé - ouvre à ${time}`,
    lang_close_open_tomorrow: (time: string) => `Fermé - ouvre demain à ${time}`,
    lang_close_open: (day: string, time: string) => `Fermé - ouvre ${day} à ${time}`,
    lang_open_close_at: (time: string) => `Ouvert - ferme à ${time}`,
    lang_open_close_tomorrow: (time: string) => `Ouvert - ferme demain à ${time}`,
    lang_open_close: (day: string, time: string) => `Ouvert - ferme ${day} à ${time}`,
    lang_open_all_day: () => `Ouvert toute la journée`,
    lang_closed: () => `Fermé`,
    lang_floor_controller: () => `Changer d'étage`,
    lang_start: () => `Départ`,
    lang_destination: () => `Arrivée`,
    lang_clipboard: () => `Le lien de partage a été copié dans votre presse-papier`,
    lang_details: () => `Détails`,
    lang_overview: () => `Vue d'ensemble`,
  },
  nl: {
    lang_search_global: () => `Een locatie zoeken...`,
    lang_search_venue: (title: string) => `Zoeken in ${title}`,
    lang_entering_venue: (title: string) => `Binnenkomen in ${title}`,
    lang_search_no_results: () => `Sorry, geen resultaat gevonden`,
    lang_choose_starting_point: () => `Kies startpunt, of klik op de kaart...`,
    lang_choose_destination: () => `Kies bestemming, of klik op de kaart...`,
    lang_on_floor: (floor: string) => `Op de vloer ${floor}`,
    lang_floor: (floor: string) => `Verdieping ${floor}`,
    lang_coordinates: () => `Coördinaten`,
    lang_current_location: () => `Huidige locatie`,
    lang_use_current_location: () => `Gebruik mijn huidige locatie`,
    lang_empty_title: () => `Lege titel`,
    lang_menu: () => `Menu`,
    lang_back: () => `Terug`,
    lang_direction: () => `Richtingen`,
    lang_information: () => `Informatie`,
    lang_zoom_out: () => `Schaal verkleinen`,
    lang_zoom_in: () => `Schaal vergroten`,
    lang_reset_north: () => `Zet de peiling terug naar het noorden`,
    lang_use_ctrl: () => `Gebruik Ctrl+Bewegen om de kaart te draaien`,
    lang_change_language: () => `Taal van de plaats wijzigen`,
    lang_change_universe: () => `Universum van de plaats wijzigen`,
    lang_call: () => `Oproep`,
    lang_website: () => `Webpagina`,
    lang_share: () => `Delen`,
    lang_outdoor: () => `Buitenruimte`,
    lang_website_not_available: () => `Webpagina niet beschikbaar`,
    lang_phone_not_available: () => `Telefoonnummer niet beschikbaar`,
    lang_capacity_not_available: () => `Capaciteit niet beschikbaar`,
    lang_opening_hours_not_available: () => `Openingstijden niet beschikbaar`,
    lang_schedule_not_available: () => `Planning niet beschikbaar`,
    lang_currently_available: () => `Momenteel beschikbaar`,
    lang_currently_occupied: () => `Momenteel bezet`,
    lang_monday: () => `Mondag`,
    lang_tuesday: () => `Dinsdag`,
    lang_wednesday: () => `Woensdag`,
    lang_thursday: () => `Donderdag`,
    lang_friday: () => `Vrijdag`,
    lang_saturday: () => `Zaterdag`,
    lang_sunday: () => `Zondag`,
    lang_open_24_7: () => `Geopend 24/7`,
    lang_close_24_7: () => `Gesloten 24/7`,
    lang_close_open_at: (time: string) => `Gesloten - Geopend om ${time} uur`,
    lang_close_open_tomorrow: (time: string) => `Gesloten - Geopend morgen om ${time} uur`,
    lang_close_open: (day: string, time: string) => `Gesloten - Geopend ${day} om ${time} uur`,
    lang_open_close_at: (time: string) => `Geopend - Gesloten om ${time} uur`,
    lang_open_close_tomorrow: (time: string) => `Geopend - Gesloten morgen om ${time} uur`,
    lang_open_close: (day: string, time: string) => `Geopend - Gesloten ${day} om ${time} uur`,
    lang_open_all_day: () => `De hele dag geopend`,
    lang_closed: () => `Gesloten`,
    lang_floor_controller: () => `Kies een verdieping`,
    lang_start: () => `Start`,
    lang_destination: () => `Bestemming`,
    lang_clipboard: () => `Link is gekopieerd naarste klembord`,
    lang_details: () => `Details`,
    lang_overview: () => `Overzicht`,
  },
  pt: {
    lang_search_global: () => `Pesquisar no mapa`,
    lang_search_venue: (title: string) => `Pesquisar no ${title}`,
    lang_entering_venue: (title: string) => `A entrar no ${title}`,
    lang_search_no_results: () => `Infelizmente, nenhum resultado foi encontrado`,
    lang_choose_starting_point: () => `Escolha o ponto de partida ou clique no mapa ...`,
    lang_choose_destination: () => `Escolha o destino ou clique no mapa ...`,
    lang_on_floor: (floor: string) => `No piso ${floor}`,
    lang_floor: (floor: string) => `Piso ${floor}`,
    lang_coordinates: () => `Coordenadas`,
    lang_current_location: () => `Localizaçao atual`,
    lang_use_current_location: () => `Utilizar a minha localizaçao atual`,
    lang_empty_title: () => `Titulo não disponível`,
    lang_menu: () => `Menu`,
    lang_back: () => `Anterior`,
    lang_direction: () => `Direções`,
    lang_information: () => `Informação`,
    lang_zoom_out: () => `Diminuir o zoom`,
    lang_zoom_in: () => `Aumentar o zoom`,
    lang_reset_north: () => `Orientar em direção ao norte`,
    lang_use_ctrl: () => `Utilize ctrl+arrastar para orientar o mapa`,
    lang_change_language: () => `Alterar a lingua`,
    lang_change_universe: () => `Alterar a visualisation`,
    lang_call: () => `Telefonar`,
    lang_website: () => `Website`,
    lang_share: () => `Partilhar`,
    lang_outdoor: () => `Exterior`,
    lang_website_not_available: () => `Website não disponível`,
    lang_phone_not_available: () => `Telefone não disponível`,
    lang_capacity_not_available: () => `Capacidade não disponível`,
    lang_opening_hours_not_available: () => `Horário de abertura não disponível`,
    lang_schedule_not_available: () => `Horário não disponível`,
    lang_currently_available: () => `Atualmente disponível`,
    lang_currently_occupied: () => `Atualmente não disponível`,
    lang_monday: () => `Segunda-feira`,
    lang_tuesday: () => `Terça-feira`,
    lang_wednesday: () => `Quarta-feira`,
    lang_thursday: () => `Quinta-feira`,
    lang_friday: () => `Sexta-feira`,
    lang_saturday: () => `Sábado`,
    lang_sunday: () => `Domingo`,
    lang_open_24_7: () => `Aberto 24h por dia`,
    lang_close_24_7: () => `Fechado 24h por dia`,
    lang_close_open_at: (time: string) => `Fechado - abre às ${time}`,
    lang_close_open_tomorrow: (time: string) => `Fechado - abre amanhã às ${time}`,
    lang_close_open: (day: string, time: string) => `Fechado - abre ${day} às ${time}`,
    lang_open_close_at: (time: string) => `Aberto - fecha às ${time}`,
    lang_open_close_tomorrow: (time: string) => `Aberto - fecha amanhã às ${time}`,
    lang_open_close: (day: string, time: string) => `Aberto - fecha ${day} às ${time}`,
    lang_open_all_day: () => `Aberto todo o dia`,
    lang_closed: () => `Fechado`,
    lang_floor_controller: () => `Escolha o piso`,
    lang_start: () => `Partida`,
    lang_destination: () => `Destino`,
    lang_clipboard: () => `O link foi copiado para a área de transferência`,
    lang_details: () => `Detalhes`,
    lang_overview: () => `Visão global`,
  },
}
