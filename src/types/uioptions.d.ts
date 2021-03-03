export interface UIOptions {
  /**
   * Your Mapwize Api Key.
   * Default is null
   */
  apiKey?: string
  /**
   * If you are hosting your version of the Mapwize server, you have to use this options in order to fetch the data from your server.
   * Default is null
   */
  apiUrl?: string
  /**
   * The mainColor allows you to change the default Mapwize color in the entire UI
   * Default is '#C51586'
   */
  mainColor?: string
  /**
   * The preferredLanguage is used to display the UserInterface.
   * It is also use as default language when entering in a Venue if this language is available
   * Default is 'en'
   */
  preferredLanguage?: string
  /**
   * The unit used to display distance
   * Default is 'm'
   */
  unit?: string
  /**
   * The floorControl flag allows you to enable the Floor Controller. If false, the Floor Controller will be hidden
   * Default is true
   */
  floorControl?: boolean
  /**
   * The navigationControl flag allows you to enable the Navigation Controller. If false, the Navigation Controller will be hidden
   */
  navigationControl?: boolean
  /**
   * The navigationControlOptions allows you to choose which component you want to show.
   * Default is {
   *   showCompass: true,
   *   showZoom: true,
   *   visualizePitch: true
   * }
   */
  navigationControlOptions?: {
    showCompass?: boolean
    showZoom?: boolean
    visualizePitch?: boolean
  }
  /**
   * The locationControl flag allows you to enable the Location Controller. If false, the Location Controller will be hidden
   */
  locationControl?: boolean
  /**
   * The direction options allows you to instantiate the map in direction mode
   */
  direction?: any
  /**
   * The centerOnVenueId initializes the camera centered on the venue
   */
  centerOnVenueId?: string
  /**
   * The centerOnPlaceId initializes the camera centered on the place
   */
  centerOnPlaceId?: string
  /**
   * The restrictContentToOrganizationId limits the venues displayed to the venues that belong to this organization
   */
  restrictContentToOrganizationId?: string
  /**
   * The restrictContentToVenueId limits the venues displayed to this venue only
   */
  restrictContentToVenueId?: string
  /**
   * The restrictContentToVenueIds limits the venues displayed to the venues that belongs to this list
   */
  restrictContentToVenueIds?: string[]
  /**
   * The sizeBreakPoint allows you to define the width limit that is used to display Mobile or Desktop views
   */
  sizeBreakPoint?: number
  /**
   * Called before sending the direction query. You can modify the query on the fly
   */
  onDirectionQueryWillBeSent?: (query: string) => string
  /**
   * Called before displaying the direction. You can modify the directionOptions and the direction object on the fly
   */
  onDirectionWillBeDisplayed?: (directionOptions: any, direction: any) => any
  /**
   * Called anytime the selected content changes
   */
  onSelectedChange?: () => void
  /**
   * Called before selecting a place or a placelist. You can decide if you want to show the information button in the selected content view
   */
  shouldShowInformationButtonFor?: (mwzObject: any) => boolean
  /**
   * Called when the user click on the information button.
   */
  onInformationButtonClick?: (placeDetails: any) => void
  /**
   * Called when the user click on the Location Control without having a Location
   */
  onFollowButtonClickWithoutLocation?: () => void
  /**
   * Called before sending the search query. You can modify the query on the fly
   */
  onSearchQueryWillBeSent?: (searchOptions: any, searchString: string, channel: string) => any
  /**
   * Called before displaying a result in the search result list. You can use this method to change the design of the result item
   */
  onObjectWillBeDisplayedInSearch?: (template: HTMLElement, mwzObject: any) => HTMLElement
  /**
   * Called before displaying all the result in the result list. You can use this method to filter the result before they are displayed
   */
  onSearchResultsWillBeDisplayed?: (results: any) => any
  /**
   * Called when an object is selected. You can use this method to choose if you want to move the camera to center on the element
   */
  shouldMoveToSelectedObject?: (mwzObject: any, options: { centerOnElement: boolean; zoom: number }) => { centerOnElement: boolean; zoom: number }
  /**
   * Called before displaying the details view. You can use this method to change on the fly the content that you want to display.
   * The first attribute is the object that has been selected.
   * The second attribute is an object like:
   * {
   *   photosView: HTMLElement    // The view that contains the photos
   *   smallView: HTMLElement     // The view displayed by default on mobile. It won't be displayed on desktop view
   *   largeView: HTMLElement     // The view displayed by default on desktop view. It will be displayed on mobile when the user click on the bottom view
   * }
   * You can update this object as you want and return it. Your views will be displayed.
   */
  onDetailsWillBeDisplayed?: (
    mwzObject: any,
    templates: { photosView: HTMLElement; largeView: HTMLElement; smallView: HTMLElement }
  ) => { photosView: HTMLElement; largeView: HTMLElement; smallView: HTMLElement }
  /**
   * Called when the user click on the menu button
   */
  onMenuButtonClick?: () => void
}
