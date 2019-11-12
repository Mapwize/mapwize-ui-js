// polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'bootstrap/js/dist/dropdown'
import './index.scss'

import { Api, apiKey, apiUrl, Cache, config } from 'mapwize'
import { AttributionControl, FloorControl, GeolocateControl, LngLat, LngLatBounds, Marker, NavigationControl, Point, Popup, PositionControl, ScaleControl, setRTLTextPlugin, Style } from 'mapwize'

import uiConfig from './config'
import { map } from './ui'

export { map as default }
export { map, uiConfig, config, apiKey, apiUrl }
export { Api, Cache, NavigationControl, GeolocateControl, ScaleControl, AttributionControl, PositionControl, FloorControl, Popup, Marker, Style, LngLat, LngLatBounds, Point, setRTLTextPlugin }
