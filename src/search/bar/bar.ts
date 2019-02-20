import * as $ from 'jquery';
import { isFunction } from 'lodash'

const barHtml = require('./bar.html')

import { DefaultControl } from '../../control'
import { getTranslation } from '../../utils'

export class SearchBar extends DefaultControl {
    
    private _currentVenue: any
    private _hideResultsTimeout: any
    
    constructor (mapInstance: any, onMenuButtonClick: Function) {
        super(mapInstance)
        
        this._container = $(barHtml)
        this._currentVenue = this.map.getVenue();
        
        this.listen('click', '#mwz-menuButton', (e: JQueryEventObject) => {
            if (isFunction(onMenuButtonClick)) {
                onMenuButtonClick(e)
            }
        })
        this.listen('click', '#mwz-directionsButton', (e: JQueryEventObject) => {
            this.map.searchDirections.show()
        })
        
        this.listen('focus', '#mwz-mapwizeSearch', (e: JQueryEventObject) => {
            this.map.searchResults.setFocusOn('search')
            
            clearTimeout(this._hideResultsTimeout)
            
            if (this._currentVenue) {
                this.map.searchResults.showMainSearchIfAny(this._clickOnSearchResult.bind(this))
            }
        })
        this.listen('keyup', '#mwz-mapwizeSearch', (e: JQueryEventObject) => {
            const str = $('#mwz-mapwizeSearch').val() + ''
            if (str) {
                this.map.searchResults.search(str, (universe: any) => {
                    return (clicked: any) => {
                        this._clickOnSearchResult(clicked, universe)
                    }
                }).then(() => {
                    this.map.searchResults.show()
                })
            } else if (this._currentVenue) {
                this.map.searchResults.showMainSearchIfAny(this._clickOnSearchResult.bind(this))
            } else {
                this.map.searchResults.hide()
            }
        })
        this.listen('blur', '#mwz-mapwizeSearch', (e: JQueryEventObject) => {
            this._hideResultsTimeout = setTimeout(() => {
                this._container.find('#mwz-mapwizeSearch').val('')
                this.map.searchResults.hide()
            }, 500)
        })
        
        this.onVenueWillEnter = this.onVenueWillEnter.bind(this)
        this.onVenueEnter = this.onVenueEnter.bind(this)
        this.onVenueExit = this.onVenueExit.bind(this)
        
        this.map.on('mapwize:venuewillenter', this.onVenueWillEnter)
        this.map.on('mapwize:venueenter', this.onVenueEnter)
        this.map.on('mapwize:venueexit', this.onVenueExit)
    }
    public destroy() {
        this.map.off('mapwize:venuewillenter', this.onVenueWillEnter)
        this.map.off('mapwize:venueenter', this.onVenueEnter)
        this.map.off('mapwize:venueexit', this.onVenueExit)
    }
    
    public show () {
        this.map.searchDirections.hide()
        this.map.addControl(this, 'top-left')
    }
    public hide () {
        this.map.removeControl(this)
    }
    
    private onVenueWillEnter(e: any): void {
        const lang = this.map.getLanguageForVenue(e.venue)
        this._container.find('.mwz-entering').text('Entering in ' + getTranslation(e.venue, lang, 'title')).show();
        this._container.find('.mwz-search').hide()
        this._container.find('.mwz-directions').hide()
        
        this._currentVenue = e.venue
    }
    private onVenueEnter(e: any): void {
        const lang = this.map.getLanguageForVenue(e.venue)
        this._container.find('.mwz-entering').hide()
        this._container.find('.mwz-directions').show()
        this._container.find('.mwz-search').show().find('input').attr('placeholder', 'Search in ' + getTranslation(e.venue, lang, 'title'))
    }
    private onVenueExit(e: any): void {
        this.show()
        
        this._container.find('.mwz-entering').hide()
        this._container.find('.mwz-directions').hide()
        this._container.find('.mwz-search').show().find('input').attr('placeholder', 'Search in Mapwize')
        
        this._currentVenue = null
    }
    
    private _clickOnSearchResult(searchResult: any, universe?: any): void {
        if (searchResult._id) {
            if (universe && this._currentVenue) {
                this.map.setUniverseForVenue(universe, this._currentVenue)
            }
            
            if (searchResult.objectClass === 'venue') {
                this.map.centerOnVenue(searchResult._id);
            } else if (searchResult.objectClass === 'place') {
                this.map.centerOnPlace(searchResult._id);
                this.map.footerSelection.select(searchResult)
            } else if (searchResult.objectClass === 'placeList') {
                this.map.centerOnVenue(searchResult.venueId);
                this.map.footerSelection.select(searchResult)
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
    
}