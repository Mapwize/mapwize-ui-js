'use strict'

import { debounce, isEqual, isFinite, isFunction, pick, set } from 'lodash'
import { callOptionnalFn, round } from '../utils'
import { Api } from 'mapwize'

class HashService {

  private _map: any
  private _directionsDatas: any
  private _hash: any
  private _options: any
  private _debouncedBundleHash: any

  constructor (mapInstance: any, options: any) {
    this._map = mapInstance
    this._options = options
    this._hash = {
      hash: null,
      queryParams: null,
    }

    this._debouncedBundleHash = debounce(() => {
      this._onHashChange()
    }, 200)

    if (isFunction(this._options.onHashChange)) {
      this._attachEvents()
    }

  }

  public getHash () {
    if (this._hash.hash) {
      return this._hash
    } else {
      return this._bundleHash()
    }
  }

  private _attachEvents () {
    this._map.on('moveend', this._debouncedBundleHash)
    this._map.on('mapwize:venueenter', this._debouncedBundleHash)
    this._map.on('mapwize:venueexit', this._debouncedBundleHash)
    this._map.on('mapwize:floorchange', this._debouncedBundleHash)
    this._map.on('mapwize:click', this._debouncedBundleHash)
    this._map.on('mapwize:universechange', this._debouncedBundleHash)
    this._map.on('mapwize:languagechange', this._debouncedBundleHash)
    this._map.on('mapwize:directionstart', (e: any) => {
      this._getDatasNeededForDirections(e.direction).then(() => this._debouncedBundleHash())
    })
    this._map.on('mapwize:directionstop', () => {
      this._directionsDatas = null
      this._debouncedBundleHash()
    })
  }

  private _getDatasNeededForDirections (direction: any): Promise<any> {
    this._directionsDatas = {
      from: pick(direction.from, ['lat', 'lon', 'floor', 'venueId']),
      to: pick(direction.to, ['lat', 'lon', 'floor', 'venueId'])
    }

    let fromPromise = Promise.resolve()
    if (direction.from.placeId) {
      fromPromise = Api.getPlace(direction.from.placeId).then((place: any) => {
        this._directionsDatas.from = set(place, 'objectClass', 'place')
      })
    }
    let toPromise = Promise.resolve()
    if (direction.to.placeId) {
      toPromise = Api.getPlace(direction.to.placeId).then((place: any) => {
        this._directionsDatas.to = set(place, 'objectClass', 'place')
      })
    }
    return Promise.all([fromPromise, toPromise])
  }

  private _onHashChange () {
    const hash = this._bundleHash()
    if (hash.hash !== this._hash.hash || !isEqual(hash.queryParams, this._hash.queryParams)) {
      this._hash = hash
      callOptionnalFn(this._options.onHashChange, [this._hash.hash, this._hash.queryParams])
    }
  }

  private _bundleHash () {
    let url = '/'
    let queryParams: any = {}
    const activeVenue = this._map.getVenue()
    if (activeVenue) {
      const selectedElement = this._map.getSelected()

      if (this._directionsDatas) {

        const mode = this._map.getMode()
        if (mode) {
          queryParams.modeId = mode._id
        }

        let fromPart = '/f/'
        let toPart = '/t/'

        const from = this._directionsDatas.from
        const to = this._directionsDatas.to

        if (from.objectClass === 'place') {
          fromPart += 'p/' + activeVenue.alias + '/' + from.alias
        } else {
          fromPart += 'c/' + round(from.lat, 5) + '/' + round(from.lon, 5) + '/' + from.floor
        }
        if (to.objectClass === 'place') {
          toPart += 'p/' + activeVenue.alias + '/' + to.alias
        } else {
          fromPart += 'c/' + round(to.lat, 5) + '/' + round(to.lon, 5) + '/' + to.floor
        }

        url = fromPart + toPart
      } else {
        delete queryParams.modeId

        if (selectedElement) {
          url = '/p/' + activeVenue.alias + '/' + selectedElement.alias
        } else {
          const floor = this._map.getFloor()
          if (isFinite(floor)) {
            url = '/v/' + activeVenue.alias + '/' + floor
          } else {
            url = '/v/' + activeVenue.alias
          }
        }
      }

      const currentUniverse = this._map.getUniverse()
      if (currentUniverse) {
        queryParams.u = currentUniverse.alias
      }

      const currentLanguage = this._map.getLanguage()
      if (currentLanguage) {
        queryParams.l = currentLanguage
      }

    } else {
      const center = this._map.getCenter()
      url = '/c/' + round(center.lat, 5) + '/' + round(center.lng, 5)

      delete queryParams.u
      delete queryParams.l
    }

    const zoom = this._map.getZoom()
    if (zoom) {
      queryParams.z = round(zoom, 3)
    }

    const bearing = this._map.getBearing()
    if (bearing) {
      queryParams.b = round(bearing, 3)
    } else {
      delete queryParams.b
    }

    const pitch = this._map.getPitch()
    if (pitch) {
      queryParams.p = Math.round(pitch)
    } else {
      delete queryParams.p
    }

    const hash = {
      hash: url,
      queryParams
    }

    return hash
  }
}

export { HashService as default }
