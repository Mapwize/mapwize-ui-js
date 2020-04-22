import { isFinite, set } from 'lodash'

import { search } from '../search'
import { callOptionnalFn, getPlace } from '../utils'
import { DirectionBar, SearchBar, SearchResults } from './'

export class HeaderManager {

  private _map: any
  private _options: any

  private directionBar: DirectionBar
  private searchBar: SearchBar
  private searchResults: SearchResults

  constructor (mapInstance: any, options: any) {
    this._map = mapInstance
    this._options = options

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

  public remove (): void {
    this._map.off('mapwize:venuewillenter', this._onVenueWillEnter)
    this._map.off('mapwize:venueenter', this._onVenueEnter)
    this._map.off('mapwize:venueexit', this._onVenueExit)
    this._map.off('mapwize:directionstart', this._onDirectionStart)

    this.searchResults.remove()
    this.directionBar.remove()
    this.searchBar.remove()
  }

  public closeButtonClick (to: any): void {
    this.showSearch()
    if (to && to.objectClass === 'place') {
      return this._map.footerManager.setSelected(to)
    }
    return this._map.footerManager.showVenue().catch((): void => null)
  }

  public showSearch (): Promise<void> {
    if ((!this._map.getVenue() || !this._map.getDirection()) && !this._map.hasControl(this.searchBar)) {
      this._map.removeControl(this.searchResults)
      this._map.removeControl(this.directionBar)

      this._map.addControl(this.searchBar)
      return Promise.resolve()
    }
    return Promise.reject()
  }
  public showDirection (): Promise<void> {
    if (this._map.getVenue() && !this._map.hasControl(this.directionBar)) {
      this._map.removeControl(this.searchResults)
      this._map.removeControl(this.searchBar)

      const selected = this._map.getSelected()
      if (selected) {
        this.directionBar.setTo(selected, false)
        this._map.footerManager.setSelected(null)
      }

      const userLocation = this._map.getUserLocation()
      if (userLocation && isFinite(userLocation.floor)) {
        this.directionBar.setFrom({ objectClass: 'userLocation' }, false)
      }

      this._map.addControl(this.directionBar)
      this._map.footerManager.showDirectionMode()
      return Promise.resolve()
    }
    return Promise.reject()
  }

  public isInDirectionMode (): boolean {
    return this._map.hasControl(this.directionBar)
  }
  public isSearchResultDisplayed (): boolean {
    return this._map.hasControl(this.searchResults)
  }

  public search (searchString: string, searchOptions: any, clickOnResultCallback: (searchResult: any, universe?: any) => void, focusedField: string): void {
    this.searchResults.showLoading()
    const transformedSearchOptions = callOptionnalFn(this._options.onSearchQueryWillBeSent, [searchOptions, searchString, focusedField])
    search(searchString, transformedSearchOptions).then((searchResults: any) => {
      this.searchResults.hideLoading()
      this.showSearchResults(callOptionnalFn(this._options.onSearchResultsWillBeDisplayed, [searchResults]), clickOnResultCallback, focusedField)
    })
  }

  public showSearchResults (results: string | any[], clickOnResultCallback: (searchResult: any, universe?: any) => void, focusedField: string): void {
    if (!this.isInDirectionMode()) {
      this.searchBar.showBackButton()
    }
    this.searchResults.setResults(results, clickOnResultCallback, focusedField)
    if (!this._map.hasControl(this.searchResults)) {
      this._map.addControl(this.searchResults)
    }
  }
  public hideSearchResults (): void {
    this.searchBar.hideBackButton()
    this._map.removeControl(this.searchResults)
  }

  public setFrom (from: any): void {
    return this.directionBar.setFrom(from)
  }
  public setTo (to: any): void {
    return this.directionBar.setTo(to)
  }
  public getMode (): any {
    return this.directionBar.getMode()
  }
  public setMode (modeId: string): void {
    this.directionBar.setMode(modeId)
  }
  public refreshLocale (): any {
    this.directionBar.refreshLocale()
    this.searchBar.refreshLocale()
    this.searchResults.refreshLocale()
  }

  public displayDirection (direction: any): void {
    const venueId = direction.from.venueId || direction.to.venueId

    this._map.centerOnVenue(venueId).then(() => {
      this.showDirection()

      const from = direction.from
      const to = direction.to

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

  public upArrow (): any {
    this.searchResults.upArrow()
  }

  public downArrow (): any {
    this.searchResults.downArrow()
  }

  public enterKeyup (): any {
    this.searchResults.enterKeyup()
  }

  // ---------------------------------------
  // Privates methods
  // ---------------------------------------

  private _onVenueWillEnter (e: any): void {
    this.searchBar.enteringIn(e.venue)
  }
  private _onVenueEnter (e: any): void {
    this.searchBar.enteredIn(e.venue)

    const currentDirection = this._map.getDirection()
    if (currentDirection) {
      const venueId = currentDirection.from.venueId || currentDirection.to.venueId
      if (venueId === e.venue._id) {
        this.showDirection()
      } else {
        this._map.removeDirection()
        this.directionBar.setFrom(null, false)
        this.directionBar.setTo(null, false)

      }
    }
  }
  private _onVenueExit (e: any): void {
    this.searchBar.leaveVenue()
    this.showSearch().catch((): void => null)
  }
  private _onDirectionStart (e: any): void {
    // If direction is not started by ui, show direction header and fill from and to fields
    // this.showDirection()
  }
}
