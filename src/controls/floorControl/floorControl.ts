
import { defaults, forEach } from 'lodash'
import { floor } from '../../config'

import { addClass, removeClass } from '../../utils'

const defaultOptions = {
  class: { // Default classes added on elements
    button: 'mwz-floor-button',
    container: 'mwz-ctrl-floors',
    hasDirection: 'mwz-hasDirection',
    loadingFloor: 'mwz-loading',
    selectedFloor: 'mwz-selectedFloor',
  },
  minHeight: 53, // Min size of floor selector
  sizes: { // Size of others control to calcul floor control max height
    navigationControl: 100, // 90 + margin 10
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

    this._map.on('mapwize:marginschange', this._onMarginsChange)
    this._map.on('mapwize:floorwillchange', this._onFloorWillChange)
    this._map.on('mapwize:floorchange', this._onFloorChange)
    this._map.on('mapwize:floorschange', this._onFloorsChange)

    return this._container
  }

  public onRemove (): void {
    this._container.parentNode.removeChild(this._container)

    this._map.off('mapwize:marginschange', this._onMarginsChange)
    this._map.off('mapwize:floorwillchange', this._onFloorWillChange)
    this._map.off('mapwize:floorchange', this._onFloorChange)
    this._map.off('mapwize:floorschange', this._onFloorsChange)
    this._map = undefined
  }

  public getDefaultPosition (): string {
    return 'bottom-right'
  }

  public resize () {
    const margins = this._map._margins.get()
    let maxHeight = (
      this._map.getSize().y - // Map height
      margins.bottom - // Margin bottom
      margins.top - // Margin top
      (this._map.navigationControl ? this._options.sizes.navigationControl : 0) - // Navigation control height if any + control margin
      (this._map.userLocationControl ? this._options.sizes.userLocationControl : 0) - // Location control if any + control margin
      this._options.spaces.bottom - // Floor control margin
      this._options.spaces.top // Margin between top controls and bottom controls
    )

    if (maxHeight < this._options.minHeight) {
      maxHeight = this._options.minHeight
    }

    this._container.style.maxHeight = maxHeight + 'px'
  }

  public displayTooltip (direction: any) {
    this.clearTooltip()
    if (direction.from.floor !== direction.to.floor) {
      this.setIcon(direction.from.floor, floor.FROM)
      this.setIcon(direction.to.floor, floor.TO)
      this.setArrow(direction)
    }

  }

  public setArrow (direction: any) {

    const img = document.createElement('IMG')
    const toFloor = direction.to.floor
    const fromFloor = direction.from.floor

    const arrowPosition = (((((toFloor - fromFloor) - 1) * floor.PIXEL_FLOOR) - 1) * -1) + ((toFloor - fromFloor) - 2) * 8

    img.setAttribute('class', 'mwz-floor-arrow')
    img.setAttribute('style', 'margin-top: ' + arrowPosition + 'px;')

    if (fromFloor > toFloor) {
      img.setAttribute('src', floor.ARROW_DOWN)
    } else {
      img.setAttribute('src', floor.ARROW_UP)
    }

    this._container.querySelector('#mwz-floor-button-' + fromFloor).before(img)
  }

  public setIcon (floors: number, path: any) {
    const img = document.createElement('IMG')

    img.setAttribute('class', 'mwz-floor-tooltip')
    img.setAttribute('src', path)

    this._container.querySelector('#mwz-floor-button-' + floors).before(img)
  }

  public clearTooltip () {
    this._container.querySelectorAll('img').forEach((element) => {
      element.remove()
    })
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
}

export { FloorControl as default }
