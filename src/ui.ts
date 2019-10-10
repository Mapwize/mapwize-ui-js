import { map, apiKey, apiUrl } from 'mapwize'
import { get, set, isString, isObject, defaults, noop } from 'lodash'
import * as $ from 'jquery'

import uiConfig from './config'

import attachMethods from './methods'
import { unit } from './measure'
import { locale } from './translate'
import { SearchBar, SearchDirections, SearchResults } from './search'
import { FooterSelection, FooterDirections, FooterVenue } from './footer'

import { FloorControl, NavigationControl, LocationControl } from './controls'

const mapSizeChange = (mapInstance: any) => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const mapSize = mapInstance.getSize()
    if (mapSize.x < (uiConfig.SMALL_SCREEN_BREAKPOINT * devicePixelRatio)) {
        $(mapInstance._container).addClass(uiConfig.SMALL_SCREEN_CLASS)
    } else {
        $(mapInstance._container).removeClass(uiConfig.SMALL_SCREEN_CLASS)
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

    if (options.locationControl) {
        mapInstance.locationControl = new LocationControl(mapInstance.locationControlOptions)
        mapInstance.addControl(mapInstance.locationControl, isString(options.locationControl) ? options.locationControl : undefined)
    }

    if (options.floorControl) {
        mapInstance.floorControl = new FloorControl(mapInstance.floorControlOptions)
        mapInstance.addControl(mapInstance.floorControl, isString(options.floorControl) ? options.floorControl : undefined)
    }

    if (options.navigationControl) {
        mapInstance.navigationControl = new NavigationControl(mapInstance.navigationControlOptions)
        mapInstance.addControl(mapInstance.navigationControl, isString(options.navigationControl) ? options.navigationControl : undefined)
    }
    
    mapInstance.searchBar.show()

    attachMethods(mapInstance)
    
    return mapInstance
}

const constructor = (container: string|HTMLElement, options: any): any => {
    const mapboxOptions: any = {
        container: container
    }

    const containerSelector: any = isString(container) ? '#' + container : container
    $(containerSelector).addClass('mapwizeui')
    
    return map(defaults(options.mapboxOptions, mapboxOptions), options.mapwizeOptions)
}

const createMap = (container: string|HTMLElement, options?: any) => {
    if (isString(container) && !options) {
        options = { apiKey: container }
        container = 'mapwize'
    } else if (!options && isObject(container)) {
        options = container
        container = options.container || 'mapwize'
    }

    options = defaults(options, {
        apiKey: null,
        apiUrl: null,

        locale: 'en',
        unit: 'm',
        mainColor: null,

        hideMenu: false,
        onMenuButtonClick: noop,
        onInformationButtonClick: noop,

        floorControl: true,
        floorControlOptions: {},

        navigationControl: true,
        navigationControlOptions: {},

        locationControl: true,
        locationControlOptions: {},

        direction: null,

        mapboxOptions: {},
        mapwizeOptions: {
            preferredLanguage: 'en'
        }
    })
    
    if (!apiKey(options.apiKey)) {
        return Promise.reject(new Error('Missing "apiKey" in options'))
    }

    set(options, 'mapwizeOptions.mapwizeAttribution', get(options, 'mapwizeOptions.mapwizeAttribution', 'bottom-right'))

    locale(options.locale)
    set(options, 'mapwizeOptions.preferredLanguage', options.locale)

    unit(options.unit)
    
    if (options.apiUrl) {
        apiUrl(options.apiUrl)
    }

    if (options.mainColor) {
        set(options, 'mapwizeOptions.color', options.mainColor)
    }
    
    return constructor(container, options).then((mapInstance: any) => buildUIComponent(mapInstance, options))
}

export { createMap as map }