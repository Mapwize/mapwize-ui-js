import { map, apiKey, Api, apiUrl } from 'mapwize'
import { assign, get, set, isString, isObject } from 'lodash'
import * as $ from 'jquery';

import config from './config'

import attachMethods from './methods'
import { local } from './translate'
import { SearchBar, SearchDirections, SearchResults } from './search'
import { FooterSelection, FooterDirections, FooterVenue } from './footer'

const mapSizeChange = (mapInstance: any) => {
    const mapSize = mapInstance.getSize()
    if (mapSize.x < config.SMALL_SCREEN_BREAKPOINT) {
        $(mapInstance._container).addClass(config.SMALL_SCREEN_CLASS)
    } else {
        $(mapInstance._container).removeClass(config.SMALL_SCREEN_CLASS)
    }
}

const buildUIComponent = (mapInstance: any, options: any) => {
    mapSizeChange(mapInstance)
    mapInstance.on('resize', () => {
        mapSizeChange(mapInstance)
    })
    
    mapInstance.uiOptions = options

    mapInstance.searchResults = new SearchResults(mapInstance, options)
    mapInstance.searchBar = new SearchBar(mapInstance, options)
    mapInstance.searchDirections = new SearchDirections(mapInstance, options)
    
    mapInstance.footerVenue = new FooterVenue(mapInstance)
    mapInstance.footerSelection = new FooterSelection(mapInstance, options)
    mapInstance.footerDirections = new FooterDirections(mapInstance)
    
    mapInstance.addControl(mapInstance.footerVenue, 'bottom-left')
    mapInstance.addControl(mapInstance.footerSelection, 'bottom-left')
    mapInstance.addControl(mapInstance.footerDirections, 'bottom-left')
    
    const onMapClick = (e: any): void => {
        if (e.venue) {
            mapInstance.centerOnVenue(e.venue)
        }
    }
    mapInstance.on('mapwize:click', onMapClick)
    
    mapInstance.searchBar.show()

    if (options.centerOnPlace) {
        mapInstance.setFloorForVenue(options.centerOnPlace.floor, options.centerOnPlace.venue)
        mapInstance.footerSelection.select(options.centerOnPlace)
    }

    attachMethods(mapInstance);

    mapInstance.destroy = () => {
        mapInstance.searchResults.destroy()
        mapInstance.searchBar.destroy()
        mapInstance.searchDirections.destroy()
    
        mapInstance.footerVenue.destroy()
        mapInstance.footerSelection.destroy()
        mapInstance.footerDirections.destroy()
    
        mapInstance.off('mapwize:click', onMapClick)
        $(mapInstance.getContainer()).removeClass('mapwizeui');
        
        mapInstance.remove()
    }

    mapInstance.setLanguage = (lang:string) =>{
        local(lang);
    }
    
    return mapInstance
}

const constructor = (container: string|HTMLElement, options: any): any => {
    const mapboxOptions: any = {
        container: container
    }

    const containerSelector: any = isString(container) ? '#' + container : container
    $(containerSelector).addClass('mapwizeui');
    
    return map(assign(mapboxOptions, options.mapboxOptions), options.mapwizeOptions)
}

const createMap = (container: string|HTMLElement, options?: any) => {
    if (isString(container) && !options) {
        options = { apiKey: container }
        container = 'mapwize'
    } else if (!options && isObject(container)) {
        options = container
        container = options.container || 'mapwize'
    }
    
    if (!options.apiKey) {
        return Promise.reject(new Error('Missing "apiKey" in options'))
    }

    set(options, 'mapwizeOptions.mapwizeAttribution', get(options, 'mapwizeOptions.mapwizeAttribution', 'bottom-right'))
    
    apiKey(options.apiKey)
    
    if (options.apiUrl) {
        apiUrl(options.apiUrl)
    }

    if (options.mainColor) {
        set(options, 'mapwizeOptions.color', options.mainColor)
    }

    if (options.local) {
        local(options.local)
    }
    
    if (options.centerOnVenue && isString(options.centerOnVenue)) {
        return Api.getVenue(options.centerOnVenue).then((venue: any) => createMap(container, assign({}, options, { centerOnVenue: venue })))
    } else if (options.centerOnVenue) {
        set(options, 'mapboxOptions.center', {
            lat: get(options.centerOnVenue, 'defaultCenter.latitude', options.centerOnVenue.marker.latitude),
            lng: get(options.centerOnVenue, 'defaultCenter.longitude', options.centerOnVenue.marker.longitude)
        })
        set(options, 'mapboxOptions.zoom', get(options.centerOnVenue, 'defaultZoom', 19))
    }
    
    if (options.restrictContentToVenue) {
        set(options, 'mapwizeOptions.venueId', options.restrictContentToVenue)
    }
    if (options.restrictContentToOrganization) {
        set(options, 'mapwizeOptions.organizationId', options.restrictContentToOrganization)
    }
    
    if (options.centerOnPlace && isString(options.centerOnPlace)) {
        return Api.getPlace(options.centerOnPlace).then((place: any) => createMap(container, assign({}, options, { centerOnPlace: set(place, 'objectClass', 'place') })))
    } else if (options.centerOnPlace) {
        set(options, 'mapboxOptions.center', {
            lat: get(options.centerOnPlace, 'marker.latitude'),
            lng: get(options.centerOnPlace, 'marker.longitude')
        })
        set(options, 'mapboxOptions.zoom', 19)
    }
    
    return constructor(container, options).then((mapInstance: any) => buildUIComponent(mapInstance, options))
}

export { createMap as map }