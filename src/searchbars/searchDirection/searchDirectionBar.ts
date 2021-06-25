import { DirectionMode } from '../../types/types'
import DirectionModeSelector from './directionModeSelector/directionModeSelector'

export interface SearchDirectionBarState {
  fromPlaceholder: string
  toPlaceholder: string
  fromQuery: string
  toQuery: string
  modes: DirectionMode[]
  selectedMode: DirectionMode
  isHidden: boolean
  isInSearch: boolean
  isFromFocus: boolean
  isToFocus: boolean
}

export interface SearchDirectionBarListener {
  onSelectedModeChange: (mode: DirectionMode) => void
  onFromQueryChange: (query: string) => void
  onToQueryChange: (query: string) => void
  onSwapButtonClick: () => void
  onBackButtonClick: () => void
  onFromFocus: () => void
  onFromBlur: () => void
  onToFocus: () => void
  onToBlur: () => void
}

export default class SearchDirectionBar {
  private container: HTMLElement
  private listener: SearchDirectionBarListener
  private modeSelector: DirectionModeSelector
  private fromField: HTMLInputElement
  private toField: HTMLInputElement
  private swapButton: HTMLButtonElement

  constructor(listener: SearchDirectionBarListener, mainColor: string) {
    this.listener = listener
    this.container = document.createElement('div')
    this.container.classList.add('mwz-search-direction-bar')

    const queryContent = document.createElement('div')
    queryContent.classList.add('mwz-query-content')

    const queryContentLeft = document.createElement('div')
    queryContentLeft.classList.add('mwz-query-content-left')

    const queryContentIcons = document.createElement('div')
    queryContentIcons.classList.add('mwz-query-content-icons')

    const fromIcon = document.createElement('div')
    fromIcon.classList.add('mwz-search-direction-from-icon')

    const toIcon = document.createElement('div')
    toIcon.classList.add('mwz-search-direction-to-icon')

    queryContentIcons.appendChild(fromIcon)
    queryContentIcons.appendChild(toIcon)

    const queryContentCenter = document.createElement('div')
    queryContentCenter.classList.add('mwz-query-content-center')

    const queryContentRight = document.createElement('div')
    queryContentRight.classList.add('mwz-query-content-right')

    this.modeSelector = new DirectionModeSelector(this.listener.onSelectedModeChange, mainColor)

    const backButton = document.createElement('button')
    backButton.type = 'button'
    backButton.classList.add('mwz-search-direction-back-button')
    backButton.onclick = this.listener.onBackButtonClick
    queryContentLeft.appendChild(backButton)

    this.fromField = document.createElement('input')
    this.fromField.classList.add('mwz-search-direction-text-field')
    this.fromField.setAttribute('type', 'text')
    this.fromField.autocomplete = 'workaround'
    this.fromField.oninput = () => this.listener.onFromQueryChange(this.fromField.value)
    this.fromField.onfocus = (e) => {
      this.listener.onFromFocus()
      this.listener.onFromQueryChange(this.fromField.value)
    }
    this.fromField.onblur = () => this.listener.onFromBlur()

    this.toField = document.createElement('input')
    this.toField.classList.add('mwz-search-direction-text-field')
    this.toField.setAttribute('type', 'text')
    this.toField.autocomplete = 'workaround'
    this.toField.oninput = () => this.listener.onToQueryChange(this.toField.value)
    this.toField.onfocus = () => {
      this.listener.onToFocus()
      this.listener.onToQueryChange(this.toField.value)
    }
    this.toField.onblur = () => this.listener.onToBlur()

    queryContentCenter.appendChild(this.fromField)
    queryContentCenter.appendChild(this.toField)

    this.swapButton = document.createElement('button')
    this.swapButton.type = 'button'
    this.swapButton.classList.add('mwz-search-direction-swap-button')
    this.swapButton.onclick = this.listener.onSwapButtonClick
    queryContentRight.appendChild(this.swapButton)

    queryContent.appendChild(queryContentLeft)
    queryContent.appendChild(queryContentIcons)
    queryContent.appendChild(queryContentCenter)
    queryContent.appendChild(queryContentRight)

    this.container.appendChild(queryContent)
    this.container.appendChild(this.modeSelector.getHtmlElement())
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public renderDefault(state: SearchDirectionBarState): void {
    this.setHidden(state.isHidden)
    this.setInSearch(state.isInSearch)
    this.fromField.value = state.fromQuery
    this.toField.value = state.toQuery
    this.fromField.placeholder = state.fromPlaceholder
    this.toField.placeholder = state.toPlaceholder
    this.modeSelector.setDirectionModes(state.modes)
    this.modeSelector.setSelectedMode(state.selectedMode)
  }

  public render(oldState: SearchDirectionBarState, state: SearchDirectionBarState): void {
    if (oldState.modes !== state.modes) {
      this.modeSelector.setDirectionModes(state.modes)
    }
    if (oldState.selectedMode !== state.selectedMode) {
      this.modeSelector.setSelectedMode(state.selectedMode)
    }
    if (oldState.fromQuery !== state.fromQuery) {
      this.fromField.value = state.fromQuery
    }
    if (oldState.toQuery !== state.toQuery) {
      this.toField.value = state.toQuery
    }
    if (oldState.fromPlaceholder !== state.fromPlaceholder) {
      this.fromField.placeholder = state.fromPlaceholder
    }
    if (oldState.toPlaceholder !== state.toPlaceholder) {
      this.toField.placeholder = state.toPlaceholder
    }
    if (oldState.isInSearch !== state.isInSearch) {
      this.setInSearch(state.isInSearch)
    }
    if (oldState.isHidden !== state.isHidden) {
      this.setHidden(state.isHidden)
    }
    if (oldState.isFromFocus !== state.isFromFocus) {
      this.setFromFocus(state.isFromFocus)
    }
    if (oldState.isToFocus !== state.isToFocus) {
      this.setToFocus(state.isToFocus)
    }
    if (state.isFromFocus || state.isToFocus) {
      this.swapButton.classList.add('mwz-swap-button-gone')
    } else {
      this.swapButton.classList.remove('mwz-swap-button-gone')
    }
  }

  private setFromFocus(focus: boolean): void {
    if (focus && this.fromField !== document.activeElement) {
      setTimeout(() => this.fromField.focus(), 0)
    } else if (!focus && this.fromField === document.activeElement) {
      setTimeout(() => this.fromField.blur(), 0)
    }
  }

  private setToFocus(focus: boolean): void {
    if (focus && this.toField !== document.activeElement) {
      setTimeout(() => this.toField.focus(), 0)
    } else if (!focus && this.toField === document.activeElement) {
      setTimeout(() => this.toField.blur(), 0)
    }
  }

  private setInSearch(inSearch: boolean): void {
    if (inSearch) {
      this.container.classList.add('mwz-in-search')
    } else {
      this.container.classList.remove('mwz-in-search')
    }
  }

  private setHidden(hidden: boolean): void {
    if (hidden) {
      this.container.classList.add('mwz-gone')
    } else {
      this.container.classList.remove('mwz-gone')

      // TODO DO BETTER
      // if (this.fromField.value === '') {
      //   setTimeout(() => this.fromField.focus(), 0)
      // }
      // else if (this.toField.value === '') {
      //   setTimeout(() => this.toField.focus(), 0)
      // }
    }
  }
}
