import * as $ from 'jquery';
import { isObject, get, set } from 'lodash'
import { Api } from 'mapwize'

const directionsHtml = require('./directions.html')

import { DefaultControl } from '../../control'
import { getTranslation, latitude, longitude, replaceColorInBase64svg } from '../../utils'


export class SearchDirections extends DefaultControl {
    
    private _currentVenue: any
    private _hideResultsTimeout: any
    
    private _from: any
    private _to: any
    private _accessible: boolean
    private _direction: any
    
    
    constructor (mapInstance: any, options: any) {
        super(mapInstance)

        this._container = $(directionsHtml)
        this._currentVenue = this.map.getVenue()
        this._from = this._to = null
        this._accessible = false

        this.mainColor(options)

        if(options.hideMenu){
            this._container.find('#mwz-menuButton').addClass('d-none')
        }

        if (this._currentVenue) {
            const lang = this.map.getLanguageForVenue(this._currentVenue)
            this._container.find('.mwz-venue-name').text(getTranslation(this._currentVenue, lang, 'title'))
        }
        
        this.listen('click', '#mwz-close-button', () => {
            this.clear()
            $("#alert").hide()
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

        this.listen('click', '#alertClose', () => {
            $("#alert").hide()
        })

        this.onVenueWillEnter = this.onVenueWillEnter.bind(this)
        this.onVenueEnter = this.onVenueEnter.bind(this)
        this.onVenueExit = this.onVenueExit.bind(this)
        this.onClick = this.onClick.bind(this)
        
        this.map.on('mapwize:venuewillenter', this.onVenueWillEnter)
        this.map.on('mapwize:venueenter', this.onVenueEnter)
        this.map.on('mapwize:venueexit', this.onVenueExit)
        this.map.on('mapwize:click', this.onClick)
    }

    public mainColor(options: any) {
        if (options.mainColor) {
            const crossIconB64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDk2IDk2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA5NiA5NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHR5cGU9InRleHQvY3NzIj4uc3Qxe2ZpbGw6IzAwMDAwMDt9PC9zdHlsZT48cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9Ijc1LjYsMjYgNjkuOSwyMC40IDQ4LDQyLjMgMjYsMjAuNCAyMC40LDI2IDQyLjMsNDggMjAuNCw3MCAyNiw3NS42IDQ4LDUzLjcgNjkuOSw3NS42IDc1LjYsNzAgNTMuNiw0OCAiLz48L3N2Zz4='
            const menuIconB64 = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYWxxdWVfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDIyLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsMjQuMywxNi45LDIyLjksMTguNiwyMi45eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDQ2LjVoNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNDcuOSwxNi45LDQ2LjUsMTguNiw0Ni41eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDcwLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNzIuMywxNi45LDcwLjksMTguNiw3MC45eiIvPjwvZz48L2c+PC9zdmc+';
            this._container.find('#mwz-close-button img').attr('src', replaceColorInBase64svg(crossIconB64, options.mainColor))
            this._container.find('#mwz-menuButton img').attr('src', replaceColorInBase64svg(menuIconB64, options.mainColor))
        }
    }

    public destroy() {
        this.map.off('mapwize:venuewillenter', this.onVenueWillEnter)
        this.map.off('mapwize:venueenter', this.onVenueEnter)
        this.map.off('mapwize:venueexit', this.onVenueExit)
        this.map.off('mapwize:click', this.onClick)
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
    
    private onVenueWillEnter(e: any): void {
        this._currentVenue = e.venue
            
            const lang = this.map.getLanguageForVenue(e.venue)
            this._container.find('.mwz-venue-name').text(getTranslation(e.venue, lang, 'title'))
    }
    private onVenueEnter(e: any): void {
        if (this._direction) {
            if (get(this._from, 'venueId') !== e.venue._id || get(this._to, 'venueId') !== e.venue._id) {
                this.clear()
            } else {
                this._displayDirection({ preventFitBounds: true })
                this.show()
            }
        }
    }
    private onVenueExit(e: any): void {
        if (!this._direction) {
            this.clear()
        }
        
        this._currentVenue = null;
    }
    private onClick(e: any): void {
        if (e.place && $(this.map._container).hasClass('mwz-directions')) {
            if (!this.extractQuery(this._from)) {
                this._setFrom(set(e.place, 'objectClass', 'place'));
                this._container.find('#mwz-mapwizeSearchFrom').val(this.getDisplay(this._from))
            } else if (!this.extractQuery(this._to)) {
                this._setTo(set(e.place, 'objectClass', 'place'));
                this._container.find('#mwz-mapwizeSearchTo').val(this.getDisplay(this._to))
            }
        }
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
            }).catch(function() {

                $("#alert").show()
                setTimeout(function(){
                    $("#alert").hide()
                }, 5000)

              });
    
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
