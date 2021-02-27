import { DevCallbackInterceptor } from './devCallbackInterceptor'

export default class MapActionsDispatcher {
  private mapwizeMap: any
  private devCallbackInterceptor: DevCallbackInterceptor

  constructor(mapwizeMap: any, devCallbackInterceptor: DevCallbackInterceptor) {
    this.mapwizeMap = mapwizeMap
    this.devCallbackInterceptor = devCallbackInterceptor
  }

  public selectPlace(place: any, preventCenter: boolean = false) {
    this.mapwizeMap.unselectPlace()
    this.mapwizeMap.removeMarkers()
    const projection = this.mapwizeMap.project([place.marker.longitude, place.marker.longitude])
    // TODO Improve for mobile
    /*if (projection.x < 400 && !preventCenter) {
      this.mapwizeMap.centerOnPlace(place)
    }*/
    this.mapwizeMap.selectPlace(place)
  }

  public selectPlacelist(placelist: any) {
    this.mapwizeMap.unselectPlace()
    this.mapwizeMap.addMarkerOnPlaceList(placelist)
  }

  public unselectContent() {
    this.mapwizeMap.unselectPlace()
    this.mapwizeMap.removeMarkers()
  }

  public centerOnPlace(place: any) {
    let zoom = this.mapwizeMap.getZoom()
    if (zoom < 19) {
      zoom = 19
    }
    const opts = this.devCallbackInterceptor.shouldMoveToSelectedObject(place, { centerOnElement: true, zoom: zoom })
    if (opts.centerOnElement) {
      this.mapwizeMap.centerOnPlace(place, opts)
    }
  }

  public centerOnPlacelist(placelist: any) {
    let zoom = this.mapwizeMap.getZoom()
    if (zoom > 19) {
      zoom = 19
    }
    const opts = this.devCallbackInterceptor.shouldMoveToSelectedObject(placelist, { centerOnElement: true, zoom: zoom })
    if (opts.centerOnElement) {
      this.mapwizeMap.centerOnVenue(placelist.venue, opts)
    }
  }

  public centerOnVenue(venue: any) {
    this.mapwizeMap.centerOnVenue(venue)
  }

  public startDirection(direction: any, options: any, startLabel: string, endLabel: string) {
    options.startMarkerOptions = {
      textField: startLabel,
    }
    options.endMarkerOptions = {
      textField: endLabel,
    }
    const directionOptions = this.devCallbackInterceptor.onDirectionWillBeDisplayed(options, direction)
    this.mapwizeMap.setDirection(direction, directionOptions)
  }

  public stopDirection() {
    this.mapwizeMap.removeDirection()
  }

  public setLeftMargin() {
    this.mapwizeMap.setLeftMargin(400)
  }

  public setLanguage(language: string) {
    this.mapwizeMap.setLanguage(language)
  }

  public hasIndoorLocation(): boolean {
    const userLocation = this.mapwizeMap.getUserLocation()
    return userLocation && (userLocation.floor || userLocation.floor === 0)
  }

  public getUserLocation(): any {
    return this.mapwizeMap.getUserLocation()
  }
}
