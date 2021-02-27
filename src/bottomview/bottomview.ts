import { DevCallbackInterceptor } from '../devCallbackInterceptor'
import './bottomview.scss'
import BottomViewDirection, { BottomViewDirectionProps } from './direction/bottomviewDirection'
import { buildPlaceDetailsViews } from './placeDetails/placeDetailsFactory'
import { buildPlacelistViews } from './placelistDetails/placelistDetailsFactory'

export interface BottomViewState {
  expanded: boolean
  hidden: boolean
  content?: any
  directionContent?: BottomViewDirectionProps
  language: string
}

export interface BottomViewListener {
  onExpandClick: () => void
  onDirectionClick: () => void
  onPhoneClick: (phoneNumber: string) => void
  onWebsiteClick: (website: string) => void
  onShareClick: (target: HTMLElement, shareLink: string) => void
  onInformationClick: (placeDetails: any) => void
  onPlaceClick: (place: any) => void
  onDirectionToPlaceClick: (place: any) => void
}

export default class BottomView {
  private container: HTMLElement
  private listener: BottomViewListener
  private directionView: BottomViewDirection
  private photosView: HTMLElement
  private smallDetails: HTMLElement
  private largeDetails: HTMLElement
  private devCallbackInterceptor: DevCallbackInterceptor
  private mainColor: string

  constructor(listener: BottomViewListener, devCallbackInterceptor: DevCallbackInterceptor, mainColor: string) {
    this.listener = listener
    this.devCallbackInterceptor = devCallbackInterceptor
    this.mainColor = mainColor
    this.container = document.createElement('div')
    this.container.classList.add('mwz-bottom-view')
    this.container.classList.add('mwz-gone')
    this.directionView = new BottomViewDirection()
    this.container.appendChild(this.directionView.getHtmlElement())
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  public renderDefault(state: BottomViewState): void {
    this.setExpanded(state.expanded)
    this.setHidden(state.hidden)
    this.setContent(state.content, state.language)
    this.setDirectionContent(state.directionContent)
  }

  public render(oldState: BottomViewState, state: BottomViewState): void {
    if (oldState.content !== state.content) {
      this.setContent(state.content, state.language)
    }
    if (oldState.hidden !== state.hidden) {
      this.setHidden(state.hidden)
    }
    if (oldState.expanded !== state.expanded) {
      this.setExpanded(state.expanded)
    }
    if (oldState.directionContent !== state.directionContent) {
      this.setDirectionContent(state.directionContent)
    }
  }

  public setContent(content: any | null, language: string): void {
    if (this.smallDetails) {
      this.smallDetails.remove()
    }
    if (this.largeDetails) {
      this.largeDetails.remove()
    }
    if (this.photosView) {
      this.photosView.remove()
    }
    const placeDetailsListener = {
      ...this.listener,
      onCloseClick: () => {
        this.listener.onExpandClick()
      },
    }
    if (content && content.objectClass === 'placeDetails') {
      const placeDetailsView = buildPlaceDetailsViews(content, language, this.mainColor, this.devCallbackInterceptor, placeDetailsListener)
      this.devCallbackInterceptor.onDetailsWillBeDisplayed(content, placeDetailsView)
      this.photosView = placeDetailsView.photosView
      this.container.appendChild(this.photosView)
      this.smallDetails = placeDetailsView.smallView
      this.container.appendChild(this.smallDetails)
      this.largeDetails = placeDetailsView.largeView
      this.container.appendChild(this.largeDetails)
      this.container.onclick = (e) => {
        if (!this.container.classList.contains('mwz-expanded')) {
          this.listener.onExpandClick()
        }
      }
    }
    if (content && content.objectClass === 'placeList') {
      const placelistDetailsView = buildPlacelistViews(content, this.mainColor, language, this.devCallbackInterceptor, placeDetailsListener)
      this.photosView = placelistDetailsView.photosView
      this.container.appendChild(this.photosView)
      this.smallDetails = placelistDetailsView.smallView
      this.container.appendChild(this.smallDetails)
      this.largeDetails = placelistDetailsView.largeView
      this.container.appendChild(this.largeDetails)
      this.container.onclick = null
    }
  }

  private setDirectionContent(directionContent?: BottomViewDirectionProps): void {
    if (directionContent) {
      this.directionView.setProps(directionContent)
      this.directionView.setHidden(false)
      this.container.classList.add('in-direction')
      this.container.onclick = null
    } else {
      this.directionView.setHidden(true)
      this.container.classList.remove('in-direction')
      this.container.onclick = (e) => {
        if (!this.container.classList.contains('mwz-expanded')) {
          this.listener.onExpandClick()
        }
      }
    }
  }

  private setExpanded(expanded: boolean): void {
    if (expanded) {
      this.container.classList.add('mwz-expanded')
    } else {
      this.container.classList.add('in-transition')
      // Hack to make transition smoother
      setTimeout(() => this.container.classList.remove('in-transition'), 300)
      this.container.classList.remove('mwz-expanded')
    }
  }

  private setHidden(hidden: boolean): void {
    if (hidden) {
      this.container.classList.add('mwz-gone')
    } else {
      this.container.classList.remove('mwz-gone')
    }
  }
}
