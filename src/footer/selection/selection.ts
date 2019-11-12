import * as $ from 'jquery'
import { isEmpty, isFunction } from 'lodash'

import uiConfig from '../../config'

const selectionHtml = require('./selection.html')

import { DefaultControl } from '../../control'
import { getIcon, getTranslation, replaceColorInBase64svg } from '../../utils'

export class FooterSelection extends DefaultControl {
  
  private _selected: any
  private _selectedHeight: number
  private _options: any
  
  constructor (mapInstance: any, options: any) {
    super(mapInstance)
    this._options = options
    
    this._selected = null
    this._selectedHeight = 0
    
    this._container = $(selectionHtml)
    
    this.listen('click', '#mwz-footer-selection', this._footerClick.bind(this))
    this.listen('click', '#mwz-footer-directions-button', this._directionButtonClick.bind(this))
    
    this.listen('click', '#mwz-footer-selection .mwz-open-details', this._onOpenDetailsClick.bind(this))
    this.listen('click', '#mwz-footer-selection .mwz-close-details', this._onCloseDetailsClick.bind(this))
  }
  
  public remove (): void {
    return null
  }
  
  public getDefaultPosition (): string {
    return 'bottom-left'
  }

  public setSelected (element: any): Promise<void> {
    this.map.removeMarkers()
    
    if (element) {
      this.map.centerOnPlace(element._id)
      this._displaySelectedElementInformations(element)
      this._promoteSelectedElement(element)
    } else {
      $(this.map._container).find('.mapboxgl-ctrl-bottom-right').css('bottom', 0)
      this.map.setPromotedPlaces([])
    }
    return Promise.resolve()
  }
  
  // ---------------------------------------
  // Privates methods
  // ---------------------------------------
  
  private _footerClick (e: JQueryEventObject): void {
    if (isFunction(this._options.onInformationButtonClick)) {
      this._options.onInformationButtonClick(this._selected)
    }
  }
  private _directionButtonClick (e: JQueryEventObject): void {
    e.stopPropagation()
    this._container.find('.mapboxgl-ctrl-bottom-right').css('bottom', 0)

    this._map.headerManager.showDirection()
  }
  
  private _onOpenDetailsClick (e: JQueryEventObject): void {
    e.stopPropagation()

    this._container.addClass('mwz-opened-details')
    
    $(this._container).find('.mwz-close-details').removeClass('d-none').addClass('d-block')
    $(this._container).find('.mwz-open-details').removeClass('d-block').addClass('d-none')
    
    let padding = 20
    if ($(this.map._container).hasClass('mwz-small')) {
      padding = 0
    }
    
    $(this._container).find('.mwz-details').css('max-height', (this.map.getSize().y - padding - $(this._container).find('.mwz-selection-header').height()))
    $(this._container).animate({
      height: (this.map.getSize().y - padding),
    }, 250)
  }
  private _onCloseDetailsClick (e: JQueryEventObject): void {
    e.stopPropagation()
    
    this._container.removeClass('mwz-opened-details')
    
    $(this._container).find('.mwz-open-details').removeClass('d-none').addClass('d-block')
    $(this._container).find('.mwz-close-details').removeClass('d-block').addClass('d-none')
    
    $(this._container).animate({
      height: this._selectedHeight,
    }, 250, () => {
      $(this._container).find('.mwz-details').css('max-height', 120)
    })
  }
  
  private _displaySelectedElementInformations (element: any): void {
    const lastHeight = $(this._container).css('height')
    
    $(this._container).addClass('invisible')
    $(this._container).css('height', 'auto')
    
    const lang = this.map.getLanguage()
    $(this._container).find('.mwz-title').text(getTranslation(element, lang, 'title'))
    $(this._container).find('.mwz-subtitle').text(getTranslation(element, lang, 'subTitle'))
    $(this._container).find('.mwz-icon img').attr('src', getIcon(element))
    
    const details = getTranslation(element, lang, 'details')
    if (!isEmpty(details)) {
      $(this._container).find('.mwz-details').html(details)
    } else {
      $(this._container).find('.mwz-details').html('')
      $(this._container).find('.mwz-open-details').removeClass('d-block').addClass('d-none')
      $(this._container).find('.mwz-close-details').removeClass('d-block').addClass('d-none')
    }
    
    const selected_height = $(this._container).height()
    this._selectedHeight = selected_height < 170 ? selected_height : 170
    
    if (selected_height >= 170) {
      $(this._container).find('.mwz-open-details').removeClass('d-none').addClass('d-block')
      $(this._container).find('.mwz-close-details').removeClass('d-block').addClass('d-none')
    } else {
      $(this._container).find('.mwz-open-details').removeClass('d-block').addClass('d-none')
      $(this._container).find('.mwz-close-details').removeClass('d-block').addClass('d-none')
    }
    
    $(this._container).css('height', lastHeight)
    $(this._container).removeClass('invisible')
    $(this._container).animate({
      height: this._selectedHeight,
    }, 250, () => {
      $(this._container).find('.mwz-details').css('max-height', 120)
    })
    if ($(this.map._container).hasClass('mwz-small')) {
      $(this.map._container).find('.mapboxgl-ctrl-bottom-right').css('bottom', selected_height)
    }
  }
  private _promoteSelectedElement (element: any): void {
    if (element.objectClass === 'place') {
      this.map.addMarkerOnPlace(element)
      this.map.setPromotedPlaces([element])
    } else if (element.objectClass === 'placeList') {
      this.map.addMarkerOnPlaceList(element)
      this.map.setPromotedPlaces(element.placeIds)
    }
  }
}
