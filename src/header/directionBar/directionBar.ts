import * as $ from 'jquery'
import { first, get, has, inRange, isObject, keyBy, map, set, template } from 'lodash'
import { Api } from 'mapwize'

const directionsHtml = require('./directionBar.html')

import { icons, uiConfig } from '../../config'
import { DOWNARROW, ENTER, UPARROW } from '../../constants'
import { DefaultControl } from '../../control'
import { searchOptions } from '../../search'
import { translate } from '../../translate'
import { callOptionnalFn, getTranslation, hexToRgb, latitude, longitude, replaceColorInBase64svg } from '../../utils'

const templateButtonMode = template(require('./templates/button-mode.html'))

const modeButtonWidth = 64

export class DirectionBar extends DefaultControl {

  private _hideSearchResultsTimeout: any

  private _from: any
  // private _waypoints: Array<any>
  private _to: any
  private _modes: any
  private _mode: any

  private _markerReference: any

  private _options: any

  constructor (mapInstance: any, options: any) {
    super(mapInstance)

    this._options = options

    this._container = $(directionsHtml)
    this._from = null
    // this._waypoints = []
    this._to = null
    this._options = options

    this.listen('click', '#mwz-close-button', this._closeButtonClick.bind(this))
    this.listen('click', '#mwz-reverse-button', this._reverseButtonClick.bind(this))

    this.listen('click', '.mwz-mode-button', this._modeButtonClick.bind(this))
    this.listen('click', '.mwz-next-mode', this._nextModesClick.bind(this))
    this.listen('click', '.mwz-previous-mode', this._previousModesClick.bind(this))

    this.listen('focus', '#mwz-mapwize-search-from', this._fromFocus.bind(this))
    this.listen('keyup', '#mwz-mapwize-search-from', this._fromKeyup.bind(this))
    this.listen('blur', '#mwz-mapwize-search-from', this._fromBlur.bind(this))

    this.listen('focus', '#mwz-mapwize-search-to', this._toFocus.bind(this))
    this.listen('keyup', '#mwz-mapwize-search-to', this._toKeyup.bind(this))
    this.listen('blur', '#mwz-mapwize-search-to', this._toBlur.bind(this))

    if (this._options.mainColor) {
      const rgbColor = hexToRgb(this._options.mainColor)
      const sheet = document.createElement('style')
      let styleHtml = ''
      styleHtml += '.mwz-mode-button-selected {background-color: rgba(' + rgbColor.r + ', ' + rgbColor.g + ', ' + rgbColor.b + ', 0.1) !important;}'

      sheet.innerHTML = styleHtml
      document.body.appendChild(sheet)
    }

    this._onModesChanges = this._onModesChanges.bind(this)
    this._onClick = this._onClick.bind(this)
  }

  public onAdd (mapInstance: any) {
    this._map = mapInstance
    this.isOnMap = true

    this._map.on('mapwize:modeschange', this._onModesChanges)
    this._map.on('mapwize:click', this._onClick)

    this._setAvailablesModes(this._map.getModes())
    this._displayDirection()

    setTimeout(() => {
      this._updateFieldFocus()
    }, 100)

    return this._container.get(0)
  }

  public onRemove () {
    if (this._map) {
      this._map.off('mapwize:modeschange', this._onModesChanges)
      this._map.off('mapwize:click', this._onClick)
    }

    this._container.remove()
    this._map = undefined
    this.isOnMap = false
  }

  public remove (): void {
    return null
  }

  public getDefaultPosition (): string {
    return 'top-left'
  }

  public setFrom (from: any, updateFocus = true): void {
    if (this._from !== from) {
      this._from = from

      const fromDisplay = this._getDisplay(this._from)
      this._container.find('#mwz-mapwize-search-from').val(fromDisplay)
      this._updateFieldsPlaceholder()

      if (updateFocus) {
        this._updateFieldFocus()
      }
      this._displayDirection()
    }
  }
  // public setWaypoint(index: number, waypoint: any): any {}
  // public setWaypoints(waypoints: Array<any>): any {}
  public setTo (to: any, updateFocus = true): void {
    if (this._to !== to) {
      this._to = to

      const toDisplay = this._getDisplay(this._to)
      this._container.find('#mwz-mapwize-search-to').val(toDisplay)

      if (updateFocus) {
        this._updateFieldFocus()
      }
      this._displayDirection()
    }
  }

  public getMode (): any {
    return this._mode
  }
  public setMode (modeId: string): void {
    const mode = this._modes[modeId]
    if (mode) {
      this._setSelectedMode(mode)
    } else {
      throw new Error('Mode does not exist or is not available')
    }
  }

  public refreshLocale () {
    if (this._map) {
      this._container.find('#mwz-mapwize-search-from').val(this._getDisplay(this._from))
      this._container.find('#mwz-mapwize-search-to').val(this._getDisplay(this._to))
    }
    this._updateFieldsPlaceholder()
  }

  // ---------------------------------------
  // Privates methods
  // ---------------------------------------

  private _closeButtonClick (e: JQueryEventObject): void {
    const to = this._to

    this._clear()
    this.map.headerManager.closeButtonClick(to)
    $(this.map._container).find('.mapboxgl-ctrl-bottom-right').css('bottom', 0)
    if (this.map.floorControl) {
      this.map.floorControl.resize()
    }
  }
  private _reverseButtonClick (e: JQueryEventObject): void {
    let oldFrom = null
    let oldTo = null
    if (this._from) {
      oldFrom = Object.assign({}, this._from)
    }
    if (this._to) {
      oldTo = Object.assign({}, this._to)
    }
    this.setFrom(null, false) // theses two lines avoid double direction calculation
    this.setTo(null, false)

    this.setFrom(oldTo, false)
    this.setTo(oldFrom)
  }
  private _modeButtonClick (e: JQueryEventObject): void {
    this.setMode(e.currentTarget.id)
    this._displayDirection()
  }
  private _nextModesClick (e: JQueryEventObject): void {
    const element = this._container.find('.mwz-mode-icons')
    this._setModeScroll(element.scrollLeft() + this._getScrollSize())
  }
  private _previousModesClick (e: JQueryEventObject): void {
    const element = this._container.find('.mwz-mode-icons')
    this._setModeScroll(element.scrollLeft() - this._getScrollSize())
  }
  private _getScrollSize () {
    return ($(this.map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS) ? 3 : 4) * modeButtonWidth
  }

  private _updateFieldsPlaceholder (): void {
    if (!this._from) {
      this._container.find('#mwz-mapwize-search-from').attr('placeholder', translate('choose_starting_or_click_point'))
      this._container.find('#mwz-mapwize-search-to').attr('placeholder', translate('choose_destination'))
    } else {
      this._container.find('#mwz-mapwize-search-from').attr('placeholder', translate('choose_starting_or_click_point'))
      this._container.find('#mwz-mapwize-search-to').attr('placeholder', translate('choose_destination_or_click_point'))
    }
  }
  private _updateFieldFocus (): void {
    if (!this._from) {
      this._container.find('#mwz-mapwize-search-from').focus()
    } else if (!this._to) {
      this._container.find('#mwz-mapwize-search-to').focus()
    } else {
      if (this._container.find('#mwz-mapwize-search-from').is(':focus')) {
        this._container.find('#mwz-mapwize-search-from').blur()
      }
      if (this._container.find('#mwz-mapwize-search-to').is(':focus')) {
        this._container.find('#mwz-mapwize-search-to').blur()
      }
    }
  }

  private _fromFocus (e: JQueryEventObject): void {
    this._container.find('#mwz-mapwize-search-from').select()
    if (this._options.mainColor) {
      this._container.find('#mwz-mapwize-search-from').css('border-color', this._options.mainColor)
    }
    this._fromKeyup(e)
    clearTimeout(this._hideSearchResultsTimeout)
  }
  private _fromKeyup (e: JQueryEventObject): void {
    const target = $(e.target)
    const searchString: string = target.val().toString()

    if (e.keyCode === UPARROW) {
      this._map.headerManager.upArrow()
    } else if (e.keyCode === DOWNARROW) {
      this._map.headerManager.downArrow()
    } else if (e.keyCode === ENTER) {
      this._map.headerManager.enterKeyup()
    } else {
      if (searchString) {
        const options = searchOptions(this._map, this._map.getVenue(), 'from')
        this._map.headerManager.search(searchString, options, this._clickOnFromResult.bind(this), 'from')
      } else {
        this._map.headerManager.showSearchResults('mainFroms', this._clickOnFromResult.bind(this), 'from')
        this.setFrom(null, false)
      }
    }
  }
  private _fromBlur (e: JQueryEventObject): void {
    this._container.find('#mwz-mapwize-search-from').css('border-color', '')
    this._hideSearchResultsTimeout = setTimeout(() => {
      this.setFrom(this._from, !!this._from)
      this.map.headerManager.hideSearchResults()
    }, 500)
  }

  private _toFocus (e: JQueryEventObject): void {
    this._container.find('#mwz-mapwize-search-to').select()
    if (this._options.mainColor) {
      this._container.find('#mwz-mapwize-search-to').css('border-color', this._options.mainColor)
    }
    this._toKeyup(e)
    clearTimeout(this._hideSearchResultsTimeout)
  }
  private _toKeyup (e: JQueryEventObject): void {
    const target = $(e.target)
    const searchString: string = target.val().toString()

    if (e.keyCode === UPARROW) {
      this._map.headerManager.upArrow()
    } else if (e.keyCode === DOWNARROW) {
      this._map.headerManager.downArrow()
    } else if (e.keyCode === ENTER) {
      this._map.headerManager.enterKeyup()
    } else {
      if (searchString) {
        const options = searchOptions(this._map, this._map.getVenue(), 'to')
        this._map.headerManager.search(searchString, options, this._clickOnToResult.bind(this), 'to')
      } else {
        this._map.headerManager.showSearchResults('mainSearches', this._clickOnToResult.bind(this), 'to')
        this.setTo(null, false)
      }
    }
  }
  private _toBlur (e: JQueryEventObject): void {
    this._container.find('#mwz-mapwize-search-to').css('border-color', '')
    this._hideSearchResultsTimeout = setTimeout(() => {
      this.setTo(this._to, !!this._to)
      this.map.headerManager.hideSearchResults()
    }, 500)
  }

  private _clickOnFromResult (searchResult: any, universe?: any): void {
    this.setFrom(searchResult)
  }
  private _clickOnToResult (searchResult: any, universe?: any): void {
    this.setTo(searchResult)
  }

  private _clear (): void {
    this.setFrom(null, false)
    // this.setWaypoints([])
    this.setTo(null, false)
  }

  private _getDisplay (o: any): string {
    if (o) {
      const lang = this.map.getLanguage()
      if (o.hasOwnProperty('_id')) {
        if (getTranslation(o, lang, 'title')) {
          return getTranslation(o, lang, 'title')
        } else {
          return translate('empty_title')
        }
      } else if (o.objectClass === 'userLocation') {
        return translate('current_location')
      } else {
        return translate('coordinates')
      }
    }
    return ''
  }

  private _onModesChanges (e: any): void {
    this._setAvailablesModes(e.modes)
  }
  private _onClick (e: any): void {
    if (e.place) {
      if (!this._from) {
        this.setFrom(set(e.place, 'objectClass', 'place'))
      } else if (!this._to) {
        this.setTo(set(e.place, 'objectClass', 'place'))
      }
    } else {
      if (!this._from) {
        this.setFrom({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, floor: e.floor })
      } else if (!this._to) {
        this.setTo({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, floor: e.floor })
      }
    }
  }

  private _setAvailablesModes (modes: any) {
    this._container.find('.mwz-mode-icons').empty()
    this._modes = keyBy(map(modes, (mode: any, index: number) => set(mode, 'index', index)), '_id')

    modes.forEach((mode: any, i: number) => {
      let selected = ''
      let icon = get(icons, mode.type)

      if (this._mode && mode._id === this._mode._id) {
        selected = ' mwz-mode-button-selected'
        icon = replaceColorInBase64svg(icon.split(',')[1], this._options.mainColor || '#C51586')
      }

      const button = templateButtonMode({
        icon,
        modeId: mode._id,
        modeType: mode.type,
        selected,
      })
      this._container.find('.mwz-mode-icons').append(button)
    })

    if (!this._mode || !this._modes[this._mode._id]) {
      this._setSelectedMode(first(modes))
    } else {
      this._ensureSelectedModeIsVisible()
    }

    this._updateArrowDisplayForModes(0)
  }
  private _updateArrowDisplayForModes (position: any) {
    const base64PrevouousMode = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgICAgIDxzdHlsZSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHR5cGU9InRleHQvY3NzIj4uc3Qxe2ZpbGw6IzAwMDAwMDt9PC9zdHlsZT4gICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTE1LjQxIDE2LjU5TDEwLjgzIDEybDQuNTgtNC41OUwxNCA2bC02IDYgNiA2IDEuNDEtMS40MXoiLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDBWMHoiLz48L3N2Zz4='
    const base64NextMode = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC41OSAxNi41OUwxMy4xNyAxMiA4LjU5IDcuNDEgMTAgNmw2IDYtNiA2LTEuNDEtMS40MXoiLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDBWMHoiLz48L3N2Zz4='

    let numberOfmodeToDisplay = 4

    if ($(this.map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS)) {
      numberOfmodeToDisplay = 3
    }

    const endScroll = (this._container.find('.mwz-mode-icons button').length - numberOfmodeToDisplay) * 64
    if (this._container.find('.mwz-mode-icons button').length - numberOfmodeToDisplay <= 0) {
      this._container.find('.mwz-previous-mode').hide()
      this._container.find('.mwz-next-mode').hide()
    } else if (position <= 0) {
      this._container.find('.mwz-previous-mode img').attr('src', replaceColorInBase64svg(base64PrevouousMode, '#DCDCDC'))
      this._container.find('.mwz-next-mode img').attr('src', replaceColorInBase64svg(base64NextMode, '#000000'))
    } else if (position >= endScroll) {
      this._container.find('.mwz-next-mode img').attr('src', replaceColorInBase64svg(base64NextMode, '#DCDCDC'))
      this._container.find('.mwz-previous-mode img').attr('src', replaceColorInBase64svg(base64PrevouousMode, '#000000'))
    } else {
      this._container.find('.mwz-previous-mode').show()
      this._container.find('.mwz-previous-mode img').attr('src', replaceColorInBase64svg(base64PrevouousMode, '#000000'))
      this._container.find('.mwz-next-mode img').attr('src', replaceColorInBase64svg(base64NextMode, '#000000'))
    }
  }
  private _setSelectedMode (mode: any) {
    if (this._mode) {
      this._container.find('#' + this._mode._id).removeClass('mwz-mode-button-selected')
      this._container.find('#' + this._mode._id + ' img').attr('src', get(icons, this._mode.type))
    }

    this._mode = mode
    this._container.find('#' + this._mode._id).addClass('mwz-mode-button-selected')
    this._container.find('#' + this._mode._id + ' img').attr('src', replaceColorInBase64svg(get(icons, this._mode.type).split(',')[1], this._options.mainColor || '#C51586'))

    this._ensureSelectedModeIsVisible()
    this._displayDirection()
  }
  private _ensureSelectedModeIsVisible () {
    const currentScroll = this._container.find('.mwz-mode-icons').scrollLeft()
    const buttonOffset = (this._mode.index - 1) * modeButtonWidth

    let visibleZone = currentScroll + 4 * modeButtonWidth
    if ($(this.map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS)) {
      visibleZone = currentScroll + 3 * modeButtonWidth
    }

    if (!inRange(buttonOffset, currentScroll, visibleZone)) {
      this._setModeScroll(buttonOffset + modeButtonWidth)
    }
  }
  private _setModeScroll (scrollValue: number) {
    this._container.find('.mwz-mode-icons').animate({ scrollLeft: scrollValue }, 600, () => {
      this._updateArrowDisplayForModes(scrollValue)
    })
  }

  private _removeCurrentMarker (): void {
    if (this._markerReference) {
      this._markerReference.then((marker: any): void => this.map.removeMarker(marker))
      this._markerReference = null
    }
  }

  private _displayDirection (options = {}) {
    if (this._map) {
      this._removeCurrentMarker()

      const from = this._extractQuery(this._from)
      const to = this._extractQuery(this._to)

      if (from && to) {
        this._container.find('#mwz-alert-no-direction').hide()

        Api.getDirection(callOptionnalFn(this._options.onDirectionQueryWillBeSent, [{
          from,
          modeId: this._mode ? this._mode._id : null,
          to,
        }])).catch((): any => {
          this._container.find('#mwz-alert-no-direction').show()
          return null
        }).then((direction: any) => {
          if (direction) {
            const transformedOptions = callOptionnalFn(this._options.onDirectionWillBeDisplayed, [options, direction])
            this._map.setDirection(direction, transformedOptions)
            this._promoteDirectionPlaces(direction)
            this._removeCurrentMarker()
            this._markerReference = this._map.addMarker(direction.to)
          }
        })
      } else if (this._map.getDirection()) {
        this._map.removeDirection()
      }
    }
  }

  private _extractQuery (o: any): any {
    if (isObject(o)) {
      const venue = this._map.getVenue()
      if (has(o, 'location')) {
        return {
          floor: get(o, 'floor'),
          lat: latitude(get(o, 'location')),
          lon: longitude(get(o, 'location')),
          venueId: get(o, 'venueId', venue._id),
        }
      } else if (get(o, 'objectClass') === 'place') {
        return { placeId: get(o, '_id') }
      } else if (get(o, 'objectClass') === 'placeList') {
        return { placeListId: get(o, '_id') }
      } else if (get(o, 'objectClass') === 'userLocation') {
        const userLocation = this._map.getUserLocation()
        return {
          floor: userLocation.floor,
          lat: latitude(userLocation),
          lon: longitude(userLocation),
          venueId: venue._id,
        }
      } else if (isFinite(latitude(o)) && isFinite(longitude(o))) {
        return {
          floor: get(o, 'floor'),
          lat: latitude(o),
          lon: longitude(o),
          venueId: get(o, 'venueId', venue._id),
        }
      }
    }
    return null
  }

  private _promoteDirectionPlaces (direction: any) {
    const placesToPromote = []
    if (direction.from.placeId) {
      placesToPromote.push(direction.from.placeId)
    }
    if (direction.to.placeId) {
      placesToPromote.push(direction.to.placeId)
    }
    this._map.setPromotedPlaces(placesToPromote)
  }
}
