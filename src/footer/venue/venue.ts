import * as $ from 'jquery';
import { forEach, find } from 'lodash'

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

        this.map.on('mapwize:venueexit', (e: any) => {
            this.hide()
            
            this._currentVenue = null
        })
        this.map.on('mapwize:venueenter', (e: any) => {
            this._currentVenue = e.venue
            this.showIfNeeded()
        })
        this.map.on('mapwize:venuerefresh', (e: any) => {
            this._currentVenue = e.venue
            this.showIfNeeded()
        })
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

        if (!this._currentVenue || !actualUniverse || $(this.map._container).hasClass('mwz-selected')) {
            return;
        }

        if (this._currentVenue.accessibleUniverses.length > 1) {
            this._container.find('#universes-selector select').html('')
            forEach(this._currentVenue.accessibleUniverses, (universe: any) => {
                this._container.find('#universes-selector select').append('<option value="' + universe._id + '" ' + (actualUniverse._id === universe._id ? 'selected': '') + '>' + universe.name + '</option>')
            })
            this._container.find('#universes-selector').show()
            display = true
        } else {
            this._container.find('#universes-selector').hide()
        }

        if (this._currentVenue.supportedLanguages.length > 1) {
            this._container.find('#language-selector select').html('')
            forEach(this._currentVenue.supportedLanguages, (language: any) => {
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
}