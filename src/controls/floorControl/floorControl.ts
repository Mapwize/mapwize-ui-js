
import * as $ from 'jquery'
import { defaults, forEach } from 'lodash'

import uiConfig from '../../config'
import { addClass, removeClass } from '../../utils'

const defaultOptions = {
  class: { // Default classes added on elements
    button: 'mwz-floor-button',
    container: 'mwz-ctrl-floors',
    hasDirection: 'mwz-hasDirection',
    loadingFloor: 'mwz-loading',
    selectedFloor: 'mwz-selectedFloor',
  },
  maxHeight: 508, // Max size of floor selector
  minHeight: 64, // Min size of floor selector
  sizes: { // Size of others control to calcul floor control max height
    mapwizeAttribution: 30, // 21 in reality
    navigationControl: 140, // 130 + margin 10
    userLocationControl: 50, // 40 + margin 10
  },
  spaces: {
    bottom: 10, // Space between floor control and other control
    top: 10, // Space between floor control and other control
  },
}

type FloorNumber = number | null
type FloorObject = { name: string, number: number }
type MWZEvent = any
type HTMLButtonFloorElement = HTMLButtonElement & { floor?: FloorNumber }

export class FloorControl {

  private _options: any
  private _container: HTMLElement
  private _map: any
  private buttons: HTMLButtonFloorElement[]

  constructor (options: any) {
    this._options = defaults(options, defaultOptions)

    this._container = document.createElement('div')
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group ' + this._options.class.container
    this._container.style.overflow = 'auto'

    this._container.addEventListener('contextmenu', (e: any) => e.preventDefault())

    if (this._options.mainColor) {
      const sheet = document.createElement('style')
      let styleHtml = ''
      styleHtml += '.mwz-ctrl-floors .mwz-floor-button.mwz-selectedFloor, .mwz-ctrl-floors .mwz-floor-button.mwz-selectedFloor:hover { background-color: ' + this._options.mainColor + ' !important; }'
      styleHtml += '.mwz-ctrl-floors .mwz-floor-button.mwz-loading::before { background-image: linear-gradient(' + this._options.mainColor + ', ' + this._options.mainColor + '), linear-gradient(#ffffff, #ffffff), linear-gradient(#ffffff, #ffffff), linear-gradient(#ffffff, #ffffff) !important; }'

      sheet.innerHTML = styleHtml
      document.body.appendChild(sheet)
    }
  }

  public onAdd (map: any): any {
    this._map = map

    this._onMarginsChange = this._onMarginsChange.bind(this)
    this._onFloorWillChange = this._onFloorWillChange.bind(this)
    this._onFloorChange = this._onFloorChange.bind(this)
    this._onFloorsChange = this._onFloorsChange.bind(this)
    this._onMapResize = this._onMapResize.bind(this)

    this._map.on('mapwize:marginschange', this._onMarginsChange)
    this._map.on('mapwize:floorwillchange', this._onFloorWillChange)
    this._map.on('mapwize:floorchange', this._onFloorChange)
    this._map.on('mapwize:floorschange', this._onFloorsChange)
    this._map.on('resize', this._onMapResize)

    return this._container
  }

  public onRemove (): void {
    this._container.parentNode.removeChild(this._container)

    this._map.off('mapwize:marginschange', this._onMarginsChange)
    this._map.off('mapwize:floorwillchange', this._onFloorWillChange)
    this._map.off('mapwize:floorchange', this._onFloorChange)
    this._map.off('mapwize:floorschange', this._onFloorsChange)
    this._map.off('resize', this._onMapResize)
    this._map = undefined
  }

  public getDefaultPosition (): string {
    return 'bottom-right'
  }

  public resize () {
    const margins = this._map._margins.get()
    let footerHeight = 0

    if ($(this._map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS) && this._map.headerManager.isInDirectionMode()) {
      margins.top = 45
    } else {
      margins.top = 0
    }

    if ($(this._map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS) && this._map.getSelected()) {
      footerHeight = $(this._map._container).find('#mwz-footer-selection').height()
    }

    let maxHeight = (
      this._map.getSize().y - // Map height
      margins.bottom - // Margin bottom
      margins.top - // Margin top
      (this._map.navigationControl ? this._options.sizes.navigationControl : 0) - // Navigation control height if any + control margin
      (this._map.locationControl ? this._options.sizes.userLocationControl : 0) - // Location control if any + control margin
      (this._map.mapwizeAttribution ? this._options.sizes.mapwizeAttribution : 30) - // mapwize attribution control
      this._options.spaces.bottom - // Floor control margin
      this._options.spaces.top - // Margin between top controls and bottom controls
      footerHeight // Footer height
    )
    if (maxHeight < this._options.minHeight) {
      maxHeight = this._options.minHeight
    }
    if (maxHeight > this._options.maxHeight) {
      maxHeight = this._options.maxHeight
    }
    this._container.style.maxHeight = maxHeight + 'px'
  }

  private _setScroll () {
    const container = $(this._container)
    const item = container.find('.mwz-selectedFloor')
    if (item.length) {
      const containerHeight = container.height()
      const containerTop = container.scrollTop()

      const itemTop = item.offset().top - container.offset().top
      const itemBottom = itemTop + item.height()

      const itemIsFullyVisible = (itemTop >= 0 && itemBottom <= containerHeight)

      if (!itemIsFullyVisible) {
        container.animate({ scrollTop: itemTop + containerTop - (containerHeight / 2) }, 250)
      }
    }
  }

  private _createButton (floorDisplay: string, className: string, container: HTMLElement): HTMLButtonElement {
    const button = document.createElement('button')

    button.type = 'button'
    button.className = className
    button.innerHTML = floorDisplay
    button.title = floorDisplay

    container.appendChild(button)

    return button
  }

  private _addEventOnButton (link: HTMLButtonFloorElement, floor: FloorNumber) {
    link.addEventListener('click', () => {
      this._map.setFloor(floor)
    })
  }

  private _selectFloor (floor: FloorNumber) {
    forEach(this.buttons, (button: HTMLButtonFloorElement) => {
      let className = removeClass(button.className, this._options.class.selectedFloor)
      if (button.floor === floor) {
        className = addClass(className, this._options.class.selectedFloor)
        className = removeClass(className, this._options.class.loadingFloor)
      }
      button.className = className
    })
    this._setScroll()
  }

  private _onMarginsChange (e: MWZEvent) {
    this.resize()
  }

  private _onFloorWillChange (e: MWZEvent) {
    forEach(this.buttons, (button: HTMLButtonFloorElement) => {
      if (button.floor === e.to) {
        button.className = addClass(button.className, this._options.class.loadingFloor)
      } else if (button.floor === e.from) {
        button.className = removeClass(button.className, this._options.class.selectedFloor)
      }
    })
  }

  private _onFloorChange (e: MWZEvent) {
    this._selectFloor(e.floor)
  }

  private _onFloorsChange (data: MWZEvent) {
    const container = this._container

    container.innerHTML = ''
    this.buttons = []

    data.floors.sort((a: any, b: any) => {
      return b.number - a.number
    })

    if (data.floors.length) {
      container.style.display = 'block'
    } else {
      container.style.display = 'none'
    }

    forEach(data.floors, (floor: FloorObject) => {
      let classBtn = this._options.class.button
      // #TODO Add something on floor wich have direction
      // if (indexOf(this.directionOnFloors, floor) !== -1) {
      //   classBtn = addClass(classBtn, this._options.class.hasDirection)
      // }
      if (floor.number === data.floor) {
        classBtn = addClass(classBtn, this._options.class.selectedFloor)
      }

      const button: HTMLButtonFloorElement = this._createButton(floor.name, classBtn, container)

      button.id = 'mwz-floor-button-' + floor.number
      button.floor = floor.number

      this._addEventOnButton(button, floor.number)
      this.buttons.push(button)
    })

    // In case we have changed the number of floors
    this.resize()
  }

  private _onMapResize () {
    this.resize()
  }
}

export { FloorControl as default }
