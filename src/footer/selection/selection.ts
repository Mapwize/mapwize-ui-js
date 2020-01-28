import * as $ from 'jquery'
import { isEmpty, isString, map } from 'lodash'

const selectionHtml = require('./selection.html')

import uiConfig from '../../config'
import { DefaultControl } from '../../control'
import { callOptionnalFn, getDefaultFloorForPlaces, getIcon, getPlacesInPlaceList, getTranslation } from '../../utils'

export class FooterSelection extends DefaultControl {

  private _selectedElement: any
  private _selectedHeight: number
  private _options: any

  constructor (mapInstance: any, options: any) {
    super(mapInstance)
    this._options = options

    this._selectedHeight = 0

    this._container = $(selectionHtml)

    this.listen('click', '#mwz-footer-selection', this._footerClick.bind(this))
    this.listen('click', '#mwz-footer-directions-button', this._directionButtonClick.bind(this))
    this.listen('click', '#mwz-footer-informations-button', this._informationButtonClick.bind(this))

    this.listen('click', '#mwz-footer-selection .mwz-open-details', this._onOpenDetailsClick.bind(this))
    this.listen('click', '#mwz-footer-selection .mwz-close-details', this._onCloseDetailsClick.bind(this))

    if (options.mainColor) {
      this._container.find('#mwz-footer-directions-button').css('background', options.mainColor)
      this._container.find('.mwz-icon-information').css('background', options.mainColor)
    }
  }

  public remove (): void {
    return null
  }

  public onRemove () {
    this._container.remove()
    this._map = undefined
    this.isOnMap = false

    this.initializeMapBoxControls()
  }

  public getDefaultPosition (): string {
    return 'bottom-left'
  }

  public setSelected (element: any): Promise<void> {
    this.map.removeMarkers()

    this._selectedElement = element

    if (element) {
      let additionnalDatasPromise = Promise.resolve()

      if (element.objectClass === 'placeList') {
        additionnalDatasPromise = getPlacesInPlaceList(element._id).then((places) => {
          element.places = places
        })
      }

      return additionnalDatasPromise.then(() => {
        this._displaySelectedElementInformations(element)
        this._promoteSelectedElement(element)
        callOptionnalFn(this._options.onSelectedChange, [element])
      })
    } else {
      this.initializeMapBoxControls()
      this.map.setPromotedPlaces([])
      callOptionnalFn(this._options.onSelectedChange, [null])

      if (this.map.floorControl) {
        this.map.floorControl.resize()
      }
    }
    return Promise.resolve()
  }

  public initializeMapBoxControls (): void {
    $(this.map._container).find('.mapboxgl-ctrl-bottom-right').css('bottom', 0)
  }

  // ---------------------------------------
  // Privates methods
  // ---------------------------------------

  private _footerClick (e: JQueryEventObject): void {
    this._centerOnSelectedElement(this._selectedElement)
  }
  private _directionButtonClick (e: JQueryEventObject): void {
    e.stopPropagation()
    this._container.find('.mapboxgl-ctrl-bottom-right').css('bottom', 0)

    this._map.headerManager.showDirection()
  }

  private _centerOnSelectedElement (element: any): void {
    const currentZoom = this.map.getZoom()

    if (element.objectClass === 'placeList') {
      this.map.centerOnVenue(element.venueId, { floor: getDefaultFloorForPlaces(element.places, this._map.getFloor()) })
    } else {
      this.map.centerOnPlace(element._id, { zoom: currentZoom > 19 ? currentZoom : 19 })
    }
  }

  private _informationButtonClick (e: JQueryEventObject): void {
    e.stopPropagation()

    callOptionnalFn(this._options.onInformationButtonClick, [this._map.getSelected()])
  }

  private _onOpenDetailsClick (e: JQueryEventObject): void {
    e.stopPropagation()

    this._container.addClass('mwz-opened-details')

    this._container.find('.mwz-close-details').removeClass('d-none').addClass('d-block')
    this._container.find('.mwz-open-details').removeClass('d-block').addClass('d-none')

    let padding = 38
    if ($(this.map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS)) {
      padding = 0
    }

    this._container.find('.mwz-details').css('max-height', (this.map.getSize().y - padding - this._container.find('.mwz-selection-header').height()))
    this._container.animate({
      height: (this.map.getSize().y - padding),
    }, 250)
  }
  private _onCloseDetailsClick (e: JQueryEventObject): void {
    e.stopPropagation()

    this._container.removeClass('mwz-opened-details')

    this._container.find('.mwz-open-details').removeClass('d-none').addClass('d-block')
    this._container.find('.mwz-close-details').removeClass('d-block').addClass('d-none')

    this._container.animate({
      height: this._selectedHeight,
    }, 250, () => {
      this._container.find('.mwz-details').css('max-height', 120)
    })
  }

  private _displaySelectedElementInformations (element: any): void {
    const lastHeight = this._container.css('height')

    this._container.addClass('invisible')
    this._container.css('height', 'auto')

    const lang = this.map.getLanguage()
    this._container.find('.mwz-title').text(getTranslation(element, lang, 'title'))
    this._container.find('.mwz-subtitle').text(getTranslation(element, lang, 'subTitle'))
    this._container.find('.mwz-icon img').attr('src', getIcon(element))

    const details = getTranslation(element, lang, 'details')
    if (!isEmpty(details)) {
      this._container.find('.mwz-details').html(details)
    } else {
      this._container.find('.mwz-details').html('')
      this._container.find('.mwz-open-details').removeClass('d-block').addClass('d-none')
      this._container.find('.mwz-close-details').removeClass('d-block').addClass('d-none')
    }

    const informationButton = callOptionnalFn(this._options.shouldShowInformationButtonFor, [element])

    if (isString(informationButton) && !isEmpty(informationButton)) {
      this._container.find('#mwz-footer-informations-button').html(informationButton).show()
    } else if (informationButton) {
      this._container.find('#mwz-footer-informations-button').html('<span class="mwz-icon-information">i</span> Informations').show()
    } else {
      this._container.find('#mwz-footer-informations-button').hide()
    }

    const selected_height = this._container.height()
    this._selectedHeight = selected_height < 240 ? selected_height : 240
    if (selected_height >= 220) {
      this._container.find('.mwz-open-details').removeClass('d-none').addClass('d-block')
      this._container.find('.mwz-close-details').removeClass('d-block').addClass('d-none')
    } else {
      this._container.find('.mwz-open-details').removeClass('d-block').addClass('d-none')
      this._container.find('.mwz-close-details').removeClass('d-block').addClass('d-none')
    }

    this._container.css('height', lastHeight)
    this._container.removeClass('invisible')
    this._container.animate({
      height: this._selectedHeight,
    }, 250, () => {
      this._container.find('.mwz-details').css('max-height', 120)
    })
    if ($(this.map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS)) {
      $(this.map._container).find('.mapboxgl-ctrl-bottom-right').css('bottom', selected_height)
    }

    if (this.map.floorControl) {
      this.map.floorControl.resize()
    }
  }
  private _promoteSelectedElement (element: any): void {
    if (element.objectClass === 'place') {
      this.map.addMarkerOnPlace(element).catch((): void => null)
      this.map.setPromotedPlaces([element]).catch((): void => null)
    } else if (element.objectClass === 'placeList') {
      Promise.all(map(element.places, (place: any) => {
        return this.map.addMarkerOnPlace(place)
      }))
      this.map.setPromotedPlaces(element.places).catch((): void => null)
    }
  }
}
