import { find, get, set, debounce, map, isFinite, replace } from 'lodash'
import * as $ from 'jquery';
import { Api, apiUrl, apiKey } from 'mapwize'

import uiConfig from './config'

let lastSearchSent: string = ''

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

const searchInMapwize = (str: string, options: any): Promise<any> => {
    options.query = str

    return $.ajax({
        type: 'POST',
        url: apiUrl() + '/search?api_key=' + apiKey(),
        data: options,
        success: null,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
    }).then(mapwizeResults => mapwizeResults.hits)
}

const doSearch = debounce((str: string, options: any, callback: Function) => {
    lastSearchSent = str
    
    return Promise.all([
        Promise.resolve(str),
        searchInMapwize(str, options)
    ]).then((results: any) => {
        if (results[0] !== lastSearchSent) {
            return callback(new Error('Receive old search response'))
        }
        callback(null, results)
    })
}, 250, {'maxWait': 500})

const search = (search: string, options: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (search) {
            return doSearch(search, options, (err: any, results: any) => {
                if (err) {
                    return reject(err)
                }
                resolve(results)
            })
        }

        doSearch.cancel();
        lastSearchSent = '';
    
        return reject('Empty search string')
    })
}

const getPlaceList = (placeListId: string): Promise<any> => {
    return $.get(apiUrl() + '/placeList/' + placeListId + '?api_key=' + apiKey(), {}, null, 'json')
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

export { getTranslation, getIcon, search, getMainSearches, getMainFroms, latitude, longitude, replaceColorInBase64svg }
