import { BottomViewDirectionProps } from '../bottomview/direction/bottomviewDirection'
import { FloorDisplay } from '../floorcontroller/floorcontroller'
import { LanguageDisplay } from '../languageSelector/languageSelector'
import { lang_floor, lang_search_no_results } from '../localizor/localizor'
import { Floor, FloorTranslation, SearchResult, Translation } from '../types/types'

export const buildFloorDisplays = (floors: Floor[], language: string): FloorDisplay[] => {
  return floors.map((f) => {
    const translation = translationFloorForLanguage(f.translations, language)
    return { title: translation.shortTitle, number: f.number }
  })
}

export const buildLanguageDisplays = (languages: string[]): LanguageDisplay[] => {
  return languages.map((l) => {
    return {
      code: l,
      value: LANGUAGES[l],
    }
  })
}

export const buildPlaceDetails = (placeDetails: any, language: string): any => {
  const translation = translationForLanguage(placeDetails.translations, language)

  let floorLabel = translationFloorForLanguage(placeDetails.floor.translations, language).title
  if (parseFloat(floorLabel) === placeDetails.floor.number) {
    floorLabel = lang_floor(language, placeDetails.floor.number)
  }
  return {
    ...placeDetails,
    objectClass: 'placeDetails',
    titleLabel: translation.title,
    subtitleLabel: translation.subTitle,
    detailsLabel: translation.details,
    floorLabel: floorLabel,
  }
}

export const buildPlacelistDetails = (placelist: any, places: any[], language: string, preferredLanguage: string): any => {
  const translation = translationForLanguage(placelist.translations, language)
  places = places.map((p) => {
    const t = translationForLanguage(p.translations, language)
    return {
      ...p,
      objectClass: 'place',
      titleLabel: t.title,
      subtitleLabel: t.subTitle,
      floorLabel: lang_floor(preferredLanguage, p.floor),
    }
  })
  return {
    ...placelist,
    titleLabel: translation.title,
    subtitleLabel: translation.subTitle,
    detailsLabel: translation.details,
    places,
  }
}

export const buildPlacelist = (placelist: any, language: string): any => {
  const translation = translationForLanguage(placelist.translations, language)
  return {
    ...placelist,
    titleLabel: translation.title,
    subtitleLabel: translation.subTitle,
    detailsLabel: translation.details,
  }
}

export const buildSearchResult = (searchResult: any[], language: string, preferredLanguage: string): SearchResult[] => {
  const map = searchResult.map((s) => {
    if (!s) {
      return {}
    }
    const translation = translationForLanguage(s.translations, language)
    let floorLabel
    if (s.floorDetails) {
      floorLabel = translationFloorForLanguage(s.floorDetails.translations, language).title
      if (parseFloat(floorLabel) === s.floorDetails.number) {
        floorLabel = lang_floor(language, s.floorDetails.number)
      }
    }
    return {
      ...s,
      title: translation.title,
      subtitle: translation.subTitle,
      floorLabel,
    }
  })

  // Fixing missing title for translation
  return map.filter((s) => s.title)
}

export const titleForLanguage = (object: any, language: string): string => {
  return translationForLanguage(object.translations, language).title
}

export const subtitleForLanguage = (object: any, language: string): string => {
  return translationForLanguage(object.translations, language).subTitle
}

export const buildLanguageDisplay = (language: string): string => {
  return LANGUAGES[language]
}

export const buildDirectionInfo = (direction: any, unit: string): BottomViewDirectionProps => {
  const timeInMinuts = Math.floor(direction.traveltime / 60)

  let distanceLabel
  if (unit === 'm') {
    distanceLabel = Math.floor(direction.distance) + ' m'
  } else {
    distanceLabel = Math.floor(direction.distance * 3.28084) + ' ft'
  }
  return {
    durationLabel: timeInMinuts < 1 ? '< 1 min' : timeInMinuts + ' min',
    distanceLabel: distanceLabel,
  }
}

export const buildDirectionError = (language: string): BottomViewDirectionProps => {
  return {
    durationLabel: '',
    distanceLabel: '',
    errorLabel: lang_search_no_results(language),
  }
}

export const translationFloorForLanguage = (translations: FloorTranslation[], language: string): FloorTranslation => {
  const filterTranslation = translations.filter((t) => t.language === language)
  if (filterTranslation.length === 0) {
    return translations[0]
  } else {
    return filterTranslation[0]
  }
}

export const translationForLanguage = (translations: Translation[], language: string): Translation => {
  const filterTranslation = translations.filter((t) => t.language === language)
  if (filterTranslation.length === 0) {
    return translations[0]
  } else {
    return filterTranslation[0]
  }
}

const LANGUAGES: { [key: string]: string } = {
  da: 'Dansk',
  de: 'Deutsch',
  nl: 'Nederlands',
  hu: 'Magyar',
  es: 'Español',
  fr: 'Français',
  en: 'English',
  fi: 'Suomi',
  ru: 'Pусский язык',
  zh: '中文',
  pt: 'Português',
  it: 'Italiano',
  no: 'Norsk',
  ja: '日本語',
  ar: 'العربية',
  sv: 'Svenska',
  tr: 'Türkçe',
  ko: '한국어',
  ca: 'català',
  et: 'Eesti',
  zf: '正體字',
}

export const replaceColorInBase64svg = (svg: string, toColor: string) => {
  const encoded = svg.replace('data:image/svg+xml;base64,', '')
  let decoded = atob(encoded)
  decoded = decoded.replace(/#000000/g, toColor)
  return 'data:image/svg+xml;base64,' + btoa(decoded)
}
