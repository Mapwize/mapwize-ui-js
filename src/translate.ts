import { template, join } from 'lodash'

const locals = require.context('./locals/', false, /\.local\.json$/)

let currentLocal: string = "en"
let currentTranslations: any = {}

const getLocales = (): Array<string> => {
  return locals.keys().map((local: string) => local.replace(/\.\//g, '').replace(/\.local\.json$/g, ''))
}

const translate = (key: string, p?: any): string => {
  var compiled = template(currentTranslations[key])
  return compiled(p)
}

const local = (local: string) => {
  if (local) {
    if (getLocales().includes(local)) {
      currentLocal = local
      currentTranslations = locals('./' + local + '.local.json')
    } else {
      throw new Error('Locale "' + local + '" is not supported, use one of: ' + join(getLocales(), ', '))
    }
  }
  return currentLocal
}

export { translate, local }
