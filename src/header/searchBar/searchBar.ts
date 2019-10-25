import * as $ from 'jquery';
import { isFunction, template } from 'lodash'

const outOfVenueHtml = require('./templates/outOfVenue.html')
const enteringInVenueHtml = template(require('./templates/enteringInVenue.html'))
const inVenueHtml = template(require('./templates/inVenue.html'))

const OUTOFVENUE = 0
const ENTERINGINVENUE = 1
const INVENUE = 2

import { translate } from '../../translate'

import { DefaultControl } from '../../control'
import { getTranslation, replaceColorInBase64svg } from '../../utils'
import { searchOptions } from '../../search'

export class SearchBar extends DefaultControl {
  
  private _options: any
  
  private _hideSearchResultsTimeout: any
  
  constructor (mapInstance: any, options: any) {
    super(mapInstance)
    
    this._options = options
    this._container = $('<div />').html(outOfVenueHtml)
    
    // if (options.hideMenu) {
    //     this._container.find('#menuBar').addClass('d-none')
    // }
    
    // this.mainColor(options);
    
    this.listen('click', '#mwz-menu-button', this._menuButtonClick.bind(this))
    this.listen('click', '#mwz-directions-button', this._directionButtonClick.bind(this))
    
    this.listen('focus', '#mwz-mapwize-search', this._searchFocus.bind(this))
    this.listen('keyup', '#mwz-mapwize-search', this._searchKeyup.bind(this))
    this.listen('blur', '#mwz-mapwize-search', this._searchBlur.bind(this))
    
    // this.refreshLocale()
  }
  
  public getDefaultPosition(): string {
    return 'top-left'
  }
  
  public destroy() {}
  
  public enteringIn(venue: any): void {
    this._container.html(enteringInVenueHtml(venue))
  }
  public enteredIn(venue: any): void {
    this._container.html(inVenueHtml(venue))
  }
  public leaveVenue(): void {
    this._container.html(outOfVenueHtml)
  }
  
  
  private _menuButtonClick(e: JQueryEventObject): void {
    if (isFunction(this._options.onMenuButtonClick)) {
      this._options.onMenuButtonClick(e)
    }
  }
  private _directionButtonClick(e: JQueryEventObject): void {
    this._map.headerManager.showDirection()
  }
  
  private _searchFocus(e: JQueryEventObject): void {
    if (this._map.getVenue()) {
      this._map.headerManager.showSearchResults('mainSearches', this._clickOnSearchResult.bind(this))
    }
    clearTimeout(this._hideSearchResultsTimeout)
  }
  private _searchKeyup(e: JQueryEventObject): void {
    const target = $(e.target)
    const searchString: string = target.val().toString()
    
    if (searchString) {
      this._map.headerManager.search(searchString, searchOptions(this._map, this._map.getVenue(), 'search'), this._clickOnSearchResult.bind(this))
    } else if (this._map.getVenue()) {
      this._map.headerManager.showSearchResults('mainSearches', this._clickOnSearchResult.bind(this))
    } else {
      this._map.headerManager.hideSearchResults()
    }
  }
  private _searchBlur(e: JQueryEventObject): void {
    this._hideSearchResultsTimeout = setTimeout(() => {
      this._container.find('#mwz-mapwize-search').val('')
      this._map.headerManager.hideSearchResults()
    }, 500)
  }
  
  private _clickOnSearchResult(searchResult: any, universe?: any): void {
    if (this._map.getVenue()) {
      this._map.footerManager.setSelected(searchResult)
    }
    this._centerOnSearchResult(searchResult, universe)
  }

  private _centerOnSearchResult(searchResult: any, universe?: any): void {
    if (searchResult._id) {
      const venue = this._map.getVenue()
      if (universe && venue) {
        this.map.setUniverseForVenue(universe._id, venue)
      }
      
      if (searchResult.objectClass === 'venue') {
        return this.map.centerOnVenue(searchResult._id);
      } else if (searchResult.objectClass === 'place') {
        return this.map.centerOnPlace(searchResult._id);
      } else if (searchResult.objectClass === 'placeList') {
        return this.map.centerOnVenue(searchResult.venueId);
      } else {
        console.error('Unexepted objectClass value' + searchResult.objectClass);
      }
    } else if (searchResult.geometry) {
      if (searchResult.geometry.bounds) {
        this.map.fitBounds([
          [searchResult.geometry.bounds.southwest.lng, searchResult.geometry.bounds.southwest.lat],
          [searchResult.geometry.bounds.northeast.lng, searchResult.geometry.bounds.northeast.lat]
        ])
      } else {
        this.map.flyTo({
          center: searchResult.geometry.location,
          zoom: 19
        })
      }
    } else {
      console.error('Unexepted object', searchResult)
    }
  }


  

  // public mainColor(options: any) {
  //   if (options.mainColor) {
  //     const directionIconB64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYWxxdWVfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAgMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggY2xhc3M9InN0MSIgZD0iTTI4LjYsMTRMMTYsMS40Yy0wLjYtMC42LTEuNC0wLjYtMiwwTDEuNCwxNGMtMC42LDAuNi0wLjYsMS40LDAsMkwxNCwyOC42YzAuNiwwLjYsMS40LDAuNiwyLDBMMjguNiwxNiAgQzI5LjEsMTUuNCwyOS4xLDE0LjYsMjguNiwxNHogTTIyLDEzLjlsLTMuOSwzLjdjLTAuMiwwLjItMC41LDAtMC41LTAuMnYtMi4yYzAtMC4yLTAuMS0wLjMtMC4zLTAuM2gtNC41Yy0wLjIsMC0wLjMsMC4xLTAuMywwLjMgIHYzLjJjMCwwLjItMC4xLDAuMy0wLjMsMC4zaC0xLjljLTAuMiwwLTAuMy0wLjEtMC4zLTAuM3YtNC41YzAtMC45LDAuNy0xLjYsMS42LTEuNmg1LjhjMC4yLDAsMC4zLTAuMSwwLjMtMC4zdi0yICBjMC0wLjMsMC4zLTAuNCwwLjUtMC4ybDMuOCwzLjhDMjIuMSwxMy42LDIyLjEsMTMuOCwyMiwxMy45eiIgc3R5bGU9IiYjMTA7ICAgIC8qIGNvbG9yOiAgcmVkOyAqLyYjMTA7Ii8+PC9zdmc+'
  //     const menuIconB64 = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYWxxdWVfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDIyLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsMjQuMywxNi45LDIyLjksMTguNiwyMi45eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDQ2LjVoNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNDcuOSwxNi45LDQ2LjUsMTguNiw0Ni41eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDcwLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNzIuMywxNi45LDcwLjksMTguNiw3MC45eiIvPjwvZz48L2c+PC9zdmc+';
  //     this._container.find('#mwz-directionsButton img').attr('src', replaceColorInBase64svg(directionIconB64, options.mainColor))
  //     this._container.find('#mwz-menuButton img').attr('src', replaceColorInBase64svg(menuIconB64, options.mainColor))
  //   }
  // }
  
  // public refreshLocale () {
  //   switch (this._currentVenueState) {
  //     case OUTOFVENUE:
  //     this._container.find('.mwz-search input').attr('placeholder', translate('search_placeholder_global'))
  //     break;
  //     case ENTERINGINVENUE:
  //     this._container.find('.mwz-entering').text(translate('entering_in_venue', {venue: getTranslation(this._currentVenue, this.map.getLanguageForVenue(this._currentVenue._id), 'title')}));
  //     break;
  //     case INVENUE:
  //     this._container.find('.mwz-search input').attr('placeholder', translate('search_placeholder_venue', {venue:getTranslation(this._currentVenue, this.map.getLanguageForVenue(this._currentVenue._id), 'title')}))
  //     break;
  //     default:
  //     break;
  //   }
  // }
}
