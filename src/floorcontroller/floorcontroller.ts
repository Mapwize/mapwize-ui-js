import { buildTooltip } from '../utils/tippyConfig'
import FloorButton, { FloorSelectedCallback } from './floorbutton/floorbutton'

export interface FloorControllerState {
  floors: FloorDisplay[]
  selectedFloor?: number
  loadingFloor?: number
  tooltipMessage: string
}

export type FloorDisplay = { title: string; number?: number }

export default class FloorController {
  private container: HTMLElement
  private callback: FloorSelectedCallback
  private buttons: FloorButton[]
  private tooltip: any

  constructor(callback: FloorSelectedCallback) {
    this.container = document.createElement('div')
    this.container.classList.add('mwz-floor-controller')
    this.callback = callback
    this.buttons = []
    this.tooltip = buildTooltip(this.container, '', { placement: 'left' })
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public renderDefault(state: FloorControllerState): void {
    this.setFloors(state.floors)
    this.setLoadingFloor(state.loadingFloor)
    this.setSelectedFloor(state.selectedFloor)
    this.tooltip.setContent(state.tooltipMessage)
  }

  public render(oldState: FloorControllerState, state: FloorControllerState): void {
    if (oldState.floors !== state.floors) {
      this.setFloors(state.floors)
    }
    if (oldState.loadingFloor !== state.loadingFloor) {
      this.setLoadingFloor(state.loadingFloor)
    }
    if (oldState.selectedFloor !== state.selectedFloor) {
      this.setSelectedFloor(state.selectedFloor)
    }
    if (oldState.tooltipMessage !== state.tooltipMessage) {
      this.tooltip.setContent(state.tooltipMessage)
    }
  }

  private setFloors(floors: FloorDisplay[]): void {
    this.container.innerHTML = ''
    this.buttons = []
    floors.forEach((floor: FloorDisplay) => {
      const button = new FloorButton(floor, this.callback)
      this.buttons.push(button)
      this.container.prepend(button.getHtmlElement())
    })
    if (this.buttons.length === 0) {
      this.container.classList.add('mwz-gone')
    } else {
      this.container.classList.remove('mwz-gone')
    }
  }

  private setLoadingFloor(floor: number): void {
    this.buttons.forEach((b) => {
      b.setLoading(b.getFloor().number === floor)
    })
  }

  private setSelectedFloor(floor: number): void {
    this.buttons.forEach((b) => {
      b.setLoading(false)
      b.setSelected(b.getFloor().number === floor)
    })
  }
}
