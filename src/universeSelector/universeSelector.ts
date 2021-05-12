import { Universe } from '../types/types'
import { buildTooltip } from '../utils/tippyConfig'

export interface UniverseSelectorState {
  isExpanded: boolean
  isHidden: boolean
  universes: Universe[]
  selectedUniverse?: Universe
  tooltipMessage: string
}

export interface UniverseSelectorListener {
  onUniverseSelected: (universe: Universe) => void
  onClick: () => void
}

export default class UniverseSelector {
  private container: HTMLElement
  private listener: UniverseSelectorListener
  private expanded: boolean
  private list: HTMLElement
  private title: HTMLElement
  private tooltip: any

  constructor(listener: UniverseSelectorListener) {
    this.listener = listener
    this.container = document.createElement('div')
    this.container.classList.add('mwz-universe-selector')
    this.container.onclick = () => {
      this.listener.onClick()
    }

    const selected = document.createElement('div')
    selected.classList.add('mwz-universe-selector-selected')
    this.container.appendChild(selected)

    const image = document.createElement('img')
    image.classList.add('mwz-universe-selector-image')
    image.src =
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUwIDUwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MCA1MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxnPjxwYXRoIGQ9Ik00Mi43LDMyLjVMMzcuMiwyOWw1LjUtMy40YzAuMi0wLjEsMC4zLTAuNCwwLjMtMC42YzAtMC4yLTAuMS0wLjUtMC4zLTAuNkwzNy4yLDIxbDUuNS0zLjRjMC4yLTAuMSwwLjMtMC40LDAuMy0wLjZzLTAuMS0wLjUtMC4zLTAuNkwyNS40LDUuNWMtMC4yLTAuMS0wLjUtMC4xLTAuNywwTDcuMywxNi4zQzcuMSwxNi41LDcsMTYuNyw3LDE2LjljMCwwLjIsMC4xLDAuNSwwLjMsMC42bDUuNSwzLjRsLTUuNSwzLjRDNy4xLDI0LjUsNywyNC44LDcsMjVzMC4xLDAuNSwwLjMsMC42bDUuNSwzLjRsLTUuNSwzLjRDNy4xLDMyLjYsNywzMi44LDcsMzMuMWMwLDAuMiwwLjEsMC41LDAuMywwLjZsMTcuMywxMC45YzAuMSwwLjEsMC4yLDAuMSwwLjQsMC4xczAuMywwLDAuNC0wLjFsMTcuMy0xMC45YzAuMi0wLjEsMC4zLTAuNCwwLjMtMC42QzQzLDMyLjgsNDIuOSwzMi42LDQyLjcsMzIuNXogTTksMTYuOWwxNi0xMGwxNiwxMEwyNSwyN0w5LDE2Ljl6IE05LDI1bDUuMS0zLjJsMTAuNSw2LjZjMC4xLDAuMSwwLjIsMC4xLDAuNCwwLjFzMC4zLDAsMC40LTAuMWwxMC41LTYuNkw0MSwyNUwyNSwzNUw5LDI1eiBNMjUsNDMuMWwtMTYtMTBsNS4xLTMuMmwxMC41LDYuNmMwLjEsMC4xLDAuMiwwLjEsMC40LDAuMXMwLjMsMCwwLjQtMC4xbDEwLjUtNi42bDUuMSwzLjJMMjUsNDMuMXoiLz48L2c+PC9nPjwvc3ZnPg=='
    selected.appendChild(image)

    this.title = document.createElement('span')
    this.title.classList.add('mwz-universe-selector-title')
    selected.appendChild(this.title)

    this.list = document.createElement('div')
    this.list.classList.add('mwz-universe-selector-list')
    this.list.classList.add('mwz-gone')
    this.container.appendChild(this.list)

    this.tooltip = buildTooltip(this.container, 'Change the venue universe')
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public renderDefault(state: UniverseSelectorState): void {
    this.setHidden(state.isHidden)
    this.setExpanded(state.isExpanded)
    this.setSelectedUniverse(state.selectedUniverse)
    this.setUniverses(state.universes)
    this.setTooltipMessage(state.tooltipMessage)
  }

  public render(oldState: UniverseSelectorState, state: UniverseSelectorState): void {
    if (oldState.isExpanded !== state.isExpanded) {
      this.setExpanded(state.isExpanded)
    }
    if (oldState.isHidden !== state.isHidden) {
      this.setHidden(state.isHidden)
    }
    if (oldState.selectedUniverse !== state.selectedUniverse) {
      this.setSelectedUniverse(state.selectedUniverse)
    }
    if (oldState.universes !== state.universes) {
      this.setUniverses(state.universes)
    }
    if (oldState.tooltipMessage !== state.tooltipMessage) {
      this.setTooltipMessage(state.tooltipMessage)
    }
  }

  private setTooltipMessage(message: string): void {
    this.tooltip.setContent(message)
  }

  private setUniverses(universes: Universe[]): void {
    this.list.innerHTML = ''
    universes.forEach((u) => {
      const element = document.createElement('span')
      element.innerHTML = u.name
      element.classList.add('mwz-universe-selector-list-item')
      element.onclick = (e) => {
        this.listener.onUniverseSelected(u)
        e.stopPropagation()
      }
      this.list.appendChild(element)
    })
  }

  private setSelectedUniverse(universe: Universe): void {
    if (universe) {
      this.title.innerHTML = universe.name
    }
  }

  private setHidden(hidden: boolean): void {
    if (hidden) {
      this.container.classList.add('mwz-gone')
    } else {
      this.container.classList.remove('mwz-gone')
    }
  }

  private setExpanded(expanded: boolean): void {
    this.expanded = expanded
    if (this.expanded) {
      this.container.classList.add('mwz-expanded')
      this.list.classList.remove('mwz-gone')
    } else {
      this.container.classList.remove('mwz-expanded')
      this.list.classList.add('mwz-gone')
    }
  }
}
