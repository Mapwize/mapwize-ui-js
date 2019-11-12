'use strict'

import { defaults } from 'lodash'

const followUserModeStates = {
  off: 'NONE',
  on: 'FOLLOW_USER',
  heading: 'FOLLOW_USER_AND_HEADING',
  noLocation: null
}
const defaultOptions = {
  class: { // Default classes added on elements
    container: 'mwz-ctrl-location'
  }
}

class LocationControl {

  private _map: any
  private _options: any
  private _container: HTMLElement
  private _locationButton: HTMLButtonElement

  constructor (options: any) {
    this._options = defaults(options, defaultOptions)
    
    this._container = document.createElement('div')
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group ' + this._options.class.container
    this._container.style.overflow = 'auto'
    this._container.addEventListener('contextmenu', e => e.preventDefault())
    
    this._locationButton = document.createElement('button')
    this._locationButton.className = 'mapboxgl-ctrl-icon'
    this._locationButton.addEventListener('click', this._onFollowUserModeClick.bind(this))
    
    this._container.appendChild(this._locationButton)
    
    this._onFollowUserModeChange({})
  }
  
  onAdd (map: any) {
    this._map = map
    
    this._onFollowUserModeChange = this._onFollowUserModeChange.bind(this)
    this._map.on('mapwize:followusermodechange', this._onFollowUserModeChange)

    return this._container
  }

  onRemove () {
    this._container.parentNode.removeChild(this._container)
    
    this._map.off('mapwize:followusermodechange', this._onFollowUserModeChange)
    
    this._map = undefined
  }
  
  getDefaultPosition () {
    return 'bottom-right'
  }
  
  _onFollowUserModeClick () {
    if (this._map.getFollowUserMode() === followUserModeStates.on) {
      if (this._map.getUserHeading()) {
        this._map.setFollowUserMode(followUserModeStates.heading)
      } else {
        this._map.setFollowUserMode(followUserModeStates.off)
      }
    } else {
      this._map.setFollowUserMode(followUserModeStates.on)
    }
  }
  
  _onFollowUserModeChange (e: any) {
    if (e.mode === followUserModeStates.off) {
      this._locationButton.className = 'mapboxgl-ctrl-icon mwz-follow-off'
    } else if (e.mode === followUserModeStates.on) {
      this._locationButton.className = 'mapboxgl-ctrl-icon mwz-follow-on'
    } else if (e.mode === followUserModeStates.heading) {
      this._locationButton.className = 'mapboxgl-ctrl-icon mwz-follow-heading'
    } else {
      this._locationButton.className = 'mapboxgl-ctrl-icon mwz-follow-null'
    }
  }
  
}

export { LocationControl as default }
