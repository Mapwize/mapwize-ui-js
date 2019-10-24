import { locale, getLocales, getLocale } from './translate'
import { unit, getUnits, getUnit } from './measure'

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
  mapInstance.getMode = (): any => {
    return mapInstance.searchDirections.getMode()
  }
  mapInstance.setMode = (modeId: string): void => {
    return mapInstance.searchDirections.setMode(modeId)
  }
  mapInstance.getSelectedPlace = (): void => {
    return mapInstance.footerSelection.getSelectedPlace()
  }
  mapInstance.setSelectedPlace = (place: any): void => {
    return mapInstance.footerSelection.setSelectedPlace(place)
  }
  
  mapInstance.setLocale = (newLocale: string): string => {
    const currentLocal = locale(newLocale)
    
    mapInstance.setPreferredLanguage(currentLocal)
    mapInstance.searchBar.refreshLocale()
    mapInstance.searchDirections.refreshLocale()
    mapInstance.searchResults.refreshLocale()
    
    return currentLocal
  }
  mapInstance.getLocales = getLocales
  mapInstance.getLocale = getLocale


  mapInstance.setUnit = (newUnit: string): string => {
    const currentUnit = unit(newUnit)
    
    mapInstance.footerDirections.refreshUnit()
    
    return currentUnit
  }
  mapInstance.getUnits = getUnits
  mapInstance.getUnit = getUnit

  
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
