import { SearchResult } from '../../../types/types'
import './searchResultList.scss'
import SearchResultItem, { SearchResultItemCallback } from '../searchResultItem/searchResultItem'
import NoResultItem from '../searchResultItem/noResultItem'
import { DevCallbackInterceptor } from '../../../devCallbackInterceptor'
import CurrentLocationItem from '../searchResultItem/currentLocationItem'

export interface SearchResultListener {
  onResultSelected: (searchResult: SearchResult) => void
  onCurrentLocationSelected: () => void
}

export interface SearchResultListState {
  isHidden: boolean
  isInDirectionSearch: boolean
  results?: SearchResult[]
  showCurrentLocation: string | undefined
  noResultLabel: string
}

export default class SearchResultList {
  private container: HTMLElement
  private listener: SearchResultListener
  private devCallbackInterceptor: DevCallbackInterceptor

  constructor(listener: SearchResultListener, devCallbackInterceptor: DevCallbackInterceptor) {
    this.listener = listener
    this.container = document.createElement('div')
    this.container.classList.add('mwz-search-result-list')
    this.container.classList.add('mwz-gone')
    this.devCallbackInterceptor = devCallbackInterceptor
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public renderDefault(state: SearchResultListState): void {
    this.setHidden(state.isHidden)
    this.setResults(state.results, state.noResultLabel, state.showCurrentLocation)
    this.setIsInDirectionSearch(state.isInDirectionSearch)
  }

  public render(oldState: SearchResultListState, state: SearchResultListState): void {
    if (oldState.isHidden !== state.isHidden) {
      this.setHidden(state.isHidden)
    }
    if (oldState.results !== state.results || oldState.showCurrentLocation !== state.showCurrentLocation) {
      this.setResults(state.results, state.noResultLabel, state.showCurrentLocation)
    }
    if (oldState.isInDirectionSearch !== state.isInDirectionSearch) {
      this.setIsInDirectionSearch(state.isInDirectionSearch)
    }
  }

  public setResults(results: SearchResult[], noResultLabel: string, showCurrentLocation: string | undefined): void {
    this.container.innerHTML = ''
    this.container.scrollTop = 0
    if (showCurrentLocation) {
      const htmlElement = new CurrentLocationItem(showCurrentLocation).getHtmlElement()
      htmlElement.onclick = this.listener.onCurrentLocationSelected
      this.container.appendChild(htmlElement)
    }
    if (results && results.length === 0) {
      this.container.appendChild(new NoResultItem(noResultLabel).getHtmlElement())
    } else if (results) {
      results.forEach((r) => {
        const resultItem = new SearchResultItem(r, this.listener.onResultSelected)
        const htmlElement = this.devCallbackInterceptor.onObjectWillBeDisplayedInSearch(resultItem.getHtmlElement(), r)
        htmlElement.onclick = () => this.listener.onResultSelected(r)
        this.container.appendChild(htmlElement)
      })
    }
  }

  public setHidden(hidden: boolean): void {
    if (hidden) {
      this.container.classList.add('mwz-gone')
    } else {
      this.container.classList.remove('mwz-gone')
    }
  }

  private setIsInDirectionSearch(isInDirectionSearch: boolean): void {
    if (isInDirectionSearch) {
      this.container.classList.add('in-direction-search')
    } else {
      this.container.classList.remove('in-direction-search')
    }
  }
}
