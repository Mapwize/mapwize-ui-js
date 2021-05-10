const locales = require.context('../locales/', false, /\.locale\.ts$/)
const allLocalesFunctions: any = {}

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

lang_available_locale().forEach((l) => {
  const code = l.code
  allLocalesFunctions[code] = locales('./' + code + '.locale.ts').default
})

const languageOrDefault = (language: string): string => {
  const locale = lang_available_locale().find((l) => l.code === language)
  return locale ? locale.code : 'en'
}

export const lang_search_global = (language: string): string => {
  return allLocalesFunctions[languageOrDefault(language)].lang_search_global()
}

export const lang_search_venue = (language: string, title: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_search_venue(title)
}

export const lang_entering_venue = (language: string, title: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_entering_venue(title)
}

export const lang_search_no_results = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_search_no_results()
}

export const lang_choose_starting_point = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_choose_starting_point()
}

export const lang_choose_destination = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_choose_destination()
}

export const lang_on_floor = (language: string, floor: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_on_floor(floor)
}

export const lang_floor = (language: string, floor: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_floor(floor)
}

export const lang_coordinates = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_coordinates()
}

export const lang_current_location = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_current_location()
}

export const lang_use_current_location = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_use_current_location()
}

export const lang_empty_title = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_empty_title()
}

export const lang_menu = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_menu()
}

export const lang_back = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_back()
}

export const lang_direction = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_direction()
}

export const lang_information = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_information()
}

export const lang_zoom_out = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_zoom_out()
}

export const lang_zoom_in = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_zoom_in()
}

export const lang_reset_north = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_reset_north()
}

export const lang_use_ctrl = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_use_ctrl()
}

export const lang_change_language = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_change_language()
}

export const lang_change_universe = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_change_universe()
}

export const lang_call = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_call()
}

export const lang_website = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_website()
}

export const lang_share = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_share()
}

export const lang_outdoor = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_outdoor()
}

export const lang_website_not_available = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_website_not_available()
}

export const lang_phone_not_available = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_phone_not_available()
}

export const lang_capacity_not_available = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_capacity_not_available()
}

export const lang_opening_hours_not_available = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_opening_hours_not_available()
}

export const lang_schedule_not_available = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_schedule_not_available()
}

export const lang_currently_available = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_currently_available()
}

export const lang_currently_occupied = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_currently_occupied()
}

export const lang_monday = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_monday()
}

export const lang_tuesday = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_tuesday()
}

export const lang_wednesday = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_wednesday()
}

export const lang_thursday = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_thursday()
}

export const lang_friday = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_friday()
}

export const lang_saturday = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_saturday()
}

export const lang_sunday = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_sunday()
}

export const lang_open_24_7 = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_open_24_7()
}

export const lang_close_24_7 = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_close_24_7()
}

export const lang_close_open_at = (language: string, time: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_close_open_at(time)
}

export const lang_close_open_tomorrow = (language: string, time: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_close_open_tomorrow(time)
}

export const lang_close_open = (language: string, day: string, time: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_close_open(day, time)
}

export const lang_open_close_at = (language: string, time: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_open_close_at(time)
}

export const lang_open_close_tomorrow = (language: string, time: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_open_close_tomorrow(time)
}

export const lang_open_close = (language: string, day: string, time: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_open_close(day, time)
}

export const lang_open_all_day = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_open_all_day()
}

export const lang_closed = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_closed()
}

export const lang_floor_controller = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_floor_controller()
}

export const lang_start = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_start()
}

export const lang_destination = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_destination()
}

export const lang_clipboard = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_clipboard()
}

export const lang_details = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_details()
}

export const lang_overview = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_overview()
}

export const lang_error_required = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_error_required()
}

export const lang_description = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_description()
}

export const lang_summary = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_summary()
}

export const lang_issue_type = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_issue_type()
}

export const lang_issue_email = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_issue_email()
}

export const lang_place = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_place()
}

export const lang_venue = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_venue()
}

export const lang_report_an_issue = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_report_an_issue()
}

export const lang_issue_reported_success = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_issue_reported_success()
}

export const lang_send = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_send()
}

export const lang_cancel = (language: string) => {
  return allLocalesFunctions[languageOrDefault(language)].lang_cancel()
}
