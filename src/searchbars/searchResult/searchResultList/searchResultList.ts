import { DevCallbackInterceptor } from '../../../devCallbackInterceptor'
import { SearchResult, Universe } from '../../../types/types'
import CurrentLocationItem from '../searchResultItem/currentLocationItem'
import NoResultItem from '../searchResultItem/noResultItem'
import SearchResultItem from '../searchResultItem/searchResultItem'

export interface SearchResultListener {
  onResultSelected: (searchResult: SearchResult, universe?: Universe | undefined) => void
  onCurrentLocationSelected: () => void
}

export interface SearchResultListState {
  isHidden: boolean
  isInDirectionSearch: boolean
  results?: SearchResult[]
  universes?: Universe[]
  currentUniverse?: Universe
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
    this.setResults(state.results, state.universes, state.currentUniverse, state.noResultLabel, state.showCurrentLocation)
    this.setIsInDirectionSearch(state.isInDirectionSearch)
  }

  public render(oldState: SearchResultListState, state: SearchResultListState): void {
    if (oldState.isHidden !== state.isHidden) {
      this.setHidden(state.isHidden)
    }
    if (oldState.results !== state.results || oldState.showCurrentLocation !== state.showCurrentLocation) {
      this.setResults(state.results, state.universes, state.currentUniverse, state.noResultLabel, state.showCurrentLocation)
    }
    if (oldState.isInDirectionSearch !== state.isInDirectionSearch) {
      this.setIsInDirectionSearch(state.isInDirectionSearch)
    }
  }

  public setResults(results: SearchResult[], universes: Universe[], currentUniverse: Universe, noResultLabel: string, showCurrentLocation: string | undefined): void {
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
      this.buildList(results, universes, currentUniverse).forEach((r) => {
        this.container.appendChild(r)
      })
    }
  }

  private buildList(results: any[], universes: Universe[], currentUniverse: Universe): HTMLElement[] {
    let elements: HTMLElement[] = []
    if (universes.length <= 1) {
      results.forEach((r) => {
        const resultItem = new SearchResultItem(r, this.listener.onResultSelected)
        const htmlElement = this.devCallbackInterceptor.onObjectWillBeDisplayedInSearch(resultItem.getHtmlElement(), r)
        htmlElement.onclick = () => this.listener.onResultSelected(r)
        elements.push(htmlElement)
      })
      return elements
    }

    let grouped: any = {}
    universes.forEach((u) => {
      grouped[u._id] = []
    })
    results.forEach((r) => {
      r.universes.forEach((u: any) => {
        if (grouped[u]) {
          grouped[u].push(r)
        }
      })
    })

    let groupedArray: any[] = []
    for (const key in grouped) {
      if (grouped[key].length === 0) {
        continue
      }
      if (key === currentUniverse._id) {
        let innerElements: any[] = []
        grouped[key].forEach((r: any) => {
          const resultItem = new SearchResultItem(r, this.listener.onResultSelected)
          const htmlElement = this.devCallbackInterceptor.onObjectWillBeDisplayedInSearch(resultItem.getHtmlElement(), r)
          htmlElement.onclick = () => this.listener.onResultSelected(r)
          innerElements.push(htmlElement)
        })
        groupedArray = innerElements.concat(groupedArray)
      } else {
        let innerElements: any[] = []
        const separator = document.createElement('div')
        separator.classList.add('mwz-result-list-universe-separator')
        const universe = universes.find((u) => u._id === key)
        separator.innerHTML = universe.name
        innerElements.push(separator)
        grouped[key].forEach((r: any) => {
          const resultItem = new SearchResultItem(r, this.listener.onResultSelected)
          const htmlElement = this.devCallbackInterceptor.onObjectWillBeDisplayedInSearch(resultItem.getHtmlElement(), r)
          htmlElement.onclick = () => this.listener.onResultSelected(r, universe)
          innerElements.push(htmlElement)
        })
        groupedArray = groupedArray.concat(innerElements)
      }
    }
    return groupedArray
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
