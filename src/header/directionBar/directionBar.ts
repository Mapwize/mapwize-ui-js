import * as $ from 'jquery';
import { isObject, get, set, has, first, keyBy, template, inRange, map } from 'lodash'
import { Api } from 'mapwize'

const directionsHtml = require('./directionBar.html')

import { translate } from '../../translate'
import { DefaultControl } from '../../control'
import { getTranslation, latitude, longitude, replaceColorInBase64svg } from '../../utils'
import { searchOptions } from '../../search'
import { icons } from '../../config'

const templateButtonMode = template(require('./templates/button-mode.html'))

const modeButtonWidth = 64

export class DirectionBar extends DefaultControl {
  
  private _hideSearchResultsTimeout: any
  
  private _from: any
  // private _waypoints: Array<any>
  private _to: any
  private _modes: any
  private _mode: any
  
  private _options: any
  
  constructor(mapInstance: any, options: any) {
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
    
    // this.mainColor(options)
    // this.refreshLocale()

    this._onModesChanges = this._onModesChanges.bind(this)
    this._onClick = this._onClick.bind(this)
  }
  
  public onAdd(map: any) {
    this._map = map
    this.isOnMap = true
    
    this._map.on('mapwize:modeschange', this._onModesChanges)
    this._map.on('mapwize:click', this._onClick)
    
    this._setAvailablesModes(this._map.getModes())
    this._displayDirection()
    
    return this._container.get(0)
  }
  
  public onRemove() {
    if (this._map) {
      this._map.off('mapwize:modeschange', this._onModesChanges)
      this._map.off('mapwize:click', this._onClick)
    }

    this._container.remove();
    this._map = undefined;
    this.isOnMap = false
  }
  
  public remove() {}
  
  public getDefaultPosition(): string {
    return 'top-left'
  }
  
  public setFrom(from: any): void {
    this._from = from
    
    const fromDisplay = this._getDisplay(this._from)
    this._container.find('#mwz-mapwize-search-from').val(fromDisplay)
    if (fromDisplay) {
      this._container.find('#mwz-mapwize-search-to').attr('placeholder', translate('choose_destination_or_click_point'))
    } else {
      this._container.find('#mwz-mapwize-search-to').attr('placeholder', translate('choose_destination'))
    }
    
    this._displayDirection()
  }
  // public setWaypoint(index: number, waypoint: any): any {}
  // public setWaypoints(waypoints: Array<any>): any {}
  public setTo(to: any): void {
    this._to = to
    
    const toDisplay = this._getDisplay(this._to)
    this._container.find('#mwz-mapwize-search-to').val(toDisplay)
    
    this._displayDirection()
  }
  
  public getMode(): any {
    return this._mode;
  }
  public setMode(modeId: string): void {
    const mode = this._modes[modeId]
    if (mode) {
      this._setSelectedMode(mode)
    } else {
      throw new Error('Mode does not exist or is not available')
    }
  }
  
  // ---------------------------------------
  // Privates methods
  // ---------------------------------------
  
  private _closeButtonClick(e: JQueryEventObject): void {
    this._clear()
    this._map.headerManager.showSearch()
  }
  private _reverseButtonClick(e: JQueryEventObject): void {
    let oldFrom = null;
    let oldTo = null;
    if (this._from) {
      oldFrom = Object.assign({}, this._from);
    }
    if (this._to) {
      oldTo = Object.assign({}, this._to);
    }
    this.setFrom(null); // theses two lines avoid double direction calculation
    this.setTo(null);
    
    this.setFrom(oldTo);
    this.setTo(oldFrom);
  }
  private _modeButtonClick(e: JQueryEventObject): void {
    this.setMode(e.currentTarget.id)
    this._displayDirection()
  }
  private _nextModesClick(e: JQueryEventObject): void {
    var element = this._container.find('.mwz-mode-icons');
    this._setModeScroll(element.scrollLeft() + this._getScrollSize())
  }
  private _previousModesClick(e: JQueryEventObject): void {
    var element = this._container.find('.mwz-mode-icons');
    this._setModeScroll(element.scrollLeft() - this._getScrollSize())
  }
  private _getScrollSize() {
    return ($(this.map._container).hasClass('mwz-small') ? 3 : 4) * modeButtonWidth
  }
  
  private _fromFocus(e: JQueryEventObject): void {
    this._fromKeyup(e)
    clearTimeout(this._hideSearchResultsTimeout)
  }
  private _fromKeyup(e: JQueryEventObject): void {
    const target = $(e.target)
    const searchString: string = target.val().toString()
    
    if (searchString) {
      this._map.headerManager.search(searchString, searchOptions(this._map, this._map.getVenue(), 'from'), this._clickOnFromResult.bind(this))
    } else {
      this._map.headerManager.showSearchResults('mainFroms', this._clickOnFromResult.bind(this))
    }
  }
  private _fromBlur(e: JQueryEventObject): void {
    this._hideSearchResultsTimeout = setTimeout(() => {
      this.setFrom(this._from)
      this._map.headerManager.hideSearchResults()
    }, 500)
  }
  
  private _toFocus(e: JQueryEventObject): void {
    this._toKeyup(e)
    clearTimeout(this._hideSearchResultsTimeout)
  }
  private _toKeyup(e: JQueryEventObject): void {
    const target = $(e.target)
    const searchString: string = target.val().toString()
    
    if (searchString) {
      this._map.headerManager.search(searchString, searchOptions(this._map, this._map.getVenue(), 'to'), this._clickOnToResult.bind(this))
    } else {
      this._map.headerManager.showSearchResults('mainSearches', this._clickOnToResult.bind(this))
    }
  }
  private _toBlur(e: JQueryEventObject): void {
    this._hideSearchResultsTimeout = setTimeout(() => {
      this.setTo(this._to)
      this._map.headerManager.hideSearchResults()
    }, 500)
  }
  
  private _clickOnFromResult(searchResult: any, universe?: any): void {
    this.setFrom(searchResult)
  }
  private _clickOnToResult(searchResult: any, universe?: any): void {
    this.setTo(searchResult)
  }
  
  private _clear(): void {
    this.setFrom(null)
    // this.setWaypoints([])
    this.setTo(null)
  }
  
  private _getDisplay(o: any): string {
    if (o) {
      const lang = this.map.getLanguage()
      if (o.hasOwnProperty('_id')) {
        if (getTranslation(o, lang, 'title')) {
          return getTranslation(o, lang, 'title')
        } else {
          return translate('empty_title')
        }
      } else {
        return translate('coordinates')
      }
    }
    return '';
  }
  
  private _onModesChanges(e: any): void {
    this._setAvailablesModes(e.modes)
  }
  private _onClick(e: any): void {
    if (e.place) {
      if (!this._from) {
        this.setFrom(set(e.place, 'objectClass', 'place'));
      } else if (!this._to) {
        this.setTo(set(e.place, 'objectClass', 'place'));        
      }
    } else {
      if (!this._from) {
        this.setFrom({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, floor: e.floor });
      } else if (!this._to) {
        this.setTo({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, floor: e.floor });
      }
    }
  }
  
  private _setAvailablesModes(modes: any) {
    this._container.find('.mwz-mode-icons').empty()
    this._modes = keyBy(map(modes, (mode: any, index: number) => set(mode, 'index', index)), '_id')
    
    modes.forEach((mode: any, i: number) => {
      var selected = '';
      var icon = get(icons, mode.type);
      
      if (this._mode && mode._id == this._mode._id) {
        selected = ' mwz-mode-button-selected';
        icon = replaceColorInBase64svg(icon.split(',')[1], '#C51586')
      }
      
      var button = templateButtonMode({
        modeId: mode._id,
        modeType: mode.type,
        selected: selected,
        icon: icon
      })
      this._container.find('.mwz-mode-icons').append(button)
    })
    
    if (!this._mode) {
      this._setSelectedMode(first(modes))
    } else {
      this._ensureSelectedModeIsVisible()
    }
    
    this._updateArrowDisplayForModes(0)
  }
  private _updateArrowDisplayForModes(position: any) {
    var base64PrevouousMode = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgICAgIDxzdHlsZSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHR5cGU9InRleHQvY3NzIj4uc3Qxe2ZpbGw6IzAwMDAwMDt9PC9zdHlsZT4gICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTE1LjQxIDE2LjU5TDEwLjgzIDEybDQuNTgtNC41OUwxNCA2bC02IDYgNiA2IDEuNDEtMS40MXoiLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDBWMHoiLz48L3N2Zz4='
    var base64NextMode = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC41OSAxNi41OUwxMy4xNyAxMiA4LjU5IDcuNDEgMTAgNmw2IDYtNiA2LTEuNDEtMS40MXoiLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDBWMHoiLz48L3N2Zz4='
    
    var numberOfmodeToDisplay = 4;
    
    if ($(this.map._container).hasClass('mwz-small')) {
      numberOfmodeToDisplay = 3;
    }
    
    var endScroll = (this._container.find('.mwz-mode-icons button').length - numberOfmodeToDisplay) * 64;
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
  private _setSelectedMode(mode: any) {
    if (this._mode) {
      this._container.find('#' + this._mode._id).removeClass('mwz-mode-button-selected')
      this._container.find('#' + this._mode._id + ' img').attr('src', get(icons, this._mode.type))
    }
    
    this._mode = mode
    this._container.find('#' + this._mode._id).addClass('mwz-mode-button-selected')
    // #TODO Replace #C51586 with mainColor option
    this._container.find('#' + this._mode._id + ' img').attr('src', replaceColorInBase64svg(get(icons, this._mode.type).split(',')[1], '#C51586'))
    
    this._ensureSelectedModeIsVisible()
    this._displayDirection()
  }
  private _ensureSelectedModeIsVisible() {
    const currentScroll = this._container.find('.mwz-mode-icons').scrollLeft()
    const buttonOffset = (this._mode.index - 1) * modeButtonWidth
    
    let visibleZone = currentScroll + 4 * modeButtonWidth
    if ($(this.map._container).hasClass('mwz-small')) {
      visibleZone = currentScroll + 3 * modeButtonWidth
    }
    
    if (!inRange(buttonOffset, currentScroll, visibleZone)) {
      this._setModeScroll(buttonOffset + modeButtonWidth)
    }
  }
  private _setModeScroll(scrollValue: number) {
    this._container.find('.mwz-mode-icons').animate({ scrollLeft: scrollValue }, 600, () => {
      this._updateArrowDisplayForModes(scrollValue)
    })
  }
  
  private _displayDirection(options?: any) {
    if (this._map) {
      this._map.removeMarkers();
    
      const from = this._extractQuery(this._from)
      const to = this._extractQuery(this._to)
      
      if (from && to) {
        this._container.find('#mwz-alert-no-direction').hide()
        
        Api.getDirection({
          from: from,
          to: to,
          modeId: this._mode ? this._mode._id : null
        }).then((direction: any) => {
          this._map.setDirection(direction, options)
          this._promoteDirectionPlaces(direction)
          this._map.addMarker(direction.to)
        }).catch(() => {
          this._container.find('#mwz-alert-no-direction').show()
        });
      } else if (this._map.getDirection()) {
        this._map.removeDirection()
      }
    }
  }
  
  private _extractQuery(o: any): any {
    if (isObject(o)) {
      const venue = this._map.getVenue()
      if (has(o, 'location')) {
        return {
          lat: latitude(get(o, 'location')),
          lon: longitude(get(o, 'location')),
          floor: get(o, 'floor'),
          venueId: get(o, 'venueId', venue._id)
        };
      } else if (get(o, 'objectClass') === 'place') {
        return { placeId: get(o, '_id') };
      } else if (get(o, 'objectClass') === 'placeList') {
        return { placeListId: get(o, '_id') };
      } else if (get(o, 'objectClass') === 'userPosition') {
        const userPosition = this.map.getUserPosition();
        return {
          lat: latitude(userPosition),
          lon: longitude(userPosition),
          floor: userPosition.floor,
          venueId: userPosition.venueId || venue._id
        };
      } else if (isFinite(latitude(o)) && isFinite(longitude(o))) {
        return {
          lat: latitude(o),
          lon: longitude(o),
          floor: get(o, 'floor'),
          venueId: get(o, 'venueId', venue._id)
        };
      } else {
        console.error('Unexpected object content', o)
      }
    }
    return null;
  }
  
  private _promoteDirectionPlaces(direction: any) {
    const placesToPromote = [];
    if (direction.from.placeId) {
      placesToPromote.push(direction.from.placeId);
    }
    if (direction.to.placeId) {
      placesToPromote.push(direction.to.placeId);
    }
    this._map.addPromotedPlaces(placesToPromote);
  }
  
  
  
  
  
  
  
  public refreshLocale() {
    this._container.find('#mwz-mapwizeSearchFrom').val(this._getDisplay(this._from))
    this._container.find('#mwz-mapwizeSearchTo').val(this._getDisplay(this._to))
    
    if (this._from == null && this._to == null || this._to != null) {
      this._container.find('#mwz-mapwizeSearchFrom').attr('placeholder', translate('choose_starting_or_click_point'))
      this._container.find('#mwz-mapwizeSearchTo').attr('placeholder', translate('choose_destination'))
    } else {
      this._container.find('#mwz-mapwizeSearchFrom').attr('placeholder', translate('choose_starting_or_click_point'))
      this._container.find('#mwz-mapwizeSearchTo').attr('placeholder', translate('choose_destination_or_click_point'))
    }
  }
  
  public mainColor(options: any) {
    if (options.mainColor) {
      const crossIconB64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDk2IDk2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA5NiA5NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHR5cGU9InRleHQvY3NzIj4uc3Qxe2ZpbGw6IzAwMDAwMDt9PC9zdHlsZT48cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9Ijc1LjYsMjYgNjkuOSwyMC40IDQ4LDQyLjMgMjYsMjAuNCAyMC40LDI2IDQyLjMsNDggMjAuNCw3MCAyNiw3NS42IDQ4LDUzLjcgNjkuOSw3NS42IDc1LjYsNzAgNTMuNiw0OCAiLz48L3N2Zz4='
      const menuIconB64 = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYWxxdWVfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDIyLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsMjQuMywxNi45LDIyLjksMTguNiwyMi45eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDQ2LjVoNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNDcuOSwxNi45LDQ2LjUsMTguNiw0Ni41eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDcwLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNzIuMywxNi45LDcwLjksMTguNiw3MC45eiIvPjwvZz48L2c+PC9zdmc+';
      this._container.find('#mwz-close-button img').attr('src', replaceColorInBase64svg(crossIconB64, options.mainColor))
      this._container.find('#mwz-menuButton img').attr('src', replaceColorInBase64svg(menuIconB64, options.mainColor))
    }
  }
}
