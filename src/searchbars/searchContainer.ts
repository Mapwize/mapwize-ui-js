import SearchBar from './search/searchBar'
import SearchDirectionBar from './searchDirection/searchDirectionBar'
import SearchResultList from './searchResult/searchResultList/searchResultList'

export interface SearchContainerState {
  isInSearch: boolean
}

export default class SearchContainer {
  private container: HTMLElement

  constructor(searchBar: SearchBar, searchDirectionBar: SearchDirectionBar, searchResultList: SearchResultList) {
    this.container = document.createElement('div')
    this.container.classList.add('mwz-search-container')
    this.container.appendChild(searchBar.getHtmlElement())
    this.container.appendChild(searchDirectionBar.getHtmlElement())
    this.container.appendChild(searchResultList.getHtmlElement())
  }

  public renderDefault(state: SearchContainerState): void {
    if (state.isInSearch) {
      this.container.classList.add('mwz-in-search')
    } else {
      this.container.classList.remove('mwz-in-search')
    }
  }

  public render(oldState: SearchContainerState, state: SearchContainerState): void {
    if (oldState.isInSearch === state.isInSearch) {
      return
    }
    if (state.isInSearch) {
      this.container.classList.add('mwz-in-search')
    } else {
      this.container.classList.remove('mwz-in-search')
    }
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  // public setDirectionModes(modes:Array<DirectionMode>) {
  //   this.searchDirectionBar.setDirectionModes(modes)
  // }

  // public setSelectedMode(mode:DirectionMode) {
  //   this.searchDirectionBar.setSelectedMode(mode)
  // }

  // public openSearch() {
  //   this.searchBar.setInSearch(true)
  //   this.container.classList.add('mwz-in-search')
  //   this.searchResultList.getHtmlElement().classList.remove('in-direction-search')
  // }

  // public closeSearch() {
  //   this.searchBar.setInSearch(false)
  //   this.container.classList.remove('mwz-in-search')
  // }

  // public showResult(result: Array<SearchResult>) {
  //   this.searchResultList.showResult(result)
  // }

  // public hideResult() {
  //   this.searchResultList.hideResult()
  // }

  // public showSearchBar() {
  //   this.searchBar.setHidden(false)
  // }

  // public hideSearchBar() {
  //   this.searchBar.setHidden(true)
  // }

  // public showSearchDirectionBar() {
  //   this.searchDirectionBar.setHidden(false)
  //   this.container.classList.add('mwz-in-search')
  //   this.searchResultList.getHtmlElement().classList.add('in-direction-search')
  // }

  // public hideSearchDirectionBar() {
  //   this.container.classList.remove('mwz-in-search')
  //   this.searchDirectionBar.setHidden(true)
  // }
}
