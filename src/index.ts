// polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import 'bootstrap/js/dist/dropdown';
import './index.scss'

import { apiKey, Api, Cache, apiUrl, config, NavigationControl, GeolocateControl, ScaleControl, AttributionControl, PositionControl, FloorControl, Popup, Marker, Style, LngLat, LngLatBounds, Point, setRTLTextPlugin } from 'mapwize'

import { map } from './ui'
import uiConfig from './config'

export { map as default }
export { map, uiConfig, config, apiKey, apiUrl }
export { Api, Cache, NavigationControl, GeolocateControl, ScaleControl, AttributionControl, PositionControl, FloorControl, Popup, Marker, Style, LngLat, LngLatBounds, Point, setRTLTextPlugin }
