import { Locale } from '../localizor/localizor'
import { ApiService } from '../services/apiService'
import { UIControllerStore } from './uiControllerStore'

const attach = (mapInstance: any, uiControllerStore: UIControllerStore, apiService: ApiService): any => {
  /**
   * @instance
   * @memberof Map
   * @desc Activates the direction mode. This displays the directions header with the from and to fields.
   * @function setDirectionMode
   * @returns {object}
   */
  mapInstance.setDirectionMode = (): void => {
    uiControllerStore.directionButtonClick()
  }

  /**
   * @instance
   * @memberof Map
   * @desc Activates the search mode. This displays the search header with the search field.
   * @function setSearchMode
   * @returns {object}
   */
  mapInstance.setSearchMode = (): void => {
    uiControllerStore.directionBackButtonClick()
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
    return uiControllerStore.setFrom(from)
  }
  /**
   * @instance
   * @memberof Map
   * @desc Get the `from` field of the direction header
   * @function getFrom
   * @returns {object?} from Can be one of those formats
   *      { objectClass: 'place', {mapwize place object} }
   *      { objectClass: 'placeList', {mapwize placeList object} }
   *      { objectClass: 'userLocation' }
   *      { latitude, longitude, floor, venueId }
   */
  mapInstance.getFrom = (): any => {
    return uiControllerStore.getFrom()
  }

  /**
   * @instance
   * @memberof Map
   * @desc Set the `to` field of the direction header
   * @function setTo
   * @param  {object} to Can be one of those formats
   *      { objectClass: 'place', {mapwize place object} }
   *      { objectClass: 'placeList', {mapwize placeList object} }
   *      { latitude, longitude, floor, venueId }
   */
  mapInstance.setTo = (to: any): void => {
    return uiControllerStore.setTo(to)
  }
  /**
   * @instance
   * @memberof Map
   * @desc Set the `to` field of the direction header
   * @function getTo
   * @returns  {object?} to Can be one of those formats
   *      { objectClass: 'place', {mapwize place object} }
   *      { objectClass: 'placeList', {mapwize placeList object} }
   *      { latitude, longitude, floor, venueId }
   */
  mapInstance.getTo = (): any => {
    return uiControllerStore.getTo()
  }

  /**
   * @instance
   * @memberof Map
   * @desc Get the current direction mode
   * @function getMode
   */
  mapInstance.getMode = (): any => {
    const direction = mapInstance.getDirection()
    if (direction) {
      return direction.mode
    }
    return uiControllerStore.state.uiControllerState.directionMode
  }
  /**
   * @instance
   * @memberof Map
   * @desc Set the current direction mode
   * @function setMode
   * @param  {string} modeId
   */
  mapInstance.setMode = (modeId: string): void => {
    return uiControllerStore.setMode(modeId)
  }

  /**
   * @instance
   * @memberof Map
   * @desc Get the currently selected place or placeList object if any
   * @function getSelected
   */
  mapInstance.getSelected = (): void => {
    return uiControllerStore.state.uiControllerState.selectedContent
  }

  /**
   * @instance
   * @memberof Map
   * @desc Set the currently selected place or placeList
   * @function setSelected
   * @param {object|string} mwzElement must be either an object (place or placeList) or a id (place or placeList). Use `null` to unselect element
   * @param {boolean} centerOnElement=true
   */
  mapInstance.setSelected = (mwzElement: any): Promise<void> => {
    if (typeof mwzElement === 'string') {
      return apiService
        .getPlace(mwzElement)
        .then((place: any) => {
          place.objectClass = 'place'
          return place
        })
        .then((element: any) => {
          uiControllerStore.onPlaceClick(element)
        })
        .catch(() => {
          return apiService
            .getPlacelist(mwzElement)
            .then((placeList: any) => {
              placeList.objectClass = 'placeList'
              return placeList
            })
            .then((element: any) => {
              uiControllerStore.selectPlacelist(element)
            })
            .catch(() => {
              return Promise.reject(new Error('String parameter must be either a place id or a placeList id'))
            })
        })
    }
    uiControllerStore.onPlaceClick(mwzElement)
  }

  /**
   * @instance
   * @memberof Map
   * @desc Set the locale of the UI interface. The locale need to be availble in the `scr/locales` folder.
   * @function setLocale
   * @param  {string} locale locale code like 'en' or 'fr'
   */
  mapInstance.setLocale = (newLocale: string): void => {
    const currentLocal = newLocale

    mapInstance.setPreferredLanguage(currentLocal)
    uiControllerStore.setLocale(currentLocal)
  }
  /**
   * @instance
   * @memberof Map
   * @desc Get the current locale of the UI interface.
   * @function getLocale
   * @returns {string} locale code like 'en' or 'fr'
   */
  mapInstance.getLocale = (): Locale => {
    return uiControllerStore.getLocale()
  }
  /**
   * @instance
   * @memberof Map
   * @desc Get all available locales for the UI interfaces. To add a locale, add the corresponding file in `src/locales`.
   * @function getLocales
   * @returns array<string> locale codes like 'en' or 'fr'
   */
  mapInstance.getLocales = (): Locale[] => {
    return uiControllerStore.getAvailableLocales()
  }

  /**
   * @instance
   * @memberof Map
   * @desc Set the UI unit for the display fo the distances.
   * @function setUnit
   * @param  {string} unit code. 'm' and 'ft' are supported
   */
  mapInstance.setUnit = (newUnit: string): void => {
    uiControllerStore.setUnit(newUnit)
  }
  /**
   * @instance
   * @memberof Map
   * @desc Get the current UI unit.
   * @function getUnit
   * @return  {string} unit code. 'm' and 'ft' are supported
   */
  mapInstance.getUnit = (): string => {
    return uiControllerStore.getUnit()
  }
  /**
   * @instance
   * @memberof Map
   * @desc Get all available units for the UI interfaces.
   * @function getUnits
   * @returns Array<string>
   */
  mapInstance.getUnits = (): string[] => {
    return uiControllerStore.getUnits()
  }

  const mapRemoveSave = mapInstance.remove.bind(mapInstance)
  /**
   * @instance
   * @memberof Map
   * @desc Destroy the map view
   * @function remove
   */
  mapInstance.remove = (): void => {
    // TODO Etienne si t'as une idée de comment faire le ménage, sinon c'est pas grave

    mapRemoveSave()
  }

  return mapInstance
}

export default attach
