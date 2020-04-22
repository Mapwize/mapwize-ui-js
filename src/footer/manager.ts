import { set } from 'lodash'
import { FooterDirections, FooterSelection, FooterVenue } from './'
import { callOptionnalFn } from '../utils'

export class FooterManager {

  private _map: any
  private _options: any

  private _selected: any

  private directionFooter: FooterDirections
  private selectionFooter: FooterSelection
  private venueFooter: FooterVenue

  constructor (mapInstance: any, options: any) {
    this._map = mapInstance
    this._options = options

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

  public remove (): void {
    this._map.off('mapwize:click', this._onClick)
    this._map.off('mapwize:venueenter', this._onVenueEnter)
    this._map.off('mapwize:venueexit', this._onVenueExit)
    this._map.off('mapwize:directionstart', this._onDirectionStart)
    this._map.off('mapwize:directionstop', this._onDirectionStop)

    this.venueFooter.remove()
    this.selectionFooter.remove()
    this.directionFooter.remove()
  }

  public refreshUnit (): any {
    return this.directionFooter.refreshUnit()
  }
  public getSelected (): any {
    return this._selected
  }
  public setSelected (element: any, centerOnElement: boolean = true, analytics: any = null): Promise<void> {
    this._selected = element
    if (this._selected && !this._map.headerManager.isInDirectionMode()) {
      const currentZoom = this._map.getZoom()
      const options = callOptionnalFn(this._options.onObjectWillBeSelected, [{
        centerOnElement,
        template: this.selectionFooter.getTemplate(),
        zoom: currentZoom > 19 ? currentZoom : 19,
      }, this._selected])

      let centerPromise = Promise.resolve(null)
      if (options.centerOnElement) {
        if (element.objectClass === 'placeList') {
          centerPromise = this._map.centerOnVenue(element.venue, options)
        } else {
          centerPromise = this._map.centerOnPlace(element._id, options)
        }
      }

      return centerPromise.then(() => {
        return this.showSelection().catch(() => null).then(() => {
          return this.selectionFooter.setSelected(this._selected, options, analytics)
        })
      })
    }
    return this.selectionFooter.setSelected(null)
  }

  public showDirectionMode (): Promise<void> {
    if (this._map.headerManager.isInDirectionMode()) {
      this._map.removeControl(this.venueFooter)
      this._map.removeControl(this.selectionFooter)
      this._map.removeControl(this.directionFooter)
      return Promise.resolve()
    }
    return Promise.reject()
  }

  public showDirection (): Promise<void> {
    if (this._map.getDirection()) {
      if (!this._map.hasControl(this.directionFooter)) {
        this._map.removeControl(this.venueFooter)
        this._map.removeControl(this.selectionFooter)

        this.directionFooter.setFloorSelector()
        this._map.addControl(this.directionFooter)
      } else {
        this.directionFooter.displayStats()
      }
      return Promise.resolve()
    }
    return Promise.reject()
  }
  public showVenue (): Promise<void> {
    if (this._map.getVenue() && !this._map.getDirection() && !this._map.hasControl(this.venueFooter)) {
      this._map.removeControl(this.directionFooter)
      this._map.removeControl(this.selectionFooter)

      if (this.venueFooter.needToBeDisplayed(this._map.getVenue())) {
        this._map.addControl(this.venueFooter)
      }
      return Promise.resolve()
    }
    return Promise.reject()
  }
  public showSelection (): Promise<void> {
    if (this._map.getVenue() && this._selected && !this._map.getDirection() && !this._map.hasControl(this.selectionFooter)) {
      this._map.removeControl(this.venueFooter)
      this._map.removeControl(this.directionFooter)

      this._map.addControl(this.selectionFooter)
      return Promise.resolve()
    }
    return Promise.reject()
  }

  public refreshLocale (): any {
    this.venueFooter.refreshLocale()
  }

  private _onClick (e: any): void {
    if (this._map.getVenue() && !this._map.headerManager.isInDirectionMode()) {
      if (e.place) {
        this.setSelected(set(e.place, 'objectClass', 'place'), true, { channel: 'click' })
      } else {
        this.showVenue().catch(() => null)
        this.setSelected(null)
      }
    }
  }
  private _onVenueEnter (e: any): void {
    const currentSelected = this.getSelected()
    if (currentSelected && currentSelected.venueId !== e.venue._id) {
      this.setSelected(null)
    }

    if (this._map.getDirection()) {
      this.showDirection().catch(() => null)
    } else if (this.getSelected()) {
      this.showSelection().catch(() => null).then(() => {
        return this.selectionFooter.setSelected(this.getSelected())
      })
    } else {
      this.showVenue().catch(() => null)
    }
  }
  private _onVenueExit (): void {
    this._map.removeControl(this.venueFooter)
    this._map.removeControl(this.selectionFooter)
    this._map.removeControl(this.directionFooter)
  }
  private _onDirectionStart (): void {
    if (this._map.floorControl) {
      this._map.floorControl.resize()
    }
    this.showDirection().catch(() => null)
  }
  private _onDirectionStop (): void {
    if (this._map.getVenue()) {
      if (this.getSelected()) {
        this.showSelection().catch(() => null).then(() => {
          return this.selectionFooter.setSelected(this.getSelected())
        })
      } else {
        this.showVenue().catch(() => null)
      }
    }
  }
}
