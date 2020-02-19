import * as $ from 'jquery'
import { find, forEach, template } from 'lodash'

import { languages, uiConfig } from '../../config'
import { translate } from '../../translate'

const venueTemplate = template(require('./venue.html'))

import { DefaultControl } from '../../control'

export class FooterVenue extends DefaultControl {

  constructor (mapInstance: any) {
    super(mapInstance)

    this._container = $('<div />')

    this.listen('click', '.mwz-universe-item', this._onUniverseItemClick.bind(this))
    this.listen('click', '.mwz-language-item', this._onLanguageItemClick.bind(this))
    this.listen('mouseleave', '#mwz-universe-button, #mwz-language-button', this._onLanguageUniversButtonsMouseLeave.bind(this))

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

  public refreshLocale () {
    if (!$(this.map._container).hasClass(uiConfig.SMALL_SCREEN_CLASS)) {
      this._container.find('#mwz-language-button').attr('data-original-title', translate('change_venue_language'))
      this._container.find('#mwz-universe-button').attr('data-original-title', translate('change_venue_universe'))
      this._container.find('#mwz-universe-button, #mwz-language-button').tooltip({ container: this.map._container })
    }
  }
  // ---------------------------------------
  // Privates methods
  // ---------------------------------------

  private _initializeControl (universeWillChange = false) {
    const venue = this._map.getVenue()

    const venueLanguages: object[] = []
    const venueCurrentLanguage = find(languages, ['code', this.map.getLanguage()]).name

    forEach(venue.supportedLanguages, (language) => {
      const languageName = find(languages, ['code', language])
      venueLanguages.push(languageName)
    })

    this._container.html(venueTemplate({
      currentLanguage: venueCurrentLanguage,
      currentUniverse: this.map.getUniverse(),
      languages: venueLanguages,
      universeWillChange,
      universes: venue.accessibleUniverses,
    }))

    this._container.find('#mwz-language-button, #mwz-universe-button').dropdown('update')

    this.refreshLocale()
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
  private _onLanguageUniversButtonsMouseLeave (e: JQueryEventObject) {
    this._container.find('#' + e.currentTarget.id).tooltip('hide')
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
