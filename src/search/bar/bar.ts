import * as $ from 'jquery';
import { isFunction } from 'lodash'

const barHtml = require('./bar.html')

import { DefaultControl } from '../../control'
import { getTranslation, replaceColorInBase64svg, getLanguage } from '../../utils'

export class SearchBar extends DefaultControl {

    private _currentVenue: any
    private _hideResultsTimeout: any

    constructor (mapInstance: any, options: any) {
        super(mapInstance)

        this._container = $(barHtml)
        this._currentVenue = this.map.getVenue();

        if(options.hideMenu){
            this._container.find('#menuBar').addClass('d-none')
        }

        this.mainColor(options);

        this.listen('click', '#mwz-menuButton', (e: JQueryEventObject) => {
            if (isFunction(options.onMenuButtonClick)) {
                options.onMenuButtonClick(e)
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

    public mainColor(options: any) {
        if (options.mainColor) {
            const directionIconB64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYWxxdWVfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAgMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggY2xhc3M9InN0MSIgZD0iTTI4LjYsMTRMMTYsMS40Yy0wLjYtMC42LTEuNC0wLjYtMiwwTDEuNCwxNGMtMC42LDAuNi0wLjYsMS40LDAsMkwxNCwyOC42YzAuNiwwLjYsMS40LDAuNiwyLDBMMjguNiwxNiAgQzI5LjEsMTUuNCwyOS4xLDE0LjYsMjguNiwxNHogTTIyLDEzLjlsLTMuOSwzLjdjLTAuMiwwLjItMC41LDAtMC41LTAuMnYtMi4yYzAtMC4yLTAuMS0wLjMtMC4zLTAuM2gtNC41Yy0wLjIsMC0wLjMsMC4xLTAuMywwLjMgIHYzLjJjMCwwLjItMC4xLDAuMy0wLjMsMC4zaC0xLjljLTAuMiwwLTAuMy0wLjEtMC4zLTAuM3YtNC41YzAtMC45LDAuNy0xLjYsMS42LTEuNmg1LjhjMC4yLDAsMC4zLTAuMSwwLjMtMC4zdi0yICBjMC0wLjMsMC4zLTAuNCwwLjUtMC4ybDMuOCwzLjhDMjIuMSwxMy42LDIyLjEsMTMuOCwyMiwxMy45eiIgc3R5bGU9IiYjMTA7ICAgIC8qIGNvbG9yOiAgcmVkOyAqLyYjMTA7Ii8+PC9zdmc+'
            const menuIconB64 = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYWxxdWVfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdHlwZT0idGV4dC9jc3MiPi5zdDF7ZmlsbDojMDAwMDAwO308L3N0eWxlPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDIyLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsMjQuMywxNi45LDIyLjksMTguNiwyMi45eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDQ2LjVoNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNDcuOSwxNi45LDQ2LjUsMTguNiw0Ni41eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOC42LDcwLjloNjIuOGMxLjcsMCwzLjEsMS40LDMuMSwzLjFsMCwwYzAsMS43LTEuNCwzLjEtMy4xLDMuMUgxOC42Yy0xLjcsMC0zLjEtMS40LTMuMS0zLjFsMCwwQzE1LjUsNzIuMywxNi45LDcwLjksMTguNiw3MC45eiIvPjwvZz48L2c+PC9zdmc+';
            this._container.find('#mwz-directionsButton img').attr('src', replaceColorInBase64svg(directionIconB64, options.mainColor))
            this._container.find('#mwz-menuButton img').attr('src', replaceColorInBase64svg(menuIconB64, options.mainColor))
        }
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
        this._container.find('.mwz-search').show().find('input').attr('placeholder', getLanguage('searchIn') + ' '+getTranslation(e.venue, lang, 'title'))
    }
    private onVenueExit(e: any): void {
        this.show()
        
        this._container.find('.mwz-entering').hide()
        this._container.find('.mwz-directions').hide()
        this._container.find('.mwz-search').show().find('input').attr('placeholder', getLanguage('searchIn')+' Mapwize')
        
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