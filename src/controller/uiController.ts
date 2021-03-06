import { apiKey, apiUrl, map } from 'mapwize'
import tippy from 'tippy.js'
import BottomView, { BottomViewState } from '../bottomview/bottomview'
import { buildCallbackInterceptor, DevCallbackInterceptor } from '../devCallbackInterceptor'
import FloorController, { FloorControllerState } from '../floorcontroller/floorcontroller'
import FollowUserButton from '../followbutton/followUserButton'
import { buildReportIssuesView } from '../issuesReporting/reportIssuesFactory'
import LanguageSelector, { LanguageSelectorState } from '../languageSelector/languageSelector'
import {
  lang_back,
  lang_change_language,
  lang_change_universe,
  lang_choose_destination,
  lang_choose_starting_point,
  lang_clipboard,
  lang_coordinates,
  lang_direction,
  lang_floor_controller,
  lang_menu,
  lang_search_global,
  lang_search_no_results
} from '../localizor/localizor'
import MapActionsDispatcher from '../mapActionsDispatcher'
import NavigationControl from '../navigationControls/navigationControls'
import SearchBar, { SearchBarState } from '../searchbars/search/searchBar'
import SearchContainer, { SearchContainerState } from '../searchbars/searchContainer'
import SearchDirectionBar, { SearchDirectionBarState } from '../searchbars/searchDirection/searchDirectionBar'
import SearchResultList, { SearchResultListState } from '../searchbars/searchResult/searchResultList/searchResultList'
import { ApiService } from '../services/apiService'
import { observeChange } from '../sizeObserver'
import style from '../style.scss'
import { Floor, FollowUserMode } from '../types/types'
import { UIOptions } from '../types/uioptions'
import UniverseSelector, { UniverseSelectorState } from '../universeSelector/universeSelector'
import { buildDirectionInfo, buildPlaceDetails, titleForLanguage } from '../utils/formatter'
import { UIControllerStore } from './uiControllerStore'
import attachUIMethods from './uiMethodsAttacher'

const defaultOptions: UIOptions = {
  apiKey: null,
  apiUrl: null,
  direction: null,
  floorControl: true,
  locationControl: false,
  mainColor: null,
  navigationControl: true,
  navigationControlOptions: {
    showCompass: true,
    showZoom: true,
    visualizePitch: true,
  },
  onDirectionQueryWillBeSent: (query: any): any => query,
  onDirectionWillBeDisplayed: (directionOptions: any, direction: any): any => directionOptions,
  shouldMoveToSelectedObject: (mwzObject: any, options: { centerOnElement: boolean; zoom: number }) => options,
  onSelectedChange: (): void => null,
  shouldShowInformationButtonFor: (mwzObject: any): boolean => false,
  onInformationButtonClick: (): void => null,
  onFollowButtonClickWithoutLocation: (): void => null,
  onSearchQueryWillBeSent: (searchOptions: any, searchString: string, channel: string): any => searchOptions,
  onSearchResultsWillBeDisplayed: (results: any): any => results,
  preferredLanguage: 'en',
  unit: 'm',
}

/**
 * @class Map
 * @augments external:MapwizeSDK_Map
 * @classdesc The class managing the map view and all attached UI.
 *      It can be created using the global `map` method.
 * @hideconstructor
 */
export default class UIController {
  private store: UIControllerStore
  private uiContainer: HTMLElement
  private shadowContainer: HTMLElement
  private mapContainer: HTMLElement
  private mapwizeMap: any
  private uiOptions: UIOptions
  private apiService: ApiService

  private searchContainer: SearchContainer
  private searchBar: SearchBar
  private searchDirectionBar: SearchDirectionBar
  private searchResultList: SearchResultList
  private languageSelector: LanguageSelector
  private universeSelector: UniverseSelector
  private followUserButton: FollowUserButton
  private floorController: FloorController
  private navigationController: NavigationControl
  private bottomView: BottomView

  public destroy(detroyMap: () => void) {
    detroyMap()
    this.uiContainer.remove()
    this.shadowContainer.remove()
    this.mapContainer.remove()
    this.store = null
    this.uiContainer = null
    this.mapwizeMap = null
    this.uiOptions = null
    this.apiService = null
    this.searchContainer = null
    this.searchDirectionBar = null
    this.searchResultList = null
    this.languageSelector = null
    this.universeSelector = null
    this.followUserButton = null
    this.floorController = null
    this.navigationController = null
    this.bottomView = null
  }

  public async init(mainContainer: HTMLElement, options: UIOptions): Promise<any> {
    mainContainer.classList.add('main-container')

    if (!options.mainColor) {
      options.mainColor = '#C51586'
    }

    if (!apiKey(options.apiKey)) {
      return Promise.reject(new Error('Missing "apiKey" in options'))
    }
    if (options.apiUrl) {
      apiUrl(options.apiUrl)
    }

    this.uiOptions = { ...defaultOptions, ...options }

    const callbackInterceptor = buildCallbackInterceptor(options)

    const styleEl = document.createElement('style')
    document.head.appendChild(styleEl)
    styleEl.innerHTML = ':root { --mapwize-main-color:' + options.mainColor + '; } .tippy-box[data-theme~=\'dark\'] {background-color: #111111;color: white;padding: 2px 8px;border-radius: 4px;font-size: 12px;font-family: Arial, Helvetica, sans-serif;}'

    this.uiContainer = document.createElement('div')
    this.uiContainer.classList.add('mwz-ui-container')

    this.mapContainer = document.createElement('div')
    this.mapContainer.classList.add('mwz-map-container')
    this.mapContainer.style.top = '0'
    this.mapContainer.style.left = '0'
    this.mapContainer.style.width = '100%'
    this.mapContainer.style.height = '100%'
    this.mapContainer.style.position = 'relative'
    this.mapContainer.style.outline = 'none'
    mainContainer.appendChild(this.mapContainer)

    this.apiService = new ApiService(options)
    const defaultState = await buildDefaultState(options, this.apiService)
    const mapInstance = await map({ ...options, container: this.mapContainer })
    this.store = new UIControllerStore(defaultState, this.render.bind(this), new MapActionsDispatcher(mapInstance, callbackInterceptor), this.apiService, callbackInterceptor)
    this.initMapwizeMap(mapInstance)

    observeChange(mapInstance, this.uiContainer, options.sizeBreakPoint)

    this.shadowContainer = document.createElement('div')
    this.shadowContainer.id = 'mwz-shadow-container'
    this.shadowContainer.style.top = '-100%'
    this.shadowContainer.style.left = '0'
    this.shadowContainer.style.width = '100%'
    this.shadowContainer.style.height = '100%'
    this.shadowContainer.style.zIndex = '2'
    this.shadowContainer.style.display = 'flex'
    this.shadowContainer.style.flexDirection = 'column'
    this.shadowContainer.style.justifyContent = 'space-between'
    this.shadowContainer.style.pointerEvents = 'none'
    this.shadowContainer.style.position = 'relative'
    this.shadowContainer.style.outline = 'none'

    mainContainer.appendChild(this.shadowContainer)
    var fantome = this.shadowContainer.attachShadow({ mode: 'open' })

    const styleTag = document.createElement('style')
    styleTag.innerHTML = style
    fantome.appendChild(styleTag)
    fantome.appendChild(this.uiContainer)

    this.buildUIComponents(this.uiContainer, options.mainColor, callbackInterceptor, mapInstance)
    this.renderDefault(defaultState)

    return attachUIMethods(mapInstance, this.store, this.apiService, this)
  }

  private initMapwizeMap(mapInstance: any): void {
    this.mapwizeMap = mapInstance
    this.mapwizeMap.on('mapwize:venuewillenter', (e: any) => {
      this.store.willEnterInVenue(e.venue)
    })
    this.mapwizeMap.on('mapwize:venueenter', (e: any) => {
      this.store.enterInVenue(e.venue)
    })
    this.mapwizeMap.on('mapwize:venueexit', (e: any) => {
      this.store.exitVenue(e.venue)
    })
    this.mapwizeMap.on('mapwize:followusermodechange', (e: any) => {
      this.followUserButton.setSelectedMode(e.mode)
    })

    this.mapwizeMap.on('mapwize:floorschange', (e: any) => {
      this.store.changeFloors(e.floors)
    })
    this.mapwizeMap.on('mapwize:floorwillchange', (e: any) => {
      this.store.loadFloor(e.to)
    })
    this.mapwizeMap.on('mapwize:floorchange', (e: any) => {
      this.store.changeFloor(e.floor)
    })

    this.mapwizeMap.on('mapwize:universeschange', (e: any) => {
      this.store.changeUniverses(e.universes)
    })
    this.mapwizeMap.on('mapwize:universewillchange', (e: any) => {
      this.store.loadUniverse(e.universe)
    })
    this.mapwizeMap.on('mapwize:universechange', (e: any) => {
      this.store.changeUniverse(e.universe)
    })

    this.mapwizeMap.on('mapwize:languageschange', (e: any) => {
      this.store.changeLanguages(e.languages)
    })
    this.mapwizeMap.on('mapwize:languagechange', (e: any) => {
      this.store.changeLanguage(e.language)
    })

    this.mapwizeMap.on('mapwize:modeschange', (e: any) => {
      this.store.changeDirectionModes(e.modes)
    })

    this.mapwizeMap.on('mapwize:error', (e: any) => {
      console.error(e)
    })

    this.mapwizeMap.on('mapwize:click', (e: any) => {
      if (e.place) {
        this.store.onPlaceClick(e.place)
      } else if (e.venue) {
        this.store.onVenueClick(e.venue)
      } else if (e.marker) {
      } else {
        this.store.onMapClick({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
          floor: e.floor,
        })
      }
    })
  }

  openReportIssue(mapwizeUIContainer: HTMLElement, venue: any, placeDetails: any, userInfo: any, language: string): void {
    this.apiService
      .getUserInfo()
      .then((u) => {
        const alert = buildReportIssuesView(venue, placeDetails, u, language, this.uiOptions.mainColor)
        mapwizeUIContainer.appendChild(alert)
      })
      .catch((e) => {
        const alert = buildReportIssuesView(venue, placeDetails, null, language, this.uiOptions.mainColor)
        mapwizeUIContainer.appendChild(alert)
      })
  }

  private buildUIComponents(uiContainer: HTMLElement, mainColor: string, callbackInterceptor: DevCallbackInterceptor, mapInstance: any): void {
    this.searchBar = new SearchBar({
      onDirectionClick: () => {
        this.store.directionButtonClick()
      },
      onMenuClick: callbackInterceptor.onMenuButtonClick,
      onSearchTextFocus: () => {
        this.store.searchFocus()
      },
      onSearchTextBlur: () => {
        this.store.searchBlur()
      },
      onSearchTextChange: (text) => {
        this.store.searchQueryChange(text)
      },
      onBackClick: () => {
        this.store.searchBackButtonClick()
      },
    })

    this.searchDirectionBar = new SearchDirectionBar(
      {
        onSelectedModeChange: (mode): void => {
          this.store.changeDirectionMode(mode)
        },
        onBackButtonClick: () => {
          this.store.directionBackButtonClick()
        },
        onSwapButtonClick: () => {
          this.store.swapFromAndTo()
        },
        onFromQueryChange: (query) => {
          this.store.directionSearchFromQueryChange(query)
        },
        onToQueryChange: (query) => {
          this.store.directionSearchToQueryChange(query)
        },
        onFromBlur: () => {
          this.store.directionFromBlur()
        },
        onToBlur: () => {
          this.store.directionToBlur()
        },
        onFromFocus: () => {
          this.store.directionFromFocus()
        },
        onToFocus: () => {
          this.store.directionToFocus()
        },
      },
      this.uiOptions.mainColor
    )

    this.searchResultList = new SearchResultList(
      {
        onCurrentLocationSelected: () => this.store.selectCurrentLocation(),
        onResultSelected: (searchResult, universe) => this.store.selectSearchResult(searchResult, universe),
      },
      callbackInterceptor
    )

    this.searchContainer = new SearchContainer(this.searchBar, this.searchDirectionBar, this.searchResultList)
    uiContainer.appendChild(this.searchContainer.getHtmlElement())

    const inBetweenLeft = document.createElement('div')
    inBetweenLeft.classList.add('mwz-left-container')

    const inBetweenRight = document.createElement('div')
    inBetweenRight.classList.add('mwz-right-container')

    const inBetween = document.createElement('div')
    inBetween.classList.add('mwz-in-between')
    uiContainer.appendChild(inBetween)

    if (this.uiOptions.navigationControl) {
      this.navigationController = new NavigationControl(mapInstance, { ...this.uiOptions.navigationControlOptions })
      inBetweenRight.appendChild(this.navigationController.getHtmlElement())
    }

    if (this.uiOptions.floorControl) {
      this.floorController = new FloorController((floor) => {
        this.mapwizeMap.setFloor(floor)
      })
      inBetweenRight.appendChild(this.floorController.getHtmlElement())
    }

    if (this.uiOptions.locationControl) {
      this.followUserButton = new FollowUserButton(() => {
        if (!mapInstance.getUserLocation()) {
          callbackInterceptor.onFollowButtonClickWithoutLocation()
        }
        const mode = mapInstance.getFollowUserMode()
        if (mode === FollowUserMode.None) {
          mapInstance.setFollowUserMode(FollowUserMode.FollowUser)
        } else if (mode === FollowUserMode.FollowUser && mapInstance.getUserHeading()) {
          mapInstance.setFollowUserMode(FollowUserMode.FollowUserAndHeading)
        } else if (mode === FollowUserMode.FollowUserAndHeading) {
          mapInstance.setFollowUserMode(FollowUserMode.FollowUser)
        }
      })
      inBetweenRight.appendChild(this.followUserButton.getHTMLElement())
    }

    this.universeSelector = new UniverseSelector({
      onClick: () => this.store.toggleUniverseSelector(),
      onUniverseSelected: (universe) => {
        this.mapwizeMap.setUniverse(universe._id)
      },
    })
    inBetweenLeft.appendChild(this.universeSelector.getHtmlElement())

    this.languageSelector = new LanguageSelector({
      onClick: () => this.store.toggleLanguageSelector(),
      onLanguageSelected: (language) => {
        this.mapwizeMap.setLanguage(language)
      },
    })
    inBetweenLeft.appendChild(this.languageSelector.getHtmlElement())

    inBetween.appendChild(inBetweenLeft)
    inBetween.appendChild(inBetweenRight)

    this.bottomView = new BottomView(
      {
        onExpandClick: () => {
          this.store.toggleBottomViewExpand()
        },
        onDirectionClick: () => this.store.directionButtonClick(),
        onInformationClick: (placeDetails) => callbackInterceptor.onInformationButtonClick(placeDetails),
        onShareClick: (target, sharelink) => {
          if (navigator.share) {
            navigator
              .share({
                title: 'Place sharing',
                url: sharelink,
              })
              .catch(() => {
                navigator.clipboard.writeText(sharelink)
                const tip = tippy(target, {
                  trigger: '',
                  theme: 'dark',
                  content: lang_clipboard(this.uiOptions.preferredLanguage),
                  duration: [300, 2000],
                  placement: 'top',
                })
                tip.show()
                setTimeout(() => {
                  tip.destroy()
                }, 2000)
              })
          } else {
            navigator.clipboard.writeText(sharelink)
            const tip = tippy(target, {
              trigger: '',
              theme: 'dark',
              content: lang_clipboard(this.uiOptions.preferredLanguage),
              duration: [300, 2000],
              placement: 'top',
            })
            tip.show()
            setTimeout(() => {
              tip.destroy()
            }, 2000)
          }
        },
        onWebsiteClick: (website) => {
          const win = window.open(website, '_blank')
          win.focus()
        },
        onPhoneClick: (phone) => {
          window.location.href = 'tel://' + phone
        },
        onPlaceClick: (place: any) => {
          this.mapwizeMap.centerOnPlace(place)
        },
        onDirectionToPlaceClick: (place: any) => {
          this.store.selectPlaceAndGoDirection(place)
        },
        onReportIssueClick: (place: any) => {
          this.openReportIssue(this.uiContainer, this.mapwizeMap.getVenue(), place, null, this.store.state.uiControllerState.preferredLanguage)
        },
      },
      callbackInterceptor,
      mainColor
    )
    uiContainer.appendChild(this.bottomView.getHtmlElement())
  }

  private renderDefault(state: MapwizeUIState): void {
    this.universeSelector.renderDefault(state.universeSelectorState)
    this.languageSelector.renderDefault(state.languageSelectorState)
    this.searchContainer.renderDefault(state.searchContainerState)
    this.searchBar.renderDefault(state.searchBarState)
    this.searchDirectionBar.renderDefault(state.searchDirectionBarState)
    this.searchResultList.renderDefault(state.searchResultListState)
    this.floorController?.renderDefault(state.floorControllerState)
    this.bottomView.renderDefault(state.bottomViewState)
    this.navigationController.renderDefault(state.uiControllerState)

    this.handleMargin(state)
  }

  private render(oldState: MapwizeUIState, state: MapwizeUIState): void {
    this.universeSelector.render(oldState.universeSelectorState, state.universeSelectorState)
    this.languageSelector.render(oldState.languageSelectorState, state.languageSelectorState)
    this.searchContainer.render(oldState.searchContainerState, state.searchContainerState)
    this.searchBar.render(oldState.searchBarState, state.searchBarState)
    this.searchDirectionBar.render(oldState.searchDirectionBarState, state.searchDirectionBarState)
    this.searchResultList.render(oldState.searchResultListState, state.searchResultListState)
    this.floorController?.render(oldState.floorControllerState, state.floorControllerState)
    this.bottomView.render(oldState.bottomViewState, state.bottomViewState)
    this.navigationController.render(oldState.uiControllerState, state.uiControllerState)

    this.handleMargin(state)
  }

  private handleMargin(state: MapwizeUIState): void {
    if (!state.bottomViewState.hidden && !this.uiContainer.classList.contains('mwz-small-screen')) {
      this.mapwizeMap.setLeftMargin(410)
    } else {
      this.mapwizeMap.setLeftMargin(0)
    }

    if (state.uiControllerState.status === 'inDirection' && this.uiContainer.classList.contains('mwz-small-screen')) {
      this.mapwizeMap.setTopMargin(140)
      this.mapwizeMap.setBottomMargin(50)
    } else {
      this.mapwizeMap.setTopMargin(0)
      this.mapwizeMap.setBottomMargin(0)
    }
  }
}

export interface UIControllerState {
  status: 'default' | 'inSearch' | 'inFromSearch' | 'inToSearch' | 'inDirection'
  venue?: any
  lastExitedVenue?: any
  selectedContent?: any
  directionFromPoint?: any
  directionToPoint?: any
  directionMode?: any
  direction?: any
  floors: Floor[]
  preferredLanguage: string
  language: string
  unit: string
}

export interface MapwizeUIState {
  uiControllerState: UIControllerState
  universeSelectorState: UniverseSelectorState
  languageSelectorState: LanguageSelectorState
  searchContainerState: SearchContainerState
  searchBarState: SearchBarState
  searchResultListState: SearchResultListState
  searchDirectionBarState: SearchDirectionBarState
  floorControllerState: FloorControllerState
  bottomViewState: BottomViewState
}

const directionObjectToMapwizeObject = async (what: any, apiService: ApiService): Promise<any> => {
  if (what.placeId) {
    const place = await apiService.getPlace(what.placeId)
    place.objectClass = 'place'
    return place
  } else {
    return Promise.resolve(what)
  }
}

const buildDefaultState = async (options: UIOptions, apiService: ApiService): Promise<MapwizeUIState> => {
  options.preferredLanguage = options.preferredLanguage || options.locale || 'en'
  const state: MapwizeUIState = {
    uiControllerState: {
      status: 'default',
      floors: [],
      preferredLanguage: options.preferredLanguage,
      language: options.preferredLanguage,
      unit: options.unit ? options.unit : 'm',
    },
    universeSelectorState: buildDefaultUniverseSelectorState(options),
    languageSelectorState: buildDefaultLanguageSelectorState(options),
    searchContainerState: {
      isInSearch: false,
    },
    searchBarState: {
      isInSearch: false,
      isHidden: false,
      searchQuery: '',
      searchPlaceholder: lang_search_global(options.preferredLanguage),
      directionButtonHidden: true,
      menuTooltipMessage: lang_menu(options.preferredLanguage),
      backTooltipMessage: lang_back(options.preferredLanguage),
      directionTooltipMessage: lang_direction(options.preferredLanguage),
    },
    searchResultListState: {
      isInDirectionSearch: false,
      isHidden: true,
      showCurrentLocation: undefined,
      noResultLabel: lang_search_no_results(options.preferredLanguage),
    },
    searchDirectionBarState: {
      isHidden: true,
      fromPlaceholder: lang_choose_starting_point(options.preferredLanguage),
      toPlaceholder: lang_choose_destination(options.preferredLanguage),
      fromQuery: '',
      toQuery: '',
      modes: [],
      selectedMode: null,
      isInSearch: false,
      isToFocus: false,
      isFromFocus: false,
    },
    floorControllerState: buildDefaultFloorControllerState(options),
    bottomViewState: {
      expanded: false,
      hidden: true,
      language: options.preferredLanguage,
    },
  }

  if (options.centerOnPlaceId) {
    const details = await apiService.getPlaceDetails(options.centerOnPlaceId)
    const place = await apiService.getPlace(details._id)
    state.bottomViewState.content = buildPlaceDetails(details, state.uiControllerState.preferredLanguage)
    state.bottomViewState.hidden = false
    state.uiControllerState.selectedContent = { ...place, objectClass: 'place' }
  } else if (options.direction) {
    const [from, to] = await Promise.all([directionObjectToMapwizeObject(options.direction.from, apiService), directionObjectToMapwizeObject(options.direction.to, apiService)])

    if (to.objectClass === 'place') {
      const details = await apiService.getPlaceDetails(to._id)
      state.bottomViewState.content = buildPlaceDetails(details, state.uiControllerState.preferredLanguage)
    }

    state.uiControllerState.status = 'inDirection'
    state.uiControllerState.direction = options.direction
    state.uiControllerState.directionFromPoint = from
    state.uiControllerState.directionToPoint = to
    state.uiControllerState.directionMode = options.direction.mode

    state.bottomViewState.directionContent = buildDirectionInfo(options.direction, state.uiControllerState.unit)
    state.searchDirectionBarState.fromQuery =
      from.objectClass === 'place' ? titleForLanguage(from, state.uiControllerState.preferredLanguage) : lang_coordinates(state.uiControllerState.preferredLanguage)
    state.searchDirectionBarState.toQuery =
      to.objectClass === 'place' ? titleForLanguage(to, state.uiControllerState.preferredLanguage) : lang_coordinates(state.uiControllerState.preferredLanguage)

    options.centerOnVenueId = options.direction.from.venueId
  }

  return Promise.resolve(state)
}

const buildDefaultUniverseSelectorState = (options: UIOptions): UniverseSelectorState => {
  return {
    isExpanded: false,
    isHidden: true,
    universes: [],
    selectedUniverse: null,
    tooltipMessage: lang_change_universe(options.preferredLanguage),
  }
}
const buildDefaultLanguageSelectorState = (options: UIOptions): LanguageSelectorState => {
  return {
    isExpanded: false,
    isHidden: true,
    languages: [],
    selectedLanguage: options.preferredLanguage,
    tooltipMessage: lang_change_language(options.preferredLanguage),
  }
}
const buildDefaultFloorControllerState = (options: UIOptions): FloorControllerState => {
  return {
    floors: [],
    selectedFloor: null,
    loadingFloor: null,
    tooltipMessage: lang_floor_controller(options.preferredLanguage),
  }
}
