import { DirectionMode } from '../../../types/types'
import { replaceColorInBase64svg } from '../../../utils/formatter'
import { directionModeIcons } from '../../../utils/icons'

export type ModeSelectedCallback = (directionMode: DirectionMode) => void

export default class DirectionModeButton {
  private container: HTMLElement
  private image: HTMLImageElement
  private directionMode: DirectionMode
  private mainColor: string

  constructor(directionMode: DirectionMode, modeSelectedCallback: ModeSelectedCallback, mainColor: string) {
    this.directionMode = directionMode
    this.mainColor = mainColor
    this.container = document.createElement('div')
    this.container.classList.add('mwz-direction-mode-item')
    this.container.onclick = (e) => {
      modeSelectedCallback(directionMode)
    }

    this.image = document.createElement('img')
    this.image.classList.add('mwz-direction-mode-item-image')
    const url = directionModeIcons[directionMode.type]
    this.image.src = url

    this.container.appendChild(this.image)
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public getDirectionMode(): DirectionMode {
    return this.directionMode
  }

  public setSelected(selected: boolean): void {
    if (selected) {
      this.container.classList.add('mwz-selected')
      const url = directionModeIcons[this.directionMode.type]
      this.image.src = replaceColorInBase64svg(url, this.mainColor)
    } else {
      this.container.classList.remove('mwz-selected')
      this.image.src = directionModeIcons[this.directionMode.type]
    }
  }
}
