import { SearchResult } from '../../../types/types'
import './searchResultItem.scss'

export default class CurrentLocationItem {
  private container: HTMLElement

  constructor(showCurrentLocation: string) {
    this.container = document.createElement('div')
    this.container.classList.add('mwz-search-result-item')
    const icon = document.createElement('img')
    icon.src =
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMjkuNHB4IiBoZWlnaHQ9IjI5LjRweCIgdmlld0JveD0iMCAwIDI5LjQgMjkuNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjkuNCAyOS40OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGQ9Ik0xMy43LDMuN3YyYy00LjIsMC41LTcuNSwzLjgtOCw4aC0ydjJoMmMwLjUsNC4yLDMuOCw3LjUsOCw4djJoMnYtMmM0LjItMC41LDcuNS0zLjgsOC04aDJ2LTJoLTJjLTAuNS00LjItMy44LTcuNS04LTh2LTIKCUwxMy43LDMuN3ogTTE0LjcsNy43YzMuOSwwLDcsMy4xLDcsN3MtMy4xLDctNyw3cy03LTMuMS03LTdTMTAuOCw3LjcsMTQuNyw3Ljd6IE0xNC43LDEwLjdjLTIuMiwwLTQsMS44LTQsNHMxLjgsNCw0LDRzNC0xLjgsNC00CglTMTYuOSwxMC43LDE0LjcsMTAuN3oiLz4KPC9zdmc+Cg=='
    icon.classList.add('mwz-search-result-item-icon')

    const textContainer = document.createElement('div')
    textContainer.classList.add('mwz-search-result-item-text-container')
    const titleSpan = document.createElement('span')
    titleSpan.classList.add('mwz-search-result-item-title')
    titleSpan.innerHTML = showCurrentLocation
    textContainer.appendChild(titleSpan)

    this.container.appendChild(icon)
    this.container.appendChild(textContainer)
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }
}
