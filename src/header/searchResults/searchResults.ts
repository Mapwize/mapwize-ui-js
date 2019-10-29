import { forEach, template, isFinite, filter, indexOf, get, compact, isArray } from 'lodash'
import * as $ from 'jquery';

const resultsHtml = require('./searchResults.html')

const templateVenue = template(require('./templates/venue.html'))
const templatePlace = template(require('./templates/place.html'))
const templatePlaceList = template(require('./templates/placeList.html'))

import { DefaultControl } from '../../control'
import { getTranslation, getIcon, getMainSearches, getMainFroms } from '../../utils'
import { translate } from '../../translate'

export class SearchResults extends DefaultControl {
  
  constructor (mapInstance: any, options: any) {
    super(mapInstance)
    
    this._container = $(resultsHtml)
  }
  public remove () {}
  
  public getDefaultPosition(): string {
    return 'top-left'
  }
  
  public setResults(results: string|Array<any>, clickOnResultCallback: Function) {
    if (results === 'mainSearches') {
      this._showMainSearchIfAny(clickOnResultCallback)
    } else if (results === 'mainFroms') {
      this._showMainFromIfAny(clickOnResultCallback)
    } else if (isArray(results)) {
      this._showSearchResult(results, (universe: any) => {
        return (clicked: any) => {
          clickOnResultCallback(clicked, universe)
        }
      })
    }
  }
  
  public showLoading() {
    this._container.find('#mwz-search-loading').show()
  }
  public hideLoading() {
    this._container.find('#mwz-search-loading').hide()
  }
  
  private _showMainSearchIfAny(onClick: Function) {
    const venue = this.map.getVenue()
    const resultContainer = this._container.find('#mwz-search-results-container')
    resultContainer.html('')
    
    if (venue.mainSearches.length) {
      this.showLoading()
      
      getMainSearches(venue.mainSearches).then((mainSearches: Array<any>) => {
        resultContainer.html('')
        forEach(compact(mainSearches), (mainSearch: any) => {
          resultContainer.append(this._mapwizeObjectResults(mainSearch, onClick))
        })
        this.hideLoading()
      })
    }
  }
  private _showMainFromIfAny(onClick: Function) {
    const venue = this.map.getVenue()
    const resultContainer = this._container.find('#mwz-search-results-container')
    resultContainer.html('')
    
    if (venue.mainFroms.length) {
      this.showLoading()
      
      getMainFroms(venue.mainFroms).then((mainFroms: Array<any>) => {
        resultContainer.html('')
        forEach(compact(mainFroms), (mainFrom: any) => {
          resultContainer.append(this._mapwizeObjectResults(mainFrom, onClick))
        })
        this.hideLoading()
      })
    }
  }
  private _showSearchResult(results: Array<any>, onClick: Function) {
    const venue = this.map.getVenue()
    const lang = this.map.getLanguage() || this.map.getPreferredLanguage()
    const resultContainer = this._container.find('#mwz-search-results-container')
    
    let [query, mapwize] = results
    
    resultContainer.html('')
    
    if (venue && mapwize.length) {
      mapwize = this._resultsByUniverse(mapwize)
      const currentUniverse = this.map.getUniverse()
      forEach(mapwize, (resultsByUniverse: any) => {
        // display universe header only if needed (see maps condition)
        if (mapwize.length > 1 || get(resultsByUniverse, 'universe._id') !== currentUniverse._id) {
          resultContainer.append($('<li class="list-group-item list-group-item-secondary">' + get(resultsByUniverse, 'universe.name') + '</li>'))
        }
        forEach(resultsByUniverse.results, (mwzResult: any) => {
          if (getTranslation(mwzResult, lang, 'title')) {
            resultContainer.append(this._mapwizeObjectResults(mwzResult, onClick(resultsByUniverse.universe)))
          }
        })
      })
    } else {
      forEach(mapwize, (mwzResult: any) => {
        if (getTranslation(mwzResult, lang, 'title')) {
          resultContainer.append(this._mapwizeObjectResults(mwzResult, onClick(null)))
        }
      })
    }
  }
  
  private _mapwizeObjectResults(mwzObject: any, onClick: Function) {
    const lang = this.map.getLanguage() || this.map.getPreferredLanguage()
    const options = {
      icon: getIcon(mwzObject),
      title: getTranslation(mwzObject, lang, 'title'),
      subtitle: getTranslation(mwzObject, lang, 'subTitle'),
      floor: isFinite(mwzObject.floor) ? translate('on_floor', { floor: mwzObject.floor }) : ''
    }
    let templated = null

    if (mwzObject.objectClass === 'venue') {
      templated = templateVenue(options)
    } else if (mwzObject.objectClass === 'place') {
      templated = templatePlace(options)
    } else if (mwzObject.objectClass === 'placeList') {
      templated = templatePlaceList(options)
    }

    return $(templated).on('click', e => {
      e.preventDefault();
      return onClick(mwzObject);
    })
  }
  
  
  
  
  
  public refreshLocale() {
    // need to refresh 'on floor' string in search results
  }
  
  private _resultsByUniverse(mwzResults: any[]) {
    const venue = this.map.getVenue()
    const resultsByUniverse: any[] = [];
    forEach(venue.accessibleUniverses, (universe) => {
      const resultInUniverse = filter(mwzResults, (result) => {
        return indexOf(result.universes, universe._id) !== -1;
      });
      
      if (resultInUniverse.length) {
        resultsByUniverse.push({
          universe: universe,
          results: resultInUniverse
        });
      }
    });
    return resultsByUniverse;
  }
}
