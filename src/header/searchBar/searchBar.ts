import * as $ from 'jquery'
import { isFunction, template } from 'lodash'

const outOfVenueHtml = require('./templates/outOfVenue.html')
const enteringInVenueHtml = require('./templates/enteringInVenue.html')
const inVenueHtml = require('./templates/inVenue.html')

import { uiConfig } from '../../config'
import { DOWNARROW, ENTER, UPARROW } from '../../constants'
import { DefaultControl } from '../../control'
import { searchOptions } from '../../search'
import { translate } from '../../translate'
import { callOptionnalFn, getTranslation } from '../../utils'

const OUT_OF_VENUE = 0
const ENTERING_IN_VENUE = 1
const IN_VENUE = 2

export class SearchBar extends DefaultControl {

  private _options: any

  private _hideSearchResultsTimeout: any
  private _currentVenueState: number
  private _hideMenu: boolean

  constructor (mapInstance: any, options: any) {
    super(mapInstance)

    this._options = options
    this._container = $('<div />')

    if (!isFunction(this._options.onMenuButtonClick)) {
      this._hideMenu = true
    } else {
      this._hideMenu = false
    }

    this.listen('click', '#mwz-menu-button', this._menuButtonClick.bind(this))
    this.listen('click', '#mwz-header-directions-button', this._directionButtonClick.bind(this))

    this.listen('focus', '#mwz-mapwize-search', this._searchFocus.bind(this))
    this.listen('keyup', '#mwz-mapwize-search', this._searchKeyup.bind(this))
    this.listen('blur', '#mwz-mapwize-search', this._searchBlur.bind(this))

    this.leaveVenue()
  }

  public onAdd (mapInstance: any) {
    this._map = mapInstance
    this.isOnMap = true
    this.refreshTooltips()
    return this._container.get(0)
  }

  public getDefaultPosition (): string {
    return 'top-left'
  }

  public remove (): void {
    return null
  }

  public enteringIn (venue: any): void {
    this._currentVenueState = ENTERING_IN_VENUE
    this._container.html(template(enteringInVenueHtml)({ hide_menu: this._hideMenu, entering_in: translate('entering_in_venue', { venue: getTranslation(venue, this.map.getLanguageForVenue(venue._id), 'title') }) }))
  }
  public enteredIn (venue: any): void {
    this._currentVenueState = IN_VENUE
    this._container.html(template(inVenueHtml)({ hide_menu: this._hideMenu, search_in: translate('search_placeholder_venue', { venue: getTranslation(venue, this.map.getLanguageForVenue(venue._id), 'title') }) }))
    this.refreshTooltips()
  }
  public leaveVenue (): void {
    this.refreshTooltips()
    this._currentVenueState = OUT_OF_VENUE
    this._container.html(template(outOfVenueHtml)({ hide_menu: this._hideMenu, search_in: translate('search_placeholder_global') }))
  }

  public refreshLocale () {
    if (this._map) {
      if (this._currentVenueState === ENTERING_IN_VENUE) {
        this.enteringIn(this._map.getVenue())
      } else if (this._currentVenueState === IN_VENUE) {
        this.enteredIn(this._map.getVenue())
        this.refreshTooltips()
      } else {
        this.leaveVenue()
      }
    }
  }

  public showBackButton () {
    if ($(this.map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS)) {
      this._container.find('#mwz-menu-button-container').hide()
      this._container.find('#mwz-back-button-container').show()
    }
  }

  public hideBackButton () {
    if ($(this.map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS)) {
      this._container.find('#mwz-menu-button-container').show()
      this._container.find('#mwz-back-button-container').hide()
    }
  }

  public refreshTooltips () {
    if (!$(this.map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS)) {
      setTimeout(() => {
        this._container.find('#mwz-menu-button').attr('data-original-title', translate('menu'))
        this._container.find('#mwz-header-directions-button').attr('data-original-title', translate('directions'))
        this._container.find('[data-toggle="mwz-tooltip"]').tooltip({ trigger: 'hover', container: this.map._container })
      }, 1000)
    }
  }

  // ---------------------------------------
  // Privates methods
  // ---------------------------------------

  private _menuButtonClick (e: JQueryEventObject): void {
    callOptionnalFn(this._options.onMenuButtonClick, [e])
  }
  private _directionButtonClick (e: JQueryEventObject): void {
    this._container.find('#mwz-header-directions-button').tooltip('hide')
    this.hideBackButton()
    $(this.map._container).find('.mapboxgl-ctrl-bottom-right').css('bottom', 0)
    this._map.headerManager.showDirection()
  }

  private _searchFocus (e: JQueryEventObject): void {
    this._searchKeyup(e)
    clearTimeout(this._hideSearchResultsTimeout)
  }
  private _searchKeyup (e: JQueryEventObject): void {
    if (e.keyCode === UPARROW) {
      this._map.headerManager.upArrow()
    } else if (e.keyCode === DOWNARROW) {
      this._map.headerManager.downArrow()
    } else if (e.keyCode === ENTER) {
      this._map.headerManager.enterKeyup()
    } else {
      const target = $(e.target)
      const searchString: string = target.val().toString()

      if (searchString) {
        this._map.headerManager.search(searchString, searchOptions(this._map, this._map.getVenue(), 'search'), this._clickOnSearchResult.bind(this))
      } else if (this._map.getVenue()) {
        this._map.headerManager.showSearchResults('mainSearches', this._clickOnSearchResult.bind(this))
      } else {
        this._map.headerManager.search(' ', searchOptions(this._map, null, 'search'), this._clickOnSearchResult.bind(this))
      }
    }
  }
  private _searchBlur (e: JQueryEventObject): void {
    this._hideSearchResultsTimeout = setTimeout(() => {
      this._container.find('#mwz-mapwize-search').val('')
      this.map.headerManager.hideSearchResults()
    }, 500)
  }

  private _clickOnSearchResult (searchResult: any, universe?: any, analytics: any = null): void {
    if (searchResult._id) {
      if (searchResult.objectClass === 'venue') {
        this.map.centerOnVenue(searchResult._id)
      } else if (searchResult.objectClass === 'place' || searchResult.objectClass === 'placeList') {
        if (universe) {
          this.map.setUniverseForVenue(universe._id, searchResult.venueId)
        }
        this._map.footerManager.setSelected(searchResult, true, analytics)
      }
    } else if (searchResult.geometry) {
      if (searchResult.geometry.bounds) {
        this.map.fitBounds([
          [searchResult.geometry.bounds.southwest.lng, searchResult.geometry.bounds.southwest.lat],
          [searchResult.geometry.bounds.northeast.lng, searchResult.geometry.bounds.northeast.lat],
        ])
      } else {
        this.map.flyTo({
          center: searchResult.geometry.location,
          zoom: 19,
        })
      }
    }
  }
}
