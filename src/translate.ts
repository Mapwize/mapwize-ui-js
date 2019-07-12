import { template, join } from 'lodash'

const locals = require.context('./locals/', false, /\.local\.json$/)

let currentLocal: string = "en"
let currentTranslations: any = locals('./' + currentLocal + '.local.json')

const getLocals = (): Array<string> => {
  return locals.keys().map((local: string) => local.replace(/\.\//g, '').replace(/\.local\.json$/g, ''))
}

const translate = (key: string, p?: any): string => {
  var compiled = template(currentTranslations[key])
  return compiled(p)
}

const local = (newLocal?: string): string => {
  if (newLocal) {
    if (getLocals().includes(newLocal)) {
      currentLocal = newLocal
      currentTranslations = locals('./' + currentLocal + '.local.json')
    } else {
      throw new Error('Locale "' + newLocal + '" is not supported, use one of: ' + join(getLocals(), ', '))
    }
  }
  return currentLocal
}

export { translate, local, getLocals }
