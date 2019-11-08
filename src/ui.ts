import * as $ from 'jquery'
import { defaults, get, isObject, isString, noop, set } from 'lodash'
import { apiKey, apiUrl, map } from 'mapwize'

import uiConfig from './config'

import { FooterManager } from './footer'
import { HeaderManager } from './header'
import { unit } from './measure'
import attachMethods from './methods'
import { locale } from './translate'

import { FloorControl, LocationControl, NavigationControl } from './controls'

const mapSizeChange = (mapInstance: any) => {
  const mapSize = mapInstance.getSize()
  if (mapSize.x < uiConfig.SMALL_SCREEN_BREAKPOINT) {
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
  
  mapInstance.headerManager = new HeaderManager(mapInstance, options)
  mapInstance.footerManager = new FooterManager(mapInstance, options)
  
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
  
  attachMethods(mapInstance)
  
  mapInstance.headerManager.showSearch()
  
  if (options.centerOnPlaceId) {
    mapInstance.setSelected(options.centerOnPlaceId)
  } else if (options.direction) {
    mapInstance.headerManager.displayDirection(options.direction)
  }
  
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
  const defaultOptions: any = {
    container,
  }
  
  const containerSelector: any = isString(container) ? '#' + container : container
  $(containerSelector).addClass('mapwizeui')
  
  return map(defaults(options, defaultOptions))
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
* @param {function} [options.onInformationButtonClick]
* @param {function} [options.onMenuButtonClick]
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

    direction: null,

    floorControl: true,
    floorControlOptions: {},

    hideMenu: false,
    
    locale: 'en',

    locationControl: true,
    locationControlOptions: {},

    mainColor: null,

    navigationControl: true,
    navigationControlOptions: {},

    onDirectionQueryWillBeSent: (query: any) => query,
    onDirectionWillBeDisplayed: (direction: any, directionOptions: any) => ({ direction, options: directionOptions }),
    onInformationButtonClick: () => null,
    onMenuButtonClick: () => null,
    onSearchQueryWillBeSent: (searchString: string, searchOptions: any) => ({ searchString, searchOptions }),
    onSearchResultWillBeDisplayed: (results: any) => results,

    preferredLanguage: 'en',

    unit: 'm',
  })
  
  if (!apiKey(options.apiKey)) {
    return Promise.reject(new Error('Missing "apiKey" in options'))
  }
  
  set(options, 'mapwizeAttribution', get(options, 'mapwizeAttribution', 'bottom-right'))
  
  locale(options.locale)
  set(options, 'preferredLanguage', options.locale)
  
  unit(options.unit)
  
  if (options.apiUrl) {
    apiUrl(options.apiUrl)
  }
  
  return constructor(container, options).then((mapInstance: any) => buildUIComponent(mapInstance, options))
}

export { createMap as map }
