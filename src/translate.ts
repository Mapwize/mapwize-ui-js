import { join, template } from 'lodash'

const locales = require.context('./locales/', false, /\.locale\.json$/)

let currentLocale: string = 'en'
let currentTranslations: any = locales('./' + currentLocale + '.locale.json')

const getLocales = (): string[] => {
  return locales.keys().map((l: string) => l.replace(/\.\//g, '').replace(/\.locale\.json$/g, ''))
}

const getLocale = (): string => {
  return currentLocale
}

const translate = (key: string, p?: any): string => {
  const compiled = template(currentTranslations[key])
  return compiled(p)
}

const locale = (newLocale?: string): string => {
  if (newLocale) {
    if (getLocales().includes(newLocale)) {
      currentLocale = newLocale
      currentTranslations = locales('./' + currentLocale + '.locale.json')
    } else {
      throw new Error('Locale "' + newLocale + '" is not supported, use one of: ' + join(getLocales(), ', '))
    }
  }
  return currentLocale
}

export { translate, locale, getLocales, getLocale }
