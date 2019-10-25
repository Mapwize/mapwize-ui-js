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
    this._onVenueEnter = this._onVenueEnter.bind(this)
    this._onVenueExit = this._onVenueExit.bind(this)
    this._onDirectionStart = this._onDirectionStart.bind(this)
    this._onDirectionStop = this._onDirectionStop.bind(this)

    this._map.on('mapwize:venueenter', this._onVenueEnter)
    this._map.on('mapwize:venueexit', this._onVenueExit)
    this._map.on('mapwize:directionstart', this._onDirectionStart)
    this._map.on('mapwize:directionstop', this._onDirectionStop)
  }

  public remove(): void {
    this._map.off('mapwize:venueenter', this._onVenueEnter)
    this._map.off('mapwize:venueexit', this._onVenueExit)
    this._map.off('mapwize:directionstart', this._onDirectionStart)
    this._map.off('mapwize:directionstop', this._onDirectionStop)

    this.venueFooter.destroy()
    this.selectionFooter.destroy()
    this.directionFooter.destroy()
  }

  public getSelected(): any {
    return this._selected
  }
  public setSelected(elem: any) {
    this._selected = elem

    return this.showSelection()
  }

  public showDirection(): Promise<void> {
    if (this._map.getDirection()) {
      this._map.removeControl(this.venueFooter)
      this._map.removeControl(this.selectionFooter)

      this._map.addControl(this.directionFooter)
      return Promise.resolve()
    }
    return Promise.reject()
  }
  public showVenue(): Promise<void> {
    if (this._map.getVenue() && !this._map.getDirection()) {
      this._map.removeControl(this.directionFooter)
      this._map.removeControl(this.selectionFooter)

      this._map.addControl(this.venueFooter)
      return Promise.resolve()
    }
    return Promise.reject()
  }
  public showSelection(): Promise<void> {
    if (this._map.getVenue() && this._selected && !this._map.getDirection()) {
      this._map.removeControl(this.venueFooter)
      this._map.removeControl(this.directionFooter)

      this._map.addControl(this.selectionFooter)
      return Promise.resolve()
    }
    return Promise.reject()
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