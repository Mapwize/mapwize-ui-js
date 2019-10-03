import * as $ from 'jquery';
import { forEach, find, get } from 'lodash'

const venueHtml = require('./venue.html')

import { DefaultControl } from '../../control'

export class FooterVenue extends DefaultControl {

    private _currentVenue: any
    constructor(mapInstance: any) {
        super(mapInstance)

        this._container = $(venueHtml)
        this._currentVenue = this.map.getVenue()

        this.listen('change', '#universes-selector select', (e: JQueryEventObject) => {
            const selectedId = this._container.find('#universes-selector select').val()
            const selectedUniverse = find(this._currentVenue.accessibleUniverses, { _id: selectedId })

            this.map.setUniverse(selectedUniverse._id)
        })

        this.listen('change', '#language-selector select', (e: JQueryEventObject) => {
            this.map.setLanguage(this._container.find('#language-selector select').val())

        })

        this._container.find('.dropdown').on("hide.bs.dropdown", (event) => {
            if (this._container.find(event.relatedTarget).attr('id') == "mwz-language-button") {
                this._container.find('.mwz-wrapper-select:first-child').css("border-radius", "50px");
            } else {
                this._container.find('.mwz-wrapper-select:last-child').css("border-radius", "50px");
            }

            if ($(mapInstance._container).hasClass('mwz-small')) {
                if (this._container.find(event.relatedTarget).attr('id') == "mwz-language-button") {

                    this._container.find('.mwz-icon:first-child').css("margin-left", "")
                    this._container.find('#mwz-language-button').css({width: '',color: ''})
                    this._container.css("padding-left", "")
                    this._container.find('.mwz-wrapper-select:last-child').show()

                } else {
                    this._container.find('.mwz-icon:last-child').css("margin-left", "")
                    this._container.find('#mwz-universe-button').css("width", "")
                    this._container.find('.mwz-wrapper-select:first-child').css("margin-right", "")
                }
            }
        });

        this._container.find('.dropdown').on("show.bs.dropdown", (event) => {
            if (this._container.find(event.relatedTarget).attr('id') == "mwz-language-button") {
                this._container.find('.mwz-wrapper-select:first-child').css("border-radius", "0 0 20px 20px");
            } else {
                this._container.find('.mwz-wrapper-select:last-child').css("border-radius", "0 0 20px 20px");
            }

            if ($(mapInstance._container).hasClass('mwz-small')) {
                if (this._container.find(event.relatedTarget).attr('id') == "mwz-language-button") {

                    this._container.find('.mwz-icon:first-child').attr("style", "margin-left: 15px")
                    this._container.attr("style", "padding-left: 5px")
                    this._container.find('#mwz-language-button').attr("style", "width: 70px !important;")
                    this._container.find('.mwz-wrapper-select:last-child').hide()

                } else {
                   this._container.find('.mwz-icon:last-child').attr("style", "margin-left: 58px")
                   this._container.find('.mwz-wrapper-select:first-child').attr("style", "margin-right: 12px;")
                   this._container.find('#mwz-universe-button').attr("style", "width: 170px !important;")
                }
            }

        });

        this.listen('click', '.mwz-universe-item', (e: JQueryEventObject) => {
            this._container.find('#mwz-universe-button').html('<img class="mwz-icon" src="' + this._container.find('.mwz-icon:eq(1)').attr("src") + '"/> ' + $(e.currentTarget).html())
            const selectedId = $(e.currentTarget).data('val')
            const selectedUniverse = find(this._currentVenue.accessibleUniverses, { _id: selectedId })

            this.map.setUniverse(selectedUniverse._id)
        })

        this.listen('click', '.mwz-language-item', (e: JQueryEventObject) => {
            this._container.find('#mwz-language-button').html('<img class="mwz-icon" src="' + this._container.find('.mwz-icon').attr("src") + '"/> ' + $(e.currentTarget).html())
            this.map.setLanguage($(e.currentTarget).html())
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

    public show() {
        this._container.removeClass('d-none').addClass('d-flex')
        $(this.map._container).addClass('mwz-venue-footer')
        this._container.find('#mwz-language-button').html('<img class="mwz-icon" src="' + this._container.find('.mwz-icon').attr("src") + '"/>' + this.map.getLanguage())
    }
    public hide() {
        this._container.removeClass('d-flex').addClass('d-none')
        $(this.map._container).removeClass('mwz-venue-footer')
    }
    public showIfNeeded() {
        let display = false
        this._container.find('#universes-selector select').removeClass('separator')

        const actualUniverse = this.map.getUniverse()
        this._currentVenue = this.map.getVenue()

        if (!this._currentVenue || !actualUniverse || $(this.map._container).hasClass('mwz-selected') || $(this.map._container).hasClass('mwz-directions')) {
            return;
        }

        if (this._currentVenue.accessibleUniverses.length > 1) {
            this._container.find('#universes-selector select').html('')
            this._container.find('.mwz-universe').html('')
            forEach(get(this._currentVenue, 'accessibleUniverses'), (universe: any) => {
                this._container.find('.mwz-universe').append('<a class="dropdown-item mwz-universe-item" data-val=' + get(universe, '_id') + '>' + get(universe, 'name') + '</a>')
            })
            this._container.find('#universes-selector').show()
            display = true
        } else {
            this._container.find('#universes-selector').hide()
        }

        if (this._currentVenue.supportedLanguages.length > 1) {
            this._container.find('#language-selector select').html('')
            this._container.find('.mwz-language').html('')
            forEach(get(this._currentVenue, 'supportedLanguages'), (language: any) => {
                this._container.find('.mwz-language').append('<a class="dropdown-item mwz-language-item" data-val=' + get(language, '_id') + '>' + language + '</a>')
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