export default class NoResultItem {
  private container: HTMLElement

  constructor(noResultLabel: string) {
    this.container = document.createElement('div')
    this.container.classList.add('mwz-search-result-no-result-item')

    const textContainer = document.createElement('div')
    textContainer.classList.add('mwz-search-result-item-text-container')
    const titleSpan = document.createElement('span')
    titleSpan.classList.add('mwz-search-result-item-title')
    titleSpan.innerHTML = noResultLabel
    textContainer.appendChild(titleSpan)
    this.container.appendChild(textContainer)
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }
}
