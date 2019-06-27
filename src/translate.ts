import { template, find } from 'lodash'

var language = "en";
var data: any = {};

const init = (): void => {
  var reqLocale = require.context('./locales');
  ['en', 'fr'].forEach(lang => {
    data[lang] = reqLocale('./' + lang + '.locale.json')
  })
}

const translate = (key: string, p?: any): string => {
  var compiled = template(data[language][key]);
  return compiled(p)
}

const local = (local: string) => {
  language = local;
}

export { init, translate, local }
