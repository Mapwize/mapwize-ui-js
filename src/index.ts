// polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/tooltip'

import './bootstrap-custom.scss'
import './index.scss'

import { Api, apiKey, apiUrl, Cache, config } from 'mapwize'
import { AttributionControl, GeolocateControl, LngLat, LngLatBounds, Marker, NavigationControl, Point, Popup, ScaleControl, setRTLTextPlugin, Style } from 'mapwize'
import { AccessKeyError, LoadError, MWZError, NoLocationError, VenueEnterError } from 'mapwize'

import uiConfig from './config'
import { getUnits } from './measure'
import { getLocales } from './translate'
import { map } from './ui'

export { map as default }
export { map, uiConfig, config, apiKey, apiUrl }
export { getUnits, getLocales }
export { MWZError, AccessKeyError, LoadError, NoLocationError, VenueEnterError }
export { Api, Cache, NavigationControl, GeolocateControl, ScaleControl, AttributionControl, Popup, Marker, Style, LngLat, LngLatBounds, Point, setRTLTextPlugin }
