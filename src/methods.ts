import { local, getLocals } from './translate'

const attachMethods = (mapInstance: any) => {
  const onMapClick = (e: any): void => {
    if (e.venue) {
      mapInstance.centerOnVenue(e.venue)
    }
  }
  mapInstance.on('mapwize:click', onMapClick)
  
  mapInstance.setDirectionMode = () => {
    return mapInstance.searchDirections.show()
  }
  mapInstance.setFrom = (from: any) => {
    return mapInstance.searchDirections.setFrom(from)
  }
  mapInstance.setTo = (to: any) => {
    return mapInstance.searchDirections.setTo(to)
  }
  mapInstance.getDirection = () => {
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
  
  mapInstance.destroy = () => {
    mapInstance.searchResults.destroy()
    mapInstance.searchBar.destroy()
    mapInstance.searchDirections.destroy()
    
    mapInstance.footerVenue.destroy()
    mapInstance.footerSelection.destroy()
    mapInstance.footerDirections.destroy()
    
    mapInstance.off('mapwize:click', onMapClick)
    $(mapInstance.getContainer()).removeClass('mapwizeui')
    
    mapInstance.remove()
  }
}

export { attachMethods  as default }
