import * as $ from 'jquery'
import { find, forEach, get, template } from 'lodash'

const venueTemplate = template(require('./venue.html'))

import { DefaultControl } from '../../control'

export class FooterVenue extends DefaultControl {
  
  private _currentVenue: any
  constructor (mapInstance: any) {
    super(mapInstance)
    
    this._container = $('<div />')
    this._currentVenue = this.map.getVenue()
    
    // this._container.find('.dropdown').on("hide.bs.dropdown", (event) => {
    //   if (this._container.find(event.relatedTarget).attr('id') == "mwz-language-button") {
    //     this._container.find('.mwz-wrapper-select:first-child').css("border-radius", "50px");
    //   } else {
    //     this._container.find('.mwz-wrapper-select:last-child').css("border-radius", "50px");
    //   }
      
    //   if ($(mapInstance._container).hasClass('mwz-small')) {
    //     if (this._container.find(event.relatedTarget).attr('id') == "mwz-language-button") {
          
    //       this._container.find('.mwz-icon:first-child').css("margin-left", "")
    //       this._container.find('#mwz-language-button').css({width: '',color: ''})
    //       this._container.css("padding-left", "")
    //       this._container.find('.mwz-wrapper-select:last-child').show()
          
    //     } else {
    //       this._container.find('.mwz-icon:last-child').css("margin-left", "")
    //       this._container.find('#mwz-universe-button').css("width", "")
    //       this._container.find('.mwz-wrapper-select:first-child').css("margin-right", "")
    //     }
    //   }
    // });
    
    // this._container.find('.dropdown').on("show.bs.dropdown", (event) => {
    //   if (this._container.find(event.relatedTarget).attr('id') == "mwz-language-button") {
    //     this._container.find('.mwz-wrapper-select:first-child').css("border-radius", "0 0 20px 20px");
    //   } else {
    //     this._container.find('.mwz-wrapper-select:last-child').css("border-radius", "0 0 20px 20px");
    //   }
      
    //   if ($(mapInstance._container).hasClass('mwz-small')) {
    //     if (this._container.find(event.relatedTarget).attr('id') == "mwz-language-button") {
          
    //       this._container.find('.mwz-icon:first-child').attr("style", "margin-left: 15px")
    //       this._container.attr("style", "padding-left: 5px")
    //       this._container.find('#mwz-language-button').attr("style", "width: 70px !important;")
    //       this._container.find('.mwz-wrapper-select:last-child').hide()
          
    //     } else {
    //       this._container.find('.mwz-icon:last-child').attr("style", "margin-left: 58px")
    //       this._container.find('.mwz-wrapper-select:first-child').attr("style", "margin-right: 12px;")
    //       this._container.find('#mwz-universe-button').attr("style", "width: 170px !important;")
    //     }
    //   }
      
    // });
    
    // this.listen('click', '.mwz-universe-item', (e: JQueryEventObject) => {
    //   this._container.find('#mwz-universe-button').html('<img class="mwz-icon" src="' + this._container.find('.mwz-icon:eq(1)').attr("src") + '"/> ' + $(e.currentTarget).html())
    //   const selectedId = $(e.currentTarget).data('val')
    //   const selectedUniverse = find(this._currentVenue.accessibleUniverses, { _id: selectedId })
      
    //   this.map.setUniverse(selectedUniverse._id)
    // })
    
    // this.listen('click', '.mwz-language-item', (e: JQueryEventObject) => {
    //   this._container.find('#mwz-language-button').html('<img class="mwz-icon" src="' + this._container.find('.mwz-icon').attr("src") + '"/> ' + $(e.currentTarget).html())
    //   this.map.setLanguage($(e.currentTarget).html())
    // })
    
    this._onVenueRefresh = this._onVenueRefresh.bind(this)
    this.map.on('mapwize:venuerefresh', this._onVenueRefresh)
  }
  public remove () {
    this.map.off('mapwize:venuerefresh', this._onVenueRefresh)
  }
  
  public getDefaultPosition (): string {
    return 'bottom-left'
  }
  
  public onAdd (map: any) {
    this._map = map
    this.isOnMap = true

    this.initializeControl()
    
    return this._container.get(0)
  }
  
  public needToBeDisplayed (venue: any): boolean {
    return venue.accessibleUniverses.length > 1 || venue.supportedLanguages.length > 1
  }

  // ---------------------------------------
  // Privates methods
  // ---------------------------------------
  
  private initializeControl () {
    const venue = this._map.getVenue()

    this._container.html(venueTemplate({
      currentLanguage: this.map.getLanguage(),
      currentUniverse: this.map.getUniverse(),
      languages: venue.supportedLanguages,
      universes: venue.accessibleUniverses,
    }))
    
    // if (this._currentVenue.accessibleUniverses.length > 1) {
    //   this._container.find('.mwz-universe-dropdown').html('')
    //   forEach(venue.accessibleUniverses, (universe: any): void => {
    //     this._container.find('.mwz-universe-dropdown').append('<a class="dropdown-item mwz-universe-item" data-val=' + get(universe, '_id') + '>' + get(universe, 'name') + '</a>')
    //   })
    // }
    
    // if (this._currentVenue.supportedLanguages.length > 1) {
    //   this._container.find('#language-selector select').html('')
    //   this._container.find('.mwz-language').html('')
    //   forEach(venue.supportedLanguages, (language: any): void => {
    //     this._container.find('.mwz-language').append('<a class="dropdown-item mwz-language-item" data-val=' + get(language, '_id') + '>' + language + '</a>')
    //   })
    //   this._container.find('#language-selector').show()
    // } else {
    //   this._container.find('#language-selector').hide()
    // }
  }
  
  private _onVenueRefresh (e: any): void {
    this.initializeControl()
  }
}
