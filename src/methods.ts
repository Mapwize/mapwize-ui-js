import { locale, getLocales } from './translate'
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

  /**
  * @instance
  * @memberof Map
  * @desc Activates the direction mode. This displays the directions header with the from and to fields.
  * @function setDirectionMode
  * @returns {object}
  */
  mapInstance.setDirectionMode = (): void => {
    return mapInstance.searchDirections.show()
  }

  /**
  * @instance
  * @memberof Map
  * @desc Set the `from` field of the direction header
  * @function setFrom
  * @param  {object} from Can be one of those formats
  *      { objectClass: 'place', {mapwize place object} }
  *      { objectClass: 'placeList', {mapwize placeList object} }
  *      { objectClass: 'userLocation' }
  *      { latitude, longitude, floor, venueId }
  */
  mapInstance.setFrom = (from: any): void => {
    return mapInstance.searchDirections.setFrom(from)
  }

  /**
  * @instance
  * @memberof Map
  * @desc Set to
  * @function setTo
  * @param  {object} to Can be one of those formats
  *      { objectClass: 'place', {mapwize place object} }
  *      { objectClass: 'placeList', {mapwize placeList object} }
  *      { latitude, longitude, floor, venueId }
  */
  mapInstance.setTo = (to: any): void => {
    return mapInstance.searchDirections.setTo(to)
  }

  /**
  * @instance
  * @memberof Map
  * @desc Get the current direction mode
  * @function getMode
  * @param  {string} locale locale code like 'en' or 'fr'
  */
  mapInstance.getMode = (): any => {
    return mapInstance.searchDirections.getMode()
  }
  /**
  * @instance
  * @memberof Map
  * @desc Set the current direction mode
  * @function setMode
  * @param  {string} modeId
  */
  mapInstance.setMode = (modeId: string): void => {
    return mapInstance.searchDirections.setMode(modeId)
  }

  /**
  * @instance
  * @memberof Map
  * @desc Get the currently selected place object if any
  * @function getSelectedPlace
  * @param  {string} locale locale code like 'en' or 'fr'
  */
  mapInstance.getSelectedPlace = (): void => {
    return mapInstance.footerSelection.getSelectedPlace()
  }
  /**
  * @instance
  * @memberof Map
  * @desc Set the currently selected place
  * @function setSelectedPlace
  * @param  {object} place locale code like 'en' or 'fr'
  */
  mapInstance.setSelectedPlace = (place: any): void => {
    return mapInstance.footerSelection.setSelectedPlace(place)
  }

  /**
  * @instance
  * @memberof Map
  * @desc Set the locale of the UI interface. The locale need to be availble in the `scr/locales` folder.
  * @function setLocale
  * @param  {string} locale locale code like 'en' or 'fr'
  */
  mapInstance.setLocale = (newLocale: string): void => {
    const currentLocal = locale(newLocale)

    mapInstance.setPreferredLanguage(currentLocal)
    mapInstance.searchBar.refreshLocale()
    mapInstance.searchDirections.refreshLocale()
    mapInstance.searchResults.refreshLocale()
  }
  /**
  * @instance
  * @memberof Map
  * @desc Get the current locale of the UI interface.
  * @function getLocale
  * @returns {string}
  */
  mapInstance.getLocale = (): string => {
    return locale()
  }
  /**
  * @instance
  * @memberof Map
  * @desc Get all available locales for the UI interfaces. To add a locale, add the corresponding file in `src/loales`.
  * @function getLocales
  * @returns array<string>
  */
  mapInstance.getLocales = (): Array<string> => {
    return getLocales()
  }


  /**
  * @instance
  * @memberof Map
  * @desc Set the UI unit for the display fo the distances.
  * @function setUnit
  * @param  {string} unit code. 'm' and 'ft' are supported
  */
  mapInstance.setUnit = (newUnit: string): void => {
    unit(newUnit)
    mapInstance.footerDirections.refreshUnit()
  }
  /**
  * @instance
  * @memberof Map
  * @desc Get the current UI unit.
  * @function getUnit
  * @return  {string} unit code. 'm' and 'ft' are supported
  */
  mapInstance.getUnit = (): string => {
    return unit()
  }
  /**
  * @instance
  * @memberof Map
  * @desc Get all available units for the UI interfaces.
  * @function getUnits
  * @returns Array<string>
  */
  mapInstance.getUnits = (): Array<string> => {
    return getUnits()
  }

  const mapRemoveSave = mapInstance.remove;
  /**
  * @instance
  * @memberof Map
  * @desc Destroy the map view
  * @function remove
  */
  mapInstance.remove = (): void => {
    mapInstance.searchResults.destroy()
    mapInstance.searchBar.destroy()
    mapInstance.searchDirections.destroy()
    
    mapInstance.footerVenue.destroy()
    mapInstance.footerSelection.destroy()
    mapInstance.footerDirections.destroy()
    
    mapInstance.off('mapwize:click', onMapClick)
    mapInstance.off('mapwize:directionstart', onDirectionStart)
    $(mapInstance.getContainer()).removeClass('mapwizeui')
    
    mapRemoveSave()
  }
}

export { attachMethods  as default }
