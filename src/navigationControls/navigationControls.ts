import { lang_reset_north, lang_zoom_in, lang_zoom_out } from '../localizor/localizor'
import { buildTooltip } from '../utils/tippyConfig'
import './navigationControls.scss'

type Options = {
  showCompass?: boolean
  showZoom?: boolean
  visualizePitch?: boolean
}

export interface NavigationControlState {
  preferredLanguage: string
}

const defaultOptions: Options = {
  showCompass: true,
  showZoom: true,
  visualizePitch: true,
}

class NavigationControl {
  private map: any
  private options: Options
  private container: HTMLElement
  private zoomInButton: HTMLElement
  private zoomOutButton: HTMLElement
  private compass: HTMLElement
  private compassIcon: HTMLElement
  private zoomInTooltip: any
  private zoomOutTooltip: any
  private compassTooltip: any

  constructor(map: any, options: Options) {
    this.map = map
    this.options = {
      ...defaultOptions,
      ...options,
    }
    this.container = document.createElement('div')
    this.container.className = 'mwz-navigation-controller'
    this.container.addEventListener('contextmenu', (e) => e.preventDefault())

    if (options.showZoom) {
      this.zoomInButton = this._createButton('mapboxgl-ctrl-zoom-in', '+', (e) => this.map.zoomIn({}, { originalEvent: e }))
      this.zoomOutButton = this._createButton('mapboxgl-ctrl-zoom-out', '-', (e) => this.map.zoomOut({}, { originalEvent: e }))
      this.zoomInTooltip = buildTooltip(this.zoomInButton, '', { placement: 'left' })
      this.zoomOutTooltip = buildTooltip(this.zoomOutButton, '', { placement: 'left' })
      this._onZoomChange = this._onZoomChange.bind(this)
      this.map.on('zoom', this._onZoomChange)
      this._onZoomChange()
    }
    if (options.showCompass) {
      this.compass = this._createButton('mapboxgl-ctrl-compass', '', (e) => {
        this.map.resetNorthPitch({}, { originalEvent: e })
      })
      this.compassTooltip = buildTooltip(this.compass, '', { placement: 'left' })

      this.compassIcon = this._createSpan('mapboxgl-ctrl-icon', '', this.compass)
      this.compassIcon.setAttribute('aria-hidden', 'true')
      this._onBearingChange = this._onBearingChange.bind(this)
      this.map.on('pitch', this._onBearingChange)
      this.map.on('rotate', this._onBearingChange)
      this._onBearingChange()
    }
  }

  public renderDefault(state: NavigationControlState) {
    if (this.zoomInTooltip) {
      this.zoomInTooltip.setContent(lang_zoom_in(state.preferredLanguage))
    }
    if (this.zoomOutTooltip) {
      this.zoomOutTooltip.setContent(lang_zoom_out(state.preferredLanguage))
    }
    if (this.compassTooltip) {
      this.compassTooltip.setContent(lang_reset_north(state.preferredLanguage))
    }
  }

  public render(oldState: NavigationControlState, state: NavigationControlState) {
    if (state.preferredLanguage !== oldState.preferredLanguage) {
      if (this.zoomInTooltip) {
        this.zoomInTooltip.setContent(lang_zoom_in(state.preferredLanguage))
      }
      if (this.zoomOutTooltip) {
        this.zoomOutTooltip.setContent(lang_zoom_out(state.preferredLanguage))
      }
      if (this.compassTooltip) {
        this.compassTooltip.setContent(lang_reset_north(state.preferredLanguage))
      }
    }
  }

  public getHtmlElement(): HTMLElement {
    return this.container
  }

  private _onZoomChange(): void {
    this._updateZoomButtons()
  }
  private _onBearingChange(): void {
    this._rotateCompassArrow()
  }

  private _rotateCompassArrow(): void {
    const rotate = this.options.visualizePitch
      ? `scale(${1 / Math.pow(Math.cos(this.map.transform.pitch * (Math.PI / 180)), 0.5)}) rotateX(${this.map.transform.pitch}deg) rotateZ(${
          this.map.transform.angle * (180 / Math.PI)
        }deg)`
      : `rotate(${this.map.transform.angle * (180 / Math.PI)}deg)`

    this.compassIcon.style.transform = rotate

    if (this.map.transform.angle === 0) {
      this.compass.classList.add('mwz-zero-degree')
    } else {
      this.compass.classList.remove('mwz-zero-degree')
    }
  }

  private _updateZoomButtons(): void {
    const zoom = this.map.getZoom()
    if (zoom === this.map.getMaxZoom()) {
      this.zoomInButton.classList.add('mapboxgl-ctrl-icon-disabled')
    } else {
      this.zoomInButton.classList.remove('mapboxgl-ctrl-icon-disabled')
    }
    if (zoom === this.map.getMinZoom()) {
      this.zoomOutButton.classList.add('mapboxgl-ctrl-icon-disabled')
    } else {
      this.zoomOutButton.classList.remove('mapboxgl-ctrl-icon-disabled')
    }
  }

  private _createButton(className: string, content: string, fn: (e: any) => any): HTMLElement {
    const a = document.createElement('button')
    a.className = className
    a.innerHTML = content
    a.type = 'button'
    a.setAttribute('data-toggle', 'mwz-tooltip')
    a.setAttribute('data-placement', 'left')
    a.setAttribute('data-html', 'true')
    a.addEventListener('click', fn)
    this.container.appendChild(a)
    return a
  }

  private _createSpan(classes: string, content: string, container: any): any {
    const span = document.createElement('span')
    span.className = classes
    container.appendChild(span)
    return span
  }
}

export default NavigationControl
