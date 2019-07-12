import { local, getLocals } from './translate'
import { unit, getUnits } from './measure'

const attachMethods = (mapInstance: any) => {
  const onMapClick = (e: any): void => {
    if (e.venue) {
      mapInstance.centerOnVenue(e.venue)
    }
  }
  mapInstance.on('mapwize:click', onMapClick)

  const onDirectionStart = (e: any): void => {
    // mapInstance.searchDirections.show()
    // mapInstance.searchDirections.setFrom(from)
    // mapInstance.searchDirections.setTo(to)
  }
  mapInstance.on('mapwize:directionstart', onDirectionStart)
  
  mapInstance.setDirectionMode = (): void => {
    return mapInstance.searchDirections.show()
  }
  mapInstance.setFrom = (from: any): void => {
    return mapInstance.searchDirections.setFrom(from)
  }
  mapInstance.setTo = (to: any): void => {
    return mapInstance.searchDirections.setTo(to)
  }
  mapInstance.getDirection = (): any => {
    return mapInstance.searchDirections.getDirection()
  }
  
  mapInstance.local = (newLocal: string): string => {
    const currentLocal = local(newLocal)
    
    mapInstance.setPreferredLanguage(currentLocal)
    mapInstance.searchBar.refreshLocal()
    mapInstance.searchResults.refreshLocal()
    
    return currentLocal
  }
  mapInstance.getLocals = getLocals

  mapInstance.unit = (newUnit: string): string => {
    const currentUnit = unit(newUnit)
    
    mapInstance.footerDirections.refreshUnit()
    
    return currentUnit
  }
  mapInstance.getUnits = getUnits

  
  mapInstance.destroy = (): void => {
    mapInstance.searchResults.destroy()
    mapInstance.searchBar.destroy()
    mapInstance.searchDirections.destroy()
    
    mapInstance.footerVenue.destroy()
    mapInstance.footerSelection.destroy()
    mapInstance.footerDirections.destroy()
    
    mapInstance.off('mapwize:click', onMapClick)
    mapInstance.off('mapwize:directionstart', onDirectionStart)
    $(mapInstance.getContainer()).removeClass('mapwizeui')
    
    mapInstance.remove()
  }
}

export { attachMethods  as default }
