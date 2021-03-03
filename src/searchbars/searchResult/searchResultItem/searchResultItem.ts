import { SearchResult } from '../../../types/types'
import './searchResultItem.scss'

export type SearchResultItemCallback = (searchResult: SearchResult) => void

export default class SearchResultItem {
  private container: HTMLElement

  constructor(searchResult: SearchResult, callback: SearchResultItemCallback) {
    this.container = document.createElement('div')
    this.container.classList.add('mwz-search-result-item')
    // this.container.onclick = () => callback(searchResult)
    const icon = document.createElement('img')
    icon.src = searchResult.cache[30]
    icon.classList.add('mwz-search-result-item-icon')

    const textContainer = document.createElement('div')
    textContainer.classList.add('mwz-search-result-item-text-container')
    if (searchResult.title.length > 0) {
      const titleSpan = document.createElement('span')
      titleSpan.classList.add('mwz-search-result-item-title')
      titleSpan.innerHTML = searchResult.title
      textContainer.appendChild(titleSpan)
    }
    if (searchResult.subtitle && searchResult.subtitle.length > 0) {
      const subtitleSpan = document.createElement('span')
      subtitleSpan.classList.add('mwz-search-result-item-subtitle')
      subtitleSpan.innerHTML = searchResult.subtitle
      textContainer.appendChild(subtitleSpan)
    }
    if (searchResult.floorLabel != null && searchResult.floorLabel !== undefined) {
      const floorSpan = document.createElement('span')
      floorSpan.classList.add('mwz-search-result-item-floor')
      floorSpan.innerHTML = searchResult.floorLabel
      textContainer.appendChild(floorSpan)
    }

    this.container.appendChild(icon)
    this.container.appendChild(textContainer)
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }
}
