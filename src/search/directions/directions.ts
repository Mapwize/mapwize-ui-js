import * as $ from 'jquery';
import { isObject, get, set } from 'lodash'
import { Api } from 'mapwize'

const directionsHtml = require('./directions.html')

import { translate } from '../../translate'
import { DefaultControl } from '../../control'
import { getTranslation, latitude, longitude, replaceColorInBase64svg } from '../../utils'
import { icons } from '../../config'

import { cpus } from 'os';

export class SearchDirections extends DefaultControl {

    private _currentVenue: any
    private _hideResultsTimeout: any

    private _from: any
    private _to: any
    private _modeId: any
    private _direction: any
    private _options: any
    private _lang: any

    constructor(mapInstance: any, options: any) {
        super(mapInstance)

        this._container = $(directionsHtml)
        this._currentVenue = this.map.getVenue()
        this._from = this._to = null
        this._options = options
        this._lang = ''

        this.mainColor(options)

        if (options.hideMenu) {
            this._container.find('#mwz-menuButton').addClass('d-none')
        }

        if (this._currentVenue) {
            this._lang = this.map.getLanguageForVenue(this._currentVenue)
            this._container.find('.mwz-venue-name').text(getTranslation(this._currentVenue, this._lang, 'title'))
        }

        this.listen('click', '#mwz-close-button', () => {
            this.clear()
            this._container.find("#mwz-alert-noDirection").hide()
            this.map.searchBar.show()
            this.map.footerVenue.show()
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

        this.listen('click', '.mwz-accessible-button', (e) => {
            this._modeId = $(e.currentTarget).attr('id')
            this._container.find('.mwz-accessible-button-selected').removeClass('mwz-accessible-button-selected')
            $(e.currentTarget).addClass('mwz-accessible-button-selected')
            this._displayDirection()
        })


        this.listen('focus', '#mwz-mapwizeSearchFrom', () => {
            this._container.find('#mwz-mapwizeSearchFrom').select()
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
                this._container.find('#mwz-mapwizeSearchTo').attr('placeholder', translate('choose_destination'))
            } else {
                this.map.searchResults.hide()
            }
        })
        this.listen('blur', '#mwz-mapwizeSearchFrom', () => {
            this._hideResultsTimeout = setTimeout(() => {
                this._container.find('#mwz-mapwizeSearchFrom').val(this.getDisplay(this._from))
                if (this.getDisplay(this._from)) {
                    this._container.find('#mwz-mapwizeSearchTo').attr('placeholder', translate('choose_destination_or_click_point'))
                }
                this.map.searchResults.hide()
            }, 500)
        })

        this.listen('focus', '#mwz-mapwizeSearchTo', () => {
            this._container.find('#mwz-mapwizeSearchTo').select()
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

        this.onVenueWillEnter = this.onVenueWillEnter.bind(this)
        this.onVenueEnter = this.onVenueEnter.bind(this)
        this.onVenueExit = this.onVenueExit.bind(this)
        this.onClick = this.onClick.bind(this)

        this.map.on('mapwize:venuewillenter', this.onVenueWillEnter)
        this.map.on('mapwize:venueenter', this.onVenueEnter)
        this.map.on('mapwize:venueexit', this.onVenueExit)
        this.map.on('mapwize:click', this.onClick)

        this.refreshLocale()
    }

    public refreshLocale() {
        this._container.find('#mwz-mapwizeSearchFrom').val(this.getDisplay(this._from))
        this._container.find('#mwz-mapwizeSearchTo').val(this.getDisplay(this._to))

        if (this._from == null && this._to == null || this._to != null) {
            this._container.find('#mwz-mapwizeSearchFrom').attr('placeholder', translate('choose_starting_or_click_point'))
            this._container.find('#mwz-mapwizeSearchTo').attr('placeholder', translate('choose_destination'))
        } else {
            this._container.find('#mwz-mapwizeSearchFrom').attr('placeholder', translate('choose_starting_or_click_point'))
            this._container.find('#mwz-mapwizeSearchTo').attr('placeholder', translate('choose_destination_or_click_point'))
        }
    }

    public mainColor(options: any) {

        const crossIconB64 = 'TTE5IDEzdi0yYy0xLjU0LjAyLTMuMDktLjc1LTQuMDctMS44M2wtMS4yOS0xLjQzYy0uMTctLjE5LS4zOC0uMzQtLjYxLS40NS0uMDEgMC0uMDEtLjAxLS4wMi0uMDFIMTNjLS4zNS0uMi0uNzUtLjMtMS4xOS0uMjZDMTAuNzYgNy4xMSAxMCA4LjA0IDEwIDkuMDlWMTVjMCAxLjEuOSAyIDIgMmg1djVoMnYtNS41YzAtMS4xLS45LTItMi0yaC0zdi0zLjQ1YzEuMjkgMS4wNyAzLjI1IDEuOTQgNSAxLjk1em0tNi4xNyA1Yy0uNDEgMS4xNi0xLjUyIDItMi44MyAyLTEuNjYgMC0zLTEuMzQtMy0zIDAtMS4zMS44NC0yLjQxIDItMi44M1YxMi4xYy0yLjI4LjQ2LTQgMi40OC00IDQuOSAwIDIuNzYgMi4yNCA1IDUgNSAyLjQyIDAgNC40NC0xLjcyIDQuOS00aC0yLjA3eg=='
        const handi = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPgo8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMTIiIGN5PSI0IiByPSIyIi8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTE5IDEzdi0yYy0xLjU0LjAyLTMuMDktLjc1LTQuMDctMS44M2wtMS4yOS0xLjQzYy0uMTctLjE5LS4zOC0uMzQtLjYxLS40NS0uMDEgMC0uMDEtLjAxLS4wMi0uMDFIMTNjLS4zNS0uMi0uNzUtLjMtMS4xOS0uMjZDMTAuNzYgNy4xMSAxMCA4LjA0IDEwIDkuMDlWMTVjMCAxLjEuOSAyIDIgMmg1djVoMnYtNS41YzAtMS4xLS45LTItMi0yaC0zdi0zLjQ1YzEuMjkgMS4wNyAzLjI1IDEuOTQgNSAxLjk1em0tNi4xNyA1Yy0uNDEgMS4xNi0xLjUyIDItMi44MyAyLTEuNjYgMC0zLTEuMzQtMy0zIDAtMS4zMS44NC0yLjQxIDItMi44M1YxMi4xYy0yLjI4LjQ2LTQgMi40OC00IDQuOSAwIDIuNzYgMi4yNCA1IDUgNSAyLjQyIDAgNC40NC0xLjcyIDQuOS00aC0yLjA3eiIvPjwvc3ZnPg==';

        if (options.mainColor) {
            const crossIconB64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDk2IDk2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA5NiA5NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHR5cGU9InRleHQvY3NzIj4uc3Qxe2ZpbGw6IzAwMDAwMDt9PC9zdHlsZT48cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9Ijc1LjYsMjYgNjkuOSwyMC40IDQ4LDQyLjMgMjYsMjAuNCAyMC40LDI2IDQyLjMsNDggMjAuNCw3MCAyNiw3NS42IDQ4LDUzLjcgNjkuOSw3NS42IDc1LjYsNzAgNTMuNiw0OCAiLz48L3N2Zz4='
            const menuIconB64 = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYWxxdWVfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDIyLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsMjQuMywxNi45LDIyLjksMTguNiwyMi45eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDQ2LjVoNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNDcuOSwxNi45LDQ2LjUsMTguNiw0Ni41eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDcwLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNzIuMywxNi45LDcwLjksMTguNiw3MC45eiIvPjwvZz48L2c+PC9zdmc+';
            this._container.find('#mwz-close-button img').attr('src', replaceColorInBase64svg(crossIconB64, options.mainColor))
            this._container.find('#mwz-menuButton img').attr('src', replaceColorInBase64svg(menuIconB64, options.mainColor))
        }
    }

    public launchDirection() {
        if (this._options.hasOwnProperty('direction') && this._options.direction.hasOwnProperty('from') && this._options.direction.hasOwnProperty('to')) {
            this.show();

            return Promise.all([
                this._map.getPlace(this._options.direction.from),
                this._map.getPlace(this._options.direction.to)
            ]).then((objects: any) => {
                var [from, to] = objects;
                this._container.find('#mwz-mapwizeSearchFrom').val(this.getDisplay(from));
                this._setFrom(set(from, 'objectClass', 'place'));

                this._container.find('#mwz-mapwizeSearchTo').val(this.getDisplay(to));
                this._setTo(set(to, 'objectClass', 'place'));
            }).catch(() => {
                this._container.find("#mwz-alert-noDirection").show();
            });
        }
    }

    public destroy() {
        this.map.off('mapwize:venuewillenter', this.onVenueWillEnter)
        this.map.off('mapwize:venueenter', this.onVenueEnter)
        this.map.off('mapwize:venueexit', this.onVenueExit)
        this.map.off('mapwize:click', this.onClick)
    }

    public show() {
        if (this._currentVenue) {
            this.map.searchBar.hide()

            if (this.map.footerSelection.getSelected()) {
                this._setTo(this.map.footerSelection.getSelected())
                this._container.find('#mwz-mapwizeSearchTo').val(this.getDisplay(this._to))
            }

            this.map.footerSelection.unselect()
            this.map.footerVenue.hide()

            this.map.addControl(this, 'top-left')
            $(this.map._container).addClass('mwz-directions')
            this._container.find("#mwz-mapwizeSearchFrom").focus()
            this.setAvailablesModes(this.map.getModes())
        }
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
        this.launchDirection()
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
                this._container.find('#mwz-mapwizeSearchTo').attr('placeholder', translate('choose_destination_or_click_point'))
            } else if (!this.extractQuery(this._to)) {
                this._setTo(set(e.place, 'objectClass', 'place'));
                this._container.find('#mwz-mapwizeSearchTo').val(this.getDisplay(this._to))
            }
        } else if ($(this.map._container).hasClass('mwz-directions')) {
            if (!this._from) {
                this._setFrom({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, floor: e.floor });
                this._container.find('#mwz-mapwizeSearchFrom').val(translate('coordinates'));
            } else if (!this._to) {
                this._setTo({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, floor: e.floor });
                this._container.find('#mwz-mapwizeSearchTo').val(translate('coordinates'));
            }
        }
    }
    private setAvailablesModes(modes: any) {
        $('.mwz-accessibleLine').empty()
        _.forEach(modes, (mode,i) => {
            var selected = "";
            if(i == 0){
                selected = " mwz-accessible-button-selected";
            }
            var button = '<div class="mwz-button-icon">'
                + '<button type="button" id="'+mode._id+'" class="btn btn-link mwz-accessible-button'+selected+'">'
                + '<img src="'+icons[mode.type]+'" alt="'+mode.name+'" />'
                + '</button>'
                + '</div><div class="mwz-accessible-separator"></div>'
            $('.mwz-accessibleLine').append(button)
        })
    }
    private clear(): void {
        this._setFrom(null)
        this._setTo(null)
        this._direction = null
        this._container.find('#mwz-mapwizeSearchFrom').val('')
        this._container.find('#mwz-mapwizeSearchTo').val('')
        this._container.find('#mwz-mapwizeSearchTo').attr('placeholder', translate('choose_destination'))
    }
    public getDirection(): any {
        return this._direction;
    }
    public setFrom(from: any): void {
        this._container.find('#mwz-mapwizeSearchFrom').val(this.getDisplay(from))

        this._setFrom(from);
    }
    private _setFrom(from: any): void {
        this._from = from

        this._displayDirection()
    }
    public setTo(to: any): void {
        this._container.find('#mwz-mapwizeSearchTo').val(this.getDisplay(to))
        this._setTo(to);
    }
    private _setTo(to: any): void {
        this._to = to

        this._displayDirection()
    }

    private getDisplay(o: any): string {
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

    private _displayDirection(options?: any) {
        this.map.removeMarkers();

        const from = this.extractQuery(this._from)
        const to = this.extractQuery(this._to)

        if (from && to) {
            this._container.find("#mwz-alert-noDirection").hide();

            Api.getDirection({
                from: from,
                to: to,
                modeId:this._modeId
            }).then((direction: any) => {
                this._direction = direction
                direction.modeId = this._modeId
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
