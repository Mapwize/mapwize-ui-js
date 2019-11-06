import { set } from 'lodash'

import { FooterSelection, FooterDirections, FooterVenue } from './'

export class FooterManager {

  private _map: any;

  private _selected: any;

  private directionFooter: FooterDirections;
  private selectionFooter: FooterSelection;
  private venueFooter: FooterVenue;

  constructor (mapInstance: any, options: any) {
    this._map = mapInstance

    this.venueFooter = new FooterVenue(mapInstance)
    this.selectionFooter = new FooterSelection(mapInstance, options)
    this.directionFooter = new FooterDirections(mapInstance)

    // events
    this._onClick = this._onClick.bind(this)
    this._onVenueEnter = this._onVenueEnter.bind(this)
    this._onVenueExit = this._onVenueExit.bind(this)
    this._onDirectionStart = this._onDirectionStart.bind(this)
    this._onDirectionStop = this._onDirectionStop.bind(this)

    this._map.on('mapwize:click', this._onClick)
    this._map.on('mapwize:venueenter', this._onVenueEnter)
    this._map.on('mapwize:venueexit', this._onVenueExit)
    this._map.on('mapwize:directionstart', this._onDirectionStart)
    this._map.on('mapwize:directionstop', this._onDirectionStop)
  }

  public remove(): void {
    this._map.off('mapwize:click', this._onClick)
    this._map.off('mapwize:venueenter', this._onVenueEnter)
    this._map.off('mapwize:venueexit', this._onVenueExit)
    this._map.off('mapwize:directionstart', this._onDirectionStart)
    this._map.off('mapwize:directionstop', this._onDirectionStop)

    this.venueFooter.remove()
    this.selectionFooter.remove()
    this.directionFooter.remove()
  }

  public refreshUnit(): any {
    return this.directionFooter.refreshUnit()
  }
  public getSelected(): any {
    return this._selected
  }
  public setSelected(elem: any): Promise<void> {
    this._selected = elem
    if (this._selected && this._map.getVenue() && !this._map.headerManager.isInDirectionMode()) {
      return this.showSelection().catch(() => { }).then(() => {
        return this.selectionFooter.setSelected(this._selected)
      })
    }
    return this.selectionFooter.setSelected(null)
  }

  public showDirectionMode(): Promise<void> {
    if (this._map.headerManager.isInDirectionMode()) {
      this._map.removeControl(this.venueFooter)
      this._map.removeControl(this.selectionFooter)
      this._map.removeControl(this.directionFooter)
      return Promise.resolve()
    }
    return Promise.reject()
  }

  public showDirection(): Promise<void> {
    if (this._map.getDirection() && !this._map.hasControl(this.directionFooter)) {
      this._map.removeControl(this.venueFooter)
      this._map.removeControl(this.selectionFooter)

      this._map.addControl(this.directionFooter)
      return Promise.resolve()
    }
    return Promise.reject()
  }
  public showVenue(): Promise<void> {
    if (this._map.getVenue() && !this._map.getDirection() && !this._map.hasControl(this.venueFooter)) {
      this._map.removeControl(this.directionFooter)
      this._map.removeControl(this.selectionFooter)

      this._map.addControl(this.venueFooter)
      return Promise.resolve()
    }
    return Promise.reject()
  }
  public showSelection(): Promise<void> {
    if (this._map.getVenue() && this._selected && !this._map.getDirection() && !this._map.hasControl(this.selectionFooter)) {
      this._map.removeControl(this.venueFooter)
      this._map.removeControl(this.directionFooter)

      this._map.addControl(this.selectionFooter)
      return Promise.resolve()
    }
    return Promise.reject()
  }

  private _onClick(e: any): void {
    if (this._map.getVenue() && !this._map.headerManager.isInDirectionMode()) {
      if (e.place) {
        this.setSelected(set(e.place, 'objectClass', 'place'))
      } else {
        this.showVenue()
        this.setSelected(null)
      }
    }
  }
  private _onVenueEnter(e: any): void {
    if (this._map.getDirection()) {
      this.showDirection()
    } else if (this.getSelected()) {
      this.showSelection()
    } else {
      this.showVenue()
    }
  }
  private _onVenueExit(): void {
    this._map.removeControl(this.venueFooter)
    this._map.removeControl(this.selectionFooter)
    this._map.removeControl(this.directionFooter)
  }
  private _onDirectionStart(): void {
    this.showDirection()
  }
  private _onDirectionStop(): void {
    if (this._map.getVenue()) {
      if (this.getSelected()) {
        this.showSelection()
      } else {
        this.showVenue()
      }
    }
  }
}
