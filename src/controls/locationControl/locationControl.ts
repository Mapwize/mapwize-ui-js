'use strict'

import { defaults } from 'lodash'

const followUserModeStates: any = {
  heading: 'FOLLOW_USER_AND_HEADING',
  noLocation: null,
  off: 'NONE',
  on: 'FOLLOW_USER',
}
const defaultOptions = {
  class: { // Default classes added on elements
    container: 'mwz-ctrl-location',
  },
}

class LocationControl {

  private _map: any
  private _options: any
  private _defaultOptions: any
  private _container: HTMLElement
  private _locationButton: HTMLButtonElement

  constructor (options: any) {
    this._options = options
    this._defaultOptions = defaults(options.locationControlOptions, defaultOptions)

    this._container = document.createElement('div')
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group ' + this._defaultOptions.class.container
    this._container.style.overflow = 'auto'
    this._container.addEventListener('contextmenu', (e: any) => e.preventDefault())

    this._locationButton = document.createElement('button')
    this._locationButton.className = 'mapboxgl-ctrl-icon'
    this._locationButton.addEventListener('click', this._onFollowUserModeClick.bind(this))

    this._container.appendChild(this._locationButton)

    this._onFollowUserModeChange({})
  }

  public onAdd (map: any): HTMLElement {
    this._map = map

    this._onFollowUserModeChange = this._onFollowUserModeChange.bind(this)
    this._map.on('mapwize:followusermodechange', this._onFollowUserModeChange)

    return this._container
  }

  public onRemove (): void {
    this._container.parentNode.removeChild(this._container)

    this._map.off('mapwize:followusermodechange', this._onFollowUserModeChange)

    this._map = undefined
  }

  public getDefaultPosition (): string {
    return 'bottom-right'
  }

  private _onFollowUserModeClick (): void {
    if (!this._map.getUserLocation()) {
      return this._options.onFollowButtonClickWithoutLocation()
    }

    if (this._map.getFollowUserMode() === followUserModeStates.on) {
      if (this._map.getUserHeading()) {
        this._map.setFollowUserMode(followUserModeStates.heading).catch((): void => null)
      } else {
        this._map.setFollowUserMode(followUserModeStates.off).catch((): void => null)
      }
    } else {
      this._map.setFollowUserMode(followUserModeStates.on).catch((): void => null)
    }
  }

  private _onFollowUserModeChange (e: any): void {
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
