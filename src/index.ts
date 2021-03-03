import './style.scss'

import { Api, apiKey, apiUrl, isTelemetryEnabled, Cache, config, version } from 'mapwize'
import { AttributionControl, GeolocateControl, LngLat, LngLatBounds, Marker, Point, Popup, ScaleControl, setRTLTextPlugin, Style } from 'mapwize'
import { AccessKeyError, LoadError, MWZError, NoLocationError, VenueEnterError } from 'mapwize'

import UIController from './controller/uiController'

const uiVersion = {
  mapwize: version,
  mapwizeUI: VERSION,
}

/**
 * @static
 * @desc Create the Mapwize View with the map and all related UI. Options for configuring the UI are available.
 *    Mapwize and Mapbox options for the display of the map can also be provided. Please note that all UI options have the priority on the map options.
 * @function map
 * @param {string | HTMLElement} container (optional, string|HTMLElement, default: null) same as `container` param, default is: `mapwize`
 * @param {object} [options]
 * @param {string} [options.apiKey=null] (required) key to authorize access to the Mapwize API. Find your key on [Mapwize Studio](https://studio.mapwize.io).
 * @param {string} [options.apiUrl=null] (optional, string, default: 'https://api.mapwize.io') to change the server URL, if you have a dedicated Mapwize server.
 * @param {string} [options.locale=en] (optional, string, default: en) the UI language as 2 letter ISO 639-1 code (also used as map default language)
 * @param {string} [options.unit=m] (optional, string, default: m) the ui measurement unit. 'm' and 'ft' are supported.
 * @param {string} [options.mainColor=null] (optional, string, default: null) the main color for the interface as hexadecimal string.
 * @param {boolean} [options.floorControl=true] (optional, boolean, default: true) if the floor control should be displayed.
 * @param {boolean} [options.navigationControl=true]  (optional, boolean, default: true) if the navigation control should be displayed.
 * @param {object} [options.navigationControlOptions=null]
 * @param {boolean} [options.locationControl=false]  (optional, boolean, default: false) if the user location control should be displayed.
 * @param {object} [options.direction=null] (optional, { from: string, to: string }, default: null) to display directions at start. Object with keys from and to containing place ids (string).
 * @param {function} [options.shouldShowInformationButtonFor] (optional, function, default: function (selected) { return false; }) Callback defining if the information button should be displayed in the card when a place or placelist is selected. The selected place or placelist is provided as parameter. The function must return a boolean or a html string to change button content. If this is not defined, the information button is never shown by default.
 * @param {function} [options.onInformationButtonClick]  (optional, function) Callback called when the user clicks on the information button in the card when a place or placelist is selected. Use `shouldShowInformationButtonFor` to define if the information button should be displayed or not.
 * @param {function} [options.onSelectedChange]  (optional, function) Callback called when a place or placeList is selected or unselected. The selected place or placeList is provided as parameter
 * @param {function} [options.onMenuButtonClick]  (optional, function) callback called when the user clicked on the menu button (left button on the search bar)
 * @param {function} [options.onFollowButtonClickWithoutLocation]  (optional, function) callback called when the user clicked on the follow button while no location has been set
 * @returns {Promise.<Object>}
 * @example
 *      <style> #mapwize { width: 400px; height: 400px; } </style>
 *      <div id="mapwize"></div>
 *      <script>
 *           MapwizeUI.map('YOUR_MAPWIZE_API_KEY_HERE', {})
 *      </script>
 */
function map(container: string | HTMLElement, options?: any) {
  if (typeof container === 'string' && !options) {
    options = { apiKey: container }
    container = 'mapwize'
  } else if (!options && typeof container === 'object') {
    options = container
    container = options.container || 'mapwize'
  }

  if (typeof container === 'string') {
    container = document.getElementById(container)
  }

  const uiController = new UIController()

  return uiController.init(container, options)
}

export { map as default }
export { map, config, apiKey, apiUrl, isTelemetryEnabled }
export { uiVersion as version }
// export { getUnits, getLocales }
export { MWZError, AccessKeyError, LoadError, NoLocationError, VenueEnterError }
export { Api, Cache, GeolocateControl, ScaleControl, AttributionControl, Popup, Marker, Style, LngLat, LngLatBounds, Point, setRTLTextPlugin }
// export { FloorControl, LocationControl, NavigationControl }
