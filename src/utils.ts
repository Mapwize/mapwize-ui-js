import { find, get, set, debounce, map, isFinite, replace } from 'lodash'
import * as $ from 'jquery';
import { Api, apiUrl, apiKey } from 'mapwize'

const GOOGLE_API_KEY = ''
const DEFAULT_PLACE_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArpJREFUeNrEl89rE0EUx98uwXqpBOxBREk8RRSTCIJ6yvZiPZUVbC+CGBWPhnrwj/BQqEexWoVeWqHFk/Xi5uIPEGwUxZzcUhUPFqI9aHpZ33f3bZxs3B+NSfqFyY/N5H3mzbx58yZFCeU4TprfDG5FbhluWfnJ5rbGbZWbpWlag3ohBhrclhxFzR+/nC/Pbbfhc0Doa8TZ1SKA8Oi+eEn1xRrZTz7S1xdr1Pz5u63v0J7dtP90hrJnD1NuouA/triVeQbsxGCGmgJNv7v7il5PVztgYcIgTtwo0bGrJ/G1IfDlWDBDLwG6+blBK1cW6Pv7b10t0cjRfTQ2O0nDBxAaLnwuFCyeLm0w7PHEw8ReRnk/vniR9vIgWOdUz7XAmr5hT9OPztz5b6gKP//0GjzHtB/311xX+rhriuntFRSCLdiEbWFQCyzhbyCIul3TKMEmbIPhbzXf48oWjwwR3C/B9pY3kxW8pCQjmZ9W6pFTfPnDTdrF6xUlGL535FbolIPB+9wEEx6bbt7j5BClOGiSPgrD1P2ci9H0WwojC3Bpow8BFSZhlXRv/psDA/ssnXZIupddhgYG9FkAVyWXDkTCqupSQfB5mu07VGHYuhzYdGgsF5sc4hTXR2FYmuTqZ/wnY/7U7dDsNXww7Z+tocIZvrneCD2lLry8jiSDumw0Jc9n+IGBqkGSeafR9XCjSQTbktketKJaDmgrzz+O9CHQYDPvlUKWX4mo+3gKIxqdHnenpXfbx7Mp3k617WPxGnVxGeGOcqUX8EDpUxZGZ+aSaWjBEVDdCv8NQOeSlLdupYnt8VbK2+14iUDK/w2mDmhcQV+UGqmIAdQXam5RH1YaIYBQzOcmCz5wNTi9icAB7ytyZ3KF20R7RsqoXwGa+ZeX2wIHyl9UKwXlwkbKxa3GbTnsyhLUHwEGAHTlTmav1n2rAAAAAElFTkSuQmCC'
let lastSearchSended: string = ''

const getTranslation = (o: any, lang: string, attr: string): string => {
    const translation = find(o.translations, {
        language: lang
    })
    if (translation) {
        return get(translation, attr, '')
    }
    return ''
}

const getIcon = (o: any) => {
    return get(o, 'cache["30"]', false)
    || get(o, 'style.markerUrl', false)
    || get(o, 'placeType.style.markerUrl', false)
    || get(o, 'icon', false)
    || DEFAULT_PLACE_ICON
}

const searchInMapwize = (str: string, options: any): Promise<any> => {
    options.query = str

    return $.post(apiUrl() + '/search?api_key=' + apiKey(), options, null, 'json').then(mapwizeResults => mapwizeResults.hits)
}

const searchInGoogle = (str: string, options: any): Promise<any> => {
    if (GOOGLE_API_KEY) {
        options.address = str
        options.key = GOOGLE_API_KEY

        return $.get('https://maps.googleapis.com/maps/api/geocode/json', options, null, 'json').then(googleResults => googleResults.results)
    } else {
        return Promise.resolve([]);
    }
}

const doSearch = debounce((str: string, options: any, callback: Function) => {
    lastSearchSended = str

    const toDo = [
        Promise.resolve(str),
        searchInMapwize(str, options)
    ]

    toDo.push(options.google ? searchInGoogle(str, options) : Promise.resolve([]))

    return Promise.all(toDo).then((results: any) => {
        if (results[0] !== lastSearchSended) {
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

        this.doSearch.cancel();
        this.lastSearch = '';
    
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
    decoded = new Buffer(replace(decoded, '#000000', toColor)).toString('base64')
    return 'data:image/svg+xml;base64,' + decoded
  }

export { getTranslation, getIcon, DEFAULT_PLACE_ICON, search, getMainSearches, getMainFroms, latitude, longitude, replaceColorInBase64svg }