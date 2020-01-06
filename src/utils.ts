import { find, first, get, isFinite, map, pull, replace, set, uniq } from 'lodash'
import { Api, apiUrl } from 'mapwize'

import uiConfig from './config'

const addClass = (classString: string, classToAdd: string) => {
    const classes = classString.split(' ')
    classes.push(classToAdd)
    uniq(classes)
    return classes.join(' ')
}
const removeClass = (classString: string, classToRemove: string) => {
    const classes = classString.split(' ')
    pull(classes, classToRemove)
    return classes.join(' ')
}

const getTranslation = (o: any, lang: string, attr: string): string => {
    let translation = find(o.translations, {
        language: lang,
    })
    if (o.defaultLanguage && get(translation, attr, '').length === 0) {
        translation = find(o.translations, {
            language: o.defaultLanguage,
        })
    }
    return get(translation, attr, '')
}

const hexToRgb = (hex: string): any => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        b: parseInt(result[3], 16),
        g: parseInt(result[2], 16),
        r: parseInt(result[1], 16),
    } : null
}
const rgbToHex = (rgb: any): string => {
    return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
}

const getIcon = (o: any) => {
    return get(o, 'cache["30"]', false)
        || get(o, 'style.markerUrl', false)
        || get(o, 'placeType.style.markerUrl', false)
        || get(o, 'icon', false)
        || uiConfig.DEFAULT_PLACE_ICON
}

const getPlaceList = (placeListId: string): Promise<any> => {
    const url = Api.buildUrl(apiUrl(), '/v1/placeLists/' + placeListId)
    return Api.promiseGET(url)
}

const getPlacesInPlaceList = (placeListId: string): Promise<any> => {
    const url = Api.buildUrl(apiUrl(), '/v1/placeLists/' + placeListId + '/places')
    return Api.promiseGET(url)
}

const getDefaultFloorForPlaces = (places: any[], currentFloor: number): number => {
    if (!places.length || find(places, { floor: currentFloor })) {
        return currentFloor
    }
    return first(places).floor
}

const getPlace = (placeId: string): Promise<any> => {
    return Api.getPlace(placeId)
}

const getMainSearches = (mainSearches: string[]): Promise<any> => {
    return Promise.all(map(mainSearches, (mainSearch: any): Promise<any> => {
        if (mainSearch.objectClass === 'place') {
            return Api.getPlace(mainSearch.objectId).then((res: any) => set(res, 'objectClass', mainSearch.objectClass)).catch(() => Promise.resolve(null))
        } else {
            return getPlaceList(mainSearch.objectId).then((res: any) => set(res, 'objectClass', mainSearch.objectClass)).catch(() => Promise.resolve(null))
        }
    }))
}

const getMainFroms = (mainFroms: string[]): Promise<any> => {
    return Promise.all(map(mainFroms, (mainFrom: string): Promise<any> => {
        return Api.getPlace(mainFrom).then((res: any) => set(res, 'objectClass', 'place')).catch(() => Promise.resolve(null))
    }))
}

const latitude = (o: any): number => {
    if (isFinite(o.lat)) {
        return o.lat
    } else if (isFinite(o.latitude)) {
        return o.latitude
    }
    return 0
}

const longitude = (o: any): number => {
    if (isFinite(o.lon)) {
        return o.lon
    } else if (isFinite(o.lng)) {
        return o.lng
    } else if (isFinite(o.longitude)) {
        return o.longitude
    }
    return 0
}

const replaceColorInBase64svg = (svg: string, toColor: string) => {
    let decoded = atob(svg)
    decoded = new Buffer(replace(decoded, /#000000/g, toColor)).toString('base64')
    return 'data:image/svg+xml;base64,' + decoded
}

export { getTranslation, getIcon, getMainSearches, getMainFroms, latitude, longitude, replaceColorInBase64svg, getPlace, getPlacesInPlaceList, getDefaultFloorForPlaces }
export { addClass, removeClass }
export { hexToRgb, rgbToHex }
