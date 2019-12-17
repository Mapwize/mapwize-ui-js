import * as $ from 'jquery'
import { find, template } from 'lodash'

const venueTemplate = template(require('./venue.html'))

import { DefaultControl } from '../../control'

export class FooterVenue extends DefaultControl {

  constructor (mapInstance: any) {
    super(mapInstance)

    this._container = $('<div />')

    this.listen('click', '.mwz-universe-item', this._onUniverseItemClick.bind(this))
    this.listen('click', '.mwz-language-item', this._onLanguageItemClick.bind(this))

    this._onVenueRefresh = this._onVenueRefresh.bind(this)
    this._onUniverseWillChange = this._onUniverseWillChange.bind(this)
    this._onUniverseChange = this._onUniverseChange.bind(this)
    this._onLanguageChange = this._onLanguageChange.bind(this)
  }
  public remove (): void {
    return null
  }

  public getDefaultPosition (): string {
    return 'bottom-left'
  }

  public onAdd (map: any) {
    this._map = map
    this.isOnMap = true

    this._map.on('mapwize:venuerefresh', this._onVenueRefresh)
    this._map.on('mapwize:universewillchange', this._onUniverseWillChange)
    this._map.on('mapwize:universechange', this._onUniverseChange)
    this._map.on('mapwize:languagechange', this._onLanguageChange)

    this._initializeControl()

    return this._container.get(0)
  }
  public onRemove () {
    if (this._map) {
      this._map.off('mapwize:venuerefresh', this._onVenueRefresh)
      this._map.off('mapwize:universewillchange', this._onUniverseWillChange)
      this._map.off('mapwize:universechange', this._onUniverseChange)
      this._map.off('mapwize:languagechange', this._onLanguageChange)
    }

    this._container.remove()
    this._map = undefined
    this.isOnMap = false
  }

  public needToBeDisplayed (venue: any): boolean {
    return venue.accessibleUniverses.length > 1 || venue.supportedLanguages.length > 1
  }

  // ---------------------------------------
  // Privates methods
  // ---------------------------------------

  private _initializeControl (universeWillChange = false) {
    const venue = this._map.getVenue()

    this._container.html(venueTemplate({
      currentLanguage: this.map.getLanguage(),
      currentUniverse: this.map.getUniverse(),
      languages: venue.supportedLanguages,
      universeWillChange,
      universes: venue.accessibleUniverses,
    }))

    this._container.find('#mwz-language-button, #mwz-universe-button').dropdown('update')
  }

  private _onLanguageItemClick (e: JQueryEventObject) {
    const selectedLanguage = $(e.currentTarget).data('language')
    this.map.setLanguage(selectedLanguage)
  }
  private _onUniverseItemClick (e: JQueryEventObject) {
    const selectedId = $(e.currentTarget).data('universe')
    const venue = this._map.getVenue()
    const selectedUniverse = find(venue.accessibleUniverses, { _id: selectedId })
    this.map.setUniverse(selectedUniverse._id)
  }

  private _onVenueRefresh (e: any): void {
    this._initializeControl()
  }
  private _onUniverseWillChange (e: any): void {
    // this._initializeControl(true) // TODO: add loading animation in html
  }
  private _onUniverseChange (e: any): void {
    this._initializeControl()
  }
  private _onLanguageChange (e: any): void {
    this._initializeControl()
  }
}
