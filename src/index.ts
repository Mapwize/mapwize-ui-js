import { init } from './translate'
init()

import './index.scss'

import { map } from './ui'
import config from './config'
import { Api, Cache, NavigationControl, GeolocateControl, ScaleControl, AttributionControl, PositionControl, FloorControl, Popup, Marker, Style, LngLat, LngLatBounds, Point, setRTLTextPlugin } from 'mapwize'

export { map as default }
export { map, config }
export { Api, Cache, NavigationControl, GeolocateControl, ScaleControl, AttributionControl, PositionControl, FloorControl, Popup, Marker, Style, LngLat, LngLatBounds, Point, setRTLTextPlugin }
