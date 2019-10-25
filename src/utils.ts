import { find, get, set, map, isFinite, replace, uniq, pull } from 'lodash'
import * as $ from 'jquery';
import { Api, apiUrl, apiKey } from 'mapwize'

import uiConfig from './config'

const addClass = (classString: string, classToAdd: string) => {
    var classes = classString.split(' ')
    classes.push(classToAdd)
    uniq(classes)
    return classes.join(' ')
  }
  const removeClass = (classString: string, classToRemove: string) => {
    var classes = classString.split(' ')
    pull(classes, classToRemove)
    return classes.join(' ')
  }

const getTranslation = (o: any, lang: string, attr: string): string => {
    var translation = find(o.translations, {
        language: lang
    })
    if (o.defaultLanguage && get(translation, attr, '').length === 0) {
        translation = find(o.translations, {
            language: o.defaultLanguage
        })
    }
    return get(translation, attr, '')
}

const getIcon = (o: any) => {
    return get(o, 'cache["30"]', false)
    || get(o, 'style.markerUrl', false)
    || get(o, 'placeType.style.markerUrl', false)
    || get(o, 'icon', false)
    || uiConfig.DEFAULT_PLACE_ICON
}

const getPlaceList = (placeListId: string): Promise<any> => {
    return $.get(apiUrl() + '/v1/placeList/' + placeListId + '?api_key=' + apiKey(), {}, null, 'json')
}

const getPlace = (placeId: string): Promise<any> => {
    return Api.getPlace(placeId)
}

const getMainSearches = (mainSearches: Array<string>): Promise<any> => {
    return Promise.all(map(mainSearches, (mainSearch: any): Promise<any> => {
        if (mainSearch.objectClass === 'place') {
            return Api.getPlace(mainSearch.objectId).then((res: any) => set(res, 'objectClass', mainSearch.objectClass)).catch(() => Promise.resolve(null))
        } else {
            return getPlaceList(mainSearch.objectId).then((res: any) => set(res, 'objectClass', mainSearch.objectClass)).catch(() => Promise.resolve(null))
        }
    }))
}

const getMainFroms = (mainFroms: Array<string>): Promise<any> => {
    return Promise.all(map(mainFroms, (mainFrom: string): Promise<any> => {
        return Api.getPlace(mainFrom).then((res: any) => set(res, 'objectClass', 'place')).catch(() => Promise.resolve(null))
    }))
}

const latitude = (o: any): number => {
    if (isFinite(o.lat)) {
        return o.lat;
    } else if (isFinite(o.latitude)) {
        return o.latitude;
    }
    return 0;
}

const longitude = (o: any): number => {
    if (isFinite(o.lon)) {
        return o.lon;
    } else if (isFinite(o.lng)) {
        return o.lng;
    } else if (isFinite(o.longitude)) {
        return o.longitude;
    }
    return 0;
}

const replaceColorInBase64svg = (svg: string, toColor: string) => {
    var decoded = atob(svg)
    decoded = new Buffer(replace(decoded, /#000000/g, toColor)).toString('base64')
    return 'data:image/svg+xml;base64,' + decoded
}

export { getTranslation, getIcon, getMainSearches, getMainFroms, latitude, longitude, replaceColorInBase64svg, getPlace }
export { addClass, removeClass }
