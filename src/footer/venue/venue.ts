import * as $ from 'jquery';
import { forEach, find, get } from 'lodash'

const venueHtml = require('./venue.html')

import { DefaultControl } from '../../control'

export class FooterVenue extends DefaultControl {

    private _currentVenue: any
    
    constructor (mapInstance: any) {
        super(mapInstance)

        this._container = $(venueHtml)
        this._currentVenue = this.map.getVenue()

        this.listen('change', '#universes-selector select', (e: JQueryEventObject) => {
            const selectedId = this._container.find('#universes-selector select').val()
            const selectedUniverse = find(this._currentVenue.accessibleUniverses, {_id: selectedId})

            this.map.setUniverse(selectedUniverse)
        })

        this.listen('change', '#language-selector select', (e: JQueryEventObject) => {
            this.map.setLanguage(this._container.find('#language-selector select').val())
        })

        this.onVenueEnter = this.onVenueEnter.bind(this)
        this.onVenueRefresh = this.onVenueRefresh.bind(this)
        this.onVenueExit = this.onVenueExit.bind(this)

        this.map.on('mapwize:venueenter', this.onVenueEnter)
        this.map.on('mapwize:venuerefresh', this.onVenueRefresh)
        this.map.on('mapwize:venueexit', this.onVenueExit)
    }
    public destroy() {
        this.map.off('mapwize:venueenter', this.onVenueEnter)
        this.map.off('mapwize:venuerefresh', this.onVenueRefresh)
        this.map.off('mapwize:venueexit', this.onVenueExit)
    }

    public show () {
        this._container.removeClass('d-none').addClass('d-flex')
        $(this.map._container).addClass('mwz-venue-footer')
    }
    public hide () {
        this._container.removeClass('d-flex').addClass('d-none')
        $(this.map._container).removeClass('mwz-venue-footer')
    }
    public showIfNeeded() {
        let display = false
        this._container.find('#universes-selector select').removeClass('separator')

        const actualUniverse = this.map.getUniverse()
        this._currentVenue = this.map.getVenue()

        if (!this._currentVenue || !actualUniverse || $(this.map._container).hasClass('mwz-selected')) {
            return;
        }

        if (this._currentVenue.accessibleUniverses.length > 1) {
            this._container.find('#universes-selector select').html('')
            forEach(get(this._currentVenue, 'accessibleUniverses'), (universe: any) => {
                this._container.find('#universes-selector select').append('<option value="' + get(universe, '_id') + '" ' + (get(actualUniverse, '_id') === get(universe, '_id') ? 'selected': '') + '>' + get(universe, 'name') + '</option>')
            })
            this._container.find('#universes-selector').show()
            display = true
        } else {
            this._container.find('#universes-selector').hide()
        }

        if (this._currentVenue.supportedLanguages.length > 1) {
            this._container.find('#language-selector select').html('')
            forEach(get(this._currentVenue, 'supportedLanguages'), (language: any) => {
                const actualLanguage = this.map.getLanguage()
                this._container.find('#language-selector select').append('<option value="' + language + '" ' + (actualLanguage === language ? 'selected': '') + '>' + language + '</option>')
            })
            this._container.find('#language-selector').show()

            if (display) {
                this._container.find('#universes-selector select').addClass('separator')
            }

            display = true
        } else {
            this._container.find('#language-selector').hide()
        }
        
        if (display) {
            this.show()
        }
    }

    
    private onVenueEnter(e: any): void {
        this._currentVenue = e.venue
        this.showIfNeeded()
    }
    private onVenueRefresh(e: any): void {
        this._currentVenue = e.venue
        this.showIfNeeded()
    }
    private onVenueExit(e: any): void {
        this.hide()
            
        this._currentVenue = null
    }
}