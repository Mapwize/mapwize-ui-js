import { Language } from '../types/types'
import './languageSelector.scss'
import tippy from 'tippy.js'
import { buildTooltip } from '../utils/tippyConfig'
import { lang_change_language } from '../localizor/localizor'


export interface LanguageSelectorState {
  isExpanded: boolean
  isHidden: boolean
  languages: LanguageDisplay[]
  selectedLanguage: string
  tooltipMessage: string
}

export interface LanguageDisplay {
  code: string
  value: string
}

export interface LanguageSelectorListener {
  onLanguageSelected: (language: string) => void
  onClick: () => void
}

export default class LanguageSelector {

  private container: HTMLElement
  private listener: LanguageSelectorListener
  private expanded: boolean
  private list: HTMLElement
  private title: HTMLElement
  private tooltip: any

  constructor(listener: LanguageSelectorListener) {
    this.listener = listener
    this.container = document.createElement('div')
    this.container.classList.add('mwz-language-selector')
    this.container.onclick = () => {
      this.listener.onClick()
    }

    const selected = document.createElement('div')
    selected.classList.add('mwz-language-selector-selected')
    this.container.appendChild(selected)

    const image = document.createElement('img')
    image.classList.add('mwz-language-selector-image')
    image.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI5LjQgMjkuNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjkuNCAyOS40OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTE0LjcsNC43Yy01LjUsMC0xMCw0LjUtMTAsMTBzNC41LDEwLDEwLDEwczEwLTQuNSwxMC0xMFMyMC4yLDQuNywxNC43LDQuN3ogTTE3LjMsMjMuNGMwLjYtMC45LDEuMi0xLjksMS42LTIuOWMwLjcsMC4yLDEuNCwwLjUsMi4xLDAuOEMyMCwyMi4zLDE4LjcsMjMsMTcuMywyMy40eiBNMjEuMSw4LjJjLTAuNywwLjMtMS4zLDAuNi0yLDAuOGMtMC40LTEtMC45LTItMS40LTIuOUMxOC45LDYuNSwyMC4xLDcuMywyMS4xLDguMnogTTE5LjcsMTQuNWwtNC44LDBWMTBjMS4zLDAsMi42LTAuMiwzLjktMC41QzE5LjQsMTEuMSwxOS43LDEyLjgsMTkuNywxNC41eiBNMTkuNywxNC45YzAsMS44LTAuNCwzLjUtMSw1LjFjLTEuMi0wLjMtMi41LTAuNS0zLjctMC41di00LjZIMTkuN3ogTTE5LjEsMjAuMWMwLjYtMS43LDEtMy40LDEtNS4yaDMuN2MtMC4xLDIuMy0xLDQuNS0yLjUsNi4xQzIwLjYsMjAuNiwxOS44LDIwLjMsMTkuMSwyMC4xeiBNMjAuMSwxNC41YzAtMS44LTAuMy0zLjUtMC45LTUuMWMwLjctMC4yLDEuNS0wLjUsMi4yLTAuOGMxLjUsMS42LDIuNCwzLjcsMi40LDZMMjAuMSwxNC41eiBNMTcsNS45YzAuNywxLDEuMiwyLjEsMS43LDMuMmMtMS4yLDAuMy0yLjUsMC41LTMuOCwwLjV2LTRDMTUuNiw1LjYsMTYuMyw1LjcsMTcsNS45eiBNMTAuNCw5LjRjLTAuNiwxLjYtMC44LDMuMy0wLjgsNS4xaC00YzAuMS0yLjMsMS00LjQsMi40LTZDOC44LDguOSw5LjYsOS4yLDEwLjQsOS40eiBNOC4zLDguMmMxLTEsMi4zLTEuOCwzLjgtMi4yYy0wLjYsMS0xLjEsMi0xLjUsMy4xQzkuOCw4LjgsOS4xLDguNSw4LjMsOC4yeiBNOS42LDE0LjljMCwxLjgsMC40LDMuNSwxLDUuMmMtMC44LDAuMi0xLjcsMC41LTIuNSwwLjljLTEuNS0xLjYtMi40LTMuNy0yLjUtNi4xSDkuNnogTTguNCwyMS4zYzAuOC0wLjMsMS41LTAuNiwyLjMtMC44YzAuNCwxLjEsMSwyLjEsMS43LDNDMTAuOSwyMy4xLDkuNSwyMi4zLDguNCwyMS4zeiBNMTAsMTQuOWg0LjV2NC42Yy0xLjIsMC0yLjQsMC4yLTMuNSwwLjRDMTAuNCwxOC40LDEwLjEsMTYuNywxMCwxNC45eiBNMTAsMTQuNWMwLTEuNywwLjMtMy40LDAuOC01QzEyLDkuOCwxMy4yLDEwLDE0LjUsMTB2NC41SDEweiBNMTEsOS4xYzAuNC0xLjIsMS0yLjMsMS43LTMuM2MwLjYtMC4xLDEuMi0wLjIsMS44LTAuMnY0QzEzLjMsOS42LDEyLjEsOS40LDExLDkuMXogTTEzLDIzLjZjLTAuOC0xLTEuNC0yLjEtMS45LTMuM2MxLjEtMC4zLDIuMi0wLjQsMy40LTAuNHYzLjlDMTQsMjMuOCwxMy41LDIzLjcsMTMsMjMuNnogTTE0LjksMTkuOWMxLjIsMCwyLjQsMC4yLDMuNiwwLjVjLTAuNSwxLjEtMS4xLDIuMi0xLjgsMy4yYy0wLjYsMC4xLTEuMiwwLjItMS44LDAuMlYxOS45eiIvPjwvc3ZnPg=='
    selected.appendChild(image)

    this.title = document.createElement('span')
    this.title.classList.add('mwz-language-selector-title')
    selected.appendChild(this.title)

    this.list = document.createElement('div')
    this.list.classList.add('mwz-language-selector-list')
    this.list.classList.add('mwz-gone')
    this.container.appendChild(this.list)

    this.tooltip = buildTooltip(this.container, '')

  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public renderDefault(state: LanguageSelectorState): void {
    this.setHidden(state.isHidden)
    this.setExpanded(state.isExpanded)
    this.setLanguages(state.languages)
    this.setSelectedLanguage(state.selectedLanguage)
    this.setTooltipMessage(state.tooltipMessage)
  }

  public render(oldState: LanguageSelectorState, state: LanguageSelectorState): void {
    if (oldState.isExpanded !== state.isExpanded) {
      this.setExpanded(state.isExpanded)
    }
    if (oldState.isHidden !== state.isHidden) {
      this.setHidden(state.isHidden)
    }
    if (oldState.selectedLanguage !== state.selectedLanguage) {
      this.setSelectedLanguage(state.selectedLanguage)
    }
    if (oldState.languages !== state.languages) {
      this.setLanguages(state.languages)
    }
    if (oldState.tooltipMessage !== state.tooltipMessage) {
      this.setTooltipMessage(state.tooltipMessage)
    }
  }

  private setTooltipMessage(message: string): void {
    this.tooltip.setContent(message)
  }

  private setLanguages(languages: LanguageDisplay[]): void {
    this.list.innerHTML = ''
    languages.forEach((l) => {
      const element = document.createElement('span')
      element.innerHTML = l.value
      element.classList.add('mwz-language-selector-list-item')
      element.onclick = (e) => {
        this.listener.onLanguageSelected(l.code)
        e.stopPropagation()
      }
      this.list.appendChild(element)
    })
  }

  private setSelectedLanguage(language: string): void {
    this.title.innerHTML = language
  }

  private setHidden(isHidden: boolean): void {
    if (isHidden) {
      this.container.classList.add('mwz-gone')
    }
    else {
      this.container.classList.remove('mwz-gone')
    }
  }

  private setExpanded(expanded: boolean): void {
    this.expanded = expanded
    if (this.expanded) {
      this.container.classList.add('mwz-expanded')
      this.list.classList.remove('mwz-gone')
    }
    else {
      this.container.classList.remove('mwz-expanded')
      this.list.classList.add('mwz-gone')
    }
  }
}
