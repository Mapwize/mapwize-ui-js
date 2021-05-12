import produce from 'immer'
import { WritableDraft } from 'immer/dist/internal'
import { DevCallbackInterceptor } from '../devCallbackInterceptor'
import {
  lang_available_locale,
  lang_back,
  lang_change_language,
  lang_change_universe,
  lang_choose_destination,
  lang_choose_starting_point,
  lang_coordinates,
  lang_current_location,
  lang_destination,
  lang_direction,
  lang_entering_venue,
  lang_floor_controller,
  lang_search_global,
  lang_search_no_results,
  lang_search_venue,
  lang_start,
  Locale,
} from '../localizor/localizor'
import MapActionsDispatcher from '../mapActionsDispatcher'
import { ApiService } from '../services/apiService'
import { DirectionMode, Floor, SearchResult, Universe } from '../types/types'
import {
  buildDirectionError,
  buildDirectionInfo,
  buildFloorDisplays,
  buildLanguageDisplay,
  buildLanguageDisplays,
  buildPlaceDetails,
  buildPlacelistDetails,
  buildSearchResult,
  titleForLanguage,
} from '../utils/formatter'
import { MapwizeUIState } from './uiController'

export class UIControllerStore {
  private render: (oldState: MapwizeUIState, newState: MapwizeUIState) => void
  public state: MapwizeUIState
  private mapActionsDispatcher: MapActionsDispatcher
  private devCallbackInterceptor: DevCallbackInterceptor
  private apiService: ApiService

  constructor(
    defaultState: MapwizeUIState,
    render: (oldState: MapwizeUIState, newState: MapwizeUIState) => void,
    mapActionsDispatcher: MapActionsDispatcher,
    apiService: ApiService,
    devCallbackInterceptor: DevCallbackInterceptor
  ) {
    this.render = render
    this.state = defaultState
    this.mapActionsDispatcher = mapActionsDispatcher
    this.apiService = apiService
    this.devCallbackInterceptor = devCallbackInterceptor
  }

  public getLocale(): Locale {
    return lang_available_locale().find((l) => l.code === this.state.uiControllerState.preferredLanguage)
  }

  public getAvailableLocales(): Locale[] {
    return lang_available_locale()
  }

  public async setLocale(locale: string) {
    if (
      !lang_available_locale()
        .map((l) => l.code)
        .includes(locale)
    ) {
      return
    }
    let mapLanguage = this.state.uiControllerState.language
    if (this.state.uiControllerState.venue) {
      if (this.state.uiControllerState.venue.supportedLanguages.includes(locale)) {
        mapLanguage = locale
      }
    }
    const nextState = await produce(this.state, async (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.uiControllerState.preferredLanguage = locale
      draftState.universeSelectorState.tooltipMessage = lang_change_universe(locale)
      draftState.languageSelectorState.tooltipMessage = lang_change_language(locale)
      draftState.floorControllerState.tooltipMessage = lang_floor_controller(locale)
      draftState.searchBarState.backTooltipMessage = lang_back(locale)
      draftState.searchBarState.directionTooltipMessage = lang_direction(locale)
      draftState.searchResultListState.noResultLabel = lang_search_no_results(locale)
      if (this.state.uiControllerState.venue) {
        draftState.searchBarState.searchPlaceholder = lang_search_venue(locale, titleForLanguage(this.state.uiControllerState.venue, mapLanguage))
      } else {
        draftState.searchBarState.searchPlaceholder = lang_search_global(locale)
      }
      draftState.searchDirectionBarState.fromPlaceholder = lang_choose_starting_point(locale)
      draftState.searchDirectionBarState.toPlaceholder = lang_choose_destination(locale)
      if (this.state.uiControllerState.directionFromPoint) {
        if (this.state.uiControllerState.directionFromPoint.objectClass === 'place') {
          draftState.searchDirectionBarState.fromQuery = titleForLanguage(this.state.uiControllerState.directionFromPoint, mapLanguage)
        } else {
          draftState.searchDirectionBarState.fromQuery = lang_coordinates(locale)
        }
      }
      if (this.state.uiControllerState.directionToPoint) {
        if (this.state.uiControllerState.directionToPoint.objectClass === 'place' || this.state.uiControllerState.directionToPoint.objectClass === 'placeList') {
          draftState.searchDirectionBarState.toQuery = titleForLanguage(this.state.uiControllerState.directionToPoint, mapLanguage)
        } else {
          draftState.searchDirectionBarState.toQuery = lang_coordinates(locale)
        }
      }
      draftState.bottomViewState.language = locale
      if (this.state.uiControllerState.selectedContent) {
        if (this.state.uiControllerState.selectedContent.objectClass === 'place') {
          const details = await this.apiService.getPlaceDetails(this.state.uiControllerState.selectedContent._id)
          draftState.bottomViewState.content = buildPlaceDetails(details, mapLanguage)
        }
        if (this.state.uiControllerState.selectedContent.objectClass === 'placeList') {
          const places = await this.apiService.getPlacesForPlacelist(this.state.uiControllerState.selectedContent._id)
          draftState.bottomViewState.content = buildPlacelistDetails(this.state.uiControllerState.selectedContent, places, mapLanguage, locale)
        }
      }
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
    this.mapActionsDispatcher.setLanguage(mapLanguage)
  }

  public setUnit(unit: string) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.uiControllerState.unit = unit
      if (this.state.uiControllerState.direction) {
        draftState.bottomViewState.directionContent = buildDirectionInfo(this.state.uiControllerState.direction, unit)
      }
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public getUnit(): string {
    return this.state.uiControllerState.unit
  }

  public getUnits(): string[] {
    return ['m', 'ft']
  }

  public setLanguage(language: string) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.uiControllerState.language = language
      draftState.universeSelectorState.tooltipMessage = lang_change_universe(this.state.uiControllerState.preferredLanguage)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public toggleUniverseSelector() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.universeSelectorState.isExpanded = !this.state.universeSelectorState.isExpanded
      draftState.languageSelectorState.isExpanded = false
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public changeSelectedUniverse(universe: Universe) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.universeSelectorState.isExpanded = false
      draftState.universeSelectorState.selectedUniverse = universe
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public toggleLanguageSelector() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.languageSelectorState.isExpanded = !this.state.languageSelectorState.isExpanded
      draftState.universeSelectorState.isExpanded = false
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public directionButtonClick() {
    if (!this.state.uiControllerState.venue) {
      this.mapActionsDispatcher.fireError('Must be inside venue to enter in direction')
      return
    }
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      this.defaultToDirection(draftState)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
    this.tryToStartDirection()
  }

  public directionFromBlur() {
    setTimeout(() => {
      const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
        draftState.searchDirectionBarState.isFromFocus = false
        if (!this.state.searchDirectionBarState.isFromFocus && !this.state.searchDirectionBarState.isToFocus) {
          draftState.searchResultListState.isHidden = true
          draftState.searchResultListState.results = null
          draftState.searchResultListState.universes = []
          draftState.searchResultListState.currentUniverse = undefined
          draftState.searchResultListState.showCurrentLocation = undefined
          draftState.searchContainerState.isInSearch = false
        }
      })
      const oldState = this.state
      this.state = nextState
      this.render(oldState, nextState)
    }, 250)
  }

  public directionToBlur() {
    setTimeout(() => {
      const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
        draftState.searchDirectionBarState.isToFocus = false
        if (!this.state.searchDirectionBarState.isFromFocus && !this.state.searchDirectionBarState.isToFocus) {
          draftState.searchResultListState.isHidden = true
          draftState.searchResultListState.results = null
          draftState.searchResultListState.universes = []
          draftState.searchResultListState.currentUniverse = undefined
          draftState.searchResultListState.showCurrentLocation = undefined
          draftState.searchContainerState.isInSearch = false
        }
      })
      const oldState = this.state
      this.state = nextState
      this.render(oldState, nextState)
    }, 250)
  }

  public directionFromFocus() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchDirectionBarState.isFromFocus = true
      draftState.uiControllerState.status = 'inFromSearch'
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public directionToFocus() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchDirectionBarState.isToFocus = true
      draftState.uiControllerState.status = 'inToSearch'
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public directionBackButtonClick() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      this.directionToDefault(draftState)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public changeDirectionModes(modes: DirectionMode[]) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchDirectionBarState.modes = modes

      if (
        !draftState.uiControllerState.directionMode ||
        (draftState.uiControllerState.directionMode && !modes.map((mode) => mode._id).includes(draftState.uiControllerState.directionMode?._id))
      ) {
        draftState.searchDirectionBarState.selectedMode = modes[0]
        draftState.uiControllerState.directionMode = modes[0]
      } else {
        draftState.searchDirectionBarState.selectedMode = this.state.uiControllerState.directionMode
      }
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public changeDirectionMode(mode: DirectionMode) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchDirectionBarState.selectedMode = mode
      draftState.uiControllerState.directionMode = mode
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)

    this.tryToStartDirection()
  }

  public searchBackButtonClick() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      this.searchToDefault(draftState)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public searchResultsChange(results: SearchResult[]) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchResultListState.results = results
      draftState.searchResultListState.showCurrentLocation = undefined
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public searchFocus() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      this.defaultToSearch(draftState)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public searchBlur() {
    setTimeout(() => {
      if (!this.state.searchDirectionBarState.isFromFocus && !this.state.searchDirectionBarState.isToFocus) {
        const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
          this.searchToDefault(draftState)
        })
        const oldState = this.state
        this.state = nextState
        this.render(oldState, nextState)
      }
    }, 500)
  }

  public async searchQueryChange(query: string) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchBarState.searchQuery = query
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)

    let searchResults: any
    if (this.state.uiControllerState.venue) {
      const searchParams = this.devCallbackInterceptor.onSearchQueryWillBeSent(
        {
          query,
          objectClass: ['place', 'placeList'],
          venueId: this.state.uiControllerState.venue._id,
        },
        query,
        'search-field'
      )
      if (query.length === 0) {
        searchResults = await this.apiService.getMainSearches(this.state.uiControllerState.venue._id)
      } else {
        searchResults = await this.apiService.search(searchParams)
        searchResults = searchResults.hits
      }
    } else {
      const searchParams = this.devCallbackInterceptor.onSearchQueryWillBeSent({ query, objectClass: ['venue'] }, query, 'search-field')
      searchResults = await this.apiService.search(searchParams)
      searchResults = searchResults.hits
    }
    const nextStateAsync = await produce(this.state, async (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchResultListState.results = buildSearchResult(
        this.devCallbackInterceptor.onSearchResultsWillBeDisplayed(searchResults),
        this.state.uiControllerState.language,
        this.state.uiControllerState.preferredLanguage
      )
      draftState.searchResultListState.universes = this.state.universeSelectorState.universes
      draftState.searchResultListState.currentUniverse = this.state.universeSelectorState.selectedUniverse
      draftState.searchResultListState.showCurrentLocation = undefined
    })
    const oldStateAsync = this.state
    this.state = nextStateAsync
    this.render(oldStateAsync, nextStateAsync)
  }

  public async directionSearchFromQueryChange(query: string) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchContainerState.isInSearch = true
      draftState.searchDirectionBarState.isInSearch = true
      draftState.searchDirectionBarState.fromQuery = query
      draftState.searchResultListState.isHidden = false
      draftState.searchResultListState.isInDirectionSearch = true
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)

    const searchParams = this.devCallbackInterceptor.onDirectionQueryWillBeSent({
      query,
      objectClass: ['place'],
      universeId: this.state.universeSelectorState.selectedUniverse._id,
      venueId: this.state.uiControllerState.venue._id,
    })
    let searchResults: any
    if (query.length === 0) {
      searchResults = await this.apiService.getMainFroms(this.state.uiControllerState.venue._id)
    } else {
      searchResults = await this.apiService.search(searchParams)
      searchResults = searchResults.hits
    }

    const nextStateAsync = await produce(this.state, async (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchResultListState.results = buildSearchResult(
        this.devCallbackInterceptor.onSearchResultsWillBeDisplayed(searchResults),
        this.state.uiControllerState.language,
        this.state.uiControllerState.preferredLanguage
      )
      draftState.searchResultListState.showCurrentLocation = this.mapActionsDispatcher.hasIndoorLocation()
        ? lang_current_location(this.state.uiControllerState.preferredLanguage)
        : undefined
      draftState.searchResultListState.universes = []
      draftState.searchResultListState.currentUniverse = undefined
    })
    const oldStateAsync = this.state
    this.state = nextStateAsync
    this.render(oldStateAsync, nextStateAsync)
  }

  public async directionSearchToQueryChange(query: string) {
    this.generic((draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchContainerState.isInSearch = true
      draftState.searchDirectionBarState.isInSearch = true
      draftState.searchDirectionBarState.toQuery = query
      draftState.searchResultListState.isHidden = false
      draftState.searchResultListState.isInDirectionSearch = true
    })

    const searchParams = this.devCallbackInterceptor.onDirectionQueryWillBeSent({
      query,
      universeId: this.state.universeSelectorState.selectedUniverse._id,
      objectClass: ['place', 'placeList'],
      venueId: this.state.uiControllerState.venue._id,
    })
    let searchResults: any
    if (query.length === 0) {
      searchResults = await this.apiService.getMainSearches(this.state.uiControllerState.venue._id)
    } else {
      searchResults = await this.apiService.search(searchParams)
      searchResults = searchResults.hits
    }

    const nextStateAsync = await produce(this.state, async (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchResultListState.results = buildSearchResult(
        this.devCallbackInterceptor.onSearchResultsWillBeDisplayed(searchResults),
        this.state.uiControllerState.language,
        this.state.uiControllerState.preferredLanguage
      )
      draftState.searchResultListState.showCurrentLocation = undefined
      draftState.searchResultListState.universes = []
      draftState.searchResultListState.currentUniverse = undefined
    })
    const oldStateAsync = this.state
    this.state = nextStateAsync
    this.render(oldStateAsync, nextStateAsync)
  }

  // TODO use it everywhere
  private generic(producer: (draftState: WritableDraft<MapwizeUIState>) => void) {
    const nextState = produce(this.state, producer)
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public selectSearchResult(result: SearchResult, universe?: Universe | undefined) {
    if (this.state.searchDirectionBarState.isFromFocus) {
      this.selectFrom(result)
    } else if (this.state.searchDirectionBarState.isToFocus) {
      this.devCallbackInterceptor.onSelectedChange(result, { channel: 'search', searchQuery: this.state.searchDirectionBarState.toQuery })
      this.selectTo(result)
    } else if (this.state.uiControllerState.status === 'inSearch') {
      this.devCallbackInterceptor.onSelectedChange(result, { channel: 'search', searchQuery: this.state.searchBarState.searchQuery })
      this.selectDefaultSearchResult(result, universe)
    }
  }

  private selectDefaultSearchResult(result: SearchResult, universe?: Universe | undefined) {
    if (result.objectClass === 'place') {
      this.selectPlace(result)
      this.mapActionsDispatcher.centerOnPlace(result)
      if (universe) {
        this.mapActionsDispatcher.setUniverse(universe._id)
      }
    }
    if (result.objectClass === 'placeList') {
      this.selectPlacelist(result)
      // TODO Verify this.mapActionsDispatcher.selectPlacelist(result, { channel: 'search', searchQuery: this.state.searchBarState.searchQuery })
    }
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchResultListState.isHidden = true
      draftState.searchBarState.isInSearch = false
      draftState.searchBarState.searchQuery = ''
      draftState.searchContainerState.isInSearch = false
      draftState.uiControllerState.status = 'default'
      draftState.searchResultListState.results = null
      draftState.searchResultListState.universes = []
      draftState.searchResultListState.currentUniverse = undefined
      draftState.searchResultListState.showCurrentLocation = undefined
      /*if (result.objectClass === 'placeList') {
        draftState.bottomViewState.content = buildPlacelist(result, this.state.uiControllerState.preferredLanguage)
        draftState.bottomViewState.hidden = false
        draftState.uiControllerState.selectedContent = result
        draftState.languageSelectorState.isHidden = true
        draftState.universeSelectorState.isHidden = true
      }*/
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)

    if (result.objectClass === 'venue') {
      this.mapActionsDispatcher.centerOnVenue(result)
    }
    /*if (result.objectClass === 'placeList') {
      this.mapActionsDispatcher.selectPlacelist(result)
      this.mapActionsDispatcher.centerOnPlacelist(result)
    }*/
  }

  public selectCurrentLocation() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.uiControllerState.directionFromPoint = this.mapActionsDispatcher.getUserLocation()
      draftState.searchDirectionBarState.fromQuery = lang_current_location(this.state.uiControllerState.preferredLanguage)
      this.setNextDirectionStep(draftState)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)

    this.tryToStartDirection()
  }

  private async selectFrom(result: any) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      this.setFromSelected(draftState, result)
      this.setNextDirectionStep(draftState)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)

    this.tryToStartDirection()
  }

  private async selectTo(result: any) {
    if (result.objectClass === 'place') {
      this.selectPlace(result)
    }
    if (result.objectClass === 'placeList') {
      this.selectPlacelist(result)
    }
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      this.setToSelected(draftState, result)
      this.setNextDirectionStep(draftState)
      /*if (result.objectClass === 'placeList') {
        draftState.bottomViewState.content = buildPlacelist(result, this.state.uiControllerState.preferredLanguage)
        draftState.bottomViewState.hidden = false
        draftState.uiControllerState.selectedContent = result
        draftState.languageSelectorState.isHidden = true
        draftState.universeSelectorState.isHidden = true
      }*/
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)

    this.tryToStartDirection()
  }

  public willEnterInVenue(venue: any) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchBarState.searchPlaceholder = lang_entering_venue(this.state.uiControllerState.preferredLanguage, venue.name)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public enterInVenue(venue: any) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      if (this.state.uiControllerState.direction) {
        if (!this.state.uiControllerState.lastExitedVenue || venue._id === this.state.uiControllerState.lastExitedVenue._id) {
          this.enterVenueInDirection(draftState)
        } else {
          this.directionToDefault(draftState)
        }
      }
      if (this.state.uiControllerState.selectedContent) {
        this.devCallbackInterceptor.onSelectedChange(this.state.uiControllerState.selectedContent)
        if (!this.state.uiControllerState.lastExitedVenue || venue._id === this.state.uiControllerState.lastExitedVenue._id) {
          this.enterVenueInSelectedContent(draftState)
          if (this.state.uiControllerState.selectedContent.objectClass === 'place') {
            this.mapActionsDispatcher.selectPlace(this.state.uiControllerState.selectedContent, true)
          } else {
            this.mapActionsDispatcher.selectPlacelist(this.state.uiControllerState.selectedContent)
          }
        } else {
          draftState.uiControllerState.selectedContent = null
          draftState.bottomViewState.content = null
          draftState.bottomViewState.expanded = false
          draftState.bottomViewState.hidden = true
          draftState.languageSelectorState.isHidden = draftState.languageSelectorState.languages.length <= 1
          draftState.universeSelectorState.isHidden = draftState.universeSelectorState.universes.length <= 1
          this.mapActionsDispatcher.unselectContent()
        }
      }
      draftState.searchBarState.searchPlaceholder = lang_search_venue(
        this.state.uiControllerState.preferredLanguage,
        titleForLanguage(venue, this.state.uiControllerState.language)
      )
      draftState.uiControllerState.venue = venue
      draftState.searchBarState.directionButtonHidden = false
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public exitVenue(venue: any) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchBarState.searchPlaceholder = lang_search_global(this.state.uiControllerState.preferredLanguage)
      draftState.uiControllerState.lastExitedVenue = venue
      draftState.uiControllerState.venue = null
      draftState.searchBarState.directionButtonHidden = true
      if (this.state.uiControllerState.direction) {
        this.directionToExitVenue(draftState)
      } else if (this.state.uiControllerState.selectedContent) {
        this.directionToDefault(draftState)
        this.selectedContentToExitVenue(draftState)
      } else {
        this.directionToDefault(draftState)
        this.searchToDefault(draftState)
      }
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public changeFloors(floors: Floor[]) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.uiControllerState.floors = floors
      draftState.floorControllerState.floors = buildFloorDisplays(floors, this.state.uiControllerState.language)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public loadFloor(floor: number) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.floorControllerState.loadingFloor = floor
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public changeFloor(floor: number) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.floorControllerState.loadingFloor = null
      draftState.floorControllerState.selectedFloor = floor
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public changeUniverses(universes: Universe[]) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.universeSelectorState.universes = universes
      draftState.universeSelectorState.isHidden = universes.length <= 1
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public loadUniverse(universe: Universe) {
    // TODO
  }

  public changeUniverse(universe: Universe) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.universeSelectorState.selectedUniverse = universe
      draftState.universeSelectorState.isExpanded = false
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public changeLanguages(languages: string[]) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.languageSelectorState.languages = buildLanguageDisplays(languages)
      draftState.languageSelectorState.isHidden = languages.length <= 1
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public changeLanguage(language: string) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.languageSelectorState.selectedLanguage = buildLanguageDisplay(language)
      draftState.languageSelectorState.isExpanded = false
      draftState.uiControllerState.language = language
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public selectContent(content: any) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.uiControllerState.selectedContent = content
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  public async externalSelectPlace(place: any): Promise<void> {
    this.selectPlace(place)
    return this.mapActionsDispatcher.centerOnPlace(place).then(() => {
      this.devCallbackInterceptor.onSelectedChange(place, { channel: 'method' })
    })
  }
  public async externalSelectPlacelist(placelist: any): Promise<void> {
    this.selectPlacelist(placelist)
    return this.mapActionsDispatcher.centerOnPlacelist(placelist).then(() => {
      this.devCallbackInterceptor.onSelectedChange(placelist, { channel: 'method' })
    })
  }

  public onPlaceClick(place: any) {
    place.objectClass = 'place'
    if (this.state.uiControllerState.status === 'default') {
      this.selectPlace(place)
      this.devCallbackInterceptor.onSelectedChange(place, { channel: 'click' })
    }
    if (this.state.uiControllerState.status === 'inFromSearch') {
      this.selectFrom(place)
      return
    }
    if (this.state.uiControllerState.status === 'inToSearch') {
      this.selectTo(place)
      this.devCallbackInterceptor.onSelectedChange(place, { channel: 'click' })
      return
    }
    if (this.state.uiControllerState.status === 'inDirection') {
      return
    }
  }

  public onVenueClick(venue: any) {
    this.mapActionsDispatcher.centerOnVenue(venue)
  }

  public onMapClick(coordinate: any) {
    if (this.state.uiControllerState.status === 'default') {
      const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
        draftState.uiControllerState.selectedContent = null
        draftState.bottomViewState.content = null
        draftState.bottomViewState.expanded = false
        draftState.bottomViewState.hidden = true
        draftState.languageSelectorState.isHidden = draftState.languageSelectorState.languages.length <= 1
        draftState.universeSelectorState.isHidden = draftState.universeSelectorState.universes.length <= 1
      })
      const oldState = this.state
      this.state = nextState
      this.render(oldState, nextState)
      this.mapActionsDispatcher.unselectContent()
      this.devCallbackInterceptor.onSelectedChange(null)
    } else if (this.state.uiControllerState.status === 'inFromSearch' && this.state.searchDirectionBarState.isFromFocus) {
      const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
        this.setFromCoordinateSelected(draftState, coordinate)
        this.setNextDirectionStep(draftState)
      })
      const oldState = this.state
      this.state = nextState
      this.render(oldState, nextState)
      this.tryToStartDirection()
    } else if (this.state.uiControllerState.status === 'inToSearch' && this.state.searchDirectionBarState.isToFocus) {
      const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
        this.setToCoordinateSelected(draftState, coordinate)
        this.setNextDirectionStep(draftState)
      })
      const oldState = this.state
      this.state = nextState
      this.render(oldState, nextState)
      this.tryToStartDirection()
    }
  }

  public toggleBottomViewExpand() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.bottomViewState.expanded = !draftState.bottomViewState.expanded
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
  }

  private async selectPlace(place: any) {
    const details = await this.apiService.getPlaceDetails(place._id)

    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      if (this.state.uiControllerState.venue) {
        draftState.bottomViewState.hidden = false
        draftState.languageSelectorState.isHidden = true
        draftState.universeSelectorState.isHidden = true
      }
      draftState.bottomViewState.content = buildPlaceDetails(details, this.state.uiControllerState.language)
      draftState.uiControllerState.selectedContent = place
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
    this.mapActionsDispatcher.selectPlace(place, false)
  }

  public async selectPlaceAndGoDirection(place: any) {
    await this.selectPlace(place)
    this.directionButtonClick()
    this.tryToStartDirection()
  }

  private async selectPlacelist(placelist: any) {
    const places = await this.apiService.getPlacesForPlacelist(placelist._id)

    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      if (this.state.uiControllerState.venue) {
        draftState.bottomViewState.hidden = false
        draftState.languageSelectorState.isHidden = true
        draftState.universeSelectorState.isHidden = true
      }
      draftState.bottomViewState.content = buildPlacelistDetails(placelist, places, this.state.uiControllerState.language, this.state.uiControllerState.preferredLanguage)
      draftState.uiControllerState.selectedContent = placelist
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
    if (this.state.uiControllerState.status !== 'inDirection') {
      this.mapActionsDispatcher.selectPlacelist(placelist)
    }
  }

  public setFrom(from: any) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.uiControllerState.directionFromPoint = from
      if (from.objectClass === 'place' || from.objectClass === 'placeList') {
        draftState.searchDirectionBarState.fromQuery = titleForLanguage(from, draftState.uiControllerState.language)
      } else {
        draftState.searchDirectionBarState.fromQuery = lang_coordinates(this.state.uiControllerState.preferredLanguage)
      }
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
    this.tryToStartDirection()
  }

  public getFrom(): any {
    return this.state.uiControllerState.directionFromPoint
  }

  public setTo(to: any) {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.uiControllerState.directionToPoint = to
      if (to.objectClass === 'place' || to.objectClass === 'placeList') {
        draftState.searchDirectionBarState.toQuery = titleForLanguage(to, draftState.uiControllerState.language)
      } else {
        draftState.searchDirectionBarState.toQuery = lang_coordinates(this.state.uiControllerState.preferredLanguage)
      }
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
    this.tryToStartDirection()
  }

  public getTo(): any {
    return this.state.uiControllerState.directionToPoint
  }

  public setMode(modeId: string) {
    const mode = this.state.searchDirectionBarState.modes.find((m) => m._id === modeId)
    if (!mode) {
      console.error('Mode does not exist in this venue')
      return
    }
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      draftState.searchDirectionBarState.selectedMode = mode
      draftState.uiControllerState.directionMode = mode
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)

    this.tryToStartDirection()
  }

  private setFromSelected(draftState: WritableDraft<MapwizeUIState>, from: any) {
    draftState.uiControllerState.directionFromPoint = from
    draftState.searchDirectionBarState.fromQuery = titleForLanguage(from, draftState.uiControllerState.language)
  }

  private setFromCoordinateSelected(draftState: WritableDraft<MapwizeUIState>, from: any) {
    draftState.uiControllerState.directionFromPoint = from
    draftState.searchDirectionBarState.fromQuery = lang_coordinates(this.state.uiControllerState.preferredLanguage)
  }

  private setToSelected(draftState: WritableDraft<MapwizeUIState>, to: any) {
    draftState.uiControllerState.directionToPoint = to
    draftState.searchDirectionBarState.toQuery = titleForLanguage(to, draftState.uiControllerState.language)
  }

  private setToCoordinateSelected(draftState: WritableDraft<MapwizeUIState>, to: any) {
    draftState.uiControllerState.directionToPoint = to
    draftState.searchDirectionBarState.toQuery = lang_coordinates(this.state.uiControllerState.preferredLanguage)
  }

  private setNextDirectionStep(draftState: WritableDraft<MapwizeUIState>) {
    if (!draftState.uiControllerState.directionFromPoint) {
      draftState.searchDirectionBarState.isFromFocus = true
      draftState.searchResultListState.results = null
      draftState.searchResultListState.universes = []
      draftState.searchResultListState.currentUniverse = undefined
      draftState.searchResultListState.showCurrentLocation = undefined
      draftState.uiControllerState.status = 'inFromSearch'
    } else if (!draftState.uiControllerState.directionToPoint) {
      draftState.searchDirectionBarState.isToFocus = true
      draftState.searchResultListState.results = null
      draftState.searchResultListState.universes = []
      draftState.searchResultListState.currentUniverse = undefined
      draftState.searchResultListState.showCurrentLocation = undefined
      draftState.uiControllerState.status = 'inToSearch'
    } else {
      draftState.searchResultListState.isInDirectionSearch = false
      draftState.searchResultListState.isHidden = true
      draftState.searchResultListState.results = null
      draftState.searchResultListState.universes = []
      draftState.searchResultListState.currentUniverse = undefined
      draftState.searchResultListState.showCurrentLocation = undefined
      draftState.searchContainerState.isInSearch = false
      draftState.uiControllerState.status = 'inDirection'
    }
  }

  public swapFromAndTo() {
    const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
      const oldFrom = this.state.uiControllerState.directionFromPoint
      const oldTo = this.state.uiControllerState.directionToPoint
      const oldFromQuery = this.state.searchDirectionBarState.fromQuery
      const oldToQuery = this.state.searchDirectionBarState.toQuery
      if (oldTo.objectClass === 'placeList') {
        draftState.uiControllerState.directionFromPoint = null
        draftState.searchDirectionBarState.fromQuery = ''
      } else {
        draftState.uiControllerState.directionFromPoint = oldTo
        draftState.searchDirectionBarState.fromQuery = oldToQuery
      }
      draftState.uiControllerState.directionToPoint = oldFrom
      draftState.searchDirectionBarState.toQuery = oldFromQuery
      if (oldFrom.objectClass === 'place') {
        this.selectPlace(oldFrom)
      }
      this.setNextDirectionStep(draftState)
    })
    const oldState = this.state
    this.state = nextState
    this.render(oldState, nextState)
    this.tryToStartDirection()
  }

  public async tryToStartDirection() {
    if (this.state.uiControllerState.status !== 'default' && this.state.uiControllerState.directionFromPoint && this.state.uiControllerState.directionToPoint) {
      try {
        const direction = await this.apiService.getDirection({
          from: this.buildDirectionPoint(this.state.uiControllerState.directionFromPoint),
          to: this.buildDirectionPoint(this.state.uiControllerState.directionToPoint),
          modeId: this.state.uiControllerState.directionMode._id,
        })
        const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
          this.setNextDirectionStep(draftState)
          draftState.uiControllerState.direction = direction
          draftState.bottomViewState.directionContent = buildDirectionInfo(direction, this.state.uiControllerState.unit)
          draftState.bottomViewState.hidden = false
          //draftState.bottomViewState.expanded = false
        })
        const oldState = this.state
        this.state = nextState
        this.render(oldState, nextState)

        this.mapActionsDispatcher.unselectContent()
        this.startDirection(direction, {})
      } catch (e) {
        const nextState = produce(this.state, (draftState: WritableDraft<MapwizeUIState>) => {
          this.setNextDirectionStep(draftState)
          draftState.uiControllerState.direction = null
          draftState.bottomViewState.directionContent = buildDirectionError(this.state.uiControllerState.preferredLanguage)
          draftState.bottomViewState.hidden = false
          //draftState.bottomViewState.expanded = false
        })
        const oldState = this.state
        this.state = nextState
        this.render(oldState, nextState)
        this.mapActionsDispatcher.stopDirection()
      }
    }
  }

  public startDirection(direction: any, directionOptions: any) {
    let fromLabel = lang_start(this.state.uiControllerState.preferredLanguage)
    let toLabel = lang_destination(this.state.uiControllerState.preferredLanguage)
    if (this.state.uiControllerState.directionFromPoint.objectClass === 'place' || this.state.uiControllerState.directionFromPoint.objectClass === 'placeList') {
      fromLabel = this.state.searchDirectionBarState.fromQuery
    }
    if (this.state.uiControllerState.directionToPoint.objectClass === 'place' || this.state.uiControllerState.directionToPoint.objectClass === 'placeList') {
      toLabel = this.state.searchDirectionBarState.toQuery
    }
    this.mapActionsDispatcher.startDirection(direction, directionOptions, fromLabel, toLabel)
  }

  private buildDirectionPoint(point: any): any {
    if (point.objectClass === 'place') {
      return {
        placeId: point._id,
      }
    } else if (point.objectClass === 'placeList') {
      return {
        placeListId: point._id,
      }
    } else {
      return {
        latitude: point.latitude,
        longitude: point.longitude,
        floor: point.floor,
        venueId: this.state.uiControllerState.venue._id,
      }
    }
  }

  private defaultToSearch(draftState: WritableDraft<MapwizeUIState>) {
    draftState.searchContainerState.isInSearch = true
    draftState.searchBarState.isInSearch = true
    draftState.searchBarState.searchQuery = ''
    draftState.searchResultListState.isHidden = false
    draftState.searchResultListState.isInDirectionSearch = false
    draftState.uiControllerState.status = 'inSearch'
  }

  private searchToDefault(draftState: WritableDraft<MapwizeUIState>) {
    draftState.searchResultListState.isHidden = true
    draftState.searchResultListState.results = null
    draftState.searchResultListState.universes = []
    draftState.searchResultListState.currentUniverse = undefined
    draftState.searchResultListState.showCurrentLocation = undefined
    draftState.searchBarState.isInSearch = false
    draftState.searchBarState.searchQuery = ''
    draftState.searchContainerState.isInSearch = false
    draftState.uiControllerState.status = 'default'
  }

  private defaultToDirection(draftState: WritableDraft<MapwizeUIState>) {
    draftState.searchBarState.searchQuery = ''
    draftState.searchBarState.isHidden = true
    draftState.searchBarState.isInSearch = false
    draftState.searchResultListState.isHidden = false
    draftState.searchResultListState.results = null
    draftState.searchResultListState.universes = []
    draftState.searchResultListState.currentUniverse = undefined
    draftState.searchResultListState.showCurrentLocation = undefined
    draftState.searchDirectionBarState.isHidden = false
    // draftState.searchDirectionBarState.isFromFocus = true
    draftState.universeSelectorState.isHidden = true
    draftState.languageSelectorState.isHidden = true
    // draftState.uiControllerState.status = 'inFromSearch'
    if (this.mapActionsDispatcher.hasIndoorLocation()) {
      draftState.searchDirectionBarState.fromQuery = lang_current_location(this.state.uiControllerState.preferredLanguage)
      draftState.uiControllerState.directionFromPoint = this.mapActionsDispatcher.getUserLocation()
    }
    if (this.state.uiControllerState.selectedContent) {
      draftState.searchDirectionBarState.toQuery = titleForLanguage(draftState.uiControllerState.selectedContent, draftState.uiControllerState.language)
      draftState.uiControllerState.directionToPoint = draftState.uiControllerState.selectedContent
      // draftState.bottomViewState.hidden = true
      // this.mapActionsDispatcher.unselectContent()
    }
    this.setNextDirectionStep(draftState)
  }

  private directionToDefault(draftState: WritableDraft<MapwizeUIState>) {
    draftState.uiControllerState.status = 'default'
    draftState.searchBarState.isHidden = false
    draftState.searchBarState.isInSearch = false
    draftState.searchResultListState.isHidden = true
    draftState.searchResultListState.results = null
    draftState.searchResultListState.universes = []
    draftState.searchResultListState.currentUniverse = undefined
    draftState.searchResultListState.showCurrentLocation = undefined
    draftState.searchDirectionBarState.isHidden = true
    draftState.searchDirectionBarState.fromQuery = ''
    draftState.searchDirectionBarState.toQuery = ''
    draftState.searchContainerState.isInSearch = false
    draftState.uiControllerState.directionFromPoint = null
    draftState.uiControllerState.directionToPoint = null
    draftState.uiControllerState.direction = null
    if (this.state.uiControllerState.selectedContent) {
      draftState.bottomViewState.hidden = false
      draftState.languageSelectorState.isHidden = true
      draftState.universeSelectorState.isHidden = true
      if (this.state.uiControllerState.selectedContent.objectClass === 'place') {
        this.mapActionsDispatcher.selectPlace(this.state.uiControllerState.selectedContent, true)
      }
      if (this.state.uiControllerState.selectedContent.objectClass === 'placeList') {
        this.mapActionsDispatcher.selectPlacelist(this.state.uiControllerState.selectedContent)
      }
    } else {
      draftState.universeSelectorState.isHidden = false
      draftState.languageSelectorState.isHidden = false
      draftState.bottomViewState.hidden = true
    }
    draftState.bottomViewState.directionContent = null
    this.mapActionsDispatcher.stopDirection()
  }

  private directionToExitVenue(draftState: WritableDraft<MapwizeUIState>) {
    draftState.searchBarState.isHidden = false
    draftState.searchBarState.isInSearch = false
    draftState.searchResultListState.isHidden = true
    draftState.searchResultListState.results = null
    draftState.searchResultListState.universes = []
    draftState.searchResultListState.currentUniverse = undefined
    draftState.searchResultListState.showCurrentLocation = undefined
    draftState.searchDirectionBarState.isHidden = true
    draftState.searchContainerState.isInSearch = false
    draftState.bottomViewState.hidden = true
  }

  private enterVenueInDirection(draftState: WritableDraft<MapwizeUIState>) {
    draftState.searchBarState.isHidden = true
    draftState.searchBarState.isInSearch = true
    draftState.searchDirectionBarState.isHidden = false
    draftState.searchContainerState.isInSearch = false
    draftState.bottomViewState.hidden = false
    setTimeout(
      () =>
        this.startDirection(this.state.uiControllerState.direction, {
          centerOnStart: !this.state.uiControllerState.lastExitedVenue,
          showStartingFloor: false,
        }),
      100
    )
  }

  private selectedContentToExitVenue(draftState: WritableDraft<MapwizeUIState>) {
    draftState.bottomViewState.hidden = true
  }

  private enterVenueInSelectedContent(draftState: WritableDraft<MapwizeUIState>) {
    draftState.bottomViewState.hidden = false
  }
}
