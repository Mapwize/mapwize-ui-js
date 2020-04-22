import * as $ from 'jquery'
import { compact, filter, forEach, get, indexOf, isArray, isFinite, template } from 'lodash'

const resultsHtml = require('./searchResults.html')

const templateVenue = require('./templates/venue.html')
const templatePlace = require('./templates/place.html')
const templatePlaceList = require('./templates/placeList.html')

import { DefaultControl } from '../../control'
import { translate } from '../../translate'
import { callOptionnalFn, getIcon, getMainFroms, getMainSearches, getTranslation } from '../../utils'

let itemSelected: any

export class SearchResults extends DefaultControl {

  private _options: any
  private userLocationCallback: (searchResult: any, universe?: any) => void

  constructor (mapInstance: any, options: any) {
    super(mapInstance)

    this._container = $(resultsHtml)
    this._options = options

    this.listen('click', '#mwz-use-user-location', this._clickOnUserLocation.bind(this))

    if (options.mainColor) {
      this._container.find('.mwz-progress-bar').css('background-color', options.mainColor)
    }
  }
  public remove (): void {
    return null
  }

  public getDefaultPosition (): string {
    return 'top-left'
  }

  public setResults (results: string | any[], clickOnResultCallback: (searchResult: any, universe?: any, analytics?: any) => void, focusedField: string) {
    itemSelected = 0
    if (results === 'mainSearches') {
      this._showMainSearchIfAny(clickOnResultCallback)
    } else if (results === 'mainFroms') {
      this._showMainFromIfAny(clickOnResultCallback)
    } else if (isArray(results)) {
      this._showSearchResult(results, (universe: any) => {
        return (clicked: any, analytics: any = null) => {
          clickOnResultCallback(clicked, universe, analytics)
        }
      })
    }

    this._showUserLocationButtonIfPossible(focusedField, clickOnResultCallback)
  }

  public showLoading () {
    this._container.find('#mwz-search-loading').show()
  }
  public hideLoading () {
    this._container.find('#mwz-search-loading').hide()
  }

  public refreshLocale () {
    if (this._map) {
      // need to refresh 'on floor' string in search results
    }
  }

  public enterKeyup () {
    const elementSelected = this._container.find('#mwz-search-results-container a')[itemSelected - 1]
    this._container.find(elementSelected).click()
    $(this.map._container).find('#mwz-mapwize-search').blur()
  }

  public upArrow () {
    const searchResults = this._container.find('#mwz-search-results-container a')
    const pastItemSelected = searchResults[itemSelected - 1]
    let nextItemToSelect

    if (itemSelected <= searchResults.length && itemSelected > 1) {
      nextItemToSelect = searchResults[itemSelected - 2]
      itemSelected--
    } else {
      nextItemToSelect = searchResults[searchResults.length - 1]
      itemSelected = searchResults.length
    }

    this._container.find(pastItemSelected).removeClass('mwz-item-selected')
    this._container.find(nextItemToSelect).addClass('mwz-item-selected')

    this.setScroll(this._container.find(nextItemToSelect))
  }

  public downArrow () {
    const searchResults = this._container.find('#mwz-search-results-container a')
    const pastItemSelected = searchResults[itemSelected - 1]
    let nextItemToSelect

    if (itemSelected < searchResults.length && itemSelected >= 0) {
      nextItemToSelect = searchResults[itemSelected]
      itemSelected++
    } else {
      nextItemToSelect = searchResults[0]
      itemSelected = 1
    }

    this._container.find(pastItemSelected).removeClass('mwz-item-selected')
    this._container.find(nextItemToSelect).addClass('mwz-item-selected')

    this.setScroll(this._container.find(nextItemToSelect))
  }

  public setScroll (item: JQuery<HTMLElement>) {
    const container = this._container

    const containerHeight = container.height()
    const containerTop = container.scrollTop()

    const itemTop = this._container.find(item).offset().top - container.offset().top
    const itemBottom = itemTop + this._container.find(item).height()

    const itemIsFullyVisible = (itemTop >= 0 && itemBottom <= containerHeight)

    if (!itemIsFullyVisible) {
      container.animate({ scrollTop: itemTop + containerTop }, 250)
    }
  }

  // ---------------------------------------
  // Privates methods
  // ---------------------------------------

  private _clickOnUserLocation () {
    if (this.userLocationCallback) {
      this.userLocationCallback({ objectClass: 'userLocation' })
    }
  }

  private _showUserLocationButtonIfPossible (focusedField: string, clickOnResultCallback: (searchResult: any, universe?: any) => void) {
    const userLocation = this.map.getUserLocation()
    if (focusedField === 'from' && userLocation && isFinite(userLocation.floor)) {
      this._container.find('#mwz-use-user-location').show().find('button').text(translate('use_current_location'))
      this.userLocationCallback = clickOnResultCallback
    } else {
      this._container.find('#mwz-use-user-location').hide()
      this.userLocationCallback = null
    }
  }

  private _showMainSearchIfAny (onClick: (searchResult: any, universe?: any, analytics?: any) => void) {
    const venue = this.map.getVenue()
    const resultContainer = this._container.find('#mwz-search-results-container')
    resultContainer.html('')

    if (venue.mainSearches.length) {
      this.showLoading()

      getMainSearches(venue.mainSearches).then((mainSearches: any[]) => {
        resultContainer.html('')
        forEach(compact(mainSearches), (mainSearch: any) => {
          resultContainer.append(this._mapwizeObjectResults(mainSearch, (mwzObject, analytics) => onClick(mwzObject, null, analytics), { channel: 'mainSearches' }))
        })
        this.hideLoading()
      })
    }
  }
  private _showMainFromIfAny (onClick: (searchResult: any, universe?: any, analytics?: any) => void) {
    const venue = this.map.getVenue()
    const resultContainer = this._container.find('#mwz-search-results-container')
    resultContainer.html('')

    if (venue.mainFroms.length) {
      this.showLoading()

      getMainFroms(venue.mainFroms).then((mainFroms: any[]) => {
        resultContainer.html('')
        forEach(compact(mainFroms), (mainFrom: any) => {
          resultContainer.append(this._mapwizeObjectResults(mainFrom, (mwzObject, analytics) => onClick(mwzObject, null, analytics), null))
        })
        this.hideLoading()
      })
    }
  }
  private _showSearchResult (results: any[], onClick: (universe: any) => (clickedResult: any, analytics?: any) => void) {
    const venue = this.map.getVenue()
    const lang = this.map.getLanguage() || this.map.getPreferredLanguage()
    const resultContainer = this._container.find('#mwz-search-results-container')

    let mapwize = results[1]

    resultContainer.html('')

    if (venue && !this.map.headerManager.isInDirectionMode() && mapwize.length) {
      mapwize = this._resultsByUniverse(mapwize)
      const currentUniverse = this.map.getUniverse()
      forEach(mapwize, (resultsByUniverse: any) => {
        const setOfResultsForUniverse: any[] = []
        forEach(resultsByUniverse.results, (mwzResult: any) => {
          if (getTranslation(mwzResult, lang, 'title')) {
            setOfResultsForUniverse.push(this._mapwizeObjectResults(mwzResult, onClick(resultsByUniverse.universe), { channel: 'search', searchQuery: results[0] }))
          }
        })

        if (setOfResultsForUniverse.length) {
          if (mapwize.length > 1 || get(resultsByUniverse, 'universe._id') !== currentUniverse._id) {
            resultContainer.append($('<li class="mwz-list-group-item mwz-list-group-item-secondary">' + get(resultsByUniverse, 'universe.name') + '</li>'))
          }
          resultContainer.append(setOfResultsForUniverse)
        }
      })
    } else {
      let isEmptyResultSet = true
      forEach(mapwize, (mwzResult: any) => {
        if (getTranslation(mwzResult, lang, 'title')) {
          resultContainer.append(this._mapwizeObjectResults(mwzResult, onClick(null), null))
          isEmptyResultSet = false
        }
      })

      if (isEmptyResultSet) {
        resultContainer.append($('<li class="mwz-list-group-item">' + translate('search_no_result') + '</li>'))
      }
    }
  }

  private _mapwizeObjectResults (mwzObject: any, onClick: (clickedResult: any, analytics: any) => void, analytics: any = null) {
    const lang = this.map.getLanguage() || this.map.getPreferredLanguage()
    const options = {
      floor: isFinite(mwzObject.floor) ? translate('on_floor', { floor: mwzObject.floor }) : '',
      icon: getIcon(mwzObject),
      subtitle: getTranslation(mwzObject, lang, 'subTitle'),
      title: getTranslation(mwzObject, lang, 'title'),
    }

    let mwzTemplate = null
    if (mwzObject.objectClass === 'venue') {
      mwzTemplate = templateVenue
    } else if (mwzObject.objectClass === 'place') {
      mwzTemplate = templatePlace
    } else if (mwzObject.objectClass === 'placeList') {
      mwzTemplate = templatePlaceList
    }

    const transformedResultTemplate = callOptionnalFn(this._options.onObjectWillBeDisplayedInSearch, [{ html: mwzTemplate, options }, mwzObject])
    const templated = template(transformedResultTemplate.html)(transformedResultTemplate.options)

    return $(templated).on('click', (e: any) => {
      e.preventDefault()
      return onClick(mwzObject, analytics)
    })
  }

  private _resultsByUniverse (mwzResults: any[]) {
    const venue = this.map.getVenue()
    const resultsByUniverse: any[] = []
    forEach(venue.accessibleUniverses, (universe: any) => {
      const resultInUniverse = filter(mwzResults, (result: any) => {
        return indexOf(result.universes, universe._id) !== -1
      })

      if (resultInUniverse.length) {
        resultsByUniverse.push({
          results: resultInUniverse,
          universe,
        })
      }
    })
    return resultsByUniverse
  }
}
