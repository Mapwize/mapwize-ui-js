import * as $ from 'jquery';
import { isObject, get } from 'lodash'
import { Api } from 'mapwize'

const directionsHtml = require('./directions.html')

import { DefaultControl } from '../../control'
import { getTranslation, latitude, longitude } from '../../utils'

export class SearchDirections extends DefaultControl {
    
    private _currentVenue: any
    private _hideResultsTimeout: any
    
    private _from: any
    private _to: any
    private _accessible: boolean
    private _direction: any
    
    constructor (mapInstance: any) {
        super(mapInstance)
        
        this._container = $(directionsHtml)
        this._currentVenue = this.map.getVenue()
        this._from = this._to = null
        this._accessible = false
        
        if (this._currentVenue) {
            const lang = this.map.getLanguageForVenue(this._currentVenue)
            this._container.find('.mwz-venue-name').text(getTranslation(this._currentVenue, lang, 'title'))
        }
        
        this.listen('click', '#mwz-close-button', () => {
            this.clear()
            
            this.map.searchBar.show()
        })
        this.listen('click', '#mwz-reverse-button', () => {
            let oldFrom = null;
            let oldTo = null;
            if (this._from) {
                oldFrom = Object.assign({}, this._from);
            }
            if (this._to) {
                oldTo = Object.assign({}, this._to);
            }
            this._setFrom(null); // theses two lines avoid double direction calculation
            this._setTo(null);
            
            this._setFrom(oldTo);
            this._setTo(oldFrom);

            this._container.find('#mwz-mapwizeSearchFrom').val(this.getDisplay(this._from))
            this._container.find('#mwz-mapwizeSearchTo').val(this.getDisplay(this._to))
        })
        this.listen('click', '#mwz-accessible-button', () => {
            this._accessible = !this._accessible;

            if (this._accessible) {
                this._container.find('#accessible-off').removeClass('d-inline')
                this._container.find('#accessible-on').addClass('d-inline')
            } else {
                this._container.find('#accessible-off').addClass('d-inline')
                this._container.find('#accessible-on').removeClass('d-inline')
            }
        
            this._displayDirection()
        })
        
        this.listen('focus', '#mwz-mapwizeSearchFrom', () => {
            this.map.searchResults.setFocusOn('from')
            
            clearTimeout(this._hideResultsTimeout)
            
            const str = this._container.find('#mwz-mapwizeSearchFrom').val() + ''
            if (str) {
                this.map.searchResults.search(str, () => {
                    return this._setFrom.bind(this)
                }).then(() => {
                    this.map.searchResults.show()
                })
            } else {
                this.map.searchResults.showMainFromIfAny(this._setFrom.bind(this))
            }
        })
        this.listen('keyup', '#mwz-mapwizeSearchFrom', () => {
            this._setFrom(null)
            
            const str = this._container.find('#mwz-mapwizeSearchFrom').val() + ''
            if (str) {
                this.map.searchResults.search(str, () => {
                    return this._setFrom.bind(this)
                }).then(() => {
                    this.map.searchResults.show()
                })
            } else if (this._currentVenue) {
                this.map.searchResults.showMainFromIfAny(this._setFrom.bind(this))
            } else {
                this.map.searchResults.hide()
            }
        })
        this.listen('blur', '#mwz-mapwizeSearchFrom', () => {
            this._hideResultsTimeout = setTimeout(() => {
                this._container.find('#mwz-mapwizeSearchFrom').val(this.getDisplay(this._from))
                this.map.searchResults.hide()
            }, 500)
        })
        
        this.listen('focus', '#mwz-mapwizeSearchTo', () => {
            this.map.searchResults.setFocusOn('to')
            
            clearTimeout(this._hideResultsTimeout)
            
            const str = this._container.find('#mwz-mapwizeSearchTo').val() + ''
            if (str) {
                this.map.searchResults.search(str, () => {
                    return this._setTo.bind(this)
                }).then(() => {
                    this.map.searchResults.show()
                })
            } else {
                this.map.searchResults.showMainSearchIfAny(this._setTo.bind(this))
            }
        })
        this.listen('keyup', '#mwz-mapwizeSearchTo', () => {
            this._setTo(null)
            
            const str = this._container.find('#mwz-mapwizeSearchTo').val() + ''
            if (str) {
                this.map.searchResults.search(str, () => {
                    return this._setTo.bind(this)
                }).then(() => {
                    this.map.searchResults.show()
                })
            } else if (this._currentVenue) {
                this.map.searchResults.showMainSearchIfAny(this._setTo.bind(this))
            } else {
                this.map.searchResults.hide()
            }
        })
        this.listen('blur', '#mwz-mapwizeSearchTo', () => {
            this._hideResultsTimeout = setTimeout(() => {
                this._container.find('#mwz-mapwizeSearchTo').val(this.getDisplay(this._to))
                this.map.searchResults.hide()
            }, 500)
        })
        
        this.map.on('mapwize:venueexit', (e: any) => {
            if (!this._direction) {
                this.clear()
            }
            
            this._currentVenue = null;
        })
        this.map.on('mapwize:venuewillenter', (e: any) => {
            this._currentVenue = e.venue
            
            const lang = this.map.getLanguageForVenue(e.venue)
            this._container.find('.mwz-venue-name').text(getTranslation(e.venue, lang, 'title'))
        })
        this.map.on('mapwize:venueenter', (e: any) => {
            if (this._direction) {
                if (get(this._from, 'venueId') !== e.venue._id || get(this._to, 'venueId') !== e.venue._id) {
                    this.clear()
                } else {
                    this._displayDirection({ preventFitBounds: true })
                    this.show()
                }
            }
        })
    }
    
    public show () {
        this.map.searchBar.hide()
        
        if (this.map.footerSelection.getSelected()) {
            this._setTo(this.map.footerSelection.getSelected())
            const lang = this.map.getLanguage()
            this._container.find('#mwz-mapwizeSearchTo').val(getTranslation(this._to, lang, 'title'))
        }
        
        this.map.footerSelection.unselect()
        this.map.footerVenue.hide()
        
        this.map.addControl(this, 'top-left')
        $(this.map._container).addClass('mwz-directions')
    }
    public hide () {
        this.map.footerDirections.hide()
        this.map.footerVenue.showIfNeeded()
        
        this.map.removeControl(this)
        $(this.map._container).removeClass('mwz-directions')
    }
    
    private clear(): void {
        this._setFrom(null)
        this._setTo(null)
        this._direction = null
        this._container.find('#mwz-mapwizeSearchFrom').val('')
        this._container.find('#mwz-mapwizeSearchTo').val('')
    }
    
    private _setFrom(from: any): void {
        this._from = from
        
        this._displayDirection()
    }
    private _setTo(to: any): void {
        this._to = to
        
        this._displayDirection()
    }

    private getDisplay(o: any): string {
        if (o) {
            const lang = this.map.getLanguage()
            return getTranslation(o, lang, 'title')
            
        }
        return '';
    }
    
    private _displayDirection(options?: any) {
        this.map.removeMarkers();
        
        const from = this.extractQuery(this._from)
        const to = this.extractQuery(this._to)
        
        if (from && to) {
            Api.getDirection({
                from: from,
                to: to,
                options: {
                    isAccessible: this._accessible
                }
            }).then((direction: any) => {
                this._direction = direction
                
                this.map.setDirection(direction, options);
                const placesToPromote = [];
                if (direction.from.placeId) {
                    placesToPromote.push(direction.from.placeId);
                }
                if (direction.to.placeId) {
                    placesToPromote.push(direction.to.placeId);
                }
                this.map.addPromotedPlaces(placesToPromote);
                this.map.addMarker(direction.to);
                
                this.map.footerDirections.displayStats(direction)
            })
        } else {
            this.map.removeDirection()
            this._direction = null
            this.map.footerDirections.hide()
        }
    }
    
    private extractQuery(o: any): any {
        if (isObject(o)) {
            if (o.location) {
                return {
                    lat: latitude(o.location),
                    lon: longitude(o.location),
                    floor: o.floor,
                    venueId: o.venueId || this._currentVenue._id
                };
            } else if (o.objectClass === 'place') {
                return {placeId: o._id};
            } else if (o.objectClass === 'placeList') {
                return {placeListId: o._id};
            } else if (o.objectClass === 'userPosition') {
                const userPosition = this.map.getUserPosition();
                return {
                    lat: latitude(userPosition),
                    lon: longitude(userPosition),
                    floor: userPosition.floor,
                    venueId: userPosition.venueId || this._currentVenue._id
                };
            } else if (isFinite(latitude(o)) && isFinite(longitude(o))) {
                return {
                    lat: latitude(o),
                    lon: longitude(o),
                    floor: o.floor,
                    venueId: o.venueId || this._currentVenue._id
                };
            } else if (o.geometry) {
                // Google address result case
                return {
                    lat: latitude(o.geometry.location),
                    lon: longitude(o.geometry.location),
                    floor: 0,
                    venueId: o.venueId || this._currentVenue._id
                };
            } else {
                console.error('Unexpected object content', o)
            }
        }
        return null;
    }
}