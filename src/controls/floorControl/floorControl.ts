
import { defaults, forEach } from 'lodash'

import { addClass, removeClass } from '../../utils'

const defaultOptions = {
  minHeight: 53, // Min size of floor selector
  spaces: {
    top: 10, // Space between floor control and other control
    bottom: 10 // Space between floor control and other control
  },
  sizes: { // Size of others control to calcul floor control max height
    navigationControl: 100, // 90 + margin 10
    userLocationControl: 50 // 40 + margin 10
  },
  class: { // Default classes added on elements
    container: 'mwz-ctrl-floors',
    button: 'mwz-floor-button',
    selectedFloor: 'mwz-selectedFloor',
    loadingFloor: 'mwz-loading',
    hasDirection: 'mwz-hasDirection'
  }
}

type FloorNumber = number | null
type FloorObject = { name: string, number: number }
type MWZEvent = any
type HTMLButtonFloorElement = HTMLButtonElement & { floor?: FloorNumber }

export class FloorControl {

  private options: any;
  private _container: HTMLElement;
  private _map: any;
  private buttons: Array<HTMLButtonFloorElement>;

  constructor (options: any) {
    this.options = defaults(options, defaultOptions)

    this._container = document.createElement('div')
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group ' + this.options.class.container
    this._container.style.overflow = 'auto'

    this._container.addEventListener('contextmenu', e => e.preventDefault())
  }
  
  onAdd (map: any) {
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

  onRemove () {
    this._container.parentNode.removeChild(this._container)

    this._map.off('mapwize:marginschange', this._onMarginsChange)
    this._map.off('mapwize:floorwillchange', this._onFloorWillChange)
    this._map.off('mapwize:floorchange', this._onFloorChange)
    this._map.off('mapwize:floorschange', this._onFloorsChange)
    this._map = undefined
  }
  
  getDefaultPosition () {
    return 'bottom-right'
  }
  
  resize () {
    const margins = this._map._margins.get()
    var maxHeight = (
      this._map.getSize().y - // Map height
      margins.bottom - // Margin bottom
      margins.top - // Margin top
      (this._map.navigationControl ? this.options.sizes.navigationControl : 0) - // Navigation control height if any + control margin
      (this._map.userLocationControl ? this.options.sizes.userLocationControl : 0) - // Location control if any + control margin
      this.options.spaces.bottom - // Floor control margin
      this.options.spaces.top // Margin between top controls and bottom controls
    )
    
    if (maxHeight < this.options.minHeight) {
      maxHeight = this.options.minHeight
    }
    
    this._container.style.maxHeight = maxHeight + 'px'
  }
  
  _createButton (floorDisplay: string, className: string, container: HTMLElement): HTMLButtonElement {
    var button = document.createElement('button')
    
    button.type = 'button'
    button.className = className
    button.innerHTML = floorDisplay
    button.title = floorDisplay
    
    container.appendChild(button)
    
    return button
  }
  
  _addEventOnButton (link: HTMLButtonFloorElement, floor: FloorNumber) {
    link.addEventListener('click', () => {
      this._map.setFloor(floor)
    })
  }
  
  _selectFloor (floor: FloorNumber) {
    forEach(this.buttons, (button: HTMLButtonFloorElement) => {
      let className = removeClass(button.className, this.options.class.selectedFloor)
      if (button.floor === floor) {
        className = addClass(className, this.options.class.selectedFloor)
        className = removeClass(className, this.options.class.loadingFloor)
      }
      button.className = className
    })
  }

  _onMarginsChange (e: MWZEvent) {
    this.resize()
  }
  
  _onFloorWillChange (e: MWZEvent) {
    forEach(this.buttons, (button: HTMLButtonFloorElement) => {
      if (button.floor === e.to) {
        button.className = addClass(button.className, this.options.class.loadingFloor)
      } else if (button.floor === e.from) {
        button.className = removeClass(button.className, this.options.class.selectedFloor)
      }
    })
  }

  _onFloorChange (e: MWZEvent) {
    this._selectFloor(e.floor)
  }
  
  _onFloorsChange (data: MWZEvent) {
    var container = this._container
    
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
      var classBtn = this.options.class.button
      // #TODO Add something on floor wich have direction
      // if (indexOf(this.directionOnFloors, floor) !== -1) {
      //   classBtn = addClass(classBtn, this.options.class.hasDirection)
      // }
      if (floor.number === data.floor) {
        classBtn = addClass(classBtn, this.options.class.selectedFloor)
      }
      
      var button: HTMLButtonFloorElement = this._createButton(floor.name, classBtn, container)
      
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
