import * as $ from 'jquery';
import { isObject, get, set, forEach } from 'lodash'
import { Api } from 'mapwize'

const directionsHtml = require('./directions.html')

import { DefaultControl } from '../../control'
import { getTranslation, latitude, longitude, replaceColorInBase64svg } from '../../utils'


export class SearchDirections extends DefaultControl {
    
    private _currentVenue: any
    private _hideResultsTimeout: any
    
    private _from: any
    private _to: any
    private _wayPoint: any[]
    private _accessible: boolean
    private _direction: any
    
    constructor(mapInstance: any, options: any) {
        super(mapInstance)
        
        this._container = $(directionsHtml)
        this._currentVenue = this.map.getVenue()
        this._from = this._to = null
        this._accessible = false
        this._wayPoint = []
        
        this.mainColor(options)
        
        this._container.find('#mwz-direction-add-waypoints').hide()
        if (options.hideMenu) {
            this._container.find('#mwz-menuButton').addClass('d-none')
        }
        
        if (this._currentVenue) {
            const lang = this.map.getLanguageForVenue(this._currentVenue)
            this._container.find('.mwz-venue-name').text(getTranslation(this._currentVenue, lang, 'title'))
        }
        
        this.listen('click', '#mwz-close-button', () => {
            this.clear()
            this._container.find("#mwz-alert-noDirection").hide()
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
            // if(this._container.find('#mwz-mapwizeSearchFrom').val() == "Coordinates"){
            //     this._container.find('#mwz-mapwizeSearchFrom').val("")
            //     this._setFrom(null)
            // }
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
                if (this._container.find('#mwz-mapwizeSearchFrom').val() != "Coordinates") {
                    this._container.find('#mwz-mapwizeSearchFrom').val(this.getDisplay(this._from))
                }
                this.map.searchResults.hide()
            }, 500)
        })
        
        this.listen('focus', '#mwz-mapwizeSearchTo', () => {
            // if(this._container.find('#mwz-mapwizeSearchTo').val() == "Coordinates"){
            //     this._container.find('#mwz-mapwizeSearchTo').val("")
            //     this._setTo(null)
            // }
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
        
        this.listen('focus', '.mwz-mapwizeSearchWayPoint:last', () => {
            this.map.searchResults.setFocusOn('waypoint')
            
            clearTimeout(this._hideResultsTimeout)
            
            const str = this._container.find('.mwz-mapwizeSearchWayPoint:last').val() + ''
            if (str) {
                this.map.searchResults.search(str, () => {
                    return this._setWayPoint.bind(this)
                }).then(() => {
                    this.map.searchResults.show()
                })
            } else {
                this.map.searchResults.showMainSearchIfAny(this._setWayPoint.bind(this))
            }
        })
        
        this.listen('keyup', '.mwz-mapwizeSearchWayPoint:last', () => {
            const str = this._container.find('.mwz-mapwizeSearchWayPoint:last').val() + ''
            if (str) {
                this.map.searchResults.search(str, () => {
                    return this._setWayPoint.bind(this)
                }).then(() => {
                    this.map.searchResults.show()
                })
            } else if (this._currentVenue) {
                this.map.searchResults.showMainSearchIfAny(this._setWayPoint.bind(this))
            } else {
                this.map.searchResults.hide()
            }
        })
        
        this.listen('blur', '#mwz-mapwizeSearchTo', () => {
            this._hideResultsTimeout = setTimeout(() => {
                if (this._container.find('#mwz-mapwizeSearchTo').val() != "Coordinates") {
                    this._container.find('#mwz-mapwizeSearchTo').val(this.getDisplay(this._to))
                }
                this.map.searchResults.hide()
            }, 500)
        })
        
        this.listen('blur', '.mwz-mapwizeSearchWayPoint:last', () => {
            this._hideResultsTimeout = setTimeout(() => {
                if (this._container.find('.mwz-mapwizeSearchWayPoint:last').val() != "Coordinates") {
                    this._container.find('.mwz-mapwizeSearchWayPoint:last').val(this.getDisplay(this._wayPoint[this._wayPoint.length - 1]))
                }
                this.map.searchResults.hide()
            }, 500)
        })
        
        this.listen('click', '#mwz-direction-add-waypoints', () => {
            if (!$(this.map._container).hasClass('mwz-small') && this._container.find('.mwz-mapwizeSearchWayPoint').length < 6) {
                this.addDestination()
            } else if (this._container.find('.mwz-mapwizeSearchWayPoint').length < 2) {
                this.addDestination()
            }
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
    
    public addDestination() {
        
        const label = $('<label id="mwz-waypoint-id-' + this._wayPoint.length + '" class="mwz-searchLine d-flex align-items-center">' +
        '<div class="mwz-icon text-secondary">' +
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAADJklEQVR4AezZA6wkSxQG4P/ZtrWYpG9mus4fP4bPXm+0tm1Ga8b2xlpGa9u2zet7e+2dqZ65XdU1SX8nTio5fw1KiFYikUgkEvxGWnKqrJAKBrdLyrlSpkhLqQe31XtBteZOBtlLtqk23vNwkfcq+/AkgxB1nH3Sr8Al6VfUAJ5jkEeduTHiZbgh48lBBvmXHMx4iJ/8yVIGBVap/Il4STupYVB43RjdCfFRbRjUvVQbxMP/Wz/74T4F/2/YxxRLGURUpUxZX7K4i0GEtaveC7BJjWIQbclI2FPymZRHHqC85DPYIpMYRF8yyd6up9REAF5u+BpskC4MzJR0gQ2yKVQ7h2W8+tF/80b9JON5ONSYzTDP+1DfiFyR//AUHvSU/CdX9CNT78A0aaL/P1EZPIHv6/+7pAlM40Tt3qYjspAODvwTyTxNE4fwNLJ5WndykHkwjfs0LQxGDjJYE38/TNMeHQU5ZJRm9DmYJrW5W6j3OnKo97puaw3TWGoyAEthmm5Jyijk4Pu65Q+mcYOmhUHIgYM0ozfANJmj/Rt9Ftk8y0O5R8tcmCZjC1/IVEfdWBlr4R5Iv5Wg4Ako+q2EhXui9PthNnP859HNHP8Js5njuzBPNobbTnOC+oHv8t3w22nZCBtkpL4Vpw/2vm8qgO/DDjloZP4PwhYZbCTAYNiSeodVkQeo8t6GPTIr8vmfBZvUD1EHUD/CLi6NdP6XwTb5JdIAv8A+WRNZgHWIg/o1sgXsN8SD8yMJsABxkXqsrnP71VIPGk6/FMhkxKnhazxRpwAnvFcRL9WoTstXI2jFfMzX3IS6gJ+ztMDX4c/hBulZ0Pz3hDOe4rq8A2zAU3CHpFmZV/uVKgO3qKH5BFBD4ZynZW3Y9mUtnoZ7+A3LQgUo4zdwE1uECtAC7pKZuvZlJlzG57gqZ4BVfA5uK/lMzmed/QvpT+E+/q45eblPJj9x/qegaDwjix4LsATPoHh4bz/yGnbIexvFhan7P2Y5zxSKD79j2Z2V9zsUJ/7Oqhv1O4oX+7IvXJBIJBjYLbcCJAGSAEmAJEASIJG4vmEJRsEoGAUAvFKa18Rc8u4AAAAASUVORK5CYII=" alt="To" />' +
        '</div>' +
        '<div class="mwz-search flex-grow-1">' +
        '<input type="text" class="form-control mwz-mapwizeSearchWayPoint" placeholder="To" autocomplete="off" />' +
        '</div>' +
        '<div class="mwz-button-icon">' +
        '<button type="button" class="btn btn-link mwz-close-waypoint">' +
        '<img class="d-none d-inline" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABZUlEQVR4Ae2agWYDQRRFBxCxHxEAFsY8CwsW+r9pAdWgAvmdCttVmJJiIEzFO55wz/zAOWRj5s0kIYQQQgghhBBC/I9xsPc8JYA8lY9xSCy2t4vVcs0ToH+1ahfbs/pnq1Z9E5r+bZ2xhMPuT78lAPq3hMMO0S8nq1a9E5p+W+UEJNjRalstwVW/rWPyJi9l80/I8z39suUlNfCE+XF9W7v6fIKtecb1+QRcn0/A9fkEXJ9PwPXjE/JyT99WQB8Q6Yc7AH6IqD6fgOrzCag+n4Dq8wmYPp/gsAmMTsgvDtvwyAT7idR3OJzw+sxsgdfnE3h9PoHS5xMA/fgA+6IC9BMCPmL9jQL6fAKgXzb7jkxwmHF2ZqraTutAwx8pdaiPH6tosBU/WtRwN368rguO2CsmXfLFX7Pqott3xhmQUN589TsJr8/03GbuP7fRg6foJ2d69NcYh/IZ/+xSCCGEEEIIIYQQvw2UKo1mqKrvAAAAAElFTkSuQmCC" alt="Toggle accessible" />' +
        '</button>' +
        '</div>' +
        '</label>')
        
        this._container.find('#mwz-direction-add-waypoints').before(label)
        
        label.find('.mwz-close-waypoint').on('click', () => {
            label.remove()
            this.removeWayPoint(label[0].id)
        })
        
        this._container.find('.mwz-mapwizeSearchWayPoint:last').focus();
        this._container.find('#mwz-direction-add-waypoints').hide().removeClass('d-flex')
    }
    
    public removeWayPoint(id: any) {
        var position = id.split('-')[3];
        
        delete this._wayPoint[position];
        this._displayDirection()
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
    
    public show() {
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
    public hide() {
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
            } else if (this._container.find('.mwz-mapwizeSearchWayPoint').length > this._wayPoint.filter(word => word != undefined).length) {
                this._setWayPoint(set(e.place, 'objectClass', 'place'));
                this._container.find('.mwz-mapwizeSearchWayPoint:last').val(this.getDisplay(this._wayPoint[this._wayPoint.length - 1]))
            }
        } else if ($(this.map._container).hasClass('mwz-directions')) {
            if (!this.extractQuery(this._from)) {
                this._setFrom({ lng: e.lngLat.lng, lat: e.lngLat.lat, floor: e.floor });
                this._container.find('#mwz-mapwizeSearchFrom').val("Coordinates");
            } else if (!this.extractQuery(this._to)) {
                this._setTo({ lng: e.lngLat.lng, lat: e.lngLat.lat, floor: e.floor });
                this._container.find('#mwz-mapwizeSearchTo').val("Coordinates");
            } else if (this._container.find('.mwz-mapwizeSearchWayPoint').length > this._wayPoint.filter(word => word != undefined).length) {
                this._setWayPoint({ lng: e.lngLat.lng, lat: e.lngLat.lat, floor: e.floor });
                this._container.find('.mwz-mapwizeSearchWayPoint:last').val("Coordinates");
            }
        }
    }
    private clear(): void {
        this._setFrom(null)
        this._setTo(null)
        
        this._direction = null
        this._container.find('#mwz-mapwizeSearchFrom').val('')
        this._container.find('#mwz-mapwizeSearchTo').val('')
        this._container.find('#mwz-direction-add-waypoints').removeClass('d-flex').hide()
        
        this._container.find('label').each(function (index) {
            if ($(this)[0].id.includes('mwz-waypoint-id')) {
                $(this).remove()
            }
        });
        
        this._wayPoint = []
    }
    private _setFrom(from: any): void {
        this._from = from
        
        this._displayDirection()
    }
    private _setTo(to: any): void {
        this._to = to
        
        this._displayDirection()
    }
    
    private _setWayPoint(waypoint: any): void {
        
        this._wayPoint.push(waypoint)
        
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
        
        var wayPoints: any[]
        wayPoints = [];
        
        this._wayPoint.forEach(element => {
            wayPoints.push(this.extractQuery(element));
        });
        
        wayPoints.push(to);
        
        if (from && to) {
            this._container.find("#mwz-alert-noDirection").hide();
            
            if (!$(this.map._container).hasClass('mwz-small') && this._container.find('.mwz-mapwizeSearchWayPoint').length < 6) {
                this._container.find('#mwz-direction-add-waypoints').addClass("d-flex").show()
            } else if (this._container.find('.mwz-mapwizeSearchWayPoint').length < 2) {
                this._container.find('#mwz-direction-add-waypoints').addClass("d-flex").show()
            }
            
            Api.getDirection({
                from: from,
                waypoints: wayPoints,
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
                forEach(direction.waypoints, (waypoint) => {
                    if (waypoint.placeId) {
                        placesToPromote.push(waypoint.placeId);
                    }
                    this.map.addMarker(waypoint);
                })
                if (direction.to.placeId) {
                    placesToPromote.push(direction.to.placeId);
                }
                this.map.addPromotedPlaces(placesToPromote);
                this.map.addMarker(direction.to);
                
                this.map.footerDirections.displayStats(direction)
            }).catch(() => {
                this._container.find("#mwz-alert-noDirection").show();
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
                return { placeId: o._id };
            } else if (o.objectClass === 'placeList') {
                return { placeListId: o._id };
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
