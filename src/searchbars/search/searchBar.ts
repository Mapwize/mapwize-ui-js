import { bottomViewIcons } from '../../utils/icons'
import { buildTooltip } from '../../utils/tippyConfig'
import './searchBar.scss'

export interface SearchBarState {
  searchQuery: string
  isHidden: boolean
  isInSearch: boolean
  searchPlaceholder: string
  directionButtonHidden: boolean
  menuTooltipMessage: string
  directionTooltipMessage: string
  backTooltipMessage: string
}

export interface SearchBarListener {
  onSearchTextFocus: () => void
  onSearchTextBlur: () => void
  onSearchTextChange: (text: string) => void
  onMenuClick: () => void
  onDirectionClick: () => void
  onBackClick: () => void
}

export default class SearchBar {
  private container: HTMLElement
  private backButton: HTMLButtonElement
  private backTooltip: any
  private menuButton: HTMLButtonElement
  private menuTooltip: any
  private searchTextField: HTMLInputElement
  private directionButton: HTMLButtonElement
  private directionTooltip: any
  private listener: SearchBarListener

  constructor(listener: SearchBarListener) {
    this.listener = listener
    this.container = document.createElement('div')
    this.container.classList.add('mwz-search-bar')

    if (this.listener.onMenuClick) {
      this.menuButton = document.createElement('button')
      this.menuButton.type = 'button'
      this.menuButton.classList.add('mwz-menu-button')
      this.menuButton.onclick = this.listener.onMenuClick
      this.menuTooltip = buildTooltip(this.menuButton, '')
    }

    this.backButton = document.createElement('button')
    this.backButton.type = 'button'
    this.backButton.classList.add('mwz-back-button')
    this.backButton.classList.add('mwz-gone')
    this.backButton.onclick = this.listener.onBackClick
    this.backTooltip = buildTooltip(this.backButton, '')

    this.searchTextField = document.createElement('input')
    this.searchTextField.setAttribute('type', 'text')
    this.searchTextField.classList.add('mwz-search-text-field')
    this.searchTextField.placeholder = ''
    this.searchTextField.onfocus = (e) => {
      this.listener.onSearchTextFocus()
      this.listener.onSearchTextChange(this.searchTextField.value)
    }
    this.searchTextField.onblur = this.listener.onSearchTextBlur
    this.searchTextField.oninput = (e) => {
      this.listener.onSearchTextChange(this.searchTextField.value)
    }
    this.directionButton = document.createElement('button')
    this.directionButton.type = 'button'
    this.directionButton.classList.add('mwz-direction-button')
    const directionImage = document.createElement('img')
    directionImage.src = bottomViewIcons.DIRECTION
    directionImage.classList.add('mwz-direction-button-image')
    this.directionButton.appendChild(directionImage)
    this.directionButton.onclick = this.listener.onDirectionClick
    this.directionTooltip = buildTooltip(this.directionButton, '')

    if (this.menuButton) {
      this.container.appendChild(this.menuButton)
    }
    this.container.appendChild(this.backButton)
    this.container.appendChild(this.searchTextField)
    this.container.appendChild(this.directionButton)
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public renderDefault(state: SearchBarState): void {
    this.searchTextField.value = state.searchQuery
    this.setHidden(state.isHidden)
    this.setDirectionButtonHidden(state.directionButtonHidden)
    this.setInSearch(state.isInSearch)
    this.setPlaceholder(state.searchPlaceholder)
    this.menuTooltip?.setContent(state.menuTooltipMessage)
    this.backTooltip.setContent(state.backTooltipMessage)
    this.directionTooltip.setContent(state.directionTooltipMessage)
  }

  public render(oldState: SearchBarState, state: SearchBarState): void {
    if (oldState.isHidden !== state.isHidden) {
      this.setHidden(state.isHidden)
    }
    if (oldState.directionButtonHidden !== state.directionButtonHidden) {
      this.setDirectionButtonHidden(state.directionButtonHidden)
    }
    if (oldState.searchQuery !== state.searchQuery) {
      this.searchTextField.value = state.searchQuery
    }
    if (oldState.isInSearch !== state.isInSearch) {
      this.setInSearch(state.isInSearch)
    }
    if (oldState.searchPlaceholder !== state.searchPlaceholder) {
      this.setPlaceholder(state.searchPlaceholder)
    }
    if (oldState.menuTooltipMessage !== state.menuTooltipMessage) {
      this.menuTooltip?.setContent(state.menuTooltipMessage)
    }
    if (oldState.backTooltipMessage !== state.backTooltipMessage) {
      this.backTooltip.setContent(state.backTooltipMessage)
    }
    if (oldState.directionTooltipMessage !== state.directionTooltipMessage) {
      this.directionTooltip.setContent(state.directionTooltipMessage)
    }
  }

  private setPlaceholder(placeholder: string): void {
    this.searchTextField.placeholder = placeholder
  }

  private setHidden(hidden: boolean): void {
    if (hidden) {
      this.container.classList.add('mwz-gone')
    } else {
      this.container.classList.remove('mwz-gone')
    }
  }

  private setDirectionButtonHidden(hidden: boolean): void {
    if (hidden) {
      this.directionButton.classList.add('mwz-gone')
      this.searchTextField.classList.add('mwz-no-border')
    } else {
      this.directionButton.classList.remove('mwz-gone')
      this.searchTextField.classList.remove('mwz-no-border')
    }
  }

  private setInSearch(inSearch: boolean): void {
    if (inSearch) {
      this.container.classList.add('mwz-in-search')
      this.menuButton?.classList.add('mwz-gone')
      this.backButton.classList.remove('mwz-gone')
    } else {
      this.container.classList.remove('mwz-in-search')
      this.menuButton?.classList.remove('mwz-gone')
      this.backButton.classList.add('mwz-gone')
    }
  }
}
