import { defaults } from 'lodash'

type Options = {
  showCompass?: boolean,
  showZoom?: boolean,
  visualizePitch?: boolean
};

const defaultOptions: Options = {
  showCompass: true,
  showZoom: true,
  visualizePitch: false
};

class NavigationControl {
  private _map: any;
  private options: Options;
  private _container: HTMLElement;
  private _zoomInButton: HTMLElement;
  private _zoomOutButton: HTMLElement;
  private _compass: HTMLElement;
  private _compassArrow: HTMLElement;
  
  constructor(options: Options) {
    this.options = defaults(options, defaultOptions);
    
    this._container = document.createElement('div')
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group mwz-ctrl-navigation'
    
    this._zoomInButton = this._createButton('mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-in', 'Zoom in', (e) => this._map.zoomIn({}, {originalEvent: e}));
    this._zoomOutButton = this._createButton('mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-out', 'Zoom out', (e) => this._map.zoomOut({}, {originalEvent: e}));

    this._compass = this._createButton('mapboxgl-ctrl-icon mapboxgl-ctrl-compass', 'Reset bearing to north', (e) => this._map.resetNorthPitch({}, {originalEvent: e}));
    
    this._compassArrow = document.createElement('span')
    this._compassArrow.className = 'mapboxgl-ctrl-compass-arrow'
    this._compass.appendChild(this._compassArrow);
  }
  
  onAdd (map: any) {
    this._map = map
    
    this._onZoomChange = this._onZoomChange.bind(this)
    this._onBearingChange = this._onBearingChange.bind(this)
    
    this._map.on('zoom', this._onZoomChange)
    this._map.on('rotate', this._onBearingChange)
    this._map.on('pitch', this._onBearingChange);

    this._onZoomChange()
    this._onBearingChange()
    
    return this._container
  }
  
  onRemove () {
    this._container.parentNode.removeChild(this._container)
    
    this._map.off('zoom', this._onZoomChange)
    this._map.off('rotate', this._onBearingChange)
    this._map.off('pitch', this._onBearingChange)
    this._map = undefined
  }
  
  _onZoomChange () {
    this._updateZoomButtons();
  }
  _onBearingChange () {
    this._rotateCompassArrow();
  }
  
  _rotateCompassArrow() {
    const rotate = this.options.visualizePitch ?
    `scale(${1 / Math.pow(Math.cos(this._map.transform.pitch * (Math.PI / 180)), 0.5)}) rotateX(${this._map.transform.pitch}deg) rotateZ(${this._map.transform.angle * (180 / Math.PI)}deg)` :
    `rotate(${this._map.transform.angle * (180 / Math.PI)}deg)`;
    
    this._compassArrow.style.transform = rotate;
  }
  
  _updateZoomButtons() {
    const zoom = this._map.getZoom();
    if (zoom === this._map.getMaxZoom()) {
      this._zoomInButton.classList.add('mapboxgl-ctrl-icon-disabled');
    } else {
      this._zoomInButton.classList.remove('mapboxgl-ctrl-icon-disabled');
    }
    if (zoom === this._map.getMinZoom()) {
      this._zoomOutButton.classList.add('mapboxgl-ctrl-icon-disabled');
    } else {
      this._zoomOutButton.classList.remove('mapboxgl-ctrl-icon-disabled');
    }
  }
  
  _createButton(className: string, ariaLabel: string, fn: (e: any) => any) {
    const a = document.createElement('button')
    a.className = className
    a.type = 'button';
    a.title = ariaLabel;
    a.setAttribute('aria-label', ariaLabel);
    a.addEventListener('click', fn);
    
    this._container.appendChild(a);
    return a;
  }
}

export default NavigationControl;
