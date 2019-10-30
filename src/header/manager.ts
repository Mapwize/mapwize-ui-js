import { set } from 'lodash'

import { DirectionBar, SearchBar, SearchResults } from './'
import { getPlace } from '../utils'
import { search } from '../search'

export class HeaderManager {

  private _map: any;

  private directionBar: DirectionBar;
  private searchBar: SearchBar;
  private searchResults: SearchResults;

  constructor (mapInstance: any, options: any) {
    this._map = mapInstance

    this.directionBar = new DirectionBar(mapInstance, options)
    this.searchBar = new SearchBar(mapInstance, options)
    this.searchResults = new SearchResults(mapInstance, options)

    // events
    this._onVenueWillEnter = this._onVenueWillEnter.bind(this)
    this._onVenueEnter = this._onVenueEnter.bind(this)
    this._onVenueExit = this._onVenueExit.bind(this)
    this._onDirectionStart = this._onDirectionStart.bind(this)

    this._map.on('mapwize:venuewillenter', this._onVenueWillEnter)
    this._map.on('mapwize:venueenter', this._onVenueEnter)
    this._map.on('mapwize:venueexit', this._onVenueExit)
    this._map.on('mapwize:directionstart', this._onDirectionStart)
  }

  public remove(): void {
    this._map.off('mapwize:venuewillenter', this._onVenueWillEnter)
    this._map.off('mapwize:venueenter', this._onVenueEnter)
    this._map.off('mapwize:venueexit', this._onVenueExit)
    this._map.off('mapwize:directionstart', this._onDirectionStart)

    this.searchResults.remove()
    this.directionBar.remove()
    this.searchBar.remove()
  }

  public showSearch(): Promise<void> {
    if (!this._map.getDirection() && !this._map.hasControl(this.searchBar)) {
      this._map.removeControl(this.searchResults)
      this._map.removeControl(this.directionBar)

      this._map.addControl(this.searchBar)
      return Promise.resolve()
    }
    return Promise.reject()
  }
  public showDirection(): Promise<void> {
    if (this._map.getVenue() && !this._map.hasControl(this.directionBar)) {
      this._map.removeControl(this.searchResults)
      this._map.removeControl(this.searchBar)

      const selected = this._map.getSelected()
      if (selected) {
        this.directionBar.setTo(selected)
      }

      this._map.addControl(this.directionBar)
      return Promise.resolve()
    }
    return Promise.reject()
  }

  public isInDirectionMode(): boolean {
    return this._map.hasControl(this.directionBar)
  }

  public search(searchString: string, searchOptions: any, clickOnResultCallback: Function): void {
    this.searchResults.showLoading()
    search(searchString, searchOptions).then((searchResults: any) => {
      this.searchResults.hideLoading()
      this.showSearchResults(searchResults, clickOnResultCallback)
    })
  }

  public showSearchResults(results: string|Array<any>, clickOnResultCallback: Function): void {
    this.searchResults.setResults(results, clickOnResultCallback)
    if (!this._map.hasControl(this.searchResults)) {
      this._map.addControl(this.searchResults)
    }
  }
  public hideSearchResults(): void {
    this._map.removeControl(this.searchResults)
  }

  public setFrom(from: any): void {
    return this.directionBar.setFrom(from)
  }
  public setTo(to: any): void {
    return this.directionBar.setTo(to)
  }
  public getMode(): any {
    return this.directionBar.getMode()
  }
  public setMode(modeId: string): void {
    this.directionBar.setMode(modeId)
  }
  public refreshLocale(): any {
    this.directionBar.refreshLocale()
  }

  public displayDirection(direction: any): void {
    const venueId = direction.from.venueId || direction.to.venueId

    this._map.centerOnVenue(venueId).then(() => {
      this.showDirection()

      var from = direction.from
      var to = direction.to
      
      if (from.placeId) {
        getPlace(from.placeId).then((place: any) => {
          this.directionBar.setFrom(set(place, 'objectClass', 'place'))
        })
      } else {
        this.directionBar.setFrom(from)
      }
      
      if (to.placeId) {
        getPlace(to.placeId).then((place: any) => {
          this.directionBar.setTo(set(place, 'objectClass', 'place'))
        })
      } else {
        this.directionBar.setTo(to)
      }
    })
  }

  // ---------------------------------------
  // Privates methods
  // ---------------------------------------

  private _onVenueWillEnter(e: any): void {
    this.searchBar.enteringIn(e.venue)
  }
  private _onVenueEnter(e: any): void {
    this.searchBar.enteredIn(e.venue)
  }
  private _onVenueExit(e: any): void {
    this.searchBar.leaveVenue()
    this.showSearch()
  }
  private _onDirectionStart(e: any): void {
    // If direction is not started by ui, show direction header and fill from and to fields
    // this.showDirection()
  }
}
