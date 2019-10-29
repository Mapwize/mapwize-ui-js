import * as $ from 'jquery';
import { isFunction, get, set, forEach, isEmpty } from 'lodash'

import uiConfig from '../../config'

const selectionHtml = require('./selection.html')

import { DefaultControl } from '../../control'
import { getTranslation, getIcon, replaceColorInBase64svg } from '../../utils'

export class FooterSelection extends DefaultControl {
  
  private _selected: any
  private _selectedHeight: number
  private _options: any;
  
  constructor (mapInstance: any, options: any) {
    super(mapInstance)
    this._options = options
    
    this._selected = null
    this._selectedHeight = 0;
    
    this._container = $(selectionHtml)
    
    this.listen('click', '#mwz-footer-selection', this._footerClick.bind(this))
    this.listen('click', '#mwz-footer-directions-button', this._directionButtonClick.bind(this))
    
    this.listen('click', '.mwz-open-details', (e: JQueryEventObject) => {
      this._container.addClass('mwz-opened-details')
      
      $(this._container).find('.mwz-close-details').removeClass('d-none').addClass('d-block')
      $(this._container).find('.mwz-open-details').removeClass('d-block').addClass('d-none')
      
      let padding = 20;
      if ($(this.map._container).hasClass('mwz-small')) {
        padding = 0;
      }
      
      $(this._container).find('.mwz-details').css('max-height', (this.map.getSize().y - padding - $(this._container).find('.mwz-selection-header').height()))
      $(this._container).animate({
        height: (this.map.getSize().y - padding)
      }, 250)
    })
    this.listen('click', '#mwz-footer-selection .mwz-close-details', (e: JQueryEventObject) => {
      this._container.removeClass('mwz-opened-details')
      
      $(this._container).find('.mwz-open-details').removeClass('d-none').addClass('d-block')
      $(this._container).find('.mwz-close-details').removeClass('d-block').addClass('d-none')
      
      $(this._container).animate({
        height: this._selectedHeight
      }, 250, () => {
        $(this._container).find('.mwz-details').css('max-height', 120)
      })
    })

    // this.mainColor(options)
  }
  
  public destroy() {
    
  }
  
  public getDefaultPosition(): string {
    return 'bottom-left'
  }
  
  public setSelected(element: any): void {
    this.map.removeMarkers()

    if (element) {
      this._displaySelectedElementInformations(element)
      this._promoteSelectedElement(element)
    } else {
      this.map.setPromotedPlaces([])
    }
  }
  
  // ---------------------------------------
  // Privates methods
  // ---------------------------------------
  
  private _footerClick(e: JQueryEventObject): void {
    if (isFunction(this._options.onInformationButtonClick)) {
      this._options.onInformationButtonClick(this._selected)
    }
  }
  private _directionButtonClick(e: JQueryEventObject): void {
    this._map.headerManager.showDirection()
    this._map.footerManager.setSelected(null)
    e.stopPropagation()
  }
  
  private _displaySelectedElementInformations(element: any): void {
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
    this._selectedHeight = selected_height < 170 ? selected_height : 170;
    
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
      height: this._selectedHeight
    }, 250, () => {
      $(this._container).find('.mwz-details').css('max-height', 120)
    })
    if ($(this.map._container).hasClass('mwz-small')) {
      $(this.map._container).find('.mapboxgl-ctrl-bottom-right').css('bottom', selected_height)
    }
  }
  private _promoteSelectedElement(element: any): void {
    if (element.objectClass === 'place') {
      this.map.addMarkerOnPlace(element)
      this.map.setPromotedPlaces([element])
    } else if (element.objectClass === 'placeList') {
      this.map.addMarkerOnPlaceList(element)
      this.map.setPromotedPlaces(element.placeIds)
    } else {
      console.error('unknown "objectClass" attribute for:', element)
    }
  }
  
  



  
  
  public mainColor(options: any) {
    if (options.mainColor) {
      const directionIconB64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYWxxdWVfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAgMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+LnN0MXtmaWxsOiMwMDAwMDA7fTwvc3R5bGU+PHBhdGggY2xhc3M9InN0MSIgZD0iTTI4LjYsMTRMMTYsMS40Yy0wLjYtMC42LTEuNC0wLjYtMiwwTDEuNCwxNGMtMC42LDAuNi0wLjYsMS40LDAsMkwxNCwyOC42YzAuNiwwLjYsMS40LDAuNiwyLDBMMjguNiwxNiAgQzI5LjEsMTUuNCwyOS4xLDE0LjYsMjguNiwxNHogTTIyLDEzLjlsLTMuOSwzLjdjLTAuMiwwLjItMC41LDAtMC41LTAuMnYtMi4yYzAtMC4yLTAuMS0wLjMtMC4zLTAuM2gtNC41Yy0wLjIsMC0wLjMsMC4xLTAuMywwLjMgIHYzLjJjMCwwLjItMC4xLDAuMy0wLjMsMC4zaC0xLjljLTAuMiwwLTAuMy0wLjEtMC4zLTAuM3YtNC41YzAtMC45LDAuNy0xLjYsMS42LTEuNmg1LjhjMC4yLDAsMC4zLTAuMSwwLjMtMC4zdi0yICBjMC0wLjMsMC4zLTAuNCwwLjUtMC4ybDMuOCwzLjhDMjIuMSwxMy42LDIyLjEsMTMuOCwyMiwxMy45eiIgc3R5bGU9IiYjMTA7ICAgIC8qIGNvbG9yOiAgcmVkOyAqLyYjMTA7Ii8+PC9zdmc+'
      this._container.find('#mwz-directionsButton img').attr('src', replaceColorInBase64svg(directionIconB64, options.mainColor))
    }
  }
}
