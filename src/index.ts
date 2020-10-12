// polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/tooltip'

import packageJson from '../package.json'

import './bootstrap-custom.scss'
import './index.scss'

import { Api, apiKey, apiUrl, isTelemetryEnabled, Cache, config, version } from 'mapwize'
import { AttributionControl, GeolocateControl, LngLat, LngLatBounds, Marker, Point, Popup, ScaleControl, setRTLTextPlugin, Style } from 'mapwize'
import { AccessKeyError, LoadError, MWZError, NoLocationError, VenueEnterError } from 'mapwize'

import uiConfig from './config'
import { getUnits } from './measure'
import { getLocales } from './translate'
import { map } from './ui'
import { FloorControl, LocationControl, NavigationControl } from './controls'

const uiVersion = {
  mapwize: version,
  mapwizeUI: packageJson.version,
}
console.log('Mapwize UI v' + packageJson.version)

export { map as default }
export { map, uiConfig, config, apiKey, apiUrl, isTelemetryEnabled }
export { uiVersion as version }
export { getUnits, getLocales }
export { MWZError, AccessKeyError, LoadError, NoLocationError, VenueEnterError }
export { Api, Cache, GeolocateControl, ScaleControl, AttributionControl, Popup, Marker, Style, LngLat, LngLatBounds, Point, setRTLTextPlugin }
export { FloorControl, LocationControl, NavigationControl }
