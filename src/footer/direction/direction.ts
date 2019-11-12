import * as $ from 'jquery'

const directionsHtml = require('./direction.html')

import { DefaultControl } from '../../control'
import { unit } from '../../measure'

export class FooterDirections extends DefaultControl {
  
  constructor (mapInstance: any) {
    super(mapInstance)

    this._container = $(directionsHtml)
  }
  public remove (): void {
    return null
  }

  public getDefaultPosition (): string {
    return 'bottom-left'
  }
  
  public onAdd (map: any) {
    this._map = map
    this.isOnMap = true
    
    this.displayStats()
    
    return this._container.get(0)
  }
  
  public displayStats () {
    const direction = this._map.getDirection()
    
    this._container.find('#mwz-direction-time').text(this._timeParser(direction.traveltime))
    this._container.find('#mwz-direction-distance').text(this._distanceParser(direction.distance, unit()))
  }
  
  public refreshUnit (): void {
    if (this._map && this._map.getDirection()) {
      this.displayStats()
    }
  }

  public setFloorSelector () {
    if ($(this.map._container).hasClass('mwz-small')) {
      $(this.map._container).find('.mapboxgl-ctrl-bottom-right').css('bottom', 50)
    }
  }
  
  // ---------------------------------------
  // Privates methods
  // ---------------------------------------
  
  private _timeParser (value: number): string {
    value = Math.round(value)
    if (value > 59) {
      return Math.round(value / 60) + ' min'
    } else {
      return '1 min'
    }
  }
  private _distanceParser (value: number, unitOfMeasure?: string): string {
    if (unitOfMeasure === 'ft') {
      value *= 3.28084
      value = Math.round(value)
      return value + ' ft'
    } else {
      value = Math.round(value)
      if (value > 999) {
        return Math.floor(value / 1000) + ((value % 1000) ? (',' + (value % 1000) + ' km') : (' km'))
      } else {
        return value + ' m'
      }
    }
  }
}
