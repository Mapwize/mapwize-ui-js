import { forEach, template, isFinite, filter, indexOf, get, compact } from 'lodash'
import * as $ from 'jquery';

const resultsHtml = require('./results.html')

const templatePlace = require('./templates/place.html')
const templatePlaceList = require('./templates/placeList.html')
const templateGoogle = require('./templates/google.html')

import { DefaultControl } from '../../control'
import { getTranslation, getIcon, search, getMainSearches, getMainFroms } from '../../utils'
import { translate } from '../../translate'

export class SearchResults extends DefaultControl {
    
    private _currentVenue: any
    private _focusOn: string
    private _venueId: any
    private _organizationId: any
    
    constructor (mapInstance: any, options: any) {
        super(mapInstance)
        
        // PREPEND IN MAP TOP LEFT CONTROL
        this._container = $(resultsHtml)
        this._currentVenue = this.map.getVenue()
        this._focusOn = 'search'
        this._venueId = options.restrictContentToVenue
        this._organizationId = options.restrictContentToOrganization

        this.onVenueWillEnter = this.onVenueWillEnter.bind(this)
        this.onVenueExit = this.onVenueExit.bind(this)

        this.map.on('mapwize:venuewillenter', this.onVenueWillEnter)
        this.map.on('mapwize:venueexit', this.onVenueExit)
    }
    public destroy () {
        this.map.off('mapwize:venuewillenter', this.onVenueWillEnter)
        this.map.off('mapwize:venueexit', this.onVenueExit)
    }

    public show() {
        this.map.addControl(this, 'top-left')
    }
    public hide() {
        this.map.removeControl(this)
    }

    public refreshLocale() {
        // need to refresh 'on floor' string in search results
    }
    
    private onVenueExit() {
        this._currentVenue = null
    }
    private onVenueWillEnter(e) {
        this._currentVenue = e.venue
    }

    private showLoading() {
        this._container.find('#searchLoading').show()
    }
    private hideLoading() {
        this._container.find('#searchLoading').hide()
    }
    
    public setFocusOn(focus: string): void {
        this._focusOn = focus
    }
    
    public showMainSearchIfAny(onClick: Function) {
        const resultContainer = this._container.find('#displayResults')
        resultContainer.html('')
        
        if (this._currentVenue.mainSearches.length) {
            this.showLoading()
            
            getMainSearches(this._currentVenue.mainSearches).then((mainSearches: Array<any>) => {
                resultContainer.html('')
                forEach(compact(mainSearches), (mainSearch: any) => {
                    resultContainer.append(this.mapwizeObjectResults(mainSearch, onClick))
                })
                this.hideLoading()
            })
            
            this.show()
        }
    }
    public showMainFromIfAny(onClick: Function) {
        const resultContainer = this._container.find('#displayResults')
        resultContainer.html('')
        
        if (this._currentVenue.mainFroms.length) {
            this.showLoading()
            
            getMainFroms(this._currentVenue.mainFroms).then((mainFroms: Array<any>) => {
                resultContainer.html('')
                forEach(compact(mainFroms), (mainFrom: any) => {
                    resultContainer.append(this.mapwizeObjectResults(mainFrom, onClick))
                })
                this.hideLoading()
            })
            
            this.show()
        }
    }
    
    private mapwizeObjectResults(mwzObject: any, onClick: Function) {
        const lang = this.map.getLanguage() || this.map._options.preferredLanguage
        
        return $(template(templatePlace)({
            icon: getIcon(mwzObject),
            title: getTranslation(mwzObject, lang, 'title'),
            subtitle: getTranslation(mwzObject, lang, 'subTitle'),
            floor: isFinite(mwzObject.floor) ? translate('on_floor', { floor: mwzObject.floor }) : ''
        })).on('click', e => {
            e.preventDefault();
            return onClick(mwzObject);
        })
    }
    private googleObjectResults(googleObject: any, onClick: Function) {
        return $(template(templateGoogle)({
            address: get(googleObject, 'formatted_address'),
        })).on('click', e => {
            e.preventDefault();
            return onClick(googleObject)
        })
    }
    
    private searchOptions(focusOn: string): any {
        const options: any = {};
        
        options.venueId = this._currentVenue ? this._currentVenue._id : null;
        options.objectClass = options.venueId ? (focusOn === 'from' ? ['place'] : ['place', 'placeList']) : ['venue'];
        
        if (this._venueId) {
            options.venueId = this._venueId
        }
        if (this._organizationId) {
            options.organizationId = this._organizationId;
        }
        
        options.google = !this._currentVenue;
        // options.bounds = this.map.getBounds();
        
        return options;
    }
    
    public search (str: string, onClick: Function) {
        const searchOptions = this.searchOptions(this._focusOn)
        const lang = this.map.getLanguage()
        
        return search(str, searchOptions).then((results: Array<any>) => {
            let [query, mapwize, google] = results
            
            const resultContainer = this._container.find('#displayResults')
            resultContainer.html('')
            
            if (this._currentVenue && mapwize.length) {
                mapwize = this.resultsByUniverse(mapwize)
                const currentUniverse = this.map.getUniverse()
                forEach(mapwize, (resultsByUniverse: any) => {
                    // display universe header only if needed (see maps condition)
                    if (mapwize.length > 1 || get(resultsByUniverse, 'universe._id') !== currentUniverse._id) {
                        resultContainer.append($('<li class="list-group-item list-group-item-secondary">' + get(resultsByUniverse, 'universe.name') + '</li>'))
                    }
                    forEach(resultsByUniverse.results, (mwzResult: any) => {
                        if (getTranslation(mwzResult, lang, 'title')) {
                            resultContainer.append(this.mapwizeObjectResults(mwzResult, onClick(resultsByUniverse.universe)))
                        }
                    })
                })
            } else {
                forEach(mapwize, (mwzResult: any) => {
                    resultContainer.append(this.mapwizeObjectResults(mwzResult, onClick(null)))
                })
                
                if (google.length) {
                    // resultContainer.append($('<li class="list-group-item list-group-item-secondary">Google results</li>'))
                    forEach(google, (googleResult: any) => {
                        resultContainer.append(this.googleObjectResults(googleResult, onClick(null)))
                    })
                }
            }
        })
    }
    
    private resultsByUniverse(mwzResults: any[]) {
        const resultsByUniverse: any[] = [];
        forEach(this._currentVenue.accessibleUniverses, (universe) => {
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