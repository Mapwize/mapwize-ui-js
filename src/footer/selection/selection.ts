import * as $ from 'jquery';
import { isFunction, get, set, forEach } from 'lodash'

const selectionHtml = require('./selection.html')

import { DefaultControl } from '../../control'
import { getTranslation, getIcon, DEFAULT_PLACE_ICON, replaceColorInBase64svg } from '../../utils'

export class FooterSelection extends DefaultControl {
    
    private _currentVenue: any
    private _selected: any
    private _options: any
    
    constructor (mapInstance: any, options: any) {
        super(mapInstance)
        
        this._options = options
        this._selected = null
        this._container = $(selectionHtml)
        this._currentVenue = this.map.getVenue()
        
        this.mainColor()
        
        this.listen('click', '#mwz-footerSelection', (e: JQueryEventObject) => {
            if (isFunction(options.onInformationButtonClick)) {
                options.onInformationButtonClick(this._selected)
            }
        })
        
        this.listen('click', '#mwz-footerSelection .mwz-directionsButton', (e: JQueryEventObject) => {
            this.map.searchDirections.show()
            
            e.stopPropagation()
        })

        this.onClick = this.onClick.bind(this)
        this.onVenueEnter = this.onVenueEnter.bind(this)
        this.onVenueExit = this.onVenueExit.bind(this)
        
        this.map.on('mapwize:click', this.onClick)
        this.map.on('mapwize:venueenter', this.onVenueEnter)
        this.map.on('mapwize:venueexit', this.onVenueExit)
    }
    public mainColor(){
        if (this._options.mainColor) {
            const directionIconB64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYWxxdWVfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAgMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggY2xhc3M9InN0MSIgZD0iTTI4LjYsMTRMMTYsMS40Yy0wLjYtMC42LTEuNC0wLjYtMiwwTDEuNCwxNGMtMC42LDAuNi0wLjYsMS40LDAsMkwxNCwyOC42YzAuNiwwLjYsMS40LDAuNiwyLDBMMjguNiwxNiAgQzI5LjEsMTUuNCwyOS4xLDE0LjYsMjguNiwxNHogTTIyLDEzLjlsLTMuOSwzLjdjLTAuMiwwLjItMC41LDAtMC41LTAuMnYtMi4yYzAtMC4yLTAuMS0wLjMtMC4zLTAuM2gtNC41Yy0wLjIsMC0wLjMsMC4xLTAuMywwLjMgIHYzLjJjMCwwLjItMC4xLDAuMy0wLjMsMC4zaC0xLjljLTAuMiwwLTAuMy0wLjEtMC4zLTAuM3YtNC41YzAtMC45LDAuNy0xLjYsMS42LTEuNmg1LjhjMC4yLDAsMC4zLTAuMSwwLjMtMC4zdi0yICBjMC0wLjMsMC4zLTAuNCwwLjUtMC4ybDMuOCwzLjhDMjIuMSwxMy42LDIyLjEsMTMuOCwyMiwxMy45eiIgc3R5bGU9IiYjMTA7ICAgIC8qIGNvbG9yOiAgcmVkOyAqLyYjMTA7Ii8+PC9zdmc+'
            this._container.find('#mwz-directionsButton img').attr('src', replaceColorInBase64svg(directionIconB64, this._options.mainColor))
        }
    }

    public destroy() {
        this.map.off('mapwize:click', this.onClick)
        this.map.off('mapwize:venueenter', this.onVenueEnter)
        this.map.off('mapwize:venueexit', this.onVenueExit)
    }
    
    public show () {
        this._container.removeClass('d-none').addClass('d-flex')
        $(this.map._container).addClass('mwz-selected')
        
        this.map.footerVenue.hide()
    }
    public hide () {
        this._container.removeClass('d-flex').addClass('d-none')
        $(this.map._container).removeClass('mwz-selected')
        
        this.map.footerVenue.showIfNeeded()
    }
    public select(obj: any) {
        if (!obj) {
            return this.unselect()
        }

        this._selected = obj

        const s = 'a<br>b'
        var parser = new DOMParser()
        var el = parser.parseFromString(s, "text/xml");

        const lang = this.map.getLanguage()
        $(this._container).find('.mwz-title').text(getTranslation(obj, lang, 'title'))
        $(this._container).find('.mwz-subtitle').text(getTranslation(obj, lang, 'subtitle'))
        $(this._container).find('.mwz-details').html(getTranslation(obj, lang, 'details'))
        $(this._container).find('.mwz-icon img').attr('src', getIcon(obj))
        
        this.map.removeMarkers()
        
        if (get(this._selected, 'venueId')) {
            this.map.removePromotedPlacesForVenue(get(this._selected, 'venueId', null)).then(() => this._promoteSelected(this._selected));
        } else {
            this._promoteSelected(this._selected);
        }
        
        if (this._currentVenue) {
            this.show()
        }
    }
    public getSelected() {
        return this._selected
    }
    public unselect() {
        if (this._selected) {
            this.hide()
            
            this.map.removePromotedPlacesForVenue(get(this._selected, 'venueId', null))
            this.map.removeMarkers()
            
            this._selected = null
            
            $(this._container).find('.mwz-title').text('')
            $(this._container).find('.mwz-subtitle').text('')
            $(this._container).find('.mwz-icon img').attr('src', DEFAULT_PLACE_ICON)
        }
    }
    
    private onClick(e: any): void {
        if (e.place && !$(this.map._container).hasClass('mwz-directions')) {
            this.select(set(e.place, 'objectClass', 'place'))
        } else {
            this.unselect()
        }
    }
    private onVenueEnter(e: any): void {
        this._currentVenue = e.venue
        
        if (this._selected && this._selected.venueId === this._currentVenue._id) {
            this.show()
        } else {
            this.unselect()
        }
    }
    private onVenueExit(e: any): void {
        this.hide()
        this.unselect()
        
        this._currentVenue = null
    }
    private _promoteSelected (elem: any) {
        if (elem) {
            const placesToPromote: any[] = [];
            if (elem.objectClass === 'place') {
                this.map.addMarkerOnPlace(elem);
                placesToPromote.push(elem._id);
            } else if (elem.objectClass === 'placeList') {
                forEach(elem.placeIds, placeId => {
                    this.map.addMarkerOnPlace(placeId);
                    placesToPromote.push(placeId);
                });
            } else {
                console.error('unknown "objectClass" attribute for:', elem)
            }
            this.map.addPromotedPlaces(placesToPromote);
        }
    }
}