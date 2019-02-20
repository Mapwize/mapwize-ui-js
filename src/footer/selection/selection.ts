import * as $ from 'jquery';
import { isFunction, get, set, forEach } from 'lodash'

const selectionHtml = require('./selection.html')

import { DefaultControl } from '../../control'
import { getTranslation, getIcon, DEFAULT_PLACE_ICON } from '../../utils'

export class FooterSelection extends DefaultControl {
    
    private _currentVenue: any
    private _selected: any
    
    constructor (mapInstance: any, onInformationButtonClick?: Function) {
        super(mapInstance)
        
        this._selected = null
        this._container = $(selectionHtml)
        this._currentVenue = this.map.getVenue()
        
        this.listen('click', '#mwz-footerSelection', (e: JQueryEventObject) => {
            if (isFunction(onInformationButtonClick)) {
                onInformationButtonClick(this._selected)
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
        
        const lang = this.map.getLanguage()
        $(this._container).find('.mwz-title').text(getTranslation(obj, lang, 'title'))
        $(this._container).find('.mwz-subtitle').text(getTranslation(obj, lang, 'subtitle'))
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