import './floorbutton.scss'
import { FloorDisplay } from '../floorcontroller'

export type FloorSelectedCallback = (floor?: number) => void

export default class FloorButton {
  private container: HTMLElement
  private callback: FloorSelectedCallback
  private floor: FloorDisplay

  constructor(floor: FloorDisplay, callback: FloorSelectedCallback) {
    this.floor = floor
    this.callback = callback
    this.container = document.createElement('button')
    this.container.textContent = floor.title
    this.container.classList.add('mwz-floor-button')
    this.container.onclick = (e) => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      callback(floor.number)
    }
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public getFloor(): FloorDisplay {
    return this.floor
  }

  public setLoading(loading: boolean): void {
    if (loading) {
      this.container.classList.add('mwz-loading')
    } else {
      this.container.classList.remove('mwz-loading')
    }
  }

  public setSelected(selected: boolean): void {
    if (selected) {
      this.container.classList.add('mwz-selected')
    } else {
      this.container.classList.remove('mwz-selected')
    }
  }
}
