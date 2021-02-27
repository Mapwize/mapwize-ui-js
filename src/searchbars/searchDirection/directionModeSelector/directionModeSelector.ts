import { DirectionMode } from '../../../types/types'
import DirectionModeButton, { ModeSelectedCallback } from '../directionModeButton/directionModeButton'
import './directionModeSelector.scss'

export default class DirectionModeSelector {

  private container: HTMLElement
  private callback: ModeSelectedCallback
  private buttons: DirectionModeButton[]
  private mainColor: string

  constructor(modeSelectedCallback: ModeSelectedCallback, mainColor: string) {
    this.callback = modeSelectedCallback
    this.container = document.createElement('div')
    this.container.classList.add('mwz-direction-mode-selector')
    this.mainColor = mainColor
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public setDirectionModes(modes: DirectionMode[]): void {
    this.buttons = []
    this.container.innerHTML = ''
    modes.forEach((mode) => {
      const modeElement = new DirectionModeButton(mode, this.callback, this.mainColor)
      this.buttons.push(modeElement)
      this.container.appendChild(modeElement.getHtmlElement())
    })

  }

  public setSelectedMode(mode: DirectionMode): void {
    this.buttons.forEach((b: DirectionModeButton) => {
      b.setSelected(b.getDirectionMode()._id === mode._id)
    })
  }

}
