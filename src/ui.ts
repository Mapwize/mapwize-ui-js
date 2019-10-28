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

/**
 * @class Map
 * @augments external:MapwizeSDK_Map
 * @classdesc The class managing the map view and all attached UI. 
 *      It can be created using the global `map` method.
 * @hideconstructor
 */
const constructor = (container: string|HTMLElement, options: any): any => {
    const mapboxOptions: any = {
        container: container
    }

    const containerSelector: any = isString(container) ? '#' + container : container
    $(containerSelector).addClass('mapwizeui')
    
    return map(defaults(options.mapboxOptions, mapboxOptions), options.mapwizeOptions)
}

  /**
  * @static
  * @desc Create the Mapwize View with the map and all related UI. Options for configuring the UI are available. 
  *    Mapwize and Mapbox options for the display of the map can also be provided. Please note that all UI options have the priority on the map options.
  * @function map
  * @param  {string | HTMLElement} container (optional, string|HTMLElement, default: null) same as `container` param, default is: `mapwize`
  * @param {string} [options.apiKey=null] (required) key to authorize access to the Mapwize API. Find your key on [Mapwize Studio](https://studio.mapwize.io).
  * @param {string} [options.apiUrl=null] (optional, string, default: 'https://api.mapwize.io') to change the server URL, if you have a dedicated Mapwize server.
  * @param {string} [options.locale=en] (optional, string, default: en) the UI language as 2 letter ISO 639-1 code (also used as map default language)
  * @param {string} [options.unit=m] (optional, string, default: m) the ui measurement unit. 'm' and 'ft' are supported.
  * @param {string} [options.mainColor=null] (optional, string, default: null) the main color for the interface as hexadecimal string.
  * @param {boolean} [options.hideMenu=false] (optional, boolean, default: false) to hide menu bar.
  * @param {boolean} [options.floorControl=true] (optional, boolean, default: true) if the floor control should be displayed.
  * @param {object} [options.floorControlOptions=null] 
  * @param {boolean} [options.navigationControl=true]  (optional, boolean, default: true) if the navigation control should be displayed.
  * @param {object} [options.navigationControlOptions=null]
  * @param {boolean} [options.locationControl=true]  (optional, boolean, default: true) if the user location control should be displayed.
  * @param {object} [options.locationControlOptions=null]
  * @param {object} [options.direction=null] (optional, { from: string, to: string }, default: null) to display directions at start. Object with keys from and to containing place ids (string).
  * @param {object} [options.mapboxOptions=null] (optional, object, default: {}) to pass Mapbox options to the map, see [Mapbox options](https://docs.mapwize.io/developers/js/sdk/latest/#map-constructor)
  * @param {object} [options.mapwizeOptions=null] (optional, object, default: {}) to pass Mapwize options to the map, see [Mapwize options](https://docs.mapwize.io/developers/js/sdk/latest/#map-constructor)
  * @returns {Promise.<Object>}
  * @example
  *      <style> #mapwize { width: 400px; height: 400px; } </style>
  *      <div id="mapwize"></div>
  *      <script>
  *           MapwizeUI.map('YOUR_MAPWIZE_API_KEY_HERE')
  *      </script>
  */
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

        selectPlace: null,

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